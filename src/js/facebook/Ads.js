export default class Ads {
    constructor() {
        this.preloadedInterstitial = null;
        this.vars = {
            isOn: true,
            spaceId: '677555846315062_683473632389950', // Ad ID for Word Search Now
            canShow: false,
            failedPreload: 0,
            timeout: null
        };

        this.firstInit();
    }

    resetTimeoutInterval() {
        if (!this.vars.isOn) {
            return;
        }

        if (this.vars.timeout) {
            clearTimeout(this.vars.timeout);
        }

        this.vars.timeout = setTimeout(() => {
            this.vars.canShow = true;
        }, 40000);
    }

    firstInit() {
        // setTimeout(() => {
        this.init();
        setTimeout(() => {
            this.vars.canShow = true;
            //console.log(this.vars.canShow);
        }, 40000);

        // }, 30000);
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
                console.log('Interstitial failed to preload: ' + error.message);
            });
    }

    show() {
        //console.log(this.vars.canShow);
        if (!this.vars.isOn) {
            return;
        }

        if (!this.vars.canShow) {
            //console.log('nu a trecut timerul');
            return;
        }

        if (!this.preloadedInterstitial) {
            //console.log('nu avem ad');
            this.resetTimer();
            return;
        }

        game.scene.getScene('MainScene').scene.pause();

        // Show ad coundown 3 seconds timer
        $('#adCountDown').fadeIn(400);

        //        let timeleft = 10
        //        let downloadTimer = setInterval(() => {
        //            //document.getElementById("secondsCounter").innerHTML = 10 - timeleftlet
        //            console.log('seconds left ' + (10 - timeleft))
        //            timeleft -= 1
        //            if(timeleft <= 0)
        //                clearInterval(downloadTimer)
        //                console.log('hide timer and show ad')
        //                showAfterTimer()
        //        }, 1000)
        //
        var timeleft = 2;
        var showAdTimer = setInterval(() => {
            timeleft -= 1;
            document.getElementById('secondsCounter').innerHTML = timeleft;
            //console.log('seconds left ' + timeleft)

            if (timeleft <= 0) {
                clearInterval(showAdTimer);
                // console.log('hide timer and show ad')
                // $("#adCountDown").hide()
                //document.getElementById("secondsCounter").innerHTML = '3'
                document.querySelectorAll('#adCountDown h5')[0].style.display =
                    'none';
                document.getElementById('secondsCounter').style.display =
                    'none';

                showAfterTimer();
            }
        }, 1000);

        let showAfterTimer = () => {
            this.preloadedInterstitial
                .showAsync()
                .then(() => {
                    // User has watched the ad.
                    // Perform post-ad success operation

                    console.log('Interstitial watched!');
                    this.resetPreloaderAferAd();
                    this.resetTimer();
                })
                .catch(error => {
                    console.log(error.message);
                    this.resetPreloaderAferAd();
                    this.resetTimer();
                });
        };
    }

    resetTimer() {
        this.vars.canShow = false;

        //setTimeout(() => {
        this.preload();
        this.vars.timeout = setTimeout(() => {
            this.vars.canShow = true;
        }, 60000);
        // }, 100000);
    }

    resetPreloaderAferAd() {
        game.scene.getScene('MainScene').scene.resume();
        $('#adCountDown').hide();

        document.querySelectorAll('#adCountDown h5')[0].style.display = 'block';
        document.getElementById('secondsCounter').style.display = 'block';
        document.getElementById('secondsCounter').innerHTML = '2';
    }
}
