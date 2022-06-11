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

        guild.emojis.create("http://ddragon.leagueoflegends.com/cdn/12.10.1/img/champion/" + champName + ".png", "champ_"+champName+"_lol").then(emoji => {

            emojiDiscordIds["Champions"]["champ_"+champName+"_lol"] = "<:" + emoji.name + ":" + emoji.id + ">"

            EmojiCreated += 1

            if(EmojiCreated == Object.keys(champsData).length) {
                Fs.open("emoji_discord_ids.json", 'w', (err, fd) => {
                    if(err) {
                        console.log(err)
                        return
                    }
            
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

    let localEmojis = [["position_adc_lol", "Position_Master-Bot.png"], ["position_support_lol", "Position_Master-Support.png"], ["position_mid_lol", "Position_Master-Mid.png"], ["position_top_lol", "Position_Master-Top.png"], ["position_jungle_lol", "Position_Master-Jungle.png"]]
    for(let [name, path] of localEmojis){

        let guild
        await client.guilds.fetch(guildIds[guildIndex]).then(p_guild => {
            guild = p_guild
        }).catch(err => {
            console.log(err)
        })

        guild.emojis.create("./assets/emojis/" + path, name).then(emoji => {
            emojiDiscordIds["Roles"][name] = "<:" + emoji.name + ":" + emoji.id + ">"
        }).catch(err => {
            console.log(err)
        })

        if(EmojiIndex == 49){
            EmojiIndex = 0
            guildIndex += 1
        }
        else{
            EmojiIndex += 1
        }
    }
})


