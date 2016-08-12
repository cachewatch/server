const crypto = require('crypto');
const jsonSelect = require('mongoose-json-select');
const findOrCreate = require('mongoose-findorcreate');

module.exports = exports = function (mongo){
	var UserSchema = new mongo.Schema({
		public	: { type : Boolean, required : true, default : true },
		data 	: mongo.SchemaTypes.Mixed,
		date	: { type : Date, default : Date.now, required : true },
		admin	: { type : Boolean, required : true, default : false },
		tokeD	: { type : String, required : true, trim : true },
		gitid	: { type : String, required : true, unique : true, index: true },
		time	: { type : Number, Min : 0, default : 30, required : true },
		bit     : { type : String, required : true, unique : true, index: true }
	});

	UserSchema.static('findByToken', function (token, callback) {

		if(token.length !== 52){
			return callback(new Error('No token'));
		}

		var z = new Buffer( GLOBAL.base32.decode( token ), 'base64' ).toString('hex');

		var query = { _id :'', tokeD : '', public : true };
		for (var i = z.length - 1; i >= 0; i--){
			var is = i > 2 ? i % 2 : i === 1;
			query[ is ? '_id' : 'tokeD' ] += z[i];
		}

		if(query._id.length !== 24 || query.tokeD.length !== 24 ){
			return callback(new Error('No token'));
		}

		return this.findOne(query).exec(callback);
	});

	UserSchema.method({
		createToken () {
			this.tokeD = ( new Buffer( crypto.randomBytes(12) ) ).toString('hex');
		}
	});

	UserSchema.virtual('token').get(function() {
		var tok = '',
			ge = this.tokeD.split(''),
			id = this._id.toString().split('');
		for (var i = ge.length - 1; i >= 0; i--){
			tok += ge[i] + id[i];
		}
		return GLOBAL.base32.encode( new Buffer(tok, 'hex').toString('base64') );
	});

	UserSchema.pre('validate', function (next ){
		if( !GLOBAL._.isEmpty(this.bit) ){
			return next();
		}
		var that = this;
		GLOBAL.wallet.newAddress({
			label : that._id.toString()
		}, function (err, data) {
			if(err || !data.address){
				return next( err || new Error(data.error));
			}
			
			that.bit = data.address;
			next();
		});
	});

	UserSchema.set('toJSON', {
		virtuals : true
	});

	UserSchema.plugin(jsonSelect, '-tokeD -admin -public -_id -gitid');
	UserSchema.plugin(findOrCreate);

	return mongo.model('account',	UserSchema);
};