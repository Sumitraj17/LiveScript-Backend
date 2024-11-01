import express, { urlencoded } from "express";
import http from "http";
import { Server } from "socket.io";
import connectToDb from "./db/db.js";
import cookieParser from "cookie-parser";
import router from "./routes/userRoutes.js";
import socketConnection from "./socket.js";
import cors from "cors";

const App = express();
const server = http.createServer(App);
const io = new Server(server);
connectToDb();

App.use(cors({ origin:['http://localhost:5173','https://livescript.netlify.app/'],credentials: true }));

App.use(express.json());
App.use(cookieParser());
App.use(express.urlencoded({ extended: true }));

App.use("/user", router);
App.get("/", (req, res) => {
  res.json({ message: "LiveScript is running" });
});

socketConnection(io);

const PORT = 5000;

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
