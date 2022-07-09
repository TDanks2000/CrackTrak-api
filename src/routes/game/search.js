import express from "express";
import { gameClient } from "../../utils/axios.js";
const router = express.Router();

router.get("/", async ({ query, body }, res) => {
  let { search } = query;

  if (!search) {
    return res
      .status(404)
      .send({ error: { message: "did not enter a game to search for!" } });
  }
  const settings = {
    offset: query.offset || 0,
    limit: query.limit || 20,
    sort: "",
    search: search,
    where: "platforms = 6",
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
