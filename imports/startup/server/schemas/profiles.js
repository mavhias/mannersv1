import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Profiles } from '../../../api/profiles.js';

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

Profiles.allow({
    insert: function(userId, doc) {
        return userId && doc.userId === userId && ProfileSchema.validate(doc);
    },
    update: function(userId, doc, fields, modifier) {
        return userId && doc.userId === userId && ProfileSchema.validate(modifier, { modifier: true });
    },
    remove: function(userId, doc) {
        return userId && doc.userId === userId;
    }
});

Profiles.attachSchema(ProfileSchema); 