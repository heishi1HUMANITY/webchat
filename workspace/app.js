const express = require('express');
const socketIO = require('socket.io');
const mongodb = require('mongodb');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const dburl = 'mongodb://root:chatappdb@db:27017';
const connectOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const mongoClient = mongodb.MongoClient;

io.on('connection', (socket) => {
  console.log('connected');
  (async () => {
    const client = await mongoClient.connect(dburl, connectOption);
    const collection = await client.db('easychat').collection('chatdata');
    const docs = await collection.find({}).toArray();
    io.to(socket.id).emit('init', docs);
    client.close();
  })();

  socket.on('submit', async (data) => {
    const doc = { text: data.text, name: data.name, time: data.time };
    console.log(data);
    const client = await mongoClient.connect(dburl, connectOption);
    const collection = await client.db('easychat').collection('chatdata');
    await collection.insertOne(doc);
    client.close();
    socket.broadcast.emit('update', doc);
  });
});

app.use(express.static(path.join(__dirname, 'public')));

server.listen(8080, () => console.log('server is listening at 8080'));
