var MAX = Math.pow(10, 8);

module.exports = function (cache, k) {
	this.num = 2500;
	this.k = k;
	this.max = 2;
	this.slide = 0;
	this.front = 0;
	this.back = 0;
	cache.ready();
};

module.exports.prototype.goNext = function() {
	if( this.max === this.slide ){
		this.slide = 0;
	}else {
		this.slide++;
	}
};

module.exports.prototype.goBack = function() {
	if( 0 === this.slide ){
		this.slide = this.max;
	}else{
		this.slide--;
	}
};

module.exports.prototype.aprox = function() {
	return Math.round( ( (this.num  * this.k ) / 1000 ) * MAX ) / MAX;
};

module.exports.$inject = ['cachewatch', 'KAN'];
