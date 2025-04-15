var subs = new SubsManager({
  // will be cached only 20 recently used subscriptions
  cacheLimit: 20,
  // any subscription will be expired after 5 minutes of inactivity
  expireIn: 5
});
var Users = {};



Template.ShowUsers.helpers({
  engLevel: (data) => {
    data = data.map((val, i) => {
      if (!!val && i == 0) {
        return 'Qcm scolaire';
      } else if (!!val && i == 1) {
        return 'Notions';
      } else if (!!val && i == 2) {
        return 'Moyen';
      } else if (!!val && i == 3) {
        return 'Courant';
      } else if (!!val && i == 4) {
        return 'Bilingue';
      }
    });
    return data.clean(undefined);
  },
  moment: date => {
    return translate(moment(date).locale('en').format("dddd Do MMM YY"));
  },
  langLevel: (data) => {
    if (!data.length > 0) return [];
    console.log(data);
    data = data.map((val, i) => {
      if (!!val && i == 0) {
        return 'Scolaire';
      } else if (!!val && i == 1) {
        return 'Notions';
      } else if (!!val && i == 2) {
        return 'Moyen';
      } else if (!!val && i == 3) {
        return 'Courant';
      } else if (!!val && i == 4) {
        return 'Bilingue';
      }
    });
    return data.clean(undefined);
  },
  permB: (data) => {
    data = data.map((val, i) => {
      if (!!val && i == 0) {
        return 'Bsr';
      } else if (!!val && i == 1) {
        return 'Permis 125';
      } else if (!!val && i == 2) {
        return 'Permis voiture';
      } else if (!!val && i == 3) {
        return 'Permis moto';
      } else if (!!val && i == 4) {
        return 'Aucun';
      }
    });
    return data.clean(undefined);
  },
  studdyLevel: (data) => {
    data = data.map((val, i) => {
      if (!!val && i == 5) {
        return 'Bac';
      } else if (!!val) {
        return 'Bac +' + (i + 1);
      }
    });
    return data.clean(undefined);
  },
  chooseOp: (id) => {
    let tempUsrData = Meteor.users.findOne({
      _id: id,
    });
    if (!!tempUsrData.profile.hasOwnProperty('preappoint')) {
      if (tempUsrData.profile.preappoint == true) {
        return '<span>Preselected</span><button type="button" id=' + id + ' class="btn mail-op-dec btn-large btn-block btn-primary">no</button>';
      } else {
        return '<span>Preselected</span><button type="button" id=' + id + ' class="btn mail-op-apr btn-large btn-block btn-primary">yes</button>';
      }
    } else {
      return '<span>Not selected</span><button type="button" id=' + id + ' class="btn btn-block btn-primary mail-op-apr">yes</button> <button type="button" id=' + id + ' class="btn btn-block btn-primary mail-op-dec">no</button>';
    }
  },
  users: () => {
    let sort = {};
    sort.profile = {};
    if (Session.get('shSort') === 'date') {
      sort.profile.createdAt = 1;
    } else if (Session.get('shSort') === 'city') {
      sort.profile.city = 1;
    } else if (Session.get('shSort') === 'year') {
      sort.profile.age = 1;
    } else {
      sort = {};
    }
    return Meteor.users.find({
      'profile.type': 'host'
      // 'profile.preappoint': true
    }, {
      sort: sort
    });
  }

});

Template.ShowUsers.events({
  "change #sort": e => {
    Session.set('shSort', e.target.value);
  },
  "click #make-adm": e => {
    Meteor.call('makeAdmin');
  },
  "click .mail-op-apr": (e) => {
    let user = Meteor.users.findOne(e.target.id);
    swal('Confirmé');
    Analytics.insert({
      date: new Date(),
      type: 'preappoint',
      id: e.target.id,
      name: user.profile.firstname + ' ' + user.profile.name,
      op: 'toapp1'
    });
    let mText = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Manners | Bravo tu as été sélectionné</title>
    <link href="mail.css" type="text/css" rel="stylesheet">
</head>

<body style=" background-color:#FAFAFA; font-family:'Trebuchet MS',Arial,sans-serif;color:#FFF;text-align: center;">
    <header>
        <a href="http://bemanners.com/accueil"><img class="logo" src="http://bemanners.com:8888/img/logo.png" alt="Manners" height="42" width="120" style="margin-top: 20px">
        </a>
    </header>
    <section style="background-color:#FFF; margin:1% 25% 3% 25%; padding:2% 2% 2% 2%; box-shadow: 0px 2px #EEE">
        <div style="line-height: 150%; color:#000;">
            <p>
                <p style="text-align: center;"><span style="font-size:13px"><span style="font-family:roboto,helvetica neue,helvetica,arial,sans-serif">
                    Hello ` + user.profile.firstname + `😊 <br>
<br>On aimerait te rencontrer avant de travailler avec toi.
<br>
Tu peux t’inscrire à l’un des créneaux sur le lien suivant :<br><br>
<a href="https://calendly.com/manners/entretien-manners/">Manners RDV</a><br><br>
Si ces créneaux ne te conviennent pas, tu peux nous envoyer un mail nous te proposerons un nouveau créneau.<br>
<br>
Nous t'invitons à lire <a href="https://gallery.mailchimp.com/ffe4087083941ceffa0fc01f7/files/efdd48e2-ba39-4871-9aae-4b4ef2fc3c2a/Guide_du_Manners_V4.pdf">le guide</a> que nous avons élaboré avant notre rencontre.<br>
Une tenue professionnelle est conseillée lors de ta venue.<br>
<br>
Nous avons hâte de te rencontrer!<br><br>
L'équipe Manners ☀</span></span>
                </p>
        </div>

        </p>
        </div>
    </section>
    <div style="margin-bottom: 45px">
        <img src="http://bemanners.com:8888/img/icon-facebook.png" alt="" width="24" height="24" style="margin: 0 15px;">
        <img src="http://bemanners.com:8888/img/icon-twitter.png" alt="" width="24" height="24" style="margin: 0 15px;">
        <img src="http://bemanners.com:8888/img/icon-linkedin.png" alt="" width="24" height="24" style="margin: 0 15px;">
        <img src="http://bemanners.com:8888/img/icon-instagram.png" alt="" width="24" height="24" style="margin: 0 15px;">
            
                
                </div>
    <div style="display:block; border-top:2px solid #EEE; padding-top:10px; padding-bottom:25px; margin:0 25% 0 25%;"></div>

    </div>
    <footer>
        <div style="color: #656565; font-family: Helvetica; font-size: 12px; line-height:70%; text-align: center;">


            <p><em>Sent with ❤️ by Manners</em>
            </p>
            <p>2016-2017 © </p>
            <br>
            <p>Rencontrez-nous : 24 avenue Marceau, 75008, Paris</p>
            <p>Contactez-nous : contact@bemanners.com | 01 76 39 00 01</p>
            <br><br>
            <a class="text-center" href="">Se désinscrire</a>
        </div>
    </footer>
</body>
</html>`;

    Meteor.call('sendEmailCli',
      e.target.id,
      'julie@bemanners.com',
      "Manners | Bravo, tu as été pré-selectionné !",
      mText
    );
    Meteor.users.update({
      _id: e.target.id
    }, {
      $set: {
        'profile.preappoint': true
      }
    });

  },
  "click #discReport": (e) => {
    let user = Meteor.users.findOne(Session.get('discardId'));
    Analytics.insert({
      date: new Date(),
      type: 'ShowUsers',
      name: user.profile.name,
      op: 'declineHost',
      reason: $("#reasonSelect").val(),
      path: Iron.Location.get().path
    });
    $('#modal-64').modal('hide');
  },
  "click .mail-op-dec": (e) => {

    var answ = false;
    $('#modal-64').modal({
      keyboard: true,
      backdrop: true
    });

    Session.set('discardId', e.target.id);
    let user = Meteor.users.findOne(Session.get('discardId'));
    Analytics.insert({
      date: new Date(),
      type: 'ShowUsers',
      name: user.profile.name,
      op: 'declineHost',
      reason: $("#reasonSelect").val(),
      path: Iron.Location.get().path
    });
    Meteor.users.update({
      _id: e.target.id
    }, {
      $set: {
        'profile.preappoint': false
      }
    });
    Meteor.call('sendEmailCli',
      e.target.id,
      'julie@bemanners.com',
      'Manners | Inscription', `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Manners | Inscription</title>
    <link href="mail.css" type="text/css" rel="stylesheet">
</head>

<body style=" background-color:#FAFAFA; font-family:'Trebuchet MS',Arial,sans-serif;color:#FFF;text-align: center;">
    <header>
        <a href="http://bemanners.com/accueil"><img class="logo" src="http://bemanners.com:8888/img/logo.png" alt="Manners" height="42" width="120" style="margin-top: 20px">
        </a>
    </header>
    <section style="background-color:#FFF; margin:1% 25% 3% 25%; padding:2% 2% 2% 2%; box-shadow: 0px 2px #EEE">
        <div style="line-height: 150%; color:#000;">
            <p>
                <p style="text-align: center;"><span style="font-size:13px"><span style="font-family:roboto,helvetica neue,helvetica,arial,sans-serif">
                    Bonjour ` + user.profile.name + ` <br><br>
Nous vous remercions de l’intérêt que vous avez bien voulu porter à Manners.<br><br>
Toutefois, nous sommes au regret de vous informer que nous ne souhaitons pas donner suite à votre demande de partenariat. <br>
<br>
Nous vous souhaitons les meilleures chances possibles dans vos futures recherches.<br><br>
L'équipe Manners ☀️</span></span>
                </p>
        </div>

        </p>
        </div>
    </section>
    <div style="margin-bottom: 45px">
    <img src="http://bemanners.com:8888/img/icon-facebook.png" alt="" width="24" height="24" style="margin: 0 15px;">
        <img src="http://bemanners.com:8888/img/icon-twitter.png" alt="" width="24" height="24" style="margin: 0 15px;">
        <img src="http://bemanners.com:8888/img/icon-linkedin.png" alt="" width="24" height="24" style="margin: 0 15px;">
        <img src="http://bemanners.com:8888/img/icon-instagram.png" alt="" width="24" height="24" style="margin: 0 15px;">
            
                
                </div>
    <div style="display:block; border-top:2px solid #EEE; padding-top:10px; padding-bottom:25px; margin:0 25% 0 25%;"></div>

    </div>
    <footer>
        <div style="color: #656565; font-family: Helvetica; font-size: 12px; line-height:70%; text-align: center;">

            <p><em>Sent with ❤️ by Manners</em>
            </p>
            <p>2016 © </p>
            <br>
            <p>Rencontrez-nous : 24 avenue Marceau, 75008, Paris</p>
            <p>Contactez-nous : contact@bemanners.com | 01 76 39 00 01</p>
            <br><br>
            <a class="text-center" href="">Se désinscrire</a>
        </div>
    </footer>

</body>

</html>`);
  },
  'click #auth': function (e) {
    if ($('#password').val().length > 40) return false;
    Meteor.call('authShowUsers', $('#password').val(), function (error, success) {
      if (error) {
        console.log('error', error);
      }
      if (success) {
        $('#view').removeClass('hidden');
        $('#authform').addClass('hidden');
        Meteor.call('countUsers', function (error, success) {
          if (error) {
            console.log('error', error);
          }
          if (success) {
            let count = success;
            if (count < 10) {
              Meteor.subscribe("userList", "all");
            } else {
              console.log(count);
              count = _.range(count / 10);
              console.log(count.length);
              async.eachSeries(count, function (i, callback) {
                async.setImmediate(function () {
                  setTimeout(() => {
                    console.log(i * 10);
                    Meteor.subscribe("userList.part", i * 10);
                    callback(null, i * 10);
                  }, 1300);
                });
              });
            }
          }
        });
      }
    });
  },
});
