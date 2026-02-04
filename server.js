const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const pty = require('node-pty');

const app = express();
const server = http.createServer(app);

// Allow your website domain to connect
const io = new Server(server, {
  cors: {
    origin: "*", // Later replace with your real domain: "https://xylofra.com"
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User connected to Xylofra Terminal');

  // Spawn a real, interactive Bash shell
  const shell = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: '/home/xylofra',
    env: { ...process.env, TERM: 'xterm-256color' }
  });

  // Stream output from Linux back to your website
  shell.on('data', (data) => {
    socket.emit('output', data);
  });

  // Receive real commands from your website and run them
  socket.on('input', (data) => {
    shell.write(data);
  });

  // Handle terminal resizing
  socket.on('resize', (size) => {
    shell.resize(size.cols, size.rows);
  });

  socket.on('disconnect', () => {
    shell.kill();
    console.log('User session ended');
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log('Xylofra Real-Shell Bridge is active on port ' + PORT);
});
