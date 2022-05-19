const { Schema, model } = require("mongoose");
const { prefix } = require("../../settings");

const guildSchema = new Schema({
  id: { type: String },
  botChannel: { type: String, default: null },
  prefix: { type: String, default: prefix },
  twentyFourSeven: {
    enabled: { type: Boolean, default: false },
    textChannel: { type: String, default: null },
    voiceChannel: { type: String, default: null },
  },
  djRole: { type: String, default: null },
});

module.exports = model("Guild", guildSchema);
