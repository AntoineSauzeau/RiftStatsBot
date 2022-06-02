'use strict';

const {Client, Collection} = require('discord.js');
const { exit } = require('process');
const sqlite3 = require('sqlite3');
const TeemoJS = require('teemojs')
const Fs = require('fs')
const DbUtils = require('./utils/DbUtils')

const client = new Client({
    intents: ['GUILDS', 'DIRECT_MESSAGES', 'GUILD_MESSAGES'],
    partials: ['MESSAGE', 'CHANNEL']
});

client.commands = new Collection()
client.prefix = '!'

const config = require("./config.json")

//We load Events and Commands
require('./utils/handlers/EventHandler')(client)
require('./utils/handlers/CommandHandler')(client)

let database_exist = false
if (Fs.existsSync('./database.db')){
    database_exist = true
}

client.db = new sqlite3.Database('database.db', (err) => {
    if(err) {
        console.log("Getting error " + err)
        exit(1)
    }

    if(!database_exist){
        const create_request = Fs.readFileSync('create_database.sql', 'ascii')
        client.db.run(create_request)
    }
});

DbUtils.AddAlternativePromiseFunctions(client.db)



client.lolApi = TeemoJS(config.lol.token);

client.login(config.discord.token)