import express from "express";
import { gameClient } from "../../utils/axios.js";
const router = express.Router();

router.get("/:id", ({ query, params }, res) => {
  const settings = {
    offset: query.offset || 0,
    limit: query.limit || 20,
    sort: "",
    search: "",
    where: `id = ${params.id}`,
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
