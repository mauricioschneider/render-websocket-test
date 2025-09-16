const express = require('express');
const expressWs = require('express-ws');

const app = express();
expressWs(app);

const port = 3000;

// Idle WebSocket endpoint
app.ws('/idle', (ws, req) => {
    const connectionTime = Date.now();
    console.log('Idle client connected');

    ws.on('close', () => {
        const disconnectTime = Date.now();
        const duration = (disconnectTime - connectionTime) / 1000;
        console.log(`Idle client disconnected. Connection lasted for ${duration.toFixed(2)} seconds.`);
    });
});

// Active WebSocket endpoint
app.ws('/active', (ws, req) => {
    const connectionTime = Date.now();
    console.log('Active client connected');

    // Send a message to the client every minute
    const interval = setInterval(() => {
        if (ws.readyState === ws.OPEN) {
            ws.send(`Server message: It's been a minute! The time is ${new Date().toLocaleTimeString()}`);
        }
    }, 60000); // 60000 milliseconds = 1 minute

    ws.on('close', () => {
        clearInterval(interval);
        const disconnectTime = Date.now();
        const duration = (disconnectTime - connectionTime) / 1000;
        console.log(`Active client disconnected. Connection lasted for ${duration.toFixed(2)} seconds.`);
    });
});

app.listen(port, () => {
    console.log(`WebSocket server listening at http://localhost:${port}`);
});