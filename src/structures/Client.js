const { Client, Collection, Intents } = require("discord.js");
const Cluster = require("discord-hybrid-sharding");
const { Manager } = require("erela.js");
const Filter = require("erela.js-filters");
const Deezer = require("erela.js-deezer");
const Spotify = require("erela.js-spotify");
const AppleMusic = require("erela.js-apple");
const Facebook = require("erela.js-facebook");
const mongoose = require("mongoose");
const Topgg = require("@top-gg/sdk");
const settings = require("../../settings");

module.exports = class Apera extends Client {
  constructor() {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.DIRECT_MESSAGES,
      ],
      presence: {
        activities: [
          {
            name: `${settings.prefix}help`,
            type: "LISTENING",
          },
        ],
      },
      shardCount: Cluster.data.TOTAL_SHARDS,
      shards: Cluster.data.SHARD_LIST,
    });

    this.cluster = new Cluster.Client(this);
    this.cooldowns = new Collection();
    this.msgcommands = new Collection();
    this.slscommands = new Collection();
    this.settings = settings;
    this.owners = ["714779051536941097", "952560202635427841"];
    this.topggapi = new Topgg.Api(
      `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgwMjgxMjM3ODU1ODg4OTk5NCIsImJvdCI6dHJ1ZSwiaWF0IjoxNjM0Mjc4MzAyfQ.u2u94wTerx8rLTWZkoHkq_Eb8NmKFkp_tlbpOBR7An8`
    );
    this.manager = new Manager({
      nodes: this.settings.audionodes,
      send: (id, payload) => {
        this.guilds.cache.get(id)?.shard.send(payload);
      },
      plugins: [
        new Filter(),
        new Spotify({
          clientID: "93ac0367bd704d2cace802e74bb312c2",
          clientSecret: "da05729c68ec4903a0d81515a805afcd",
        }),
        new Deezer(),
        new AppleMusic(),
        new Facebook(),
      ],
    });
  }
  build() {
    this.login(this.settings.token).then(() => {
      mongoose
        .connect(this.settings.mongo, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
        })
        .then(() => {})
        .catch(() => {});
    });
    ["command", "erela", "event"].forEach((handler) => {
      require(`../handlers/${handler}`)(this);
    });
    return this;
  }
};
