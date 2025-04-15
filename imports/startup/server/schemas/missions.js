import SimpleSchema from 'simpl-schema';
import { Missions } from '../../../api/missions.js';

const MissionSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Nom de la mission",
        max: 200
    },
    overview: {
        type: String,
        label: "Description",
        max: 1000
    },
    hostesCol: {
        type: Number,
        label: "Nombre d'hôtes(ses)",
        min: 1,
        max: 10
    },
    address: {
        type: String,
        label: "Adresse",
        optional: true
    },
    city: {
        type: String,
        label: "Ville",
        optional: true,
        max: 100
    },
    rank: {
        type: Number,
        min: 0,
        max: 5,
        label: "Rang"
    },
    hr: {
        type: Number,
        optional: true,
        min: 0,
        max: 999999999,
        label: "Heures"
    },
    price: {
        type: Number,
        optional: true,
        min: 0,
        max: 999999999,
        label: "Prix"
    },
    fee: {
        type: Number,
        optional: true,
        min: 0,
        max: 999999999,
        label: "Frais"
    },
    zip: {
        type: Number,
        label: "Code postal",
        optional: true,
        min: 0,
        max: 100000000
    },
    moreInfo: {
        type: String,
        label: "Informations supplémentaires",
        max: 1000
    },
    duration: {
        type: String,
        label: "Durée",
        max: 50
    },
    startDate: {
        type: Date,
        label: "Date de début",
        optional: true
    },
    beginsTo: {
        type: String,
        label: "Commence à",
        max: 100
    },
    company: {
        type: String,
        regEx: /^[a-zA-Z0-9]{17}$/, // Format d'ID Meteor standard
        label: "ID de l'entreprise"
    },
    creator: {
        type: String,
        regEx: /^[a-zA-Z0-9]{17}$/, // Format d'ID Meteor standard
        label: "ID du créateur"
    },
    status: {
        type: Number,
        min: 1,
        max: 5,
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

Missions.allow({
    insert: function(userId, doc) {
        return userId && doc.creator === userId && MissionSchema.validate(doc);
    },
    update: function(userId, doc, fields, modifier) {
        return userId && doc.creator === userId && MissionSchema.validate(modifier, { modifier: true });
    },
    remove: function(userId, doc) {
        return userId && doc.creator === userId;
    }
});

Missions.attachSchema(MissionSchema); 