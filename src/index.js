const { Manager } = require("discord-hybrid-sharding");
const { token } = require("../settings");

const manager = new Manager("./src/bot.js", {
  mode: "process",
  shardsPerClusters: 13,
  token,
  totalClusters: "auto",
  totalShards: "auto",
});

manager.spawn({ timeout: -1 });
