module.exports =  function (res) { 
	return res('https://doorbell.io/api/applications/:id/:action?key=:api', {
		api  : 'efXmixMCtEuKA8MMpQBBKtr6ppP0WqQKY8yEsDBDbYHIugYjaMZSSVubJ8fyR7Dg',
		id   : 3328,
		action : 'submit'
	}, {
		open : {
			method:'GET',
			withCredentials : false,
			params : {
				action : 'open'
			}
		},
		submit : {
			cache : false,
			withCredentials : false,
			method:'POST',
			params : {
				action : 'submit'
			}
		}
	});
};

module.exports.$inject = [ '$resource' ];