module.exports = function (root, http, local, header) {
	root.token = root.token || '';
	
	function defaults (t, fn) {
	    root.token = t;
		http.defaults.headers.common[header] = root.token;
		if(angular.isFunction(fn)){
			fn();	
		} 
	}

	return {
		set : defaults,
		get : function () {
			return root.token;
		},
		remove : function () {
			root.token = '';
			return root.token;
		}
	};
};

module.exports.$inject = [ '$rootScope', '$http', '$location', 'XHEADER' ];