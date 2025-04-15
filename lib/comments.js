import { Comments } from '../imports/api/comments.js';

// Fonction de validation manuelle
const validateComment = (doc) => {
    if (!doc.comment || doc.comment.length > 200) {
        return false;
    }
    if (!doc.user || !/^[a-zA-Z0-9]{17}$/.test(doc.user)) {
        return false;
    }
    if (!doc.company || !/^[a-zA-Z0-9]{17}$/.test(doc.company)) {
        return false;
    }
    if (!doc.from || doc.from.length > 100) {
        return false;
    }
    return true;
};

if (Meteor.isServer) {
    Comments.allow({
        'insert': function(userId, doc) {
            try {
                return validateComment(doc);
            } catch (error) {
                console.error('Validation error on insert:', error);
                return false;
            }
        },
        'update': function(userId, doc, fieldNames, modifier) {
            try {
                return true;
            } catch (error) {
                console.error('Validation error on update:', error);
                return false;
            }
        }
    });

    Meteor.publish("comments", function() {
        return Comments.find();
    });
}
