import { Profiles } from '../imports/api/profiles.js';

// Fonction de validation manuelle
const validateProfile = (doc) => {
    if (!doc.userId || !/^[a-zA-Z0-9]{17}$/.test(doc.userId)) {
        return false;
    }
    if (!doc.firstName || doc.firstName.length > 100) {
        return false;
    }
    if (!doc.lastName || doc.lastName.length > 100) {
        return false;
    }
    if (!doc.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(doc.email)) {
        return false;
    }
    if (doc.phone && doc.phone.length > 20) {
        return false;
    }
    if (doc.address && doc.address.length > 200) {
        return false;
    }
    if (doc.city && doc.city.length > 100) {
        return false;
    }
    if (doc.zipCode && doc.zipCode.length > 10) {
        return false;
    }
    if (doc.country && doc.country.length > 100) {
        return false;
    }
    return true;
};

if (Meteor.isServer) {
    Profiles.allow({
        'insert': function(userId, doc) {
            try {
                return validateProfile(doc);
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

    Meteor.publish("profiles", function() {
        return Profiles.find();
    });
}
