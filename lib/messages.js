/**
* Models
*/
import { Messages } from '../imports/api/messages.js';

// Fonction de validation manuelle
const validateMessage = (doc) => {
    if (!doc.content || doc.content.length > 1000) {
        return false;
    }
    if (!doc.sender || !/^[a-zA-Z0-9]{17}$/.test(doc.sender)) {
        return false;
    }
    if (!doc.receiver || !/^[a-zA-Z0-9]{17}$/.test(doc.receiver)) {
        return false;
    }
    return true;
};

if (Meteor.isServer) {
    Messages.allow({
        'insert': function(userId, doc) {
            try {
                return validateMessage(doc);
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

    Meteor.publish("messages", function() {
        return Messages.find();
    });
} else {
    Meteor.startup(function() {
        // Accounts.ui.config({
        //   passwordSignupFields: 'USERNAME_ONLY',
        // });
    });
}
