import SimpleSchema from 'simpl-schema';
import { Recomendations } from '/imports/api/recomendations.js';

if (Meteor.isServer) {
    var Schemas = {};

    Schemas.Recomendation = new SimpleSchema({
        user: {
            type: String,
            optional: true,
            max: 20
        },
        rating: {
            type: Number,
            optional: true,
            min: 1.0,
            max: 5.0
        },
        from: {
            type: String,
            optional: true
        },
        createdAt:{type:Date}

    });

//Recomendations.attachSchema(Schemas.Recomendation);


    Recomendations.allow({
        'insert': function() {
            // add custom authentication code here
            return true;
        },
        'update': function() {
            // add custom authentication code here
            return true;
        }
    });
    Meteor.publish("recomendations", function() {
        return Recomendations.find();
    });
}
