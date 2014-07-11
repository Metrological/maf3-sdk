var connect = require('connect');
var serveStatic = require('serve-static');
var app = connect(); 
app.use(serveStatic(__dirname),  {default: 'index.html'}); app.listen(8080); 
