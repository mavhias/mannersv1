Template.HoteMission.onCreated(() => {
  Session.set('user-exist', 0);
  Session.set('host-seek', 0);
  Session.set('host-seek-a', 0);


});

Template.HoteMission.helpers({
  authCheck: () => {
    if (!Meteor.userId()) {
      sweetAlert({
        title: "Access",
        text: "Vous n'avez pas accès à cette page"
      }, () => {
        Router.go('/');
      });
      return false;
    }

    var user = Meteor.user();
    if (user.profile.type === 'client') {
      sweetAlert({
        title: "Access",
        text: "Vous n'avez pas accès à cette page"
      }, () => {
        Router.go('/');
      });
      return false;

    }
    return true;
  },
  heard: () => {
    return Meteor.user().profile.favorites.length;
  },
  usrCount: () => {
    // if (Meteor.users.find({}).count() > 1) return true;

    var data = Missions.find().count();
    if (data > 15) return true;
    return false;
  },
  plusone: (val) => {
    return val + 1;
  },
  usrPageApr: () => {
    var data = Missions.find({
      $or: [{
        'preHostes.id': Meteor.userId()
      }, {
        'preHostes2.id': Meteor.userId()
      }]
    }).count();
    return _.range(data / 15);
  },
  usrPage: () => {
    // let missU = Missions.find({
    //     creator: Meteor.userId()
    // }).fetch();
    // let missUA = missU.map(val => {
    //     return val.hostes
    // });
    // missUA = _.union(missUA);
    var data = Missions.find({}, {}).count();
    return _.range(data / 15);
  },
  comments: () => {
    return Comments.find({
      user: Meteor.userId()
    }).count();
  },
  missCol: () => {
    return Missions.find({
      'preHostes.id': Meteor.userId()
    }).count();
  },
  registered: () => {
    return translate(moment(Meteor.user().profile.createdAt).locale('en').format("dddd Do MMM YY"));
  },
  star: (val, val2) => {
    if (val2 < val) return true;
    if (val2 > val) return false;
    return val === val2;
  },
  rating: () => {
    var rec = Recomendations.findOne({
      user: Meteor.userId()
    });
    if (rec) {
      rec = rec.rating;
    }

    return rec || 0;
  },
  client: (v) => {
    let cli = Companies.findOne({
      _id: v
    });
    if (!cli) return '';
    return cli.name
  },
  missionsApr: () => {

    let lma = Session.get('host-seek-a');
    var miss = Missions.find({
      $nor: [{
        status: 4
      }, {
        status: 5
      }]
    }, {
      sort: {
        startDate: 1
      },
      limit: 15,
      skip: lma
    }).fetch();
    // var miss = Missions.find({}, {
    //   sort: {
    //     startDate: 1
    //   }
    // }).fetch();
    miss = miss.map((v, i) => {
      miss[i].startDate = translate(moment(v.startDate).locale('en').format("dddd Do MMM YY"));

      if (v.status == 1) {
        if (!!_.findWhere(miss[i].preHostes, {
            id: Meteor.userId()
          })) {
          miss[i].status = {
            num: 1,
            color: 'bg_d_orange',
            text: "En attente"
          };
        } else {
          miss[i].status = {
            num: 1,
            color: 'bg_orange',
            text: "S'inscrire"
          };
        }


      } else if (v.status == 2) {
        if (!_.findWhere(miss[i].preHostes, {
            id: Meteor.userId()
          })) {
          miss[i].status = {
            num: 2,
            color: 'bg_red',
            text: 'Non selectionné'
          };
        } else {
          miss[i].status = {
            num: 2,
            color: 'bg_red',
            text: 'En attente'
          };
        }



      }
       else if (v.status == 330) {
        miss[i].status = {
          num: 3,
          color: 'bg_green',
          text: 'payment pending..' //      text: 'Validée'
        };
      }
      
       else if (v.status == 3) {
        miss[i].status = {
          num: 3,
          color: 'bg_green',
          text: 'Selectionné' //      text: 'Validée'
        };
      } else if (v.status == 33) {
        miss[i].status = {
          num: 3,
          color: 'bg_red',
          text: 'Non selectionné' //      text: 'Validée'
        };
      } else if (v.status == 4) {
        miss[i].status = {
          num: 4,
          color: 'bg_orange',
          text: 'En attente du paiement' //    text: 'Validée <br>En attente de paiement'
        };

      } else if (v.status == 5) {
        miss[i].status = {
          num: 5,
          color: 'bg_green',
          text: 'Payé'
        };
      }
      if (_.findWhere(v.preHostes2, {
          id: Meteor.userId()
        }) || _.findWhere(v.preHostes, {
          id: Meteor.userId()
        })) {
        return v;
      }
    });
    miss = miss.clean(undefined);
    return miss;
  },
  missions: () => {
    let lm = Session.get('host-seek');
    var miss = Missions.find({
        $nor: [{
        status: 4
      }, {
        status: 5
      }]
    }, {
      sort: {
        startDate: 1
      },
      limit: 15,
      skip: lm
    }).fetch();
    var data = {
      approved: [],
      rest: []
    };

    miss.forEach((v, i) => {

      miss[i].startDate = translate(moment(v.startDate).locale('en').format("dddd Do MMM YY"));
      if (v.status == 1) {
        if (!!_.findWhere(miss[i].preHostes, {
            id: Meteor.userId()
          })) {
          miss[i].status = {
            num: 1,
            color: 'bg_d_orange',
            text: "En attente"
          };
        } else {
          miss[i].status = {
            num: 1,
            color: 'bg_orange',
            text: "S'inscrire"
          };
        }


      } else if (v.status == 2) {
        if (!_.findWhere(miss[i].preHostes, {
            id: Meteor.userId()
          })) {
          miss[i].status = {
            num: 2,
            color: 'bg_red',
            text: 'Non selectionné'
          };
        } else {
          miss[i].status = {
            num: 2,
            color: 'bg_red',
            text: 'En attente'
          };
        }



      } else if (v.status == 3) {
        miss[i].status = {
          num: 3,
          color: 'bg_green',
          text: 'Selectionné' //      text: 'Validée'
        };
      } else if (v.status == 33) {
        miss[i].status = {
          num: 3,
          color: 'bg_red',
          text: 'Non selectionné' //      text: 'Validée'
        };
      } else if (v.status == 4) {
        miss[i].status = {
          num: 4,
          color: 'bg_orange',
          text: 'En attente du paiement' //    text: 'Validée <br>En attente de paiement'
        };

      } else if (v.status == 5) {
        miss[i].status = {
          num: 5,
          color: 'bg_green',
          text: 'Payé'
        };
      }
      if (_.findWhere(v.hostes, {
          id: Meteor.userId()
        })) {
        data.approved.push(miss[i]);
      } else if (_.findWhere(v.preHostes2, {
          id: Meteor.userId()
        }) || _.findWhere(v.preHostes, {
          id: Meteor.userId()
        })) {
        data.approved.push(miss[i]);
      } else {
        data.rest.push(miss[i]);
      }
    });


    return data;
  }
});
Template.HoteMission.events({
  "click .lm": (e) => {
    // var lm = Session.get('rec-lm');
    var lm = e.target.id.split('-')[1];
    Session.set('host-seek', lm * 15);
  },
  "click .lma": (e) => {
    // var lm = Session.get('rec-lm');
    var lma = e.target.id.split('-')[1];
    Session.set('host-seek-a', lma * 15);
  },
  'click .table_pointer': (e) => {
    let id = (!!e.target.parentNode.id) ? e.target.parentNode.id.split('-')[1] : e.target.parentNode.parentNode.id.split('-')[1];
    Router.go('/partenaire/mission/' + id);
  }
});
