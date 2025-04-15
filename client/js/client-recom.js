Template.ClientRecom.onCreated(() => {
  Session.setDefault("recomArr", []);
  Session.setDefault('rec-lm', 0);
  let mlm = 0;
  Session.setDefault('mlm', mlm);
  var mid = Missions.findOne({
    creator: Meteor.userId()
  }, {
    skip: mlm
  });
  if (!!mid) {
    mid = mid._id;
    Session.setDefault('missId', mid);
  }


});

Template.ClientRecom.helpers({
  selectMiss: () => {
    return Missions.find({
      creator: Meteor.userId()
    });
  },
  crop: () => {
    var miss = Missions.findOne({
      creator: Meteor.userId()
    });
    if (!!miss['mtype'] && miss.mtype === "CUSTOM") {
      return 'croped';
    }
    return '';
  },
  missName: () => {
    return Missions.findOne(Session.get('missId')).name;
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
        title: "Désolé !",
        text: "Vous n'avez pas accès à cette page"
      }, () => {
        Router.go('/accueil');
      });
      return false;

    }
    return true;
  },
  isEmpty: () => {
    let missU = Missions.find({
      creator: Meteor.userId()
    }).count();
    if (missU > 0) return false;
    else return true;
  },
  favCount: (v) => {
    var fav = Meteor.users.findOne({
      _id: v
    });
    fav = fav.profile;

    return fav.favorites.length;
  },
  favExist: (v) => {
    var fav = Meteor.users.findOne({
      _id: v
    });
    var data = 'glyphicon glyphicon-heart-empty';
    fav = fav.profile;
    if (fav.hasOwnProperty('favorites')) {
      if (fav.favorites.indexOf(Meteor.userId()) >= 0) {
        data = "glyphicon glyphicon-heart";
      }

    }

    return data;
  },
  exCh: data => {
    if (Array.isArray(data) && data.length > 0)
      return true;
    else return false;
  },
  currentUser1: () => {
    let rating = Recomendations.findOne({
      user: Session.get('recom-current'),
      from: Meteor.userId()
    }).rating;
    return {
      rating: rating,
      _id: Session.get('recom-current')
    };
  },
  exUser: data => {
    if (Array.isArray(data))
      return true;
    else return false;
  },
  missions: (v) => {
    return Missions.find({
      creator: Meteor.userId(),
      hostes: {
        $in: [v]
      }
    }).count();
  },
  mission: () => {
    var data = Missions.findOne();
    return 'Mission: ' + data.name + '  <div class="pull-right">Date: ' + translate(moment(data.startDate).locale('en').format("dddd Do MMM YY")) + '</div>';
  },
  usrCount: () => {
    if (Meteor.users.find({}).count() > 1) return true;
    let missU = Missions.find({
      creator: Meteor.userId()
    }).fetch();
    let missUA = missU.map(val => {
      return val.hostes
    });
    missUA = _.union(missUA);
    var data = Meteor.users.find({
      'profile.type': 'host',
      _id: {
        $in: missUA
      }
    }).fetch();
    if (data > 5) return true;
    return false;
  },
  usrPage: () => {
    let missU = Missions.find({
      creator: Meteor.userId()
    }).fetch();
    let missUA = missU.map(val => {
      return val.hostes
    });
    missUA = _.union(missUA);
    var data = Meteor.users.find({
      'profile.type': 'host',
      _id: {
        $in: missUA
      }
    }).count();
    return _.range(data / 5);
  },
  plusone: (val) => {
    return val + 1;
  },
  users: () => {
    let lm = Session.get('rec-lm');

    // return Meteor.users.find({
    //     'profile.type': 'host'
    // }, {
    //     limit: 5,
    //     skip: lm
    // });

    var rec = Recomendations.find({
      from: Meteor.userId()
    }).fetch();
    // var usr = rec.map((v) => {
    //     return v.user;
    // });


    // let missU = Missions.find({
    //     creator: Meteor.userId()
    // }).fetch();
    // let missUA = missU.map(val => {
    //     return val.hostes
    // });
    // missUA = _.flatten(missUA);
    let missUA = Missions.findOne({
      _id: Session.get('missId'),
      $or: [{
        status: 4
      }, {
        status: 5
      }]
    });
    console.log('misssss', missUA);
    if (!!missUA) {
      missUA = missUA.hostes;
    } else {
      return [];
    }
    missUA = missUA.map(val => {
      return val.id;
    })
    console.log('flatten', missUA);
    let fav = Favorites.findOne({
      _id: Meteor.userId()
    });
    var data = [];
    if (!!fav && !!fav.users && fav.users.length > 0) {
      data = Meteor.users.find({
          'profile.type': 'host',
          _id: {
              $in: missUA
            , 
              $nin: fav.users || []
          }
        }

      ).fetch();
    } else {
      data = Meteor.users.find({
          'profile.type': 'host',
          _id: {
            $in: missUA
          }
        }

      ).fetch();
    }

    if (data.length == 0) {
      return false;
    }
    if (!!rec) {
      data = data.map((v, i) => {
        let rate = _.findWhere(rec, {
          user: v._id
        });
        if (!!rate)
          v.rating = rate.rating;
        return v;
      });
    }
    Session.set('recomArr', data);
    return data;

  },
  shortRate: (val) => {
    return parseInt(val);
  },
  recom: () => {
    // var recArr = Session.get('recomArr');
    // if (!!recArr && recArr.length>0) {
    //             return recArr;
    // }
    var rec = Recomendations.find({
      from: Meteor.userId()
    }).fetch();
    // var usr = rec.map((v) => {
    //     return v.user;
    // });



    let fav = Favorites.findOne({
      _id: Meteor.userId()
    });
    if (!!!fav) return;
    var data = Meteor.users.find({
      'profile.type': 'host',
      _id: {
        $in: fav.users || []
      }
    }).fetch();

    if (!!rec) {
      data = data.map((v, i) => {
        let rate = _.findWhere(rec, {
          user: v._id
        });
        if (!!rate && !!rate.rating)
          v.rating = rec[i].rating;
        return v;
      });
    }
    Session.set('recomArr', data);
    return data;
  },
  star: (val, val2) => {
    if (val2 < val) return true;
    if (val2 > val) return false;
    return val === val2;
  },
  star2: (val, val2) => {
    return parseFloat(val) == parseFloat(val2);
  }

});


Template.ClientRecom.events({
  "click #fav-acc": () => {

    let id = Session.get('recom-current');

    var f = Favorites.find({
      _id: Meteor.userId()
    }).count();
    if (f > 0) {
      Favorites.update({
        _id: Meteor.userId()
      }, {
        $push: {
          users: id
        }
      });
    } else {

      Favorites.insert({
        _id: Meteor.userId(),
        users: [id]
      });
    }

    recomId = Recomendations.findOne({
      user: id,
      from: Meteor.userId()
    })._id;
    Recomendations.update(recomId, {
      $set: {
        rating: 5.75
      }
    });
    $('#modal-fav').modal('hide');

  },
  "click .fav-img": (e) => {
    for (var i = 1; i <= 5; i++) {
      $('#set-rating-' + i + '-' + e.target.parentElement.id.split('-')[2]).removeClass('star-empty');
      $('#set-rating-' + i + '-' + e.target.parentElement.id.split('-')[2]).addClass('star-full-3');
    }

    var id = e.target.parentElement.id.split('-')[2];
    recomId = Recomendations.findOne({
      user: id,
      from: Meteor.userId()
    })._id;
    Recomendations.update(recomId, {
      $set: {
        rating: 5.75
      }
    });
    Session.set('recom-current', id);
    $('#modal-fav').modal('show');
  },

  "click .recon_rest": (e) => {
    var op = "";
    if (!!e.target.firstElementChild) {
      op = e.target.firstElementChild.className;
    } else {
      op = e.target.className;
    }
    if (op === 'star-full') {
      var recomId = 0;
      var id = parseInt(e.target.firstElementChild.id.split('-')[2]);
      for (var i = 1; i <= 5; i++) {
        $('#set-rating-' + i + '-' + e.target.id.split('-')[3]).removeClass('star-full');
        $('#set-rating-' + i + '-' + e.target.id.split('-')[3]).addClass('star-empty');
      }
      for (var i = 1; i <= id; i++) {
        $('#set-rating-' + i + '-' + e.target.id.split('-')[3]).removeClass('star-empty');
        $('#set-rating-' + i + '-' + e.target.id.split('-')[3]).addClass('star-full-3');
      }
      //get and incrise 
      recomId = Recomendations.findOne({
        user: e.target.firstElementChild.id.split('-')[3],
        from: Meteor.userId()
      })._id;
      if (!!recomId) {
        let rate = Recomendations.findOne(recomId).rating;
        let ratel = parseInt(rate);
        console.log(ratel, id);
        if (ratel === id) {
          console.log(rate + 0.15);
          Recomendations.update(recomId, {
            $set: {
              rating: rate + 0.15
            }
          });
          let result = rate.toString().split('.')[1];
          if (!!result) {
            for (var i = 1; i <= 5; i++) {
              $('#set-rating-' + i + '-' + e.target.id.split('-')[3]).removeClass('star-full');
              $('#set-rating-' + i + '-' + e.target.id.split('-')[3]).addClass('star-empty');
            }
            for (var i = 1; i <= id; i++) {
              $('#set-rating-' + i + '-' + e.target.id.split('-')[3]).removeClass('star-empty');
              $('#set-rating-' + i + '-' + e.target.id.split('-')[3]).addClass('star-full-1');
            }
          }
        }
        Recomendations.update(recomId, {
          $set: {
            rating: id
          }
        });
      } else {
        Recomendations.insert({
          user: e.target.firstElementChild.id.split('-')[3],
          from: Meteor.userId(),
          createdAt: new Date()
        });
      }
    } else {
      var id = parseInt(e.target.id.split('-')[2]);
      for (var i = 1; i <= id; i++) {
        $('#set-rating-' + i + '-' + e.target.id.split('-')[3]).removeClass('star-empty');
        $('#set-rating-' + i + '-' + e.target.id.split('-')[3]).addClass('star-full-3');
      }
      var recomId = 0;

      var recomCurs = Recomendations.find({
        user: e.target.id.split('-')[3],
        from: Meteor.userId()
      });

      if (recomCurs.count() == 0) {
        Recomendations.insert({
          user: e.target.id.split('-')[3],
          rating: id,
          from: Meteor.userId(),
          createdAt: new Date()

        });
      } else {
        recomId = Recomendations.findOne({
          user: e.target.id.split('-')[3],
          from: Meteor.userId()
        })._id;
        let rate = Recomendations.findOne(recomId).rating;
        let ratel = parseInt(rate);
        if (ratel === id) {
          rate = rate + 0.25;
          let full = id + 0.75;
          Recomendations.update(recomId, {
            $set: {
              rating: full
            }
          });
          let result = full.toString().split('.')[1];
          if (!!result && result === '25') {
            for (var i = 1; i <= 5; i++) {
              $('#set-rating-' + i + '-' + e.target.id.split('-')[3]).removeClass('star-full');
              $('#set-rating-' + i + '-' + e.target.id.split('-')[3]).addClass('star-empty');
            }
            for (var i = 1; i <= id; i++) {
              $('#set-rating-' + i + '-' + e.target.id.split('-')[3]).removeClass('star-empty');
              $('#set-rating-' + i + '-' + e.target.id.split('-')[3]).addClass('star-full-1');
            }
          } else if (!!result && result === '5') {
            for (var i = 1; i <= 5; i++) {
              $('#set-rating-' + i + '-' + e.target.id.split('-')[3]).removeClass('star-full');
              $('#set-rating-' + i + '-' + e.target.id.split('-')[3]).addClass('star-empty');
            }
            for (var i = 1; i <= id; i++) {
              $('#set-rating-' + i + '-' + e.target.id.split('-')[3]).removeClass('star-empty');
              $('#set-rating-' + i + '-' + e.target.id.split('-')[3]).addClass('star-full-2');
            }
          }
        } else {
          let full = id + 0.75;
          Recomendations.update(recomId, {
            $set: {
              rating: full
            }
          });
          for (var i = 1; i <= 5; i++) {
            $('#set-rating-' + i + '-' + e.target.id.split('-')[3]).removeClass('star-full-3');
            $('#set-rating-' + i + '-' + e.target.id.split('-')[3]).addClass('star-empty');
          }
          for (var i = 1; i <= id; i++) {
            $('#set-rating-' + i + '-' + e.target.id.split('-')[3]).removeClass('star-empty');
            $('#set-rating-' + i + '-' + e.target.id.split('-')[3]).addClass('star-full-3');
          }
        }
        // Recomendations.update(recomId, {
        //     $set: {
        //         rating: id
        //     }
        // });
      }
    }
    var id = e.target.id.split('-')[3];
    Session.set('recom-current', id);
    $('#modal-fav').modal('show');
    // swal({
    //     title: "Are you sure?",
    //     text: "Add to favorites",
    //     type: "info",
    //     showCancelButton: true,
    //     confirmButtonColor: "#DDff55",
    //     confirmButtonText: "Yes, add it!",
    //     closeOnConfirm: true
    //   },
    //   function () {

    //     var f = Favorites.find({
    //       _id: Meteor.userId()
    //     }).count();
    //     if (f > 0) {
    //       Favorites.update({
    //         _id: Meteor.userId()
    //       }, {
    //         $push: {
    //           users: id
    //         }
    //       });
    //     } else {
    //       Favorites.insert({
    //         _id: Meteor.userId(),
    //         users: [id]
    //       });
    //     }
    //   });
  },
  "change #selectMiss": (e) => {
    Session.set('missId', $('#selectMiss').val());
  },
  "click .lm": (e) => {
    // var lm = Session.get('rec-lm');
    lm = e.target.id.split('-')[1];
    Session.set('rec-lm', lm * 5);
  },
  "click .glyphicon-comment": (e) => {
    var id = e.target.id.split('-')[1];
    Session.set('commentId', id);
    $('#myModal46').modal({
      keyboard: true,
      backdrop: true
    });
  },
  "click .commSubm": (e) => {
    e.preventDefault();
    var uid = e.target.id.split('-')[1];
    var comment = document.querySelector('#comment-' + uid).value;
    document.querySelector('#comment-' + uid).value = '';
    // $('#myModal46').modal('toogle');
    var com = Companies.findOne({
      users: {
        $in: [Meteor.userId()]
      }
    });
    Comments.insert({
      user: uid,
      comment: comment,
      from: Meteor.user().profile.nameManager,
      company: com.name || 'None'
    });
    swal('Commentaire', 'Votre commentaire est soumis');

  },
  "click .mission_like_number": (e) => {
    var id = e.target.id.split('-')[1];
    var fvr = Meteor.users.findOne({
      _id: id
    }).profile.favorites;

    if (fvr.indexOf(Meteor.userId()) >= 0) return false;

    Meteor.users.update({
      _id: id
    }, {
      $push: {
        'profile.favorites': Meteor.userId()
      }
    });
  },
  "click .add-recom": (event) => {
    document.querySelector('#' + event.target.id).parentElement.parentElement.remove();
    // var recomArr = Session.get('recomArr');
    var id = event.target.id;
    // var data = Meteor.users.findOne(event.target.id);
    // var rec = Recomendations.findOne({
    //     user: event.target.id
    // });
    // if (rec) {
    //     data.rating = rec.rating;
    // }
    // if (!!_.findWhere(recomArr, {
    //         _id: data._id
    //     })) return false;
    // recomArr.push(data);
    // Session.set('recomArr', recomArr);

    var f = Favorites.find({
      _id: Meteor.userId()
    }).count();
    if (f > 0) {
      Favorites.update({
        _id: Meteor.userId()
      }, {
        $push: {
          users: id
        }
      });
    } else {
      Favorites.insert({
        _id: Meteor.userId(),
        users: [id]
      });
    }
  },
  "click .report": (e) => {
    //!TODO add model
    sweetAlert('Votre avis a bien été envoyé');
    document.querySelector('#' + e.target.id).parentElement.parentElement.remove();
  },
  "click .guest_cross,.user_cross": (e) => {
    swal({
        title: "Êtes vous sûr ?",
        text: "Supprimer ce profil de vos favoris?",
        type: "Attention",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
      },
      function () {
        $(e.target).parent().hide();
        swal("Deleted!", "Host was deleted.", "success");
      });
  }

});
