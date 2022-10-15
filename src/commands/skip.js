
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js")
const db = require("croxydb")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("🎵 You skip the song!"),
    run: async (client, interaction) => {
      await interaction.deferReply().catch(err => {})
      const queue = client.distube.getQueue(interaction);
         if (!queue) return interaction.followUp(`There is no song on the list yet.`)
            if (queue.songs.length === 1) return interaction.followUp("No song found in the queue!")
         client.distube.skip(interaction)
return interaction.followUp("The song was passed successfully.")
 }
}
