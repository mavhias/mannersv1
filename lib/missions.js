import { Missions } from '../imports/api/missions.js';

// Fonction de validation manuelle
const validateMission = (doc) => {
    if (!doc.name || doc.name.length > 200) {
        return false;
    }
    if (!doc.overview || doc.overview.length > 1000) {
        return false;
    }
    if (!doc.hostesCol || doc.hostesCol < 1 || doc.hostesCol > 10) {
        return false;
    }
    if (doc.address && doc.address.length > 200) {
        return false;
    }
    if (doc.city && doc.city.length > 100) {
        return false;
    }
    if (!doc.rank || doc.rank < 0 || doc.rank > 5) {
        return false;
    }
    if (doc.hr && (doc.hr < 0 || doc.hr > 999999999)) {
        return false;
    }
    if (doc.price && (doc.price < 0 || doc.price > 999999999)) {
        return false;
    }
    if (doc.fee && (doc.fee < 0 || doc.fee > 999999999)) {
        return false;
    }
    if (doc.zip && (doc.zip < 0 || doc.zip > 100000000)) {
        return false;
    }
    if (!doc.moreInfo || doc.moreInfo.length > 1000) {
        return false;
    }
    if (!doc.duration || doc.duration.length > 50) {
        return false;
    }
    if (doc.startDate && !(doc.startDate instanceof Date)) {
        return false;
    }
    if (!doc.beginsTo || doc.beginsTo.length > 100) {
        return false;
    }
    if (!doc.company || !/^[a-zA-Z0-9]{17}$/.test(doc.company)) {
        return false;
    }
    if (!doc.creator || !/^[a-zA-Z0-9]{17}$/.test(doc.creator)) {
        return false;
    }
    if (!doc.status || doc.status < 1 || doc.status > 5) {
        return false;
    }
    return true;
};

if (Meteor.isServer) {
    Missions.allow({
        'insert': function(userId, doc) {
            try {
                return validateMission(doc);
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

    Meteor.publish("missions", function() {
        return Missions.find();
    });
}