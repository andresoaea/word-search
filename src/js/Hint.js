class Hint {
    constructor(scene, solution) {
        this.scene = scene;

        // -----------------------------------------------
        this.availableHints = localStorage.getItem('hints')
            ? parseInt(localStorage.getItem('hints'))
            : 2;
        // -----------------------------------------------

        this.solution = solution;
        this.renderBulb();
        this.printHintNumber();
        this.count = 0;
        this.lastWord = null;
        this.canDecreaseHints = true;
        this.canClick = true;

        this.watchedAds = 0;

        this.demoHint();
    }

    demoHint() {
        // let demoHintShown = localStorage.getItem('demoHintShown')
        //     ? localStorage.getItem('demoHintShown') === 'yes'
        //         ? true
        //         : false
        //     : false;

        let demoHintShown = game.data.get('demoHintShown');

        //console.log(demoHintShown);
        if (!demoHintShown) {
            setTimeout(() => {
                this.prepareHint();
                game.data.set('demoHintShown', 1);
            }, 2000);
        }
    }

    playBulbTimeline() {
        //console.log(this.watchedAds);
        if (this.watchedAds > 0) {
            return;
        }

        //console.log('executing');

        var timeline = this.scene.tweens.createTimeline();

        timeline.add({
            targets: [this.bulb],
            angle: -30,
            scaleX: 1.3,
            scaleY: 1.3,
            ease: 'Power1',
            duration: 300
        });

        timeline.add({
            targets: [this.bulb],
            angle: 30,
            ease: 'Power1',
            duration: 500
        });

        timeline.add({
            targets: [this.bulb],
            angle: 0,
            scaleX: 1,
            scaleY: 1,
            ease: 'Power1',
            duration: 300
        });

        if (this.bulbTimelineTimeout) {
            clearTimeout(this.bulbTimelineTimeout);
        }

        this.bulbTimelineTimeout = setTimeout(() => {
            timeline.play();
        }, 12000);

        // console.log(this.bulbTimelineTimeout);
    }

    printHintNumber() {
        let text = this.scene.add.text(
            this.bulb.x + 7,
            this.bulb.y + 2,
            this.availableHints !== 0 ? this.availableHints : '',
            {
                color: '#341D51',
                fontFamily: 'Acme',
                fontSize: 12,
                fontStyle: 'bold'
                //stroke: '#eeeeee',
                //  strokeTickness: 3
            }
        );
        this.hintsText = text;
    }

    updateHintsNumber() {
        localStorage.setItem('hints', this.availableHints);
        this.hintsText.setText(
            this.availableHints !== 0 ? this.availableHints : ''
        );
    }

    renderBulb() {
        let bulb = this.scene.add
            .image(game.config.width / 2, 18, 'bulb')
            .setInteractive({ useHandCursor: true });
        bulb.on('pointerup', () => {
            bulb.clickEffect().then(() => {
                FBInstant.logEvent('hint_bulb_clicked', 1);

                if (this.availableHints > 0) {
                    if (!this.canClick) {
                        return;
                    }
                    this.prepareHint();
                    this.canClick = false;
                    if (this.canDecreaseHints) {
                        this.availableHints--;
                        this.updateHintsNumber();
                    }
                } else {
                    this.canClick = true;
                    console.log('no hints');
                    if (this.watchedAds > 0) {
                        game.scene
                            .getScene('MainScene')
                            .currWrdTxt.setText(
                                'You can watch a video next round..'
                            );
                        setTimeout(() => {
                            game.scene
                                .getScene('MainScene')
                                .currWrdTxt.setText(null);
                        }, 1800);
                    } else {
                        game.scene.getScene('MainScene').scene.pause();
                        $('#videoAd h3').text('You have no more hints...');
                        $('#videoAd h4').text(
                            'Watch a video and get 2 free hints!'
                        );
                        $('#watchVideo, #exitVideo, #videoAd h4').show();
                        $('#videoAd').show();
                    }

                    // game.scene
                    //     .getScene('MainScene')
                    //     .currWrdTxt.setText('No more hints..');
                    // setTimeout(() => {
                    //     game.scene
                    //         .getScene('MainScene')
                    //         .currWrdTxt.setText(null);
                    // }, 1000);
                }
            });
        });
        this.bulb = bulb;
    }

    prepareHint() {
        let word;
        let lastWord = null !== this.lastWord ? this.lastWord.slice(0) : null;

        if (this.scene.selectedRandomWords.indexOf(this.lastWord) === -1) {
            let random = Math.floor(
                Math.random() *
                    Math.floor(this.scene.selectedRandomWords.length)
            );

            word = this.scene.selectedRandomWords[random];
            this.lastWord = word;
        } else {
            word = this.lastWord;
        }

        this.getHint(this.getSolutionWord(word));

        this.canDecreaseHints = word === lastWord ? false : true;

        // if (word === lastWord) {
        //     this.canDecreaseHints = false;
        // } else {
        //     this.canDecreaseHints = true;
        // }
    }

    getSolutionWord(word) {
        let result = null;
        this.solution.forEach(solutionWord => {
            if (solutionWord.word === word) {
                result = solutionWord;
            }
        });
        return result;
    }

    getHint(solutionWord) {
        //C54366

        //let solutionWord = this.solution[this.count];
        this.count++;

        let x = solutionWord.x;
        let y = solutionWord.y;

        let initialLetter = this.getLetterText(x, y);

        let newCoords = window.wordfind.orientations[solutionWord.orientation](
            x,
            y,
            solutionWord.word.length - 1
        );

        let lastLetter = this.getLetterText(newCoords.x, newCoords.y);

        this.showHand(initialLetter, lastLetter);
    }

    showHand(initPos, lastPos, stop = false) {
        let hand = this.scene.add
            .image(initPos.x, initPos.y, 'hand')
            .setScale(0.4)
            .setDepth(10)
            .setOrigin(0.35, 0.1);

        let tween = this.scene.tweens.add({
            targets: [hand],
            duration: 1500,
            x: lastPos.x,
            y: lastPos.y,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.scene.tweens.killTweensOf(hand);
                hand.destroy();
                if (!stop) {
                    setTimeout(() => {
                        this.showHand(initPos, lastPos, true);
                    }, 700);
                } else {
                    this.canClick = true;
                }
            }
        });
    }

    // usefull for bot
    // getHint() {
    //     //C54366

    //     let solution = this.solution[this.count];
    //     this.count++;

    //     let x = solution.x;
    //     let y = solution.y;

    //     for (let i = 0; i < solution.word.length; i++) {
    //         this.getLetterText(x, y).setColor('#C54366');

    //         let newCoords = window.wordfind.orientations[solution.orientation](
    //             x,
    //             y,
    //             1
    //         );
    //         x = newCoords.x;
    //         y = newCoords.y;
    //     }
    // }

    getLetterText(x, y) {
        let letterText = null;
        this.scene.allLetters.forEach(letter => {
            if (letter.x === x && letter.y === y) {
                letterText = letter.letterText;
            }
        });

        return letterText;
    }

    showRewardedVideo() {
        $('#videoAd h3').text('Loading Video..');
        $('#watchVideo, #exitVideo, #videoAd h4').hide();

        var ad = null;
        FBInstant.getRewardedVideoAsync('677555846315062_690428925027754')
            .then(rewardedVideo => {
                ad = rewardedVideo;
                return ad.loadAsync();
            })
            .catch(e => {
                $('#videoAd h3').text('No video available now..');
                $('#videoAd h4')
                    .text('Try again later')
                    .show();
                $('#exitVideo').show();
                console.log('Video failed to preload: ' + e.message);
            })
            .then(() => {
                // Ad loaded
                return ad.showAsync();
            })
            .then(() => {
                // Ad watched
                this.watchedAds++;
                $('#videoAd').hide();

                game.scene.getScene('MainScene').scene.resume();
                // Add hints
                this.availableHints += 2;
                this.updateHintsNumber();

                FBInstant.logEvent('hint_v_seen', 1);
            });
    }
}

export default Hint;
