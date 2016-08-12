module.exports = function (acc, ses, lang, w) {
	return {
		restrict: 'E',
		replace : true,
		link : function (scope) {
			scope.isLogin = acc.get().length > 10;
			scope.out = function () {
				w.location.replace('/');
			};
		},
		templateUrl : ses + '.menu?lang=' + lang
	};
};

module.exports.$inject = [ 'token', 'SESSION', 'LANG', '$window'];