const { default: axios } = require("axios");
const { InteractionType } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        await interaction.reply({
          content: "Something went wrong on this command...",
          ephemeral: true,
        });
      }
    } else if (interaction.type === InteractionType.ModalSubmit) {
      console.log(interaction);

      // dsu modal
      if (interaction.fields.fields.find((e) => e.customId === "DSUMessageBox")) {
        const DSUMessageBox = interaction.fields.getTextInputValue("DSUMessageBox");
        const nickname = interaction.member.nickname;
        const today = new Date();
        const time = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()} ${today.toLocaleTimeString('en-GB')}`;
        const body = [
          {
            message: DSUMessageBox,
            dsu_timestamp: time,
            employee_name: nickname,
          },
        ];

        // post to catalyst DB
        axios
          .post(
            "https://britephbot-763668882.development.catalystserverless.com/server/postDB/dsu",
            body
          )
          .then((response) => {

            // reply to discord
            const reply = `Daily Stand Up Report by ${nickname}\nTime: ${new Date().toLocaleString("en-GB")}\n\nTask/s:\n${DSUMessageBox}`;
            interaction.reply({ content: "```" + reply + "```" });
          });
      }

      // eod modal
      else if (interaction.fields.fields.find((e) => e.customId === "EODMessageBox")) {
        const EODMessageBox =
          interaction.fields.getTextInputValue("EODMessageBox");
        await interaction.reply({ content: EODMessageBox });
      }
    }
  },
};
