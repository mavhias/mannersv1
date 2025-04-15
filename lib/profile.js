Profiles = new Meteor.Collection('profiles');

if (Meteor.isServer ) {
    Profiles.allow({
        'insert': function() {
            // add custom authentication code here
            return true;
        },
        'update': function() {
            // add custom authentication code here
            return true;
        }
    });


    Meteor.publish("profiles", function () {
    return Profiles.find({});
});
    
}
