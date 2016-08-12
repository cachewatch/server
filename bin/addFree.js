#!/bin/env node

var request = require('request');

var toSendFree = {
	hostname : process.env.OPENSHIFT_APP_DNS || 'localhost:3000',
	protocol : 'https',
	pathname : process.env.OPENSHIFT_APP_UUID +'/' + ( new Buffer( process.env.OPENSHIFT_APP_UUID, 'hex') )
		.toString('base64').replace(/\+/g, '-').replace(/\//g, '_'),
	query : {
		value : parseFloat(process.argv[1]) * 100000000,
		address : process.argv[0],
		transaction_hash : ( new Date() ).toString() + "-FREE"
	}
};

request(require('url').format(toSendFree), (error, response, body) => {
	if(error) console.error(error);
});