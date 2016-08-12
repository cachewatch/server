const bodyParser = require('body-parser');
var router = GLOBAL.express();

function baucher (req, res, next) {
	var data = { error : [] };
	GLOBAL.db.model('plan').find({
		user : req.user._id,
		public : true
	}, function(err, doc) {
		if(err){
			data.error.push(err);
		}
		data.plans = doc;
		next(data);
	});
}

router.set('url', '/profile');

router.use(bodyParser.urlencoded({ extended : true }));
router.use(bodyParser.json());
router.use(bodyParser.text());
router.use(bodyParser.raw());

router.get(['/me', '/'],(req, res, next) => {
	next({ error : [ req.user ? null : new Error('Login') ], user : req.user });
});

router.post(['/me', '/'],(req, res, next) => {
	var data = { error : [] };
	GLOBAL.db.model('account').findById(req.user._id, (err, doc) => {
		if(err){
			data.error.push(err);
		}
		doc.time = parseInt(req.body.time);
		doc.save( (err, user) => {
			if(err){
				data.error.push(err);
			}
			data.user = user;
			next(data);
		});
	});
});

router.get('/baucher', baucher);
router.post('/token', (req, res, next) => {
	var data = { error : [] };
	GLOBAL.db.model('account').findById(req.user._id, (err, doc) => {
		if(err){
			data.error.push(err);
		}
		doc.createToken();
		doc.save( (err, user) => {
			if(err){
				data.error.push(err);
			}
			data.user = user;
			next(data);
		});
	});
});

router.post('/cupon', (req, res, next) => {
	GLOBAL.async.parallel({
		existCupon (callback){
			GLOBAL.db.model('cupon').findOne({
				cupon : req.body.cupon,
				public : true
			}, callback);
		},
		user (callback){
			GLOBAL.db.model('account').findById(req.user._id, callback);
		}
	}, (err, data) => {
		if(err || !data.user || !data.existCupon ){
			return next(new Error('Not a cupon'));
		}

		GLOBAL.db.model('plan').findOrCreate({
			user : data.user,
			hash : data.existCupon._id.toString() + '-FREE',
		}, {
			num : data.existCupon.num,
			total : 0
		}, (err) => {
			if (err) {
				return next(err);
			}
			next();
		});
	});
}, baucher);

module.exports = router;