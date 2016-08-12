module.exports.list =  function () {
	var list = [];
	for (var prop in langs) {
		if (langs.hasOwnProperty(prop)) {
			list.push({
				name : langs[prop].name,
				code : prop
			});
		}
	}

	return list;
};

module.exports.word =  function (list) {
	
	var lang;
	for (var i = list.length - 1; i >= 0; i--) {
		if( GLOBAL._.isObject(langs[ list[i] ]) && langs[ list[i] ].name )
			lang = langs[ list[i] ];
	}

	return lang;
};

var langs = module.exports.langs = {};
var z = GLOBAL.fs.readdirSync(__dirname);
for (var i = 0; i < z.length; i++)
	if( z[i] !== 'index.js' )
		langs[ z[i].replace('.json', '') ] = require(GLOBAL.path.join( __dirname, z[i] ) );