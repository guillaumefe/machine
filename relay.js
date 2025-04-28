let WebSocket;
try {
    WebSocket = require("ws");
} catch (err) {
    console.error("\nThe 'ws' library is not installed.");
    console.error("Please install it by running the following command:");
    console.error("\nnpm install ws\n");
    process.exit(1);
}

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
    ws.on("message", (data) => {
        // Relay to all other clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });
});

console.log("Relay WebSocket server running on ws://localhost:8080");
