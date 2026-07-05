require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const { handelSocketconnection } = require('./sockethandlers');
const locationRouter = require('./controlers/locationControllers');
dotenv.config();
const app = express();
app.use(cors(
  { 
    origin: '*', 
    methods: ['GET', 'POST'], 
    credentials: true}
));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/locations', locationRouter);


io.on('connection', (socket) => {
    
    handelSocketconnection(socket,io);
    
    
    
    
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
