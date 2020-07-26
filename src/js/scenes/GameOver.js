// import FbShortcut from '../facebook/Shortcut';

class GameOver extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameOver'
        });
    }

    create() {
        // FbShortcut.create(this);
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

        let generatingBg = this.add.image(0, 0, 'gameOverBg').setOrigin(0);
        //.setDepth(3);

        let positions = {
            playerPhoto: { y: 231 }
        };

        positions.playerPhoto.x = game.mode === 'classic' ? 142 : 100;

        // Round number text
        let round = game.data.get(`round${game.mode}`);
        let roundText = this.add
            .text(
                game.config.width / 2 + 4,
                game.config.height / 2 - 136,
                `Round ${round} Complete!`,
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

        game.data.increaseRound(`round${game.mode}`);

        // ======================================================
        //Store Round on facebook data
        if (isInstantGame) {
            FBInstant.player.setDataAsync({
                [`round${game.mode}`]: game.data.get(`round${game.mode}`)
            });
        }
        // ======================================================

        // Player photo
        let x = positions.playerPhoto.x;
        let y = positions.playerPhoto.y;

        let graphics = this.add.graphics({
            fillStyle: { color: 0xffffff }
        });
        let circle = new Phaser.Geom.Circle(x, y, 23);
        graphics.fillCircleShape(circle);

        let mask = graphics.createGeometryMask();

        let userPhoto = this.add
            .image(x, y, 'playerPhoto')
            .setDisplaySize(60, 60);

        userPhoto.setMask(mask).setDepth(5);

        let userPhotoBorder = this.add
            .image(userPhoto.x, userPhoto.y, 'playerMask')
            .setDisplaySize(52, 52)
            .setDepth(4);

        // Player name
        let playerNameText = this.add
            .text(
                // game.config.width / 2 + 45,
                // game.config.height / 2 - 80,
                positions.playerPhoto.x + 80 - 6,
                positions.playerPhoto.y - 12,
                game.data.getPlayerName(),
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
        let currentScore = game.scene.getScene('MainScene').score.score;
        let roundScore = this.add
            .text(
                // game.config.width / 2 + 50,
                // game.config.height / 2 - 60,
                playerNameText.x + 6,
                playerNameText.y + 22,
                currentScore,
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

        this.roundScoreText = roundScore;

        this.smallStar = this.add.image(
            roundScore.x - roundScore.displayWidth / 2 - 10,
            roundScore.y + 2,
            'star'
        );

        // Total score
        let totalScoreImg = this.add.image(
            // game.config.width / 2 + 5,
            // game.config.height / 2 - 10,
            positions.playerPhoto.x + 44,
            positions.playerPhoto.y + 60,
            'total'
        );

        let totalScore = this.add
            .text(
                // game.config.width / 2 + 14,
                // game.config.height / 2 - 2,
                totalScoreImg.x + 8,
                totalScoreImg.y + 8,
                game.data.get('totalScore'),
                {
                    fontFamily: 'Acme',
                    fontSize: 22,
                    fontStyle: 'bold',
                    color: '#ffffff',
                    stroke: '#5B5B5B',
                    strokeThickness: 5
                }
            )
            .setOrigin(0.5, 0.5);

        this.totalScoreText = totalScore;

        // SCORE =========================================================
        // SET NEW SCORE
        // locally
        let newScore = currentScore + game.data.get('totalScore');
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

        this.bigStar = this.add
            .image(
                totalScore.x - totalScore.displayWidth / 2 - 13,
                totalScore.y + 2,
                'star'
            )
            .setScale(1.3);

        // Animate Score
        setTimeout(() => {
            this.animateScore();
        }, 1000);

        let continueGame = this.add
            .image(
                game.config.width / 2 + 10,
                game.config.height / 2 + 62,
                'nextRoundBtn'
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
                this.scene.stop();
                game.scene.getScene('MainScene').scene.restart();
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

        // Timer mode
        if (game.mode === 'timer') {
            this.printTimeInfo();
        }
    }

    animateScore() {
        let star = this.add.image(this.smallStar.x, this.smallStar.y, 'star');

        let tween = this.tweens.add({
            targets: [star],
            duration: 50,
            x: this.bigStar.x,
            y: this.bigStar.y,
            onComplete: () => {
                this.sound.play('select');
                this.tweens.killTweensOf(star);
                star.destroy();
                this.roundScoreText.setText(
                    parseInt(this.roundScoreText.text) - 5
                );
                this.totalScoreText.setText(
                    parseInt(this.totalScoreText.text) + 5
                );

                this.bigStar.setX(
                    this.totalScoreText.x -
                        this.totalScoreText.displayWidth / 2 -
                        13
                );

                if (parseInt(this.roundScoreText.text) > 0) {
                    this.animateScore();
                } else {
                    this.smallStar.destroy();
                    this.roundScoreText.destroy();
                    this.playerNameText.y += 10;
                    this.animatTotalScoreText();
                }
            }
        });
    }

    printTimeInfo() {
        let time = game.scene.getScene('MainScene').roundTimerInstance.seconds;
        let bestTime = game.data.get('bestTime');

        this.printTime(
            'TIME',
            time.toMMSS(),
            game.config.width / 2 + 84,
            game.config.height / 2 - 82
        );

        this.printTime(
            'BEST  TIME',
            bestTime.toMMSS(),
            game.config.width / 2 + 84,
            game.config.height / 2 - 18
        );

        this.checkNewBestTime(time, bestTime);
    }

    checkNewBestTime(time, bestTime) {
        if (time < bestTime || bestTime === 0) {
            // Store locally
            game.data.set('bestTime', time);

            // Store on facebook
            if (isInstantGame) {
                FBInstant.player.setDataAsync({
                    bestTime: time
                });
            }

            this.besttimeElapsedText.setText(time.toMMSS());

            this.besttimeText.setText('NEW  BEST  TIME');
            this.animateNewBestTime(this.besttimeText);
            this.animateNewBestTime(this.besttimeElapsedText);
        }
    }

    animateNewBestTime(target) {
        let initialStroke = target.style.stroke;

        target.setStroke('#4BA403', 5);
        this.tweens.add({
            targets: [target],
            duration: 200,
            scaleX: 1.2,
            scaleY: 1.2,
            yoyo: true,
            ease: 'Sine.easeInOut',
            repeat: 1,
            onComplete: () => {
                target.setStroke(initialStroke, 5);
            }
        });
    }

    printTime(text, time, x, y) {
        let timeText = this.add
            .text(x, y, text, {
                fontFamily: 'Acme',
                fontSize: 14,
                fontStyle: 'bold',
                color: '#ffffff',
                stroke: '#8C7ABF',
                strokeThickness: 3
            })
            .setOrigin(0.5, 0.5)
            .setDepth(4);

        this[
            `${text
                .split(' ')
                .join('')
                .toLowerCase()}Text`
        ] = timeText;

        let timeElapsedText = this.add
            .text(
                // game.config.width / 2 + 50,
                // game.config.height / 2 - 60,
                timeText.x + 8,
                timeText.y + 18,
                time,
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
        this[
            `${text
                .split(' ')
                .join('')
                .toLowerCase()}ElapsedText`
        ] = timeElapsedText;

        let timerClock = this.add.image(
            timeElapsedText.x - timeElapsedText.displayWidth / 2 - 8,
            timeElapsedText.y + 1,
            'timerClock'
        );
    }

    animatTotalScoreText() {
        this.totalScoreText.setStroke('#469B2E', 6);
        this.tweens.add({
            targets: [this.totalScoreText],
            duration: 400,
            scaleX: 1.15,
            scaleY: 1.15,
            yoyo: true,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.totalScoreText.setStroke('#5B5B5B', 5);
                this.animateNextRoundBtn();
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

export default GameOver;
