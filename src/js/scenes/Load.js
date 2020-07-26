//import FBAds from './../facebook/Ads'
//import FBBot from './../facebook/Bot'
//import FBShortcut from './../facebook/Shortcut'
//import FBAction from './../facebook/Action'

import AdsNew from '../facebook/AdsNew';

class Load extends Phaser.Scene {
    constructor() {
        super({
            key: 'Load'
        });
    }

    init() {
        //this.cameras.main.setBackgroundColor('#1D0034')
        this.cameras.main.setBackgroundColor('#070B2D');

        if (isInstantGame) {
            game.FbAds = new AdsNew();
            //FBAds.init()
            //FBAction.init() // inited after 40sec
            // FBBot.init() // inited after 50 sec
        }

        Phaser.GameObjects.Image.prototype.clickEffect = function() {
            if (game.sound.context.state === 'suspended') {
                game.sound.context.resume();
            }
            return new Promise(resolve => {
                this.scene.sound.play('menuButton', { volume: 0.13 });
                this.scene.tweens.add({
                    targets: [this],
                    yoyo: true,
                    duration: 200,
                    scaleX: 0.95,
                    scaleY: 0.95,
                    onComplete: () => {
                        resolve();
                    }
                });
            });
        };

        // Video ad buttons init
        $('#watchVideo').on('click', () => {
            game.scene.getScene('MainScene').hintInstance.showRewardedVideo();
        });
        $('#exitVideo').on('click', () => {
            $('#videoAd').hide();
            game.scene.getScene('MainScene').scene.resume();
        });
    }

    preload() {
        /**
         * Load images
         */
        //  this.load.image('user', 'assets/sprites/user.jpg')

        if (isInstantGame) {
            let playerPhoto = FBInstant.player.getPhoto();

            this.load.image('playerPhoto', playerPhoto);
        } else {
            this.load.image('playerPhoto', 'assets/sprites/avatar.svg');
            //this.load.image('playerPhoto', 'assets/sprites/profile_pic.jpg');
        }

        this.load.image('botPhoto', 'assets/sprites/avatar.svg');

        this.load.image('playerMask', 'assets/sprites/player-mask.png');
        this.load.image('startBg', 'assets/sprites/start-scene/bg.png');
        this.load.image(
            'playClassic',
            'assets/sprites/start-scene/play-classic.png'
        );

        this.load.image('home', 'assets/sprites/home.png');
        this.load.image('star', 'assets/sprites/star.png');
        this.load.image('bulb', 'assets/sprites/bulb2.png');
        this.load.image(
            'gamePlaySimple',
            'assets/sprites/game-play-simple.png'
        );
        this.load.image('audioOn', 'assets/sprites/audio-on.png');
        this.load.image('audioOff', 'assets/sprites/audio-off.png');

        this.load.image('playTime', 'assets/sprites/start-scene/play-time.png');
        this.load.image(
            'playOnline',
            'assets/sprites/start-scene/play-online.png'
        );
        this.load.image('logo', 'assets/sprites/start-scene/logo.png');
        this.load.image('nowLogo', 'assets/sprites/start-scene/now-logo.png');
        this.load.image('lupaLogo', 'assets/sprites/start-scene/lupa.png');

        this.load.image('hand', 'assets/sprites/hand.png');

        this.load.image('generating', 'assets/sprites/generating.png');
        this.load.image('loading', 'assets/sprites/loading.png');

        this.load.image('simpleBg', 'assets/sprites/simple-bg.png');
        this.load.image('playBtn', 'assets/sprites/play-btn.png');
        this.load.image('gamePlayBg', 'assets/sprites/game-play-bg.png');

        this.load.image('barUp', 'assets/sprites/bar-up.png');
        this.load.image(
            'pausedContinueBg',
            'assets/sprites/paused-continue-bg.png'
        );
        this.load.image('btnContinue', 'assets/sprites/btn-continue.png');
        this.load.image('btnGoHome', 'assets/sprites/go-home.png');

        //this.load.image('checked-green', 'assets/sprites/checked-green.png');
        this.load.image('clock', 'assets/sprites/clock.svg');

        this.load.image('gameOverBg', 'assets/sprites/game-over-bg.png');
        this.load.image('nextRoundBtn', 'assets/sprites/next-round-btn.png');

        this.load.image('timerClock', 'assets/sprites/timer-clock.png');
        this.load.image('total', 'assets/sprites/total.png');

        this.load.image('compete', 'assets/sprites/compete.png');
        this.load.image('chart', 'assets/sprites/chart.png');
        this.load.image(
            'playWithFriend',
            'assets/sprites/play-with-friend.png'
        );

        this.load.image('turn1', 'assets/sprites/turn1.png');
        this.load.image('turn2', 'assets/sprites/turn2.png');

        // multiplayer
        this.load.image('nextMatchBtn', 'assets/sprites/next-match-btn.png');
        this.load.image('winner', 'assets/sprites/winner.png');
        this.load.image('vs', 'assets/sprites/vs.png');

        // Audio
        this.load.audio('select', 'assets/audio/select.wav');
        this.load.audio('turn', 'assets/audio/turn.wav');
        this.load.audio('wordFound', 'assets/audio/wordFound.wav');
        this.load.audio('notMatch', 'assets/audio/notMatch.wav');
        this.load.audio('youWin', 'assets/audio/youWin.wav');
        this.load.audio('menuButton', 'assets/audio/menuButton.wav');

        this.showPreloader();
        //this.syncFbData();
        this.fbSync();
    }

    fbSync() {
        if (!isInstantGame) {
            return;
        }

        FBInstant.player
            .getDataAsync(['roundclassic', 'roundtimer', 'bestTime'])
            .then(data => {
                if (typeof data.roundclassic !== 'undefined') {
                    let max = Math.max(
                        game.data.get('roundclassic'),
                        data.roundclassic
                    );
                    game.data.set('roundclassic', max);
                }

                if (typeof data.roundtimer !== 'undefined') {
                    let maxT = Math.max(
                        game.data.get('roundtimer'),
                        data.roundtimer
                    );
                    game.data.set('roundtimer', maxT);
                }

                if (typeof data.bestTime !== 'undefined') {
                    let min = Math.min(
                        game.data.get('bestTime') !== 0
                            ? game.data.get('bestTime')
                            : data.bestTime,
                        data.bestTime
                    );

                    game.data.set('bestTime', min);
                }
            });
    }

    // syncFbData() {
    //     if (isInstantGame) {
    //         // Local data
    //         let roundClassic = game.data.get('roundclassic');
    //         let roundTimer = game.data.get('roundtimer');
    //         let bestTime = game.data.get('bestTime');

    //         FBInstant.player.getStatsAsync().then(stats => {
    //             //Facebook data
    //             let fbRoundClassic =
    //                 typeof stats['roundclassic'] !== 'undefined'
    //                     ? stats['roundclassic']
    //                     : 1;

    //             let fbRoundTimer =
    //                 typeof stats['roundtimer'] !== 'undefined'
    //                     ? stats['roundtimer']
    //                     : 1;

    //             let fbBestTime =
    //                 typeof stats['bestTime'] !== 'undefined'
    //                     ? stats['bestTime']
    //                     : bestTime;

    //             if (fbBestTime == 0) {
    //                 fbBestTime = bestTime;
    //             }

    //             // Compare to get biggest value
    //             let bigRoundClassic = Math.max(roundClassic, fbRoundClassic);
    //             let bigRoundTimer = Math.max(roundTimer, fbRoundTimer);
    //             let smallestBestTime = Math.min(bestTime, fbBestTime);

    //             console.log(fbRoundClassic, fbRoundTimer, fbBestTime);
    //             console.log(bigRoundClassic, bigRoundTimer, smallestBestTime);

    //             // Store biggest value
    //             // locally
    //             game.data.set('roundclassic', bigRoundClassic);
    //             game.data.set('roundTimer', bigRoundTimer);
    //             game.data.set('bestTime', smallestBestTime);

    //             // on facebook
    //             FBInstant.player.setStatsAsync({
    //                 roundclassic: bigRoundClassic,
    //                 roundtimer: bigRoundTimer,
    //                 bestTime: smallestBestTime
    //             });

    //             // FBInstant.player.setStatsAsync(data);
    //         });
    //         // console.log(roundClassic, roundTimer, bestTime);
    //     }
    // }

    showPreloader() {
        let scene = this;

        let fontStyle = {
            fontFamily: 'Play',
            fontSize: 28,
            color: '#ffffff',
            stroke: '#fff',
            strokeThickness: 2,
            shadow: {
                offsetX: 1,
                offsetY: 1,
                color: '#000',
                blur: 0,
                stroke: true,
                fill: true
            }
        };

        let progressBar = scene.add.graphics();
        let progressBox = scene.add.graphics();
        progressBox.fillStyle(0x222222, 0.05);
        progressBox.fillRect(
            (game.config.width - 250) / 2,
            game.config.height / 2 + 40,
            250,
            50
        );

        let width = scene.cameras.main.width;
        let height = scene.cameras.main.height;
        let loadingText = scene.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: fontStyle
        });
        loadingText.setOrigin(0.5, 0.5);

        let percentText = scene.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: fontStyle
        });
        percentText.setOrigin(0.5, 0.5);

        scene.load.on('progress', function(value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xbf4689, 1);
            progressBar.fillRect(
                (game.config.width - 250) / 2 + 5,
                game.config.height / 2 + 50,
                240 * value,
                30
            );
        });

        scene.load.on('complete', function() {
            // console.log('preload done')

            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();

            // game.mode = 'online';
            game.scene.start('Start');

            // game.scene.start('MainScene');
            // game.scene.start('BotPreload');

            // game.scene.start('GameOverOnline');
        });
    }
}

export default Load;
