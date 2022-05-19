const Client = require("./structures/Client");
const client = new Client();
client.build();

process.removeAllListeners("warning");
process.on("unhandledRejection", (err) => {
  console.log(err);
});
process.on("uncaughtException", (err) => {
  console.log(err);
});
process.on("uncaughtExceptionMonitor", (err) => {
  console.log(err);
});
process.on("multipleResolves", () => {});
