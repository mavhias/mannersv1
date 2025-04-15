var getMiss = () => {
  let lm = Session.get('miss-lm');
  var id = Companies.findOne({
    users: {
      $in: [Meteor.userId()]
    }
  })
  if (!id) {
    return false;
  }
  id = id._id;
  var miss = Missions.find({
    company: id,
    $nor: [{
      status: 4
    }, {
      status: 5
    }]
  }, {
    limit: 10,
    skip: lm,
    sort: {
      createdAt: -1,
    }
  }).fetch();

  miss.forEach((v, i) => {
    miss[i].startDate = translate(moment(v.startDate).locale('en').format("dddd Do MMM YY"));
    var times = [];
    if (!v.pattern) return false;

    v.pattern.forEach((val, i) => {
      times.push(val.start + " - " + val.finish);
    });
    miss[i].times = times[0];

    if (v.status == 1) {
      miss[i].status = {
        num: 1,
        color: 'bg_orange',
        text: 'En recherche'
      };
    } else if (v.status == 2) {
      miss[i].status = {
        num: 2,
        color: 'bg_red',
        text: 'En attente <br>de validation'
      };
    } else if (v.status == 3) {
      miss[i].status = {
        num: 3,
        color: 'bg_green',
        text: 'Complet' //      text: 'Validée'
      };
    } else if (v.status == 30) {
      miss[i].status = {
        num: 3,
        color: 'bg_green',
        text: 'Validée en attente<br> de paiement' //      text: 'Validée'
      };
    }
     else if (v.status == 33) {
      miss[i].status = {
        num: 3,
        color: 'bg_green',
        text: 'Validée en attente<br> de paiement' //      text: 'Validée'
      };
    }
     else if (v.status == 330) {
      miss[i].status = {
        num: 3,
        color: 'bg_green',
        text: 'Validée' //      text: 'Validée'
      };
    } else if (v.status == 4) {
      miss[i].status = {
        num: 4,
        color: 'light_green',
        text: 'En cours' //    text: 'Validée <br>En attente de paiement'
      };
    } else if (v.status == 5) {
      miss[i].status = {
        num: 5,
        color: 'bg_green',
        text: 'Terminée'
      };
    }

  });
  Session.set('my-miss', miss);

};

Template.ClientMission.helpers({
  usrPage: () => {
    let missU = Missions.find({
      creator: Meteor.userId()
    }).count();
    return _.range(missU / 10);
  },
  missPage: () => {
    var id = Companies.findOne({
      users: {
        $in: [Meteor.userId()]
      }
    })
    if (!id) {
      return false;
    }
    id = id._id;
    let col = Missions.find({
      company: id
    }, {
      sort: {
        startDate: 1
      }
    }).count();
    return _.range(col / 10);
  },
  plusone: (val) => {
    return val + 1;
  },
  missions: () => {
    getMiss();
    return Session.get('my-miss');
  }
});
Template.ClientMission.events({
  "click .lm": (e) => {
    lm = e.target.id.split('-')[1];
    Session.set('miss-lm', lm * 10);
  },
  "click #nouvelle-mission": function (event, template) {
    Router.go('/nouvelle-mission/1');
  },
  'click .table_pointer': (e) => {
    let id = (!!e.target.parentNode.id) ? e.target.parentNode.id.split('-')[1] : e.target.parentNode.parentNode.id.split('-')[1];
    Router.go('/client/mes-missions/' + id);
  }
});
