const mongoosePages = require('mongoose-pages');
const jsonSelect = require('mongoose-json-select');
const findOrCreate = require('mongoose-findorcreate');

module.exports = exports = function (mongo){
	//Agentes
	var agent = new mongo.Schema({
		public	: { type : Boolean, required : true, default : true },
		cupon   : { type : String, required : true, trim : true, uppercase: true },
		num 	: { type : Number, Min : 1, default : 1, required : true },
		date    : { type : Date, default : Date.now, required : true }
	});

	return mongo.model('cupon', agent);
};