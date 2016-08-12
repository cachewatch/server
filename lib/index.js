const uriMong = require('mongodb-uri');
var mongo = require('mongoose');
require('mongoose-types').loadTypes( mongo );

var urlObj   = {
	protocol : 'mongodb',
	slashes  : true,
	port     : process.env.OPENSHIFT_MONGODB_DB_PORT,
	hostname : process.env.OPENSHIFT_MONGODB_DB_HOST,
	pathname : process.env.OPENSHIFT_APP_NAME,
};

if( !GLOBAL._.isEmpty(process.env.OPENSHIFT_MONGODB_DB_PASSWORD) && 
	!GLOBAL._.isEmpty(process.env.OPENSHIFT_MONGODB_DB_USERNAME) ){
	urlObj.auth = process.env.OPENSHIFT_MONGODB_DB_USERNAME;
	urlObj.auth += ':';
	urlObj.auth += process.env.OPENSHIFT_MONGODB_DB_PASSWORD;
}

var uris = uriMong.formatMongoose(GLOBAL.url.format( urlObj ));

// Sistema
require('./plan')( mongo );
require('./cache')( mongo );
require('./account')( mongo );
require('./cupon')( mongo );

mongo.connect(uris, err => {
	if(err){
		console.log ('ERROR connecting to: ' + uris + '. ' + err);	
	}
});

module.exports = exports = mongo;