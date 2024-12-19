const { WebSocket } = require('ws');
const crypto = require('crypto');


class ChatClient {
    constructor(options) {
        this.ws = new WebSocket(options.url);
        this.sessionId = options.sessionId || null;
        this.username = options.username;
        this.key = options.key;
        this.iv = crypto.randomBytes(16);
    }

    init() {
        this.ws.on('open', () => this.onOpen());
        this.ws.on('message', (data) => this.onMessage(data));
        this.ws.on('error', console.error);
    }

    onOpen() {
        console.log('connected');
        this.ws.send(JSON.stringify({ 
            type: 'options',
            sessionId: this.sessionId,
            data: {
                username: this.username
            }
        }));

        
    }

    onMessage(data) {
        const parsedData = JSON.parse(data);
        

        switch (parsedData.type) {
            case 'message': {
                const { message, iv } = parsedData.data;
                const decryptedMessage = this.decrypt(message, iv);
                console.log(`${parsedData.data.sender} >>: ${decryptedMessage}`);
                break;
            }
            case 'options': {
                this.setOptions(parsedData);
                break;
            }
            default:
                console.log('unkown messega type');
        }
    }

    setOptions(msgObject) {
        this.sessionId = msgObject.sessionId;
        console.log('Your sessionId: ', this.sessionId);
    }

    send(data) {
        const { encryted, iv } = this.encrypt(data);
        const msgObject = {
            type: 'message',
            sessionId: this.sessionId,
            data: { message: encrypted, iv }
        };

        this.ws.send(JSON.stringify(msgObject));
    }

    encrypt(data) {
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.key, 'utf-8', this.iv));
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return { encrypted, iv: this.iv.toString('hex') };
    }

    decrypt(encryptedData, iv) {
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.key, 'utf-8'), Buffer.from(iv, 'hex'));
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }


}

module.exports = { ChatClient };