module.exports = function (loca){
	return {
		restrict: 'E',
		link : function (scope, element) {
			var classes = [];
			var ele = angular.element(element);
			scope.$watch(function () {
				return loca.path();
			}, function (n) {
				for (var i = classes.length - 1; i >= 0; i--)
					ele.removeClass(classes[i]);
				classes = n.split('/');
				for (var i = classes.length - 1; i >= 0; i--)
					ele.addClass(classes[i]);
			});
		}
	};
};

module.exports.$inject = [ '$location' ];