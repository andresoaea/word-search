//================================================
//THIS FILE IS NOT USED
//================================================

let pointerDown = false;
let lastLetterX = 0;
let lastLetterY = 0;
let lastLetterText = null;

let drawLineData = {
    firstX: null,
    firstY: null,
    lineGraphics: null,
    lastX: null,
    lastY: null
};

let buildedWord = '';
let wordFound = false;

class WordCheck {
    constructor(scene) {
        this.scene = scene;

        //console.log(scene.selectedRandomWordsTexts);

        //Mouse Down
        scene.input.on('pointerdown', () => {
            pointerDown = true;

            this.resetDrawLineData();
            //console.log(pointerDown);
        });

        // Mouse Up
        scene.input.on('pointerup', () => {
            pointerDown = false;
            lastLetterX = 0;
            lastLetterY = 0;
            if (null !== lastLetterText) {
                lastLetterText.setScale(1);
            }

            this.handleBuildedWord();

            this.resetDrawLineData();
            this.clearLineGraphics();
            //console.log(pointerDown);
        });
    }

    // Line
    drawLine({ firstX, firstY }, actualX, actualY, wordFound = false) {
        if (!wordFound) {
            this.clearLineGraphics();
        }

        let graphics = this.scene.add.graphics({
            lineStyle: { width: 10, color: 0x6cbd00 }
        });
        let line = new Phaser.Geom.Line(firstX, firstY, actualX, actualY);
        graphics.strokeLineShape(line).setDepth(1);

        if (!wordFound) {
            drawLineData.lineGraphics = graphics;
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
        }
    }

    // Draw rectangle under found word
    drawRectangle(index) {
        let text = this.scene.selectedRandomWordsTexts[index];
        text.setColor('#ffffff');

        let graphics = this.scene.add.graphics();
        graphics.fillStyle(0x009a2b, 1);
        graphics.fillRoundedRect(
            text.x - text.displayWidth / 2 - 6,
            text.y - text.displayHeight / 2 - 2,
            text.displayWidth + 12,
            text.displayHeight + 4,
            4
        );
        graphics.setDepth(1);
        console.log(graphics);
    }

    // Mouse move
    handlePointerMove(letterText) {
        if (!pointerDown) {
            return;
        }

        if (lastLetterX === letterText.x && lastLetterY === letterText.y) {
            return;
        }

        lastLetterX = letterText.x;
        lastLetterY = letterText.y;
        if (null !== lastLetterText) {
            lastLetterText.setScale(1);
        }
        lastLetterText = letterText;

        // New letter selected
        letterText.setScale(1.3);

        //Play sound
        this.scene.sound.play('select');

        //console.log(letterText.text);

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
        let wordIndex = this.scene.selectedRandomWords.indexOf(buildedWord);

        console.log(buildedWord, wordIndex);

        if (wordIndex !== -1) {
            // Word found, delete it from words array
            //Play sound
            this.scene.sound.play('wordFound');

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
        } else {
            // Word doesn't match
            //Play sound
            this.scene.sound.play('notMatch', { volume: 0.3 });
        }

        console.log(this.scene.selectedRandomWords);

        buildedWord = '';
    }
}

export default WordCheck;
