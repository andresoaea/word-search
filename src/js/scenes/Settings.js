class Settings extends Phaser.Scene {
    
    constructor() {
        super({key: 'Settings'})
    }
    
    
    init() {
        this.sound = gameLocalStorage.get('sound') === 'disabled' ? 'disabled' : 'enabled'
    }
    
    create() {
        
        
        // Transparent bagckground
        let rect = new Phaser.Geom.Rectangle(0, 0, game.config.width, game.config.height)
        let graphics = this.add.graphics({ fillStyle: { color: 0x00000 } })

        graphics.fillRectShape(rect).setAlpha(.7)
        

        
        // Back button container
        let backContainer = this.add.container()

        let backIcon = this.add.sprite(10, 30, 'atlas', 'back.png')
            .setScale(.5)
        backContainer.add(backIcon)
        
        // Back text
        let backText = this.add.text(40, 30, 'Back', { 
            fontFamily: 'Play', fontSize: 16, color: '#ffffff' })
            .setOrigin(.5)
            
        
        backContainer.add(backText)
        
        
        _.each(backContainer.list, (item) => {
            item.setInteractive({useHandCursor: true})
                .on('pointerdown', () => {
                    //console.log('settings open')
                    game.scene.resume('Start')
                    this.scene.stop()
                })
        })
        
        
        
        // Settings container
        let settingsContainer = this.add.container(30, 100)
        
        
        // Settings rounded square
        let square = this.add.graphics()
        square.fillStyle(0x232832, 1)
        square.fillRoundedRect(0, 0, 300, 330, 5)
        
        settingsContainer.add(square)
        

        
        let settingsText =  this.add.text(150, 30, 'SETTINGS', { 
            fontFamily: 'Play', fontSize: 26, color: '#ffffff' })
            .setOrigin(.5)
        
        settingsContainer.add(settingsText)
        
        
        
        // Sound controller
        let soundText = this.add.text(30, 80, 'Sound', { 
            fontFamily: 'Play', fontSize: 20, color: '#ffffff' })
        settingsContainer.add(soundText)
        
        
        let on = this.add.sprite(230, 88, 'atlas', 'on.png')
                    .setScale(.75)
                .setInteractive({useHandCursor: true})
                .on('pointerdown', () => {
                    this.switchSound()
                })
        
        let off = this.add.sprite(230, 88, 'atlas', 'off.png')
                    .setScale(.75).setAlpha(this.sound === 'enabled' ? 0 : 1)
        
        
        // 254 on
        let switcher = this.add.sprite((this.sound === 'enabled'? 254 : 206), 90, 'atlas', 'switcher.png')
                    .setScale(.75)
        
        
        settingsContainer.add([on, off, switcher])
        
        this.soundOn = on
        this.soundOff = off
        this.soundSwitcher = switcher
            
      
        
        
    }
    
    switchSound() {
        
        this.sound = this.sound === 'enabled' ? 'disabled' : 'enabled'
        
        gameLocalStorage.set('sound', this.sound)
        
        let soundEnabled = this.sound === 'enabled'
        
        let alpha = soundEnabled ? 0 : 1
        let x = soundEnabled ? 254 : 206
        
       
        this.tweens.add({
            targets: [this.soundOff],
            alpha: alpha,
            duration: 400
        })

         this.tweens.add({
            targets: [this.soundSwitcher],
            x: x,
            duration: 400
        })
        
        
        
    }
    
}


export default Settings