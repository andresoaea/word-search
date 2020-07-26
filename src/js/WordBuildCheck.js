import CurrentWord from './scenes/CurrentWord.js';

//#A7C95F
let mainColor = '#3EB3F1';
let mainColor0 = 0x44bdf3; //85d3fe; //3eb3f1;
let mainColor1 = 0x1f6b9d;
let pointerDown = false;
let lastLetterX = 0;
let lastLetterY = 0;
let lastLetterText = null;

// let moves = 0;
let orientation;

let drawLineData = {
    firstX: null,
    firstY: null,
    lineGraphics: null,
    lineCircle1: null,
    lineCircle2: null,
    lineGraphics1: null,
    lineCircle11: null,
    lineCircle21: null,
    lastX: null,
    lastY: null
};

let buildedWord = '';
let wordFound = false;

let letterTexts = [];

class WordBuildCheck {
    constructor(scene) {
        this.scene = scene;

        this.gameIsOver = false;

        this.currentWord = new CurrentWord(this.scene);
        //console.log(scene.selectedRandomWordsTexts);

        //Mouse Down
        scene.input.on('pointerdown', () => {
            if (!this.scene.canSelectWord || this.gameIsOver) {
                return;
            }

            if (game.mode === 'online' && this.scene.botInstance.isBotTurn) {
                return;
            }

            pointerDown = true;
            //moves = 0;
            orientation = null;
            this.resetDrawLineData();
            letterTexts = [];

            //console.log(pointerDown);
        });

        // Mouse Up
        scene.input.on('pointerup', () => {
            if (!this.scene.canSelectWord || this.gameIsOver) {
                return;
            }

            if (game.mode === 'online' && this.scene.botInstance.isBotTurn) {
                return;
            }

            pointerDown = false;
            lastLetterX = 0;
            lastLetterY = 0;
            if (null !== lastLetterText) {
                lastLetterText.setScale(1);
            }

            lastLetterText = null;

            //console.log(buildedWord.length);
            if (buildedWord.length < 2) {
                this.currentWord.resetText();
            }

            this.handleBuildedWord();
            this.resetDrawLineData();
            this.clearLineGraphics();

            buildedWord = '';

            //console.log(pointerDown);
        });
    }

    // Line
    // drawLine({ firstX, firstY }, actualX, actualY, wordFound = false) {
    //     if (!wordFound) {
    //         this.clearLineGraphics();
    //     }

    //     let circle11 = new Phaser.Geom.Circle(firstX, firstY, 16);

    //     let grp11 = this.scene.add.graphics({
    //         fillStyle: { color: mainColor1 }
    //     });
    //     grp11.fillCircleShape(circle11);

    //     let circle21 = new Phaser.Geom.Circle(actualX, actualY, 16);

    //     let grp21 = this.scene.add.graphics({
    //         fillStyle: { color: mainColor1 }
    //     });
    //     grp21.fillCircleShape(circle21);

    //     let graphics1 = this.scene.add.graphics({
    //         //0x6cbd00
    //         lineStyle: { width: 32, color: mainColor1 }
    //     });
    //     let line1 = new Phaser.Geom.Line(firstX, firstY, actualX, actualY);
    //     graphics1.strokeLineShape(line1).setDepth(1);

    //     // Second line
    //     let circle1 = new Phaser.Geom.Circle(firstX, firstY, 14);

    //     let grp1 = this.scene.add.graphics({
    //         fillStyle: { color: mainColor0 }
    //     });
    //     grp1.fillCircleShape(circle1);

    //     let circle2 = new Phaser.Geom.Circle(actualX, actualY, 14);

    //     let grp2 = this.scene.add.graphics({
    //         fillStyle: { color: mainColor0 }
    //     });
    //     grp2.fillCircleShape(circle2);

    //     let graphics = this.scene.add.graphics({
    //         //0x6cbd00
    //         lineStyle: { width: 28, color: mainColor0 }
    //     });
    //     let line = new Phaser.Geom.Line(firstX, firstY, actualX, actualY);
    //     graphics.strokeLineShape(line).setDepth(1);

    //     if (!wordFound) {
    //         drawLineData.lineGraphics = graphics;
    //         drawLineData.lineCircle1 = grp1;
    //         drawLineData.lineCircle2 = grp2;
    //         // drawLineData.lineGraphics1 = graphics1;
    //         // drawLineData.lineCircle11 = grp11;
    //         // drawLineData.lineCircle21 = grp21;
    //     }
    // }

    drawLine({ firstX, firstY }, actualX, actualY, wordFound = false) {
        if (!wordFound) {
            this.clearLineGraphics();
        }

        var circle1 = new Phaser.Geom.Circle(firstX, firstY, 5);

        var grp1 = this.scene.add.graphics({
            fillStyle: { color: mainColor0 }
        });
        grp1.fillCircleShape(circle1);

        var circle2 = new Phaser.Geom.Circle(actualX, actualY, 5);

        var grp2 = this.scene.add.graphics({
            fillStyle: { color: mainColor0 }
        });
        grp2.fillCircleShape(circle2);

        let graphics = this.scene.add.graphics({
            //0x6cbd00
            lineStyle: { width: 10, color: mainColor0 }
        });
        let line = new Phaser.Geom.Line(firstX, firstY, actualX, actualY);
        graphics.strokeLineShape(line).setDepth(1);

        if (!wordFound) {
            drawLineData.lineGraphics = graphics;
            drawLineData.lineCircle1 = grp1;
            drawLineData.lineCircle2 = grp2;
        }
    }

    resetDrawLineData() {
        drawLineData.firstX = null;
        drawLineData.firstY = null;
        drawLineData.lastX = null;
        drawLineData.lastY = null;
    }

    clearLineGraphics() {
        if (null !== drawLineData.lineGraphics) {
            drawLineData.lineGraphics.clear();
            drawLineData.lineCircle1.clear();
            drawLineData.lineCircle2.clear();
            // drawLineData.lineGraphics1.clear();
            // drawLineData.lineCircle11.clear();
            // drawLineData.lineCircle21.clear();
        }
    }

    // Draw rectangle under found word
    drawRectangle(index) {
        let text = this.scene.selectedRandomWordsTexts[index];
        text.setColor('#ffffff').setStroke('#3e6001', 1);

        let x = text.x - text.displayWidth / 2 - 8;
        let y = text.y - text.displayHeight / 2 - 2;

        let graphics = this.scene.add.graphics();
        // graphics.fillStyle(0x7cbf00, 1);
        graphics.fillStyle(0x7cbf00, 1);
        graphics.fillRoundedRect(
            x,
            y,
            text.displayWidth + 16,
            text.displayHeight + 4,
            4
        );
        graphics.setDepth(1);

        //console.log(graphics);
        // this.addCheckedMark(x, y);
    }

    // addCheckedMark(x, y, color = 'green') {
    //     this.scene.add
    //         .image(x, y + 2, `checked-${color}`)
    //         .setDepth(2)
    //         .setScale(0.6);
    // }

    handlePointerMove(letterText) {
        if (!pointerDown) {
            return;
        }

        if (lastLetterX === letterText.x && lastLetterY === letterText.y) {
            return;
        }

        if (null !== lastLetterText) {
            let orint = this.getOrientation(
                lastLetterText.inArrayPosition.x,
                lastLetterText.inArrayPosition.y,
                letterText.inArrayPosition.x,
                letterText.inArrayPosition.y
            );

            if (orientation !== null && orientation !== orint) {
                return;
            }

            orientation = orint;

            // console.log(orientation, orint);
        }

        lastLetterX = letterText.x;
        lastLetterY = letterText.y;
        if (null !== lastLetterText) {
            lastLetterText.setScale(1);
        }
        lastLetterText = letterText;

        // New letter selected
        letterText.setScale(1.22);

        letterTexts.push(letterText);

        //Play sound
        this.scene.sound.play('select');

        //console.log(letterText.text);
        let wordArr = letterTexts.map(text => text.text);
        let word = wordArr.join('');
        // console.log(word);
        //this.currentWord.addLetter(letterText.text);
        this.currentWord.updateText(word);

        //Build the word - concatenate letters
        buildedWord += letterText.text.toLowerCase();

        //Draw line
        if (drawLineData.firstX === null) {
            drawLineData.firstX = letterText.x;
            drawLineData.firstY = letterText.y;
        } else {
            this.drawLine(drawLineData, letterText.x, letterText.y);
            drawLineData.lastX = letterText.x;
            drawLineData.lastY = letterText.y;
        }
    }

    handleBuildedWord() {
        if (buildedWord.length < 2) {
            return;
        }

        let wordIndex = this.scene.selectedRandomWords.indexOf(buildedWord);

        //console.log(buildedWord, wordIndex);

        if (wordIndex !== -1) {
            // Word found, delete it from words array
            this.scene.canSelectWord = false;

            this.currentWord.wordFound();

            //Play sound
            this.scene.sound.play('wordFound');

            letterTexts.forEach(letterText => {
                letterText.setStroke('#1f6b9d', 6);
            });

            // Draw line again
            this.drawLine(
                drawLineData,
                drawLineData.lastX,
                drawLineData.lastY,
                true
            );
            // Draw a rectangle under it
            this.drawRectangle(wordIndex);
            //Delete it from words and texts array
            this.scene.selectedRandomWords.splice(wordIndex, 1);
            this.scene.selectedRandomWordsTexts.splice(wordIndex, 1);

            if (this.scene.selectedRandomWords.length === 0) {
                // Finish game
                this.gameIsOver = true;
                // this.scene.sound.play('youWin', { volume: 0.5 });

                // Finish timer mode
                if (game.mode === 'timer') {
                    this.scene.roundTimerInstance.timer.paused = true;
                    this.scene.roundTimerInstance.animateTimerText();
                    // console.log(this.scene.roundTimerInstance.seconds);
                }

                // setTimeout(() => {
                //     this.scene.scene.restart();
                // }, 0.1);
            }
        } else {
            // Word doesn't match
            this.currentWord.wordNotFound();
            //Play sound
            //this.scene.sound.play('notMatch', { volume: 0.3 });
        }

        //console.log(this.scene.selectedRandomWords);

        buildedWord = '';
    }

    getOrientation(x1, y1, x2, y2) {
        for (let orientation in wordfind.orientations) {
            let nextFn = wordfind.orientations[orientation];
            let nextPos = nextFn(x1, y1, 1);

            if (nextPos.x === x2 && nextPos.y === y2) {
                return orientation;
            }
        }

        return null;
    }
}

export default WordBuildCheck;
