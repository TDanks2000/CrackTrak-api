import { crackClient } from "../axios.js";
import Fuzzy from "../fuzzy.js";

const info = {
  name: "gamestatus",
  url: "https://gamestatus.info/back/api/gameinfo/game/search_title/",
};

const headers = {
  Referer: "https://gamestatus.info/",
};

const provider = info.name;

const search = async (query) => {
  const { data } = await crackClient.post(
    info.url,
    { title: query },
    { headers }
  );

  const titles = data
    .filter(({ crack_date }) => !!crack_date)
    .map(({ title, hacked_groups }) => ({
      title,
      group: JSON.parse(hacked_groups)[0],
    }));

  const result = await Fuzzy(titles, query, { threshold: -4 });

  return { result, provider };
};

export default { provider, search };
