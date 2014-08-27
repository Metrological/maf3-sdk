var express = require('express'),
	morgan  = require('morgan'),
	compression = require('compression'),
	bodyParser = require('body-parser'),
	app = express(),
	port = process.env.NODE_PORT || 8080;

app.use(morgan('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.disable('x-powered-by');
app.listen(port);
