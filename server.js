require('dotenv').config({ path: './config.env' });
const app = require('./app');
const { Server } = require('socket.io');
const http = require('http');
const mongoose = require('mongoose');

const {
  authenticateSocket,
  groupChatHandler,
} = require('./socket/groupChatHandler');

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  transports: ['websocket', 'polling'],
});

io.use(authenticateSocket);
groupChatHandler(io);

app.set('io', io);

const DB = process.env.DATABASE?.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD || '',
);

if (!DB || DB.includes('cluster.mongodb.net') || DB.includes('user:password')) {
  console.error(
    'DB Connection Error ❌ Invalid or placeholder DATABASE in config.env. ' +
      'Set DATABASE to your real MongoDB Atlas URI (e.g. mongodb+srv://USER:PASSWORD@YOUR-CLUSTER.xxxxx.mongodb.net/...).'
  );
  process.exit(1);
}

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful! 🎉'))
  .catch((err) => console.error('DB Connection Error ❌', err));

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
