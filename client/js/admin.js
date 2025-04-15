import {
  ReactiveDict
} from 'meteor/reactive-dict';
import lodash from 'lodash';
import {
  ReactiveVar
} from 'meteor/reactive-var'



function getInfo() {
  var an;
  var nav = Iron.Location.get().path.split('/')[2];
  var query = '';
  if (parseInt(nav) == 1) {
    $('.sidebar-menu li').removeClass('active');
    $('#blink-1').addClass('active');
    query = 'visit';
  } else if (parseInt(nav) == 2) {
    query = 'register';
    $('.sidebar-menu li').removeClass('active');
    $('#blink-2').addClass('active');

  } else if (parseInt(nav) == 3) {
    query = 'job';
    $('.sidebar-menu li').removeClass('active');
    $('#blink-3').addClass('active');
  } else if (parseInt(nav) == 4) {
    query = '';
    $('.sidebar-menu li').removeClass('active');
    $('#blink-4').addClass('active');

    var emailCount = Analytics.find({
      op: 'track',
      matter: 'email'
    }).count();
    var dconfCount = Meteor.users.find({
      'profile.verified': true
    }).count();
    var inscCount = Meteor.users.find({}).count();
    var clientCount = Meteor.users.find({
      'profile.type': 'client'
    }).count();
    var verified = Meteor.users.find({
      'emails[0].verified': true
    }).count();

    an = {
      inscCount: inscCount,
      clientCount: clientCount,
      verified: verified,
      emailCount: emailCount,
      dconfCount: dconfCount
    };
    Session.set('an', an);
  } else if (parseInt(nav) == 5) {
    query = '';
    $('.sidebar-menu li').removeClass('active');
    $('#blink-5').addClass('active');
    var hosts = Meteor.users.find({
      //    'emails[0].verified': true,
      'profile.type': 'host'
      //    'profile.verified': false
    }).fetch();
    an = hosts;
    Session.set('an', an);
  } else if (parseInt(nav) == 6) {
    query = '';
    $('.sidebar-menu li').removeClass('active');
    $('#blink-6').addClass('active');
  } else if (parseInt(nav) == 7) {
    query = '';
    $('.sidebar-menu li').removeClass('active');
    $('#blink-7').addClass('active');
  } else if (parseInt(nav) == 8) {
    query = '';
    $('.sidebar-menu li').removeClass('active');
    $('#blink-8').addClass('active');
  } else if (parseInt(nav) == 9) {
    query = '';
    $('.sidebar-menu li').removeClass('active');
    $('#blink-9').addClass('active');
  } else if (parseInt(nav) == 10) {
    query = '';
    $('.sidebar-menu li').removeClass('active');
    $('#blink-10').addClass('active');
  } else if (parseInt(nav) == 11) {
    query = '';
    $('.sidebar-menu li').removeClass('active');
    $('#blink-11').addClass('active');
  } else if (parseInt(nav) == 12) {
    query = '';
    $('.sidebar-menu li').removeClass('active');
    $('#blink-12').addClass('active');
  } else if (parseInt(nav) == 13) {
    query = '';
    $('.sidebar-menu li').removeClass('active');
    $('#blink-13').addClass('active');
  } else if (parseInt(nav) == 14) {
    query = '';
    $('.sidebar-menu li').removeClass('active');
    $('#blink-14').addClass('active');
  } else if (parseInt(nav) == 15) {
    query = '';
    $('.sidebar-menu li').removeClass('active');
    $('#blink-15').addClass('active');
  } else if (parseInt(nav) == 16) {
    query = '';
    $('.sidebar-menu li').removeClass('active');
    $('#blink-16').addClass('active');
  }
  an = Analytics.find({
    op: query
  }, {
    // limit: 50
  }).fetch();

  an = an.map((v, i) => {
    v.date = moment(v.date).format("MMMM Do YYYY, h:mm:ss a");
    return v;
  });
  if (an.length !== 0) {
    Session.set('an', an);
  }
}

var subs = new SubsManager({
  // will be cached only 20 recently used subscriptions
  cacheLimit: 90,
  // any subscription will be expired after 5 minutes of inactivity
  expireIn: 10
});
Template.Admin.onCreated(() => {

  subs.subscribe('analytics'), subs.subscribe('calends'), subs.subscribe('userList', 'all'),
    subs.subscribe("storegen"), subs.subscribe("favorites"),
    subs.subscribe('files.images.all'), subs.subscribe('files.png.all'),
    subs.subscribe('files.cni.all')
  getInfo();
  Session.setDefault('pay', {
    action: false
  });
  Session.setDefault('usersArr', []);

});

// STEP 3  

Template.Admin.events({
  'change .max-users': (e) => {
    Session.set('max-users', parseInt(e.target.value));
  },
  'change .check-user': (e) => {
    if (e.target.checked) {
      let val = e.target.value.split('-');
      if (Missions.findOne(val[0]).hostesCol <= Missions.findOne(val[0]).hostes.length) {
        swal('mission is full');
        return;
      }
      let data = Session.get('usersArr');
      if (!_.findWhere(data, val) && !_.findWhere(Missions.findOne(val[0]).hostes, {
          id: val[1]
        })) {
        data.push(val);
        Session.set('usersArr', data);
      }

    }
  },
  'click .pay': (e, template) => {
    console.log(!!e.target.attributes['2']);
    if (e.target.attributes['2'].toString() === 'disabled') return false;
    var id = e.target.id.split('-')[1];
    var mid = e.target.id.split('-')[2];

    Session.set('pay', {
      action: true,
      id: id,
      mid: mid
    });
  },
  'click .deny' (e) {
    Meteor.users.update({
      _id: e.target.id.split('-')[1]
    }, {
      $set: {
        'profile.preselected2': false
      }
    });
    swal('Refusé !');

    Analytics.insert({
      date: new Date(),
      type: 'preselected2',
      op: 'declineHost',
      name: user.profile.name,
      reason: $('#preselect-reason-' + e.target.id).val(),
      path: Iron.Location.get().path
    });

  },
  'click .sendEmail': e => {
    //let mid = e.target.id.split('-')[1];
    // var sum = e.target.id.split('-')[2];
    // sum = parseInt(sum);
    // var fee = .20 * sum;
    let user = $('#userId').val();
    let email = $('#userEm').val();
    // if (!!sum) {
    //   sum = parseFloat(sum);
    //   swal(parseInt($('#inpPay-' + mid).val()) * 100);
    Meteor.call('Payment.methods.doPayin', user, parseInt($('#inpPay').val()) * 100, null, function (err, val) {
      Meteor.call('sendEmail',
        email,
        'julie@bemanners.com',
        'Manners | pay price', val);
    });
    swal('Send!');
    // }
  },
  'click .setPay': e => {
    let mid = e.target.id.split('-')[1]
    Missions.update(mid, {
      $set: {
        status: 5
      }
    });
    swal('Mission status updated!');
  },
  'click .confirm' (e) {
    // if (Meteor.user().profile.preselected == true) {
    //     answ = false;
    //     swal('Déclin');
    // } else {
    // }
    Meteor.users.update({
      _id: e.target.id.split('-')[1]
    }, {
      $set: {
        'profile.preselected2': true
      }
    });
    swal('Confirmé');
    let user = Meteor.users.findOne(e.target.id.split('-')[1]);
    Meteor.call('Payment.methods.createWallet', user._id, function (error, success) {
      if (error) {
        console.log('error', error);
      }
      if (success) {}
    });

    Meteor.call('appTimer', user, new Date(), 3);
    let mText = `Hello ` + user.profile.firstname + ` ` + user.profile.name + `,

Il ne te reste plus qu’à venir signer ton contrat de partenariat pour officialiser ton entrée dans la communauté 🎉
Pour cela, il faut que tu nous retournes les documents suivants :
+ ton RIB
+ ta carte d’identité (Recto-Verso) ou passeport
+ ton certificat d’immatriculation au régime des auto-entrepreneurs (document de l’INSEE)
Une fois ton profil complet, nous reviendrons vers toi pour fixer la date à laquelle tu pourras venir signer ton contrat.

Envoie nous ça vite 🏃
L’équipe Manners`;

    Meteor.call('sendEmailCli',
      e.target.id.split('-')[1],
      'julie@bemanners.com',
      'Manners | Complète ton profil 📝', mText);
  },
  'click .add-fav' (e) {
    var el = document.getElementById(e.target.id);
    let data = Session.get('usersArr');
    $('.check-user').attr('checked', false);
    data.forEach(val => {
      var id = val[1];


      var mid = val[0];
      var miss = Missions.findOne(mid);
      var job = $('#jobSelect-' + id + '-' + mid).val();
      var pid = val[4];

      var date = val[2];
      let user = Meteor.users.findOne(id);

      if (miss.mtype === "CUSTOM") {
        Missions.update(mid, {
          $push: {
            preHostes2: {
              id: id,
              date: date,
              mission: job,
              pid: pid
            }
          }
        });

        let cli = Meteor.users.findOne(miss.creator);
        let user = Meteor.users.findOne(id);
        Meteor.call('sendEmailCli',
          miss.creator,
          'julie@bemanners.com',
          'Manners | Bravo, tu as été selectionné !',
          `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Mail - Demande d'inscription</title>
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
                    Bonjour ` + cli.profile.nameManager + ` ` + cli.profile.lastNameManager + `,<br><br>
Nous avons trouvé plusieurs profils qui correspondent à votre demande. <br>
Vous pouvez les sélectionner et valider la mission en cliquant sur le lien ci-dessous :<br>
<a href="bemanners.com/client/mes-missions">Manners</a>
<br><br>
Cordialement,<br>
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


        Meteor.call('sendEmailCli',
          id,
          'julie@bemanners.com',
          'Manners | Tes documents',
          `Hello ` + user.profile.firstname + ` ` + user.profile.name + ` 😊

Bravo ton profil est complet, congrats 🎉

Il ne te reste plus qu’à venir signer ton contrat de partenariat.
Tu peux prendre rendez-vous avec nous sur le lien suivant :
https://calendly.com/manners/signature-manners/

Et n’oublie pas si ces créneaux ne te conviennent pas, envoie nous un mail, nous t’en proposerons un nouveau.

À très vite 👏🏼,
L’équipe Manners`);
      } else {
        if (miss.hostes.length !== miss.hostesCol) {
          Missions.update(mid, {
            $push: {
              hostes: {
                id: id,
                date: date,
                mission: job,
                pid: pid
              }
            }
          });


        }

          miss = Missions.findOne(mid);
          let cli = Meteor.users.findOne(miss.creator);
          if (miss.hostes.length == miss.hostesCol && cli.profile.favorite) {
            Missions.update(mid, {
              $set: {
                status: 3
              }
            });
          } else if (miss.hostes.length == miss.hostesCol||(data.length+miss.hostesCol)==2) {

            Missions.update(mid, {
              $set: {
                status: 2
              }
            });

            let cli = Meteor.users.findOne(miss.creator);
            Meteor.call('sendEmailCli',
              id,
              'julie@bemanners.com',
              'Manners | Viens signer ton contrat ', `
                    Hello ` + user.profile.firstname + ` ` + user.profile.name + ` 😊
Bravo ton profil est complet, congrats 🎉

Il ne te reste plus qu’à venir signer ton contrat de partenariat.
Tu peux prendre rendez-vous avec nous sur le lien suivant :
https://calendly.com/manners/signature-manners/ 
Et n’oublie pas si ces créneaux ne te conviennent pas, envoie nous un mail, nous t’en proposerons un nouveau.

À très vite 👏🏼,
L’équipe Manners`);


          }
swal('Added ' + data.length + ' partners');
    Session.set('usersArr', []);
      }
    });
    //$('#'+e.target.id).prev().css( "background-color", "red" );

    
  },

  'click .add-fav-c' (e) {
    let data = Session.get('usersArr');

    data.forEach(val => {
      var id = val[1];
      var mid = val[0];
      var miss = Missions.findOne(mid);
      var job = val[3];
      var date = val[2];
      Missions.update(mid, {
        $push: {
          preHostes2: {
            id: id,
            date: date,
            mission: job
          }
        }
      });
      let cli = Meteor.users.findOne(miss.creator);
      let user = Meteor.users.findOne(id);
      Meteor.call('sendEmailCli',
        miss.creator,
        'julie@bemanners.com',
        'Manners | Bravo, tu as été selectionné !',
        `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Mail - Demande d'inscription</title>
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
                    Bonjour ` + cli.profile.nameManager + ` ` + cli.profile.lastNameManager + `,<br><br>
Nous avons trouvé plusieurs profils qui correspondent à votre demande. <br>
Vous pouvez les sélectionner et valider la mission en cliquant sur le lien ci-dessous :<br>
<a href="bemanners.com/client/mes-missions">Manners</a>
<br><br>
Cordialement,<br>
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


      Meteor.call('sendEmailCli',
        id,
        'julie@bemanners.com',
        'Manners | Tes documents',
        `Hello ` + user.profile.firstname + ` ` + user.profile.name + ` 😊

Bravo ton profil est complet, congrats 🎉

Il ne te reste plus qu’à venir signer ton contrat de partenariat.
Tu peux prendre rendez-vous avec nous sur le lien suivant :
https://calendly.com/manners/signature-manners/

Et n’oublie pas si ces créneaux ne te conviennent pas, envoie nous un mail, nous t’en proposerons un nouveau.

À très vite 👏🏼,
L’équipe Manners`);
      //             Meteor.call('sendEmailCli',
      //                 id,
      //                 'julie@bemanners.com',
      //                 'Manners | Tes documents',
      //                 `<!DOCTYPE html>
      // <html lang="en">

      // <head>
      //     <meta charset="UTF-8">
      //     <title>Mail - Demande d'inscription</title>
      //     <link href="mail.css" type="text/css" rel="stylesheet">
      // </head>

      // <body style=" background-color:#FAFAFA; font-family:'Trebuchet MS',Arial,sans-serif;color:#FFF;text-align: center;">
      //     <header>
      //         <a href="http://bemanners.com/accueil"><img class="logo" src="http://bemanners.com:8888/img/logo.png" alt="Manners" height="42" width="120" style="margin-top: 20px">
      //         </a>
      //     </header>
      //     <section style="background-color:#FFF; margin:1% 25% 3% 25%; padding:2% 2% 2% 2%; box-shadow: 0px 2px #EEE">
      //         <div style="line-height: 150%; color:#000;">
      //             <p>
      //                 <p style="text-align: center;"><span style="font-size:13px"><span style="font-family:roboto,helvetica neue,helvetica,arial,sans-serif">
      //                     Hello ` + user.profile.firstname + ` ` + user.profile.name + `<br>
      // Il ne te reste plus qu’à venir signer ton contrat de partenariat pour officialiser ton entrée dans la communauté ! Pour cela, il faut que tu nous retournes les documents suivants :<br>
      // <br>
      // <span style="font-weight: bold; text-decoration: underline">+ Ton RIB<br>
      // + Ta carte d’identité (Recto-Verso) ou passeport<br>
      // + Ton certificat d’immatriculation au régime des auto-entrepreneurs (document de l’INSEE)</span><br>
      // <br>
      // Une fois ton profil complet, nous reviendrons vers toi pour fixer la date à laquelle<br>
      // tu pourras venir signer ton contrat.<br><br><br>
      // Envoie nous ça vite<br>
      // L'équipe Manners ☀️</span></span>
      //                 </p>
      //         </div>

      //         </p>
      //         </div>
      //     </section>
      // <div style="margin-bottom: 45px">
      //        <img src="http://bemanners.com:8888/img/icon-facebook.png" alt="" width="24" height="24" style="margin: 0 15px;">
      //         <img src="http://bemanners.com:8888/img/icon-twitter.png" alt="" width="24" height="24" style="margin: 0 15px;">
      //         <img src="http://bemanners.com:8888/img/icon-linkedin.png" alt="" width="24" height="24" style="margin: 0 15px;">
      //         <img src="http://bemanners.com:8888/img/icon-instagram.png" alt="" width="24" height="24" style="margin: 0 15px;">


      //                 </div>
      //     <div style="display:block; border-top:2px solid #EEE; padding-top:10px; padding-bottom:25px; margin:0 25% 0 25%;"></div>

      //     </div>
      //     <footer>
      //         <div style="color: #656565; font-family: Helvetica; font-size: 12px; line-height:70%; text-align: center;">

      //             <p><em>Sent with ❤️ by Manners</em>
      //             </p>
      //             <p>2016 © </p>
      //             <br>
      //             <p>Rencontrez-nous : 24 avenue Marceau, 75008, Paris</p>
      //             <p>Contactez-nous : contact@bemanners.com | 01 76 39 00 01</p>
      //             <br><br>
      //             <a class="text-center" href="">Se désinscrire</a>
      //         </div>
      //     </footer>

      // </body>
      // </html>`);

    });
    //$('#'+e.target.id).prev().css( "background-color", "red" );

    swal('Added ' + data.length + ' partners');
    Session.set('usersArr', []);
  },
  'change #fileselect5': function (e) {
    e.preventDefault();
    var files = event.target.files;
    for (var i = 0, ln = files.length; i < ln; i++) {
      Session.set('postImage', PostImages.insert(files[i]));
    }
  },
  'submit #post-to-blog' (e) {
    e.preventDefault();
    Posts.insert({
      title: e.target.title.value,
      image: Session.get('postImage'),
      body: e.target.body.value,
      author: e.target.author.value
    });
  },
  'click .bl' (e) {
    setTimeout(() => {
      getInfo();
    }, 400);
  },
  'click .dropdown-menu li' (e, instance) {
    var ti = parseInt($(e.target).attr('tabindex'));
    var nav = Iron.Location.get().path.split('/')[2];
    var query = '';
    if (parseInt(nav) == 1) {
      query = 'visit';
    } else if (parseInt(nav) == 2) {
      query = 'register';
    }
    var tq = '';
    if (ti == 1) {
      tq = '1 month ago';
    } else if (ti == 2) {
      tq = '1 week ago';
    } else if (ti == 3) {
      td = '3 day ago';
    }

    var curDate = new Date();
    var an = Analytics.find({
      op: query
      // date: {
      //   $gt: Date.create(tq)
      // }
    }, {
      // limit: 50
    }).fetch();
    var an = an.map((v, i) => {
      v.date = moment(v.date).format("MMMM Do YYYY, h:mm:ss a");
      return v;
    });
    Session.set('an', an);
  },
  "click #menu1": () => {
    $("#menu1").dropdown("toggle");
  },
  "click #menu2": (e) => {
    $("#menu2").dropdown("toggle");
  },
  "click .menu2": (e) => {
    let id = e.target.id.split('-')[1];
    Session.set('menu2', id);
  },
  "click .app1-deny": (e) => {
    let id = e.target.id.split('-')[1];
    let user = Meteor.users.findOne(id);

    Meteor.users.update({
      _id: id
    }, {
      $set: {
        'profile.preselected': false
      }
    });
    swal('Refusé!');


    Analytics.insert({
      date: new Date(),
      type: 'preappoint',
      id: id,
      name: user.profile.firstname + ' ' + user.profile.name,
      op: 'declineHost',
      reason: $('#app1-reason-' + id).val()
    });

    let mText = `Bonjour ` + user.profile.firstname + ` ` + user.profile.name + `,

Nous te remercions de l’intérêt que tu as bien voulu porter à Manners et du temps que tu nous as consacré.

Toutefois, nous sommes au regret de t’informer que nous ne souhaitons pas donner suite à ta demande de partenariat.

Nous te souhaitons les meilleures chances possibles dans tes futures recherches.

Bien à toi,
L’équipe Manners`;

    Meteor.call('sendEmailCli',
      id,
      'julie@bemanners.com',
      "Manners | Suite à notre rendez-vous ...",
      mText);
  },
  "click .app1-conf": (e) => {
    let id = e.target.id.split('-')[1];
    let user = Meteor.users.findOne(id);
    if (!user) return;
    // let startDate = $('#start-date-' + id).val();
    // let endDate = $('#end-date-' + id).val();
    // let hours = $('#hours-' + id).val();
    // let minutes = $('#minutes-' + id).val();
    // let hoursE = $('#hoursE-' + id).val();
    // let minutesE = $('#minutesE-' + id).val();
    // let start = new Date(startDate + ' ' + hours + ':' + minutes);
    // let end = new Date(endDate + ' ' + hoursE + ':' + minutesE);
    // Meteor.call('createEvent', id , start, end);
    let mText = ``;
    Appointment.insert({
      user: id,
      email: user.profile.email,
      date: new Date(),
      step: 2,
      answered: false
    });
    Meteor.call('appTimer', user, new Date(), 2);
    Meteor.call('appTimer', user, new Date(), 4);
    if (user.profile.sex === 'Femme') {
      mText = `Hello ` + user.profile.firstname + ` ` + user.profile.name + ` 😊

Nous sommes heureux de te compter parmi les sélectionnés pour devenir notre partenaire.

Comme nous te l'avons expliqué, il est nécessaire d'obtenir son statut d'auto-entrepreneur pour commencer à travailler avec tes clients.
Ce statut te permettra de recevoir tes premières missions et de facturer tes prestations.

Il est nécessaire que tu investisses dans ton propre outil de travail, une tenue.
Pour toutes les missions “événementiel” et “service”, les clients demandent en général une robe ou un tailleur-pantalon noirs.
Voici une référence si tu n’en a pas. 🙎

PS : Si tu possèdes déjà une tenue, pense à m’envoyer une photo pour que nous la validions.

Si tu as besoin, on te propose de venir faire une photo dans nos locaux ! Ca te permettra d’avoir une photo cool pour ton profil. Prends rendez vous si tu veux : https://calendly.com/manners/session-photo/


N'hésite pas à nous contacter par téléphone si tu souhaites être accompagnée dans cette démarche ou si tu as la moindre question.
Voici notre blog sur lequel tu trouveras toutes les infos pour devenir auto-entrepreneur en complément du guide du Manners.

Si tu habites encore chez tes parents et que tu es sous leur foyer fiscal, voici un article pour leur information.

J’espère que toi aussi tu souhaites rejoindre l’aventure !

J’attends ta réponse ! 
L'équipe Manners`;
    } else {
      mText = `Hello ` + user.profile.firstname + ` ` + user.profile.name + ` 😊

Nous sommes heureux de te compter parmi les sélectionnés pour devenir notre partenaire.

Comme nous te l'avons expliqué, il est nécessaire d'obtenir son statut d'auto-entrepreneur pour commencer à travailler avec tes clients.
Ce statut te permettra de recevoir tes premières missions et de facturer tes prestations.

N'hésite pas à nous contacter par téléphone si tu souhaites être accompagné dans cette démarche ou si tu as la moindre question.
Voici notre blog sur lequel tu trouveras toutes les infos pour devenir auto-entrepreneur en complément du guide du Manners.

Si tu habites encore chez tes parents et que tu es sous leur foyer fiscal, voici un article pour leur information.

Si tu as besoin, on te propose de venir faire une photo dans nos locaux ! Ca te permettra d’avoir une photo cool pour ton profil. Prends rendez-vous si tu veux : https://calendly.com/manners/session-photo


J’espère que toi aussi tu souhaites rejoindre l’aventure !

J’attends ta réponse ! 
L'équipe Manners`;
    }
    Meteor.call('sendEmailCli',
      id,
      'julie@bemanners.com',
      "Manners | Souhaites-tu faire partie de l'aventure 🚀👨?",
      mText);

    Meteor.users.update({
      _id: id
    }, {
      $set: {
        'profile.preselected': true
      }
    });
    swal('Confirmé');

  },
  "click .mail-op-apr": (e) => {
    var answ = true;
    swal('Confirmé');

    Meteor.call('sendVerificationLink', e.target.id.split('-')[1]);
    Meteor.users.update({
      _id: e.target.id.split('-')[1]
    }, {
      $set: {
        'profile.verified': answ
      }
    });
    let password = Storegen.findOne({
      uid: e.target.id.split('-')[1]
    }).store;
    let user = Meteor.users.findOne(e.target.id.split('-')[1]);
    let mText = `Hello ` + user.profile.firstname + ` ` + user.profile.name + `,

Bienvenue dans la communauté Manners, ça y est tu peux enfin réaliser des missions par le biais de Manners. Avant de postuler à des missions pense à bien mettre à jour ton profil pour donner envie à tes clients.

Pour te connecter voici tes identifiants :
Mail : tonmail@gmail.com
Mot de passe : ` + password + `

Pour rappel, voici ce que nous t'offrons chez Manners :
1. On te trouve des clients
2. On réalise tes factures en bon et due forme
3. On assure les paiements (et les relances en cas de retard)
4. On t'assure en cas de pépin jusqu’à 8 millions d'€ (Hiscox)
5. On fait ta compta tous les mois
6. On répond à tes questions 7/7j
7. Et en bonus : des bons plans, des apéros, une équipe cool

N'hésite pas à nous contacter directement si tu as des questions ou des recommandations :
+ Taly Attia - taly@bemanners.com - 06 25 23 23 25 : toutes tes questions liées au statut d'auto-entrepreneur, du paiement de tes charges et du contrat de partenariat.
+ Benjamin Delacour - benjamin@bemanners.com - 06 85 80 39 91 : toutes tes questions liées aux missions, à la facturation, au paiement et aux relevés d'activité.

A très vite pour ta première mission !`;
    //remove password send

    Meteor.call('sendEmailCli',
      e.target.id.split('-')[1],
      'julie@bemanners.com',
      "Manners | Demande d'inscription", mText);

  },
  "change .jobsList": (e) => {
    Session.set('jobFilter', e.target.value + '-' + e.target.id.split('-')[1]);
  },
  "click .scan": (e) => {
    let id = e.target.id.split('-')[1];
    Meteor.users.update(id, {
      $set: {
        'profile.scan': $('#scan-' + id).val()
      }
    });
  },
  "click .rib": (e) => {
    let id = e.target.id.split('-')[1];
    Meteor.users.update(id, {
      $set: {
        'profile.rib': $('#rib-' + id).val()
      }
    });
  },
  "click .mail-op-dec": (e) => {
    var answ = false;
    swal('Decline');

    Analytics.insert({
      date: new Date(),
      type: 'preselected',
      id: e.target.id.split('-')[1],
      op: 'declineHost',
      reason: $("#report-" + e.target.id).val(),
      path: Iron.Location.get().path
    });
    Meteor.users.update({
      _id: e.target.id
    }, {
      $set: {
        'profile.verified': answ
      }
    });
  },
  "click .mail-op-answ": (e) => {
    var answ = false;
    swal('Thank You for review!');
  },
  "input .search-miss": (e) => {
    Meteor.call('searchMissionByUser', e.target.value, function (error, miss) {
      if (error) {
        console.log('error', error);
      }
      if (!!miss && miss.length > 0) {
        miss = miss.map((val) => {
          return val._id;
        });
        Session.set('customMiss', miss);
        Session.set('expressMiss', miss);

      } else {
        Session.set('customMiss', false);
        Session.set('expressMiss', false);
      }
    });
  },
  "click .mission_like_number": (e) => {
    var id = e.target.id.split('-')[1];
    Meteor.call('setMissPayed', id);
  },
  "submit #comp-a": (e) => {
    Companies.insert({
      name: e.target.comp.value,
      users: [Meteor.userId()]
    }, function () {
      alert('Entreprise ajoutée avec succès');
    });
  },
  "click .cni-upload": (e) => {
    let userId = e.target.id.split('-')[1]
    let file = e.target.id.split('-')[2]

    function convertImgToDataURLviaCanvas(url, callback, outputFormat) {
      var img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null;
      };
      img.src = url;
    }

    function convertFileToDataURLviaFileReader(url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
          callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    }

    var imageUrl = '/images/slide1.jpg';
    var convertType = 'nooo';
    var convertFunction = convertType === 'FileReader' ?
      convertFileToDataURLviaFileReader :
      convertImgToDataURLviaCanvas;

    convertFunction(imageUrl, function (base64Img) {
      base64Img = '/' + base64Img.split('/').slice(2).join('/');
      Meteor.call('Payment.methods.createKYC', userId, base64Img, function (error, success) {
        if (error) {
          console.log('error', error);
        }
        if (success) {
          swal('success');
        }
      });
    });







    //  base64Img.requestBase64('http://some.org/wp-content/uploads/2015/09/SOME-Logo-JPEG.jpg', function(err, res, body) {

  }
});

// Template.Admin.onRendered(() => {
//     $.fn.datepicker.dates['fr'] = {
//         days: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
//         daysShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
//         daysMin: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
//         months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
//         monthsShort: ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jui", "Aou", "Sep", "Oct", "Nov", "Dec"],
//         today: "Aujourd'hui",
//         clear: "Rafraîchir",
//         format: "dd/mm/yyyy",
//         titleFormat: "MM yyyy",
//         /* Leverages same syntax as 'format' */
//         weekStart: 0
//     };
//     Meteor.setTimeout(() => {
//         let col = document.querySelectorAll('tr').length;
//         _.range(col).forEach((v) => {
//             console.log(v, 'ss');
//             $('#dateset-start-' + v).datepicker({
//                 pickTime: false,
//                 language: 'fr'
//             });

//             $('#dateset-end-' + v).datepicker({
//                 pickTime: false,
//                 language: 'fr'
//             });
//         });


//     }, 400);


// });

Template.Admin.helpers({
  app1conf: (id) => {
    let user = Meteor.users.findOne(id);
    if (!!user.profile.preselected) return false;
    else return true;
  },
  app2conf: (id) => {
    let user = Meteor.users.findOne(id);
    if (!!user.profile.preselected2) return false;
    else return true;
  },
  missExist: (v) => {
    if (v.length > 0) return true;
    else return false;
  },
  missCustExist: (v) => {
    if (v.fetch().length > 0) return true;
    else return false;
  },
  favExist: (v) => {
    var fav = Meteor.users.findOne({
      _id: v
    });
    var data = 'glyphicon glyphicon-heart-empty';
    fav = fav.profile;
    if (fav.hasOwnProperty('favorite')) {
      if (fav.favorite) {
        data = "glyphicon glyphicon-heart";
      }

    }

    return data;
  },
  getOp: (id) => {
    if (Meteor.users.findOne(id).profile.preselected == true) {
      return true;
    } else {
      return false;
    }
  },
  getUser: (id, mid) => {
    var usr = Meteor.users.findOne(id);
    let sum = _.findWhere(Missions.findOne(mid).pattern, {
      hid: id
    }).price;
    return usr.profile.firstname + ' ' + usr.profile.name + '   ' + sum + "E";
  },
  transacts: () => {
    var trans = ReactiveMethod.call('Payment.methods.getTransactions', Meteor.userId());
    if (trans == undefined) return false;
    trans = trans.map((val) => {
      if (!!val.Tag) {
        val.Mission = Missions.findOne(val.Tag).name;
      }
      return val;
    });
    return trans;
  },
  pay: function () {
    var pay = Session.get('pay');
    if (!!pay.action) {
      let sum = _.findWhere(Missions.findOne(pay.mid).pattern, {
        hid: pay.id
      }).price;
      sum = sum * 100;
      let log = ReactiveMethod.call('Payment.methods.transfer', Missions.findOne(pay.mid).creator, pay.id, Missions.findOne(pay.mid).creator, sum, sum * parseInt($('#paySum-' + pay.id).val()) / 100, pay.mid);
      let dom = [];
      if (!!localStorage.getItem('paymentDom')) {
        dom = JSON.parse(localStorage.getItem('paymentDom'));
      } else {
        localStorage.setItem('paymentDom', [])
      }
      let miss = Missions.findOne(pay.mid);
      dom.push(pay.id);
      if (dom.length == miss.hostesCol) {
        Missions.update(pay.mid, {
          $set: {
            status: 5
          }
        });
        localStorage.removeItem('paymentDom');
        sweetAlert(log.ResultMessage);
      } else {
        localStorage.setItem('paymentDom', dom);
      }
    }
    return false;
  },
  moment: date => {
    console.log('date:', date);
    if (!!parseInt(date))
      return translate(moment(new Date(parseInt(date))).locale('en').format("dddd Do MMM YY"));
    else return translate(moment(new Date(date)).locale('en').format("dddd Do MMM YY"));
  },
  start: (mid, hid) => {
    let miss = Missions.findOne(mid);
    return _.findWhere(miss.pattern, {
      hid: hid
    });
  },
  miss: () => {
    return Missions.find({
      creator: Meteor.userId()
    });
  },
  nav: (v) => {
    var id = parseInt(Iron.Location.get().path.split('/')[2]);
    if (id == v) return 1;
  },
  missions: () => {
    var data = [];
    if (!!Session.get('expressMiss') && Session.get('expressMiss').length > 0) {
      data = Missions.find({
        _id: {
          $in: Session.get('expressMiss')
        },
        mtype: "EXPRESS"
      }).fetch();
    }
    if (!!Session.get('menu2') && Session.get('menu2') === '1') {
      data = Missions.find({
        mtype: "EXPRESS",
        status: 1
      }).fetch();
    } else if (!!Session.get('menu2') && Session.get('menu2') === '2') {
      data = Missions.find({
        mtype: "EXPRESS",
        status: 2
      }).fetch();
    } else if (!!Session.get('menu2') && Session.get('menu2') === '3') {
      data = Missions.find({
        mtype: "EXPRESS",
        status: 3
      }).fetch();
    } else if (!!Session.get('menu2') && Session.get('menu2') === '4') {
      data = Missions.find({
        mtype: "EXPRESS",
        status: 4
      }).fetch();
    } else if (!!Session.get('menu2') && Session.get('menu2') === '5') {
      data = Missions.find({
        mtype: "EXPRESS",
        status: 5
      }).fetch();
    } else {
      data = Missions.find({
        mtype: "EXPRESS"
      }).fetch();
    }
    data = data.map(val => {
      // if (!!Session.get('jobFilter') && Session.get('jobFilter').split('-')[0] === 'all jobs') {
      // return val;
      // } else if (!!Session.get('jobFilter') && val._id === Session.get('jobFilter').split('-')[1]) {
      val.tabs = lodash.unionBy(val.preHostes, 'date');
      val.tabs = val.tabs.map(v => {
        v.pre = _.where(val.preHostes, {
          date: v.date
        });
        v.pre = lodash.unionBy(v.pre, 'id');
        v._id = val._id;
        return v;
      });

      // val.preHostes = lodash.unionBy(val.preHostes, 'id');
      // }
      return val;
    });
    return data;

  },
  userJobs: (mid, uid) => {
    let miss = Missions.findOne(mid);
    let user = _.where(miss.preHostes, {
      id: uid
    });
    let jobs = user.map(val => val.mission);
    return jobs;
  },
  clients: () => {
    return Meteor.users.find({
      'profile.type': 'client'
    });
  },
  added: (mid, uid) => {
    let miss = Missions.findOne(mid);
    // Missions.findOne(mid).hostes
    // let data = Session.get('usersArr');
    if (!!_.findWhere(miss.preHostes2, {
        id: uid
      }) || !!_.findWhere(miss.hostes, {
        id: uid
      })) {
      return 'green_title_bg';
    } else if (miss.hostes.length === miss.hostesCol && miss.mtype === "EXPRESS" || miss.preHostes2.length === miss.hostesCol && miss.mtype === "CUSTOM") {
      return 'red_title_bg';
    } else return 'gray_title_bg';
  },
  favorites: (id) => {
    return Meteor.users.findOne(id).profile.favorites.length
  },
  missCount: (id) => {
    return Missions.find({
      hostes: {
        $in: [id]
      }
    }).count();
  },
  missionsCustom: () => {
    if (!!Session.get('customMiss') && Session.get('customMiss').length > 0) {
      return Missions.find({
        _id: {
          $in: Session.get('customMiss')
        },
        mtype: "CUSTOM"
      });
    }
    return Missions.find({
      mtype: "CUSTOM"
    });
  },
  cliName: (id) => {
    return Meteor.users.findOne(id).profile.lastNameManager;
  },
  cliFirstName: (id) => {
    return Meteor.users.findOne(id).profile.nameManager;
  },
  job: (id) => {
    let miss = Missions.findOne(id).pattern;

    miss = miss.map(val => {
      val.col = _.where(miss, {
        mission: val.mission
      }).length;
      return val;
    });
    miss = lodash.unionBy(miss, 'mission');
    if (!!Session.get('max-users') && miss.length > (Session.get('max-users') - 1)) {
      return miss.slice(0, Session.get('max-users') - 1);
    }
    return miss;
  },
  jobsList: (mid) => {
    let jobs = Missions.findOne(mid).pattern;
    let newJobs = ['all jobs'];
    jobs = newJobs.concat(_.uniq(jobs.map(v => v.mission)));
    return jobs;
  },
  suits: (id) => {

    let suit = Cloth.find({
      _id: {
        $in: id
      }
    }).fetch();



    return suit;
  },
  email: () => {
    return Meteor.users.find({
      'profile.type': 'host',
      'profile.preselected2': true
    }) || [];
  },
  preappoint: () => {
    let data = Analytics.find({
      op: 'toapp1'
    }).fetch();
    ids = data.map((val, i) => {
      return val.id;
    });
    return Meteor.users.find({
      _id: {
        $in: ids
      }
    }) || [];
  },
  rejected: () => {
    return Analytics.find({
      op: 'declineHost'
    });

  },
  mogopay: () => {
    Meteor.call('Payment.methods.getAllUsers', function (error, res) {
      if (error) {
        console.log('error', error);
      }
      if (res) {
        // res = res.map(val => {
        //    // if (val.hasOwnProperty('LegalRepresentativeLastName')) return null;
        //     return val;
        // });
        // res = res.clean(undefined);

        Session.set('MongoUsers', res);
      }
    });
    return Session.get('MongoUsers');
  },
  preselected: () => {
    return Meteor.users.find({
      'profile.type': 'host',
      'profile.preselected': true
    }) || [];
  },
  mailOp: (id) => {
    let tempUsrData = Meteor.users.findOne({
      _id: id,
    });
    if (tempUsrData.profile.preselected == true && tempUsrData.profile.preselected2 == true) {
      if (tempUsrData.profile.verified !== true) {
        return '<div><p>Étape 4 : Dernière étape </p> <button type="button" id="ver-' + id + '" class="btn btn-colored btn-admin mail-op-apr">Valider</button> <button type="button" id="ver-' + id + '" class="btn mail-op-dec btn-admin btn-colored">Refuser</button> </div> <input id="report-{{_id}}" placeholder="Refus mail (Decline mail) ?" class="form-control"/> ';
      } else {
        return '<h3>Disabled</h3>';
        //  return '<div> <button type="button" id="ver-' + id + '" class="btn btn-block  btn-colored btn-admin mail-op-apr">Valider</button> <button type="button" id="ver-' + id + '" class="btn mail-op-dec btn-large btn-block btn-colored btn-admin">Refuser</button> </div> <input id="report-{{_id}}" placeholder="Refus mail (Decline mail) ?" class="form-control"/> ';
      }
    } else {
      return '<span>Not pass appointment</span>'
    }


  },
  userName: (id) => {
    return Meteor.users.findOne(id).profile.firstname + ' ' + Meteor.users.findOne(id).profile.name;
  },
  payEnable: (stat) => {
    stat = parseInt(stat);
    if (stat == 3) {
      return false;
    }
    return true;
  },
  analytics: () => {
    return Session.get('an');
  },
  phone: (email, tel) => {
    if (!!tel) {
      return tel;
    }
    return Meteor.users.findOne({
      'profile.email': email,
      'profile.type': 'host'
    }).profile.phone || 'not finded';
  },
  loadVyte: () => {
    Meteor.call('loadVyte', function (error, success) {
      if (error) {
        console.log('error', error);
      }
      if (success) {
        success = success.map(val => {
          val.date = val.dates[0].date;
          return val;
        });
        Session.set('vyte', success);
      }
    });
  },
  vyte: () => {
    //return Session.get('vyte');
    return Calends.find();
  },
  bic: () => {
    let data = Meteor.users.find({
      'profile.type': 'host'
    }).fetch().map((user) => {
      let res = {};
      if (!!user) {
        res.name = user.profile.firstname + ' ' + user.profile.name;
        id = user.profile.email;
        res.id = user._id;
        res.png = Png.find({
          'meta.ownerId': id
        }).each()[0];
        // res.png = res.png[0];
        if (!!res.png) res.png = res.png.link();
        res.cni = Cni.find({
          'meta.ownerId': id
        }).each()[0];
        // res.cni = res.cni[0];
        if (!!res.cni) res.cni = res.cni.link();
        console.log(res);
        return res;
      }
      return null;


    });
    return data.clean(undefined);
  }
});
/*
https://www.vyte.in/add_invitees?aid=592af17bba526a64003b98b6&agid=bemanners_events&et=MannersBirthday%20setup%20session&im=ehvfyuf@gmail.com&in=Sergio%20h&places=Skype%7Cmasterofdaemon%7C%7CGoogle%20Hangouts%7Cehvfyuf@gmail.com&em=Hi
https://www.vyte.in/add_invitees?aid= 592d8c828b48e04900311270&agid=Manners_RDV&et=Manners%20setup%20session&im=mavhias@gmail.com&in=Mathias%20Villar&places=%7C%7CGoogle%20Hangouts%7Cmavhias@gmail.com&em=Bonjour%20Mathias,%20please%20find%20my%20suggestions%20for%20our%2015%20min%20call%20setup%20session%20on%20vyte.in.%20Best&ct=673d1f0ac1c595b82dd50299bf924bec75d25cf80bd708de066c409c8110612f

https://www.vyte.in/add_invitees?aid=592dc19336411e7800ea5eeb&agid=project_85fc5&et=RdvPhotos%20setup%20session&im=taly@bemanners.com&in=%20Saint&places=Skype%7Cmartin.saint-macary&em=Hi%20Martin,%20please%20find%20my%20suggestions%20for%20our%2015%20min%20call%20setup%20session%20on%20vyte.in.%20Best&ct=69547a100f3b519bbd1910f3755e2aa00ce9c7e7e2a1b0734068b0ab518589a2
*/
