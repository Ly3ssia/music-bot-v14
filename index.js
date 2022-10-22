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
const languagefile = require("./src/language.json")
const player = new Player(client);
client.player = player;
client.distube = new DisTube(client, {
  leaveOnStop: false,
  leaveOnFinish: true,
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
client.distube.on("finish", queue => {
  client.guilds.cache.filter(guild => {
const data = db.fetch(`music_${guild.id}`)
if (!data) return;
const mesaj = data.mesaj
const channels = data.kanal
const channel = guild.channels.cache.get(channels)
const messagef = channel.messages.fetch(mesaj).then(async messagef => {
messagef.edit({content: "🎵 | Music ended.", embeds: [], components: []}).catch(err => {})
})
})
})

client.on("ready", async () => {
  client.guilds.cache.filter(guild => {
const data = db.fetch(`music_${guild.id}`)
if (!data) return;
db.delete(`music_${guild.id}`)
})
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
    console.log(`Bot logged in as ${client.user.tag}!`);
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
  if (interaction.customId === "fast") {
    const queue = client.distube.getQueue(interaction);
       if (!queue) return interaction.reply(`There is no song on the list yet.`)
    let data = db.fetch(`music_${interaction.guild.id}`)
    if (!data) return interaction.reply({content: "I'm sorry.Error **404**", ephemeral: true})
    queue.filters.add("nightcore")
interaction.reply({content: "Speed online!", ephemeral: true})
  }
  if (interaction.customId === "slowmode") {
    const queue = client.distube.getQueue(interaction);
       if (!queue) return interaction.reply(`There is no song on the list yet.`)
    let data = db.fetch(`music_${interaction.guild.id}`)
    if (!data) return interaction.reply({content: "I'm sorry.Error **404**", ephemeral: true})
    queue.filters.add("vaporwave")
interaction.reply({content: "Slowmode online!", ephemeral: true})
  }
  if (interaction.customId === "bassboost") {
    const queue = client.distube.getQueue(interaction);
       if (!queue) return interaction.reply(`There is no song on the list yet.`)
    let data = db.fetch(`music_${interaction.guild.id}`)
    if (!data) return interaction.reply({content: "I'm sorry.Error **404**", ephemeral: true})
    queue.filters.add("bassboost")
interaction.reply({content: "Bassboost online!", ephemeral: true})
  }
  if (interaction.customId === "soru") {
    const queue = client.distube.getQueue(interaction);
       if (!queue) return interaction.reply(`There is no song on the list yet.`)
    let data = db.fetch(`music_${interaction.guild.id}`)
    if (!data) return interaction.reply({content: "I'm sorry.Error **404**", ephemeral: true})
    const part = Math.floor((queue.currentTime / queue.songs[0].duration) * 20);
    const embed = new Discord.EmbedBuilder()
        .setColor('Purple')
        .setDescription(`**[${queue.songs[0].name}](${queue.songs[0].url})**`)
        .setImage(`${queue.songs[0].thumbnail}`)
        .addFields({ name: 'Music Author:', value: `[${queue.songs[0].uploader.name}](${queue.songs[0].uploader.url})`, inline: true })
        .addFields({ name: 'Member:', value: `${queue.songs[0].user}`, inline: true })
        .addFields({ name: 'Voice:', value: `${queue.volume}%`, inline: true })
        .addFields({ name: 'Views:', value: `${queue.songs[0].views}`, inline: true })
        .addFields({ name: 'Like:', value: `${queue.songs[0].likes}`, inline: true })
        .addFields({ name: 'Filtre:', value: `${queue.filters.names.join(', ') || "Normal"}`, inline: true })
        .addFields({ name: `Video Time: **[${queue.formattedCurrentTime} / ${queue.songs[0].formattedDuration}]**`, value: ` ${'<:circle:1033057941647016056>'.repeat(part) + '🎵' + '<:asd:1033046466438107158>'.repeat(20 - part)}`, inline: false })
return interaction.reply({embeds: [embed], ephemeral: true}).catch(err => {})
  }
if (interaction.customId === "dur") {
  const queue = client.distube.getQueue(interaction);
     if (!queue) return interaction.reply(`There is no song on the list yet.`)
  let data = db.fetch(`music_${interaction.guild.id}`)
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
.setEmoji("🎵")
.setStyle(Discord.ButtonStyle.Danger)
.setCustomId("devam")
)
client.distube.pause(interaction)
return interaction.update({embeds: [embed], components: [row]})
}
if (interaction.customId === "skip") {
  const queue = client.distube.getQueue(interaction);
     if (!queue) return interaction.reply(`There is no song on the list yet.`)
  let data = db.fetch(`music_${interaction.guild.id}`)
  if (!data) return interaction.reply({content: "I'm sorry.Error **404**", ephemeral: true})
    if (queue.songs.length === 1) return interaction.reply("No song found in the queue!")
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

client.distube.skip(interaction)
return interaction.update({embeds: [embed]})
}
if (interaction.customId === "loop") {
  const queue = client.distube.getQueue(interaction);
     if (!queue) return interaction.reply(`There is no song on the list yet.`)
  let data = db.fetch(`music_${interaction.guild.id}`)
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
.setImage(`${thumb || "https://cdn.discordapp.com/attachments/997487955860009038/1009062859889705062/Baslksz-1.png"}`)
client.distube.setRepeatMode(interaction, 1);
return interaction.update({embeds: [embed]})
}
if (interaction.customId === "devam") {
  const queue = client.distube.getQueue(interaction);
     if (!queue) return interaction.reply(`There is no song on the list yet.`)
  let data = db.fetch(`music_${interaction.guild.id}`)
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
.setEmoji("🎵")
.setStyle(Discord.ButtonStyle.Secondary)
.setCustomId("dur"),
new Discord.ButtonBuilder()
.setEmoji("🔊")
.setStyle(Discord.ButtonStyle.Secondary)
.setCustomId("volume"),
new Discord.ButtonBuilder()
.setEmoji("⏩")
.setStyle(Discord.ButtonStyle.Secondary)
.setCustomId("skip"),
new Discord.ButtonBuilder()
.setEmoji("🌀")
.setStyle(Discord.ButtonStyle.Secondary)
.setCustomId("loop"),
new Discord.ButtonBuilder()
.setEmoji("❓")
.setStyle(Discord.ButtonStyle.Secondary)
.setCustomId("soru")

)
const row2 = new Discord.ActionRowBuilder()
.addComponents(
  new Discord.ButtonBuilder()
  .setEmoji("🥁")
  .setStyle(Discord.ButtonStyle.Secondary)
  .setCustomId("bassboost"),
  new Discord.ButtonBuilder()
  .setEmoji("<:slowmode:740952943460614185>")
  .setStyle(Discord.ButtonStyle.Secondary)
  .setCustomId("slowmode"),
  new Discord.ButtonBuilder()
  .setEmoji("💨")
  .setStyle(Discord.ButtonStyle.Secondary)
  .setCustomId("fast"),
  new Discord.ButtonBuilder()
  .setLabel("Support Server")
  .setStyle(Discord.ButtonStyle.Link)
  .setURL("https://discord.gg/altyapilar")
)
  client.distube.resume(interaction)
  interaction.update({embeds: [embed], components: [row, row2]})
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
