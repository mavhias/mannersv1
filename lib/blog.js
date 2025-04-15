import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { Posts } from '/imports/api/posts';

if (Meteor.isServer) {
    var Schemas = {};

    Schemas.PostSchema = new SimpleSchema({
        title: {
            type: String,
            label: 'Title'
        },
        image: {
            type: String,
            label: 'Image URL or path',
            optional: true
        },
        body: {
            type: String,
            label: 'Body'
        },
        userId: {
            type: String,
            optional: true
        },
        author: {
            type: String,
            optional: true
        },
        createdAt: {
            type: Date,
            optional: true
        }
    });

    Posts.allow({
        'insert': function(doc) {
            // Validation avec SimpleSchema
            Schemas.PostSchema.validate(doc);
            return true;
        },
        'update': function(docId, doc) {
            // Validation avec SimpleSchema
            Schemas.PostSchema.validate(doc, { modifier: true });
            return true;
        }
    });
}