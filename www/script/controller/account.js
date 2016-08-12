var MAX = Math.pow(10, 8);

module.exports = function (mod, acc, cache, k, tok) {
	this.geToken = acc.GetToken;
	this.saver = acc.save;
	this.tok = tok;
	this.k = k;

	this.url = '';
	this.num = 25000;
	this.selectMax = [];

	for (var i = 30; i > 0; i--){
		this.selectMax.push(i);
	}

	this.account = acc.me();
	
	var that = this;
	mod.$watch(function () {
		return that.num;
	}, function(val) {
		that.create(val);
	});

	that.account.$promise.then(function() {
		that.create(that.num);
		cache.ready();
	});
};

module.exports.prototype.token = function() {
	this.account = this.geToken();
	this.tok.set(this.account.token);
};

module.exports.prototype.create = function(num) {
	this.num = num || this.num;
	this.price =  Math.round( ( ( this.num * this.k ) / 1000 ) * MAX ) / MAX;
	if(this.account && this.account.user){
		this.url = 'bitcoin:' + this.account.user.bit + '?label=CacheWatch&amount=' + this.price;
	}
	if( this.shop && ( this.shop.$invalid || this.num === 0 || !this.num ) ){
		this.price = 0; 
		this.url = '';
	}
};

module.exports.$inject = [ '$scope', 'account', 'cachewatch', 'KAN', 'token' ];
