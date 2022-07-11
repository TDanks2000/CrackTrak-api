import { crackClient } from "../axios.js";
import Fuzzy from "../fuzzy.js";
import * as cheerio from "cheerio";

import urlcat from "urlcat";
const urlCat = urlcat.default;

const info = {
  name: "pcgamestorrents",
  url: "https://pcgamestorrents.com",
};

const provider = info.name;

const search = async (query) => {
  const url = urlCat(info.url, {
    s: query,
  });

  const { data } = await crackClient.get(url);

  const $ = cheerio.load(data);

  const items = $("article");

  const titles = [];
  items.each((i, el) => {
    const title = $(el).find("h1").text().trim();
    title && titles.push(title);
  });

  const result = await Fuzzy(
    titles.map((title) => ({ title, group: null })),
    query
  );

  return { result, provider };
};

export default { provider, search };
