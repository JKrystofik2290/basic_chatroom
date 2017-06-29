var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var room =[];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});

//could be used to create a site visit counter
io.on('connection', function(socket){
  
  socket.on('disconnect', function(){
    //add username disconnected
    for(var i=0; i<room.length; i++){
      if(socket.id == room[i].id){
        socket.broadcast.emit('chat message', room[i].name + " has left the chatroom!");
        console.log('user: '+ room[i].name +' disconnected');
        room.splice(i,1);
        io.emit('update-room', room);
        break;
      }
    }
  });
  
  socket.on('chat message', function(msg){
    for(var i=0; i<room.length; i++){
      if(socket.id == room[i].id){
        io.emit('chat message', room[i].name + ': ' + msg);
        break;
      }
    }
  });
  
  socket.on('add-user', function(user){
    if(user == null || user == ''){
      user = "Mr.NoName";
    }
    room.push({"id": socket.id, "name": user});
    io.emit('update-room', room);
    socket.broadcast.emit('chat message', user + " has entered the chatroom!");
    console.log('user: ' + user + ' has connected');
  });
});

http.listen(process.env.PORT, process.env.IP, function(){
  console.log('listening on :' + process.env.PORT);
});
