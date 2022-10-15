
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js")
const db = require("croxydb")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("🎵 Music!")
    .addStringOption(option => option.setName("name").setDescription("Song!").setRequired(true)),
    run: async (client, interaction, track) => {
      await interaction.deferReply().catch(err => {})
      const string = interaction.options.getString("name")
      let voiceChannel = interaction.member.voice.channel
if (!voiceChannel) return interaction.followUp({content: "You are not on an audio channel!"})
const queue = client.distube.getQueue(interaction);

client.distube.voices.join(voiceChannel)

await client.distube.play(interaction.member.voice.channel, string);
const tracks = await client.player.search(string, {
    requestedBy: interaction.user
}).then(x => x.tracks[0]);
if (!tracks) return;
const embed = new Discord.EmbedBuilder()
.addFields({name: "Title", value: `${tracks.title}`, inline: true})
.addFields({name: "Author", value: `${tracks.author}`, inline: true})
.addFields({name: "Time", value: `${tracks.duration}`, inline: true})
.addFields({name: "Views", value: `${tracks.views}`, inline: true})
.addFields({name: "Thumbnail", value: "[Click]("+tracks.thumbnail+")", inline: true})
.addFields({name: "Video", value: "[Click]("+tracks.url+")", inline: true})
.setColor("Aqua")
.setImage(`${tracks.thumbnail}`)
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setEmoji("<:dur:815477220910432297>")
.setStyle(Discord.ButtonStyle.Secondary)
.setCustomId("dur"),
new Discord.ButtonBuilder()
.setEmoji("🔊")
.setStyle(Discord.ButtonStyle.Secondary)
.setCustomId("volume")
)

db.set(`music_${interaction.member.voice.channel.id}`, { muzik: string, user: interaction.user.id, başlık: tracks.title, yükleyen: tracks.author, süre: tracks.duration, görüntülenme: tracks.views, thumb: tracks.thumbnail, video: tracks.url})
await interaction.followUp({embeds: [embed], components: [row]})

 }
}
