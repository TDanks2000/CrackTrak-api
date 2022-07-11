import express from "express";
const router = express.Router();
import fuzzysort from "fuzzysort";

import { crackClient } from "../../utils/axios.js";

router.get("/", async ({ query, body }, res) => {
  const gameStatusUrl =
    "https://gamestatus.info/back/api/gameinfo/game/gamecalendar/";

  const { data } = await crackClient.get(gameStatusUrl);

  const Array = data.response_game_calendar;

  const filtered = clearEmpties(Array);

  res.send(clean(filtered, "translated_month"));
});

const clearEmpties = (o) => {
  for (var k in o) {
    if (!o[k] || typeof o[k] !== "object") {
      continue; // If null or not an object, skip to the next iteration
    }

    // The property is an object
    clearEmpties(o[k]); // <-- Make a recursive call on the nested object
    if (Object.keys(o[k]).length === 0) {
      delete o[k]; // The object had no properties, so delete that property
    }
  }
  return o;
};

const clean = (obj, target) => {
  var tmpobj = obj;
  for (var key in tmpobj) {
    if (key === target) {
      delete obj[key];
    } else if (typeof obj[key] === "object") {
      obj[key] = clean(obj[key], target);
    }
  }
  return obj;
};

export default router;
