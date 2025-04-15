import {
    Meteor
} from 'meteor/meteor';
import {
    HTTP
} from 'meteor/http';


Meteor.methods({
    'mango.addUserNatural' (res) {
        //check(text, String);
        // Make sure the user is logged in before inserting a task
        // if (! Meteor.userId()) {
        //   throw new Meteor.Error('not-authorized');
        // }
        console.log('adding new user');
        MangoPayClient.debug = true;
        MangoPaySDK.apiVersion = 'v2.01';
        MangoPaySDK.production = true;
        MangoPaySDK.authenticate('bemanners', '40oyHazKzeFwVvNaHaXeTEebeuxDRBk9G3kfKVQSAboKTnjnqD');
        MangoPaySDK.user.create(new MangoPaySDK.user.NaturalUser(res), function(err, user) {
            if (err) {
                console.log(err);
                return false;
            }

            MangoPaySDK.wallet.create(new MangoPaySDK.wallet.Wallet({
                Owners: [user.Id],
                Currency: 'EUR',
                Description: 'Buyer\'s wallet'
            }), function(err, wallet) {
                if (err || !wallet) {
                    console.error(err);
                } else {
                    console.log(wallet);
                }
            });

        });

    },
    'mango.addUserLegal' (res) {
        //check(text, String);
        // Make sure the user is logged in before inserting a task
        // if (! Meteor.userId()) {
        //   throw new Meteor.Error('not-authorized');
        // }
        MangoPayClient.debug = true;
        MangoPaySDK.apiVersion = 'v2.01';
        MangoPaySDK.production = true;
        MangoPaySDK.authenticate('bemanners', '40oyHazKzeFwVvNaHaXeTEebeuxDRBk9G3kfKVQSAboKTnjnqD');
        MangoPaySDK.user.create(new MangoPaySDK.user.LegalUser(res), function(err, user) {
            MangoPaySDK.wallet.create(new MangoPaySDK.wallet.Wallet({
                Owners: [user.Id],
                Currency: 'EUR',
                Description: 'Buyer\'s wallet'
            }), function(err, wallet) {
                if (err || !wallet) {
                    console.error(err);
                } else {
                    console.log(wallet);
                }
            });
        });

    }
});
