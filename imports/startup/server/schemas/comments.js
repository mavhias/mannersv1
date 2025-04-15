import SimpleSchema from 'simpl-schema';
import { Comments } from '../../../api/comments.js';

const CommentSchema = new SimpleSchema({
    comment: {
        type: String,
        max: 200,
        label: "Commentaire"
    },
    user: {
        type: String,
        regEx: /^[a-zA-Z0-9]{17}$/, // Format d'ID Meteor standard
        label: "ID de l'utilisateur"
    },
    company: {
        type: String,
        regEx: /^[a-zA-Z0-9]{17}$/, // Format d'ID Meteor standard
        label: "ID de l'entreprise"
    },
    from: {
        type: String,
        max: 100,
        label: "De"
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            }
        }
    }
});

Comments.allow({
    insert: function(userId, doc) {
        return userId && doc.user === userId && CommentSchema.validate(doc);
    },
    update: function(userId, doc, fields, modifier) {
        return userId && doc.user === userId && CommentSchema.validate(modifier, { modifier: true });
    },
    remove: function(userId, doc) {
        return userId && doc.user === userId;
    }
});

Comments.attachSchema(CommentSchema); 