import {
    Accounts
} from 'meteor/accounts-base';

if (Meteor.isServer) {

    Meteor.users.allow({
        insert: function () {
            return true;
        },
        update: function () {
            return true;
        },
    });

    Meteor.publish('userList.part', async function(count) {
        return Meteor.users.find({
            'profile.type': 'host',
            'profile.active': true
        }, {
            limit: count,
            fields: {
                'profile': 1,
                'status': 1,
                'mangoUserId': 1
            }
        });
    });

    Meteor.publish("userList", async function(op) {
        if (op === undefined) {
            return Meteor.users.find({}, {
                fields: {
                    'profile': 1,
                    'status': 1,
                    'mangoUserId': 1
                }
            });
        }
        return Meteor.users.find(op);
    });

} else {
    Meteor.startup(function () {
        // Accounts.ui.config({
        //   passwordSignupFields: 'USERNAME_ONLY',
        // });
    });
}