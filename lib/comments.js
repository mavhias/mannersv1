import SimpleSchema from 'simpl-schema';
import { Comments } from '/imports/api/comments.js';

if (Meteor.isServer) {
    var Schemas = {};

    Schemas.Comment = new SimpleSchema({
        comment: {
            type: String,
            optional: true,
            max: 200
        },
        user: {
            type: String
        },
        company: {
            type: String,
            optional: false
        },
        from: {
            type: String,
            optional: false
        }
    });

    Comments.attachSchema(Schemas.Comment);


    Comments.allow({
        'insert': function() {
            // add custom authentication code here
            return true;
        },
        'update': function() {
            // add custom authentication code here
            return true;
        }
    });
    Meteor.publish("comments", function() {
        return Comments.find();
    });
}
