const mongoosePages = require('mongoose-pages');
const jsonSelect = require('mongoose-json-select');
const findOrCreate = require('mongoose-findorcreate');

module.exports = exports = function (mongo){
	//Agentes
	var agent = new mongo.Schema({
		public	: { type : Boolean, required : true, default : true },
		active  : { type : Boolean, required : true, default : true },
		url     : { type : mongo.SchemaTypes.Url, trim : true, required : true, index : true },
		numb	: { type : Number, Min : 1, default : 1, required : true },
		date    : { type : Date, default : Date.now, required : true },
		user	: { type : mongo.Schema.Types.ObjectId, ref: 'users', required : true, index : true }
	});

	agent.static('findByUrl', function (url, user, callback) {
		return this.findOrCreate({
				url : url,
				user : user._id,
				active : true
			},{
				url : url,
				user : user._id,
				$inc :{
					numb : 1
				}
			},{
				upsert : true
			}, callback);
	});

	agent.static('findByUser', function(user, callback) {
		return this.find({
			user : user
		}, callback);
	});

	agent.static('findByIdAndUser', function(id, user, callback) {
		return this.findOne({
			_id : id,
			user : user._id
		}, callback);
	});

	agent.method({
		testTime (time) {
			return GLOBAL.moment().diff(this.date, 'd' ) >= time;
		},
		getFile (callback) {
			callback(null, new mongo.mongo.GridStore(mongo.connection.db, this._id.toString(), 'r'));
		},
		putFile (callback) {
			var doc = this;
			doc.existFile(function (err, found) {
				if(err){
					return callback(err);
				}
				if(found){
					doc.removeFile( function( err ) {
						if(err){
							return callback(err);
						}
						callback(null, new mongo.mongo.GridStore(mongo.connection.db, doc._id.toString(), 'w').stream()); 
					});
				} else{
					callback(null, new mongo.mongo.GridStore(mongo.connection.db, doc._id.toString(), 'w').stream());
				}
			});
		},
		removeFile (callback) {
			mongo.mongo.GridStore.unlink(mongo.connection.db, this._id.toString(),  callback);
		},
		existFile (callback) {
			mongo.mongo.GridStore.exist(mongo.connection.db, this._id.toString(), callback);
		},
		clean  (callback){
			var doc = this;
			doc.removeFile(function(err){
				if(err){
					return callback(err);
				}
				doc.active = false;
				doc.save(callback);
			});
		}
	});

	agent.pre('remove', function(next) {
		this.removeFile( function(err) {
			next(err);
		});
	});

	agent.plugin(findOrCreate);
	mongoosePages.skip(agent);
	mongo.plugin(jsonSelect, '-user -public');

	return mongo.model('cache',agent);
};