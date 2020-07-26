export default class AdsNew {
    constructor() {
        this.preloadedInterstitial = null;
        this.vars = {
            isOn: true,
            spaceId: '677555846315062_683473632389950', // Ad ID for Word Search Now
            failedPreload: 0
        };

        this.init();
    }

    init() {
        if (!this.vars.isOn) {
            return;
        }

        if (!FBInstant.getSupportedAPIs().includes('getInterstitialAdAsync')) {
            this.vars.isOn = false;
            return;
        }

        this.preload();

        //        setTimeout(() => {
        //            this.vars.canShow = true
        //        }, 30000)
        // 45000
    }

    preload() {
        this.preloadedInterstitial = null;

        if (this.vars.failedPreload >= 3) {
            // console.log('peste 3 failed')
            return;
        }

        FBInstant.getInterstitialAdAsync(this.vars.spaceId)
            .then(interstitial => {
                this.preloadedInterstitial = interstitial;

                return this.preloadedInterstitial.loadAsync();
            })
            .then(() => {
                console.log('Interstitial ready');
                // console.log(this.preloadedInterstitial)
            })
            .catch(error => {
                this.preloadedInterstitial = null;
                this.vars.failedPreload++;
                setTimeout(() => {
                    this.preload();
                }, 20000);
                console.log('Interstitial failed to preload: ' + error.message);
            });
    }

    show(scene) {
        //console.log(this.vars.canShow);
        if (!this.vars.isOn) {
            return;
        }

        if (!this.preloadedInterstitial) {
            //console.log('nu avem ad');
            this.aferAd();
            return;
        }

        scene.scene.pause();

        this.preloadedInterstitial
            .showAsync()
            .then(() => {
                // User has watched the ad.
                // Perform post-ad success operation

                console.log('Interstitial watched!');
                this.aferAd(scene);
                // this.resetTimer();
            })
            .catch(error => {
                console.log(error.message);
                this.aferAd(scene);
                // this.resetTimer();
            });
    }

    // resetTimer() {
    //     this.vars.canShow = false;

    //     //setTimeout(() => {
    //     this.preload();
    //     this.vars.timeout = setTimeout(() => {
    //         this.vars.canShow = true;
    //     }, 60000);
    //     // }, 100000);
    // }

    aferAd(scene = null) {
        if (scene) {
            setTimeout(() => {
                scene.scene.resume();
            }, 1000);
        }
        this.preload();
    }
}
