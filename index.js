var app = require('express')();
var http = require('http').Server(app);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});

http.listen(process.env.PORT, process.env.IP, function(){
  console.log('listening on :' + process.env.PORT);
});