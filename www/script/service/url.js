module.exports = function (res, ser) {
	return res(ser + 'url/:doIs', {
		doIs : 'list',
	}, {
		giveAll: {
			method : 'GET',
		},
		findById : {
			method :  'GET',
		},
		refresh: {
			method : 'PUT',
		}
	});
};

module.exports.$inject = ['$resource', 'SERVICE'];