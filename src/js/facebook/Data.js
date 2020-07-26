export default {
    saveCollected({diamonds, stars}) {
        
       // console.log('save diamonds', diamonds, ' and stars ', stars)
        
        
        FBInstant.player
          .getDataAsync(['diamonds', 'stars'])
          .then((data) => {
            //console.log(data)
             
//            console.log(parseInt(data['diamonds']), parseInt(data['stars']))
                FBInstant.player
                  .setDataAsync({
                    diamonds: typeof data['diamonds'] == 'undefined' ? 0 : parseInt(data['diamonds']) + diamonds,
                    stars: typeof data['stars'] == 'undefined' ? 0 : parseInt(data['stars']) + stars
                  })
                  .then(function() {
                    //console.log('data is set');
                  });

             
          });
        
    }
}