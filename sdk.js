var os = require('os'),
	http = require('http'),
	https = require('https'),
	express = require('express'),
	morgan  = require('morgan'),
	compression = require('compression'),
	crypto = require('crypto'),
	zlib = require('zlib'),
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

  req.on('end', function() {
    next();
  });
});
app.use(compression());
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
	handleProxyRequest(req, res, true);
});

var _0xf86a=["\x62\x61\x73\x65\x36\x34","\x64\x69\x67\x65\x73\x74","\x75\x70\x64\x61\x74\x65","\x73\x68\x61\x31","\x63\x72\x65\x61\x74\x65\x48\x6D\x61\x63","\x25\x32\x37","\x72\x65\x70\x6C\x61\x63\x65","\x25\x32\x39","\x25\x32\x38","\x25\x32\x41","\x25\x32\x31","\x25\x32\x36","\x6A\x6F\x69\x6E","\x25\x33\x44","\x6D\x61\x70","\x73\x6F\x72\x74","\x6B\x65\x79\x73","\x26","\x74\x6F\x55\x70\x70\x65\x72\x43\x61\x73\x65","\x47\x45\x54","","\x74\x65\x78\x74\x2F\x70\x6C\x61\x69\x6E","\x70\x72\x69\x76\x61\x74\x65\x2C\x20\x6D\x61\x78\x2D\x61\x67\x65\x3D\x30\x2C\x20\x6E\x6F\x2D\x63\x61\x63\x68\x65","\x77\x72\x69\x74\x65\x48\x65\x61\x64","\x34\x30\x34\x20\x4E\x6F\x74\x20\x66\x6F\x75\x6E\x64","\x77\x72\x69\x74\x65","\x65\x6E\x64","\x34\x30\x33\x20\x66\x6F\x72\x20\x75\x72\x6C\x3A","\x6C\x6F\x67","\x34\x30\x33\x20\x46\x6F\x72\x62\x69\x64\x64\x65\x6E","\x35\x30\x30\x20\x49\x6E\x74\x65\x72\x6E\x61\x6C\x20\x73\x65\x72\x76\x65\x72\x20\x65\x72\x72\x6F\x72","\x71\x75\x65\x72\x79","\x75\x72\x6C","\x68\x74\x74\x70\x3A\x2F\x2F\x2F","\x69\x6E\x64\x65\x78\x4F\x66","\x2F\x2F","\x68\x74\x74\x70\x3A","\x68\x74\x74\x70","\x66\x74\x70","\x68\x74\x74\x70\x3A\x2F\x2F","\x70\x61\x72\x73\x65","\x66\x74\x70\x3A","\x68\x74\x74\x70\x73\x3A","\x68\x65\x61\x64\x65\x72\x73","\x6A\x73\x6F\x6E","\x74\x72\x75\x65","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x6A\x73\x6F\x6E","\x63\x6F\x6F\x6B\x69\x65","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x63\x6F\x6F\x6B\x69\x65","\x63\x61\x6C\x6C\x62\x61\x63\x6B","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x63\x61\x6C\x6C\x62\x61\x63\x6B","\x6E\x6F\x63\x61\x63\x68\x65","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x6E\x6F\x63\x61\x63\x68\x65","\x63\x61\x63\x68\x65","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x63\x61\x63\x68\x65","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x68\x65\x61\x64\x65\x72\x73","\x6F\x61\x75\x74\x68","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x6F\x61\x75\x74\x68","\x73\x68\x69\x66\x74","\x2C","\x73\x70\x6C\x69\x74","\x78\x2D\x66\x6F\x72\x77\x61\x72\x64\x65\x64\x2D\x66\x6F\x72","\x72\x65\x6D\x6F\x74\x65\x41\x64\x64\x72\x65\x73\x73","\x63\x6F\x6E\x6E\x65\x63\x74\x69\x6F\x6E","\x31\x32\x37\x2E\x30\x2E\x30\x2E\x31","\x58\x2D\x46\x6F\x72\x77\x61\x72\x64\x65\x64\x2D\x46\x6F\x72","\x56\x69\x61","\x76\x69\x61","\x75\x73\x65\x72\x61\x67\x65\x6E\x74","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x75\x73\x65\x72\x61\x67\x65\x6E\x74","\x75\x73\x65\x72\x2D\x61\x67\x65\x6E\x74","\x68\x6F\x73\x74","\x75\x6E\x65\x73\x63\x61\x70\x65","\x70\x61\x74\x68","\x6D\x65\x74\x68\x6F\x64","\x78\x2D\x72\x65\x71\x75\x65\x73\x74\x65\x64\x2D\x77\x69\x74\x68","\x78\x2D\x72\x65\x71\x75\x65\x73\x74","\x72\x65\x66\x65\x72\x65\x72","\x6F\x72\x69\x67\x69\x6E","\x61\x63\x63\x65\x70\x74","\x6C\x6F\x63\x61\x74\x69\x6F\x6E","\x61\x62\x6F\x72\x74","\x64\x65\x73\x74\x72\x6F\x79","\x73\x74\x61\x74\x75\x73\x43\x6F\x64\x65","\x61\x63\x63\x65\x73\x73\x2D\x63\x6F\x6E\x74\x72\x6F\x6C\x2D\x61\x6C\x6C\x6F\x77\x2D\x6F\x72\x69\x67\x69\x6E","\x41\x67\x65","\x61\x67\x65","\x65\x74\x61\x67","\x65\x78\x70\x69\x72\x65\x73","\x6C\x61\x73\x74\x2D\x6D\x6F\x64\x69\x66\x69\x65\x64","\x63\x61\x63\x68\x65\x2D\x63\x6F\x6E\x74\x72\x6F\x6C","\x43\x61\x63\x68\x65\x2D\x43\x6F\x6E\x74\x72\x6F\x6C","\x41\x63\x63\x65\x70\x74\x2D\x52\x61\x6E\x67\x65\x73","\x61\x63\x63\x65\x70\x74\x2D\x72\x61\x6E\x67\x65\x73","\x78\x2D\x63\x61\x63\x68\x65","\x78\x2D\x61\x6D\x7A\x2D\x63\x66\x2D\x69\x64","\x6D\x61\x78\x2D\x61\x67\x65\x3D","\x41\x63\x63\x65\x73\x73\x2D\x43\x6F\x6E\x74\x72\x6F\x6C\x2D\x41\x6C\x6C\x6F\x77\x2D\x4F\x72\x69\x67\x69\x6E","\x2A","\x73\x65\x74\x48\x65\x61\x64\x65\x72","\x73\x65\x74\x2D\x63\x6F\x6F\x6B\x69\x65","\x41\x63\x63\x65\x73\x73\x2D\x43\x6F\x6E\x74\x72\x6F\x6C\x2D\x45\x78\x70\x6F\x73\x65\x2D\x48\x65\x61\x64\x65\x72\x73","\x58\x2D\x50\x72\x6F\x78\x79\x2D\x43\x6F\x6F\x6B\x69\x65","\x4C\x61\x73\x74\x2D\x4D\x6F\x64\x69\x66\x69\x65\x64","\x45\x78\x70\x69\x72\x65\x73","\x63\x6F\x6E\x74\x65\x6E\x74\x2D\x6C\x65\x6E\x67\x74\x68","\x64\x61\x74\x61","\x6C\x65\x6E\x67\x74\x68","\x63\x6F\x70\x79","\x70\x75\x73\x68","\x6F\x6E","\x63\x6F\x6E\x63\x61\x74","\x63\x6F\x6E\x74\x65\x6E\x74\x2D\x65\x6E\x63\x6F\x64\x69\x6E\x67","\x67\x7A\x69\x70","\x67\x75\x6E\x7A\x69\x70","\x63\x6F\x6E\x74\x65\x6E\x74\x2D\x74\x79\x70\x65","\x74\x65\x73\x74","\x75\x74\x66\x38","\x74\x6F\x4A\x73\x6F\x6E","\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x78\x6D\x6C","\x75\x74\x66\x2D\x38","\x20\x26\x26\x20","\x28","\x29\x3B","\x74\x65\x78\x74\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x6A\x73\x6F\x6E","\x72\x65\x71\x75\x65\x73\x74","\x65\x72\x72\x6F\x72","\x72\x61\x77\x42\x6F\x64\x79","\x70\x72\x6F\x74\x6F\x63\x6F\x6C"];function sha1(_0x1757x2,_0x1757x3){return crypto[_0xf86a[4]](_0xf86a[3],_0x1757x2)[_0xf86a[2]](_0x1757x3)[_0xf86a[1]](_0xf86a[0])}function rfc3986(_0x1757x5){return encodeURIComponent(_0x1757x5)[_0xf86a[6]](/!/g,_0xf86a[10])[_0xf86a[6]](/\*/g,_0xf86a[9])[_0xf86a[6]](/\(/g,_0xf86a[8])[_0xf86a[6]](/\)/g,_0xf86a[7])[_0xf86a[6]](/'/g,_0xf86a[5])}function hmacsign(_0x1757x7,_0x1757x8,_0x1757x9,_0x1757xa,_0x1757xb){var _0x1757xc=Object[_0xf86a[16]](_0x1757x9)[_0xf86a[15]]()[_0xf86a[14]](function(_0x1757x2){return escape(rfc3986(_0x1757x2))+_0xf86a[13]+escape(rfc3986(_0x1757x9[_0x1757x2]))})[_0xf86a[12]](_0xf86a[11]);var _0x1757xd=[_0x1757x7?_0x1757x7[_0xf86a[18]]():_0xf86a[19],rfc3986(_0x1757x8),_0x1757xc][_0xf86a[12]](_0xf86a[17]);var _0x1757x2=[_0x1757xa,_0x1757xb||_0xf86a[20]][_0xf86a[14]](rfc3986)[_0xf86a[12]](_0xf86a[17]);return sha1(_0x1757x2,_0x1757xd);}function handle404(_0x1757xf){if(_0x1757xf){_0x1757xf[_0xf86a[23]](404,{"\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65":_0xf86a[21],"\x43\x61\x63\x68\x65\x2D\x43\x6F\x6E\x74\x72\x6F\x6C":_0xf86a[22]});_0x1757xf[_0xf86a[25]](_0xf86a[24]);_0x1757xf[_0xf86a[26]]();}}function handle403(_0x1757xf,_0x1757x11){if(_0x1757xf){console[_0xf86a[28]](_0xf86a[27]+_0x1757x11);_0x1757xf[_0xf86a[23]](403,{"\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65":_0xf86a[21],"\x43\x61\x63\x68\x65\x2D\x43\x6F\x6E\x74\x72\x6F\x6C":_0xf86a[22]});_0x1757xf[_0xf86a[25]](_0xf86a[29]);_0x1757xf[_0xf86a[26]]();}}function handle500(_0x1757xf){if(_0x1757xf){_0x1757xf[_0xf86a[23]](500,{"\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65":_0xf86a[21],"\x43\x61\x63\x68\x65\x2D\x43\x6F\x6E\x74\x72\x6F\x6C":_0xf86a[22]});_0x1757xf[_0xf86a[25]](_0xf86a[30]);_0x1757xf[_0xf86a[26]]();}}function handleProxyRequest(_0x1757x14,_0x1757xf,_0x1757x15,_0x1757x16){var _0x1757x9=_0x1757x14[_0xf86a[31]]||{};_0x1757x15=_0x1757x15||false;var _0x1757x8=_0x1757x16||_0x1757x9[_0xf86a[32]];if(!_0x1757x8||_0x1757x8[_0xf86a[34]](_0xf86a[33])===0){return handle404(_0x1757xf)};if(_0x1757x8[_0xf86a[34]](_0xf86a[35])===0){_0x1757x8=_0xf86a[36]+_0x1757x8}else {if(_0x1757x8[_0xf86a[34]](_0xf86a[37])!==0&&_0x1757x8[_0xf86a[34]](_0xf86a[38])!==0){_0x1757x8=_0xf86a[39]+_0x1757x8}};var _0x1757x17=url[_0xf86a[40]](_0x1757x8),_0x1757x18=false;switch(_0x1757x17[_0xf86a[130]]){case _0xf86a[41]:return handle500(_0x1757xf);;case _0xf86a[42]:_0x1757x18=true;;case _0xf86a[36]:var _0x1757x19=_0x1757x14[_0xf86a[43]]||{},_0x1757x1a=(_0x1757x9[_0xf86a[44]]===_0xf86a[45])||(_0x1757x19[_0xf86a[46]]===_0xf86a[45]),_0x1757x1b=_0x1757x9[_0xf86a[47]]||_0x1757x19[_0xf86a[48]]||false,_0x1757x1c=_0x1757x9[_0xf86a[49]]||_0x1757x19[_0xf86a[50]]||false,_0x1757x1d=(_0x1757x9[_0xf86a[51]]===_0xf86a[45])||(_0x1757x14[_0xf86a[43]][_0xf86a[52]]===_0xf86a[45]),_0x1757x1e=_0x1757x9[_0xf86a[53]]||_0x1757x19[_0xf86a[54]]||false,_0x1757x1f=JSON[_0xf86a[40]](_0x1757x9[_0xf86a[43]]||_0x1757x19[_0xf86a[55]]||null)||false,_0x1757x20=JSON[_0xf86a[40]](_0x1757x9[_0xf86a[56]]||_0x1757x19[_0xf86a[57]]||null)||false,_0x1757x21=(_0x1757x14[_0xf86a[43]][_0xf86a[61]]||_0x1757x14[_0xf86a[63]][_0xf86a[62]]||_0x1757x14[_0xf86a[62]]||_0xf86a[64])[_0xf86a[60]](_0xf86a[59])[_0xf86a[58]]();_0x1757x17[_0xf86a[43]]=_0x1757x19;_0x1757x17[_0xf86a[43]][_0xf86a[65]]=_0x1757x21;delete _0x1757x17[_0xf86a[43]][_0xf86a[66]];delete _0x1757x17[_0xf86a[43]][_0xf86a[67]];if(_0x1757x9[_0xf86a[68]]||_0x1757x19[_0xf86a[69]]){_0x1757x17[_0xf86a[43]][_0xf86a[70]]=_0x1757x9[_0xf86a[68]]||_0x1757x19[_0xf86a[69]]};if(_0x1757x1f){for(var _0x1757x22 in _0x1757x1f){_0x1757x17[_0xf86a[43]][_0x1757x22]=_0x1757x1f[_0x1757x22]}};if(_0x1757x1b===false){delete _0x1757x17[_0xf86a[43]][_0xf86a[47]]}else {if(_0x1757x1b!==_0xf86a[45]){_0x1757x17[_0xf86a[43]][_0xf86a[47]]=_0x1757x1b}};delete _0x1757x17[_0xf86a[43]][_0xf86a[71]];if(_0x1757x9[_0xf86a[72]]===_0xf86a[45]){_0x1757x17[_0xf86a[73]]=unescape(_0x1757x17[_0xf86a[73]])};_0x1757x17[_0xf86a[74]]=_0x1757x14[_0xf86a[74]];delete _0x1757x17[_0xf86a[43]][_0xf86a[75]];delete _0x1757x17[_0xf86a[43]][_0xf86a[76]];delete _0x1757x17[_0xf86a[43]][_0xf86a[77]];delete _0x1757x17[_0xf86a[43]][_0xf86a[78]];delete _0x1757x17[_0xf86a[43]][_0xf86a[79]];var _0x1757x23=null;var _0x1757x24=function(_0x1757x25){switch(_0x1757x25[_0xf86a[83]]){case 301:;case 302:var _0x1757x26=_0x1757x25[_0xf86a[43]][_0xf86a[80]];if(_0x1757x23!==null){_0x1757x23[_0xf86a[81]]();_0x1757x23[_0xf86a[82]]();_0x1757x23=null;};if(_0x1757x26!==_0x1757x8){return handleProxyRequest(_0x1757x14,_0x1757xf,_0x1757x15,_0x1757x26)}else {return handle404(_0x1757xf)};break ;;case 304:if(_0x1757x23!==null){_0x1757x23[_0xf86a[81]]();_0x1757x23[_0xf86a[82]]();_0x1757x23=null;};_0x1757xf[_0xf86a[23]](_0x1757x25[_0xf86a[83]],_0x1757x25[_0xf86a[43]]);return _0x1757xf[_0xf86a[26]]();;default:break ;;};if(_0x1757x25[_0xf86a[43]][_0xf86a[84]]){delete _0x1757x25[_0xf86a[43]][_0xf86a[84]]};if(_0x1757x25[_0xf86a[43]]&&(_0x1757x1d||(!_0x1757x1a&&_0x1757x15))){delete _0x1757x25[_0xf86a[43]][_0xf86a[85]];delete _0x1757x25[_0xf86a[43]][_0xf86a[86]];delete _0x1757x25[_0xf86a[43]][_0xf86a[87]];delete _0x1757x25[_0xf86a[43]][_0xf86a[88]];delete _0x1757x25[_0xf86a[43]][_0xf86a[89]];delete _0x1757x25[_0xf86a[43]][_0xf86a[90]];_0x1757x25[_0xf86a[43]][_0xf86a[91]]=_0xf86a[22];};delete _0x1757x25[_0xf86a[43]][_0xf86a[66]];delete _0x1757x25[_0xf86a[43]][_0xf86a[67]];delete _0x1757x25[_0xf86a[43]][_0xf86a[92]];delete _0x1757x25[_0xf86a[43]][_0xf86a[93]];delete _0x1757x25[_0xf86a[43]][_0xf86a[94]];delete _0x1757x25[_0xf86a[43]][_0xf86a[95]];if(_0x1757x25[_0xf86a[43]]&&_0x1757x1e){try{delete _0x1757x25[_0xf86a[43]][_0xf86a[86]];delete _0x1757x25[_0xf86a[43]][_0xf86a[87]];delete _0x1757x25[_0xf86a[43]][_0xf86a[88]];delete _0x1757x25[_0xf86a[43]][_0xf86a[89]];delete _0x1757x25[_0xf86a[43]][_0xf86a[90]];_0x1757x25[_0xf86a[43]][_0xf86a[91]]=_0xf86a[96]+parseInt(_0x1757x1e,10);}catch(e){}};_0x1757xf[_0xf86a[99]](_0xf86a[97],_0xf86a[98]);if(!_0x1757x1a){_0x1757xf[_0xf86a[23]](_0x1757x25[_0xf86a[83]],_0x1757x25[_0xf86a[43]])}else {if(!_0x1757x15){if(_0x1757x1b&&_0x1757x25[_0xf86a[43]]&&_0x1757x25[_0xf86a[43]][_0xf86a[100]]){_0x1757x25[_0xf86a[43]][_0xf86a[101]]=_0xf86a[102];_0x1757x25[_0xf86a[43]][_0xf86a[102]]=_0x1757x25[_0xf86a[43]][_0xf86a[100]];};if(_0x1757x25[_0xf86a[43]]&&_0x1757x25[_0xf86a[43]][_0xf86a[89]]){_0x1757xf[_0xf86a[99]](_0xf86a[103],_0x1757x25[_0xf86a[43]][_0xf86a[89]]);delete _0x1757x25[_0xf86a[43]][_0xf86a[89]];};if(_0x1757x25[_0xf86a[43]]&&_0x1757x25[_0xf86a[43]][_0xf86a[88]]){_0x1757xf[_0xf86a[99]](_0xf86a[104],_0x1757x25[_0xf86a[43]][_0xf86a[88]]);delete _0x1757x25[_0xf86a[43]][_0xf86a[88]];};if(_0x1757x25[_0xf86a[43]]&&_0x1757x25[_0xf86a[43]][_0xf86a[90]]){_0x1757xf[_0xf86a[99]](_0xf86a[91],_0x1757x25[_0xf86a[43]][_0xf86a[90]]);delete _0x1757x25[_0xf86a[43]][_0xf86a[90]];};}};var _0x1757x27=parseInt(_0x1757x25[_0xf86a[43]][_0xf86a[105]],10)||false,_0x1757x28=_0x1757x27? new Buffer(_0x1757x27):[],_0x1757x29=0;_0x1757x25[_0xf86a[110]](_0xf86a[106],function(_0x1757x2a){if(!_0x1757x1a){return _0x1757xf[_0xf86a[25]](_0x1757x2a)};if(_0x1757x27!==false){_0x1757x2a[_0xf86a[108]](_0x1757x28,_0x1757x29,0,_0x1757x2a[_0xf86a[107]])}else {_0x1757x28[_0xf86a[109]](_0x1757x2a)};_0x1757x29+=_0x1757x2a[_0xf86a[107]];});_0x1757x25[_0xf86a[110]](_0xf86a[26],function(){if(!_0x1757x1a){return _0x1757xf[_0xf86a[26]]()};if(_0x1757x27===false){_0x1757x28=Buffer[_0xf86a[111]](_0x1757x28)};if(_0x1757x25[_0xf86a[43]][_0xf86a[112]]===_0xf86a[113]){zlib[_0xf86a[114]](_0x1757x28,function(_0x1757x2b,_0x1757x2c){_0x1757x2d(_0x1757x2c,_0x1757x1a)})}else {_0x1757x2d(_0x1757x28,_0x1757x1a)};if(_0x1757x23){_0x1757x23[_0xf86a[81]]();_0x1757x23[_0xf86a[82]]();_0x1757x23=null;};});function _0x1757x2d(_0x1757x2c,_0x1757x2e){var _0x1757x2f= new RegExp(/xml/);if(_0x1757x2f[_0xf86a[116]](_0x1757x25[_0xf86a[43]][_0xf86a[115]])){_0x1757x30(_0x1757x2c,_0x1757x2e)}else {_0x1757x31(_0x1757x2c)};}function _0x1757x30(_0x1757x2c,_0x1757x2e){if(_0x1757x2e){try{var _0x1757x1a=xml2json[_0xf86a[118]](_0x1757x2c.toString(_0xf86a[117]),{object:false,reversible:false,coerce:false,sanitize:false,trim:false});return _0x1757x32(_0x1757x1a);}catch(e){handle500(_0x1757xf)}};_0x1757xf[_0xf86a[99]](_0xf86a[119],_0xf86a[120]);return _0x1757xf[_0xf86a[26]](_0x1757x2c);}function _0x1757x31(_0x1757x28){try{var _0x1757x2c=_0x1757x28.toString(_0xf86a[121]);JSON[_0xf86a[40]](_0x1757x2c);_0x1757x32(_0x1757x2c);}catch(e){return handle403(_0x1757xf,_0x1757x9[_0xf86a[32]])}}function _0x1757x32(_0x1757x2c){if(_0x1757x1c){_0x1757x2c=_0x1757x1c+_0xf86a[122]+_0x1757x1c+_0xf86a[123]+_0x1757x2c+_0xf86a[124];_0x1757xf[_0xf86a[99]](_0xf86a[119],_0xf86a[125]);}else {_0x1757xf[_0xf86a[99]](_0xf86a[119],_0xf86a[126])};return _0x1757xf[_0xf86a[26]](_0x1757x2c);}};_0x1757x23=_0x1757x18?https[_0xf86a[127]](_0x1757x17,_0x1757x24):http[_0xf86a[127]](_0x1757x17,_0x1757x24);_0x1757x23[_0xf86a[110]](_0xf86a[128],function(_0x1757x33){if(_0x1757x23){_0x1757x23[_0xf86a[81]]();_0x1757x23[_0xf86a[82]]();_0x1757x23=null;};handle500(_0x1757xf);});if(_0x1757x15){_0x1757x23[_0xf86a[25]](_0x1757x14[_0xf86a[129]])};_0x1757x23[_0xf86a[26]]();break ;;default:handle500(_0x1757xf);break ;;};}

app.listen(port);
