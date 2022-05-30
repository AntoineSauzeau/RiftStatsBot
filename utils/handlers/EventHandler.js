const {promisify} = require('util')
const glob = require('glob')

const pGlob = promisify(glob)

module.exports = async (client) => {
    (await pGlob(`${process.cwd()}/events/*.js`)).map(async eventFile => {
        const e = require(eventFile)
        console.log(eventFile)

        if(e.once){
            client.once(e.name, (...args) => e.execute(client, ...args))
        }
        else{
            client.on(e.name, (...args) => e.execute(client, ...args))
        }
    })
}
