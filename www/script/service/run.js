module.exports =  function (root, local, token, route) {
	if( /token/gim.test(local.path()) && local.search().t.length > 5 ){
	    token.set(local.search().t, function () {
	        local.search('t');
		    local.path('/user');
    	});
	}
	
	root.$on('$locationChangeStart', function (event, next) {
		var nextRoute = route.routes[local.path()];
		if( nextRoute && nextRoute.restricted && token.get() > 5 && token.get().length < 20 )
			local.path('/');
	});
};

module.exports.$inject = [ '$rootScope', '$location', 'token', '$route' ];