import BotNames from './../bot-names.js';

class BotPreload extends Phaser.Scene {
    constructor() {
        super({
            key: 'BotPreload'
        });
    }

    create() {
        let generatingBg = this.add.image(0, 0, 'gameOverBg').setOrigin(0);

        this.add
            .text(
                game.config.width / 2 + 4,
                game.config.height / 2 - 136,
                `Please wait`,
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

        this.gameCenterX = game.config.width / 2;
        this.gameCenterY = game.config.height / 2;

        this.add
            .text(
                // game.config.width / 2 + 45,
                // game.config.height / 2 - 80,
                this.gameCenterX + 4,
                this.gameCenterY - 50,
                'We are looking for \n an opponent..',
                {
                    fontFamily: 'Acme',
                    fontSize: 22,
                    fontStyle: 'bold',
                    color: '#ffffff',
                    stroke: '#5B5B5B',
                    strokeThickness: 5,
                    align: 'center'
                }
            )
            .setOrigin(0.5, 0.5);

        // User
        this.printPlayer();

        // vs
        this.add.image(this.gameCenterX, 340, 'vs');

        // Bot
        let x = this.gameCenterX + 76;
        let y = 340;
        let graphics = this.add.graphics({
            fillStyle: { color: 0xffffff }
        });
        let circle = new Phaser.Geom.Circle(x, y, 32);
        graphics.fillCircleShape(circle);

        let mask = graphics.createGeometryMask();

        this.botX = x;
        this.botY = y;
        this.botMask = mask;

        let botAvatar = this.add
            .image(x, y, 'botPhoto')
            .setDisplaySize(70, 70)
            .setMask(this.botMask)
            .setDepth(5);

        let userPhotoBorder = this.add
            .image(x, y, 'playerMask')
            //.setDisplaySize(52, 52)
            .setDepth(4);

        let randomNames = BotNames.sort(
            () => Math.random() - Math.random()
        ).slice(0, 7);
        this.randomNames = randomNames;

        let avatarTween = this.tweens.add({
            targets: [botAvatar],
            ease: 'Power1',
            duration: 700,
            scaleX: 0.03,
            scaleY: 0.03,
            yoyo: true,
            repeat: -1
            // onComplete: () => {
            //     // randomNames.forEach(name => {
            //     //     this.load.image(name, `assets/players/${name}.jpg`);
            //     // });
            //     // this.load.once('complete', () => {
            //     //     this.afterLoad();
            //     // });
            //     // this.load.start();
            // }
        });

        // setTimeout(() => {
        randomNames.forEach(name => {
            this.load.image(name, `assets/players/${name}.jpg`);
        });
        this.load.once('complete', () => {
            setTimeout(() => {
                avatarTween.stop();
                this.afterLoad();
            }, 3000);
        });
        this.load.start();
        //}, 3000);
    }

    afterLoad() {
        let targets = [];

        this.randomNames.forEach(name => {
            let img = this.add
                .image(this.botX, this.botY, name)
                .setDisplaySize(70, 70)
                .setMask(this.botMask);
            targets.push(img);
        });

        let i = 0;
        let targetI = 0;
        // let targets = [img1, img2];

        let tweenFunc = () => {
            // console.log('aa');
            this.tweens.add({
                targets: [targets[targetI]],
                duration: 30,
                ease: 'Power1',
                depth: 10 + i,
                onComplete: () => {
                    // console.log(
                    //     targets[targetI],
                    //     targetI,
                    //     targets[targetI].depth
                    // );
                    i++;
                    if (i < 30) {
                        targetI++;
                        if (targetI === targets.length) {
                            targetI = 0;
                            targets = targets
                                .slice()
                                .sort(() => Math.random() - 0.5);
                        }
                        tweenFunc();
                    } else {
                        let img = targets[targetI];
                        this.printBotName(img);
                        //console.log(targets[targetI].texture.key);
                    }
                }
            });
        };

        tweenFunc();
    }

    printBotName(img) {
        let text = this.add
            .text(
                // game.config.width / 2 + 45,
                // game.config.height / 2 - 80,
                img.x,
                img.y + 48,
                img.texture.key,
                {
                    fontFamily: 'Acme',
                    fontSize: 19,
                    fontStyle: 'bold',
                    color: '#ffffff',
                    stroke: '#5B5B5B',
                    strokeThickness: 5
                }
            )
            .setOrigin(0.5, 0.5)
            .setScale(0);

        let tween = this.tweens.add({
            targets: [text],
            duration: 800,
            ease: 'Power1',
            scaleX: 1,
            scaleY: 1,
            onComplete: () => {
                this.tweens.killTweensOf(text);
                game.botName = img.texture.key;

                this.startGame();
            }
        });
    }

    printPlayer() {
        let x = this.gameCenterX - 76;
        let y = 340;

        let graphics = this.add.graphics({
            fillStyle: { color: 0xffffff }
        });
        let circle = new Phaser.Geom.Circle(x, y, 32);
        graphics.fillCircleShape(circle);

        let mask = graphics.createGeometryMask();

        let userPhoto = this.add
            .image(x, y, 'playerPhoto')
            .setDisplaySize(78, 78);

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
    }

    // animateNextRoundBtn() {
    //     this.tweens.add({
    //         targets: [this.nextRoundBtn],
    //         duration: 800,
    //         props: {
    //             scaleX: 1.03,
    //             scaleY: 1.03
    //         },
    //         delay: 500,
    //         yoyo: true,
    //         repeat: -1
    //     });
    // }

    startGame() {
        this.scene.stop();
        let mainScene = game.scene.getScene('MainScene');

        mainScene.scene.restart();
    }
}

export default BotPreload;
