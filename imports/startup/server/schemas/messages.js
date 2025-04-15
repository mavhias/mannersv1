import SimpleSchema from 'simpl-schema';
import { Messages } from '../../../api/messages.js';

const MessageSchema = new SimpleSchema({
    content: {
        type: String,
        max: 1000,
        label: "Contenu"
    },
    sender: {
        type: String,
        regEx: /^[a-zA-Z0-9]{17}$/, // Format d'ID Meteor standard
        label: "ID de l'expéditeur"
    },
    receiver: {
        type: String,
        regEx: /^[a-zA-Z0-9]{17}$/, // Format d'ID Meteor standard
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

Messages.allow({
    insert: function(userId, doc) {
        return userId && (doc.sender === userId || doc.receiver === userId) && MessageSchema.validate(doc);
    },
    update: function(userId, doc, fields, modifier) {
        return userId && (doc.sender === userId || doc.receiver === userId) && MessageSchema.validate(modifier, { modifier: true });
    },
    remove: function(userId, doc) {
        return userId && (doc.sender === userId || doc.receiver === userId);
    }
});

Messages.attachSchema(MessageSchema); 