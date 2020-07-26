class Pause extends Phaser.Scene {
    constructor() {
        super({
            key: 'Pause'
        });
    }

    create() {
        let generatingBg = this.add
            .image(0, 0, 'pausedContinueBg')
            .setOrigin(0)
            .setDepth(3);

        let continueGame = this.add
            .image(
                game.config.width / 2 + 10,
                game.config.height / 2 + 40,
                'btnContinue'
            )
            .setDepth(3)
            .setInteractive({ useHandCursor: true });

        let goHome = this.add
            .image(
                game.config.width / 2 + 10,
                game.config.height / 2 + 100,
                'btnGoHome'
            )
            .setDepth(3)
            .setInteractive({ useHandCursor: true });

        continueGame.on('pointerup', () => {
            continueGame.clickEffect().then(() => {
                this.resumeGame();
            });
        });

        goHome.on('pointerup', () => {
            goHome.clickEffect().then(() => {
                this.scene.stop();
                game.scene.getScene('MainScene').scene.stop();
                game.scene.getScene('Start').scene.start();
            });
        });
    }

    resumeGame() {
        let mainScene = game.scene.getScene('MainScene');

        mainScene.scene.resume();

        this.scene.stop();
    }
}

export default Pause;
