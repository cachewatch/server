module.exports = function (timeOut) {
	var inter;
	return {
		restrict: 'A',
		link : function (scope, ele, attr) {
			var starts = attr.timerFor + attr.start;
			var ends = attr.timerFor + attr.go;
			inter =  timeOut(function(){
				var add = ele.hasClass( starts );
				ele.removeClass( starts );
				ele.removeClass( ends );
				ele.addClass(add ? ends : starts );
			}, 1500);
		},
	};
};

module.exports.$inject = [ '$interval' ];