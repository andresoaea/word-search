// External libraries
// import _ from 'lodash';
import $ from 'jquery';
import Phaser from 'phaser';

// window._ = _;
window.$ = $;

// Helpers
import GameLocalStorage from './GameLocalStorage';
//import RexUI from './vendor/RexUI'

import GameData from './GameData';

// Scenes
import MainScene from './scenes/MainScene';
import Load from './scenes/Load';
import Start from './scenes/Start';
import Pause from './scenes/Pause';
import GameOver from './scenes/GameOver';
import GameOverOnline from './scenes/GameOverOnline';
import BotPreload from './scenes/BotPreload';

let mainScene = new MainScene();

let start = new Start();
let load = new Load();
let pause = new Pause();
let gameOver = new GameOver();
let gameOverOnline = new GameOverOnline();
let botPreload = new BotPreload();

// Facebook scenes
import Leaderboard from './scenes/Leaderboard';

let leaderboard = new Leaderboard();

// Game config
let config = {
    type: Phaser.AUTO,
    width: 360,
    height: 600, // 630,
    parent: 'phaser-game',
    title: 'Word Search Now',
    url: '',
    version: '0.1.0',
    backgroundColor: 0x070b2d,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 360,
        height: 600,
        parent: 'phaser-game'
    }
};

let isInstantGame = typeof FBInstant !== 'undefined';

// if (!window.location.href.includes('fbinstant')) {
//     isInstantGame = false;
// }

// function inIframe() {
//     try {
//         return window.self !== window.top;
//     } catch (e) {
//         return true;
//     }
// }

// if (!inIframe()) {
//     isInstantGame = false;
// }

window.isInstantGame = isInstantGame;
//
//console.log(window.location.href)

if (isInstantGame) {
    FBInstantGameInit();
} else {
    startGame();
}

function FBInstantGameInit() {
    FBInstant.initializeAsync().then(() => {
        FBInstant.setLoadingProgress(100);

        FBInstant.startGameAsync().then(() => {
            startGame();
        });
    });
}

function startGame() {
    // Track loading exit
    // if (isInstantGame && !window.location.href.includes('localhost')) {
    //     FBInstant.logEvent('loading_started', 1);
    // }

    // let playerId = isInstantGame ? FBInstant.player.getID() : 12345678;

    //window.gameLocalStorage = new GameLocalStorage(playerId);

    let game = new Phaser.Game(config);
    window.game = game;

    game.mode = 'classic';
    game.playedTimes = 0;

    game.data = GameData;

    // game.data = {
    //     totalScore: 0,
    //     roundClassic: 0,
    //     roundTimer: 0,
    //     bestTime: 0
    // };

    game.scene.add('Load', load);
    game.scene.add('Start', start);
    game.scene.add('MainScene', mainScene);
    game.scene.add('Pause', pause);
    game.scene.add('GameOver', gameOver);
    game.scene.add('GameOverOnline', gameOverOnline);
    game.scene.add('BotPreload', botPreload);

    game.scene.add('Leaderboard', leaderboard);

    game.scene.start('Load');
}
