import { Recomendations } from '../imports/api/recomendations.js';

// Fonction de validation manuelle
const validateRecomendation = (doc) => {
    if (!doc.user || !/^[a-zA-Z0-9]{17}$/.test(doc.user)) {
        return false;
    }
    if (!doc.rating || doc.rating < 1 || doc.rating > 5) {
        return false;
    }
    if (!doc.from || !/^[a-zA-Z0-9]{17}$/.test(doc.from)) {
        return false;
    }
    return true;
};

Recomendations.allow({
    insert: function(userId, doc) {
        return userId && doc.user === userId && validateRecomendation(doc);
    },
    update: function(userId, doc, fields, modifier) {
        return userId && doc.user === userId;
    },
    remove: function(userId, doc) {
        return userId && doc.user === userId;
    }
});

if (Meteor.isServer) {
    Meteor.publish("recomendations", function() {
        return Recomendations.find();
    });
}
