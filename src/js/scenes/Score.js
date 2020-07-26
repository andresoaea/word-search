class Scrore {
    constructor(scene, isBot = false) {
        this.score = 0;
        this.scene = scene;
        this.isBot = isBot;
        this.renderScoreImg();
        this.renderScoreText();
    }

    renderScoreImg() {
        let x = this.isBot ? 265 : 80;
        this.starIcon = this.scene.add.image(x, 80, 'star');
    }

    renderScoreText() {
        this.text = this.scene.add
            .text(this.starIcon.x + 8, 66, this.score, {
                fontFamily: 'Acme',
                fontSize: 18,
                fontStyle: 'bold',
                color: '#ffffff',
                stroke: '#2b1f56',
                strokeThickness: 5
            })
            .setOrigin(0);
    }

    increment() {
        let increment = 5;
        this.score += increment;
        this.text.setText(this.score);
    }
}

export default Scrore;
