import FBAds from './../facebook/Ads'
import FBBot from './../facebook/Bot'
import FBShortcut from './../facebook/Shortcut'

export default {
    
    canExecute: false,
    canCreateShortcut: true,
    actions: [],
    init() {
        
//        FBBot.setSessionData()
//        
//        //Run this 1 time at game load
//        FBInstant.player.canSubscribeBotAsync().then((can_subscribe) => {
//            if(can_subscribe) {    
//               this.canSubscribeBot = true
//            }
//        })
        
        this.checkAvailableActions()
        
        FBAds.init()
        
        
        setTimeout(() => {
            this.canExecute = true
        }, 35000) // 40 sec
        
    },
    
    checkAvailableActions() {
        this.actions = []
        
        // Ckeck support for Shortcut
        if(FBInstant.getSupportedAPIs().includes('canCreateShortcutAsync')
           && localStorage.getItem('shortcut') !== 'created' && this.canCreateShortcut) {
            this.actions.push('shortcut')
        }
        
        
//        // Ckeck support for BOT
//        if(this.canSubscribeBot) {
//            this.actions.push('bot')
//        }
        
         this.actions.push('ads')
        
    },
    
    execute() {
        
        if(!this.canExecute) {
            //console.log('! can execute')
            return
        }
        
        this.checkAvailableActions()
        
        if(this.actions.length > 0) {
            let action = this.actions[0]
            
            //console.log(this.actions)
            
            switch(action) {
                case 'shortcut':
                    console.log('create shortcut')
                    FBShortcut.create()
                    this.canCreateShortcut = false
                    break
                    
//                case 'bot':
//                    console.log('subscribe to bot')
//                    FBBot.initSubscribe()
//                    this.canSubscribeBot = false
//                    break
                
                case 'ads':
                    //console.log('show an ad')
                    FBAds.show()
                    break
                    
                    
            }
            
        }
        
        
    }
}

















