import { Appointment } from '/imports/api/appointment.js';

// Fonction de validation manuelle
const validateAppointment = (doc) => {
    if (!doc.userId || !/^[a-zA-Z0-9]{17}$/.test(doc.userId)) {
        return false;
    }
    if (!doc.companyId || !/^[a-zA-Z0-9]{17}$/.test(doc.companyId)) {
        return false;
    }
    if (!doc.date || !(doc.date instanceof Date)) {
        return false;
    }
    if (!doc.status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(doc.status)) {
        return false;
    }
    if (doc.notes && doc.notes.length > 1000) {
        return false;
    }
    return true;
};

if (Meteor.isServer) {
    Appointment.allow({
        'insert': function(userId, doc) {
            try {
                return validateAppointment(doc);
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

    Meteor.publish("appointments", function() {
        return Appointment.find();
    });
}