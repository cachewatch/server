const phantomjs = '/var/lib/openshift/56bff5de89f5cf50b50001c5/app-root/data/phantomjs/bin/phantomjs';
const spawn = require('child_process').spawn;
const config = GLOBAL.path.join(__dirname, '..', 'config.json');
const script = GLOBAL.path.join(__dirname, '..', 'script.js');

var router = GLOBAL.express();

router.set('url', '/url');

// Obtener lista
router.route(['/list', '/'])
	.all( (req, res, next) => {
	var data = { error : [] };
	// Query
	var query = {
		user : req.user._id
	};

	if(req.query.search){
		query.url = new RegExp(req.query.search, 'gim');
	}
	
	GLOBAL.db.model('cache').findPaginated(query, (err, list) => {
		if(err){
			data.error.push(err);	
		}
		_.extend(data, list);
		data.list = list.documents;
		delete data.documents;
		next(data);
	}, req.query.limit || 500, req.query.page || 1 );
})
.get((data, req, res, next) => {
	next(data);
});

router
.route('/:id([a-f|0-9]{23,24})')
	.all( (req, res, next) => {
	var data = { error : [] };
	// Query
	GLOBAL.db.model('cache').findByIdAndUser(req.params.id, req.user, (err, doc) => {
		if(err){
			data.error.push(err);
		}
		if( !doc ){
			data.error.push(new Error('No exist'));
		}
		data.cache = doc;
		next(data);
	});
})
.put( (data, req, res, next) => {
	data.cache.putFile( (err, grs) => {
		if(err){
			return next(err);
		}
		var ls = spawn(phantomjs, ['--config=' + config, script, data.cache.url ]);
		grs.on('end', (err) => {
			if(err){
				return next(err);
			}
			next(data);
		});
		ls.stdout.pipe(grs);
		ls.stderr.on('data', (d) => {
			console.log(d);
			next(d);
		});
	});
});

module.exports = router;