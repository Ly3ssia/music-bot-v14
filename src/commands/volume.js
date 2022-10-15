
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js")
const db = require("croxydb")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("🎵 Set the music volume!")
    .addStringOption(option => option.setName("number").setDescription("1-100").setRequired(true)),
    run: async (client, interaction, track) => {
      const string = interaction.options.getString("number")
      const volume = parseInt(string)
      const queue = client.distube.getQueue(interaction);
         if (!queue) return interaction.reply(`There is no song on the list yet.`)
         if (isNaN(volume)) return interaction.reply("Give me number!")
         if (volume < 1) return interaction.reply("The number must not be less than 1.")
         if (volume > 100) return interaction.reply("The number should not be greater than 100.")
         client.distube.setVolume(interaction, volume);
         interaction.reply("Successfully set the volume of the music to **"+volume+"**")
 }
}
