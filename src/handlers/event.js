const fs = require("fs");
const chalk = require("chalk");

/**
 * @param {import("../structures/Client")} client
 */

module.exports = (client) => {
  let eventcount = 0;
  const events = fs
    .readdirSync("./src/events")
    .filter((file) => file.endsWith(".js"));
  for (let file of events) {
    const event = require(`../events/${file}`);
    client.on(file.split(".")[0], event.bind(null, client));
    eventcount++;
  }
  if (client.cluster.id === 0) {
    console.log(chalk.green(`[Client] => Loaded ${eventcount} Events`));
  }
};
