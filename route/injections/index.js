module.exports = function (page) {
	return [
		function (callback) {
			page.injcudeJs(__dirname + 'bind.js', callback);
		}
	]
};