const { MessageEmbed } = require('discord.js')
const LolApiUtils = require('../utils/LolApiUtils')

module.exports = {
    name: "link",
    description: "...",
    async run(client, message, args) {
        console.log(args)

        let username = args.slice(2).join(' ')
        console.log(username)

        const region = LolApiUtils.getValidRegionName(args[1])
        if(region == -1){
            message.channel.send("The specified region does not exist.")
            return
        }
    
        client.lolApi.get(region, 'summoner.getBySummonerName', username).then(data => {

            if(data == null){
                message.channel.send("Unable to find the account. Check username and region.")
                return
            }

            //The user found with the api search may have a slightly different name than the one given
            username = data.name

            console.log("dsqdqs" + region + username + message.author.id)
            
            //We check that the account is not already associated
            client.db.get("SELECT username_lol, region FROM Users WHERE user_discord_id=$user_discord_id", {
                $user_discord_id: message.author.id
            }, (err, row) => {
                if(err != null){
                    console.log(err)
                }

                console.log(data)

                if(row != undefined){

                    //If the user is already associated with this account we warn him and do nothing else
                    if(row.region == region && row.username_lol == username){
                        message.channel.send("You have already been associated with this account !")
                        return
                    }
                    else{

                        //If the user has already been associated with a different account, we update to put the new account
                        client.db.run("UPDATE Users SET username_lol=$username, region=$region WHERE user_discord_id=$user_discord_id", {
                            $user_discord_id: message.author.id,
                            $region: region,
                            $username: username
                        }, (err) => {
                            if(err != null){
                                console.log(err)
                                return
                            }
                        });
                    }
                }
                else{

                    //If it has never been linked to an account, the association is added directly
                    client.db.run("INSERT INTO Users(user_discord_id, region, username_lol) VALUES($user_discord_id, $region, $username_lol)", {
                        $user_discord_id: message.author.id,
                        $region: region,
                        $username_lol: username
                    }, (err) => {
                        if(err != null){
                            console.log(err)
                            return;
                        }
                    })
                }

                //The user is notified that his account has been associated
                const resEmbed = new MessageEmbed()
                .setTitle("The account " + data.name + " has been linked (Level " + data.summonerLevel + ")")
                .setThumbnail("http://ddragon.leagueoflegends.com/cdn/12.10.1/img/profileicon/"+data.profileIconId+".png")
                .setDescription("You can now use the other commands !")
                .setTimestamp()
                .setFooter("RiftStats 0.1")
                .setColor('#16a085')

                message.channel.send({ embeds: [resEmbed] });
            });
        })
    },
};