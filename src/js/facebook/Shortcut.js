export default {
    // playedTimes: 0,
    create(scene) {
        game.playedTimes++;

        if (game.playedTimes !== 2) {
            return;
        }

        console.log('ask for shortcut if supported');

        // let activeScenes = game.scene.getScenes(true);

        // let overScene = activeScenes[activeScenes.length - 1].scene;

        // console.log(overScene);

        // if (
        //     overScene.key !== 'GameOver' ||
        //     overScene.key !== 'GameOverOnline'
        // ) {
        //     return;
        // }
        let overScene = scene.scene;

        if (localStorage.getItem('shortcut') !== 'created') {
            FBInstant.canCreateShortcutAsync().then(canCreateShortcut => {
                console.log('can create: ', canCreateShortcut);
                if (canCreateShortcut) {
                    overScene.pause();
                    FBInstant.createShortcutAsync()
                        .then(() => {
                            localStorage.setItem('shortcut', 'created');
                            overScene.resume();

                            // Track the number of shortcuts in fb events
                            if (
                                isInstantGame &&
                                !window.location.href.includes('localhost')
                            ) {
                                FBInstant.logEvent('shortcut_created', 1);
                            }
                            console.log('shortcut created');
                        })
                        .catch(() => {
                            overScene.resume();
                            console.log('shortcut cancelled');
                        });
                }
            });
        }
    }
};
