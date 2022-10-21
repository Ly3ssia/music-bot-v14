
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js")
const db = require("croxydb")
const languagefile = require("../language.json")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("🎵 | Set the music volume!")
    .addStringOption(option => option.setName("number").setDescription("1-100").setRequired(true)),
    run: async (client, interaction, track) => {
      await interaction.deferReply()
      const string = interaction.options.getString("number")
      const volume = parseInt(string)
      const language = db.fetch(`language_${interaction.user.id}`)
if (!language) {
  const queue = client.distube.getQueue(interaction);
     if (!queue) return interaction.followUp(`There is no song on the list yet.`)
     if (isNaN(volume)) return interaction.followUp("Give me number!")
     if (volume < 1) return interaction.followUp("The number must not be less than 1.")
     if (volume > 100) return interaction.followUp("The number should not be greater than 100.")
     client.distube.setVolume(interaction, volume);
     interaction.followUp("Successfully set the volume of the music to **"+volume+"**")
       }
      
 }
}
