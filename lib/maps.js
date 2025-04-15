import { Test } from '../imports/api/test.js';

// Fonction de validation manuelle
const validateTest = (doc) => {
    if (!doc.name || doc.name.length > 200) {
        return false;
    }
    if (!doc.location || !Array.isArray(doc.location) || doc.location.length !== 2) {
        return false;
    }
    if (typeof doc.location[0] !== 'number' || typeof doc.location[1] !== 'number') {
        return false;
    }
    return true;
};

if (Meteor.isServer) {
    Test.allow({
        'insert': function(userId, doc) {
            try {
                return validateTest(doc);
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

    Meteor.publish("maps", function() {
        return Test.find();
    });
}