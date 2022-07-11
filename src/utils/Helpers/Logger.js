import chalk from "chalk";
import moment from "moment";

const Logger = (req, res, next) => {
  let time = moment().format("HH:mm:ss");

  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const realIP = ip === "::1" ? "127.0.0.1" : ip;
  const values = Object.values(req.query);

  console.log(chalk.bold.cyanBright(`GOT REQUEST AT: ${req.path}`));
  console.log(chalk.bold.cyanBright(`GOT REQUEST FROM: ${realIP}`));
  console.log(chalk.bold.cyanBright(`GOT REQUEST AT: ${time}`));

  console.log(` `);
  next(); // Passing the request to the next handler in the stack.
};

export default Logger;
