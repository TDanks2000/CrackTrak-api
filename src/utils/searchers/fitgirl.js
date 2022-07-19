import { crackClient } from "../axios.js";
import Fuzzy from "../fuzzy.js";
import * as cheerio from "cheerio";

import urlcat from "urlcat";
const urlCat = urlcat.default;

const info = {
  name: "fitgirl",
  url: "https://fitgirl-repacks.site",
};

const provider = info.name;

const search = async (query) => {
  const url = await urlCat(info.url, "/", {
    s: query,
  });

  const { data } = await crackClient.get(url);

  const $ = cheerio.load(data);

  const container = $("div#content.site-content");

  const titles = [];
  container.find("article.post").each((i, el) => {
    const title = $(el).find(".entry-title").find("a").first().text().trim();

    title && titles.push(title);
  });

  const result = await Fuzzy(
    titles.map((title) => ({ title, group: null })),
    query
  );

  return { result, provider };
};

export default { provider, search };
