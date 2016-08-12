const basic =  require('./basic');
var app = GLOBAL.express();

app.locals.title = 'Cache Watch';
app.locals.STATIC = 'http' + ( _.toBool(process.env.HTTPS_ACTIVE) ? 's' : '' ) + '://' +  process.env.URL_DOMAIN + '/';
app.locals.SERVICE = 'http' + ( _.toBool(process.env.HTTPS_ACTIVE) ? 's' : '' ) + '://' + process.env.URL_SERVICE + '/' ;

app.set('view engine', 'jade'); // Insertado engine de plantillas
app.set('views', GLOBAL.path.join(__dirname, '..',  '..', 'www', 'view')); //Direcion de las plantillas
app.enable('view cache');
app.disable('verbose errors');
app.use(require('compression')());
//app.use(require('serve-favicon')(GLOBAL.path.join(__dirname, '..', 'public', 'image', '16.ico')));
app.use('/public', GLOBAL.express.static( process.env.PUBLIC_DATA ));
app.use('/static', GLOBAL.express.static( GLOBAL.path.join(__dirname, '..',  '..', 'www', 'static') ));

app.use( basic.lang );
app.all('/sitemap.xml', basic.render('sitemap') );
//app.all('/robots.txt', basic.text('robots') );
//app.all('/humans.txt', basic.text('humans') );
app.all('/' + process.env.OPENSHIFT_APP_UUID + '.:template', basic.template );

app.all('*', basic.render('out') );
app.set('url', process.env.URL_DOMAIN.replace(/\:\d+$/, '') );

module.exports = app;