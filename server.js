//Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

// Add the WebSocket handlers
io.on('connection', function(socket) {
});

// testing functionality
setInterval(function() {
  io.sockets.emit('message', 'hi!');
}, 1000);


class Player{
  constructor(id){
    this.id = id;
    this.upper_x_bounds = 800;
    this.lower_x_bounds = 0;
    this.upper_y_bounds = 600;
    this.lower_y_bounds = 0;

    this.x = 10;
    this.y = 10;
    this.energy = 0;
    this.speedBase = 5;
    this.speedMultiplier = 1.7;

    console.log("New Player " + id);
  }

  move(action){
    var movementSpeed = this.speedBase;

    if (action.run){
      movementSpeed = movementSpeed * this.speedMultiplier;
    }

    if (action.left) {
      this.moveAxis("x", movementSpeed * -1);
    }
    if (action.right) {
      this.moveAxis("x", movementSpeed * 1);
    }

    if (action.up) {
      this.moveAxis("y", movementSpeed * -1);
    }

    if (action.down) {
      this.moveAxis("y", movementSpeed * 1);
    }
  }

  moveAxis(axis, length){
    var upper_bounds;
    var lower_bounds;

    if (axis == "x"){
      upper_bounds = this.upper_x_bounds;
      lower_bounds = this.lower_x_bounds;
    }
    else if (axis == "y"){
      upper_bounds = this.upper_y_bounds;
      lower_bounds = this.lower_y_bounds;
    }
    else{
      console.log("Invalid Axis Call" + axis);
      return;
    }

    var temp = this[axis] + length;

    if (temp > upper_bounds){
      this[axis] = upper_bounds;
    }
    else if (temp < lower_bounds){
      this[axis] = lower_bounds;
    }
    else{
      this[axis] = temp;
    }
  }

};





var players = {};
io.on('connection', function(socket) {
  socket.on('new player', function() {
    players[socket.id] = new Player(socket.id);
  });
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (!(player instanceof Player)){
      delete players[socket.id];
      return;
    }
    player.move(data);

  });
});
setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);




class PlayerFactory{



}
