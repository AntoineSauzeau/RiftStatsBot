const {Client} = require('discord.js')
const emojiDiscordIds = require('./emoji_discord_ids.json')
const config = require('./config.json')
const Fs = require('fs')

const client = new Client({
    intents: ['GUILDS']
});

let guildIds = ["984597316751212584", "984597341774434304", "984597367506477056", "984597391363690526", "984427208854622239"]


client.login(config.discord.token)

client.on("ready", async () => {console.log("s")

    for(const guildId of guildIds) {

        let guild = await client.guilds.fetch(guildId)

        let guildEmojis 
        await guild.emojis.fetch().then(emojis => {
            guildEmojis = emojis
        }).catch(err => {
            console.log(err)
            return
        })

        for(emoji of guildEmojis){
            await guild.emojis.delete(emoji[1])
            await new Promise(resolve => setTimeout(resolve, 550));
        }
    }

    console.log("s")

    let settings = {method: "GET"}
    let urlChampsData = "http://ddragon.leagueoflegends.com/cdn/12.10.1/data/en_US/champion.json"
    
    let champsData
    await fetch(urlChampsData, settings)
    .then(res => res.json())
    .then((json) => {
        champsData = json.data
    });

    console.log("s")
    
    let EmojiIndex = 0
    let guildIndex = 0
    let EmojiCreated = 0
    for (let champName in champsData) {

        console.log(champName)
    
        let guild
        await client.guilds.fetch(guildIds[guildIndex]).then(p_guild => {
            guild = p_guild
        }).catch(err => {
            console.log(err)
        })

        console.log("t")
        guild.emojis.create("http://ddragon.leagueoflegends.com/cdn/12.10.1/img/champion/" + champName + ".png", "champ_"+champName+"_lol").then(emoji => {

            emojiDiscordIds["Champions"]["champ_"+champName+"_lol"] = "<:" + emoji.name + ":" + emoji.id + ">"
            console.log(emojiDiscordIds)
            console.log(emoji.id)

            EmojiCreated += 1
            console.log(EmojiCreated)

            if(EmojiCreated == Object.keys(champsData).length) {
                Fs.open("emoji_discord_ids.json", 'w', (err, fd) => {
                    if(err) {
                        console.log(err)
                        return
                    }
            
                    console.log("d")
            
                    Fs.write(fd, JSON.stringify(emojiDiscordIds, null, 2), err => {
                        console.log(err)
                    })
                })
            }
        }).catch(err => {
            console.log(err)
        })

        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if(EmojiIndex == 49){
            EmojiIndex = 0
            guildIndex += 1
        }
        else{
            EmojiIndex += 1
        }
    }
})



async function AddEmojiToGuild(guild, attachments, name_, options) {
    return new Promise((resolve, reject) => {
        guild.emojis.create(attachments, name_, options).then(emoji => {
            console.log("d")
            resolve(emoji)
        }).catch(err => {
            console.log("f")
            reject(err)
        })
    })
}

