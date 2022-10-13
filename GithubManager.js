const { Client, GatewayIntentBits, WebhookClient } = require("discord.js")
const { discordToken, github } = require("./config.json")
const fetch = require("node-fetch")

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] })

client.once("ready", () => {
    console.log(`[${Date()}] Logged in as ${client.user.tag}`)
})

client.on("messageCreate", message => {
    if(message.content.startsWith("!list")) {
        const args = message.content.split(" ")
        args.shift()
        const repoName = args[0]
        if(args.length === 1) {
            fetch(`https://api.github.com/repos/${github.username}/${repoName}/collaborators`, {
                headers: {
                    Authorization: `token ${github.githubToken}`
                }
            })
            .then(res => res.json())
            .then(res => {
                let collaborators = []
                res.forEach(collaborator => {
                    collaborators.push(collaborator.login)
                })
                collaborators = collaborators.join("\n")
                message.reply(`\`\`\`Collaborators for ${github.username}/${repoName}:\n${collaborators}\`\`\``)
            })
        } else {
            message.reply("Please provide a repository name")
        }
    }
    else if(message.content.startsWith("!add")) {
        const args = message.content.split(" ")
        args.shift()
        const repoName = args[0]
        const invitee = args[1]
        if(args.length === 1) {
            fetch(`https://api.github.com/repos/${github.username}/${repoName}/collaborators/${invitee}`, {
                method: "PUT",
                headers: {
                    Authorization: `token ${github.githubToken}`
                }
            })
            .then(res => res.json())
            .then(res => {
                if(!res.hasOwnProperty("message")) {
                    message.reply(`Successfully added ${invitee} as a collaborator to ${github.username}/${repoName}`)
                }
            })
        } else {
            message.reply("Please provide a repository name and collaborator")
        }
    }
})

client.login(discordToken)