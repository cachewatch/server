module.exports = function (cache, cachew) {
	this.cache = cache;
	this.num ={
		page : 1,
		limit : 500
	};
	this.url = cache.giveAll({
		limit : this.maxItems
	});
	cachew.ready();
};

module.exports.prototype.reload = function(index) {
	this.cache.reload({
		doIs : index
	});
};

module.exports.prototype.goTo = function(acc) {
	var page = typeof acc === 'number' ? acc : this.url[acc];
	if( typeof page === 'number' && page >= 1 ){
		this.num.page = page;
		this.url = this.cache.giveAll(this.num);
	}
};

module.exports.prototype.search = function() {
	var query = this.num = {
		page : 1,
		limit : 500
	};
	
	query.search = this.fils;
	this.url = this.cache.giveAll(query);
};

module.exports.$inject = ['cache', 'cachewatch']