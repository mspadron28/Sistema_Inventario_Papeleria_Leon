import express from "express";
import cors from "cors";
import morgan from "morgan";
import { WebSocketServer } from "ws";
import router from "./routes/main.routes.js";
import { port } from "./config.js";

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(router); // Middleware Para usar el router

// WebSocket setup
const server = app.listen(port, () => {
  console.log(`Server on port ${port}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Broadcast function to send updates to all connected clients
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Export the broadcast function to use it in controllers
export { broadcast };

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my API" });
});

// Handling errors
app.use((err, req, res, next) => {
  return res.status(500).json({
    status: "error",
    message: err.message,
  });
});
