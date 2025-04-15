import { Analytics } from '../imports/api/analytics.js';

// Fonction de validation manuelle
const validateAnalytics = (doc) => {
    if (!doc.userId || !/^[a-zA-Z0-9]{17}$/.test(doc.userId)) {
        return false;
    }
    if (!doc.eventType || !['page_view', 'click', 'form_submit', 'login', 'logout'].includes(doc.eventType)) {
        return false;
    }
    if (!doc.page || doc.page.length > 200) {
        return false;
    }
    return true;
};

Analytics.allow({
    insert: function(userId, doc) {
        return userId && doc.userId === userId && validateAnalytics(doc);
    },
    update: function(userId, doc, fields, modifier) {
        return userId && doc.userId === userId;
    },
    remove: function(userId, doc) {
        return userId && doc.userId === userId;
    }
});

if (Meteor.isServer) {
    Meteor.publish("analytics", function() {
        return Analytics.find({ userId: this.userId });
    });
}