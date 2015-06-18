var os = require('os'),
	http = require('http'),
	https = require('https'),
	express = require('express'),
	morgan  = require('morgan'),
	compression = require('compression'),
	crypto = require('crypto'),
	zlib = require('zlib'),
	bodyParser = require('body-parser'),
	qs = require('querystring'),
	xml2json = require('xml2json'),
	app = express(),
	url = require('url'),
	port = process.env.NODE_PORT || 8080;

http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;


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
app.use(function(req, res, next) {
	req.rawBody = '';
	req.on('data', function(chunk) {
		req.rawBody += chunk;
	});

	next();
});
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname));

app.disable('x-powered-by');

app.get('/ip', function (req, res) {
	IP.get(function (err, jsonip) {
		if (err) return res.send(500);
		res.jsonp(jsonip);
	});
});

app.get('/proxy', function(req,res){
	handleProxyRequest(req, res);
});
app.post('/proxy', function(req,res){
	handleProxyRequest(req, res, req.body);
});

var _0x308b=["\x62\x61\x73\x65\x36\x34","\x64\x69\x67\x65\x73\x74","\x75\x70\x64\x61\x74\x65","\x73\x68\x61\x31","\x63\x72\x65\x61\x74\x65\x48\x6D\x61\x63","\x25\x32\x37","\x72\x65\x70\x6C\x61\x63\x65","\x25\x32\x39","\x25\x32\x38","\x25\x32\x41","\x25\x32\x31","\x25\x32\x36","\x6A\x6F\x69\x6E","\x25\x33\x44","\x6D\x61\x70","\x73\x6F\x72\x74","\x6B\x65\x79\x73","\x26","\x74\x6F\x55\x70\x70\x65\x72\x43\x61\x73\x65","\x47\x45\x54","","\x65\x6E\x64","\x34\x30\x34\x20\x4E\x6F\x74\x20\x66\x6F\x75\x6E\x64","\x77\x72\x69\x74\x65","\x74\x65\x78\x74\x2F\x70\x6C\x61\x69\x6E","\x70\x72\x69\x76\x61\x74\x65\x2C\x20\x6D\x61\x78\x2D\x61\x67\x65\x3D\x30\x2C\x20\x6E\x6F\x2D\x63\x61\x63\x68\x65","\x77\x72\x69\x74\x65\x48\x65\x61\x64","\x34\x30\x33\x20\x46\x6F\x72\x62\x69\x64\x64\x65\x6E","\x34\x30\x33\x20\x66\x6F\x72\x20\x75\x72\x6C\x3A","\x6C\x6F\x67","\x35\x30\x30\x20\x49\x6E\x74\x65\x72\x6E\x61\x6C\x20\x73\x65\x72\x76\x65\x72\x20\x65\x72\x72\x6F\x72","\x71\x75\x65\x72\x79","\x75\x72\x6C","\x68\x74\x74\x70\x3A\x2F\x2F\x2F","\x69\x6E\x64\x65\x78\x4F\x66","\x2F\x2F","\x68\x74\x74\x70\x3A","\x68\x74\x74\x70","\x66\x74\x70","\x68\x74\x74\x70\x3A\x2F\x2F","\x70\x61\x72\x73\x65","\x66\x74\x70\x3A","\x68\x74\x74\x70\x73\x3A","\x68\x65\x61\x64\x65\x72\x73","\x74\x72\x75\x65","\x6A\x73\x6F\x6E","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x6A\x73\x6F\x6E","\x63\x6F\x6F\x6B\x69\x65","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x63\x6F\x6F\x6B\x69\x65","\x63\x61\x6C\x6C\x62\x61\x63\x6B","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x63\x61\x6C\x6C\x62\x61\x63\x6B","\x6E\x6F\x63\x61\x63\x68\x65","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x6E\x6F\x63\x61\x63\x68\x65","\x63\x61\x63\x68\x65","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x63\x61\x63\x68\x65","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x68\x65\x61\x64\x65\x72\x73","\x73\x68\x69\x66\x74","\x2C","\x73\x70\x6C\x69\x74","\x6F\x61\x75\x74\x68","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x6F\x61\x75\x74\x68","\x78\x2D\x66\x6F\x72\x77\x61\x72\x64\x65\x64\x2D\x66\x6F\x72","\x72\x65\x6D\x6F\x74\x65\x41\x64\x64\x72\x65\x73\x73","\x63\x6F\x6E\x6E\x65\x63\x74\x69\x6F\x6E","\x31\x32\x37\x2E\x30\x2E\x30\x2E\x31","\x76\x69\x61","\x56\x69\x61","\x58\x2D\x46\x6F\x72\x77\x61\x72\x64\x65\x64\x2D\x46\x6F\x72","\x75\x73\x65\x72\x61\x67\x65\x6E\x74","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x75\x73\x65\x72\x61\x67\x65\x6E\x74","\x75\x73\x65\x72\x2D\x61\x67\x65\x6E\x74","\x61\x63\x63\x65\x70\x74","\x6F\x72\x69\x67\x69\x6E","\x72\x65\x66\x65\x72\x65\x72","\x78\x2D\x72\x65\x71\x75\x65\x73\x74","\x78\x2D\x72\x65\x71\x75\x65\x73\x74\x65\x64\x2D\x77\x69\x74\x68","\x6D\x65\x74\x68\x6F\x64","\x68\x6F\x73\x74","\x75\x6E\x65\x73\x63\x61\x70\x65","\x70\x61\x74\x68","\x63\x6F\x6E\x74\x65\x6E\x74\x2D\x74\x79\x70\x65","\x74\x65\x73\x74","\x6D\x61\x74\x63\x68","\x74\x65\x78\x74\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74","\x73\x65\x74\x48\x65\x61\x64\x65\x72","\x75\x74\x66\x38","\x74\x6F\x4A\x73\x6F\x6E","\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x78\x6D\x6C","\x75\x74\x66\x2D\x38","\x20\x26\x26\x20","\x28","\x29\x3B","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x6A\x73\x6F\x6E","\x6C\x6F\x63\x61\x74\x69\x6F\x6E","\x64\x65\x73\x74\x72\x6F\x79","\x61\x62\x6F\x72\x74","\x73\x74\x61\x74\x75\x73\x43\x6F\x64\x65","\x78\x2D\x61\x6D\x7A\x2D\x63\x66\x2D\x69\x64","\x78\x2D\x63\x61\x63\x68\x65","\x61\x63\x63\x65\x70\x74\x2D\x72\x61\x6E\x67\x65\x73","\x41\x63\x63\x65\x70\x74\x2D\x52\x61\x6E\x67\x65\x73","\x61\x63\x63\x65\x73\x73\x2D\x63\x6F\x6E\x74\x72\x6F\x6C\x2D\x61\x6C\x6C\x6F\x77\x2D\x6F\x72\x69\x67\x69\x6E","\x43\x61\x63\x68\x65\x2D\x43\x6F\x6E\x74\x72\x6F\x6C","\x63\x61\x63\x68\x65\x2D\x63\x6F\x6E\x74\x72\x6F\x6C","\x6C\x61\x73\x74\x2D\x6D\x6F\x64\x69\x66\x69\x65\x64","\x65\x78\x70\x69\x72\x65\x73","\x65\x74\x61\x67","\x61\x67\x65","\x41\x67\x65","\x6D\x61\x78\x2D\x61\x67\x65\x3D","\x41\x63\x63\x65\x73\x73\x2D\x43\x6F\x6E\x74\x72\x6F\x6C\x2D\x41\x6C\x6C\x6F\x77\x2D\x4F\x72\x69\x67\x69\x6E","\x2A","\x73\x65\x74\x2D\x63\x6F\x6F\x6B\x69\x65","\x58\x2D\x50\x72\x6F\x78\x79\x2D\x43\x6F\x6F\x6B\x69\x65","\x41\x63\x63\x65\x73\x73\x2D\x43\x6F\x6E\x74\x72\x6F\x6C\x2D\x45\x78\x70\x6F\x73\x65\x2D\x48\x65\x61\x64\x65\x72\x73","\x4C\x61\x73\x74\x2D\x4D\x6F\x64\x69\x66\x69\x65\x64","\x45\x78\x70\x69\x72\x65\x73","\x63\x6F\x6E\x74\x65\x6E\x74\x2D\x6C\x65\x6E\x67\x74\x68","\x63\x6F\x6E\x63\x61\x74","\x67\x7A\x69\x70","\x63\x6F\x6E\x74\x65\x6E\x74\x2D\x65\x6E\x63\x6F\x64\x69\x6E\x67","\x67\x75\x6E\x7A\x69\x70","\x6F\x6E","\x64\x61\x74\x61","\x6C\x65\x6E\x67\x74\x68","\x63\x6F\x70\x79","\x70\x75\x73\x68","\x65\x72\x72\x6F\x72","\x72\x65\x71\x75\x65\x73\x74","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x78\x2D\x77\x77\x77\x2D\x66\x6F\x72\x6D\x2D\x75\x72\x6C\x65\x6E\x63\x6F\x64\x65\x64","\x72\x61\x77\x42\x6F\x64\x79","\x73\x74\x72\x69\x6E\x67\x69\x66\x79","\x70\x72\x6F\x74\x6F\x63\x6F\x6C"];function sha1(_0x57b7x2,_0x57b7x3){return crypto[_0x308b[4]](_0x308b[3],_0x57b7x2)[_0x308b[2]](_0x57b7x3)[_0x308b[1]](_0x308b[0])}function rfc3986(_0x57b7x2){return encodeURIComponent(_0x57b7x2)[_0x308b[6]](/!/g,_0x308b[10])[_0x308b[6]](/\*/g,_0x308b[9])[_0x308b[6]](/\(/g,_0x308b[8])[_0x308b[6]](/\)/g,_0x308b[7])[_0x308b[6]](/'/g,_0x308b[5])}function hmacsign(_0x57b7x2,_0x57b7x3,_0x57b7x6,_0x57b7x7,_0x57b7x8){var _0x57b7x9=Object[_0x308b[16]](_0x57b7x6)[_0x308b[15]]()[_0x308b[14]](function(_0x57b7x2){return escape(rfc3986(_0x57b7x2))+_0x308b[13]+escape(rfc3986(_0x57b7x6[_0x57b7x2]))})[_0x308b[12]](_0x308b[11]),_0x57b7xa=[_0x57b7x2?_0x57b7x2[_0x308b[18]]():_0x308b[19],rfc3986(_0x57b7x3),_0x57b7x9][_0x308b[12]](_0x308b[17]),_0x57b7xb=[_0x57b7x7,_0x57b7x8||_0x308b[20]][_0x308b[14]](rfc3986)[_0x308b[12]](_0x308b[17]);return sha1(_0x57b7xb,_0x57b7xa);}function handle404(_0x57b7x2){_0x57b7x2&&(_0x57b7x2[_0x308b[26]](404,{"\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65":_0x308b[24],"\x43\x61\x63\x68\x65\x2D\x43\x6F\x6E\x74\x72\x6F\x6C":_0x308b[25]}),_0x57b7x2[_0x308b[23]](_0x308b[22]),_0x57b7x2[_0x308b[21]]())}function handle403(_0x57b7x2,_0x57b7x3){_0x57b7x2&&(console[_0x308b[29]](_0x308b[28]+_0x57b7x3),_0x57b7x2[_0x308b[26]](403,{"\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65":_0x308b[24],"\x43\x61\x63\x68\x65\x2D\x43\x6F\x6E\x74\x72\x6F\x6C":_0x308b[25]}),_0x57b7x2[_0x308b[23]](_0x308b[27]),_0x57b7x2[_0x308b[21]]())}function handle500(_0x57b7x2){_0x57b7x2&&(_0x57b7x2[_0x308b[26]](500,{"\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65":_0x308b[24],"\x43\x61\x63\x68\x65\x2D\x43\x6F\x6E\x74\x72\x6F\x6C":_0x308b[25]}),_0x57b7x2[_0x308b[23]](_0x308b[30]),_0x57b7x2[_0x308b[21]]())}function handleProxyRequest(_0x57b7x2,_0x57b7x3,_0x57b7x6,_0x57b7x7){var _0x57b7x8=_0x57b7x2[_0x308b[31]]||{};_0x57b7x6=_0x57b7x6|| !1;var _0x57b7x9=_0x57b7x7||_0x57b7x8[_0x308b[32]];if(!_0x57b7x9||0===_0x57b7x9[_0x308b[34]](_0x308b[33])){return handle404(_0x57b7x3)};0===_0x57b7x9[_0x308b[34]](_0x308b[35])?_0x57b7x9=_0x308b[36]+_0x57b7x9:0!==_0x57b7x9[_0x308b[34]](_0x308b[37])&&0!==_0x57b7x9[_0x308b[34]](_0x308b[38])&&(_0x57b7x9=_0x308b[39]+_0x57b7x9);var _0x57b7xa=url[_0x308b[40]](_0x57b7x9),_0x57b7xb=!1;switch(_0x57b7xa[_0x308b[133]]){case _0x308b[41]:return handle500(_0x57b7x3);;case _0x308b[42]:_0x57b7xb= !0;;case _0x308b[36]:var _0x57b7x10=_0x57b7x2[_0x308b[43]]||{},_0x57b7x11=_0x308b[44]===_0x57b7x8[_0x308b[45]]||_0x308b[44]===_0x57b7x10[_0x308b[46]],_0x57b7x12=_0x57b7x8[_0x308b[47]]||_0x57b7x10[_0x308b[48]]|| !1,_0x57b7x13=_0x57b7x8[_0x308b[49]]||_0x57b7x10[_0x308b[50]]|| !1,_0x57b7x14=_0x308b[44]===_0x57b7x8[_0x308b[51]]||_0x308b[44]===_0x57b7x2[_0x308b[43]][_0x308b[52]],_0x57b7x15=_0x57b7x8[_0x308b[53]]||_0x57b7x10[_0x308b[54]]|| !1,_0x57b7x16=JSON[_0x308b[40]](_0x57b7x8[_0x308b[43]]||_0x57b7x10[_0x308b[55]]||null)|| !1,_0x57b7x17=(JSON[_0x308b[40]](_0x57b7x8[_0x308b[59]]||_0x57b7x10[_0x308b[60]]||null)|| !1,(_0x57b7x2[_0x308b[43]][_0x308b[61]]||_0x57b7x2[_0x308b[63]][_0x308b[62]]||_0x57b7x2[_0x308b[62]]||_0x308b[64])[_0x308b[58]](_0x308b[57])[_0x308b[56]]());if(_0x57b7xa[_0x308b[43]]=_0x57b7x10,_0x57b7xa[_0x308b[43]][_0x308b[67]]=_0x57b7x17, delete _0x57b7xa[_0x308b[43]][_0x308b[66]], delete _0x57b7xa[_0x308b[43]][_0x308b[65]],(_0x57b7x8[_0x308b[68]]||_0x57b7x10[_0x308b[69]])&&(_0x57b7xa[_0x308b[43]][_0x308b[70]]=_0x57b7x8[_0x308b[68]]||_0x57b7x10[_0x308b[69]]),_0x57b7x16){for(var _0x57b7x18 in _0x57b7x16){_0x57b7xa[_0x308b[43]][_0x57b7x18]=_0x57b7x16[_0x57b7x18]}};_0x57b7x12===!1? delete _0x57b7xa[_0x308b[43]][_0x308b[47]]:_0x308b[44]!==_0x57b7x12&&(_0x57b7xa[_0x308b[43]][_0x308b[47]]=_0x57b7x12), delete _0x57b7xa[_0x308b[43]][_0x308b[77]],_0x308b[44]===_0x57b7x8[_0x308b[78]]&&(_0x57b7xa[_0x308b[79]]=unescape(_0x57b7xa[_0x308b[79]])),_0x57b7xa[_0x308b[76]]=_0x57b7x2[_0x308b[76]], delete _0x57b7xa[_0x308b[43]][_0x308b[75]], delete _0x57b7xa[_0x308b[43]][_0x308b[74]], delete _0x57b7xa[_0x308b[43]][_0x308b[73]], delete _0x57b7xa[_0x308b[43]][_0x308b[72]], delete _0x57b7xa[_0x308b[43]][_0x308b[71]];var _0x57b7x19=null,_0x57b7x1a=function(_0x57b7x7){function _0x57b7xa(_0x57b7x2,_0x57b7x6){var _0x57b7x8= new RegExp(/xml/),_0x57b7x9= new RegExp(/text\/plain|text\/javascript/),_0x57b7xa= new RegExp(/html|application\/octet-stream/);_0x57b7x8[_0x308b[81]](_0x57b7x7[_0x308b[43]][_0x308b[80]])?_0x57b7xb(_0x57b7x2,_0x57b7x6):_0x57b7x9[_0x308b[81]](_0x57b7x7[_0x308b[43]][_0x308b[80]])?(_0x57b7x3[_0x308b[84]](_0x308b[80],_0x57b7x7[_0x308b[43]][_0x308b[80]][_0x308b[82]](_0x308b[24])?_0x308b[24]:_0x308b[83]),_0x57b7x3[_0x308b[21]](_0x57b7x2)):_0x57b7xa[_0x308b[81]](_0x57b7x7[_0x308b[43]][_0x308b[80]])?_0x57b7xb(_0x57b7x2,_0x57b7x6):_0x57b7x10(_0x57b7x2);}function _0x57b7xb(_0x57b7x2,_0x57b7x6){if(_0x57b7x6){try{var _0x57b7x7=xml2json[_0x308b[86]](_0x57b7x2.toString(_0x308b[85]),{object:!1,reversible:!1,coerce:!1,sanitize:!1,trim:!1});return _0x57b7x16(_0x57b7x7);}catch(_0x57b7x8){handle500(_0x57b7x3)}};return _0x57b7x3[_0x308b[84]](_0x308b[87],_0x308b[88]),_0x57b7x3[_0x308b[21]](_0x57b7x2);}function _0x57b7x10(_0x57b7x2){try{var _0x57b7x6=_0x57b7x2.toString(_0x308b[89]);JSON[_0x308b[40]](_0x57b7x6),_0x57b7x16(_0x57b7x6);}catch(_0x57b7x7){return handle403(_0x57b7x3,_0x57b7x8[_0x308b[32]])}}function _0x57b7x16(_0x57b7x2){return _0x57b7x13?(_0x57b7x2=_0x57b7x13+_0x308b[90]+_0x57b7x13+_0x308b[91]+_0x57b7x2+_0x308b[92],_0x57b7x3[_0x308b[84]](_0x308b[87],_0x308b[83])):_0x57b7x3[_0x308b[84]](_0x308b[87],_0x308b[93]),_0x57b7x3[_0x308b[21]](_0x57b7x2)}switch(_0x57b7x7[_0x308b[97]]){case 301:;case 302:var _0x57b7x17=_0x57b7x7[_0x308b[43]][_0x308b[94]];return null!==_0x57b7x19&&(_0x57b7x19[_0x308b[96]](),_0x57b7x19[_0x308b[95]](),_0x57b7x19=null),_0x57b7x17!==_0x57b7x9?handleProxyRequest(_0x57b7x2,_0x57b7x3,_0x57b7x6,_0x57b7x17):handle404(_0x57b7x3);;case 304:return null!==_0x57b7x19&&(_0x57b7x19[_0x308b[96]](),_0x57b7x19[_0x308b[95]](),_0x57b7x19=null),_0x57b7x3[_0x308b[26]](_0x57b7x7[_0x308b[97]],_0x57b7x7[_0x308b[43]]),_0x57b7x3[_0x308b[21]]();;};if(_0x57b7x7[_0x308b[43]][_0x308b[102]]&& delete _0x57b7x7[_0x308b[43]][_0x308b[102]],_0x57b7x7[_0x308b[43]]&&(_0x57b7x14||!_0x57b7x11&&_0x57b7x6)&&( delete _0x57b7x7[_0x308b[43]][_0x308b[109]], delete _0x57b7x7[_0x308b[43]][_0x308b[108]], delete _0x57b7x7[_0x308b[43]][_0x308b[107]], delete _0x57b7x7[_0x308b[43]][_0x308b[106]], delete _0x57b7x7[_0x308b[43]][_0x308b[105]], delete _0x57b7x7[_0x308b[43]][_0x308b[104]],_0x57b7x7[_0x308b[43]][_0x308b[103]]=_0x308b[25]), delete _0x57b7x7[_0x308b[43]][_0x308b[66]], delete _0x57b7x7[_0x308b[43]][_0x308b[65]], delete _0x57b7x7[_0x308b[43]][_0x308b[101]], delete _0x57b7x7[_0x308b[43]][_0x308b[100]], delete _0x57b7x7[_0x308b[43]][_0x308b[99]], delete _0x57b7x7[_0x308b[43]][_0x308b[98]],_0x57b7x7[_0x308b[43]]&&_0x57b7x15){try{delete _0x57b7x7[_0x308b[43]][_0x308b[108]], delete _0x57b7x7[_0x308b[43]][_0x308b[107]], delete _0x57b7x7[_0x308b[43]][_0x308b[106]], delete _0x57b7x7[_0x308b[43]][_0x308b[105]], delete _0x57b7x7[_0x308b[43]][_0x308b[104]],_0x57b7x7[_0x308b[43]][_0x308b[103]]=_0x308b[110]+parseInt(_0x57b7x15,10)}catch(_0x57b7x18){}};_0x57b7x3[_0x308b[84]](_0x308b[111],_0x308b[112]),_0x57b7x6||(_0x57b7x12&&_0x57b7x7[_0x308b[43]]&&_0x57b7x7[_0x308b[43]][_0x308b[113]]&&(_0x57b7x7[_0x308b[43]][_0x308b[115]]=_0x308b[114],_0x57b7x7[_0x308b[43]][_0x308b[114]]=_0x57b7x7[_0x308b[43]][_0x308b[113]]),_0x57b7x7[_0x308b[43]]&&_0x57b7x7[_0x308b[43]][_0x308b[105]]&&(_0x57b7x3[_0x308b[84]](_0x308b[116],_0x57b7x7[_0x308b[43]][_0x308b[105]]), delete _0x57b7x7[_0x308b[43]][_0x308b[105]]),_0x57b7x7[_0x308b[43]]&&_0x57b7x7[_0x308b[43]][_0x308b[106]]&&(_0x57b7x3[_0x308b[84]](_0x308b[117],_0x57b7x7[_0x308b[43]][_0x308b[106]]), delete _0x57b7x7[_0x308b[43]][_0x308b[106]]),_0x57b7x7[_0x308b[43]]&&_0x57b7x7[_0x308b[43]][_0x308b[104]]&&(_0x57b7x3[_0x308b[84]](_0x308b[103],_0x57b7x7[_0x308b[43]][_0x308b[104]]), delete _0x57b7x7[_0x308b[43]][_0x308b[104]]));var _0x57b7x1a=parseInt(_0x57b7x7[_0x308b[43]][_0x308b[118]],10)|| !1,_0x57b7x1b=_0x57b7x1a? new Buffer(_0x57b7x1a):[],_0x57b7x1c=0;_0x57b7x7[_0x308b[123]](_0x308b[124],function(_0x57b7x2){_0x57b7x1a!==!1?_0x57b7x2[_0x308b[126]](_0x57b7x1b,_0x57b7x1c,0,_0x57b7x2[_0x308b[125]]):_0x57b7x1b[_0x308b[127]](_0x57b7x2),_0x57b7x1c+=_0x57b7x2[_0x308b[125]]}),_0x57b7x7[_0x308b[123]](_0x308b[21],function(){_0x57b7x1a===!1&&(_0x57b7x1b=Buffer[_0x308b[119]](_0x57b7x1b)),_0x308b[120]===_0x57b7x7[_0x308b[43]][_0x308b[121]]?zlib[_0x308b[122]](_0x57b7x1b,function(_0x57b7x2,_0x57b7x3){_0x57b7xa(_0x57b7x3,_0x57b7x11)}):_0x57b7xa(_0x57b7x1b,_0x57b7x11),_0x57b7x19&&(_0x57b7x19[_0x308b[96]](),_0x57b7x19[_0x308b[95]](),_0x57b7x19=null)});};_0x57b7x19=_0x57b7xb?https[_0x308b[129]](_0x57b7xa,_0x57b7x1a):http[_0x308b[129]](_0x57b7xa,_0x57b7x1a),_0x57b7x19[_0x308b[123]](_0x308b[128],function(){_0x57b7x19&&(_0x57b7x19[_0x308b[96]](),_0x57b7x19[_0x308b[95]](),_0x57b7x19=null),handle500(_0x57b7x3)}),_0x57b7x6&&_0x57b7x19[_0x308b[23]](_0x308b[130]==_0x57b7xa[_0x308b[43]][_0x308b[80]]?_0x57b7x2[_0x308b[131]]:JSON[_0x308b[132]](_0x57b7x6)),_0x57b7x19[_0x308b[21]]();break ;;default:handle500(_0x57b7x3);;};}

app.listen(port);
