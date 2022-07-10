import express from "express";
const router = express.Router();

import TopRated from "./top_rated.js";
router.use("/top_rated", TopRated);

import MostAnticipated from "./most_anticipated.js";
router.use("/most_anticipated", MostAnticipated);

import Search from "./Search.js";
router.use("/search", Search);

import Get from "./get.js";
router.use("/get", Get);

import ALL from "./all.js";
router.use("/all", ALL);

export default router;
