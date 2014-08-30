var os = require('os'),
	http = require('http'),
	express = require('express'),
	morgan  = require('morgan'),
	compression = require('compression'),
	bodyParser = require('body-parser'),
	app = express(),
	port = process.env.NODE_PORT || 8080;

var IP = (function () {
	var cached;
	function filterLocal(details) {
		return details.family === 'IPv4' && details.internal === false;
	}
	function local() {
		var ifaces = os.networkInterfaces();
		for (var dev in ifaces) {
			var iface = ifaces[dev].filter(filterLocal);
			if(iface.length > 0) return iface[0].address;
		}
	}
	function get(cb) {
		if (cached) {
			cached.lan = local();
			return cb(null, cached);
		}
		http.get('http://jsonip.metrological.com/?maf=true', function (res) {
			var data = '';
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				data += chunk;
			});
			res.on('end', function () {
				var result;
				try {
					result = JSON.parse(data);
				} catch (err) {
					return cb(err);
				}
				result.wan = result.ip;
				result.lan = local();
				result.port = port;
				cached = result;
				cb(null, result);
			});
		});
	}
	return {
		get: get
	};
}());

app.use(morgan('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.disable('x-powered-by');

app.get('/ip', function (req, res) {
	IP.get(function (err, jsonip) {
		if (err) return res.send(500);
		res.jsonp(jsonip);
	});
});

app.listen(port);
