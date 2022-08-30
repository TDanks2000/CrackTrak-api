import axiosCache from "axios-cache-adapter";
const { setup, RedisStore } = axiosCache;
import igdbI from "igdb-api-node";
const igdb = igdbI.default;
import redis from "redis";

import hltb from "howlongtobeat";
const hltbClient = new hltb.HowLongToBeatService();

const client_id = process.env.TWITCH_CLIENT_ID,
  access_token = process.env.TWITCH_APP_ACCESS_TOKEN;

const igdbClient = igdb(client_id, access_token);

const headers = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0",
  "X-API-Client": "website",
  "X-API-Language": "en",
  "X-API-Referer": "%2F",
};

const client = redis.createClient({
  url: "redis://default:HuENOL0ny457ZfrCvnk8IUIf28DFoQNb@redis-14928.c3.eu-west-1-1.ec2.cloud.redislabs.com:14928",
});
const store = new RedisStore(client);

client.on("error", (err) => {
  console.log("Redis Error " + err);
});

const cache = {
  exclude: {
    methods: [],
    query: false,
  },
  readOnError: (error) => {
    return error.response.status >= 400 && error.response.status < 600;
  },
  limit: 10000 * 5,
  clearOnStale: false,
  maxAge: 1000 * 60 * 60 * 24 * 2,
  store,
};

const crackClient = setup({
  timeout: 1000 * 6,
  headers: {
    "user-agent": headers["user-agent"],
  },
  cache: {
    ...cache,
    maxAge: 1000 * 60 * 60 * 2,
  },
});

const Settings = {
  offset: 0,
  limit: 20,
  sort: "",
  search: "",
  where: "",
};

const gameClient = async (settings = Settings) => {
  const { offset, limit, sort, search, where, url } = settings;

  const response = await igdbClient
    .fields([
      "*",
      "screenshots.*",
      "cover.*",
      "rating",
      "release_dates.*",
      "aggregated_rating",
      "platforms.*",
      "involved_companies.*",
      "game_engines.*",
      "websites.*",
      "videos.*",
      "genres.*",
      "similar_games.*",
    ])
    .limit(limit || 20)
    .offset(offset || 0)
    .sort(sort)
    .search(search)
    .where(where)
    .request("games");

  return response.data;
};

const TwitchClient = setup({
  timeout: 1000 * 6,
  headers: {
    "user-agent": headers["user-agent"],
    Authorization: `Bearer ${access_token}`,
    "Client-Id": client_id,
  },
  cache: {
    ...cache,
    maxAge: 1000 * 60 * 60 * 2,
  },
});

export { crackClient, gameClient, hltbClient, TwitchClient };
