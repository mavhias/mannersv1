import { Companies } from '../imports/api/companies.js';

// Fonction de validation manuelle
const validateCompany = (doc) => {
    if (!doc.name || doc.name.length > 200) {
        return false;
    }
    if (!doc.users || !Array.isArray(doc.users)) {
        return false;
    }
    for (const userId of doc.users) {
        if (!/^[a-zA-Z0-9]{17}$/.test(userId)) {
            return false;
        }
    }
    return true;
};

if (Meteor.isServer) {
    Companies.allow({
        'insert': function(userId, doc) {
            try {
                return validateCompany(doc);
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

    Meteor.publish("companies", function() {
        return Companies.find();
    });
}