Cloth = new Meteor.Collection('cloth');

if (Meteor.isServer ) {
    Cloth.allow({
        'insert': function() {
            // add custom authentication code here
            return true;
        },
        'update': function() {
            // add custom authentication code here
            return true;
        }
    });


    Meteor.publish("cloth", function () {
    return Cloth.find({});
});
}
