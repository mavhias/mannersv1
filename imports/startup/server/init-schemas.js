import { Meteor } from 'meteor/meteor';
import { Analytics } from '../../../api/analytics.js';
import { Calends } from '../../../api/calends.js';
import { Appointments } from '../../../api/appointments.js';
import { Profiles } from '../../../api/profiles.js';
import { Messages } from '../../../api/messages.js';
import { Missions } from '../../../api/missions.js';
import { Comments } from '../../../api/comments.js';
import { Companies } from '../../../api/companies.js';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Schéma Analytics
const AnalyticsSchema = new SimpleSchema({
    userId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        label: "ID de l'utilisateur"
    },
    eventType: {
        type: String,
        allowedValues: ['page_view', 'click', 'form_submit', 'login', 'logout'],
        label: "Type d'événement"
    },
    page: {
        type: String,
        max: 200,
        label: "Page"
    },
    data: {
        type: Object,
        blackbox: true,
        optional: true,
        label: "Données supplémentaires"
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

// Schéma Calends
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

// Schéma Appointments
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

// Schéma Profiles
const ProfileSchema = new SimpleSchema({
    userId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        label: "ID de l'utilisateur"
    },
    firstName: {
        type: String,
        max: 100,
        label: "Prénom"
    },
    lastName: {
        type: String,
        max: 100,
        label: "Nom"
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        label: "Email"
    },
    phone: {
        type: String,
        optional: true,
        max: 20,
        label: "Téléphone"
    },
    address: {
        type: String,
        optional: true,
        max: 200,
        label: "Adresse"
    },
    city: {
        type: String,
        optional: true,
        max: 100,
        label: "Ville"
    },
    zipCode: {
        type: String,
        optional: true,
        max: 10,
        label: "Code postal"
    },
    country: {
        type: String,
        optional: true,
        max: 100,
        label: "Pays"
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

// Schéma Messages
const MessageSchema = new SimpleSchema({
    content: {
        type: String,
        max: 1000,
        label: "Contenu"
    },
    sender: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        label: "ID de l'expéditeur"
    },
    receiver: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        label: "ID du destinataire"
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

// Schéma Missions
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
        regEx: SimpleSchema.RegEx.Id,
        label: "ID de l'entreprise"
    },
    creator: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
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

// Schéma Comments
const CommentSchema = new SimpleSchema({
    comment: {
        type: String,
        max: 200,
        label: "Commentaire"
    },
    user: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        label: "ID de l'utilisateur"
    },
    company: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        label: "ID de l'entreprise"
    },
    from: {
        type: String,
        max: 100,
        label: "De"
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

// Schéma Companies
const CompanySchema = new SimpleSchema({
    name: {
        type: String,
        max: 200,
        label: "Nom de l'entreprise"
    },
    users: {
        type: Array,
        label: "Utilisateurs"
    },
    "users.$": {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        label: "ID de l'utilisateur"
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

// Attacher les schémas aux collections
Meteor.startup(() => {
    Analytics.attachSchema(AnalyticsSchema);
    Calends.attachSchema(CalendSchema);
    Appointments.attachSchema(AppointmentSchema);
    Profiles.attachSchema(ProfileSchema);
    Messages.attachSchema(MessageSchema);
    Missions.attachSchema(MissionSchema);
    Comments.attachSchema(CommentSchema);
    Companies.attachSchema(CompanySchema);
}); 