Analytics = new Meteor.Collection('analytics');

if (Meteor.isServer) {
    Analytics.allow({
        'insert': function() {
            // add custom authentication code here
            return true;
        },
        'update': function() {
            // add custom authentication code here
            return true;
        }
    });


    Meteor.publish("analytics", function() {
        return Analytics.find({});
    });
}