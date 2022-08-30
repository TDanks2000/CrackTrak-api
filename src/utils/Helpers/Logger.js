import chalk from "chalk";
import moment from "moment";

const Logger = (req, res, next) => {
  let time = moment().format("HH:mm:ss");

  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const realIP = ip === "::1" ? "127.0.0.1" : ip;
  const values = Object.values(req.query);
  const body = Object.values(req.body);

  console.log(` `);
  console.log(chalk.bold.cyanBright(`REQUEST URL ${req.path}`));
  console.log(chalk.bold.yellowBright(`REQUEST FROM ${realIP}`));
  console.log(chalk.bold.greenBright(`REQUEST AT ${time}`));
  if (values.length > 0)
    console.log(
      chalk.bold.magentaBright(
        `REQUEST PARAMS: [ ${values.join(", ").toUpperCase()} ]`
      )
    );
  if (body.length > 0)
    console.log(
      chalk.bold.magentaBright(
        `REQUEST BODY: [ ${body.join(", ").toUpperCase()} ]`
      )
    );
  console.log(` `);

  next(); // Passing the request to the next handler in the stack.
};

export default Logger;
