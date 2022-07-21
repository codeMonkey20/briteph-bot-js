require("dotenv").config();
const { DISCORD_TOKEN } = process.env;
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
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
