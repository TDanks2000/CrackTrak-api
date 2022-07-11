import express from "express";
import { gameClient } from "../../utils/axios.js";

const router = express.Router();

router.get("/:id", ({ query, params }, res) => {
  const { id } = params;

  const DecodedId = decodeURIComponent(id);
  const PATTERN = /[^\x20\x2D0-9A-Z\x5Fa-z\xC0-\xD6\xD8-\xF6\xF8-\xFF]/g;

  const settings = {
    offset: query.offset || 0,
    limit: query.limit || 20,
    sort: "",
    search: !isNaN(id) ? "" : DecodedId.replace(PATTERN, "").toLowerCase(),
    where: !isNaN(id) ? `id = ${id}` : ``,
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
