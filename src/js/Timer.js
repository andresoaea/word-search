class Timer {
    constructor(scene) {
        this.scene = scene;
        this.seconds = 0;
        this.showRound();
        this.showTimer();
    }

    showRound() {
        this.scene.add
            .text(310, 42, `Round ${game.data.get('roundtimer')}`, {
                fontFamily: 'Acme',
                fontSize: 18,
                fontStyle: 'bold',
                color: '#ffffff',
                stroke: '#2b1f56',
                strokeThickness: 5
            })
            .setOrigin(0.5, 0);
    }

    showTimer() {
        this.scene.add
            .image(344, 71, 'clock')
            .setOrigin(1, 0)
            .setScale(0.82);

        this.timerText = this.scene.add
            .text(324, 66, '00:00', {
                fontFamily: 'Acme',
                fontSize: 18,
                fontStyle: 'bold',
                color: '#ffffff',
                stroke: '#2b1f56',
                strokeThickness: 5
            })
            .setOrigin(1, 0);

        this.timeElapse();
    }

    updateTimer() {
        this.timerText.setText(this.seconds.toMMSS());
    }

    timeElapse() {
        this.timer = this.scene.time.addEvent({
            delay: 1000, // ms
            callback: () => {
                this.seconds++;
                this.updateTimer();
            },
            loop: true,
            timeScale: 1
        });

        // this.scene.roundTimer = timer;
    }

    animateTimerText() {
        this.timerText.setStroke('#469B2E', 6);
        this.scene.tweens.add({
            targets: [this.timerText],
            duration: 200,
            scaleX: 1.2,
            scaleY: 1.2,
            yoyo: true,
            ease: 'Sine.easeInOut',
            repeat: 1,
            onComplete: () => {
                this.timerText.setStroke('#2b1f56', 5);
            }
        });
    }
}

Number.prototype.toMMSS = function() {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - hours * 3600) / 60);
    var seconds = sec_num - hours * 3600 - minutes * 60;

    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    return minutes + ':' + seconds;
};

export default Timer;
