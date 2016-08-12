var langs = require('../../www/script/lang');

module.exports.lang = function (req, res, next) {
	//res.removeHeader('X-Powered-By');
	res.setHeader('Access-Control-Allow-Origin', req.headers.origin ||  '*' );
	res.setHeader('Access-Control-Allow-Methods', 'X-Requested-With, GET, POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader('Access-Control-Allow-Headers', process.env.CACHE_WATCH + ', Origin, X-Requested-With, Content-Type, Accept, Authorization');

	if(req.method === 'OPTIONS'){
		return res.status(202).send('');
	}

	res.setHeader('Connection', 'keep-alive');
	if ( /MSIE/i.test(req.headers['user-agent']) ){
		res.setHeader('X-UA-Compatible', 'IE=Edge');
	}

	var gives = [];
	if( GLOBAL._.isString(req.query.lang) ){
		gives.push( req.query.lang.toLowerCase().substring(0,2) );
	}

	var header = req.acceptsLanguages().reverse();
	for (var i = header.length - 1; i >= 0; i--){
		if( GLOBAL._.isString( header[i] ) ){
			gives.push(  header[i].toLowerCase().substring(0,2) );
		}
	}

	gives.push( process.env.LANG_BASIC );

	res.locals.word = langs.word( gives );
	res.locals.list = langs.list();
	next();
};

module.exports.render = function (name) {
	return (req, res) => {
		res.render(name);
	};
};

module.exports.text = function (name) {
	return (req, res) => {
		res.render(name);
	};
};

module.exports.template = function (req, res) {
	res.render(req.params.template);
};