module.exports = function (account, cache) {
	this.res = account;
	this.list = this.res.baucher();
	this.copun = false;
	this.fils = '';
	cache.ready();
};

module.exports.prototype.meTest = function(d) {
	var is = new Date(d);
	return new Date() <= is;
};

module.exports.prototype.sendCupon = function() {
	this.list = this.res.getCupon({
		cupon : this.fils
	});
	this.fils = '';
};

module.exports.$inject = ['account', 'cachewatch']
