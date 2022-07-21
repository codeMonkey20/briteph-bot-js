"use strict";
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const { default: axios } = require("axios");

module.exports = (req, res) => {
  axios
    .get(
      "https://britephbot-763668882.development.catalystserverless.com/server/fetchKeys/"
    )
    .then((response) => {
			const DISCORD_TOKEN = response.data.TOKEN;
      const client = new Client({
        intents: [GatewayIntentBits.Guilds],
      });

      client.commands = new Collection();
      client.commandArray = [];

      const handlerFolder = fs.readdirSync("./src/functions");
      for (const folder of handlerFolder) {
        const handlerFiles = fs
          .readdirSync(`./src/functions/${folder}`)
          .filter((file) => file.endsWith(".js"));
        for (const file of handlerFiles) {
          require(`./functions/${folder}/${file}`)(client);
        }
      }

      client.eventHandler();
      client.commandHandler();
      client.login(DISCORD_TOKEN);
    });
};
