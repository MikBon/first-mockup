const { WebSocketServer, WebSocket } = require('ws');

const wss = new WebSocketServer({ port: 5000 });



wss.on('connection', function connection(ws) {
    console.log('new connection');
    

    ws.on('message', function message(data) {
        console.log('received msg from client: %s', data);
        
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });

    ws.on('error', console.error);
});
