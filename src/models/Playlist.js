const { Schema, model } = require("mongoose");

const playlistSchema = new Schema({
  userId: { type: String },
  name: { type: String },
  tracks: { type: Array },
});

module.exports = model("Playlist", playlistSchema);
