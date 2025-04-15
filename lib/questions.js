import { Mongo } from 'meteor/mongo';

export const Questions = new Mongo.Collection('questions');

if (Meteor.isServer) {
    Questions.allow({
        'insert': function() {
            // add custom authentication code here
            return true;
        },
        'update': function() {
            // add custom authentication code here
            return true;
        }
    });

    Meteor.publish("questions", function () {
        return Questions.find({});
    });

    Meteor.startup(async function() {
        if (await Questions.find().countAsync() === 0) {
            await Questions.insertAsync({
                question: 1,
                data: [{
                    title: "Quelle est la différence entre une agence d'hôtes/hôtesses et Manners ?",
                    data: 'sss',
                    id: 1
                }]
            });
        }
    });
}
