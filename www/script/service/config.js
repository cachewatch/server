var trus = true;
module.exports = function (route, location, http, ses, ana, lang, sce, las) {
	http.defaults.withCredentials = trus;
	sce.resourceUrlWhitelist([
		'self',
		new RegExp( 'http(s)?:\/\/cache\.watch\/(.*)\/?$', 'i' ),
		new RegExp( 'http(s)?:\/\/(.*)\.cache\.watch\/(.*)\/?$', 'i' )
	]);
	las.aHrefSanitizationWhitelist(/^\s*(https?|mailto|bitcoin):/);
	ana.virtualPageviews(trus);
	location.html5Mode(trus);
	route
		.when('/', {
			templateUrl: ses + '.wellcome?lang=' + lang,
			controller: 'well',
			controllerAs : 'w'
		})
		.when('/info/:id', {
			templateUrl : function (params) {
				return ses + '.' + params.id + '?lang=' + lang
			},
			controller: 'well',
			controllerAs : 'w'
		})
		.when('/token', {
			controller: 'auth'
		})
		.when('/user', {
			templateUrl: ses + '.user?lang=' + lang,
			controller: 'auth',
			restricted : true,
			controllerAs : 'a'
		})
		.when('/list', {
			templateUrl : ses + '.list?lang=' + lang,
			controller : 'list',
			restricted : true,
			controllerAs : 'l'
		})
		.when('/baucher', {
			templateUrl : ses + '.baucher?lang=' + lang,
			controller : 'bauc',
			restricted : true,
			controllerAs : 'b'
		})
		.when('/feed', {
			templateUrl : ses + '.feed?lang=' + lang,
			controller : 'feed',
			restricted : true,
			controllerAs : 'f'
		})
		.otherwise({
			templateUrl: ses + '.error?lang=' + lang,
		});
};

module.exports.$inject = [
	'$routeProvider',
	'$locationProvider',
	'$httpProvider',
	'SESSION',
	'$analyticsProvider',
	'LANG',
	'$sceDelegateProvider',
	'$compileProvider'
];