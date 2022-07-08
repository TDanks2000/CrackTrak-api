import express from "express";
const router = express.Router();

import SearchCrack from "../../utils/searchers/index.js";

router.post("/", async ({ query, body }, res) => {
  const { s, providers } = body;

  const Search = await SearchCrack(s, providers);
  res.send(Search);
});

export default router;
