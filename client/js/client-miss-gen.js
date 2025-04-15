Template.ClientMissGen.onCreated(() => {
  Session.setDefault('data', []);
  Session.setDefault('ids', []);
  Session.setDefault('data1', []);
  Session.setDefault('btn-cicle', false);
  Session.setDefault('pay', {
    action: false
  });
  var interval = Meteor.setInterval(function () {
    var data = [];
    var usrs = [];
    var miss;
    if (location.href.split('/')[5]) {
      var miss = Missions.findOne({
        _id: location.href.split('/')[5]
      });
      Session.set('ids', miss.hostes);
      Session.set('data1', miss);
      var hostes = miss.hostes.map((v, i) => {
        return v.id;
      });
      usrs = Meteor.users.find({
        _id: {
          $in: hostes
        },
        'profile.type': 'host'
      }).fetch();

    } else {
      return [];
    }

    let lastdata = [];
    if (!!miss) {
      let date1 = miss.pattern.map((v) => {
        return new Date(v.date).getTime();
      });
      let udate = _.uniq(date1);

      udate.forEach((val, i) => {
        var sdate = val;
        let job = miss.pattern.map((v) => {
          return v.mission
        });
        job = _.uniq(job);
        job.forEach((val) => {
          lastdata[i] = {};
          let hcol = _.where(miss.hostes, {
            date: sdate.toString(),
            mission: val,
          }).length;
          lastdata[i].hcol = hcol;
          lastdata[i].sdate = new Date(sdate);
          lastdata[i].mission = val;

          lastdata[i].vals = {};
          //  if (miss.mtype === "EXPRESS") {
          lastdata[i].vals.hote = _.where(miss.hostes, {
            date: sdate.toString(),
            mission: val,
          });
          //    } else {
          lastdata[i].vals.pre = _.where(miss.preHostes2, {
            date: sdate.toString(),
            mission: val,
          });
          i += 1;
        });

        //    }
      });
      // miss.hostes.forEach((v, i) => {
      //     if (!!usrs[i]) {

      //         if (v.date == date[i]) {

      //             data[i] = {};
      //             let curd = {};
      //             data[i].pattern = v;
      //             data[i].id = usrs[i]._id;
      //             data[i].username = usrs[i].profile.firstname + ' ' + usrs[i].profile.name[0].toUpperCase();
      //             curd.sdate = date[i];
      //             curd.vals = data[i];
      //         }

      //     }
      // });
    }
    // Meteor.clearInterval(interval);
    Session.set('data', lastdata);

  }, 1000);


});

Template.ClientMissGen.onRendered(() => {
 Meteor.setTimeout(() => {
    var miss = Session.get('data1');
    if (!miss) return false;
    HTTP.get('https://maps.google.com/maps/api/geocode/json', {
      params: {
        address: miss.address
      }
    }, (err, res) => {
      console.log(res.data.results[0].address_components[1].short_name);
      let cords = {
        lat: res.data.results[0].geometry.location.lat,
        lng: res.data.results[0].geometry.location.lng
      };
      if (!err && res.data.results.length > 0) {
        var map = new google.maps.Map(document.getElementById('mapCli'), {
          center: cords,
          scrollwheel: false,
          zoom: 13
        });

        var marker = new google.maps.Marker({
          position: cords,
          map: map
        });


      }
    });
    // Meteor.clearInterval(mapInit);
  }, 2300);

});

Template.ClientMissGen.events({
  'click #missPdf': () => {
    let data = {
      mission: Session.get('data1'),
      op: 'mission'
    };
    Session.set('gopdf', data);
  },
  'click #dlt-miss': (e) => {
    let cliName = Meteor.user().profile.nameManager + Meteor.user().profile.lastnameManager;
    var amiss = Session.get('data1');
    Missions.remove(amiss._id);
    if (!!amiss.hostes) {
      amiss.hostes.forEach(val => {
        let user = Meteor.users.findOne(val.id).firstname + ' ' + Meteor.users.findOne(val.id).name;
        let text = `Bonjour ` + user + `,
Nous avons le regret de vous annoncer que votre mission ` + amiss.name + ` a été annulée.
Retrouvez nous sur votre espace partenaire/mes-missions pour en rejoindre de nouvelles.

L'équipe Manners, 
bien à vous`;
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
                    Hello ` + user + `<br>
Nous t'informons que la mission ` + amiss.name + ` a été annulée par ton client ` + cliName + `.<br>
<br>
Il n'est pas donc pas nécessaire de t'y rendre. Nous allons revenir vers toi pour t'expliquer les raisons de cette annulation.<br>
<br>
A très vite,<br>
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
            <a style="text-align: center" href="">Se désinscrire</a>
        </div>
    </footer>

</body>

</html>`;

        Meteor.call('sendEmailCli',
          val.id,
          'julie@bemanners.com',
          'Rendez-vous confirmé',
          text
        );

        // Meteor.call('sendEmailCli', val.id, 'julie@bemanners.com', text);

      });
    }
    let clText = `<!DOCTYPE html>
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
                    Bonjour ` + cliName + `,<br><br>
Nous vous confirmons que votre mission ` + amiss.name + ` a bien été annulée.<br>
Si vous avez déjà effectué le paiement, vous serez automatiquement remboursé
dans un délai d'une semaine. <br>
<br>
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

</html>`;
    Meteor.call('sendEmailCli', Meteor.userId(), 'julie@bemanners.com', 'Rendez-vous confirmé', clText);
    sweetAlert({
      title: 'Mission',
      text: 'Deleted'
    }, () => {
      Router.go('/client/mes-missions')
    });
  },
  'click .add-user': (e) => {
    var id = e.target.id.split('-')[0];
    var amiss = Session.get('data1');
    var mid = amiss._id;
    var date = e.target.id.split('-')[1];
    var job = e.target.id.split('-')[2];
    var pid = e.target.id.split('-')[3];

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


    Missions.update(mid, {
      $pull: {
        preHostes2: {
          id: id
        }
      }
    });
    amiss = Missions.findOne(mid);

    if (amiss.hostes.length == amiss.hostesCol && Meteor.user().profile.favorite) {
      Missions.update(mid, {
        $set: {
          status: 3
        }
      });
    } else if (amiss.hostes.length == amiss.hostesCol) {
      Missions.update(mid, {
        $set: {
          status: 2
        }
      });
    }
    swal('Added');

  },
  'click .btn-circle': (e) => {
    if (!!Session.get('btn-cicle')) {
      Session.set('btn-cicle', false);
    } else {
      Session.set('btn-cicle', true);
    }
  },
  'click #payBtn': (e) => {
    var miss = Session.get('data1');
    swal({
      title: "Prix total: " + (miss.price) + "€; \nChoisissez une mode de paiement",
      text: "Vos informations sont personnelles et les paiements sécurisés.",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Payer par virement",
      cancelButtonText: "Payer en carte bleue",
      closeOnConfirm: false,
      closeOnCancel: true
    }, function (isConfirm) {
      if (isConfirm) {
        //swal("Deleted!", "Your imaginary file has been deleted.", "success");
        swal({
          title: "Sweet!",
          text: "",
          imageUrl: "https://secure.bankofamerica.com/content/images/ContextualSiteGraphics/Instructional/en_US/Banner_Credit_Card_Activation.png"
        }, () => {
          var miss = Session.get('data1');

          Missions.update(miss._id, {
            $set: {
              status: 30
            }
          });
        });
      } else {
        Session.set('payIn', true);
      }
    });
    //    /paiement/in/' + miss.price + '
  },
  'click .del-user': (e) => {
    var id = e.target.id;
    var amiss = Session.get('data1');
    var mid = amiss._id;

    Missions.update(mid, {
      $pull: {
        preHostes: {
          id: id
        }
      }
    });
  },
  'click .pay': (event, template) => {
    var id = event.target.id.split('-')[1];
    Session.set('pay', {
      action: true,
      id: id
    });

  }
});

Template.ClientMissGen.helpers({
  tel: (id) => {
    if (Session.get('data1').status == 4 || Session.get('data1').status == 5) {
      return Meteor.users.findOne(id).profile.phone;
    }
    return false;
  },
  email: (id) => {
    if (Session.get('data1').status == 4 || Session.get('data1').status == 5) {
      return Meteor.users.findOne(id).profile.email;
    }
    return false;
  },
  link: function () {

    // var miss = Missions.findOne({});
    // if (!!miss) {
    //     return ReactiveMethod.call('Payment.methods.transfer', Meteor.userId(), 'f2SE2bbkRNcRzP3rX', Meteor.userId(), 15, miss._id);

    // }
    if (!!Session.get('payIn')) {
      var missId = Session.get('data1')._id;
      Missions.update(missId, {
          $set: {
              status: 330
          }
      });
      //    var cvc = $.payment.validateCardCVC($('.cc-cvc').val());
      //     var ccNum = $.payment.validateCardCVC($('.cc-num').val());
      var sum = Missions.findOne(Session.get('data1')._id).price;
      var fee = .20 * sum;
      var user = Meteor.user();
      if (!!sum) {
        sum = parseFloat(sum);
        var url = ReactiveMethod.call('Payment.methods.doPayin', Meteor.userId(), (sum) * 100, Session.get('data1')._id);
        if (!!url) {
          location.href = url;
        }

        // let dom = [];
        // if(!!localStorage.getItem('paymentDom')){
        //     dom = JSON.parse(localStorage.getItem('paymentDom'));
        // }
        // let miss = Missions.findOne(missId);
        // localStorage.setItem('paymentDom', dom.push(pay.id));
        //     Missions.update(missId, {
        //     $set: {
        //         status: 3
        //     }
        // });

        Meteor.call('sendEmailCli',
          Meteor.userId(),
          'julie@bemanners.com',
          'Manners | Tes documents',
          `Bonjour ` + user.profile.firstname + ` ` + user.profile.name + `,

Nous vous confirmons que votre mission [Nom de la mission] a bien été validée.

Vous trouverez toutes les informations de contact de vos Manners dans votre espace Mission.
Vous trouverez également les factures correspondantes dans votre compte.

L’équipe Manners
Bien à vous,`);

      }


      //    if (cvc && !!$('#cc-num').val()) {

      //        return ReactiveMethod.call('Payment.methods.createBankAccount', Meteor.userId(), $('#cc-cvc').val() , $('#cc-num').val(), Meteor.user().profile.address);
      //    }
      //      } else {}

    }
  },
  price: () => {
    let amiss = Session.get('data1');
    return amiss.price;
  },
  genPdf: () => {
    if (!!Session.get('gopdf')) {
      let res = ReactiveMethod.call('getPdf', Session.get('gopdf'));
      if (!!res) {
        window.location = '/' + res;
        //  window.open(res, '_blank');
      }
    }
  },
  getPrice: id => {
    let missId = location.href.split('/')[5];

    let sum = _.findWhere(Missions.findOne(missId).pattern, {
      hid: id
    }).price;
    return sum;
  },
  jobs: () => {
    let amiss = Session.get('data1');
    let pattern = amiss.pattern
    let job = pattern.map(val => {
      return val.mission;
    });
    //   miss = lodash.unionBy(pattern, 'mission');
    let data = [];
    suits = amiss.suits;
    job = _.uniq(job);
    job.forEach(val => {
      let part = {
        job: val
      };
      part.col = {}

      part.col.f = Cloth.find({
        _id: {
          $in: suits
        },
        job: val,
        sex: {
          $in: ['Femme', 'Indifférent']
        }
      }).fetch();
      part.col.h = Cloth.find({
        _id: {
          $in: suits
        },
        job: val,
        sex: {
          $in: ['Homme', 'Indifférent']
        }
      }).fetch();
      data.push(part);
    });
    console.log(data);
    return data;
    // let pattern = Session.get('pattern');
    // let job = pattern.map(val => {
    //     return val.mission;
    // });
    //  miss = lodash.unionBy(pattern, 'mission');
    // job = _.uniq(job);
    //return miss;
  },
  pay: function () {
    var missId = location.href.split('/')[5];

    var pay = Session.get('pay');
    if (!!pay.action) {
      let sum = _.findWhere(Missions.findOne(missId).pattern, {
        hid: pay.id
      }).price;

      ReactiveMethod.call('Payment.methods.transfer', Meteor.userId(), pay.id, Meteor.userId(), sum, missId)
      sweetAlert('payed');
      let amiss = Missions.findOne(missId);
      if (amiss.hostes.length == amiss.hostesCol) {
        Missions.update(missId, {
          $set: {
            status: 3
          }
        });
      } else {
        Missions.update(missId, {
          $set: {
            status: 33
          }
        });
      }


    }
    return 0;
  },
  btnCicle: () => {
    return Session.get('btn-cicle');
  },
  profInfo: (id) => {
    let profile = Meteor.users.findOne(id).profile;
    //                    <h6>Permis B :{{permB profile.permB}} <br></h6>

    return `<h6>Nom : ` + profile.firstname + ' ' + profile.name + ` </h6>
                    <h6>Genre : (` + profile.sex + `) </h6> 
                    <h6>Age : ` + profile.age + ` </h6>
                    <h6>Tel : ` + profile.phone + ` | Mail : ` + profile.email + `</h6>
                    <h6>Adresse : ` + profile.address + `</h6>
                    <h6>Ville et ZIP : ` + profile.city + ` ` + profile.zip + `</h6>
                    <h6>Voiture :` + profile.car + ` | Scooter :` + profile.scooter + `</h6>
                    <h6>Taille : ` + profile.height + `</h6>
                    <h6>Niveau d'étude : ` + profile.studdyLevel + `</h6>
                    <h6>Anglais : ` + profile.engLevel + ` Autre : ` + profile.anlang2 + `</h6>
                    <h6>Expérience 1 :` + profile.experience + `</h6>
                    <h6>Expérience 2 :` + profile.experience2 + `</h6>
                    <h6>Expérience 3 :` + profile.experience3 + `</h6>
                    <h6>comment nous avez-vous connu ?: ` + profile.comment2 + `</h6>
                    <h6>D'une autre façon ? : ` + profile.comment + `</h6> `
  },
  hostExist: (val) => {
    console.log(val);
    if (val.pre.length > 0 || val.hote.length > 0) return true;
    return false;
  },
  controls: (id) => {
    let amiss = Session.get('data1');
    let dateD = _.where(amiss.preHostes, {
      id: id
    });
    console.log(dateD[0].date);
    if (amiss.mtype !== 'EXPRESS') {
      return '<button class="btn btn-success add-user" id="' + id + '-' + dateD[0].date + '-'+dateD[0].mission+'-'+dateD[0].pid+'" >Confirm</button> <button class="del-user btn btn-warning" id="' + id + '">Decline</button>'
    }
    return '';
  },
  date: (v) => {
    return translate(moment(new Date(v)).locale('en').format("dddd Do MMM YY"));
  },
  userName: (id) => {
    return Meteor.users.findOne(id).profile.firstname + ' ' + Meteor.users.findOne(id).profile.name;
  },
  status: () => {
    var miss = Session.get('data1');
    let status = {};
    if (miss.status == 1) {
      status.text = 'Nous recherchons actuellement des profils disponibles pour votre mission. Vous recevrez un email lorsque les Manners se seront inscrits';
      status.class = 'banner_status bg_orange';
    } else if (miss.status == 2) {
      status.text = 'Votre mission est validée mais elle n\'est pas encore payée. Pensez à regulariser votre situation. <a class="btn icon-btn btn-warning adbtn-radius pay-btn" id="payBtn"><span class="glyphicon btn-glyphicon glyphicon-level-up img-circle text-warning"></span>Payer la mission</a>';
      status.class = 'banner_status bg_red';
      ///status.class = 'waiting_paid_popup bg_red';
    } else if (miss.status == 3) {
      status.text = 'Votre mission est validée et payée';
      //status.class = 'waiting_profiles_popup';
      status.class = 'banner_status bg_green';
    } 
    else if (miss.status == 30) {
      status.text = 'Votre mission est validée mais n’est pas encore payée, Pensez à régulariser votre situation';
      //status.class = 'waiting_profiles_popup';
      status.class = 'banner_status bg_blue';
    }
     else if (miss.status == 330) {
      status.text = ' Votre mission est validée et pré-payée.';
      //status.class = 'waiting_profiles_popup';
      status.class = 'banner_status bg_green';
    }
    else if (miss.status == 4) {
      status.text = 'Confirmé & payé';
      //status.class = 'waiting_profiles_popup';
      status.class = 'banner_status bg_green';
    } else if (miss.status == 5) {
      status.text = 'Confirmé & passé';
      //status.class = 'waiting_profiles_popup';
      status.class = 'banner_status bg_green';
    }
    //
    return status;

  },
  authCheck: () => {
    if (!Meteor.userId()) {
      sweetAlert({
        title: "Accès refusé",
        text: "Vous n'avez pas accès à cette page"
      }, () => {
        Router.go('/accueil');
      });
      return false;
    }

    var user = Meteor.user();
    if (user.profile.type === 'host') {
      sweetAlert({
        title: "Accès refusé",
        text: "Vous n'avez pas accès à cette page"
      }, () => {
        Router.go('/accueil');
      });
      return false;

    }
    return true;
  },
  miss: () => {
    return Session.get('data1');
  },
  favorites: (id) => {
    return Meteor.users.findOne(id).profile.favorites.length;
  },
  vipSt: () => {
    let user = Meteor.user();
    var amiss = Session.get('data1');
    user = user.profile;

    if (user.hasOwnProperty('favorite')) {
      return user.favorite
    }

    if (amiss.status == 2) {
      return false;
    }
    return true;
  },
  homme: () => {
    //var amiss = Session.get('data1');
    // var suitId = Cloth.find({
    //     mid: amiss._id,
    //     sex: {
    //         $in: ['Homme', 'Indifférent']
    //     }
    // }, {
    //     fields: {
    //         'suit_id': 1,
    //         'info': 1
    //     }
    // }).fetch();
    // var info = suitId.map((v, i) => {
    //     return v.info;
    // });
    // suitId = suitId.map((v, i) => {
    //     return v.suit_id;
    // });
    // var data = Suits.find({
    //     "_id": {
    //         $in: suitId
    //     }
    // }).fetch();
    // console.log('cloth',data);
    // data = data.map((v, i) => {
    //     v.info = info[i];
    //     return v;
    // });
    //  return data;

    var amiss = Session.get('data1');
    var suits = amiss.suits;
    return Cloth.find({
      _id: {
        $in: suits
      },
      sex: {
        $in: ['Homme', 'Indifférent']
      }
    });
    // suitId = suitId.map((v, i) => {
    //     return v.suit_id;
    // });
    // return Suits.find({
    //     "_id": {
    //         $in: suitId
    //     }
    // });
  },
  femme: () => {
    var amiss = Session.get('data1');
    var suits = amiss.suits;
    return Cloth.find({
      _id: {
        $in: suits
      },
      sex: {
        $in: ['Femme', 'Indifférent']
      }
    }, {
      // fields: {
      //     'suit_id': 1
      // }
    });
    // suitId = suitId.map((v, i) => {
    //     return v.suit_id;
    // });
    // return Suits.find({
    //     "_id": {
    //         $in: suitId
    //     }
    // });
  },
  posts: () => {
    return Session.get('data');
  }
});
