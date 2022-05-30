const { MessageEmbed } = require('discord.js')
const LolApiUtils = require('../utils/LolApiUtils')

module.exports = {
    name: "link",
    description: "...",
    async run(client, message, args) {
        console.log(args)

        const region = LolApiUtils.getValidRegionName(args[1])
        if(region == -1){
            message.channel.send("The specified region does not exist.")
            return
        }
    
        client.lolApi.get(region, 'summoner.getBySummonerName', args[2]).then(data => {

            if(data == null){
                message.channel.send("Unable to find the account. Check username and region.")
                return
            }
            
            //We check that the account is not already associated
            client.db.get("SELECT username_lol FROM Users WHERE user_discord_id=$user_discord_id AND region=$region AND username_lol=$username_lol", {
                $user_discord_id: message.author.id,
                $region: region,
                $username_lol: args[2]
            }, (err, row) => {
                if(err != null){
                    console.log(err)
                }

                if(row != undefined){
                    message.channel.send("You have already been associated with this account !")
                    return
                }

                console.log(data)
                //If it is not the case, we associate it with
                client.db.run("INSERT INTO Users(user_discord_id, region, username_lol) VALUES($user_discord_id, $region, $username_lol)", {
                    $user_discord_id: message.author.id,
                    $region: region,
                    $username_lol: args[2]
                }, (err) => {
                    if(err != null){
                        console.log(err)
                        return;
                    }
                
                    //The user is notified that his account has been associated
                    const resEmbed = new MessageEmbed()
                    .setTitle("The account " + data.name + " has been linked (Niveau " + data.summonerLevel + ")")
                    .setThumbnail("http://ddragon.leagueoflegends.com/cdn/12.10.1/img/profileicon/"+data.profileIconId+".png")
                    .setDescription("You can now use the other commands !")
                    .setTimestamp()
                    .setFooter("RiftStats 0.1")
                    .setColor('#16a085')

                    message.channel.send({ embeds: [resEmbed] });
                })
            });
        })
    },
};