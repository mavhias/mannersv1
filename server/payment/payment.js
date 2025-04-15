/**
 * Created by maxencecornet on 03/09/2016.
 * edited by mavhias on 15/04/2025
 */
import fs from 'fs'
import request from "request"
import MangoPaySDK from 'mangopay2-nodejs-sdk'

let Payment;

var paymentModule = function (commissionRate) {
  this.commissionRate = commissionRate;
};

paymentModule.prototype.authenticate = function () {
  try {
    MangoPaySDK.apiVersion = 'v2.01';
    MangoPaySDK.production = true;
    // MangoPaySDK.authenticate('mannersbe', 'yJgDiQXpLnv6wSx4iPA6SAwiwpONPo6jVpCzzQU0eecHeve7Bj');
    MangoPaySDK.authenticate('bemanners', '40oyHazKzeFwVvNaHaXeTEebeuxDRBk9G3kfKVQSAboKTnjnqD');
  } catch (error) {
    console.log(error);
  }
};

Meteor.startup(function () {
  try {
    Payment = new paymentModule(20);
    Payment.authenticate();

  } catch (error) {
    console.log(error);
  }
});

paymentModule.prototype.updateUser = function (data) {
    console.log(Meteor.userId());
    let id = Meteor.users.findOne(Meteor.userId()).mangoUserId;
    MangoPaySDK.user.updateLegal(id, data, function (err, user) {
      if (err || !user) {
        console.error(err);
      } else {
        console.log(user);
      }
    });
  },

  paymentModule.prototype.createWallet = async function (mangoUserId, userId, userFirstName, userLastName) {
    console.log('wallet is creating..');

    try {
      const wallet = await new Promise((resolve, reject) => {
        MangoPaySDK.wallet.create(new MangoPaySDK.wallet.Wallet({
          Owners: [mangoUserId],
          Currency: 'EUR',
          CreationDate: this._getTimestamp(),
          Description: userFirstName + ' ' + userLastName + ' wallet'
        }), (err, wallet) => {
          if (err || !wallet) {
            reject(err);
          } else {
            resolve(wallet);
          }
        });
      });

      await Meteor.users.updateAsync({
        _id: userId
      }, {
        $set: {
          mangoWalletId: wallet.Id
        }
      });

      console.log(">>>>> mango_wallet_created");
      return wallet;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

paymentModule.prototype.createLegalMangoUser = async function (user, userId) {
  console.log('creating legal...');
  if (user.profile.type !== 'host') {
    user.firstName = user.profile.nameManager;
    user.name = user.profile.lastNameManager;
  } else {
    user.firstName = user.profile.firstname;
    user.name = user.profile.name;
  }
  user.fullName = user.firstName + '' + user.name;

  try {
    const mangoUser = await new Promise((resolve, reject) => {
      MangoPaySDK.user.create(new MangoPaySDK.user.LegalUser({
        Email: user.emails[0].address,
        Name: user.fullName,
        LegalPersonType: MangoPaySDK.user.personTypes.BUSINESS,
        LegalRepresentativeFirstName: user.firstName,
        LegalRepresentativeLastName: user.name,
        LegalRepresentativeBirthday: 1300186358,
        LegalRepresentativeNationality: 'FR',
        LegalRepresentativeCountryOfResidence: 'FR'
      }), (err, mangoUser) => {
        if (err || !mangoUser) {
          reject(err);
        } else {
          resolve(mangoUser);
        }
      });
    });

    await Meteor.users.updateAsync({
      _id: userId
    }, {
      $set: {
        mangoUserId: mangoUser.Id
      }
    });

    console.log(">>>>> mango_user_created");
    mangoUser.userId = userId;
    return mangoUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

paymentModule.prototype.createNaturalMangoUser = async function (user, userId) {
  if (!!user.profile.nameManager) {
    user.firstName = user.profile.nameManager;
    user.name = user.profile.lastNameManager;
  } else {
    user.firstName = user.profile.firstname;
    user.name = user.profile.name;
  }

  try {
    const mangoUser = await new Promise((resolve, reject) => {
      MangoPaySDK.user.create(new MangoPaySDK.user.NaturalUser({
        "FirstName": user.firstName,
        "LastName": user.name,
        "Address": user.address,
        "Nationality": "FR",
        "Birthday": Math.floor(Date.now() / 1000),
        "CountryOfResidence": "FR",
        "Occupation": "Writer",
        "ProofOfIdentity": null,
        "ProofOfAddress": null,
        "PersonType": "NATURAL",
        "Email": user.emails[0].address,
        "Tag": userId
      }), (err, mangoUser) => {
        if (err || !mangoUser) {
          reject(err);
        } else {
          resolve(mangoUser);
        }
      });
    });

    await Meteor.users.updateAsync({
      _id: userId
    }, {
      $set: {
        mangoUserId: mangoUser.Id
      }
    });

    console.log(">>>>> mango_user_created");
    mangoUser.userId = userId;
    return mangoUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

paymentModule.prototype.createBankAccount = async function (userId, IBAN, BIC, address) {
  const user = Meteor.users.findOne({
    _id: userId
  });

  if (!!user.profile.nameManager) {
    user.firstName = user.profile.nameManager;
    user.name = user.profile.lastNameManager;
  } else {
    user.firstName = user.profile.firstname;
    user.name = user.profile.name;
  }

  try {
    const bankAccount = await new Promise((resolve, reject) => {
      MangoPaySDK.bank.create(user.mangoUserId, "IBAN", new MangoPaySDK.bank.BankAccount({
        "Active": true,
        "OwnerName": user.firstName + ' ' + user.name,
        "IBAN": IBAN,
        "BIC": BIC,
        "OwnerAddress": address
      }), (err, bankAccount) => {
        if (err || !bankAccount) {
          reject(err);
        } else {
          resolve(bankAccount);
        }
      });
    });

    await Meteor.users.updateAsync({
      _id: userId
    }, {
      $set: {
        mangoBankAccountID: bankAccount.Id
      }
    });

    console.log(">>>>> mango_bank_account_created");
    return bankAccount;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
paymentModule.prototype.createKYC = function (userId, file) {
    console.log('start kyc');
    var myFuture = new Future();
    request('https://scontent.fhen1-1.fna.fbcdn.net/v/t1.0-9/19875550_10155433267020883_786300361378971178_n.png?oh=ce241e7a78dfb11f82f52b5094bd92b5&oe=59FEC5DD', (err, res, body) => {
      let obj = {
        File: new Buffer(body).toString('base64')
      };
     // userId = Meteor.users.findOne(userId).mangoUserId;
  let userId = '184920807';
  let test = MangoPayClient.get('/users/' + userId + '/kyc/documents/');
  console.log(test);

      // MangoPayClient.post('/users/' + userId + '/KYC/documents/', obj);

      myFuture.return(MangoPayClient.post('/users/' + userId + '/KYC/documents', obj));

      /// callback(null,MangoPayClient.post('/users/' + userId + '/KYC/documents', obj))///MangoPaySDK.document.create(userId, obj));
    }); //fs.readFileSync(file);
    // console.log(bitmap);
    // let obj = {
    //   File: new Buffer(bitmap).toString('base64')
    // }
    // userId = Meteor.users.findOne(userId).mangoUserId;
    // callback(null,MangoPayClient.post('/users/' + userId + '/KYC/documents', obj))///MangoPaySDK.document.create(userId, obj));
    return myFuture.wait();
  },

  paymentModule.prototype.doPayin = function (userId, amount, mid, callback) {
    // const fee = Missions.findOne(mid).fee;
    let user;
    console.log(userId);
    if (userId.length < 17) {
      user = Meteor.users.findOne({
        mangoUserId: userId
      });
    } else {
      user = Meteor.users.findOne({
        _id: userId
      });
    }
    let url = '';
    if (!!mid) {
      url = 'https://bemanners.com/paiement-confirmed/' + mid + '/';
    } else {
      url = 'https://bemanners.com/';
    }
    MangoPaySDK.payin.create(new MangoPaySDK.payin.WebForm({
      AuthorId: user.mangoUserId,
      CreationDate: this._getTimestamp(),
      CreditedWalletId: user.mangoWalletId,
      ReturnUrl: url,
      Culture: 'FR',
      Tag: mid,
      CardType: MangoPaySDK.card.type.VISA_MASTERCARD,
      DebitedFunds: {
        Currency: 'EUR',
        Amount: amount
      },
      Fees: {
        Currency: 'EUR',
        Amount: 0
      }
      //       ,
      //       "TemplateURLOptions": {
      // "Payline": "https://bemanners.com/mpForm.html"
      // }
    }), function (err, payin) {
      if (err || !payin) {
        console.error(err);
        if (callback && typeof (callback) === "function") {
          callback(err, null);
        }
      } else {
        if (callback && typeof (callback) === "function") {
          callback(null, payin.RedirectURL);
        }
      }
    });
  };

paymentModule.prototype.doPayOut = function (userId, amount, callback) {

  const user = Meteor.users.findOne({
    _id: userId
  });

  MangoPaySDK.payout.create(new MangoPaySDK.payout.BankWire({
    AuthorId: user.mangoUserId,
    BankWireRef: 'BeManners',
    BankAccountId: user.mangoBankAccountID,
    DebitedWalletId: user.mangoWalletId,
    DebitedFunds: {
      Currency: 'EUR',
      Amount: amount
    },
    Fees: {
      Currency: 'EUR',
      Amount: 0
    }
  }), function (err, payout) {
    if (err || !payout) {
      console.error(err);
      if (callback && typeof (callback) === "function") {
        callback(err, null);
      }
    } else {
      if (callback && typeof (callback) === "function") {
        callback(null, payout);
      }
    }
  });
};

paymentModule.prototype.checkPayoutStatus = function (payoutId, callback) {
  MangoPaySDK.payout.fetch(payoutId, function (err, payout) {
    if (err || !payout) {
      if (callback && typeof (callback) === "function") {
        callback(err, null);
      }
    } else {
      if (callback && typeof (callback) === "function") {
        callback(null, payout);
      }
    }
  });
};

paymentModule.prototype.fetchWallet = function (userId, callback) {

  const user = Meteor.users.findOne({
    _id: userId
  });

  MangoPaySDK.wallet.fetch(user.mangoWalletId, function (err, wallet) {
    if (err || !wallet) {
      console.error(err);
      if (callback && typeof (callback) === "function") {
        callback(error, null);
      }
    } else {
      if (callback && typeof (callback) === "function") {
        callback(null, wallet);
      }
    }
  });
};

paymentModule.prototype.getTransactions = function (userId, callback) {

  const user = Meteor.users.findOne({
    _id: userId
  });

  const params = {};

  MangoPaySDK.wallet.transactions(user.mangoWalletId, params, function (err, list) {
    if (err || !list) {
      console.error(err);
      if (callback && typeof (callback) === "function") {
        callback(err, null);
      }
    } else {
      if (callback && typeof (callback) === "function") {
        console.log(list);
        callback(null, list);
      }
    }
  });
};


paymentModule.prototype.transfer = function (userId, creditedUserId, debitedUserId, amount, fee, tag, callback) {

  const self = this;
  const admin = Meteor.users.findOne({
    _id: userId
  });
  const creditedUser = Meteor.users.findOne({
    _id: creditedUserId
  });
  const debitedUser = Meteor.users.findOne({
    _id: debitedUserId
  });

  MangoPaySDK.transfer.create(new MangoPaySDK.transfer.Transfer({
    AuthorId: admin.mangoUserId,
    DebitedWalletID: debitedUser.mangoWalletId,
    CreditedWalletID: creditedUser.mangoWalletId,
    Tag: tag,
    DebitedFunds: {
      Currency: "EUR",
      Amount: amount
    },
    Fees: {
      Currency: "EUR",
      Amount: 0//fee //self._getCommission(amount)
    }
  }), function (err, transfer) {
    if (err || !transfer) {
      console.error(err);
      if (callback && typeof (callback) === "function") {
        callback(err, null);
      }
    } else {
      console.log(transfer);
      if (callback && typeof (callback) === "function") {
        callback(null, transfer);
      }
    }
  });
};

/**
 *
 * @private methods
 */


paymentModule.prototype._getTimestamp = function () {
  return Math.round(new Date().getTime() / 1000)
};

paymentModule.prototype._getCommission = function (amount) {
  const self = this;
  return amount * self.commissionRate / 100
};
