const { Client, GatewayIntentBits, WebhookClient } = require("discord.js")
const { discordToken, relayer } = require("./config.json")

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] })
const webhook = new WebhookClient({ url: relayer.webhookUrl })

client.once("ready", () => {
    console.log(`[${Date()}] Logged in as ${client.user.tag}`)
})

client.on("messageCreate", message => {
    console.log("msg")
    if(relayer.channels.includes(message.channelId)) {
        webhook.send({ content: message.content, username: message.author.username, avatarURL: message.author.avatarURL() })
    }
})

client.login(discordToken)