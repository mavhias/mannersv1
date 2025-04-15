Meteor.methods({ 
    searchMissionByUser: function(ids) { 
         let mis = Missions.find({
            
                $text: {
                    $search: ids,
                    $diacriticSensitive: true
                }
            
        }).fetch();
        return mis;
    }
});