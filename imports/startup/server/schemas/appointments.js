import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Appointments } from '../../../api/appointments.js';

const AppointmentSchema = new SimpleSchema({
    userId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        label: "ID de l'utilisateur"
    },
    companyId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        label: "ID de l'entreprise"
    },
    date: {
        type: Date,
        label: "Date du rendez-vous"
    },
    status: {
        type: String,
        allowedValues: ['pending', 'confirmed', 'cancelled', 'completed'],
        label: "Statut"
    },
    notes: {
        type: String,
        optional: true,
        max: 1000,
        label: "Notes"
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            }
        }
    }
});

Appointments.allow({
    insert: function(userId, doc) {
        return userId && doc.userId === userId && AppointmentSchema.validate(doc);
    },
    update: function(userId, doc, fields, modifier) {
        return userId && doc.userId === userId && AppointmentSchema.validate(modifier, { modifier: true });
    },
    remove: function(userId, doc) {
        return userId && doc.userId === userId;
    }
});

Appointments.attachSchema(AppointmentSchema); 