import { crackClient } from "../axios.js";
import Fuzzy from "../fuzzy.js";
import * as cheerio from "cheerio";

import urlcat from "urlcat";
const urlCat = urlcat.default;

const info = {
  name: "skidrow",
  url: "https://www.skidrowreloaded.com",
};

const provider = info.name;

const search = async (query) => {
  const url = urlCat(info.url, {
    s: query,
  });

  const { data } = await crackClient.get(url);

  const $ = cheerio.load(data);

  const items = $("#main-content").find("div.post");

  const titles = [];
  items.each((i, el) => {
    if (i === 0) return;

    const title = $(el).find("h2").text().trim();

    if (title.toLowerCase().includes("unlocked")) return;
    title && titles.push(title);
  });

  const result = await Fuzzy(
    titles.map((title) => ({ title, group: null })),
    query
  );

  return { result, provider };
};

export default { provider, search };
