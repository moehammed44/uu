/**
 * @param {import("discord.js").ThreadChannel} thread
 */

module.exports = async (_, thread) => {
  if (thread.joinable && !thread.joined) {
    await thread.join();
  }
};
