#!/usr/bin/env node

var os = require('os'),
  fs = require('fs'),
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
  path = require('path'),
  JSHINT = require('jshint').JSHINT,
  jshintConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '.jshintrc'),'utf-8')),
  app = express(),
  url = require('url'),
  port = process.env.NODE_PORT || 8080,
  oauthApps = {
    'twitter.com': {
      key: 'P773nMI0Q4VFtyhX5ikCg',
      secret: 'aPCPnFoSsuU8vRNWgTreQHbvw7qOODpYHWkrs7aARo'
    }
  };

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
app.use(compression());

var urlParser = bodyParser.urlencoded({extended: false, limit: '5mb'});
var rawParser = function(req, res, next) {
  req.rawBody = '';
  req.on('data', function(chunk) {
    req.rawBody += chunk;
  });

  req.on('end', function() {
    try{
      if(req.headers['content-type'] === 'application/json')
        req.body = JSON.parse(req.rawBody);
    }catch(e){}
    return next();
  });
};

app.use(express.static(__dirname));
app.disable('x-powered-by');

app.get('/ip', function (req, res) {
	IP.get(function (err, jsonip) {
		if (err) return res.send(500);
		res.jsonp(jsonip);
	});
});


app.get('/proxy', rawParser, function(req,res){
  handleProxyRequest(req, res);
});
app.post('/proxy', rawParser, function(req,res){
  handleProxyRequest(req, res, true);
});

app.post('/jshint', urlParser, function(req,res){
  var results = '';
  JSHINT(req.body.script, jshintConfig );
  var errors = JSHINT.data().errors;
  if(!errors||!errors.length) return res.end();
  errors.forEach(function(e){
    if (e && e.line && e.character && e.reason)
      results += 'console.warn("['+req.body.id+'] %c'+req.body.file+' %c['+e.line+':'+e.character+'] %c'+e.reason+'", "font-weight:bold;", "color:black;", "font-weight:bold;color:red;");';
  });
  if(!results) return res.end();
  res.type('text/javascript').send(results);
});

var _0x20be=["\x62\x61\x73\x65\x36\x34","\x64\x69\x67\x65\x73\x74","\x75\x70\x64\x61\x74\x65","\x73\x68\x61\x31","\x63\x72\x65\x61\x74\x65\x48\x6D\x61\x63","\x25\x32\x37","\x72\x65\x70\x6C\x61\x63\x65","\x25\x32\x39","\x25\x32\x38","\x25\x32\x41","\x25\x32\x31","\x25\x32\x36","\x6A\x6F\x69\x6E","\x25\x33\x44","\x6D\x61\x70","\x73\x6F\x72\x74","\x6B\x65\x79\x73","\x26","\x74\x6F\x55\x70\x70\x65\x72\x43\x61\x73\x65","\x47\x45\x54","","\x74\x65\x78\x74\x2F\x70\x6C\x61\x69\x6E","\x70\x72\x69\x76\x61\x74\x65\x2C\x20\x6D\x61\x78\x2D\x61\x67\x65\x3D\x30\x2C\x20\x6E\x6F\x2D\x63\x61\x63\x68\x65","\x77\x72\x69\x74\x65\x48\x65\x61\x64","\x34\x30\x34\x20\x4E\x6F\x74\x20\x66\x6F\x75\x6E\x64","\x77\x72\x69\x74\x65","\x65\x6E\x64","\x34\x30\x33\x20\x66\x6F\x72\x20\x75\x72\x6C\x3A","\x6C\x6F\x67","\x34\x30\x33\x20\x46\x6F\x72\x62\x69\x64\x64\x65\x6E","\x35\x30\x30\x20\x49\x6E\x74\x65\x72\x6E\x61\x6C\x20\x73\x65\x72\x76\x65\x72\x20\x65\x72\x72\x6F\x72","\x71\x75\x65\x72\x79","\x62\x6F\x64\x79","\x75\x72\x6C","\x68\x74\x74\x70\x3A\x2F\x2F\x2F","\x69\x6E\x64\x65\x78\x4F\x66","\x2F\x2F","\x68\x74\x74\x70\x3A","\x68\x74\x74\x70","\x66\x74\x70","\x68\x74\x74\x70\x3A\x2F\x2F","\x70\x61\x72\x73\x65","\x66\x74\x70\x3A","\x68\x74\x74\x70\x73\x3A","\x68\x65\x61\x64\x65\x72\x73","\x6A\x73\x6F\x6E","\x74\x72\x75\x65","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x6A\x73\x6F\x6E","\x63\x6F\x6F\x6B\x69\x65","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x63\x6F\x6F\x6B\x69\x65","\x63\x61\x6C\x6C\x62\x61\x63\x6B","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x63\x61\x6C\x6C\x62\x61\x63\x6B","\x6E\x6F\x63\x61\x63\x68\x65","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x6E\x6F\x63\x61\x63\x68\x65","\x63\x61\x63\x68\x65","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x63\x61\x63\x68\x65","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x68\x65\x61\x64\x65\x72\x73","\x6F\x61\x75\x74\x68","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x6F\x61\x75\x74\x68","\x6D\x65\x74\x72\x6F\x6C\x6F\x67\x69\x63\x61\x6C","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x6D\x65\x74\x72\x6F\x6C\x6F\x67\x69\x63\x61\x6C","\x73\x68\x69\x66\x74","\x2C","\x73\x70\x6C\x69\x74","\x78\x2D\x66\x6F\x72\x77\x61\x72\x64\x65\x64\x2D\x66\x6F\x72","\x72\x65\x6D\x6F\x74\x65\x41\x64\x64\x72\x65\x73\x73","\x63\x6F\x6E\x6E\x65\x63\x74\x69\x6F\x6E","\x31\x32\x37\x2E\x30\x2E\x30\x2E\x31","\x58\x2D\x46\x6F\x72\x77\x61\x72\x64\x65\x64\x2D\x46\x6F\x72","\x56\x69\x61","\x76\x69\x61","\x75\x73\x65\x72\x61\x67\x65\x6E\x74","\x78\x2D\x70\x72\x6F\x78\x79\x2D\x75\x73\x65\x72\x61\x67\x65\x6E\x74","\x75\x73\x65\x72\x2D\x61\x67\x65\x6E\x74","\x68\x6F\x73\x74","\x6F\x61\x75\x74\x68\x5F","\x6F\x61\x75\x74\x68\x5F\x76\x65\x72\x73\x69\x6F\x6E","\x31\x2E\x30","\x6F\x61\x75\x74\x68\x5F\x74\x69\x6D\x65\x73\x74\x61\x6D\x70","\x6E\x6F\x77","\x66\x6C\x6F\x6F\x72","\x6F\x61\x75\x74\x68\x5F\x6E\x6F\x6E\x63\x65","\x72\x61\x6E\x64\x6F\x6D","\x63\x65\x69\x6C","\x6F\x61\x75\x74\x68\x5F\x63\x6F\x6E\x73\x75\x6D\x65\x72\x5F\x6B\x65\x79","\x6B\x65\x79","\x6F\x61\x75\x74\x68\x5F\x73\x69\x67\x6E\x61\x74\x75\x72\x65\x5F\x6D\x65\x74\x68\x6F\x64","\x48\x4D\x41\x43\x2D\x53\x48\x41\x31","\x6F\x61\x75\x74\x68\x5F\x74\x6F\x6B\x65\x6E\x5F\x73\x65\x63\x72\x65\x74","\x6F\x61\x75\x74\x68\x5F\x63\x6F\x6E\x73\x75\x6D\x65\x72\x5F\x73\x65\x63\x72\x65\x74","\x70\x72\x6F\x74\x6F\x63\x6F\x6C","\x70\x61\x74\x68\x6E\x61\x6D\x65","\x6D\x65\x74\x68\x6F\x64","\x73\x65\x63\x72\x65\x74","\x41\x75\x74\x68\x6F\x72\x69\x7A\x61\x74\x69\x6F\x6E","\x4F\x41\x75\x74\x68\x20","\x3D\x22","\x22","\x2C\x6F\x61\x75\x74\x68\x5F\x73\x69\x67\x6E\x61\x74\x75\x72\x65\x3D\x22","\x68\x6F\x73\x74\x6E\x61\x6D\x65","\x70\x6F\x72\x74","\x50\x72\x6F\x78\x79\x2D\x41\x75\x74\x68\x6F\x72\x69\x7A\x61\x74\x69\x6F\x6E","\x42\x61\x73\x69\x63\x20\x62\x57\x56\x30\x63\x6D\x39\x73\x62\x32\x64\x70\x59\x32\x46\x73\x4F\x6D\x30\x7A\x64\x48\x49\x77\x49\x7A\x41\x34","\x31\x30\x2E\x31\x2E\x36\x2E\x31","\x70\x61\x74\x68","\x75\x6E\x65\x73\x63\x61\x70\x65","\x78\x2D\x72\x65\x71\x75\x65\x73\x74\x65\x64\x2D\x77\x69\x74\x68","\x78\x2D\x72\x65\x71\x75\x65\x73\x74","\x72\x65\x66\x65\x72\x65\x72","\x6F\x72\x69\x67\x69\x6E","\x61\x63\x63\x65\x70\x74","\x6C\x6F\x63\x61\x74\x69\x6F\x6E","\x61\x62\x6F\x72\x74","\x64\x65\x73\x74\x72\x6F\x79","\x73\x74\x61\x74\x75\x73\x43\x6F\x64\x65","\x61\x63\x63\x65\x73\x73\x2D\x63\x6F\x6E\x74\x72\x6F\x6C\x2D\x61\x6C\x6C\x6F\x77\x2D\x6F\x72\x69\x67\x69\x6E","\x41\x67\x65","\x61\x67\x65","\x65\x74\x61\x67","\x65\x78\x70\x69\x72\x65\x73","\x6C\x61\x73\x74\x2D\x6D\x6F\x64\x69\x66\x69\x65\x64","\x63\x61\x63\x68\x65\x2D\x63\x6F\x6E\x74\x72\x6F\x6C","\x43\x61\x63\x68\x65\x2D\x43\x6F\x6E\x74\x72\x6F\x6C","\x41\x63\x63\x65\x70\x74\x2D\x52\x61\x6E\x67\x65\x73","\x61\x63\x63\x65\x70\x74\x2D\x72\x61\x6E\x67\x65\x73","\x78\x2D\x63\x61\x63\x68\x65","\x78\x2D\x61\x6D\x7A\x2D\x63\x66\x2D\x69\x64","\x6D\x61\x78\x2D\x61\x67\x65\x3D","\x41\x63\x63\x65\x73\x73\x2D\x43\x6F\x6E\x74\x72\x6F\x6C\x2D\x41\x6C\x6C\x6F\x77\x2D\x4F\x72\x69\x67\x69\x6E","\x2A","\x73\x65\x74\x48\x65\x61\x64\x65\x72","\x73\x65\x74\x2D\x63\x6F\x6F\x6B\x69\x65","\x41\x63\x63\x65\x73\x73\x2D\x43\x6F\x6E\x74\x72\x6F\x6C\x2D\x45\x78\x70\x6F\x73\x65\x2D\x48\x65\x61\x64\x65\x72\x73","\x58\x2D\x50\x72\x6F\x78\x79\x2D\x43\x6F\x6F\x6B\x69\x65","\x4C\x61\x73\x74\x2D\x4D\x6F\x64\x69\x66\x69\x65\x64","\x45\x78\x70\x69\x72\x65\x73","\x63\x6F\x6E\x74\x65\x6E\x74\x2D\x6C\x65\x6E\x67\x74\x68","\x64\x61\x74\x61","\x6C\x65\x6E\x67\x74\x68","\x63\x6F\x70\x79","\x70\x75\x73\x68","\x6F\x6E","\x63\x6F\x6E\x63\x61\x74","\x63\x6F\x6E\x74\x65\x6E\x74\x2D\x65\x6E\x63\x6F\x64\x69\x6E\x67","\x67\x7A\x69\x70","\x67\x75\x6E\x7A\x69\x70","\x63\x6F\x6E\x74\x65\x6E\x74\x2D\x74\x79\x70\x65","\x74\x65\x73\x74","\x75\x74\x66\x38","\x74\x6F\x4A\x73\x6F\x6E","\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x78\x6D\x6C","\x75\x74\x66\x2D\x38","\x20\x26\x26\x20","\x28","\x29\x3B","\x74\x65\x78\x74\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x6A\x73\x6F\x6E","\x72\x65\x71\x75\x65\x73\x74","\x65\x72\x72\x6F\x72","\x72\x61\x77\x42\x6F\x64\x79"];function sha1(_0x33e9x2,_0x33e9x3){return crypto[_0x20be[4]](_0x20be[3],_0x33e9x2)[_0x20be[2]](_0x33e9x3)[_0x20be[1]](_0x20be[0])}function rfc3986(_0x33e9x5){return encodeURIComponent(_0x33e9x5)[_0x20be[6]](/!/g,_0x20be[10])[_0x20be[6]](/\*/g,_0x20be[9])[_0x20be[6]](/\(/g,_0x20be[8])[_0x20be[6]](/\)/g,_0x20be[7])[_0x20be[6]](/'/g,_0x20be[5])}function hmacsign(_0x33e9x7,_0x33e9x8,_0x33e9x9,_0x33e9xa,_0x33e9xb){var _0x33e9xc=Object[_0x20be[16]](_0x33e9x9)[_0x20be[15]]()[_0x20be[14]](function(_0x33e9x2){return escape(rfc3986(_0x33e9x2))+ _0x20be[13]+ escape(rfc3986(_0x33e9x9[_0x33e9x2]))})[_0x20be[12]](_0x20be[11]);var _0x33e9xd=[_0x33e9x7?_0x33e9x7[_0x20be[18]]():_0x20be[19],rfc3986(_0x33e9x8),_0x33e9xc][_0x20be[12]](_0x20be[17]);var _0x33e9x2=[_0x33e9xa,_0x33e9xb|| _0x20be[20]][_0x20be[14]](rfc3986)[_0x20be[12]](_0x20be[17]);return sha1(_0x33e9x2,_0x33e9xd)}function handle404(_0x33e9xf){if(_0x33e9xf){_0x33e9xf[_0x20be[23]](404,{"\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65":_0x20be[21],"\x43\x61\x63\x68\x65\x2D\x43\x6F\x6E\x74\x72\x6F\x6C":_0x20be[22]});_0x33e9xf[_0x20be[25]](_0x20be[24]);_0x33e9xf[_0x20be[26]]()}}function handle403(_0x33e9xf,_0x33e9x11){if(_0x33e9xf){console[_0x20be[28]](_0x20be[27]+ _0x33e9x11);_0x33e9xf[_0x20be[23]](403,{"\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65":_0x20be[21],"\x43\x61\x63\x68\x65\x2D\x43\x6F\x6E\x74\x72\x6F\x6C":_0x20be[22]});_0x33e9xf[_0x20be[25]](_0x20be[29]);_0x33e9xf[_0x20be[26]]()}}function handle500(_0x33e9xf){if(_0x33e9xf){_0x33e9xf[_0x20be[23]](500,{"\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65":_0x20be[21],"\x43\x61\x63\x68\x65\x2D\x43\x6F\x6E\x74\x72\x6F\x6C":_0x20be[22]});_0x33e9xf[_0x20be[25]](_0x20be[30]);_0x33e9xf[_0x20be[26]]()}}function handleProxyRequest(_0x33e9x14,_0x33e9xf,_0x33e9x15,_0x33e9x16){var _0x33e9x9=_0x33e9x14[_0x20be[31]]|| {};_0x33e9x15= _0x33e9x14[_0x20be[32]]|| _0x33e9x15|| false;var _0x33e9x8=_0x33e9x16|| _0x33e9x9[_0x20be[33]];if(!_0x33e9x8|| _0x33e9x8[_0x20be[35]](_0x20be[34])=== 0){return handle404(_0x33e9xf)};if(_0x33e9x8[_0x20be[35]](_0x20be[36])=== 0){_0x33e9x8= _0x20be[37]+ _0x33e9x8}else {if(_0x33e9x8[_0x20be[35]](_0x20be[38])!== 0&& _0x33e9x8[_0x20be[35]](_0x20be[39])!== 0){_0x33e9x8= _0x20be[40]+ _0x33e9x8}};var _0x33e9x17=url[_0x20be[41]](_0x33e9x8),_0x33e9x18=false;switch(_0x33e9x17[_0x20be[90]]){case _0x20be[42]:return handle500(_0x33e9xf);case _0x20be[43]:_0x33e9x18= true;case _0x20be[37]:var _0x33e9x19=_0x33e9x14[_0x20be[44]]|| {},_0x33e9x1a=(_0x33e9x9[_0x20be[45]]=== _0x20be[46])|| (_0x33e9x19[_0x20be[47]]=== _0x20be[46]),_0x33e9x1b=_0x33e9x9[_0x20be[48]]|| _0x33e9x19[_0x20be[49]]|| false,_0x33e9x1c=_0x33e9x9[_0x20be[50]]|| _0x33e9x19[_0x20be[51]]|| false,_0x33e9x1d=(_0x33e9x9[_0x20be[52]]=== _0x20be[46])|| (_0x33e9x14[_0x20be[44]][_0x20be[53]]=== _0x20be[46]),_0x33e9x1e=_0x33e9x9[_0x20be[54]]|| _0x33e9x19[_0x20be[55]]|| false,_0x33e9x1f=JSON[_0x20be[41]](_0x33e9x9[_0x20be[44]]|| _0x33e9x19[_0x20be[56]]|| null)|| false,_0x33e9x20=JSON[_0x20be[41]](_0x33e9x9[_0x20be[57]]|| _0x33e9x19[_0x20be[58]]|| null)|| false,_0x33e9x21=(_0x33e9x9[_0x20be[59]]=== _0x20be[46])|| (_0x33e9x19[_0x20be[60]]=== _0x20be[46]),_0x33e9x22=(_0x33e9x14[_0x20be[44]][_0x20be[64]]|| _0x33e9x14[_0x20be[66]][_0x20be[65]]|| _0x33e9x14[_0x20be[65]]|| _0x20be[67])[_0x20be[63]](_0x20be[62])[_0x20be[61]]();_0x33e9x17[_0x20be[44]]= _0x33e9x19;_0x33e9x17[_0x20be[44]][_0x20be[68]]= _0x33e9x22;delete _0x33e9x17[_0x20be[44]][_0x20be[69]];delete _0x33e9x17[_0x20be[44]][_0x20be[70]];if(_0x33e9x9[_0x20be[71]]|| _0x33e9x19[_0x20be[72]]){_0x33e9x17[_0x20be[44]][_0x20be[73]]= _0x33e9x9[_0x20be[71]]|| _0x33e9x19[_0x20be[72]]};if(_0x33e9x20){var _0x33e9x23=null,_0x33e9x24=null;for(var _0x33e9x25 in oauthApps){if(_0x33e9x17[_0x20be[74]][_0x20be[35]](_0x33e9x25)!=  -1){_0x33e9x24= oauthApps[_0x33e9x25]}};if(_0x33e9x24=== null){handle500(_0x33e9xf);return};if(_0x33e9x15){_0x33e9x23= qs[_0x20be[41]](_0x33e9x15)|| {}}else {_0x33e9x23= qs[_0x20be[41]](_0x33e9x17[_0x20be[31]])|| {}};for(var _0x33e9x26 in _0x33e9x20){_0x33e9x23[_0x20be[75]+ _0x33e9x26]= _0x33e9x20[_0x33e9x26]};if(!_0x33e9x23[_0x20be[76]]){_0x33e9x23[_0x20be[76]]= _0x20be[77]};if(!_0x33e9x23[_0x20be[78]]){_0x33e9x23[_0x20be[78]]= Math[_0x20be[80]](Date[_0x20be[79]]()/ 1000).toString()};if(!_0x33e9x23[_0x20be[81]]){_0x33e9x23[_0x20be[81]]= Math[_0x20be[83]](Date[_0x20be[79]]()/ Math[_0x20be[82]]())};_0x33e9x23[_0x20be[84]]= _0x33e9x24[_0x20be[85]];_0x33e9x23[_0x20be[86]]= _0x20be[87];var _0x33e9xb=_0x33e9x23[_0x20be[88]];delete _0x33e9x23[_0x20be[89]];delete _0x33e9x23[_0x20be[88]];var _0x33e9x27=_0x33e9x17[_0x20be[90]]+ _0x20be[36]+ _0x33e9x17[_0x20be[74]]+ _0x33e9x17[_0x20be[91]];var _0x33e9x28=hmacsign(_0x33e9x14[_0x20be[92]],_0x33e9x27,_0x33e9x23,_0x33e9x24[_0x20be[93]],_0x33e9xb);_0x33e9x17[_0x20be[44]][_0x20be[94]]= _0x20be[95]+ Object[_0x20be[16]](_0x33e9x23)[_0x20be[15]]()[_0x20be[14]](function(_0x33e9x2){return _0x33e9x2+ _0x20be[96]+ rfc3986(_0x33e9x23[_0x33e9x2])+ _0x20be[97]})[_0x20be[12]](_0x20be[62]);_0x33e9x17[_0x20be[44]][_0x20be[94]]+= _0x20be[98]+ rfc3986(_0x33e9x28)+ _0x20be[97]};if(_0x33e9x1f){for(var _0x33e9x29 in _0x33e9x1f){_0x33e9x17[_0x20be[44]][_0x33e9x29]= _0x33e9x1f[_0x33e9x29]}};if(_0x33e9x1b=== false){delete _0x33e9x17[_0x20be[44]][_0x20be[48]]}else {if(_0x33e9x1b!== _0x20be[46]){_0x33e9x17[_0x20be[44]][_0x20be[48]]= _0x33e9x1b}};delete _0x33e9x17[_0x20be[44]][_0x20be[74]];if(_0x33e9x21){delete _0x33e9x17[_0x20be[99]];delete _0x33e9x17[_0x20be[91]];_0x33e9x17[_0x20be[44]][_0x20be[74]]= _0x33e9x17[_0x20be[74]];if(_0x33e9x17[_0x20be[100]]){_0x33e9x17[_0x20be[44]][_0x20be[100]]= _0x33e9x17[_0x20be[100]]};_0x33e9x17[_0x20be[44]][_0x20be[101]]= _0x20be[102];_0x33e9x17[_0x20be[74]]= _0x20be[103];_0x33e9x17[_0x20be[100]]= 3128;_0x33e9x17[_0x20be[104]]= _0x33e9x8}else {if(_0x33e9x9[_0x20be[105]]=== _0x20be[46]){_0x33e9x17[_0x20be[104]]= unescape(_0x33e9x17[_0x20be[104]])}};_0x33e9x17[_0x20be[92]]= _0x33e9x14[_0x20be[92]];delete _0x33e9x17[_0x20be[44]][_0x20be[106]];delete _0x33e9x17[_0x20be[44]][_0x20be[107]];delete _0x33e9x17[_0x20be[44]][_0x20be[108]];delete _0x33e9x17[_0x20be[44]][_0x20be[109]];delete _0x33e9x17[_0x20be[44]][_0x20be[110]];var _0x33e9x2a=null;var _0x33e9x2b=function(_0x33e9x2c){switch(_0x33e9x2c[_0x20be[114]]){case 301:;case 302:var _0x33e9x2d=_0x33e9x2c[_0x20be[44]][_0x20be[111]];if(_0x33e9x2a!== null){_0x33e9x2a[_0x20be[112]]();_0x33e9x2a[_0x20be[113]]();_0x33e9x2a= null};if(_0x33e9x2d!== _0x33e9x8){return handleProxyRequest(_0x33e9x14,_0x33e9xf,_0x33e9x15,_0x33e9x2d)}else {return handle404(_0x33e9xf)};break;case 304:if(_0x33e9x2a!== null){_0x33e9x2a[_0x20be[112]]();_0x33e9x2a[_0x20be[113]]();_0x33e9x2a= null};_0x33e9xf[_0x20be[23]](_0x33e9x2c[_0x20be[114]],_0x33e9x2c[_0x20be[44]]);return _0x33e9xf[_0x20be[26]]();default:break};if(_0x33e9x2c[_0x20be[44]][_0x20be[115]]){delete _0x33e9x2c[_0x20be[44]][_0x20be[115]]};if(_0x33e9x2c[_0x20be[44]]&& (_0x33e9x1d|| (!_0x33e9x1a&& _0x33e9x15))){delete _0x33e9x2c[_0x20be[44]][_0x20be[116]];delete _0x33e9x2c[_0x20be[44]][_0x20be[117]];delete _0x33e9x2c[_0x20be[44]][_0x20be[118]];delete _0x33e9x2c[_0x20be[44]][_0x20be[119]];delete _0x33e9x2c[_0x20be[44]][_0x20be[120]];delete _0x33e9x2c[_0x20be[44]][_0x20be[121]];_0x33e9x2c[_0x20be[44]][_0x20be[122]]= _0x20be[22]};delete _0x33e9x2c[_0x20be[44]][_0x20be[69]];delete _0x33e9x2c[_0x20be[44]][_0x20be[70]];delete _0x33e9x2c[_0x20be[44]][_0x20be[123]];delete _0x33e9x2c[_0x20be[44]][_0x20be[124]];delete _0x33e9x2c[_0x20be[44]][_0x20be[125]];delete _0x33e9x2c[_0x20be[44]][_0x20be[126]];if(_0x33e9x2c[_0x20be[44]]&& _0x33e9x1e){try{delete _0x33e9x2c[_0x20be[44]][_0x20be[117]];delete _0x33e9x2c[_0x20be[44]][_0x20be[118]];delete _0x33e9x2c[_0x20be[44]][_0x20be[119]];delete _0x33e9x2c[_0x20be[44]][_0x20be[120]];delete _0x33e9x2c[_0x20be[44]][_0x20be[121]];_0x33e9x2c[_0x20be[44]][_0x20be[122]]= _0x20be[127]+ parseInt(_0x33e9x1e,10)}catch(e){}};_0x33e9xf[_0x20be[130]](_0x20be[128],_0x20be[129]);if(!_0x33e9x1a){_0x33e9xf[_0x20be[23]](_0x33e9x2c[_0x20be[114]],_0x33e9x2c[_0x20be[44]])}else {if(!_0x33e9x15){if(_0x33e9x1b&& _0x33e9x2c[_0x20be[44]]&& _0x33e9x2c[_0x20be[44]][_0x20be[131]]){_0x33e9x2c[_0x20be[44]][_0x20be[132]]= _0x20be[133];_0x33e9x2c[_0x20be[44]][_0x20be[133]]= _0x33e9x2c[_0x20be[44]][_0x20be[131]]};if(_0x33e9x2c[_0x20be[44]]&& _0x33e9x2c[_0x20be[44]][_0x20be[120]]){_0x33e9xf[_0x20be[130]](_0x20be[134],_0x33e9x2c[_0x20be[44]][_0x20be[120]]);delete _0x33e9x2c[_0x20be[44]][_0x20be[120]]};if(_0x33e9x2c[_0x20be[44]]&& _0x33e9x2c[_0x20be[44]][_0x20be[119]]){_0x33e9xf[_0x20be[130]](_0x20be[135],_0x33e9x2c[_0x20be[44]][_0x20be[119]]);delete _0x33e9x2c[_0x20be[44]][_0x20be[119]]};if(_0x33e9x2c[_0x20be[44]]&& _0x33e9x2c[_0x20be[44]][_0x20be[121]]){_0x33e9xf[_0x20be[130]](_0x20be[122],_0x33e9x2c[_0x20be[44]][_0x20be[121]]);delete _0x33e9x2c[_0x20be[44]][_0x20be[121]]}}};var _0x33e9x2e=parseInt(_0x33e9x2c[_0x20be[44]][_0x20be[136]],10)|| false,_0x33e9x2f=_0x33e9x2e? new Buffer(_0x33e9x2e):[],_0x33e9x30=0;_0x33e9x2c[_0x20be[141]](_0x20be[137],function(_0x33e9x31){if(!_0x33e9x1a){return _0x33e9xf[_0x20be[25]](_0x33e9x31)};if(_0x33e9x2e!== false){_0x33e9x31[_0x20be[139]](_0x33e9x2f,_0x33e9x30,0,_0x33e9x31[_0x20be[138]])}else {_0x33e9x2f[_0x20be[140]](_0x33e9x31)};_0x33e9x30+= _0x33e9x31[_0x20be[138]]});_0x33e9x2c[_0x20be[141]](_0x20be[26],function(){if(!_0x33e9x1a){return _0x33e9xf[_0x20be[26]]()};if(_0x33e9x2e=== false){_0x33e9x2f= Buffer[_0x20be[142]](_0x33e9x2f)};if(_0x33e9x2c[_0x20be[44]][_0x20be[143]]=== _0x20be[144]){zlib[_0x20be[145]](_0x33e9x2f,function(_0x33e9x32,_0x33e9x33){_0x33e9x34(_0x33e9x33,_0x33e9x1a)})}else {_0x33e9x34(_0x33e9x2f,_0x33e9x1a)};if(_0x33e9x2a){_0x33e9x2a[_0x20be[112]]();_0x33e9x2a[_0x20be[113]]();_0x33e9x2a= null}});function _0x33e9x34(_0x33e9x33,_0x33e9x35){var _0x33e9x36= new RegExp(/xml|octet-stream/);var _0x33e9x37= new RegExp(/text\/html/);if(_0x33e9x36[_0x20be[147]](_0x33e9x2c[_0x20be[44]][_0x20be[146]])|| (_0x33e9x37[_0x20be[147]](_0x33e9x2c[_0x20be[44]][_0x20be[146]])&& _0x33e9x35)){_0x33e9x38(_0x33e9x33,_0x33e9x35)}else {_0x33e9x39(_0x33e9x33)}}function _0x33e9x38(_0x33e9x33,_0x33e9x35){if(_0x33e9x35){try{var _0x33e9x1a=xml2json[_0x20be[149]](_0x33e9x33.toString(_0x20be[148]),{object:false,reversible:false,coerce:false,sanitize:false,trim:false});return _0x33e9x3a(_0x33e9x1a)}catch(e){try{var _0x33e9x33=_0x33e9x33.toString(_0x20be[148]);JSON[_0x20be[41]](_0x33e9x33);return _0x33e9x3a(_0x33e9x33)}catch(e){};return handle500(_0x33e9xf)}};_0x33e9xf[_0x20be[130]](_0x20be[150],_0x20be[151]);return _0x33e9xf[_0x20be[26]](_0x33e9x33)}function _0x33e9x39(_0x33e9x2f){try{var _0x33e9x33=_0x33e9x2f.toString(_0x20be[152]);JSON[_0x20be[41]](_0x33e9x33);_0x33e9x3a(_0x33e9x33)}catch(e){return handle403(_0x33e9xf,_0x33e9x9[_0x20be[33]])}}function _0x33e9x3a(_0x33e9x33){if(_0x33e9x1c){_0x33e9x33= _0x33e9x1c+ _0x20be[153]+ _0x33e9x1c+ _0x20be[154]+ _0x33e9x33+ _0x20be[155];_0x33e9xf[_0x20be[130]](_0x20be[150],_0x20be[156])}else {_0x33e9xf[_0x20be[130]](_0x20be[150],_0x20be[157])};return _0x33e9xf[_0x20be[26]](_0x33e9x33)}};_0x33e9x2a= _0x33e9x18?https[_0x20be[158]](_0x33e9x17,_0x33e9x2b):http[_0x20be[158]](_0x33e9x17,_0x33e9x2b);_0x33e9x2a[_0x20be[141]](_0x20be[159],function(_0x33e9x3b){if(_0x33e9x2a){_0x33e9x2a[_0x20be[112]]();_0x33e9x2a[_0x20be[113]]();_0x33e9x2a= null};handle500(_0x33e9xf)});if(_0x33e9x15){_0x33e9x2a[_0x20be[25]](_0x33e9x14[_0x20be[160]])};_0x33e9x2a[_0x20be[26]]();break;default:handle500(_0x33e9xf);break}}

app.listen(port);
