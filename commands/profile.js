const { MessageEmbed } = require('discord.js')
const LolApiUtils = require('../utils/LolApiUtils')

module.exports = {
    name: "profile",
    description: "...",
    async run(client, message, args) {

        const res = new MessageEmbed()
        
        let username_lol, region
        await client.db.pget("SELECT region, username_lol FROM Users WHERE user_discord_id=?", {
            1: message.author.id
        }
        ).then((row) => {
            username_lol = row.username_lol
            region = row.region
        }
        ).catch((err) => {
            console.log(err)
            return
        });

        await client.lolApi.pget(region, 'summoner.getBySummonerName', username_lol).then(data => {
            console.log(data)
            puuid = data.puuid
        })

        let l_game_id
        const parent_region = LolApiUtils.getParentRegion(region)
        await client.lolApi.pget(parent_region, 'match.getMatchIdsByPUUID', puuid).then(data => {
            l_game_id = data
            console.log(data)
        })

        l_game_data = await LolApiUtils.FetchGameDataFromList(client.lolApi, l_game_id, parent_region)
        console.log(l_game_data)
    

        res.setTitle(username_lol + "'s profile")
        .addField("Games played :", "40", true)
        .addField("Winrate :", "50% (20W, 20L)", true)
        .setColor('#16a085')

        message.channel.send({ embeds: [res] });

    },
};



