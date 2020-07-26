import Helpers from './../Helpers';

export default {
    choose() {
        // console.log('choose');

        FBInstant.context
            .chooseAsync()
            .then(() => {
                game.mode = 'classic';
                game.scene.getScene('Start').startMainScene();
                this.convertImageFromUrl();
            })
            .catch(e => {
                //console.log(e);
                //game.scene.getScene('Start').startMainScene();
            });
    },

    convertImageFromUrl() {
        let imgFromPage =
            'https://scontent-otp1-1.xx.fbcdn.net/v/t1.0-9/s960x960/89435174_100636961569559_8603917287528857600_o.png?_nc_cat=111&_nc_sid=8024bb&_nc_ohc=Fjyjzq-bksoAX9hMoX3&_nc_ht=scontent-otp1-1.xx&oh=b46d631783d08853ea79eab13b6c0a87&oe=5E926BA3';

        Helpers.convertImgToBase64URL(imgFromPage, base64 => {
            this.sendMessage(base64);
        });
    },

    sendMessage(base64) {
        let player = FBInstant.player.getName();
        let payload = {
            action: 'CUSTOM',
            cta: 'Play Now!',
            image: base64,
            text: {
                default: 'Hey! Play Word Search Now with ' + player,
                localizations: {
                    en_US: 'Hey! Play Word Search Now with ' + player
                }
            },
            template: 'play_turn',
            //template: '',
            data: { foo: 'bar' },
            strategy: 'IMMEDIATE',
            notification: 'NO_PUSH'
        };

        // This will post a custom update.
        // If the game is played in a messenger chat thread,
        // this will post a message into the thread with the specified image and text message.
        // When others launch the game from this message,
        // those game sessions will be able to access the specified blob
        // of data through FBInstant.getEntryPointData()
        FBInstant.updateAsync(payload)
            .then(() => {
                console.log('Message was posted!');
            })
            .catch(error => {
                console.log('Message was not posted: ' + error.message);
            });
    }
};
