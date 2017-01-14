var express = require('express');
var app = express();
var ejs = require('ejs');

app.set('port', (process.env.PORT || 5000));
app.engine('.html', ejs.renderFile);
app.set('views', __dirname + '/app');
app.use("/bower_components", express.static(__dirname + '/bower_components'));
app.use("/app.css", express.static(__dirname + '/app/app.css'));
app.use("/js", express.static(__dirname + '/app/js'));
app.use("/app.js", express.static(__dirname + '/app/app.js'));
app.use("/upload", express.static(__dirname + '/app/upload'));



// views is directory for all template files
// app.set('views', __dirname + '/views');

app.get('*', function(request, response) {
  response.render('index.html');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


