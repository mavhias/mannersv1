import request from "request";

Meteor.methods({
  calendHack: function (data) {
    console.log('---calend--');
    this.unblock();
    if (!process.env.NODE_ENV === 'development') {
      var options = {
        uri: 'http://46.101.103.162:3000/calend',
        method: 'POST',
        json: JSON.stringify(data)
      };
      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body) // Print the shortened url.
        }
      });
    }
  },
  makeAdmin: function () {
    this.unblock();
    Meteor.users.update(this.userId, {
      $set: {
        'profile.type': 'admin'
      }
    });
  },
  getCl: function (id) {
    return Meteor.users.findOne(id).profile.nameManager;
  },
  updateUserProfile: function (val) {
    this.unblock();
    if (!!val.description) {
      Profiles.update({
        userId: this.userId
      }, {
        $set: val

      });
    } else {
      Profiles.update({
        userId: this.userId
      }, {
        $push: val
      });
    }

  },
  removeUserProfile: function (val) {
    Profiles.update({
      userId: this.userId
    }, {
      $pop: val
    });
  }
});
