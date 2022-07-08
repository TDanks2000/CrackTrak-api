import { crackClient } from "../axios.js";
import Fuzzy from "../fuzzy.js";
import * as cheerio from "cheerio";

import urlcat from "urlcat";
const urlCat = urlcat.default;

const info = {
  name: "steamcrackedgames",
  url: "https://steamcrackedgames.com",
};

const provider = info.name;

const search = async (query) => {
  const url = await urlCat(info.url, "/search", {
    q: query,
  });

  const { data } = await crackClient.get(url);

  const $ = cheerio.load(data);

  const container = $("tbody#tbody_games");

  const titles = [];
  container.find("tr").each((i, el) => {
    const title = $(el).find("a.text-white").first().text().trim();

    const cracked = $(el)
      .find("span.cracked-text")
      .text()
      .toLowerCase()
      .includes("cracked");

    title && cracked && titles.push(title);
  });

  const result = await Fuzzy(
    titles.map((title) => ({ title, group: null })),
    query
  );

  return { result, provider };
};

export default { provider, search };
