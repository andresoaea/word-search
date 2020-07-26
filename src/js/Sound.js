class Sound {
    constructor(scene = null) {
        this.scene = scene;

        this.soundEnabled = localStorage.getItem('soundEnabled')
            ? localStorage.getItem('soundEnabled') === 'yes'
                ? true
                : false
            : true;

        game.sound.mute = !this.soundEnabled;
        this.printIcon();
    }

    printIcon() {
        this.soundOnBtn = this.scene.add
            .sprite(game.config.width - 18, 18, 'audioOn')
            // .setDepth(4)
            .setAlpha(this.soundEnabled ? 1 : 0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.changeSound();
            });

        this.soundOffBtn = this.scene.add
            .sprite(game.config.width - 18, 18, 'audioOff')
            // .setDepth(4)
            .setAlpha(this.soundEnabled ? 0 : 1)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.changeSound();
            });
    }

    changeSound() {
        this.soundEnabled = !this.soundEnabled;

        //console.log(this.soundEnabled)
        game.sound.mute = !this.soundEnabled;
        localStorage.setItem('soundEnabled', this.soundEnabled ? 'yes' : 'no');

        this.soundOffBtn.setAlpha(!this.soundEnabled);
        this.soundOnBtn.setAlpha(this.soundEnabled);
    }
}

export default Sound;
