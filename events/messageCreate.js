module.exports = {
    name: "messageCreate",
    once: false,
    execute(client, message) {

        console.log(message.content)
        
        if(message.author.bot) return;
        if(!message.content.startsWith(client.prefix)) return;

        const args = message.content.slice(client.prefix.length).trim().split(/ +/g)
        const cmdName = args[0].toLowerCase()
        if(cmdName.length == 0) return;

        const cmd = client.commands.get(cmdName)
        if(cmd){
            cmd.run(client, message, args)
        }
    }
}