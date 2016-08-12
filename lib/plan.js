const jsonSelect = require('mongoose-json-select');
const findOrCreate = require('mongoose-findorcreate');

module.exports = exports = function (mongo){
	// Planes
	var plan = new mongo.Schema({
		public	: { type : Boolean, required : true, default : true },
		send	: { type : Boolean, required : true, default : false },
		user    : { type : mongo.Schema.Types.ObjectId, ref : 'user', required : true },
		hash    : { type : String, trim : true, required : true, unique : true },
		used    : { type : Number, Min : 0, required : true, default : 0 },
		num     : { type : Number, Min : 1, required : true },
		total   : { type : Number, Min : 0, required : true },
		date	: { type : Date, default : Date.now, required : true  }, 
	});

	plan.static('findByUserAndPay', function(id) {
		return this.findOneAndUpdate({
			public : true,
			user : id._id,
			send : false,
			$where : 'obj.num > obj.used'
		},{
			$inc :{
				used : 1
			}
		})
		.sort('-date');
	});

	plan.method({
		sendMoney (bitcoin, callback) {
			var pay = this;
			GLOBAL.wallet.send({
		        to : bitcoin,
		        form : this.user.bit,
		        amount : this.total,
		        inBTC : true,
		        note : this._id.toString()
		    }, function (err) {
		        if(err){
		        	return callback(err);
		        }
		        pay.send = !pay.send;
		        pay.save(callback);
		    });
		}
	});
	
	plan.static('findByUser', function(id) {
		return this.findOne({
			public : true,
			user : id._id,
			send : false
		})
		.$where('obj.num > obj.used')
		.sort('-date');
	});

	plan.plugin(jsonSelect, '-user -public -_id -send');
	plan.plugin(findOrCreate);
	plan.set('toJSON', {
		virtuals : true
	});

	return mongo.model('plan', plan);
};