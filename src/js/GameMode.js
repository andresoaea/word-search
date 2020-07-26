import Timer from './Timer.js';
import Bot from './Bot.js';

class GameMode {
    constructor(scene) {
        this.scene = scene;

        switch (game.mode) {
            case 'timer':
                this.playTimer();
                break;
            case 'online':
                this.playOnline();
                break;
            default:
                this.playClassic();
        }
    }

    playClassic() {
        this.scene.add
            .text(310, 45, 'Round', {
                fontFamily: 'Acme',
                fontSize: 18,
                fontStyle: 'bold',
                color: '#ffffff',
                stroke: '#2b1f56',
                strokeThickness: 5
            })
            .setOrigin(0.5, 0);

        this.scene.add
            .text(310, 66, game.data.get('roundclassic'), {
                fontFamily: 'Acme',
                fontSize: 18,
                fontStyle: 'bold',
                color: '#ffffff',
                stroke: '#2b1f56',
                strokeThickness: 5
            })
            .setOrigin(0.5, 0);
    }

    playTimer() {
        this.scene.roundTimerInstance = new Timer(this.scene);
    }

    playOnline() {
        this.scene.botInstance = new Bot(this.scene);
    }
}

export default GameMode;
