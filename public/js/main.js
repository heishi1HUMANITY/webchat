// 必要なhtmlエレメント
const chatContainer = document.querySelector('#chat_container');
const name = document.querySelector('#name');
const text = document.querySelector('#text');
const submit = document.querySelector('#submit');

// socket
const socket = io();

// 表示用関数
const printData = data => {
  for(const d of data) {
    const p = document.createElement('p');
    p.innerText = `${d.text} : ${d.name} ${d.timestamp}`;
    chatContainer.appendChild(p);
  }
};

// 最初のデータを受信
socket.once('initialData', data => {
  printData(data);
});

class ChatData {
  static makeData = (name, text) => {
    return {
      name: name,
      text: text,
      timestamp: new Date().toLocaleDateString()
    };
  };
}

// 追加データの送信処理
const submitData = () => {
  const data = ChatData.makeData(name.value, text.value)
  socket.emit('submitData', data);
  printData([data]);
  name.value = '';
  text.value = '';
};

// submitボタンのクリック時に実行
submit.addEventListener('click', submitData);

// 追加データの受信処理
socket.on('updateData', data => {
  printData([data]);
});
