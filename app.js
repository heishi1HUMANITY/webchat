//パッケージをプログラム内で使えるようにする
const path = require('path');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

//express.static()は静的なファイルの提供を簡単に行ってくれます
app.use(express.static(path.join(__dirname, 'public')));

//socker.ioを使えるようにする
const socketIO = require('socket.io');
const io = socketIO(server);

class ChatData {
  static makeData = (name, text, timestamp) => {
    return {
      name: name,
      text: text,
      timestamp: timestamp,
    };
  };
}
let storedData = [ChatData.makeData('test', 'this is test text', new Date().toLocaleDateString())];

io.on('connection', socket => {
  console.log('connected');
  // 最初のデータを送信
  io.to(socket.id).emit('initialData', storedData);
  
  // 追加のデータの受信
  socket.on('submitData', data => {
    storedData.push(data);
    // 追加のデータの送信
    socket.broadcast.emit('updateData', data);
  });
});

server.listen(8080, () => console.log('listening on localhost:8080'));
