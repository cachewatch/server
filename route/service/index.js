const bodyParser = require('body-parser');
const oauth =  require('./auth');
const basic =  require('./basic');
const route = [
	require('./account'),
	oauth.router,
	require('./status')
];

var app = GLOBAL.express();

app.disable('verbose errors');
app.use(basic.options);
app.use(require('cookie-parser')()); //Parerear Cookies

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.raw());

app.use(oauth.auth.initialize());
app.use(oauth.auth.session());
app.use(['/profile*', /^\/http(.*)/i, '/url*' ], oauth.auth.authenticate('hash',{ session : false }));
app.all(/^\/http(.*)/i, require('./url')); // --> ToDo CAMBIAR!!

for (var i = route.length - 1; i >= 0; i--){
	app.use(route[i].get('url'), route[i]);
}
	
app.use('*', basic.NotFound);
app.use(basic.send);
app.use(basic.error);

module.exports = app;