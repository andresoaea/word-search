import ChooseAsync from '../facebook/ChooseAsync';

//import Sound from './../Sound'

class Start extends Phaser.Scene {
    constructor() {
        super({
            key: 'Start'
        });
    }

    init() {
        let soundEnabled = localStorage.getItem('soundEnabled')
            ? localStorage.getItem('soundEnabled') === 'yes'
                ? true
                : false
            : true;
        game.sound.mute = !soundEnabled;

        // game.events.on('hidden', () => {
        //     if (game.scene.isActive('MainScene')) {
        //         game.scene.getScene('Pause').pauseGame();
        //     }
        // });
    }

    create() {
        //game.scene.getScene('Leaderboard').init();
        //    this.add.image.protptype.test = function() {

        // Phaser.GameObjects.Image.prototype.clickEffect = function() {
        //     if (game.sound.context.state === 'suspended') {
        //         game.sound.context.resume();
        //     }
        //     return new Promise(resolve => {
        //         this.scene.sound.play('menuButton', { volume: 0.13 });
        //         this.scene.tweens.add({
        //             targets: [this],
        //             yoyo: true,
        //             duration: 200,
        //             scaleX: 0.95,
        //             scaleY: 0.95,
        //             onComplete: () => {
        //                 resolve();
        //             }
        //         });
        //     });
        // };

        // };
        //  document.getElementById('phaser-game').requestFullscreen()

        this.add.image(0, 0, 'startBg').setOrigin(0);

        let logo = this.add
            .image(game.config.width / 2, 125, 'logo')
            .setScale(0);

        let lupa = this.add.image(-200, 300, 'lupaLogo').setScale(0);

        let now = this.add.image(400, 162, 'nowLogo');

        // Animate logo
        // Animate word search text

        this.tweens.add({
            targets: [logo],
            duration: 400,
            props: {
                scaleX: '1',
                scaleY: '1'
            }
        });

        this.tweens.add({
            targets: [lupa],
            duration: 400,
            props: {
                scaleX: '1',
                scaleY: '1',
                x: this.game.config.width / 2 - 87,
                y: 130
            },
            onComplete: () => {
                this.tweens.add({
                    targets: [now],
                    duration: 400,
                    props: {
                        scaleX: '1',
                        scaleY: '1',
                        x: this.game.config.width / 2 - 10,
                        y: 162
                    },
                    onComplete: () => {
                        this.tweens.add({
                            targets: [now],
                            duration: 600,
                            yoyo: true,
                            props: {
                                scaleX: '+=.1',
                                scaleY: '+=.1'
                            }
                        });
                    }
                });
            }
        });

        // Play Button
        let playBtn1 = this.add
            .image(
                game.config.width / 2,
                game.config.height - 300,
                'playOnline'
            )
            .setInteractive({ useHandCursor: true });

        playBtn1.on('pointerdown', () => {
            playBtn1.clickEffect().then(() => {
                game.mode = 'online';
                this.startMainScene(true);
            });
        });
        this.playBtn1 = playBtn1;

        // Play timer
        let playBtn2 = this.add
            .image(
                game.config.width / 2,
                game.config.height - 227,
                'playClassic'
            )
            .setInteractive({ useHandCursor: true });

        playBtn2.on('pointerdown', () => {
            playBtn2.clickEffect().then(() => {
                game.mode = 'classic';
                //this.game.mode = 'online';
                this.startMainScene();
            });
        });

        this.playBtn2 = playBtn2;

        // Play Online
        let playBtn3 = this.add
            .image(game.config.width / 2, game.config.height - 160, 'playTime')
            .setInteractive({ useHandCursor: true });

        playBtn3.on('pointerdown', () => {
            playBtn3.clickEffect().then(() => {
                this.game.mode = 'timer';
                this.startMainScene();
            });
        });

        this.playBtn3 = playBtn3;

        // Animate buttons
        this.animatePlayButton();

        // Play friendly
        let playWithFriend = this.add
            .image(
                game.config.width / 2 - 60,
                game.config.height / 2 + 215,
                'playWithFriend'
            )
            .setInteractive({ useHandCursor: true });

        playWithFriend.on('pointerdown', () => {
            playWithFriend.clickEffect().then(() => {
                ChooseAsync.choose();
            });
        });

        // Leaderboard
        let leaderboardBtn = this.add
            .image(
                game.config.width / 2 + 85,
                game.config.height / 2 + 213,
                'chart'
            )
            .setInteractive({ useHandCursor: true });

        leaderboardBtn.on('pointerdown', () => {
            leaderboardBtn.clickEffect().then(() => {
                this.scene.pause();
                game.scene.start('Leaderboard');
            });
        });

        // Track loading exit
        // if (isInstantGame && !window.location.href.includes('localhost')) {
        //     FBInstant.logEvent('loading_finished', 1);
        // }

        // Share button
        // let shareIconX = game.config.width/2 - 40
        // let shareIcon = this.add.sprite(shareIconX, iconY, 'share')
        // .setScale(.5)
        // .setInteractive({useHandCursor: true})
        // .on('pointerdown', () => {

        //     let imgFromPage = 'https://scontent-otp1-1.xx.fbcdn.net/v/t1.0-9/67739093_108670510477096_4350643970670329856_n.png?_nc_cat=110&_nc_oc=AQnjfc3SKsohFRlhf7Z3UtnMGf4O_UhQmtJyz6okg-HqAy6AM-IDwSQozVjkAbbOiYw&_nc_ht=scontent-otp1-1.xx&oh=39d5c1c1a07fc910475fefaf8d8e39f8&oe=5DDF989A'

        //     Helpers.convertImgToBase64URL(imgFromPage, (base64) => {
        //         FBInstant.shareAsync({
        //             intent: 'REQUEST',
        //             image: base64,
        //             text: 'Play Spatial Go with ' + FBInstant.player.getName() + '!',
        //             data: { foo: 'bar' },
        //         }).then(() => {
        //             console.log('shared from start scene')
        //         });
        //     })

        // })

        // let shareText = addOptionText(shareIconX, 'Share')
        // optionsContainer.add([shareIcon, shareText])

        // Leaderboard button
        // let leaderboardIconX = game.config.width/2 + 40
        // let leaderboardIcon = this.add.sprite(leaderboardIconX, iconY, 'rank')
        // .setScale(.5)
        // .setInteractive({useHandCursor: true})
        // .on('pointerdown', () => {
        //     game.scene.start('Leaderboard')
        // })

        // let leaderboardText = addOptionText(leaderboardIconX, 'Rank')
        // optionsContainer.add([leaderboardIcon, leaderboardText])
    }

    animatePlayButton() {
        if (typeof this.animateBtnI === 'undefined') {
            this.animateBtnI = 1;
        }

        // let btn = number === 0 ? playBtn : playBtn2;
        // let buttonToScale = number === 0 ? 1 : 0;
        let target = this[`playBtn${this.animateBtnI}`];

        setTimeout(() => {
            this.tweens.add({
                targets: [target],
                duration: 1000,
                props: {
                    scaleX: 1.05,
                    scaleY: 1.05
                },
                yoyo: true,
                onComplete: () => {
                    this.tweens.killTweensOf(target);
                    this.animateBtnI++;

                    if (this.animateBtnI === 4) {
                        this.animateBtnI = 1;
                    }
                    this.animatePlayButton();
                }
            });
        }, 800);
    }

    startMainScene(online = false) {
        if (game.sound.context.state === 'suspended') {
            game.sound.context.resume();
        }

        if (online) {
            game.scene.start('BotPreload');
        } else {
            game.scene.start('MainScene');
        }
        //game.scene.start('Leaderboard')
        this.scene.stop();
    }
}

export default Start;
