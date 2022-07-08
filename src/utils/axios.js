import pkg from "axios-cache-adapter";
const { setup } = pkg;

const headers = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0",
  "X-API-Client": "website",
  "X-API-Language": "en",
  "X-API-Referer": "%2F",
};

const cache = {
  exclude: {
    methods: [],
    query: false,
  },
  readOnError: (error) => {
    return error.response.status >= 400 && error.response.status < 600;
  },
  limit: 10_000 * 5,
  clearOnStale: false,
  maxAge: 1000 * 60 * 60 * 24 * 2,
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

export { crackClient };
