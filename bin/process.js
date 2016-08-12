module.exports.vars = function (callback) {
	process.env.CACHE_WATCH = process.env.CACHE_WATCH || 'x-cache-watch' ;

	// Boolean
	process.env.COMPRESS_CSS = !!process.env.COMPRESS_CSS;
	process.env.COMPRESS_JS = !!process.env.COMPRESS_JS;
	process.env.HTTPS_ACTIVE = !!process.env.HTTPS_ACTIVE;

	// Bitcoin
	process.env.BITCOIN_MASTER = process.env.BITCOIN_MASTER || 'BITCOIN-ACCOUNT-MASTER' ;
	process.env.BLOCKCHAIN_ID = process.env.BLOCKCHAIN_ID || 'BLOCKCHAIN-ID';
	process.env.BLOCKCHAIN_SECRET1 = process.env.BLOCKCHAIN_SECRET1 || 'BLOCKCHAIN-PASS1';
	process.env.BLOCKCHAIN_SECRET2 = process.env.BLOCKCHAIN_SECRET2 || 'BLOCKCHAIN-PASS2';

	// Github 
	process.env.GITHUB_ID = process.env.GITHUB_ID || 'GITHUB-ID';
	process.env.GITHUB_SECRET = process.env.GITHUB_SECRET || 'GITHUB-SECRET';

	// APP
	process.env.OPENSHIFT_APP_DNS = process.env.OPENSHIFT_APP_DNS || 'localhost:3000';
	process.env.OPENSHIFT_APP_NAME = process.env.OPENSHIFT_APP_NAME || 'BLUE' ;
	process.env.OPENSHIFT_APP_UUID = process.env.OPENSHIFT_APP_UUID || 'BAA3';
	process.env.OPENSHIFT_DATA_DIR = process.env.OPENSHIFT_DATA_DIR || '/';

	// Rules 
	process.env.IS_FREE = process.env.IS_FREE || 10;
	process.env.IS_MAX = process.env.IS_MAX || Math.pow(10, 5);
	process.env.KONSTANT = process.env.KONSTANT || 0.001;
	process.env.LANG_BASIC = process.env.LANG_BASIC || 'es' ;

	// Database and Nodejs
	process.env.OPENSHIFT_MONGODB_DB_HOST = process.env.OPENSHIFT_MONGODB_DB_HOST || '127.0.0.1';
	process.env.OPENSHIFT_MONGODB_DB_PORT = process.env.OPENSHIFT_MONGODB_DB_PORT || 27017;
	process.env.OPENSHIFT_NODEJS_IP = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
	process.env.OPENSHIFT_NODEJS_PORT = process.env.OPENSHIFT_NODEJS_PORT || 3001;
	
	process.env.PUBLIC_DATA = GLOBAL.path.join(process.env.OPENSHIFT_DATA_DIR, 'tmp');

	// Domain
	process.env.URL_DOMAIN = process.env.URL_DOMAIN || 'cache:3001';
	process.env.URL_SERVICE = process.env.URL_SERVICE || 'localhost:3001';

	console.log('Check Variables ->', process.env.KONSTANT);
	callback(null, true);
};

// wallet
module.exports.database = function (callback) {
	const blockChain = require('blockchain.info');
	try{
		GLOBAL.wallet = new blockChain.MyWallet(
			process.env.BLOCKCHAIN_ID, 
			process.env.BLOCKCHAIN_SECRET1,
			process.env.BLOCKCHAIN_SECRET2);
		console.log('Check wallet');
		callback(null, GLOBAL.wallet);
	}catch(e){
		callback(e);
	}
};

// DataBase
module.exports.database = function (callback) {
	try{
		GLOBAL.db = require('../lib');
		console.log('Check DataBase');
		callback(null, GLOBAL.db);
	}catch(e){
		callback(e);
	}
};

// Path
module.exports.path = function (callback) {
	GLOBAL.fs.exists(process.env.PUBLIC_DATA, exist => {
		if(exist){
			return callback(null, exist);
		}
		console.log('Check Public');
		GLOBAL.fs.mkdir(process.env.PUBLIC_DATA, callback);
	});
};


module.exports.javascript = function (callback){
	const browserify = require('browserify');
	const UglifyJS = require('uglifyjs');
	const javascript = GLOBAL.path.join(__dirname, '..', 'www', 'script');
	GLOBAL.fs.readdir(javascript, (err, files) => {
		if(err){
			return callback(err);
		}
		GLOBAL.async.map(files, (file, next) => {
			if( !/\.js$/i.test(file) ){
				return next();
			}
			var b = browserify({
				entries: [ GLOBAL.path.join(javascript, file) ],
				basedir: GLOBAL.path.join(__dirname, '..' ),
				detectGlobals : true
			});
			var last = GLOBAL.path.join(process.env.PUBLIC_DATA, file);
			try{
				b
					.plugin(require('bundle-collapser/plugin'))
					.bundle( (err, src) => {
					if(err){
						return next(err);
					}
					if(_.toBool(process.env.COMPRESS_JS)){
						var result = UglifyJS.minify(src.toString(),{
							fromString : true,
							mangle : true
						});
						src = result.code;
					}
					GLOBAL.fs.writeFile(last, src, err  => {
						next(err);
					});
				});
			}catch(e){
				next(e);
			}
		}, callback);
		console.log('Check Javascript');
	});
};

module.exports.style = function (callback){
	const sass = require('node-sass');
	const style = GLOBAL.path.join(__dirname, '..', 'www', 'style');

	GLOBAL.fs.readdir(style, (err, files) => {
		if(err){
			return callback(err);
		}
		GLOBAL.async.map(files, (file, next) => {
			if( !/\.scss$/i.test(file) ){
				return next();
			}
			var out = GLOBAL.path.join(process.env.PUBLIC_DATA, file).replace('scss', 'css');
			sass.render({
				file : GLOBAL.path.join(style, file),
				noLineComments: _.toBool(process.env.COMPRESS_CSS),
				//sourceMap : out + '.map',
				//sourceComments : 'map',
				//imagePath :
				outputStyle: _.toBool(process.env.COMPRESS_CSS) ? 'compressed' : 'nested',
				includePaths : [
					//GLOBAL.path.join(style, 'lib' ),
					GLOBAL.path.join(style, 'contrib' )
				]
			}, (err, res) => {
				if(err){
					return next(err);
				}
				GLOBAL.fs.writeFile(out, res.css.toString().replace(/\}/g, '} '), 'utf8', next);
			});
		}, callback);
		console.log('Check CSS');
	});
};

// Server
module.exports.server = function (callback) {
	var server;
	try{
		server = require('../route');
		console.log('Check Server');
		callback(null, server);
	}catch(e){
		callback(e, server);
	}
};
