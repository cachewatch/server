const bodyParser = require('body-parser');

var router = GLOBAL.express();

router.set('url', '/' + ( new Buffer( process.env.OPENSHIFT_APP_UUID, 'hex') )
	.toString('base64').replace(/\+/g, '-').replace(/\//g, '_') );

console.log('Is the send money', router.get('url') );

router.use( (req, res, next) => {
	if( req.query.test || !/rhcloud/gim.test(req.headers.host) ){ 

		return next('route');
	}
	next();
});

router.use(bodyParser.urlencoded({ extended : true }));
router.use(bodyParser.json());
router.use(bodyParser.text());
router.use(bodyParser.raw());

router.route('/put')
	.all( (req, res, next) => {
	var hashs = new ( GLOBAL.db.model('plan') )({
		total : parseFloat( req.query.value ) / 100000000,
		hash : req.query.transaction_hash,
		send : !!/FREE/.test(req.query.transaction_hash)
	});

	GLOBAL.db.model('account').findOne({
		bit : req.query.address,
		public : true
	},  (err, user) => {
		if(err || !user){
			return next(err || 'route');
		}

		hashs.user = user;
		hashs.num = parseInt( hashs.total / process.env.KONSTANT) * 1000;

		hashs.save( (err) => {
			if(err){
				return next(err);
			}

			res.send('*ok*');
		});
	});
});

router.route('/cup')
	.delete( (req, res, next) => {
		var data = {};
		GLOBAL.db.model('cupon').findIdAndUpdate(req.query.id, {
			public : false
		}, (err, doc ) => {
			data.err = err;
			data.doc = doc;
			res.json(data);
		});
	})
	.post( (req, res, next) => {
		console.log(req);
		var doc = new (GLOBAL.db.model('cupon'))(req.body);
		var data = {};
		doc.save( (err, doc) => {
			data.err = err;
			data.doc = doc;
			res.json(data);
		});
	});



module.exports = router;