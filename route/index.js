const vhost = require('vhost');
const returns = require('./service/return');
var app = GLOBAL.express();
//app.use(morgan('combined'));
app.set('query parser', require('node-qs-serialization').deparam );
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin',  '*' );
	res.setHeader('Access-Control-Allow-Methods', 'X-Requested-With, GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, ' + process.env.CACHE_WATCH);

	next();
});
app.set('view engine', 'jade'); // Insertado engine de plantillas
app.set('views', GLOBAL.path.join(__dirname, '..',  '..', 'www', 'view')); //Direcion de las plantillas
//app.enable('view cache');
app.disable('verbose errors');
app.use(require('compression')());

app.use(returns.get('url'), returns);

[
	require('./www'),
	require('./service')
].forEach(item => {
	if(item.get('url')){
		app.use(vhost(item.get('url'), item));
	}else{
		app.use(item);
	}
});

module.exports = app;
