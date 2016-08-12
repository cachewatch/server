const fragment = '_escaped_fragment_';
const phantomjs = '/var/lib/openshift/56bff5de89f5cf50b50001c5/app-root/data/phantomjs/bin/phantomjs';
const spawn = require('child_process').spawn;
const config = GLOBAL.path.join(__dirname, '..', 'config.json');
const script = GLOBAL.path.join(__dirname, '..', 'script.js');

var check = function (req, re, next) {
	req.params.name = req.url.substring(1);

	GLOBAL.db.model('plan').findByUser(req.user).exec( (err, doc) => {
		if(err || GLOBAL._.isEmpty(doc) ){
			return next(err || new Error('No more cache'));
		}

		next(doc);
	});
};

var adds = function (is, req, res, next) {
	if(GLOBAL.util.isError(is) ){
		return next(is);
	}

	var data = { 
		error : [], 
		plan : is,
		parts : GLOBAL.url.parse(req.params.name, true)
	};

	// Remove the _escaped_fragment_ query parameter
	if (data.parts.query && data.parts.query.hasOwnProperty(fragment)) {
		if (data.parts.query[fragment] && !GLOBAL._.isArray(data.parts.query[fragment])){
			data.parts.hash = '#!' + data.parts.query[fragment];
		}
		delete data.parts.query[fragment];
		delete data.parts.search;
	}
	// Bing was seen accessing a URL like /?&_escaped_fragment_=
	delete data.parts.query[''];
	data.finals = decodeURIComponent(GLOBAL.url.format(data.parts));
	// Query Esto debe ser un find or create
	GLOBAL.db.model('cache').findByUrl(data.finals, req.user, (err, doc, isNew) => {
		if(err){
			return next(err);	
		}

		//if the original server had a chunked encoding, we should remove it since we aren't sending a chunked response
		res.removeHeader('Transfer-Encoding');
		//if the original server wanted to keep the connection alive, let's close it
		res.removeHeader('Connection');
		//getting 502s for sites that return this header
		res.removeHeader('X-Content-Security-Policy');
		
		res.status(202);
		res.set('text/html');
		res.type('text/html');

		data.cache = doc;
		data.getFile = doc && ( doc.testTime(req.user.time) || isNew );

		next(data);
	});
};

var getPage = function (data, req, res, next) {
	if(GLOBAL.util.isError(data) || !data.getFile ){
		return next(data);
	}

	data.cache.putFile((err, grs) => {
		if(err){
			return next(err);
		}
		var ls = spawn(phantomjs, ['--config=' + config, script, data.cache.url ]);
		grs.on('end', err => {
			if(err){
				return next(err);
			}
			next(data);
		});
		ls.stdout.pipe(grs);
		ls.stderr.on('data', (d) => {
			console.log(d);
			next(d);
		});
	});
};

var cobrar = function (data, req, res, next) {
	if(GLOBAL.util.isError(data) || !data.getFile ){
		return next(data);
	}

	GLOBAL.db.model('plan').findByUserAndPay(req.user).exec( err => {
		if(err ){
			return next(err);
		}

		next(data);
	});
};

var send = function (data, req, res, next) {
	if(!GLOBAL._.isObject(data.cache) || GLOBAL.util.isError(data) ){
		return next(data);
	}

	data.cache.getFile( (err, gs) => {
		if(err){
			return next(err);
		}
		res.header('Last-Modified', ( new Date( data.cache.date ) ).toString() );
		res.contentType( 'text/html' );
		gs.stream(true).pipe(res);
	});
};

module.exports = [ check, adds, getPage, cobrar, send ];