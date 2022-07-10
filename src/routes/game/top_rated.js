import express from "express";
import { gameClient } from "../../utils/axios.js";
const router = express.Router();

router.get("/", ({ query }, res) => {
  const settings = {
    offset: query.offset || 0,
    limit: query.limit || 20,
    sort: "aggregated_rating desc",
    search: "",
    where: `platforms.abbreviation = "PC" & aggregated_rating != n & aggregated_rating_count > 5`,
  };

  gameClient(settings)
    .then((data) => res.send(data))
    .catch((error) => {
      res
        .status(404)
        .send({ error: { message: "There was an error", data: { error } } });
      console.log("there was an error");
    });
});

export default router;
