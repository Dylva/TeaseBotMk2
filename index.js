const Discord = require("discord.js");
const dotenv = require("dotenv");
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
const fs = require("fs");
const {Player} = require("discord-player");

dotenv.config();
const TOKEN = process.env.TOKEN;

// 'node index.js load'
const LOAD_COMMANDS = process.argv[2] == "load";

const CLIENT_ID = process.env.CLIENT_ID
const GUILD_ID = process.env.GUILD_ID

// creates the client
const client = new Discord.Client({
    intents:[
        "GUILDS",
        "GUILD_VOICE_STATES"
    ]
});
// creates a player using the client info and selects highest audio option
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})


client.clientcommands = new Discord.Collection()
let commands = []
const files = fs.readdirSync("./commandFiles").filter(file => file.endsWith(".js"));
for (let file of files){
    let cmd = require(`./commandFiles/${file}`);
    client.clientcommands.set(cmd.data.name, cmd);
    if(LOAD_COMMANDS) commands.push(cmd.data.toJSON()); 
}

if(LOAD_COMMANDS){
    let rest = new REST({version: "9"}).setToken(TOKEN)
    console.log("Loading commands")
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body: commands})
    .then(() => {
        console.log("Finished loading commands")
        process.exit();
    })
    .catch((err) => {
        if(err){
            console.log(err);
            process.exit(1)
        }
    })
}
else {
    client.on("ready", ()=> {
        console.log(`Logged in as ${client.user.tag}`)
    })
    client.on("interactionCreate", (interaction) => {
        async function handleCommand() {
            if(!interaction.isCommand()) return
            
            let cmd = client.clientcommands.get(interaction.commandName)
            if(!cmd) interaction.reply("Not a valid command")

            await interaction.deferReply()
            await cmd.run({client, interaction})
        }
        handleCommand()
    })
    client.login(TOKEN)
}