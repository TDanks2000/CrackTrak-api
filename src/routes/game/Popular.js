import express from "express";
const router = express.Router();
import { TwitchClient } from "../../utils/axios.js";

router.use("/", async ({ query, body }, res) => {
  const { data: Data } = await TwitchClient.get(
    `https://api.twitch.tv/helix/games/top`
  );
  const { data } = Data;

  const CheckArray = ["just chatting", "sports", "asmr", "slots"];

  const results = data.filter(
    (response) => !CheckArray.includes(response.name.toLowerCase())
  );

  res.send(results.splice(0, query.limit || 20));
});

export default router;
