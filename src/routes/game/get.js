import express from "express";
import { gameClient, hltbClient } from "../../utils/axios.js";

const router = express.Router();

router.get("/:id", async ({ query, params }, res) => {
  const { id } = params;

  const DecodedId = decodeURIComponent(id);
  const PATTERN = /[^\x20\x2D0-9A-Z\x5Fa-z\xC0-\xD6\xD8-\xF6\xF8-\xFF]/g;

  const DecodedIdReplaced = DecodedId.replace(PATTERN, "").toLowerCase();

  const settings = {
    offset: query.offset || 0,
    limit: query.limit || 20,
    sort: "",
    search: !isNaN(id) ? "" : DecodedIdReplaced,
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

router.get("/", async ({ query }, res) => {
  const { title, id } = query;

  const DecodedId = decodeURIComponent(id);
  const DecodedTitle = decodeURIComponent(title);
  const PATTERN = /[^\x20\x2D0-9A-Z\x5Fa-z\xC0-\xD6\xD8-\xF6\xF8-\xFF]/g;

  const DecodedIdReplaced = DecodedId.replace(PATTERN, "").toLowerCase();
  const DecodedTitleReplaced = DecodedTitle.replace(PATTERN, "").toLowerCase();

  const settings = {
    offset: query.offset || 0,
    limit: query.limit || 20,
    sort: "",
    search: id ? "" : DecodedTitleReplaced,
    where: `platforms.abbreviation = "PC" ${
      !id ? "" : `& id = ${DecodedIdReplaced}`
    }`,
  };

  try {
    const [igdb, hltb] = await Promise.all([
      gameClient(settings),
      hltbClient.search(DecodedTitleReplaced),
    ]);

    const Games = [];
    const filteredArray = igdb.find((res) => {
      const { name } = res;
      return name.toLowerCase() === DecodedTitleReplaced.toLowerCase();
    });

    await Games.push(!id ? filteredArray : igdb[0]);
    await Games.push(hltb[0]);

    res.send(Games);
  } catch (error) {
    res
      .status(404)
      .send({ error: { message: "There was an error", data: { error } } });
  }
});

export default router;
