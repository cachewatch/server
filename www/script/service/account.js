module.exports = function (res, ser) {
	return res(ser + 'profile/:doIs', {
		doIs : 'me'
	}, {
		me : {
			method : 'GET',
		},
		baucher : {
			method : 'GET',
			params : {
				doIs : 'baucher'
			}
		},
		GetToken : {
			method : 'POST',
			params : {
				doIs : 'token'
			}
		},
		save : {
			method : 'POST',
			params : {
				doIs : 'me'
			}
		},
		getCupon : {
			method : 'POST',
			params : {
				doIs : 'cupon'
			}	
		}
	});
};

module.exports.$inject = ['$resource', 'SERVICE'];