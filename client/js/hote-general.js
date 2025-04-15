Array.prototype.clean = function (deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};


Template.HoteGeneral.onCreated(() => {
  Session.setDefault('gdata', []);
  Session.setDefault('gids', []);
  Session.setDefault('inscribed', []);

  var interval = Meteor.setInterval(function () {
    var mainData = [];
    var data = [];
    var usrs = [];
    var miss;
    if (location.href.split('/')[5]) {
      var miss = Missions.findOne({
        _id: location.href.split('/')[5]
      });
      Session.set('amiss', miss);

      if (!miss) return;
      var mislen = miss.pattern.map(function (v, p, i) {
        return p;
        // if (!!i[p - 1] && new Date(v.date).getTime() !== new Date(i[p - 1].date).getTime()) return p;
      });
      mislen = mislen.clean(undefined);
      newPatern = [];
      if (mislen.length == 0) {
        mislen.push(0);
      }

      mislen.forEach((v, i) => {
        // miss.pattern.slice((mislen[i-1]), v);
        newPatern.push({
          data: miss.pattern[v],
          col: miss.pattern.slice(mislen[i], mislen[i + 1]).length,
          price: miss.price
        });
      });
      var tblFill = [];
      newPatern.forEach((v, pi) => {
        let date = new Date(v.data.date).getTime();
        let now = new Date().getTime();
        // if ((date - now) <= 0) return;
        mainData[pi] = {};
        mainData[pi].data = [];
        mainData[pi].hostesCol = v.col;
        mainData[pi].name = v.data.name;
        mainData[pi].price = v.data.price;
        mainData[pi].mission = v.data.mission;
        mainData[pi].beginsTo = v.data.start;
        mainData[pi].endsTo = v.data.finish;
        mainData[pi].id = v.data.id;
        mainData[pi].hid = v.data.hid;
        mainData[pi]._id = miss._id;

        mainData[pi].date = new Date(v.data.date).getTime();
        miss.preHostes.forEach((val, i) => {
          var usr = Meteor.users.findOne({
            _id: val.id
          });
          var miscol = Missions.find({
            preHostes2: {
              $in: [val.id]
            }
          }).count();
          if (parseInt(val.date) === new Date(v.data.date).getTime()) {
            if (mainData[pi].data.length == 0 && !!usr.profile) {
              var pass = usr.profile.firstname + ' ' + usr.profile.name[0].toUpperCase();
              if (tblFill.indexOf(pass) < 0) {
                mainData[pi].data[i] = {};
                mainData[pi].data[i].username = pass;
                mainData[pi].data[i].photo = usr.profile.photo;
                mainData[pi].data[i].miscol = miscol;
                mainData[pi].data[i].favorites = usr.profile.favorites.length;
                tblFill.push(pass);
              }

            }

          }

        });

      });

    } else {
      return [];
    }



    Session.set('gdata', mainData.sort(() => {
      return -1;
    }));
  }, 1000);


});


Template.HoteGeneral.helpers({
  status: () => {
    var miss = Session.get('amiss');
    let status = {};
    if (miss.status == 1) {
      if (!!_.findWhere(miss.preHostes, {
          id: Meteor.userId()
        })) {
        status.text = 'En attente de la selection';
        status.class = 'banner_status bg_d_orange';
      } 
      // else if (!!_.findWhere(miss.preHostes2, {
      //     id: Meteor.userId()
      //   }) || !!_.findWhere(miss.hostes, {
      //     id: Meteor.userId()
      //   })) {
      //   status.text = 'Vous avez été selectionné pour cette mission';
      //   status.class = 'banner_status bg_green';
      // }
      
       else {
        status.text = 'Mission ouverte aux inscriptions';
        status.class = 'banner_status bg_orange';
      }


    } else if (miss.status == 2) {

      if (!_.findWhere(miss.preHostes, {
          id: Meteor.userId()
        })) {
        status.text = "Votre profile n'a pas été selectionné pour cette mission";
        status.class = 'banner_status bg_red';
      } else {
        status.text = 'En attente de la selection';
        status.class = 'banner_status bg_orange';
      }

    } 
     else if (miss.status == 330) {
      //Vous avez effectué cette mission
      status.text = 'payment pending...';
      status.class = 'banner_status bg_green';
    }
    else if (miss.status == 3 || miss.status == 30) {
      //Vous avez effectué cette mission
      status.text = 'Vous avez été selectionné pour cette mission';
      status.class = 'banner_status bg_green';
    }
    // else if (miss.status == 30) {
    //   status.text = 'Votre mission est validée mais n’est pas encore payée, Pensez à régulariser votre situation';
    //   //status.class = 'waiting_profiles_popup';
    //   status.class = 'banner_status bg_blue';
    // } 
    else if (miss.status == 33) {
      //Vous avez effectué cette mission
      status.text = "Votre profile n'a pas été selectionné pour cette mission";
      status.class = 'banner_status bg_red';
    } else if (miss.status == 4) {
      //Vous avez effectué cette mission
      status.text = 'En attente du paiement de la mission';
      status.class = 'banner_status bg_orange';
    } else if (miss.status == 5) {
      //Vous avez effectué cette mission
      status.text = 'Cette mission est terminée et vous avez été payé';
      status.class = 'banner_status bg_green';
    }
    return status;

  },
  iu: (hid, id, job) => {
    console.log('hid',hid,id);
    let amiss = Session.get('amiss')._id;
    amiss = Missions.findOne(amiss);
    // .map((v) => {
    //     return {
    //         hid: v.hid
    //     };
    // });
    // if (!!_.findWhere(amiss, {
    //         hid: hd
    //     }) )
    if (hid===Meteor.userId()) return true;
    else return false;
    // let res = _.where(amiss.preHostes, {
    //   hid: hid,
    //   id:id
    // });
    // if (!!res && res.length > 0) {
    //   amiss = amiss.pattern;
    //   //add if job===cur.job 
    //   //console.log('job', job);
    //   //!!amiss[id].hid && amiss[id].hid === hid&&
    //   let ansv = false;
    //   res.forEach(val => {
    //     if (!!amiss[id].hid && amiss[id].hid === hid&&amiss[id].id === id) ansv = true;
    //   });
    //   return ansv;

    //   /// if (amiss[id].mission === res.mission) return true;
    // } else {
    //   return false;
    // }
  },
  date1: (v) => {
    return translate(moment(new Date(v)).locale('en').format("dddd Do MMM YY"));
  },
  inscribed: (hid, id, date) => {
    let amiss = Session.get('amiss')._id;
    let hostes = Missions.findOne(amiss).hostes;
    if (!!_.findWhere(hostes, {
        id: hid
      }) && !!_.findWhere(hostes, {
        pid: id.toString()
      })) {
      //      setTimeout(() => {
      //     $('.banner_status').css('background-color', '#ff9966');
      //     document.querySelector('.banner_status').innerHTML = "Selected";
      // }, 1000);
      return '<button class="btn alert-button button-colored" id="miss-' + date + '">Selectionné</button>';
    } else {
      // setTimeout(() => {
      //     if (document.querySelector('.banner_status').innerHTML!=="Selected") {
      //          $('.banner_status').css('background-color', '#fbae17');
      //     document.querySelector('.banner_status').innerHTML = "En attente de la selection";
      //     }

      // }, 1000);
      return '<button class="btn cancel_order_btn button-colored" id="miss-' + date + '">Se désinscrire</button>';
    }
  },
  inscId: (hid, id) => {
    let amiss = Session.get('amiss')._id;
    amiss = Missions.findOne(amiss);
    // .map((v) => {
    //     return {
    //         hid: v.hid
    //     };
    // });
    // if (!!_.findWhere(amiss, {
    //         hid: hd
    //     }) )
    let res = _.where(amiss.preHostes, {
      id: Meteor.userId()
    });
    if (!!res) {
      amiss = amiss.pattern;
      //add if job===cur.job 
      //console.log('job', job);
      //!!amiss[id].hid && amiss[id].hid === hid&&
      let ansv = false;
      res.forEach(val => {
        if (!!amiss[id].hid && amiss[id].hid === hid) ansv = true;
      });
      return ansv;
      /// if (amiss[id].mission === res.mission) return true;
    } else {
      return 0;
    }
  },
  ac: () => {
    if (!Meteor.userId()) {
      return false;
    }
    let id = location.href.split('/')[5];
    var user = Meteor.user();

    if (!!id && Meteor.userId() === id) {
      return true;
    }
    return false;
  },
  homme: () => {
    var amiss = Session.get('amiss');

    if (!amiss) return false;
    var suitId = Cloth.find({
      mid: amiss._id,
      sex: {
        $in: ['Homme', 'Indifférent']
      }
    }, {
      fields: {
        'suit_id': 1
      }
    }).fetch();
    suitId = suitId.map((v, i) => {
      return v.suit_id;
    });
    return Suits.find({
      "_id": {
        $in: suitId
      }
    });
  },
  femme: () => {
    var amiss = Session.get('amiss');
    if (!amiss) return false;
    var suitId = Cloth.find({
      mid: amiss._id,
      sex: {
        $in: ['Femme', 'Indifférent']
      }
    }, {
      fields: {
        'suit_id': 1
      }
    }).fetch();
    suitId = suitId.map((v, i) => {
      return v.suit_id;
    });
    return Suits.find({
      "_id": {
        $in: suitId
      }
    });
  },
  missions: () => {
    return Session.get('gdata');
  },
  miss: () => {
    // var miss = Missions.findOne({users:{$in:[Meteor.userId()]}});
    return Session.get('amiss');
  },
  image: (val) => {
    return (!!val) ? val.url() : '/images/user_photo_small.jpg';
  }
});

Template.HoteGeneral.onRendered((v) => {
  var mapInit = Meteor.setInterval(() => {
    var miss = Session.get('amiss');
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
        var map = new google.maps.Map(document.getElementById('map'), {
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
    Meteor.clearInterval(mapInit);
  }, 600);

  var images = document.getElementsByClassName("crop-photo");
  var arr = [];
  for (var i = 0; i < images.length; i++) {
    arr.push({
      image: images[i].childNodes[0],
      loaded: false
    });
  }

  for (var j = 0; j < arr.length; j++) {
    var image = arr[j];
    arr[j].image.onload = () => {
      image.width = image.image.naturalWidth;
      image.height = image.image.naturalHeight;
      if (image.width > image.height) {
        image.image.classList.add("paysage");
        image.image.parentElement.classList.add("paysage");
      }
      if (image.width < image.height) {
        image.image.classList.add("portrait");
        image.image.parentElement.classList.add("portrait");
      }
    };

  }

  document.getElementById("header-img").onload = () => {
    document.getElementById("header-img").width = document.getElementById("header-img").naturalWidth;
    document.getElementById("header-img").height = document.getElementById("header-img").naturalHeight;
    if (document.getElementById("header-img").width > document.getElementById("header-img").height) {
      document.getElementById("header-img").classList.add("paysage");
      document.getElementById("header-img").parentElement.classList.add("paysage");
    }
    if (image.width < image.height) {
      document.getElementById("header-img").classList.add("portrait");
      document.getElementById("header-img").parentElement.classList.add("portrait");
    }
  };


});

Template.HoteGeneral.events({
  "click .alert-button": (e) => {
    let miss = Session.get('amiss');
    swal('Vous êtes bien inscrits pour la mission '+miss.name);
  },
  "click .cancel_order_btn": (e) => {
    var id = location.href.split('/')[5];
    var date = e.target.id.split('-')[1];
    var miss = Session.get('amiss');
    var calc = moment() < moment(miss.startDate).subtract(2, 'day');
    if (!calc) {
      sweetAlert("Vous ne pouvez plus vous désinscrire car la mission est sur le point de commencer." + " Contactez-nous par mail ou par téléphone. ");
      return false;
    }
    Missions.update({
      _id: id
    }, {
      $pull: {
        preHostes: {
          id: Meteor.userId(),
          date: date
        }
      }
    }, {
      multi: true
    });
    let user = Meteor.users.findOne(id);
    Meteor.call('sendEmailCli',
      id,
      'julie@bemanners.com',
      'Rendez-vous confirmé',
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
                    Hello ` + user.profile.firstname + ` ` + user.profile.name + `<br>

Nous avons bien pris en compte ta demande de désinscription pour la mission ` + miss.name + `.<br>
<br>
<br>
Have a good day,<br>
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

</html>`);
  },
  "click .order_btn": (e) => {
    e.preventDefault();
    var date = e.target.id.split('-')[1];
    var job = e.target.id.split('-')[2];
    var pid = parseInt(e.target.id.split('-')[3]);
    var start = e.target.id.split('-')[4];
    var finish = e.target.id.split('-')[5];
    var id = location.href.split('/')[5];
    var match = Missions.find({
      hostes: {
        $elemMatch: {
          date: date.toString(),
          id: Meteor.userId()
        }
      }
    }).fetch();
    if (match.length !== 0) {
      sweetAlert('You are already on another mission at this date');
      return false;
    }

    var miss = Missions.findOne({
      _id: id
    });
    if (0) { // if (miss.hostes.length > miss.hostesCol) {
      Meteor.call('sendEmailCli',
        miss.creator,
        'julie@bemanners.com',
        'Julie de manners | ',
        `Bonjour [prénom],

Nous avons trouvé les  Manners qui correspondent le plus à vos attentes pour la mission suivante :
- nom du client
- nom de la mission
- date de la mission

Vous pouvez accéder aux profils en cliquant ici :
<a href="http://bemanners.com/client/mes-missions">Valider la mission</a>


Merci,
L’équipe Manners
`);
      let user = Meteor.users.findOne(miss.creator);
      let temp = '';
      miss.hostes.forEach(v => {
        if (!v.id) return false;
        let host = Meteor.users.findOne(v.id);
        temp += `<p>- ` + host.profile.firstname + ' ' + host.profile.name + ` </p>
			<p>- ` + miss.name + `</p>
			<p>- ` + miss.beginsTo + `</p>`
      });

      Meteor.call('sendEmailCli',
        miss.creator,
        'julie@bemanners.com',
        'Julie de manners',
        `<!DOCTYPE html>
<html>
<head>
<!-- If you delete this meta tag, Half Life 3 will never be released. -->
<meta name="viewport" content="width=device-width" />

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

<title>Choisir manners - perso</title>

<link rel="stylesheet" type="text/css" href="http://bemanners.com:8888/stylesheets/email.css" />

</head>

<body bgcolor="#FFFFFF" topmargin="0" leftmargin="0" marginheight="0" marginwidth="0">

<img class="logo show-for-small-only" src="http://bemanners.com:8888/img/logo.png" alt="Manners"></a>

			<div class="content">
				<table>
					<tr>
						<td>

							<!-- A Real Hero (and a real human being) -->
			<h6 align="left">Bonjour ` + user.profile.nameManager + ` ` + user.profile.lastNameManager + `</h6>
			<div class="text2">
		<p>Nous avons trouvé plusieurs Manners qui correspondent à vos attentes pour la mission suivante :</p>
			` + temp + `

<p>Vous pouvez désormais sélectionner les profils qui répondent le plus à vos besoins :</p>
<div class="btn">Sélectionner les Manners</div><br><br>


			<p> Merci. </p>
			<p>L'équipe Manners</p>

						</td>
					</tr>
				</table>
			</div>
			<!-- COLUMN WRAP -->
			<div class="divider"></div>

<footer class="footer" style="text-align:center">

                <div class="socialos">
                    <h2></h2> <!-- Réseaux sociaux -->
                    <div class="socials text-center">
                       <a href="https://www.facebook.com/bemanners/?fref=ts"><img src="http://bemanners.com:8888/img/facebook.png" alt=""></a>
                        <a href="https://twitter.com/BeManners"><img src="http://bemanners.com:8888/img/twitter.png" alt=""></a>
                        <a href="https://www.instagram.com/be_manners/"><img src="http://bemanners.com:8888/img/instagram.png" alt=""></a>
                        <a href="#"><img src="http://bemanners.com:8888/img/linkedin.png" alt=""></a>
                    </div>
                </div><br>
                <h4 style="font-weight:500; font-size: 23px;"> Envoyé avec amour par Manners </h4>
                <h6 style="font-weight:900; font-size: 14px; text-transform: uppercase; color:#444;">Préférences d'emails</h6>
</footer>


</body>
</html>
`);
      return false;
    }
    let pattern = Missions.findOne(id).pattern;
   pattern = pattern.map(val => {
      if (val.id == pid) {
        val.hid = Meteor.userId();
      }
      return val;

    });
    Missions.update(id, {
      $set: {
        pattern: pattern
      },
      $push: {
        preHostes: {
          id: Meteor.userId(),
          pid: pid,
          date: date,
          mission: job,
          start: start,
          finish: finish
        }
      }
    });

  }
});
