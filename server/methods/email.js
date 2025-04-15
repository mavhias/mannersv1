import {
  Email
} from 'meteor/email'
Meteor.methods({
  sendEmail: function (to, from, subject, text) {
    check([to, from, subject, text], [String]);
    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();
    Email.send({
      to: to,
      from: from,
      subject: subject,
      html: text
    });
    console.log('email', to);
  },
  sendEmailAdm: function (text) {
    console.log(text);
    this.unblock();
    Email.send({
      to: ['mathias@bemanners.com',
        'benjamin@bemanners.com',
        'nicholas@bemanners.com'
      ],
      from: 'bemanners',
      subject: 'mission created',
      text: text
    });
  },
  sendEmailCli: function (to, from, subject, text) {
    this.unblock();
    check([to, from, subject, text], [String]);
    var user = Meteor.users.findOne({
      _id: to
    });
    if (!!user) {
      to = user.emails[0].address;
      Email.send({
        to: to,
        from: from,
        subject: subject,
        html: text
      });
    }
    console.log('email', to);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.

  },
  sendVerifyPassEmail: (email) => {
    var usr = Meteor.users.findOne({
      'emails': {
        $elemMatch: {
          address: email
        }
      }
    });
    if (!!usr) {
      Accounts.sendResetPasswordEmail(usr._id, email);
    }
  }
});