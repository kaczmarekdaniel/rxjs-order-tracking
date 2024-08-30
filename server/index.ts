import * as uWS from "uWebSockets.js";


const port = 9001;
let numberOfUsers = 0;

uWS.App()
    .ws("/*", {
        /* Options */
        compression: uWS.SHARED_COMPRESSOR,
        maxPayloadLength: 16 * 1024 * 1024,
        idleTimeout: 10,
        /* Handlers */
        open: (ws) => {
            numberOfUsers++;
            console.log("A WebSocket connected!", numberOfUsers);
            ws.send(JSON.stringify([
                { id: "1", category: "new", name: "yoga mat" },
                { id: "2", category: "shipped", name: "Bike" },
            ]));
        
            ws.subscribe("/");
        },
        message: (ws, message, isBinary) => {
            ws.publish("/", message, isBinary);
        },
        drain: (ws) => {
            console.log("WebSocket backpressure: " + ws.getBufferedAmount());
        },
        close: (ws, code, message) => {
            console.log("WebSocket closed");
            numberOfUsers--;
        },
    })
    .any("/*", (res, req) => {
        res.end("Nothing to see here!");
    })
    .listen(port, (token) => {
        if (token) {
            console.log("Listening to port " + port);
        } else {
            console.log("Failed to listen to port " + port);
        }
    });
