Appointment  = new Meteor.Collection('appointment');

if (Meteor.isServer) {
    Appointment.allow({
        'insert': function () {
            // add custom authentication code here
            return true;
        },
        'update': function () {
            // add custom authentication code here
            return true;
        }
    });


    Meteor.publish("appointment", function () {
        return Appointment.find({});
    });
}