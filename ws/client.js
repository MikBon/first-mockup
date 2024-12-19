const readline = require('node:readline');

const { ChatClient } = require('./client/ChatClient');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const sessionIdIndex = process.argv.indexOf('--sessionId');
const nameIndex = process.argv.indexOf('--name');
const keyIndex = process.argv.indexOf('--key');

if (sessionIdIndex === -1 || nameIndex === -1 || keyIndex === -1) {
    console.error('Arguments --sessionId, --name, and --key are required');
    process.exit(1);
}

//const sessionId = sessionIdIndex !== -1 ? process.argv[sessionIdIndex + 1] : null;
//const name = nameIndex !== -1 ? process.argv[nameIndex + 1] : null;

const sessionId = process.argv[sessionIdIndex + 1];
const name = process.argv[nameIndex + 1];
const key = process.argv[keyIndex + 1];



init(name, sessionId, key);

function init(name, sessionId, key) {
    const client = new ChatClient({ url: 'ws://localhost:5000', username: name, sessionId, key });
   
    client.init();

    const chatInput = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    chatInput.on('line', (input) => {
        if (input.trim().toLowerCase === 'exit') {
            chatInput.close();
        } else {
            client.send(input);
        }
    });
};