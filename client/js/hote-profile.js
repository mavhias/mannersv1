Template.HoteProfile.onCreated(() => {
  let uid = Meteor.userId();

  if (!!Iron.Location.get().path.split('/')[3]) {
    uid = Iron.Location.get().path.split('/')[3];
  }
  Session.set('uid-profile', uid);
});

Template.HoteProfile.helpers({
  // authCheck: () => {
  //     if (!Meteor.userId()) {
  //         sweetAlert({
  //             title: "Désolé !",
  //             text: "Vous n'avez pas accès à cette page."
  //         }, () => {
  //             Router.go('/accueilhote');
  //         });
  //         return false;
  //     }

  //     var user = Meteor.user();
  //     if (user.profile.type === 'client') {
  //         sweetAlert({
  //             title: "Désolé !",
  //             text: "Vous n'avez pas accès à cette page."
  //         }, () => {
  //             Router.go('/accueilhote');
  //         });
  //         return false;

  //     }
  //     return true;
  // },

  
  ac: () => {
    return Meteor.userId() === Session.get('uid-profile');
  },
  user: () => {
    return Meteor.users.findOne(Session.get('uid-profile'));
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
  star: (val, val2) => {
    if (val2 < val) return true;
    if (val2 > val) return false;
    return val === val2;
  },
  favCol: () => {
    return Recomendations.find({
      user: Session.get('uid-profile')
    }).count();
    // var prof = Meteor.users.findOne(Session.get('uid-profile')).profile;
    // if (!!prof.favorites) {
    //     return prof.favorites.length;
    // }
    // return 0;
  },
  comments: () => {
    return Comments.find({
      user: Session.get('uid-profile')
    });
  },
  empty: (val) => {
    if (!!val) return val;
    return 'Aucun';
  },
  commCol: () => {
    return Comments.find({
      user: Session.get('uid-profile')
    }).count();
  },
  myCompany: () => {
    return Companies.findOne({
      users: {
        $in: [Session.get('uid-profile')]
      }
    }).name;
  },
  travled: () => {
    return Meteor.user().profile.travled || 0;
  },
  missions: () => {
    return Missions.find({
      hostes: {
        $in: [Session.get('uid-profile')]
      }
    }).count();
  },
  recom: () => {
    return Recomendations.find({
      user: Session.get('uid-profile')
    });
  },
  editName: () => {
    let trigger = Session.get('edit');
    if (!!trigger && trigger === 'edited') {
      if (!!Profiles.findOne({
          userId: Session.get('uid-profile')
        }))
        return `<textarea name="" id="descrVal" cols="5" rows="5">` + Profiles.findOne({
          userId: Session.get('uid-profile')
        }).description + `</textarea> <br>
             <button class="button hollow pull-right" id="descrSave">Sauvegarder</button>`;
      else return `<textarea name="" id="descrVal" cols="5" rows="5" placeholder=""></textarea>
            <button class="btn button-colored pull-right" id="descrSave">Sauvegarder</button>`;
    } else {
      return Profiles.findOne({
        userId: Session.get('uid-profile')
      }).description.replace(new RegExp('\n', 'g'), '<br>');
    }
  },
  //Year - Level of formation - Section/Study - Etablishment(what school?) - City
  formation: () => {
    let trigger = Session.get('formation');
    formation = Profiles.findOne({
      userId: Session.get('uid-profile')
    });
    if (!!trigger && trigger === 'add') {
      let data = [];
      if (!!formation && !!formation.formation && formation.formation.length > 0) {
        formation = formation.formation;
        data = formation.map(val => {
          return `<tr>
            <td>` + val.year + `</td>
            <td>` + val.level + `</td>
            <td>` + val.section + `</td>
            <td>` + val.school + `</td>
            <td>` + val.city + `</td>
            </tr>`
        });
      }

      let form = `<tr>
            <td width="100%">
            <form action="" id="formation" method="POST" class="form-inline" role="form">

  <div class="form-group">
    <label class="sr-only" for="">label</label>
    <input type="text" name="year" class="form-control" id="" placeholder="Année : YYYY ">
    <input type="text" name="level" class="form-control" id="" placeholder="Diplôme ">
    <input type="text" name="section" class="form-control" id="" placeholder="Programme ">
    <input type="text" name="school" class="form-control" id="" placeholder="Établissement">
    <input type="text" name="city" class="form-control" id="" placeholder="Lieux">

  </div>

  

  <button type="submit" class="button hollow pull-right">Sauvegarder</button>
</form>
                  </td>
                  </tr>`;
      data.push(form);
      return data;

    }

    //else if (!!trigger && trigger === 'del')
    // {}
    else {
      return formation.formation.map(val => {
        return `<tr>
            <td>` + val.year + `</td>
            <td>` + val.level + `</td>
            <td>` + val.section + `</td>
            <td>` + val.school + `</td>
            <td>` + val.city + `</td>
            </tr>`
      });
    }
  },
  engLevel: () => {
    //Bases 2. Intermédiaire 3. Moyen 4. Bon 5. Courant
    let engLvl = Meteor.users.findOne(Session.get('uid-profile')).profile.engLevel;
    if (engLvl === 'bases') {
      return `<div class="star-red"></div>
                <div class="star-empty"></div>
                <div class="star-empty"></div>
                <div class="star-empty"></div>
                <div class="star-empty"></div>`;
    } else if (engLvl === 'intermédiaire') {
      return `<div class="star-red"></div>
                    <div class="star-red"></div>
                <div class="star-empty"></div>
                <div class="star-empty"></div>
                <div class="star-empty"></div>`;
    } else if (engLvl === 'moyen') {
      return `<div class="star-red"></div>
                 <div class="star-red"></div>
                 <div class="star-red"></div>
                 <div class="star-empty"></div>
                 <div class="star-empty"></div>`;
    } else if (engLvl === 'bon') {
      return `<div class="star-red"></div>
                <div class="star-red"></div>
                <div class="star-red"></div>
                <div class="star-red"></div>
                <div class="star-empty"></div>`;
    } else if (engLvl === 'courant') {
      return `<div class="star-red"></div>
                <div class="star-red"></div>
                <div class="star-red"></div>
                <div class="star-red"></div>
                <div class="star-red"></div>`;
    }
  },
  star2: (val, val2) => {
    return parseFloat(val) == parseFloat(val2);
  },
  addLang: () => {
    let profile = Meteor.users.findOne(
      Session.get('uid-profile')
    ).profile;
    let data = [];
    if (!!profile['anlang']) {
      data = profile.anlang.map(val => {
        if (val.level == 1) {
          return val.lang + `:` +
            `
                                          <div class="customer_rating">
<div class="star-red"></div>
                <div class="star-empty"></div>
                <div class="star-empty"></div>
                <div class="star-empty"></div>
                <div class="star-empty"></div></div>`;
        } else if (val.level == 2) {
          return val.lang + `:` +
            `<div class="customer_rating">
<div class="star-red"></div>
                <div class="star-red"></div>
                <div class="star-empty"></div>
                <div class="star-empty"></div>
                <div class="star-empty"></div></div>`;
        } else if (val.level == 3) {
          return val.lang + `:` +
            `<div class="customer_rating">
<div class="star-red"></div>
                <div class="star-red"></div>
                <div class="star-red"></div>
                <div class="star-empty"></div>
                <div class="star-empty"></div></div>`;
        } else if (val.level == 4) {
          return val.lang + `:` +
            `
                                          <div class="customer_rating">
<div class="star-red"></div>
                <div class="star-red"></div>
                <div class="star-red"></div>
                <div class="star-red"></div>
                <div class="star-empty"></div></div>`;
        } else if (val.level == 5) {
          return val.lang + `:` +
            `                  <div class="customer_rating">
<div class="star-red"></div>
                <div class="star-red"></div>
                <div class="star-red"></div>
                <div class="star-red"></div>
                <div class="star-red"></div></div`;
        }

      });
    }
    return data.join(' ') + `Language: <div id="lang-f-ctrls"><div class="plus-aside" id="plus-aside"></div><div class="glyphicon glyphicon-remove" id="removeL"></div></div>
        
            <section class="add-l-f hide">
              <input type="text" name="" id="add-l-f-i" class="add-l-f-i" value="" required="required" placeholder="Langue parlée" title="add language">
              <br/>
<select name="" id="add-l-f-s" class="form-control" required="required"> Note : 
  <option >1</option>
    <option >2</option>
  <option >3</option>
  <option >4</option>
  <option >5</option>

</select>
           <button id='addLfs' class="button hollow">Sauvegarder</button>
  
            </section>
            `;
    //  <div class="star-empty"></div>
    //   <div class="star-empty"></div>
    //   <div class="star-empty"></div>
    //   <div class="star-empty"></div>
    //   <div class="star-empty"></div>

  },
  profInfo: (id) => {
    let profile = Meteor.users.findOne(
      Session.get('uid-profile')
    ).profile;
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
  exp: () => {
    let trigger = Session.get('exp');
    exp = Profiles.findOne({
      userId: Session.get('uid-profile')
    });
    if (!!trigger && trigger === 'add') {
      let data = [];
      alert('add');
      if (!!exp && !!exp.exp && exp.exp.length > 0) {
        data = exp.exp.map(val => {
          return `<li>
                            <h3>` + val.company + `</h3>
       <time>` + val.year + `</time>
            <div>` + val.delay + `</div>
            <div>` + val.job + `</div>
            </li>`;
        });
      }


      let form = `
            <form action="" id="exp" method="POST" class="form-inline" role="form">

  <div class="form-group">
    <label class="sr-only" for="">label</label>
    <input type="text" name="year" class="form-control" id="" placeholder="Entreprise">
    <input type="text" name="delay" class="form-control" id="" placeholder="Durée">
    <input type="text" name="company" class="form-control" id="" placeholder="Description">
    <input type="text" name="job" class="form-control" id="" placeholder="">

  </div>
<br>
  <button type="submit" class="pull-right button hollow">Sauvegarder</button>
</form>`;
      data.push(form);
      return data;

    }

    //else if (!!trigger && trigger === 'del')
    // {}Year - Delay - Company - Job
    else {
      return exp.exp.map(val => {
        return `<li>
       <h3>` + val.company + `</h3>
       <time>` + val.year + `</time>
            <div>` + val.delay + `</div>
            <div>` + val.job + `</div>
            </li>`;
      });
    }
  },

  rating: (date) => {
    let rating = Recomendations.find({
      user: Session.get('uid-profile')
    }).fetch();
    rating = rating.map(val => val.rating);
    let dev = rating.length;
    rating = rating.reduce(function (a, b) {
      return a + b;
    });
    rating = rating / dev;
    return parseFloat(rating);
  },
  star: (val, val2) => {
    if (val2 < val) return true;
    if (val2 > val) return false;
    return val === val2;
  },
  recomNum: () => {
    return Recomendations.find({
      user: Session.get('uid-profile')
    }).count();

  },
  recomView: (v) => {
    return Meteor.users.findOne({
      _id: v
    }).profile.firstname + '<br>' + Companies.findOne({
      users: {
        $in: [v]
      }
    }).name;
  },
  missTodo: () => {
    return Missions.find({
      hostes: {
        $in: [Session.get('uid-profile')]
      },
      status: {
        $not: 3
      }
    }).count();
  }
});

Template.HoteProfile.events({
  'click #mod_profile': () => {
    $('#modal-profile').modal('show');
  },
  'click #mod-prof-info': () => {
    $('#modal-prof-info').modal('show');
  },
  'click #desc-add': (e, template) => {
    Session.set('edit', 'edited');
  },
  'click #addFrm': (e) => {
    Session.set('formation', 'add');
  },
  'click #addExp': (e) => {
    Session.set('exp', 'add');
  },
  'click #popFrm': (e) => {
    Meteor.call('removeUserProfile', {
      formation: 1
    });
  },
  'click #popExp': (e) => {
    Meteor.call('removeUserProfile', {
      exp: 1
    });
  },
  'click #plus-aside': (e) => {
    $('.add-l-f').removeClass('hide');
  },
  'click #addLfs': (e) => {
    $('.add-l-f').addClass('hide');
    let lang = $('#add-l-f-i').val();
    let level = $('#add-l-f-s').val();
    Meteor.users.update({
      _id: Session.get('uid-profile')
    }, {
      $push: {
        'profile.anlang': {
          lang: lang,
          level: parseInt(level)
        }
      }
    });

  },
  "click #removeL": (e) => {
    Meteor.users.update({
      _id: Session.get('uid-profile')
    }, {
      $pop: {
        'profile.anlang': 1
      }
    });
  },
  'submit #formation': (e) => {
    e.preventDefault();
    let val = {
      year: e.target.year.value,
      level: e.target.level.value,
      section: e.target.section.value,
      school: e.target.school.value,
      city: e.target.city.value
    };
    if (!!Profiles.findOne({
        userId: Session.get('uid-profile')
      })) {
      Meteor.call('updateUserProfile', {
        formation: val
      });
    } else {
      Profiles.insert({
        userId: Session.get('uid-profile'),
        formation: [val],
        createdAt: new Date()
      });
    }
    Session.set('formation', 'view');

  },
  'submit #prof': (e) => {
    e.preventDefault();

    var id = Meteor.user()._id;

    var user = Meteor.users.update(id, {
      $set: {
        'profile.firstname': e.target.firstname.value,
        'profile.name': e.target.name.value,
        'profile.phone': e.target.phone.value,
        'profile.email': e.target.email.value,
        'profile.address': e.target.address.value,
        'profile.address2': e.target.address2.value,
        'profile.zip': e.target.zip.value,
        'profile.city': e.target.city.value,
        'profile.siret': e.target.siret.value,
        // 'profile.pays': e.target.pays.value,
      }
    });
    $('#modal-profile').modal('show');

    $.notify("Nous avons bien pris en compte vos informations de facturation..", {
      clickToHide: true,
      autoHideDelay: 400000,
      style: 'happyblue'
    });
  },
  'submit #exp': (e) => {
    e.preventDefault();
    let val = {
      year: e.target.year.value,
      delay: e.target.delay.value,
      company: e.target.company.value,
      job: e.target.job.value,
    };
    if (!!Profiles.findOne({
        userId: Session.get('uid-profile')
      })) {
      Meteor.call('updateUserProfile', {
        exp: val
      });
    } else {
      Profiles.insert({
        userId: Session.get('uid-profile'),
        exp: [val],
        createdAt: new Date()
      });
    }
    Session.set('exp', 'view');

  },
  'click #descrSave': (e) => {
    let val = $('#descrVal').val();
    if (!!Profiles.findOne({
        userId: Session.get('uid-profile')
      })) {
      Meteor.call('updateUserProfile', {
        description: val
      });
    } else {
      Profiles.insert({
        userId: Session.get('uid-profile'),
        description: val,
        createdAt: new Date()
      });
    }
    Session.set('edit', 'notedited');
  }
});
