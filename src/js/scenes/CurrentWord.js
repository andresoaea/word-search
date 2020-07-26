class CurrentWord {
    constructor(scene) {
        this.scene = scene;
        this.scene.CurrentWordInstance = this;
        this.word = '';
        this.init();
    }

    init() {
        this.text = this.scene.add
            .text(game.config.width / 2, 94, null, {
                fontFamily: 'Acme',
                fontSize: 18,
                fontStyle: 'bold',
                color: '#ffffff',
                stroke: '#2b1f56',
                strokeThickness: 5
            })
            .setOrigin(0.5, 0);

        this.scene.currWrdTxt = this.text;
    }

    // addLetter(letter) {
    //     //console.log(letter);
    //     this.word += letter;
    //     this.updateText();
    // }

    // updateText() {
    //     this.text.setText(this.word.toUpperCase());
    // }

    addLetterBot(letter) {
        this.word += letter;
        this.text.setText(this.word.toUpperCase());
    }

    updateText(word) {
        this.word = word;
        this.text.setText(this.word.toUpperCase());
    }

    resetText() {
        this.word = '';
        this.text.setText(null);
        this.text.setStroke('#2b1f56', 5);
    }

    wordFound() {
        if (game.mode === 'online') {
            this.scene.botInstance.stopCounter();
        }

        this.text.setStroke('#7cbf00', 6);
        this.scene.tweens.add({
            targets: [this.text],
            duration: 500,
            yoyo: true,
            scaleX: 1.4,
            scaleY: 1.4,
            onComplete: () => {
                this.addPoints();
            }
        });
    }

    wordNotFound() {
        this.text.setStroke('#C63A28', 6);
        this.scene.tweens.add({
            targets: [this.text],
            duration: 100,
            yoyo: true,
            x: '-=6',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: [this.text],
                    duration: 100,
                    yoyo: true,
                    x: '+=6',
                    onComplete: () => {
                        this.resetText();
                    }
                });
            }
        });
    }

    addPoints() {
        this.word = this.word.slice(0, -1);

        let star = this.scene.add.image(
            this.text.x - this.text.displayWidth / 2 - 10,
            this.text.y + 10,
            'star'
        );

        let x = 80;

        if (game.mode === 'online' && this.scene.botInstance.isBotTurn) {
            x = 265;
        }

        let tween = this.scene.tweens.add({
            targets: [star],
            duration: 100,
            x: x,
            y: 80,
            onComplete: () => {
                if (
                    game.mode === 'online' &&
                    this.scene.botInstance.isBotTurn
                ) {
                    this.scene.botInstance.botScoreInstance.increment();
                } else {
                    this.scene.score.increment();
                }

                this.scene.tweens.killTweensOf(star);
                star.destroy();
                this.text.setText(this.word);
                if (this.word.length > 0) {
                    this.addPoints();
                } else {
                    // Finished word found animation
                    this.scene.canSelectWord = true;
                    this.resetText();

                    // // Show an ad
                    // if (
                    //     isInstantGame &&
                    //     this.scene.selectedRandomWords.length > 1
                    // ) {
                    //     game.FbAds.show();
                    // }

                    if (game.mode === 'online') {
                        this.scene.botInstance.handleTurn();
                    } else {
                        this.scene.hintInstance.playBulbTimeline();
                    }

                    // Show add in the middle of the game
                    if (isInstantGame) {
                        if (this.scene.selectedRandomWords.length === 6) {
                            game.FbAds.show(this.scene);
                        }
                    }

                    // Game complete
                    if (this.scene.selectedRandomWords.length === 0) {
                        this.scene.sound.play('youWin', { volume: 0.5 });
                        if (game.mode === 'online') {
                            game.scene.getScene('GameOverOnline').scene.start();
                        } else {
                            game.scene.getScene('GameOver').scene.start();
                        }
                    }
                }
            }
        });
    }

    addPoint() {}
}

export default CurrentWord;
