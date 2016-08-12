const GitHubStrategy = require('passport-github2').Strategy;
const HashStrategy = require('passport-hash').Strategy;
const account = GLOBAL.db.model('account');
const nameReturn = '/callback';
const nameStart = '/auth'; 

var router = GLOBAL.express();
var passport = require('passport');

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser((id, done) => {
	account.findById(id).exec((err, doc) => {
		done(err, doc);
	});
});

passport.use(new GitHubStrategy({
	clientID: process.env.GITHUB_ID,
	clientSecret: process.env.GITHUB_SECRET,
	callbackURL: 'http' + ( _.toBool(process.env.HTTPS_ACTIVE) ? 's' : '' ) + '://' + process.env.URL_SERVICE + nameStart + nameReturn
}, (accessToken, refreshToken, profile, done) => {
	account.findOrCreate({
		gitid : profile.id
	},{
		data : GLOBAL._.pick(profile._json, [
			'updated_at',
			'created_at',
			'name',
			'company',
			'type',
			'organizations_url',
			'html_url',
			'avatar_url',
			'login']),
		tokn : new Date()
	},{
		upsert : true
	}, (err, user, isNew) => {
		if(!isNew){
			return done(err, user);
		}

		var plans =  new ( GLOBAL.db.model('plan') )({
			user : user,
			hash : user._id.toString() + '-FREE',
			num : process.env.IS_FREE,
			total : 0
		});

		user.createToken();
		user.save((err, user2) => {
			if(err){
				return done(err, false);
			}

			plans.save( err => {
				done(err, user2);
			});
		});
	});
	}
));

passport.use(new HashStrategy({
	headerField : process.env.CACHE_WATCH
}, (hash, done) => {
		account.findByToken(hash, (err, user) => {
			if (err || !user || !user.public){
				return done(err, false);
			}
			done(err, user);
		});
	}
));

router.set('url', nameStart);

router.get('/', passport.authenticate('github', { scope: [ 'user' ] }));
router.get(nameReturn, passport.authenticate('github', {
	failureRedirect: 'http' + ( _.toBool(process.env.HTTPS_ACTIVE) ? 's' : '' ) + '://' + 
		process.env.URL_DOMAIN + '/error'
}), (req, res) => {
	res.redirect( 'http' + ( _.toBool(process.env.HTTPS_ACTIVE) ? 's' : '' ) + '://' + 
		process.env.URL_DOMAIN + '/token?t=' + req.user.token );
});

module.exports.auth = passport;
module.exports.router = router;