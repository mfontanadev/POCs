module.exports = function(app)
{
	app.get('/lib/sound-0.6.1-dist/js/soundjs-0.6.1.min.js', 
		function (req, res) {res.sendFile(__dirname + '/soundjs-0.6.1.min.js');});

	console.log("   lib/sound-0.6.1-dist/js/index.js: OK");
}