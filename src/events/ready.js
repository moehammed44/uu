const chalk = require("chalk");

/**
 * @param {import("../structures/Client")} client
 */

module.exports = (client) => {
  client.manager.init(client.user.id);
  console.log(chalk.green(`[Client] => Cluster #${client.cluster.id} Ready`));
};
