import SimpleSchema from 'simpl-schema';
import { Companies } from '/imports/api/companies.js';

if (Meteor.isServer) {
    var Schemas = {};

    Schemas.Company = new SimpleSchema({
        name: {
            type: String,
            optional: true,
            max: 200
        },
        users: {
            type: Array,
            optional: false
        },
        "users.$": {
            type: String
        }

    });

    Companies.attachSchema(Schemas.Company);


    Companies.allow({
        'insert': function () {
            // add custom authentication code here
            return true;
        },
        'update': function () {
            // add custom authentication code here
            return true;
        }
    });
    Meteor.publish("companies", function () {
        return Companies.find();
    });
}