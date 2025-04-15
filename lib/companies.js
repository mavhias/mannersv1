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

    Companies.allow({
        'insert': function(doc) {
            // Validation avec SimpleSchema
            Schemas.Company.validate(doc);
            return true;
        },
        'update': function(docId, doc) {
            // Validation avec SimpleSchema
            Schemas.Company.validate(doc, { modifier: true });
            return true;
        }
    });
    Meteor.publish("companies", function () {
        return Companies.find();
    });
}