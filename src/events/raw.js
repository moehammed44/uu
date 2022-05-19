/**
 * @param {import("../structures/Client")} client
 */

module.exports = (client, newState) => {
  client.manager.updateVoiceState(newState);
};
