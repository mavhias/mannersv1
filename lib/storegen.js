Storegen = new Meteor.Collection('storegen');

if (Meteor.isServer ) {
    Storegen.allow({
        'insert': function() {
            // add custom authentication code here
            return true;
        },
        'update': function() {
            // add custom authentication code here
            return true;
        }
    });


    Meteor.publish("storegen", function () {
    return Storegen.find({});
});
}
