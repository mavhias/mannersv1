import request from "sync-request";

Meteor.methods({
    geoAutocompl: function (text, callback) {
        var option = {
            qs: {
                input: text,
                types: 'address',
                key: 'AIzaSyDUOjoD-2OogqSYswX85mIkowupAoNcASo',
                language: 'fr',
                components:{country:'fr'}
            }
        };
        console.log(JSON.parse(request('GET', 'https://maps.googleapis.com/maps/api/place/autocomplete/json', option).getBody('utf8')));
        return JSON.parse(request('GET', 'https://maps.googleapis.com/maps/api/place/autocomplete/json', option).getBody('utf8'));
    },
    setMissPayed: function (id) {
        this.unblock();
        Missions.update({
            creator: id
        }, {
            $set: {
                status: 3
            }
        });
    }
});