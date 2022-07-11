import tryToCatch from "../Helpers/catch.js";
import ErrorBuilder from "../Helpers/errorBuilder.js";

import GameStatus from "./gamestatus.js";
import Predb from "./predb.js";
import FitGirl from "./fitgirl.js";
import PcGamesTorrents from "./pcgamestorrents.js";
import Skidrow from "./skidrow.js";

const Providers = [GameStatus, Predb, FitGirl, PcGamesTorrents, Skidrow];
const defaultProviders = ["gamestatus", "PcGamesTorrents", "predb"];

export default async function SearchCrack(query, providers = defaultProviders) {
  // filter out the needed providers
  const filtered = Providers.filter(({ provider }) =>
    providers.includes(provider)
  );

  if (filtered.length < 1) {
    console.error(
      new ErrorBuilder().msg("Unknown providers ¯\\_(ツ)_/¯").status(400)
    );
  }

  // this only looks complex
  const promises = filtered.map(
    ({ search, provider }) =>
      new Promise((resolve, reject) => {
        search(query)
          .then(({ provider, result, Info }) => {
            if (!result) reject(`${provider} does not have cracks`);
            else resolve({ provider, result, Info });
          })
          .catch(() => reject(`${provider} did not respond`));
      })
  );

  const [result, error] = await tryToCatch(() => Promise.any(promises));

  if (!result) {
    return {
      provider: error.errors.join(" - "),
      result: null,
    };
  }

  return result;
}
