const express = require('express'); // Access
const socket = require('socket.io');

const app = express(); //  app initialized and server ready

app.use(express.static('public'));

let port = 8080;
let server = app.listen(port, () => {
  console.log('listening to port ' + port);
});

let io = socket(server);

io.on('connection', (socket) => {
  console.log('socket connnection successful');

  // received data
  socket.on('beginPath', (data) => {
    // data -> data from frontend
    // Now transfer data to all computers
    io.sockets.emit('beginPath', data);
  });

  socket.on('drawStroke', (data) => {
    io.sockets.emit('drawStroke', data);
  });

  socket.on('redoUndo', (data) => {
    io.sockets.emit('redoUndo', data);
  });
});
