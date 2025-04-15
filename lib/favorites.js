Favorites = new Mongo.Collection("favorites");

if (Meteor.isServer) {
   
    Favorites.allow({
        'insert': function() {
            // add custom authentication code here
            return true;
        },
        'update': function() {
            // add custom authentication code here
            return true;
        }
    });
    Meteor.publish("favorites", function() {
        return Favorites.find();
    });
}
