import Score from './Score.js';
import Sound from '../Sound.js';
import GameMode from '../GameMode.js';

class NavMenu {
    constructor(scene) {
        this.scene = scene;
    }

    render() {
        this.renderBar();
        this.renderHome();

        this.renderUserPhoto();
        this.renderUserName();

        let score = new Score(this.scene);
        this.scene.score = score;

        let sound = new Sound(this.scene);

        let gameMode = new GameMode(this.scene);
    }

    renderBar() {
        this.scene.add.image(0, 0, 'barUp').setOrigin(0);
    }

    renderHome() {
        let home = this.scene.add
            .image(18, 18, 'home')
            .setInteractive({ useHandCursor: true });

        home.on('pointerup', () => {
            home.clickEffect().then(() => {
                this.scene.scene.pause();
                game.scene.start('Pause');
            });
        });
    }

    // renderSound() {
    //     this.scene.add.image(game.config.width - 18, 18, 'audioOn');
    // }

    // execClickEffect(btn, scale = 0.8) {
    //     //document.getElementsByTagName('canvas')[0].style.pointerEvents = 'none';
    //     this.scene.sound.play('menuButton', { volume: 0.1 });
    //     this.scene.tweens.add({
    //         targets: [btn],
    //         yoyo: true,
    //         duration: 200,
    //         scaleX: scale,
    //         scaleY: scale
    //     });
    // }

    renderUserPhoto(x = 34, photo = 'playerPhoto') {
        // let x = 34;
        let y = 68;

        let graphics = this.scene.add.graphics({
            fillStyle: { color: 0xffffff }
        });
        let circle = new Phaser.Geom.Circle(x, y, 23);
        graphics.fillCircleShape(circle);

        let mask = graphics.createGeometryMask();

        let userPhoto = this.scene.add
            .image(x, y, photo)
            .setDisplaySize(60, 60);

        userPhoto.setMask(mask).setDepth(2);
        let userPhotoBorder = this.scene.add
            .image(userPhoto.x, userPhoto.y, 'playerMask')
            .setDisplaySize(52, 52)
            .setDepth(1);

        if (game.mode === 'online') {
            this.printColorBulltet(userPhoto, photo);
        }
    }

    printColorBulltet(userPhoto, type) {
        let color = type === 'playerPhoto' ? 0x40b2e5 : 0xf7ab24;

        let circle = new Phaser.Geom.Circle(
            userPhoto.x + 20,
            userPhoto.y + 15,
            5
        );
        let graphics = this.scene.add.graphics({
            fillStyle: { color: color }
        });
        graphics.depth = userPhoto.depth + 1;
        graphics.fillCircleShape(circle);
    }

    renderUserName(x = 70, playerName = game.data.getPlayerName()) {
        let text = this.scene.add
            .text(x, 42, playerName, {
                fontFamily: 'Acme',
                fontSize: 18,
                fontStyle: 'bold',
                color: '#ffffff',
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
            .setOrigin(0);
    }
}

export default NavMenu;
