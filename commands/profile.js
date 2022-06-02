const { MessageEmbed } = require('discord.js')
const LolApiUtils = require('../utils/LolApiUtils')
const LolStatsUtils = require('../utils/LolStatsUtils')

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

        await client.lolApi.get(region, 'summoner.getBySummonerName', username_lol).then(data => {
            console.log(data)
            puuid = data.puuid
        })

        let l_game_id
        const parent_region = LolApiUtils.getParentRegion(region)
        /*await client.lolApi.get(parent_region, 'match.getMatchIdsByPUUID', puuid).then(data => {
            l_game_id = data
            console.log(data)
        })*/

        l_game_id = await LolApiUtils.GetAllPlayedMatchIdsLastMonth(client.lolApi, puuid, parent_region);

        let l_game_data = await LolApiUtils.FetchGameDataFromList(client.lolApi, l_game_id, parent_region)
        //console.log(l_game_data)

        const win_stats = LolStatsUtils.getPlayerWinrate(username_lol, l_game_data)
        console.log(win_stats)

        res.setTitle(username_lol + "'s profile")
        .addField("Games played :", (win_stats.n_lose+win_stats.n_win).toString(), true)
        .addField("Winrate :", win_stats.winrate + "% ("+win_stats.n_win+"W, "+win_stats.n_lose+"L)", true)
        .setColor('#16a085')

        message.channel.send({ embeds: [res] });

    },
};



