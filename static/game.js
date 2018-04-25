var socket = io();
socket.on('message', function(data) {
  console.log(data);
});


var KEY_CODE = {
  "W": 87,
  "A": 65,
  "S": 83,
  "D": 68,
  "SHIFT": 16,
}

var KEY_ACTION = {};
KEY_ACTION[KEY_CODE["D"]] = "right";
KEY_ACTION[KEY_CODE["S"]] = "down";
KEY_ACTION[KEY_CODE["A"]] = "left";
KEY_ACTION[KEY_CODE["W"]] = "up";
KEY_ACTION[KEY_CODE["SHIFT"]] = "run";


var action = {
  up: false,
  down: false,
  left: false,
  right: false,
  run: false,
}

function setAction(keyCode, isActionOn){
  var direction = KEY_ACTION[keyCode]
  action[direction] = isActionOn;
}
document.addEventListener('keyup', function(event) {
  setAction(event.keyCode, false);
});

document.addEventListener('keydown', function(event) {
  setAction(event.keyCode, true);
});



socket.emit('new player');
setInterval(function() {
  socket.emit('movement', action);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');

var energy = document.getElementById('energy');
energy.value = 10;

var energy = document.getElementById('energyLabel');
energy.innerHTML = "Energy " + 100;


socket.on('state', function(players) {
  context.clearRect(0, 0, 800, 600);
  context.fillStyle = 'red';
  for (var id in players) {
    var player = players[id];
    context.beginPath();
    context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    context.fill();
  }
});
