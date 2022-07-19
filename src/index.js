// initialize dotenv so can use the process.env
import "dotenv/config";

// import and initialize express
import express from "express";
const app = express();
import cors from "cors";

//Utils import
import * as Utils from "./utils/Helpers/index.js";

// import logger
import Logger from "./utils/Helpers/Logger.js";

const PORT = process.env.PORT || 4000;

app.use(cors());

// Makes sure everything returned is made into json
app.use(express.json());

// express use Logger
app.use((req, res, next) => Logger(req, res, next));

//crack routes
import Crack from "./routes/crack/index.js";
app.use("/api/game/crack", Crack);

//game routes
import Game from "./routes/game/index.js";
app.use("/api/game", Game);

app.use("/", (req, res, next) => {
  res.status(404).json({ message: "Route Not found" });
});

setInterval(() => {
  var uptime = process.uptime();
  console.log(`API has been online for: ${Utils.format(uptime)}`);
}, 60000);

// listen and log bot is online
app.listen(PORT, () => console.log(`Api online at http://localhost:${PORT}`));
