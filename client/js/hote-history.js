Template.HoteHistory.onCreated(() => {
  Session.setDefault('historyD', new Date());
  Session.setDefault('clM', '');
});


var localMiss = () => {
  Session.set('history-payed', 0);

  let miss = Missions.find({
    'hostes.id': Meteor.userId(),
    $or: [{
      status: 4
    }, {
      status: 5
    }]
  }).fetch();
  console.log('local', miss);
  miss = miss.map((val, i) => {
    val.Tag = val._id;
    val.CreationDate = new Date(val.createdAt).getTime() / 1000;
    val.Mission = val.name;
    val.count=i;

    return val;
  });
  return miss;
}


Template.HoteHistory.helpers({
  tab: () => {
    return Iron.Location.get().path.split('/').length > 3;
  },
  dateConv: (date) => {
    return translate(moment(new Date(date * 1000)).locale('en').format("dddd Do MMM YY"));
  },
  genPdf: () => {
    if (!!Session.get('gopdf')) {
      let res = ReactiveMethod.call('getPdf', Session.get('gopdf'));
      if (!!res) {
        window.location = '/' + res;
      }
    }

    // return '';
  },
  rating: () => {
    let rating = Recomendations.find({
      user: Meteor.userId()
    }).fetch();
    rating = rating.map(val => val.rating);
    let dev = rating.length;
    rating = rating.reduce(function (a, b) {
      return a + b;
    });
    rating = rating / dev;
    return parseFloat(rating);
  },
  ratingM: () => {
    let rating = Recomendations.find({
      user: Meteor.userId(),
      "$where": "this.createdAt.getMonth() === " + Session.get('historyD').getMonth()
    }).fetch();
    if (rating.length==0) return 0;
    rating = rating.map(val => val.rating);
    let dev = rating.length;
    rating = rating.reduce(function (a, b) {
      return a + b;
    });
    rating = rating / dev;
    return parseFloat(rating)||0;
  },
  job: id => {
    let job = Missions.findOne(id).hostes;
    job = _.findWhere(job, {
      id: Meteor.userId()
    });
    return job[0].mission;
  },
  fee: id => {
    let fee = .20 * Missions.findOne(id).price;
    return fee;
  },
  fullPrice: id => {
    let price = Missions.findOne(id).price;
    let fee = .20 * Missions.findOne(id).price;
    return fee + price;
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
    if (user.profile.type === 'client') {
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
  myCompany: () => {
    return Companies.findOne({
      users: {
        $in: [Meteor.userId()]
      }
    }).name;
  },
  place: (mid) => {
    if (!!mid) {
      return Missions.findOne(mid).address || 'No place';
    }
    return 'No place';
  },
  getPrice: price => {
    return price / 100;
  },
  price: (mid) => {
    if (!!mid) {
      return Missions.findOne(mid).price || 0;
    }
    return 0;
  },
  duration: (mid) => {
    if (!!mid) {
      return Missions.findOne(mid).duration || 'No duraion';
    }
    return 'No duraion';
  },
  service: (mid) => {
    if (!!mid) {
      return Missions.findOne(mid).pattern[0].mission || 'No service';
    }
    return 'No service';
  },
  client: (mid) => {
    if (!!mid) {
      var creator = Missions.findOne(mid).creator;
       return ReactiveMethod.call('getCl',creator); //Meteor.call('getCl', creator);
    }
    return 'No client';
  },
  hisFS: month => {
    month = parseInt(month);
    return month === new Date().getMonth();
  },
  transacts: () => {
    return localMiss();
    // var trans = [];//ReactiveMethod.call('Payment.methods.getTransactions', Meteor.userId());
    // if (trans == undefined || trans.length == 0) {
    //     return localMiss();
    // }
    // let filDate = Session.get('historyD').getDate();
    // var filMonth = Session.get('historyD').getMonth();
    // var filYear = Session.get('historyD').getYear();
    // var i = 0;
    // trans = trans.map((val) => {
    //     i+=1;
    //     var transDate = new Date((val.CreationDate * 1000)).getDate();
    //     var transMonth = new Date((val.CreationDate * 1000)).getMonth();
    //     var transYear = new Date((val.CreationDate * 1000)).getYear();
    //     if (Session.get('historyD').getMonth() !== new Date((val.CreationDate * 1000)).getMonth()) {
    //         return null;
    //     }
    //     if (!!val.Tag && Missions.findOne(val.Tag).status === 4 || Missions.findOne(val.Tag).status === 5) {
    //         val.Mission = Missions.findOne(val.Tag).name;
    //         val.count=i;
    //     } else {
    //         return null;
    //     }
    //     return val;
    // });
    // trans = trans.clean(undefined);
    // return trans.clean(undefined) || localMiss();

  }
});


Template.HoteHistory.events({
  "change #historyF": (e) => {
    let date = Session.get('historyD').setMonth(parseInt(e.target.value));
    Session.set('historyD', new Date(date));

  },
  "click .download_btn": (e) => {
    if (!!e.target.id.split('-')[1]) {
      Session.set('gopdf', e.target.id.split('-')[1]);
    } else {
      swal("Vous n'avez pas encore effectué de transaction")
    }
  }
});
