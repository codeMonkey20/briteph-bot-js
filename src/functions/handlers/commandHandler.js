const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { CLIENT_ID, GUILD_ID, DISCORD_TOKEN } = process.env;
const fs = require("fs");

module.exports = (client) => {
  client.commandHandler = async () => {
    const commandFolders = fs.readdirSync("./src/commands");
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
        client.commandArray.push(command.data.toJSON());
        console.log(`Command: "${command.data.name}" passed`);
      }
    }

    const rest = new REST({ version: "9" }).setToken(DISCORD_TOKEN);
    try {
      console.log("Refreshing slash commands...");
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
        body: client.commandArray,
      });
      console.log("Slash commands refreshed.");
    } catch (error) {
      console.log(error);
    }
  };
};
