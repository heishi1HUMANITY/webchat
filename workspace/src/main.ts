'use strict';
import * as io from 'socket.io-client';

const socket = io.io();

class ChatData {
  text: string;
  name: string;
  time: string;
  constructor(text: string, name: string) {
    this.text = text;
    this.name = name;
    this.time = new Date().toString();
  }
}

const showData = (data: [ChatData], target: string) => {
  const targetElement = document.querySelector(target);
  for (const d of data) {
    const tmp = document.createElement('p');
    tmp.innerText = `${d.text} : ${d.name} ${d.time}`;
    tmp.setAttribute('style', 'border-bottom: 1px solid black;');
    targetElement.appendChild(tmp);
  }
};

socket.on('init', (data: [ChatData]) => {
  showData(data, '#chat_container');
});

socket.on('update', data => {
  showData([data], '#chat_container');
});

const submit: HTMLButtonElement = document.querySelector('#submit');
const name: HTMLInputElement = document.querySelector('#name');
const text: HTMLTextAreaElement = document.querySelector('#text');
submit.addEventListener('click', () => {
  const data = new ChatData(text.value, name.value)
  socket.emit('submit', data);
  [text.value, name.value] = ['', ''];
  showData([data], '#chat_container');
});