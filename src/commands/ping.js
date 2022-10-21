
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js")
const db = require("croxydb")
const languagefile = require("../language.json")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("🤖 | See your ping!"),
    run: async (client, interaction) => {
      await interaction.deferReply().catch(err => {})
    const embed = new Discord.EmbedBuilder()
    .setDescription(client.ws.ping + " ms")
    .setColor("Aqua")
    return interaction.followUp({embeds: [embed]})
 }
}
