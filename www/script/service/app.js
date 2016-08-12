angular.module('cache', [
	'ng',
	'const',
	'sticky',
	'cachewatch',
	'monospaced.qrcode',
	require('angular-touch'),
	require('angular-sanitize'),
	require('angular-route'),
	require('angular-resource'),
	require('angular-messages'),
	require('angulartics'),
	require('angulartics-google-analytics')
])
.service('token', require('../service/token.js'))
.service('account', require('../service/account.js'))
.service('cache', require('../service/url.js'))
.service('door', require('../service/doorbell.js'))

.directive('body', require('../directive/body.js'))
.directive('userMenu', require('../directive/menu.js'))
.directive('timerFor', require('../directive/timer-change.js'))

.controller('auth', require('../controller/account.js'))
.controller('list', require('../controller/list.js'))
.controller('well', require('../controller/well.js'))
.controller('bauc', require('../controller/bauc.js'))
.controller('feed', require('../controller/feedback.js'))

.config(require('../service/config.js'))
.run(require('../service/run.js'));