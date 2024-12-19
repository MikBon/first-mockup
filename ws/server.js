const { ChatServer } = require('./server/ChatServer');

const chatServer = new ChatServer({ port: 5000 });

chatServer.init();