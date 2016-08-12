var inject = require('./injections'),
	blockedResources = require('./config.json'),
	webPage = require('webpage'),
	page = webPage.create(),
	system = require('system');

page.onResourceRequested = function(requestData, networkRequest) {
	for(var i = 0,l = blockedResources.length; i < l; i++) {
		var regex = new RegExp(blockedResources[i], 'gi');
		if(regex.test(requestData.url)) {
			networkRequest.cancel();
			break;
		}
	}
};

page.onError = function (msg, trace) {
    console.log('<!-- ', mesg,' -->' );
    trace.forEach(function(item) {
        console.log('<!-- ', item.file, ':', item.line,' -->' );
    });
};

page.open(system.args[1], function (status) {
	var inter, run, step = 0, result,
		num = 300;
	if (status !== 'success') {
		console.log('<!-- FAILED to load the url -->');
		phantom.exit();
	} else {
		function look() {
			if(result){
				clearInterval(inter);
				inter = null;
				console.log(result);
				phantom.exit();
			} else if(run) {
				result = page.evaluate(function() {
					return document.querySelector('html').outerHTML;
				});					
			} else{
				run = page.evaluate(function() {
					var heads = document.querySelector('head');
					return heads.getAttribute('data-status') == 'ready';
				}) || step == 10;
				step++;
			}
		}
		inter = setInterval(look, num);
	}
});