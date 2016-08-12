module.exports.send = function (data, req, res, next) {
	if(data.hostname || GLOBAL.util.isError(data) ){
		return next( GLOBAL.util.isError(data) ? data : new Error('Dont found'));
	}

	if(data.error.length >= 1){
		data.error = GLOBAL._.compact(data.error);
		for (var i = data.error.length - 1; i >= 0; i--){
			data.error[i] = data.error[i].toString();
			if( /login/i.test(data.error[i]) ){
				res.status(401);
			}
			if( /cache/i.test(data.error[i]) ){
				res.status(402);
			}
		}
	}

	if( /json/gim.test(req.params.type) ){
		return res.status(202).json(data);
	}

	res.format({
		json (){
			res.json(data);
		},
		html (){
			if(!GLOBAL._.isObject(data.cache)){
				return next(data.error);
			}
			data.cache.getFile( (err, gs) => {
				if(err){
					return next(err);
				}
				res.header('Last-Modified', ( new Date( data.cache.date ) ).toString() );
				res.contentType( 'text/html' );
				gs.stream(true).pipe(res);
			});
		},
		default (){
			if(!GLOBAL._.isObject(data.cache)){
				return next(data.error);
			}
			data.cache.getFile( (err, gs) => {
				if(err){
					return next(err);
				}
				res.header('Last-Modified', ( new Date( data.cache.date ) ).toString() );
				res.contentType( 'text' );
				gs.stream(true).pipe(res);
			});
		}
	});
};

module.exports.error = function (f, req, res) {
	var data = { error : [] };
	if( GLOBAL.util.isError(f) ){
		data.error.push(f.toString());
	}
	res.json(data);
};

module.exports.NotFound = function ( req, res) {
	if(/\.watch/gim.test(req.headers.host)){
		res.status(404);
	}
	res.send({
		error : [ 'Dont Found' ]
	});
};

module.exports.login = function(is){
	return (req, res, next) => {
		var user = GLOBAL._.has( req, 'user' ) && !GLOBAL._.isEmpty( req.user );

		if(is){
			next( user ? null : new Error('Is login and enter force') );
		} else{
			next( !user ? null : new Error('Not login and enter force') );
		}
	};
};

module.exports.options = function (req, res, next){
	//res.removeHeader('X-Powered-By');
	res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*' );
	res.setHeader('Access-Control-Allow-Methods', 'X-Requested-With, GET, POST, PUT, DELETE, OPTIONS');
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader('Access-Control-Allow-Headers', process.env.CACHE_WATCH + ', Origin, X-Requested-With, Content-Type, Accept, Authorization');

	if(req.method === 'OPTIONS' ){
		return res.status(202).send('');
	}

	res.setHeader('Connection', 'keep-alive');
	if ( /MSIE/i.test(req.headers['user-agent']) ){
		res.setHeader('X-UA-Compatible', 'IE=Edge');
	}

	next();
};