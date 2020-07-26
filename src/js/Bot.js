import Score from './scenes/Score.js';

class Bot {
    constructor(scene) {
        this.scene = scene;
        this.botName = game.botName;

        this.isBotTurn = false;

        this.letterTexts = [];

        this.printBot();
        this.botScoreInstance = new Score(this.scene, true);
        this.printTurn();
        this.showUserTurn();
    }

    printBot() {
        this.scene.navMenu.renderUserPhoto(220, this.botName);
        this.scene.navMenu.renderUserName(255, this.botName);
    }

    printTurn() {
        this.userTurn = this.scene.add.image(0, 100, 'turn1').setOrigin(0);
        this.userTurn.setX(this.userTurn.x - this.userTurn.displayWidth);

        this.botTurn = this.scene.add
            .image(game.config.width, 100, 'turn2')
            .setOrigin(1, 0);
        this.botTurn.setX(this.botTurn.x + this.botTurn.displayWidth);
    }

    handleTurn() {
        this.scene.canSelectWord = false;

        this.stopCounter();

        this.isBotTurn = !this.isBotTurn;
        setTimeout(() => {
            this.animateTurn(this.isBotTurn);
            //this.scene.sound.play('turn', { volume: 1 });
        }, 700);

        // if (this.isBotTurn) {
        //     let wait = Math.floor(Math.random() * 6) + 1;
        //     setTimeout(() => {
        //         this.playBot();
        //     }, 1000 * wait);
        // }
    }

    showUserTurn() {
        this.scene.canSelectWord = false;
        setTimeout(() => {
            this.animateTurn();
        }, 2500);
    }

    animateTurn(isBotTurn = false) {
        this.scene.sound.play('turn', { volume: 1 });

        let x = isBotTurn ? game.config.width : 0;
        let target = isBotTurn ? this.botTurn : this.userTurn;

        this.scene.tweens.add({
            targets: [target],
            duration: 400,
            yoyo: true,
            hold: 1800,
            x: x,
            ease: 'Power1',
            onYoyo: () => {
                this.scene.sound.play('turn', { volume: 1.0 });
            },
            onComplete: () => {
                this.scene.canSelectWord = true;
                this.printTurnTimer();

                if (this.isBotTurn) {
                    let wait = Math.floor(Math.random() * 30) + 1;
                    //console.log(wait);
                    if (wait < 24) {
                        setTimeout(() => {
                            this.playBot();
                        }, 1000 * wait);
                    }
                } else {
                    this.scene.hintInstance.playBulbTimeline();
                }
            }
        });
    }

    stopCounter() {
        if (typeof this.currentCounter !== 'undefined') {
            this.currentCounter.stop();
            this.currentGraphics.clear();
        }
    }

    printTurnTimer() {
        let props = {
            x: -10,
            to: -10 - 110,
            color: 0x40b2e5
        };

        if (this.isBotTurn) {
            props = {
                x: game.config.width - 120,
                to: 120,
                color: 0xf7ab24
            };
        }

        let graphics = this.scene.add.graphics();
        graphics.fillStyle(props.color, 1);
        graphics.fillRoundedRect(props.x, 108, 130, 6, 3);

        let counter = this.scene.tweens.addCounter({
            from: 0,
            to: props.to,
            duration: 25000,
            ease: 'Linear',
            onUpdate: () => {
                //console.log(graphics.x);
                let value = Math.floor(Math.round(counter.getValue()));
                graphics.x = value;
            },
            onComplete: () => {
                // graphics.clear();
                //console.log('gat');
                this.handleTurn();
            }
        });

        this.currentCounter = counter;
        this.currentGraphics = graphics;
    }

    // Play bot logic
    playBot() {
        let random = this.getRandomWord();

        let wordData = this.getSolutionWord(random);

        this.buildWord(wordData);
    }

    buildWord(wordData) {
        //C54366
        this.letterTexts = [];

        let solution = wordData;

        let x = solution.x;
        let y = solution.y;

        let firstX = null;
        let firstY = null;

        let nr = 0;

        let letterEffect = nr => {
            let letterText = this.getLetterText(x, y);
            if (nr === 0) {
                firstX = letterText.x;
                firstY = letterText.y;
            }

            // print effect here
            letterText.setScale(1.18);
            this.drawLine(firstX, firstY, letterText.x, letterText.y);
            setTimeout(() => {
                letterText.setScale(1);
            }, 200);

            this.letterTexts.push(letterText);
            this.scene.CurrentWordInstance.addLetterBot(letterText.text);

            // console.log(nr, solution.word.length - 1);

            if (nr === solution.word.length - 1) {
                setTimeout(() => {
                    this.letterTexts.forEach(letterText => {
                        letterText.setStroke('#9A5731', 6);
                    });
                    this.scene.CurrentWordInstance.wordFound();
                    this.drawRectangle(solution.word);
                }, 500);
            }

            // finish effect

            let newCoords = window.wordfind.orientations[solution.orientation](
                x,
                y,
                1
            );
            x = newCoords.x;
            y = newCoords.y;

            if (nr < solution.word.length - 1) {
                nr++;

                let speed = parseFloat(
                    Math.random()
                        .toString()
                        .substring(1, 3)
                );

                setTimeout(() => {
                    letterEffect(nr);
                }, 400 * speed);
            }
        };

        letterEffect(nr);

        // for (let i = 0; i < solution.word.length; i++) {
        //     let speed = parseFloat(
        //         Math.random()
        //             .toString()
        //             .substring(1, 3)
        //     );
        //     setTimeout(() => {
        //         let letterText = this.getLetterText(x, y);
        //         if (i === 0) {
        //             firstX = letterText.x;
        //             firstY = letterText.y;
        //         }

        //         //letterText.setColor('#C54366');

        //         // print effect here
        //         letterText.setScale(1.18);
        //         this.drawLine(firstX, firstY, letterText.x, letterText.y);
        //         setTimeout(() => {
        //             letterText.setScale(1);
        //         }, 200);

        //         this.letterTexts.push(letterText);

        //         console.log(i, solution.word.length - 1, this.letterTexts);

        //         if (i === solution.word.length - 1) {
        //             this.letterTexts.forEach(letterText => {
        //                 letterText.setStroke('#1f6b9d', 6);
        //             });
        //         }

        //         // finish effect

        //         let newCoords = window.wordfind.orientations[
        //             solution.orientation
        //         ](x, y, 1);
        //         x = newCoords.x;
        //         y = newCoords.y;
        //     }, i * 520 * speed);
        // }
    }

    drawRectangle(word) {
        let wordIndex = this.scene.selectedRandomWords.indexOf(word);

        // console.table(
        //     word,
        //     wordIndex,
        //     this.scene.selectedRandomWords,
        //     this.scene.selectedRandomWordsTexts[wordIndex].text
        // );

        // Draw rectangle
        let text = this.scene.selectedRandomWordsTexts[wordIndex];
        text.setColor('#ffffff').setStroke('#3e6001', 1);

        let x = text.x - text.displayWidth / 2 - 8;
        let y = text.y - text.displayHeight / 2 - 2;

        let graphics = this.scene.add.graphics();
        // graphics.fillStyle(0x7cbf00, 1);
        graphics.fillStyle(0xf27b2d, 1);
        graphics.fillRoundedRect(
            x,
            y,
            text.displayWidth + 16,
            text.displayHeight + 4,
            4
        );
        graphics.setDepth(1);

        //Delete it from words and texts array
        this.scene.selectedRandomWords.splice(wordIndex, 1);
        this.scene.selectedRandomWordsTexts.splice(wordIndex, 1);
    }

    drawLine(firstX, firstY, actualX, actualY) {
        let color = 0xf7ac23;
        var circle1 = new Phaser.Geom.Circle(firstX, firstY, 5);

        var grp1 = this.scene.add.graphics({
            fillStyle: { color: color }
        });
        grp1.fillCircleShape(circle1);

        var circle2 = new Phaser.Geom.Circle(actualX, actualY, 5);

        var grp2 = this.scene.add.graphics({
            fillStyle: { color: color }
        });
        grp2.fillCircleShape(circle2);

        let graphics = this.scene.add.graphics({
            //0x6cbd00
            lineStyle: { width: 10, color: color }
        });
        let line = new Phaser.Geom.Line(firstX, firstY, actualX, actualY);
        graphics.strokeLineShape(line).setDepth(1);
    }

    getLetterText(x, y) {
        let letterText = null;
        this.scene.allLetters.forEach(letter => {
            if (letter.x === x && letter.y === y) {
                letterText = letter.letterText;
            }
        });

        return letterText;
    }

    getSolutionWord(word) {
        let result = null;
        let puzzleSolution = this.scene.puzzleSolution;
        puzzleSolution.forEach(solutionWord => {
            if (solutionWord.word === word) {
                result = solutionWord;
            }
        });
        return result;
    }

    getRandomWord() {
        let random = Math.floor(
            Math.random() * Math.floor(this.scene.selectedRandomWords.length)
        );

        return this.scene.selectedRandomWords[random];
    }
}

export default Bot;
