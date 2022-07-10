import express from "express";
import { gameClient } from "../../utils/axios.js";
const router = express.Router();

router.get("/", ({ query }, res) => {
  const DateNow = (new Date().getTime() / 1000).toFixed();

  const settings = {
    offset: query.offset || 0,
    limit: query.limit || 20,
    sort: "hypes desc",
    search: "",
    where: `platforms.abbreviation = "PC" & hypes != n & first_release_date > ${DateNow}`,
  };

  gameClient(settings)
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.status(404).send({ error: { message: "There was an error" } });
      console.log("there was an error");
      console.log(error.response);
    });
});

export default router;
