import express from "express";
const router = express.Router();

import Search from "./search.js";
router.use("/search", Search);

import Recently from "./recently.js";
router.use("/recently", Recently);

import Calender from "./calender.js";
router.use("/calender", Calender);

export default router;
