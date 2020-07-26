class GameData {
    // constructor() {
    //     // this.totalScore: 0
    //     // this.roundClassic: 0
    //     // this.roundTimer: 0
    //     // this.bestTime: 0
    // }

    static get(prop) {
        let playerId = this.getPlayerId();
        prop = playerId + '_' + prop;
        let defaultVal = null !== prop.match(/round/g) ? 1 : 0;
        prop = btoa(prop);
        defaultVal = btoa(defaultVal);

        let data = localStorage.getItem(prop)
            ? localStorage.getItem(prop)
            : defaultVal;

        return parseInt(atob(data));
    }

    static set(prop, value) {
        let playerId = this.getPlayerId();
        prop = playerId + '_' + prop;
        prop = btoa(prop);
        localStorage.setItem(prop, btoa(value));
    }

    static increaseRound(round) {
        // let playerId = this.getPlayerId();
        this.set(round, this.get(round) + 1);
    }

    static getPlayerName() {
        return isInstantGame ? FBInstant.player.getName() : 'Player';
    }

    static getPlayerId() {
        return isInstantGame ? FBInstant.player.getID() : 12345678;
    }
}

export default GameData;
