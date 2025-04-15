import { Reports } from '/imports/api/reports.js';

// Fonction de validation manuelle
const validateReport = (doc) => {
    if (!doc.user || !/^[a-zA-Z0-9]{17}$/.test(doc.user)) {
        return false;
    }
    if (doc.type && (doc.type < 1 || doc.type > 5)) {
        return false;
    }
    if (doc.from && doc.from.length > 100) {
        return false;
    }
    return true;
};

if (Meteor.isServer) {
    Reports.allow({
        'insert': function(userId, doc) {
            try {
                return validateReport(doc);
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

    Meteor.publish("reports", function() {
        return Reports.find();
    });
}
