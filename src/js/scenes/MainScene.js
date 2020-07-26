import * as allWords from '../all-words.js';
import WordCheck from '../WordBuildCheck.js';
import NavMenu from './NavMenu.js';
import Hint from '../Hint.js';
import FbShortcut from '../facebook/Shortcut';

const wordFind = require('../wordfind.js');
window.wordfind = wordFind.wordfind;

let attempts = 0;

let letterAnimationTimer = 0;

class MainScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainScene'
        });
    }

    create() {
        FbShortcut.create(this);

        // game.FbAds.resetTimeoutInterval();

        this.canSelectWord = true;
        this.navMenu = new NavMenu(this);

        //Create sounds
        // ['select', 'wordFound'].forEach(key => {
        //     this.sound.add(key, { volume: 0.3 });
        // });
        //this.sound.add('notMatch', { volume: 0.1 });
        //console.log(game.mode);

        this.add.image(0, 0, 'gamePlaySimple').setOrigin(0);

        this.navMenu.render();

        let generatingBg = this.add
            .image(0, 0, 'generating')
            .setOrigin(0)
            .setDepth(3);
        // loadingIcon = this.add
        //     .image(
        //         game.config.width / 2,
        //         game.config.height / 2 - 50,
        //         'loading'
        //     )
        //     .setDepth(4);
        // canSpinLoading = true;

        // window.wordfind = wordfind;

        document.getElementsByTagName('canvas')[0].style.pointerEvents = 'none';
        let promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                // canSpinLoading = false;
                // loadingIcon.destroy();
                this.generateNewPuzzle();
                resolve();
            }, 1000);
        });

        promise.then(() => {
            document.getElementsByTagName('canvas')[0].style.pointerEvents =
                'all';
            generatingBg.destroy();

            this.getInitLeaderboadScore();

            this.hintInstance.playBulbTimeline();

            // Show an ad
            //console.log('playerd tms', game.playedTimes);
            if (isInstantGame && game.playedTimes === 1) {
                setTimeout(() => {
                    game.FbAds.show(this);
                }, 800);
            }
        });

        // Log in fb events play mode
        if (isInstantGame && !window.location.href.includes('localhost')) {
            FBInstant.logEvent(`play_mode_${game.mode}`, 1);
        }
    }

    getInitLeaderboadScore() {
        this.initLeaderboardScore = 0;

        if (isInstantGame) {
            let leaderboard = FBInstant.getLeaderboardAsync('leaderboard');

            leaderboard.then(ldb => {
                ldb.getPlayerEntryAsync().then(entry => {
                    this.initLeaderboardScore = entry.getScore();
                });
            });
        }
    }

    generateNewPuzzle() {
        let randomWords = allWords.default
            .sort(() => Math.random() - Math.random())
            .slice(0, 12);

        // console.log(randomWords);
        let words = randomWords;
        // words = [
        //     'north',
        //     'American',
        //     'give',
        //     'try',
        //     'factor',
        //     'Security',
        //     'past',
        //     'position',
        //     'health',
        //     'Democrat',
        //     'prove',
        //     'citizen'
        // ];

        //words = ['cotto', 'test'];

        words = words.map(word => word.toLowerCase());

        let puzzle = wordfind.newPuzzle(words, {
            // Set dimensions of the puzzle
            height: 9,
            width: 9,
            maxAttempts: 10,
            maxGridGrowth: 0,
            // Set a random character the empty spaces
            fillBlanks: true,
            preferOverlap: true
        });

        //console.log('attempts', attempts);
        // attempts++;
        // console.log('attempts', attempts);

        if (puzzle === 'maxGridExceeded' && attempts < 50) {
            attempts++;
            this.generateNewPuzzle();
            return;
        }

        let solution = wordfind.solve(puzzle, words).found;
        //console.table(solution);

        this.selectedRandomWords = words;
        this.selectedRandomWordsTexts = [];
        this.puzzle = puzzle;
        this.puzzleSolution = solution;
        let wordCheck = new WordCheck(this);
        this.wordCheck = wordCheck;

        this.allLetters = [];

        this.printPuzzle(puzzle);
        this.printSelectedRandomWords(words);

        let hint = new Hint(this, solution);
        this.hintInstance = hint;
    }

    printPuzzle(puzzle) {
        let y = 165;

        puzzle.forEach((line, i) => {
            let x = 42;

            line.forEach((letter, j) => {
                // x,y = spatial position
                // i,j = in puzzle array position
                this.printLetter(x, y, letter, j, i);
                x += 35;
            });
            y += 35;
        });
    }

    //Helpers
    printLetter(x, y, letter, i, j) {
        // setTimeout(() => {
        let letterText = this.add
            .text(x, y, letter.toUpperCase(), {
                fontFamily: 'Acme',
                fontSize: 25,
                fontStyle: 'bold',
                color: '#eeeeee',
                stroke: '#2b1f56',
                strokeThickness: 5
                // backgroundColor: '#ff00ff'
                // shadow: {
                //     offsetX: 0,
                //     offsetY: 0,
                //     color: '#000',
                //     //blur: 0.2,
                //     stroke: true,
                //     fill: true
                // }
            })
            .setOrigin(0.5, 0.5)
            .setAlpha(0)
            .setDepth(2)
            .setAngle(-180)
            .setInteractive({ useHandCursor: true });

        letterText.on('pointermove', () => {
            this.wordCheck.handlePointerMove(letterText);
        });

        // Add in puzzle array position to current text
        letterText.inArrayPosition = {
            x: i,
            y: j
        };

        let tween = this.tweens.add({
            targets: [letterText],
            duration: 1000,
            repeat: 0,
            alpha: 1,
            angle: 0,
            ease: 'Sine.easeInOut'
        });
        // }, letterAnimationTimer);
        // letterAnimationTimer += 10;
        this.allLetters.push({
            x: i,
            y: j,
            letterText
        });
    }

    // Print game used words to bottom area
    printSelectedRandomWords(words) {
        let printedCount = 0;
        let x = 65;
        let y = game.config.height - 90;

        let printWord = (x, y, word) => {
            let text = this.add
                .text(x, y, word.toLowerCase(), {
                    fontFamily: 'Acme',
                    fontSize: 14,
                    color: '#974390', //'#CD497A',
                    fontStyle: 'bold'
                    // stroke: '#fff',
                    // strokeThickness: 3,
                    // shadow: {
                    //     offsetX: 1,
                    //     offsetY: 1,
                    //     color: '#000',
                    //     blur: 0.2,
                    //     stroke: true,
                    //     fill: true
                    // }
                })
                .setOrigin(0.5, 0.5)
                .setDepth(2);

            this.selectedRandomWordsTexts.push(text);
        };

        words.forEach(word => {
            if (printedCount === 3) {
                x = 65;
                y += 24;
                printedCount = 0;
            }

            printWord(x, y, word);
            printedCount++;
            x += 110;
        });
    }

    // update() {
    //     if (canSpinLoading) {
    //         loadingIcon.angle += 10;
    //     }
    // }
}

export default MainScene;
