const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js")
const Discord = require("discord.js")
const client = new Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildVoiceStates,
    Discord.GatewayIntentBits.MessageContent
  ]
})
const config = require("./src/config.js");
const { readdirSync } = require("fs")
const moment = require("moment");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { DisTube } = require('distube')
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')
const { Player } = require("discord-player")
const db = require("croxydb")
const player = new Player(client);
client.player = player;
client.distube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true
    }),
    new SoundCloudPlugin(),
    new YtDlpPlugin()
  ]
})
let token = config.token

client.commands = new Collection()

const rest = new REST({ version: '10' }).setToken(token);

const commands = [];
readdirSync('./src/commands').forEach(async file => {
  const command = require(`./src/commands/${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
})

client.on("ready", async () => {
        try {
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
        } catch (error) {
            console.error(error);
        }
    console.log(`Bot logged in ${client.user.username}!`);
})
readdirSync('./src/events').forEach(async file => {
	const event = require(`./src/events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
})

client.on("interactionCreate", interaction => {
if (interaction.customId === "dur") {
  const queue = client.distube.getQueue(interaction);
     if (!queue) return interaction.reply(`There is no song on the list yet.`)
  let data = db.fetch(`music_${interaction.member.voice.channel.id}`)
  if (!data) return interaction.reply({content: "I'm sorry.Error **404**", ephemeral: true})
  let usır = data.user
  let string = data.string
  if (interaction.user.id !== usır) return interaction.reply({content: "Only the person who wrote the command can use this button.", ephemeral: true})
const baslik = data.başlık
const author = data.yükleyen
const sure = data.süre
const izlenme = data.görüntülenme
const thumb = data.thumb
const url = data.video
const embed = new Discord.EmbedBuilder()
.addFields({name: "Title", value: `${baslik}`, inline: true})
.addFields({name: "Author", value: `${author}`, inline: true})
.addFields({name: "Time", value: `${sure}`, inline: true})
.addFields({name: "Views", value: `${izlenme}`, inline: true})
.addFields({name: "Thumbnail", value: "[Click]("+thumb+")", inline: true})
.addFields({name: "Video", value: "[Click]("+url+")", inline: true})
.setColor("Aqua")
.setImage(`${thumb}`)
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setEmoji("<:turkbayragi:531486786778824704>")
.setStyle(Discord.ButtonStyle.Secondary)
.setCustomId("devam")
)
client.distube.pause(interaction)
return interaction.update({embeds: [embed], components: [row]})
}
if (interaction.customId === "devam") {
  const queue = client.distube.getQueue(interaction);
     if (!queue) return interaction.reply(`There is no song on the list yet.`)
  let data = db.fetch(`music_${interaction.member.voice.channel.id}`)
  if (!data) return interaction.reply({content: "I'm sorry.Error **404**", ephemeral: true})
  let usır = data.user
  let string = data.string
  if (interaction.user.id !== usır) return interaction.reply({content: "Only the person who wrote the command can use this button.", ephemeral: true})
  const baslik = data.başlık
  const author = data.yükleyen
  const sure = data.süre
  const izlenme = data.görüntülenme
  const thumb = data.thumb
  const url = data.video
  const embed = new Discord.EmbedBuilder()
  .addFields({name: "Title", value: `${baslik}`, inline: true})
  .addFields({name: "Author", value: `${author}`, inline: true})
  .addFields({name: "Time", value: `${sure}`, inline: true})
  .addFields({name: "Views", value: `${izlenme}`, inline: true})
  .addFields({name: "Thumbnail", value: "[Click]("+thumb+")", inline: true})
  .addFields({name: "Video", value: "[Click]("+url+")", inline: true})
  .setColor("Aqua")
  .setImage(`${thumb}`)
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
  client.distube.resume(interaction)
  interaction.update({embeds: [embed], components: [row]})
}
})

const modal = new Discord.ModalBuilder()
.setCustomId('form')
.setTitle('Raven - Music Bot!')
  const a1 = new Discord.TextInputBuilder()
  .setCustomId('setvolume')
  .setLabel('Volume')
  .setStyle(Discord.TextInputStyle.Paragraph)
  .setMinLength(1)
  .setPlaceholder('1 - 100')
  .setRequired(true)

    const row = new Discord.ActionRowBuilder().addComponents(a1);

    modal.addComponents(row);


client.on('interactionCreate', async (interaction) => {

	if(interaction.customId === "volume"){
    await interaction.showModal(modal);
	}
})
client.on('interactionCreate', async interaction => {
    if (interaction.type !== Discord.InteractionType.ModalSubmit) return;
    if (interaction.customId === 'form') {
  const string = interaction.fields.getTextInputValue('setvolume')
  const volume = parseInt(string)
  const queue = client.distube.getQueue(interaction);
     if (!queue) return interaction.reply(`There is no song on the list yet.`)
     if (isNaN(volume)) return interaction.reply("Give me number!")
     if (volume < 1) return interaction.reply("The number must not be less than 1.")
     if (volume > 100) return interaction.reply("The number should not be greater than 100.")
     client.distube.setVolume(interaction, volume);
     interaction.reply("Successfully set the volume of the music to **"+volume+"**")
}
})
client.login(token)
