// import FbShortcut from '../facebook/Shortcut';

class GameOverOnline extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameOverOnline'
        });
    }

    create() {
        //FbShortcut.create(this);
        // Show an ad
        if (isInstantGame) {
            game.FbAds.show(this);
        }

        // SCORE =========================================================
        // Syncronize score with facebook
        let initialFbScore = game.scene.getScene('MainScene')
            .initLeaderboardScore;

        if (initialFbScore > game.data.get('totalScore')) {
            game.data.set('totalScore', initialFbScore);
        }
        // SCORE =========================================================

        game.scene.getScene('MainScene').scene.pause();

        let user = {
            name: game.data.getPlayerName(),
            score: game.scene.getScene('MainScene').score.score
        };
        this.user = user;

        let bot = {
            name: game.scene.getScene('MainScene').botInstance.botName,
            score: game.scene.getScene('MainScene').botInstance.botScoreInstance
                .score
        };
        this.bot = bot;

        if (user.score == bot.score) {
            user.score += 5;
        }

        // SCORE =========================================================
        // SET NEW SCORE
        // locally
        let newScore = user.score + game.data.get('totalScore');
        game.data.set('totalScore', newScore);

        // facebook
        if (isInstantGame) {
            FBInstant.getLeaderboardAsync('leaderboard').then(function(
                leaderboard
            ) {
                return leaderboard.setScoreAsync(newScore);
            });
        }

        // SCORE =========================================================

        let generatingBg = this.add.image(0, 0, 'gameOverBg').setOrigin(0);
        //.setDepth(3);

        // let positions = {
        //     playerPhoto: { y: 231 }
        // };

        // positions.playerPhoto.x = game.mode === 'classic' ? 142 : 100;

        // Round number text
        let roundText = this.add
            .text(
                game.config.width / 2 + 4,
                game.config.height / 2 - 136,
                `Round Complete!`,
                {
                    fontFamily: 'Acme',
                    fontSize: 20,
                    fontStyle: 'bold',
                    color: '#ffffff',
                    stroke: '#138B00',
                    strokeThickness: 2
                }
            )
            .setOrigin(0.5, 0.5);
        this.roundText = roundText;

        let gameCenter = game.config.width / 2 + 4;

        this.add.image(gameCenter, game.config.height / 2 - 50, 'vs');

        this.printPlayer({
            x: gameCenter - 76,
            type: 'user',
            name: user.name,
            photo: 'playerPhoto',
            score: user.score
        });

        this.printPlayer({
            x: gameCenter + 76,
            type: 'bot',
            name: bot.name,
            photo: bot.name,
            score: bot.score
        });

        this.tweenScore('user');

        // setTimeout(() => {
        //     this.showWinner();
        // }, 3000);

        // SET NEW SCORE
        // let newScore = currentScore + game.data.get('totalScore');
        // game.data.set('totalScore', newScore);
        // FBInstant.getLeaderboardAsync('leaderboard').then(function(
        //     leaderboard
        // ) {
        //     return leaderboard.setScoreAsync(newScore);
        // });

        // ------

        let continueGame = this.add
            .image(
                game.config.width / 2 + 10,
                game.config.height / 2 + 62,
                'nextMatchBtn'
            )
            .setDepth(3)
            .setInteractive({ useHandCursor: true });

        let goHome = this.add
            .image(
                game.config.width / 2 + 10,
                game.config.height / 2 + 115,
                'btnGoHome'
            )
            .setDepth(3)
            .setInteractive({ useHandCursor: true });

        continueGame.on('pointerup', () => {
            continueGame.clickEffect().then(() => {
                //game.scene.getScene('MainScene').scene.stop();
                this.scene.stop();
                game.scene.getScene('BotPreload').scene.restart();
            });
        });

        this.nextRoundBtn = continueGame;

        goHome.on('pointerup', () => {
            goHome.clickEffect().then(() => {
                this.scene.stop();
                game.scene.getScene('MainScene').scene.stop();
                game.scene.getScene('Start').scene.start();
            });
        });
    }

    printPlayer({ x, type, name, photo, score }) {
        this[`${type}X`] = x;
        this[`${type}Score`] = score;

        // Player photo
        let y = 242;

        let graphics = this.add.graphics({
            fillStyle: { color: 0xffffff }
        });
        let circle = new Phaser.Geom.Circle(x, y, 32);
        graphics.fillCircleShape(circle);

        let mask = graphics.createGeometryMask();

        let userPhoto = this.add.image(x, y, photo).setDisplaySize(78, 78);

        userPhoto.setMask(mask).setDepth(5);

        let userPhotoBorder = this.add
            .image(userPhoto.x, userPhoto.y, 'playerMask')
            //.setDisplaySize(52, 52)
            .setDepth(4);

        // Player name
        let playerNameText = this.add
            .text(
                // game.config.width / 2 + 45,
                // game.config.height / 2 - 80,
                x,
                y + 48,
                name,
                {
                    fontFamily: 'Acme',
                    fontSize: 19,
                    fontStyle: 'bold',
                    color: '#ffffff',
                    stroke: '#5B5B5B',
                    strokeThickness: 5
                }
            )
            .setOrigin(0.5, 0.5);

        this.playerNameText = playerNameText;

        // Round score
        //game.scene.getScene('MainScene').score.score;
        let roundScore = this.add
            .text(
                // game.config.width / 2 + 50,
                // game.config.height / 2 - 60,
                playerNameText.x + 6,
                playerNameText.y + 22,
                '0',
                {
                    fontFamily: 'Acme',
                    fontSize: 15,
                    fontStyle: 'bold',
                    color: '#ffffff',
                    stroke: '#5B5B5B',
                    strokeThickness: 5
                }
            )
            .setOrigin(0.5, 0.5);

        this[`${type}ScoreText`] = roundScore;

        //this.roundScoreText = roundScore;

        let smallStar = this.add.image(
            roundScore.x - roundScore.displayWidth / 2 - 10,
            roundScore.y + 2,
            'star'
        );
        this[`${type}SmallStar`] = smallStar;
    }

    tweenScore(target = 'user') {
        let scoreTween = this.tweens.addCounter({
            from: 0,
            to: this[`${target}Score`],
            ease: 'Linear',
            duration: 1000,
            repeat: 0,
            onUpdate: () => {
                let currScore = Math.floor(scoreTween.getValue());

                if (currScore % 5 === 0) {
                    this.sound.play('select', { volume: 0.3 });
                }

                let roundScore = this[`${target}ScoreText`];

                roundScore.setText(currScore);
                this[`${target}SmallStar`].setX(
                    roundScore.x - roundScore.displayWidth / 2 - 10
                );
            },
            onComplete: () => {
                setTimeout(() => {
                    if (target === 'user') {
                        this.tweenScore('bot');
                    }

                    if (target === 'bot') {
                        this.showWinner();
                    }
                }, 600);
            }
        });
    }

    showWinner() {
        let userIsWinner = parseInt(this.bot.score) < parseInt(this.user.score);

        if (userIsWinner) {
            this.sound.play('youWin', { volume: 0.3 });
        }

        let text = userIsWinner ? 'You Win!' : 'Opponent won';

        this.roundText.setText(text);
        this.printWinnerBanner();
    }

    printWinnerBanner() {
        let x =
            parseInt(this.bot.score) > parseInt(this.user.score)
                ? this.botX
                : this.userX;

        let winnerBanner = this.add
            .image(x, 213, 'winner')
            .setDepth(10)
            .setScale(0);

        let tween = this.tweens.add({
            targets: [winnerBanner],
            duration: 300,
            scaleX: 1,
            scaleY: 1,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.tweens.add({
                    targets: [winnerBanner],
                    delay: 200,
                    duration: 300,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    yoyo: true,
                    // hold: 200,
                    ease: 'Sine.easeInOut',
                    repeat: 1,
                    onComplete: () => {
                        this.animateNextRoundBtn();
                    }
                });
            }
        });
    }

    animateNextRoundBtn() {
        this.tweens.add({
            targets: [this.nextRoundBtn],
            duration: 800,
            props: {
                scaleX: 1.03,
                scaleY: 1.03
            },
            delay: 500,
            yoyo: true,
            repeat: -1
        });
    }

    resumeGame() {
        let mainScene = game.scene.getScene('MainScene');

        mainScene.scene.resume();

        this.scene.stop();
    }
}

export default GameOverOnline;
