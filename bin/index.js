#!/bin/env node

GLOBAL.os		= require('os');
GLOBAL.fs		= require('fs');
GLOBAL.url		= require('url');
GLOBAL.util		= require('util');
GLOBAL.path		= require('path');
GLOBAL.async	= require('async');
GLOBAL.moment	= require('moment');
GLOBAL._		= require('underscore');
GLOBAL._.str	= require('underscore.string');
GLOBAL.express	= require('express');
GLOBAL.base32	= require('base32');

GLOBAL._.mixin(GLOBAL._.str.exports());

GLOBAL.packages = require('../package.json');
var run = require('./process');

GLOBAL.async.series(run, (err, results) => {
	if(err){
		throw err;
	}
	/*if(cluster.isMaster) {

		for (var i = 0; i < (options.workers || os.cpus().length); i += 1)
			cluster.fork();

		cluster.on('exit', function (worker) {
			cluster.fork();
		});
	} else {*/
		results.server.listen(
			process.env.OPENSHIFT_NODEJS_PORT,
			process.env.OPENSHIFT_NODEJS_IP,
			function()  {
				console.log('%s: Node server started on %s:%d ...', new Date(),
					process.env.OPENSHIFT_NODEJS_IP,
					process.env.OPENSHIFT_NODEJS_PORT);
		});
	/*}*/
});