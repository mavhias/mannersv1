import SimpleSchema from 'simpl-schema';
import { Posts } from '/imports/api/posts.js';

if (Meteor.isServer) {
    var Schemas = {};

    Schemas.PostSchema = new SimpleSchema({
        title: {
            type: String,
            label: 'Title'
        },
        image: {
            type: FS.File
        },
        body: {
            type: String,
            label: 'Body'
        },
        // _id: {
        //   type: String,
        //   optional: true
        // },
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

    Posts.attachSchema(Schemas.PostSchema);


    Posts.allow({
        'insert': function() {
            // add custom authentication code here
            return true;
        },
        'update': function() {
            // add custom authentication code here
            return true;
        }
    });
    Meteor.publish("posts", function() {
        return Posts.find();
    });
}