import SimpleSchema from 'simpl-schema';
import { Reports } from '/imports/api/reports.js';

if (Meteor.isServer) {
    var Schemas = {};

    Schemas.Report = new SimpleSchema({
        user: {
            type: String,
            optional: true,
            max: 20
        },
        type: {
            type: Number,
            optional: true,
            min: 1,
            max: 5
        },
        from: {
            type: String,
            optional: true
        }

    });

    Reports.attachSchema(Schemas.Report);


    Reports.allow({
        'insert': function() {
            // add custom authentication code here
            return true;
        },
        'update': function() {
            // add custom authentication code here
            return true;
        }
    });
    Meteor.publish("reports", function() {
        return Reports.find();
    });
}
