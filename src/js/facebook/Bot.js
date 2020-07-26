export default {

    initSubscribe() {
        this.subscribe()
    },


    // Called from FBAction
    setSessionData() {

        FBInstant.setSessionData({
            playerName: FBInstant.player.getName()
        })

        FBInstant.getLeaderboardAsync('leaderboard')
            .then((leaderboard) => {
            return leaderboard.getPlayerEntryAsync();
        })
            .then((entry) => {

            if(entry) {
                FBInstant.setSessionData({
                    bestScore: entry.getScore(),
                    playerName: FBInstant.player.getName()
                })
            }

            //console.log(entry.getRank()); // 2
            //console.log(entry.getExtraData()); // '{race: "elf", level: 3}'
        });



    },


    //    showBotSubscribe() {
    //
    //        FBInstant.player.canSubscribeBotAsync().then((can_subscribe) => {
    //
    //            console.log(can_subscribe)
    //
    //            if(can_subscribe) {
    //                // Show Personalized dialog 
    //
    //                this.subscribe()
    //
    //            }
    //
    //        })
    //
    //
    //    },



    subscribe() {

        FBInstant.player.subscribeBotAsync().then(
            // Player is subscribed to the bot
            console.log('bot subscribed')
        ).catch(function (e) {
            // Handle subscription failure
            console.log('not subscribed to bot')
        });

    }



}