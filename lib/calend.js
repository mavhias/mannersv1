Calends = new Mongo.Collection("calends");

if (Meteor.isServer) {
   
    Calends.allow({
        'insert': function() {
            // add custom authentication code here
            return true;
        },
        'update': function() {
            // add custom authentication code here
            return true;
        }
    });
    Meteor.publish("calends", function() {
        return Calends.find();
    });
}
