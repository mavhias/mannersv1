import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Calends } from '../../../api/calends.js';

const CalendSchema = new SimpleSchema({
    userId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        label: "ID de l'utilisateur"
    },
    title: {
        type: String,
        max: 200,
        label: "Titre"
    },
    start: {
        type: Date,
        label: "Date de début"
    },
    end: {
        type: Date,
        label: "Date de fin"
    },
    description: {
        type: String,
        optional: true,
        max: 1000,
        label: "Description"
    },
    type: {
        type: String,
        allowedValues: ['appointment', 'mission', 'event'],
        label: "Type d'événement"
    },
    status: {
        type: String,
        allowedValues: ['pending', 'confirmed', 'cancelled', 'completed'],
        label: "Statut"
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

Calends.allow({
    insert: function(userId, doc) {
        return userId && doc.userId === userId && CalendSchema.validate(doc);
    },
    update: function(userId, doc, fields, modifier) {
        return userId && doc.userId === userId && CalendSchema.validate(modifier, { modifier: true });
    },
    remove: function(userId, doc) {
        return userId && doc.userId === userId;
    }
});

Calends.attachSchema(CalendSchema); 