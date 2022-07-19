import express from "express";
const router = express.Router();
import fuzzysort from "fuzzysort";
import chalk from "chalk";
import { crackClient } from "../../utils/axios.js";

const genStatus = (first, second) => {
  const day = 1000 * 60 * 60 * 24;
  const firstDate = new Date(first).getTime();
  const secondDate = new Date(second).getTime();

  return Math.round(Math.abs(firstDate - secondDate) / day);
};

// const steamCrackedGamesUrl =
//   "https://steamcrackedgames.com/api/games/page/1/order/2";
const gameStatusUrl =
  "https://gamestatus.info/back/api/gameinfo/game/lastcrackedgames/";

const fuzzyOptions = {
  allowTypo: false,
  limit: 2,
  threshold: -4,
};

router.get("/", async (req, res) => {
  const [gameStatus] = await Promise.allSettled([
    // crackClient.get(steamCrackedGamesUrl),
    crackClient.get(gameStatusUrl),
  ]);

  let crackedItems = [];

  //   if (steamCrackedGames.status === "fulfilled") {
  //     const items = steamCrackedGames.value.data.games
  //       // filter out incorrect values
  //       .filter(
  //         ({ cracked_date_1 }) =>
  //           new Date(cracked_date_1).getTime() <= new Date().getTime()
  //       )
  //       .map(({ header_image, cracked_date_1, name, release_date }) => ({
  //         date: cracked_date_1,
  //         img: header_image,
  //         title: name,
  //         status: `Cracked in ${genStatus(cracked_date_1, release_date)} days`,
  //       }));

  //     crackedItems = [...crackedItems, ...items];
  //   }

  if (gameStatus.status === "fulfilled") {
    console.log(
      chalk.bold(
        `From cache: ${gameStatus.value.request.fromCache || false}`
      )
    );
    const items = gameStatus.value.data.list_crack_games
      // filter out incorrect values
      .filter(
        ({ crack_date }) =>
          new Date(crack_date).getTime() <= new Date().getTime()
      )
      .map((res) => ({ ...res }));

    crackedItems = [...crackedItems, ...items];
  }

  // rm duplicates
  for await (const [index, { title }] of crackedItems.entries()) {
    const cut = title.slice(0, title.length - 2);
    const results = await fuzzysort.goAsync(cut, crackedItems, {
      ...fuzzyOptions,
      key: "title",
    });

    if (results.length >= 2) {
      crackedItems.splice(index, 1);
    }
  }

  crackedItems.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const { page = 1 } = req.query;

  const items = crackedItems.slice((page - 1) * 10, page * 10);

  // page = 1 slice(0, 10)
  // page = 2 slice(10, 20)

  return res.send({
    items,
    next: crackedItems.length > page * 10,
  });
});

export default router;
