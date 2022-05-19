const fs = require("fs");
const chalk = require("chalk");

/**
 * @param {import("../structures/Client")} client
 */

module.exports = (client) => {
  let msgcmdcount = 0;
  let slashcmdcount = 0;
  let arrayOfSlashCommands = [];
  fs.readdirSync("./src/commands/Message").forEach((dir) => {
    const commands = fs
      .readdirSync(`./src/commands/Message/${dir}`)
      .filter((file) => file.endsWith(".js"));
    for (let file of commands) {
      let pull = require(`../commands/Message/${dir}/${file}`);
      if (pull.name) {
        client.msgcommands.set(pull.name, pull);
        msgcmdcount++;
      }
    }
  });
  if (client.cluster.id === 0) {
    console.log(
      chalk.green(`[Client] => Loaded ${msgcmdcount} Message Commands`)
    );
  }
  fs.readdirSync("./src/commands/Slash").forEach((dir) => {
    const commands = fs
      .readdirSync(`./src/commands/Slash/${dir}`)
      .filter((file) => file.endsWith(".js"));
    for (let file of commands) {
      let pull = require(`../commands/Slash/${dir}/${file}`);
      if (pull.name) {
        client.slscommands.set(pull.name, pull);
        arrayOfSlashCommands.push(pull);
        slashcmdcount++;
      }
    }
  });
  client.once("ready", async () => {
    await client.application.commands.set(arrayOfSlashCommands);
  });
  if (client.cluster.id === 0) {
    console.log(
      chalk.green(`[Client] => Loaded ${slashcmdcount} Slash Commands`)
    );
  }
};
