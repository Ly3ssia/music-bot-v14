
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js")
const db = require("croxydb")
const languagefile = require("../language.json")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("🎵 | Seek Music!")
    .addStringOption(option => option.setName("number").setDescription("How far do you want to go?").setRequired(true)),
    run: async (client, interaction) => {
      await interaction.deferReply().catch(err => {})
      const queue = client.distube.getQueue(interaction);
         if (!queue) return interaction.followUp(`There is no song on the list yet.`)
         const number = interaction.options.getString("number")
         if(isNaN(number)) return interaction.followUp("Give me number!")
         const type = parseInt(number)
         queue.seek((queue.currentTime + type))
         return interaction.followUp("Successfully fast forwarded.")


try {
 } catch (e) {
   return;
 }
 }
}
