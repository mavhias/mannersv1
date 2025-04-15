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

    Comments.allow({
        'insert': function(doc) {
            // Validation avec SimpleSchema
            Schemas.Comment.validate(doc);
            return true;
        },
        'update': function(docId, doc) {
            // Validation avec SimpleSchema
            Schemas.Comment.validate(doc, { modifier: true });
            return true;
        }
    });
    Meteor.publish("comments", function() {
        return Comments.find();
    });
}
