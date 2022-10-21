
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js")
const db = require("croxydb")
const config = require("../config.js")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("language")
    .setDescription("🎵 | Select the language!"),
    run: async (client, interaction) => {
      await interaction.deferReply().catch(err => {})
      if (config.language === false) return interaction.followUp("Language feature is disabled on this bot.")
      const data = db.fetch(`language_${interaction.user.id}`)
      if (data) {
     await interaction.followUp({content: "The language has been successfully set to English."})
     db.delete(`language_${interaction.user.id}`)
      }
if (!data) {
await interaction.followUp({content: "Dil başarıyla türkçe olarak ayarlandı."})
db.set(`language_${interaction.user.id}`, true)
}
 }
}
