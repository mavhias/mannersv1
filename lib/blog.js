import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { Posts } from '/imports/api/posts';

if (Meteor.isServer) {
    const PostSchema = new SimpleSchema({
        title: {
            type: String,
            label: 'Title',
            max: 200
        },
        image: {
            type: String,
            label: 'Image URL or path',
            optional: true,
            max: 500
        },
        body: {
            type: String,
            label: 'Body',
            max: 10000
        },
        userId: {
            type: String,
            optional: true,
            regEx: /^[a-zA-Z0-9]{17}$/ // Format d'ID Meteor standard
        },
        author: {
            type: String,
            optional: true,
            max: 100
        },
        createdAt: {
            type: Date,
            optional: true
        }
    });

    Posts.allow({
        'insert': function(doc) {
            try {
                PostSchema.validate(doc);
                return true;
            } catch (error) {
                console.error('Validation error on insert:', error);
                return false;
            }
        },
        'update': function(docId, doc) {
            try {
                PostSchema.validate(doc, { modifier: true });
                return true;
            } catch (error) {
                console.error('Validation error on update:', error);
                return false;
            }
        }
    });
}