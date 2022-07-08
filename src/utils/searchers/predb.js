import { crackClient } from "../axios.js";
import Fuzzy from "../fuzzy.js";

const info = {
  name: "predb",
  url: "https://predb.ovh/api/v1",
};

const provider = info.name;

const search = async (query) => {
  const { data } = await crackClient.get(info.url, {
    params: { q: `${query}@cat GAMES` },
  });

  const items = data.data.rows.map(({ name, team, cat }) => ({
    title: name.replace(`-${team}`, "").replace(/(\.|_)/g, " "),
    group: team,
    cat,
  }));

  // filter out known bad keywords
  const filtered = items
    .filter(({ title, cat }) => {
      const nsw = title.toLowerCase().includes("nsw");
      const console = cat.toLowerCase().match(/ps|xbox/g);
      return !nsw && !console;
    })
    .map(({ group, title }) => ({ group, title }));

  const result = await Fuzzy(filtered, query);

  return { result, provider };
};

export default { provider, search };
