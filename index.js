const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember]});
const config = require("./src/config.js");
const { readdirSync } = require("fs")
const moment = require("moment");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const db = require("croxydb")
let token = config.token

client.commands = new Collection()

const rest = new REST({ version: '10' }).setToken(token);

const log = l => { console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${l}`) };

//command-handler
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
    log(`${client.user.username} Aktif Edildi!`);
})

//event-handler
readdirSync('./src/events').forEach(async file => {
	const event = require(`./src/events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
})
//

client.login(token)


const Discord = require("discord.js")
const modal = new Discord.ModalBuilder()
.setCustomId('form')
.setTitle('Code Share - Raven')
  const a1 = new Discord.TextInputBuilder()
  .setCustomId('baslik')
  .setLabel('Kodunuzun İsmi')
  .setStyle(Discord.TextInputStyle.Paragraph)
  .setMinLength(2)
  .setPlaceholder('istatistik-v14')
  .setRequired(true)
	const a2 = new Discord.TextInputBuilder()
	.setCustomId('kod')
	.setLabel('Kod')
  .setStyle(Discord.TextInputStyle.Paragraph)
	.setMinLength(1)
	.setPlaceholder('Lütfen v14 altı kod paylaşmayınız.')
	.setRequired(true)

    const row = new Discord.ActionRowBuilder().addComponents(a1);
    const row2 = new Discord.ActionRowBuilder().addComponents(a2);

    modal.addComponents(row, row2);


client.on('interactionCreate', async (interaction) => {

  if (interaction.commandName ==="code-share") {
    await interaction.showModal(modal);
	}
})
client.on('interactionCreate', async interaction => {
  if (interaction.type !== Discord.InteractionType.ModalSubmit) return;
  if (interaction.customId === 'form') {


const baslik = interaction.fields.getTextInputValue("baslik")
const code = interaction.fields.getTextInputValue('kod')
if (baslik > 6) return interaction.reply({content: "Başlık 6 harften uzun olamaz!", ephemeral: true})
if (code < 20) return interaction.reply({content: "Kodun çok kısa :(", ephemeral: true})
if (code > 300) return interaction.reply({content: "Kodun çok uzun :(", ephemeral: true})
  if(!code.includes("const" || "let" || "var")) return interaction.reply({content: "Bu bir kod değil gibi duruyor..", ephemeral: true})
  const kanal = "997487955860009038"
  if (!kanal) return;
  const embed = new Discord.EmbedBuilder()
  .setAuthor({name: interaction.user.tag, iconURL: interaction.user.avatarURL({dynamic: true})})
  .setDescription("Kod Başlığı: **"+baslik+"**")
  .addFields({name: `Kod`, value: "```"+code+"```", inline: true})
  .setTimestamp()
  .setFooter({text: "Raven", iconURL: interaction.guild.iconURL(({}))})
  .setColor("Green")
  .setThumbnail(interaction.guild.iconURL({}))
  const row = new Discord.ActionRowBuilder()
  .addComponents(
new Discord.ButtonBuilder()
.setLabel("Kodu Paylaş")
.setStyle(Discord.ButtonStyle.Success)
.setCustomId("paylaş"),
new Discord.ButtonBuilder()
.setLabel("Reddet")
.setStyle(Discord.ButtonStyle.Secondary)
.setCustomId("reddet")

  )
  let log = "1032320545703862332"
const as = new Discord.EmbedBuilder()
.setDescription("<@"+interaction.user.id+">, Kodun başarıyla yetkililere incelenmek üzerine gönderildi.")
.setColor("Grey")
client.channels.cache.get(log).send({embeds: [as]})
client.channels.cache.get(kanal).send({embeds: [embed], components: [row]}).then(mesaj => {
  interaction.reply({content: "Kod yetkililere gönderildi.", ephemeral: true})
  db.set(`kod_${mesaj.id}`, {kod: code, baslik: baslik, sahip: interaction.user.id, sahips: interaction.user.tag, avatar: interaction.user.avatarURL({dynamic: true})})
})
}
})
client.on("interactionCreate", interaction => {
if (interaction.customId === "reddet") {
let log = "1032320545703862332"
const data = db.fetch(`kod_${interaction.message.id}`)
let user = data.sahip
const embed = new Discord.EmbedBuilder()
.setDescription("<@"+user+">, Üzgünüm ama kodun yetkililer tarafından reddedilmiştir.")
.setColor("Red")
client.channels.cache.get(log).send({embeds: [embed]})
db.delete(`kod_${interaction.message.id}`)
}


if (interaction.customId === "paylaş") {
  let kategori = "1032314360971927593"
  const data = db.fetch(`kod_${interaction.message.id}`)
  let users = data.sahip
  let usır = data.sahips
  let baslik = data.baslik
  let kod = data.kod
  let avatar = data.avatar
  interaction.guild.channels.create({name: baslik, type: Discord.ChannelType.GuildText}).then(kanal => {
    kanal.setParent(kategori)
    kanal.send({content: "```js\n"+kod+"```"})
    kanal.send({content: "Bu kod "+usır+" tarafından paylaşılmıştır."})

const embed = new Discord.EmbedBuilder()
.setDescription("Bu kod `"+interaction.user.tag+"` tarafından kabul edilmiştir.")
.setColor("Gold")
interaction.update({embeds: [embed], components: []})
let log = "1032320545703862332"
const assd = new Discord.EmbedBuilder()
.setDescription("<@"+users+">, Tebrikler kodun yetkililer tarafından onaylandı.")
.setColor("Green")
client.channels.cache.get(log).send({embeds: [assd]})
db.delete(`kod_${interaction.message.id}`)
})
}
})
