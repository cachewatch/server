module.exports = function (door, cache) {
	this.door = door.submit;
	cache.ready();
};

module.exports.prototype.sender = function () {
	var that = this;
	this.door({ 
		email : this.report.mail,
		message :this.report.mesg
	}, function () {
		that.report.mail = '';
		that.report.mesg = '';
	}, console.log);
};

module.exports.$inject = ['door', 'cachewatch'];
