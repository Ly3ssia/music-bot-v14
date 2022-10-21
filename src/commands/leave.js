const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js")
const db = require("croxydb")
const languagefile = require("../language.json")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("🎵 | Finish Music!"),
    run: async (client, interaction) => {
      await interaction.deferReply().catch(err => {})
      const queue = client.distube.getQueue(interaction);
         if (!queue) return interaction.followUp(`There is no song on the list yet.`)
         client.distube.voices.leave(interaction)
         await interaction.followUp("I'm leave voice channels.").catch(err => {})
         db.delete(`music_${interaction.guild.id}`)
return;
 }
}
