/**
* Models
*/
Messages = new Meteor.Collection('messages');
 


    if (Meteor.isServer) {
    
        Messages.allow({
        insert: function() {
            return true;
        },
        update: function() {
            return true;
        },
    });


    Meteor.publish("messages", function () {
       return Messages.find({});
     });

} else {
    Meteor.startup(function() {
        // Accounts.ui.config({
        //   passwordSignupFields: 'USERNAME_ONLY',
        // });
    });
}
