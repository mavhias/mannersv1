import {
    Meteor
} from 'meteor/meteor';
import {
    fetch
} from 'meteor/fetch';


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

    },
    'mangopay.addUser': async function(userData) {
        try {
            const response = await fetch('https://api.sandbox.mangopay.com/v2.01/your-client-id/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + Buffer.from('your-client-id:your-api-key').toString('base64')
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error adding user to MangoPay:', error);
            throw new Meteor.Error('mangopay-error', error.message);
        }
    }
});
