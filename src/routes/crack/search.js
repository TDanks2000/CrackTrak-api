import express from "express";
const router = express.Router();

import SearchCrack from "../../utils/searchers/index.js";

router.post("/", async ({ query, body }, res) => {
  const { s, providers } = body;

  const Search = providers
    ? await SearchCrack(s, providers)
    : await SearchCrack(s);

  console.log(Search);
  res.send(Search);
});

export default router;
