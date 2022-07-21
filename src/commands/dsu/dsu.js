const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dsu")
    .setDescription("Daily Stand Up"),

  async execute(interaction, client) {
    const modal = new ModalBuilder()
      .setCustomId("DSUModal")
      .setTitle("Daily Stand Up");

    const messageBox = new TextInputBuilder()
      .setCustomId("DSUMessageBox")
      .setLabel("What are your task/s for today?")
      .setStyle(TextInputStyle.Paragraph);

    const messageBoxActionRow = new ActionRowBuilder().addComponents([messageBox]);
    modal.addComponents([messageBoxActionRow]);
    await interaction.showModal(modal);
  },
};
