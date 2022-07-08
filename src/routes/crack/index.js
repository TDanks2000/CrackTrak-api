import express from "express";
const router = express.Router();

import Search from "./search.js";
router.use("/search", Search);

export default router;
