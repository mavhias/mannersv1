import lodash from 'lodash';

Template.ClientHistory.onCreated(() => {
  Session.set('history-nav', 1);
  Session.set('history-payed', 1);

});

var localMiss = () => {
  Session.set('history-payed', 0);

  let miss = Missions.find({
    creator: Meteor.userId(),
    $or: [{
      status: 4
    }, {
      status: 5
    }]
  }).fetch();
  console.log('local', miss);
  miss = miss.map((val,i) => {
    val.Tag = val._id;
    val.CreationDate = new Date(val.createdAt).getTime() / 1000;
    val.Mission = val.name;
        val.count=i;

    return val;
  });
  return miss;
}

Template.ClientHistory.helpers({
  tab: () => {
    return Iron.Location.get().path.split('/').length > 3;
  },
  place: (mid) => {
    if (!!mid) {
      return Missions.findOne(mid).address;
    }
    return 'No place';
  },
  // genPdf: () => {
  //   if (!!Session.get('gopdf')) {
  //     let res = ReactiveMethod.call('getPdf', Session.get('gopdf'));
  //     if (!!res) {
  //       window.location = res;
  //     }
  //   }

  //   // return '';
  // },
  months: (mid) => {
    if (!!mid) {
      var dur = Missions.findOne(mid).duration.split(' ')[0];
      dur = parseInt(dur);
      if (dur > 31) return 2;
      else if (dur > 60) return 3;
      else if (dur > 120) return 4;
      else return 1;
    }
    return 'No months';
  },
  price: (mid) => {
    if (!!mid) {
      return Missions.findOne(mid).price || 13;
    }
    return 13;
  },
  statusC: (mid) => {
    var status = Missions.findOne(mid).status;
    if (status == 4) {
      return 'bg_orange';
    } else if (status == 5) {
      return 'green';
    }
  },
  status: (mid) => {
    if (!!mid) {

      var status = Missions.findOne(mid).status;
      if (status == 4) {
        // if (Session.get('history-payed')==0) {
        //     status = {
        //   num: 4,
        //   color: 'light_green',
        //   text: 'Archivée mais non payée' //    text: 'Validée <br>En attente de paiement'
        // };
        //     } else {
        status = {
          num: 4,
          color: 'bg_orange',
          text: 'Awaiting payment' //    text: 'Validée <br>En attente de paiement'
        };
        // }

      } else if (status == 5) {
        status = {
          num: 5,
          color: 'green',
          text: 'Terminée'
        };
      }
    }
    return status.text;
  },
  dateConv: (date) => {
    return translate(moment(new Date(date * 1000)).locale('en').format("dddd Do MMM YY"));
  },
  duration: (mid) => {
    if (!!mid) {
      return Missions.findOne(mid).duration;
    }
    return 'No duraion';
  },
  hostesCol: (mid) => {
    if (!!mid) {
      return Missions.findOne(mid).hostesCol;
    }
    return 'No col';
  },
  genPdf: () => {
    if (!!Session.get('gopdf')) {
      let res = ReactiveMethod.call('getPdf', Session.get('gopdf'));
      if (!!res) {
        window.location = '/' + res;
      }
    }
  },
  transacts: () => {
    var trans = [];//ReactiveMethod.call('Payment.methods.getTransactions', Meteor.userId());
    if (trans == undefined ||trans.length==0) return localMiss();
    let newTr = [];
    newTr = trans.map((val) => {
      if (!!val.Tag) {
        let miss = Missions.findOne(val.Tag);
        if (!!!miss||miss.length==0) return undefined;
        if (miss.status == 4 || miss.status == 5) {
          let success = _.findWhere(trans, {
            Tag: val.Tag,
            Status: 'SUCCEEDED'
          });
          if (success.length>0) {
            val = success[0];
          }
          val.Mission = miss.name;
        } else {
          return undefined;
        }
      } else {
        return undefined;
      }
      return val;
    });

    newTr = newTr.clean(undefined);

    if (newTr.length == 0) {
      console.log(newTr);
      return localMiss();
    }
    return lodash.unionBy(newTr, 'Tag');
  },
  authCheck: () => {
    if (!Meteor.userId()) {
      sweetAlert({
        title: "Désolé !",
        text: "Vous n'avez pas accès à cette page"
      }, () => {
        Router.go('/accueilhote');
      });
      return false;
    }

    var user = Meteor.user();
    if (user.profile.type === 'host') {
      sweetAlert({
        title: "Désolé !",
        text: "Vous n'avez pas accès à cette page"
      }, () => {
        Router.go('/accueilhote');
      });
      return false;

    }
    return true;
  },
  nav: (val) => {
    return val === Session.get('history-nav');
  }

});

Template.ClientHistory.onRendered(() => {
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
        if (image.width > 2 * image.height) {
          image.image.classList.remove("paysage");
          image.image.classList.add("paysage-2");
        }
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
Template.ClientHistory.events({
    'click .table_pointer': (e) => {
    let id = (!!e.target.parentNode.id) ? e.target.parentNode.id.split('-')[1] : e.target.parentNode.parentNode.id.split('-')[1];
    Router.go('/client/mes-missions/' + id);
  },
  "click .download_btn": (e) => {

    let data = {
      mid: e.target.id.split('-')[1],
      execD: e.target.id.split('-')[2],
      user: e.target.id.split('-')[3],
      op: 'Facture',
      facture: e.target.id.split('-')[4]
    };
    Session.set('gopdf', data);
  },
  "click .nav": (e) => {
    Session.set('history-nav', parseInt(e.target.id.split('-')[1]));
  },
});
