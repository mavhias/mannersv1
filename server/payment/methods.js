/**
 * Created by maxencecornet on 03/09/2016.
 */

import request from "request"



Meteor.methods({
  'Payment.methods.createWallet': async function (uid) {
    let user = await Meteor.users.findOne(uid);
    if (!!user.profile.nameManager) {
      user.firstName = user.profile.nameManager;
      user.name = user.profile.lastNameManager;
    } else {
      user.firstName = user.profile.firstname;
      user.name = user.profile.name;
    }
    return new Promise((resolve, reject) => {
      Payment.createWallet(user.mangoUserId, user._id, user.firstName, user.name, function (error, result) {
        if (error) {
          console.log(error);
          reject(error);
        }
        console.log(result);
        resolve(result);
      });
    });
  },
  'Payment.methods.createMangoUser': async function (user, userId, type) {
    console.log('ddddd');
    if (type === 'natural') {
      return new Promise((resolve, reject) => {
        Payment.createNaturalMangoUser(user, userId, function (error, user) {
          if (error) reject(error);
          resolve(user);
        });
      });
    } else if (type === 'legal') {
      return new Promise((resolve, reject) => {
        Payment.createLegalMangoUser(user, userId, function (error, user) {
          if (error) reject(error);
          console.log(user.Id, user.userId);
          resolve(user);
        });
      });
    } else {
      throw new Meteor.Error('type is required');
    }
  },
  'Payment.methods.createBankAccount': async function (userId, IBAN, BIC, address) {
    try {
      return new Promise((resolve, reject) => {
        Payment.createBankAccount(userId, IBAN, BIC, address, function (error, bankAccount) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log(bankAccount);
            resolve(bankAccount);
          }
        });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  'Payment.methods.getAllUsers': async function () {
    try {
      return new Promise((resolve, reject) => {
        var params = {};
        MangoPaySDK.user.list(params, function (err, list) {
          if (err || !list) {
            console.error(err);
            reject(err);
          } else {
            resolve(list);
          }
        });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  'Payment.methods.doPayin': async function (userId, amount, mid) {
    try {
      return new Promise((resolve, reject) => {
        Payment.doPayin(userId, amount, mid, function (error, redirectURL) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log(redirectURL);
            resolve(redirectURL);
          }
        });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  'Payment.methods.createKYC': async function (userId, file) {
    userId = '184920807';
    let obj = {
      "Tag": "custom meta111",
      "Type": "IDENTITY_PROOF"
    };
    return new Promise((resolve, reject) => {
      MangoPayClient.post('/users/' + userId + '/KYC/documents/', obj, function (err, res) {
        if(err) {
          reject(err);
          return;
        }
        let obj = {
          File: file
        }
        MangoPayClient.post('/users/' + userId + '/kyc/documents/'+res.Id+'/pages/', obj, function (err, res) {
          if(err) {
            reject(err);
            return;
          }
          console.log(err, res);
          resolve(res);
        });
      });
    });
  },
  'Payment.methods.doPayOut': async function (userId, amount) {
    try {
      return new Promise((resolve, reject) => {
        Payment.doPayOut(userId, amount, function (error, result) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log(result);
            resolve(result);
          }
        });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  'Payment.methods.checkPayoutStatus': async function (payoutId) {
    try {
      return new Promise((resolve, reject) => {
        Payment.checkPayoutStatus(payoutId, function (error, result) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log('-----', result);
            resolve(result);
          }
        });
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  'Payment.methods.fetchWallet': async function (userId) {
    try {
      return new Promise((resolve, reject) => {
        Payment.fetchWallet(userId, function (error, wallet) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log(wallet);
            resolve(wallet);
          }
        });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  'Payment.methods.getTransactions': async function (userId) {
    try {
      return new Promise((resolve, reject) => {
        Payment.getTransactions(userId, function (error, list) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log(list);
            resolve(list);
          }
        });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  'Payment.methods.transfer': async function (userId, creditedUserId, debitedUserId, amount, tag) {
    try {
      return new Promise((resolve, reject) => {
        Payment.transfer(userId, creditedUserId, debitedUserId, amount, tag, function (error, transfer) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            resolve(transfer);
          }
        });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  'Payment.methods.updateUser': async function (data) {
    return Payment.updateUser(data);
  },
  'mango.addUserNatural': async function() {
    try {
      const result = await MangoPayClient.Users.create({
        // ... paramètres existants ...
      });
      return result;
    } catch (error) {
      throw new Meteor.Error('mango-error', error.message);
    }
  },
  'mango.addBankAccount': async function(userId, iban, bic) {
    try {
      const result = await MangoPayClient.Users.createBankAccount(userId, {
        // ... paramètres existants ...
      });
      return result;
    } catch (error) {
      throw new Meteor.Error('mango-error', error.message);
    }
  }
});
