const LolApiUtils = require('./LolApiUtils')

module.exports.getPlayerWinrate = (player_name, l_game_data) => {

    let n_win = 0, n_lose = 0
    for(const game_data of l_game_data) {
    
        if(LolApiUtils.GetPlayerDataFromGameData(player_name, game_data).win){
            n_win++
        }
        else{
            n_lose++
        }
    }

    return {
        "winrate": Math.round((n_win / (n_win + n_lose))*100),
        "n_win": n_win,
        "n_lose": n_lose
    }

}