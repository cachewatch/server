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

GLOBAL.packages = require('../../../package.json');


var run = require('../../../bin/process');

delete run.server;
delete run.javascript;
delete run.style;

GLOBAL.async.series(run, (err, results) => {
	if(err){
		throw err;
	}
	results.database.model('plan').find({
		send : false,
		total : {
			$lt : 0
		}
	})
	.$where('obj.num <= obj.used')
	.populate('user')
	.exec( (e, docs) => {
		if(e){
			throw e;
		}
		GLOBAL.async.map(docs, (item, next) => {
			item.sendMoney(process.env.BITCOIN_MASTER, next);
		}, err => {
			if(err){
				throw err;
			}
			process.exit();
		});
	});
});