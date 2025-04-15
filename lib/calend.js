import { Calends } from '../imports/api/calends.js';

// Fonction de validation manuelle
const validateCalend = (doc) => {
    if (!doc.userId || !/^[a-zA-Z0-9]{17}$/.test(doc.userId)) {
        return false;
    }
    if (!doc.title || doc.title.length > 200) {
        return false;
    }
    if (!doc.start || !(doc.start instanceof Date)) {
        return false;
    }
    if (!doc.end || !(doc.end instanceof Date)) {
        return false;
    }
    if (doc.description && doc.description.length > 1000) {
        return false;
    }
    if (!doc.type || !['appointment', 'mission', 'event'].includes(doc.type)) {
        return false;
    }
    if (!doc.status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(doc.status)) {
        return false;
    }
    return true;
};

if (Meteor.isServer) {
    Calends.allow({
        'insert': function(userId, doc) {
            try {
                return validateCalend(doc);
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

    Meteor.publish("calends", function() {
        return Calends.find();
    });
}
