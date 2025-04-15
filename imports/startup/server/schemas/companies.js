import SimpleSchema from 'simpl-schema';
import { Companies } from '../../../api/companies.js';

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
        regEx: /^[a-zA-Z0-9]{17}$/, // Format d'ID Meteor standard
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

Companies.allow({
    insert: function(userId, doc) {
        return userId && doc.users.includes(userId) && CompanySchema.validate(doc);
    },
    update: function(userId, doc, fields, modifier) {
        return userId && doc.users.includes(userId) && CompanySchema.validate(modifier, { modifier: true });
    },
    remove: function(userId, doc) {
        return userId && doc.users.includes(userId);
    }
});

Companies.attachSchema(CompanySchema); 