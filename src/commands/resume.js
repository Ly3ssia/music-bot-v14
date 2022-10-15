
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js")
const db = require("croxydb")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("🎵 Resume Music!"),
    run: async (client, interaction) => {
      await interaction.deferReply().catch(err => {})
      const queue = client.distube.getQueue(interaction);
         if (!queue) return interaction.reply(`There is no song on the list yet.`)
interaction.followUp({content: "Successfully reopened your song."})
client.distube.resume(interaction);

 }
}
