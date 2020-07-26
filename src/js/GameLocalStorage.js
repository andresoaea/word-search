class GameLocalStorage {
    
    constructor(playerId) {
        
        this.playerId = playerId
        
       // console.log(this.playerId)
        
    }
    
    
    set(key, value) {
        localStorage.setItem(btoa(this.playerId + '_' + key), btoa(value))   
    }
    
    
    get(key) {
        let encoded = localStorage.getItem(btoa(this.playerId + '_' + key))
        if(!encoded) {
           return null
        }
        
        //console.log(encoded)
        return atob(encoded)
    }
    
}


export default GameLocalStorage