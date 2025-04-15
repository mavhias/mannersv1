import lodash from 'lodash';



function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

translate = (date) => {
  let day = date.split(' ')[0];
  let month = date.split(' ')[2];
  let day1 = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let i = day1.indexOf(day);
  let month1 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  let data = {
    days: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
    daysShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    daysMin: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
    months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
    monthsShort: ["Jan", "Fev", "Mar", "Avr", "Mai", "Jui", "Jui", "Aou", "Sep", "Oct", "Nov", "Dec"]
  };
  date = date.replace(day1[i], data.days[i]);
  i = month1.indexOf(month);

  date = date.replace(month1[i], data.months[i]);

  return date.replace(date.split(' ')[1], parseInt(date.split(' ')[1]));
}

// Subscribe && init
Template.MissionCreate.onCreated(() => {

  var subs = new SubsManager({
    // will be cached only 20 recently used subscriptions
    cacheLimit: 20,
    // any subscription will be expired after 5 minutes of inactivity
    expireIn: 5
  });
  // Meteor.subscribe("images", "all");
  // subs.subscribe("userList", "cus");
  subs.subscribe('files.images.all');
  // Meteor.subscribe("newImages", "all");
  Session.set('mission-nav', 1);
  Session.set('hosts-col', 1);
  Session.set('suits', []);
  Session.set('suits-ids', []);
  Session.set('endsTo', 1);
  Session.set('pattern', []);
  Session.set('missionId', '');
  Session.set('mtype', 1);
  Session.set('end-mission1', translate(moment(new Date()).locale('en').format("dddd Do MMM YY")));

});



Template.missionCreate1.onCreated(() => {
  //init Calend
  setTimeout(() => {
    $.fn.datepicker.dates['fr'] = {
      days: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
      daysShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
      daysMin: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
      months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
      monthsShort: ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jui", "Aou", "Sep", "Oct", "Nov", "Dec"],
      today: "Aujourd'hui",
      clear: "Rafraîchir",
      format: "dd/mm/yyyy",
      titleFormat: "MM yyyy",
      /* Leverages same syntax as 'format' */
      weekStart: 0
    };
    var duration = $('#duration').val();
    var duration = parseInt(duration.split(' ')[0]);
    if (duration > 1) {
      var cols = _.range(0, duration);
      cols.forEach((v) => {
        $('#datetimepicker' + (v + 1)).datepicker({
          pickTime: false,
          language: 'fr'
        });
      });
    } else {
      $('#datetimepicker1').datepicker({
        pickTime: false,
        language: 'fr'
      });
    }

  }, 700);

});

Template.MissionCreate.helpers({
  //Deprecation
  //TODO Remove
  authCheck: () => {
    if (!Meteor.user()) return true;
    if (Meteor.user().profile.type === 'host') {
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
  //navigation 
  test: () => {
    Session.set('mission-nav', Template.instance('default').data.nav);
  },
  nav: (val) => {
    return val === Session.get('mission-nav');
  },
  endMission: () => {
    var duration = $('#duration').val();
    duration = parseInt(duration.split(' ')[0]);
    if (duration > 2) {
      $.notify("Do not press this button", "info");
    }
    var date = new Date($('#start-date-1').val());
    date.setDate(date.getDate() + (duration));
    return date;
  }
});

Template.missionCreate1.helpers({
  geoauto: () => {
    return Session.get('geoauto');
  },
  info: () => {
    let info = JSON.parse(localStorage.getItem('base-info'));
    if (!!info) {
      let end = (info.endsTo.length > 2) ? info.endsTo.slice(0, 2) : info.endsTo.slice(0, 1);
      setTimeout(function () {
        if (!info.hostesCol) return false;
        document.querySelector("#host-col").selectedIndex = info.hostesCol - 1;
        document.querySelector('#begins-to').selectedIndex = parseInt(info.beginsTo.split('-')[0]) - 1;
        document.querySelector('#ends-to').selectedIndex = (parseInt(end) - 1) - (parseInt(info.beginsTo.split('-')[0]) - 1) - 1;

      }, 200);
    }
    return info;
  },
  endMission: () => {
    return Session.get('end-mission1');
  },
  setDate: (date, i) => {
    let res = date[i - 1];
    res = res.split('/');
    res = res[1] + "/" + res[0] + "/" + res[2];
    return res;
  },

  duration: () => {
    var info = Session.get('base-info');
    if (!info) {
      info = JSON.parse(localStorage.getItem('base-info'));
      // if (!info) return [1];
    }
    if (!!info && info.duration === '1 jour') {
      return `<option selected>1 jour</option>
                                            <option>2 jours</option>
                                            <option>3 jours</option>
                                            <option>4 jours</option>
                                            <option>5 jours</option>
                                            <option>6 jours</option>
                                            <option>7 jours</option>`;
    } else if (!!info && info.duration === '2 jours') {
      return `<option >1 jour</option>
                                            <option selected>2 jours</option>
                                            <option>3 jours</option>
                                            <option>4 jours</option>
                                            <option>5 jours</option>
                                            <option>6 jours</option>
                                            <option>7 jours</option>`;
    } else if (!!info && info.duration === '3 jours') {
      return `<option >1 jour</option>
                                            <option >2 jours</option>
                                            <option selected>3 jours</option>
                                            <option>4 jours</option>
                                            <option>5 jours</option>
                                            <option>6 jours</option>
                                            <option>7 jours</option>`;
    } else if (!!info && info.duration === '4 jours') {
      return `<option >1 jour</option>
                                            <option >2 jours</option>
                                            <option >3 jours</option>
                                            <option selected>4 jours</option>
                                            <option>5 jours</option>
                                            <option>6 jours</option>
                                            <option>7 jours</option>`;
    } else if (!!info && info.duration === '5 jours') {
      return `<option >1 jour</option>
                                            <option >2 jours</option>
                                            <option >3 jours</option>
                                            <option >4 jours</option>
                                            <option selected>5 jours</option>
                                            <option>6 jours</option>
                                            <option>7 jours</option>`;
    } else if (!!info && info.duration === '6 jours') {
      return `<option >1 jour</option>
                                            <option >2 jours</option>
                                            <option >3 jours</option>
                                            <option >4 jours</option>
                                            <option >5 jours</option>
                                            <option selected>6 jours</option>
                                            <option>7 jours</option>`;
    } else if (!!info && info.duration === '7 jours') {
      return `<option >1 jour</option>
                                            <option >2 jours</option>
                                            <option >3 jours</option>
                                            <option >4 jours</option>
                                            <option >5 jours</option>
                                            <option >6 jours</option>
                                            <option selected>7 jours</option>`;
    } else {
      return `<option selected >1 jour</option>
                                            <option >2 jours</option>
                                            <option >3 jours</option>
                                            <option >4 jours</option>
                                            <option >5 jours</option>
                                            <option >6 jours</option>
                                            <option >7 jours</option>`;
    }



  },
  endsTo: () => {

    let info = JSON.parse(localStorage.getItem('base-info'));

    let end = Session.get('endsTo');
    if (end < 2 && !!info) {
      let begin = info.beginsTo;
      if (begin.length > 2) {
        begin = begin.slice(0, 2);
      } else {
        begin = begin.slice(0, 1);
      }
      end = parseInt(begin) + 1;
    }
    var arr = Array.from(new Array(24 - end), () => 1);
    arr = arr.map((v, i) => i + end);
    return arr;
  },
  endsTo1: () => {
    var arr = Array.from(new Array(24 - Session.get('endsTo')), () => 1);
    arr = arr.map((v, i) => i + Session.get('endsTo'));
    console.log(_.range(1, Session.get('endsTo')));
    return _.range(1, Session.get('endsTo')).map(v => {
      return {
        v: v + 24,
        s: v
      };
    });
  },

  calend: () => {
    var baseInfo = Session.get('base-info');
    if (!baseInfo) {
      baseInfo = JSON.parse(localStorage.getItem('base-info'));
      if (!baseInfo) return [1];
    }
    var duration = parseInt(baseInfo.duration.split(' ')[0]);
    duration = parseInt(duration);
    var cols = _.range(0, duration);
    // cols.forEach((v) => {
    //     $('#datetimepicker' + v).datepicker({
    //         pickTime: false,
    //         language: 'fr'
    //     });
    // });

    for (var i = 0; i < cols.length; i++) {
      cols[i] = cols[i] + 1;
    }

    return cols;
  }
});


Template.missionCreate1.events({
  "change #duration": (e, t) => {
    UI.insert(UI.render(Template.MissionCreate), $(''));
    var duration = $('#duration').val();
    Session.set('base-info', {
      duration: duration
    });
    var duration = parseInt(duration.split(' ')[0]);
    if (parseInt(duration) > 2) {
      // $.notify.defaults({ autoHide:false });
      $.notify("Si votre mission dure plusieurs jours, veuillez remplir seulement les horaires de la première journée. Vous pourrez modifier le calendrier des autres jours dans l'étape suivante..", {
        autoHide: false
      });
    }
  },

  "change #begins-to": (e) => {
    var note = $('#begins-to').val();
    $('#ends-to').prop('disabled', false);

    if (note.length > 2) {
      note = note.slice(0, 2);
    } else {
      note = note.slice(0, 1);
    }
    note = parseInt(note);
    if (note == 24) {
      note = 1;
    }
    // note = 1;

    Session.set('endsTo', parseInt(note + 1));
  },

  "change .start-date": function (event, template) {
    var duration = $('#duration').val();
    var duration = parseInt(duration.split(' ')[0]);
    var id = event.target.id.split('-')[2];
    date = $('#start-date-' + id).val().split('/');
    var date = new Date(date[1] + "/" + date[0] + "/" + date[2]);
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var curDay = Math.floor(diff / oneDay);
    var selDate = new Date(date);
    var start = new Date(selDate.getFullYear(), 0, 0);
    var diff = selDate - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var selDay = Math.floor(diff / oneDay);
    let tempdate = new Date(date).getTime() - new Date().getTime();
    if ((curDay - 1) > selDay) {
      sweetAlert('La date est déjà passée !');
    }
    //date.setDate(date.getDate() + (parseInt(duration) - 1));
    Session.set('end-mission1', translate(moment(date).locale('en').format("dddd Do MMM YY")));
  }
});


Template.missionCreate2.helpers({

  lastInAr: (arr) => {
    return arr[arr.length];
  },
  dates1: () => {
    var baseInfo = Session.get('base-info');
    if (!baseInfo) {
      baseInfo = JSON.parse(localStorage.getItem('base-info'));
    }
    var end = baseInfo.endsTo;
    if (!end) {
      end = 24;
    }
    if (end.length > 2) {
      end = end.slice(0, 2);
    } else {
      end = end.slice(0, 1);
    }
    console.log(_.range(24, end));
    return _.range(24, end).map(v => {
      return {
        v: v,
        s: v - 23
      };
    });
  },
  dates: () => {
    var baseInfo = Session.get('base-info');
    if (!baseInfo) {
      baseInfo = JSON.parse(localStorage.getItem('base-info'));
    }
    var begin = baseInfo.beginsTo;
    if (!begin) {
      begin = 1;
    }
    if (begin.length > 2) {
      begin = begin.slice(0, 2);
    } else {
      begin = begin.slice(0, 1);
    }
    var end = baseInfo.endsTo;
    if (!end) {
      end = 24;
    }
    if (end.length > 2) {
      end = end.slice(0, 2);
    } else {
      end = end.slice(0, 1);
    }
    if (parseInt(end) > 24) {
      end = 24;
    }
    return _.range(parseInt(begin), parseInt(end) + 1);
  },
  foo: () => {
    let hCol = JSON.parse(localStorage.getItem('hosts-col'));
    return Array.from(new Array(parseInt(hCol)), () => 'a');
  },
  patterns: () => {
    var baseInfo = Session.get('base-info');
    if (!baseInfo) {
      baseInfo = JSON.parse(localStorage.getItem('base-info'));
    }
    var duration = baseInfo.duration;
    duration = duration.split(' ')[0];
    var arr = Array.from(new Array(parseInt(duration)), () => 'a');
    var arr2 = [];
    arr.forEach((v, i) => {
      var date = baseInfo.startDate;
      console.log(date, translate(moment(new Date(date[i])).locale('en').format("dddd Do MMM YYYY")));
      arr2.push({
        date: translate(moment(new Date(date[i])).locale('en').format("dddd Do MMM YYYY")),
        id: i
      });
    });
    return arr2;
  }
});

Template.missionCreate1.onRendered(() => {


});

Template.missionCreate2.onRendered(() => {
  var baseInfo = Session.get('base-info');
  if (!baseInfo) {
    baseInfo = JSON.parse(localStorage.getItem('base-info'));
  }
  var duration = baseInfo.duration;
  duration = duration.split(' ')[0];
  var arr = Array.from(new Array(parseInt(duration)), () => 'a');
  var buttons = [];
  arr.forEach((v, i) => {
    var button = document.getElementById('button-' + i);
    var button2 = document.getElementById('button-delete-' + i);
    buttons.push({
      ok: button,
      correct: button2
    });
    if (i > 0) document.getElementById('wrapper-' + i).classList.add("hidden-test");
    buttons[i].ok.onclick = () => {
      document.getElementById('wrapper-' + i).classList.add("hidden-test");
      document.getElementById('wrapper-' + i).classList.remove("visible-test");
      document.getElementById('wrapper-' + (i + 1)).classList.add("visible-test");
      document.getElementById('wrapper-' + (i + 1)).classList.add("hidden-test");
      if (i == buttons.length - 2) document.getElementById('button2').disabled = false;
    }
    buttons[i].correct.onclick = () => {
      document.getElementById('wrapper-' + i).classList.add("hidden-test");
      document.getElementById('wrapper-' + i).classList.remove("visible-test");
      document.getElementById('wrapper-' + (i - 1)).classList.add("visible-test");
      document.getElementById('wrapper-' + (i - 1)).classList.add("hidden-test");
      document.getElementById('button2').disabled = true;

    }
  });
  if (buttons.length > 1) document.getElementById('button2').disabled = true;
  buttons[0].correct.classList.add('hidden');
  buttons[buttons.length - 1].ok.classList.add('hidden');
  var height = document.getElementById('wrapper-0').offsetHeight;
  console.log(height);
  document.getElementById("missions-separated").style.height = height + "px";
});

Template.missionCreate3.onRendered(() => {
  var arr = JSON.parse(localStorage.getItem('hosts-col'));
  let col = parseInt(JSON.parse(localStorage.getItem('hosts-col')));
  var pattern = JSON.parse(localStorage.getItem('pattern'));

  let job = pattern.map(val => {
    return val.mission;
  });

  job = _.uniq(job);
  var arr2 = _.range(0, job.length);

  var buttons = [];

  arr2.forEach((v, i) => {
    console.log('hjjhjkhkj', i);
    var button = document.getElementById('button-tenue-' + i);
    var button2 = document.getElementById('button-tenue-delete-' + i);
    console.log(button, 'button-tenue-' + i);
    buttons.push({
      ok: button,
      correct: button2
    });

    if (i > 0) document.getElementById('wrapper-tenue-' + i).classList.add("hidden-test");
    buttons[i].ok.onclick = () => {

      document.getElementById('wrapper-tenue-' + i).classList.add("hidden-test");
      document.getElementById('wrapper-tenue-' + i).classList.remove("visible-test");
      document.getElementById('wrapper-tenue-' + (i + 1)).classList.add("visible-test");
      document.getElementById('wrapper-tenue-' + (i + 1)).classList.add("hidden-test");
      if (i == buttons.length - 2) document.getElementById('button3').disabled = false;
    }
    buttons[i].correct.onclick = () => {
      document.getElementById('wrapper-tenue-' + i).classList.add("hidden-test");
      document.getElementById('wrapper-tenue-' + i).classList.remove("visible-test");
      document.getElementById('wrapper-tenue-' + (i - 1)).classList.add("visible-test");
      document.getElementById('wrapper-tenue-' + (i - 1)).classList.add("hidden-test");
      document.getElementById('button3').disabled = true;

    }
  });
  if (buttons.length > 1) document.getElementById('button3').disabled = true;
  buttons[0].correct.classList.add('hidden');
  buttons[buttons.length - 1].ok.classList.add('hidden');
  var height = document.getElementById('wrapper-tenue-0').offsetHeight;
  console.log(height);
  document.getElementById("missions-separated2").style.height = height + "px";
});

Template.missionCreate3.helpers({
  clInfo: () => {
    return Missions.find({
      'creator': Meteor.userId()
    }, {
      fields: {
        'profile.pattern': 1
      }
    })
  },
  chooseCl: (data) => {
    if (data.sex === "Femme") {
      if (!!!data.info) {
        if (data.mission === "Vendeur" || data.mission === "Régisseur" || data.mission === "Street-marketeur" || data.mission === "Promoteur") {
          data.info = 'Jean noir, t-shirt uni, baskets noires';
        } else if (data.mission === "Serveur" || data.mission === "Barman" || data.mission === "Commis" || data.mission === "Runner" || data.mission === "Maître d'hôtel") {
          data.info = 'Tailleur pantalon noir, chemise noire, cravate noire, ballerines';
        } else if (data.mission === "Hôte d’accueil" || data.mission === "Responsable vestiaire" || data.mission === "Voiturier") {
          data.info = 'Robe sans manche noire, collants noirs, ballerines';
        }
      }
      return `
              <br>
                                     <label class="pull-left"> Tenues pour les femmes :</label>
                                     <br>
            <input type="text" name="" id="cldf-` + data.mission + `-` + data.i + `" class="form-control femme cloth-descr" value="` + data.info + `" required="required" placeholder="` + data.mission + `:" pattern="" title="">`;
    }
    if (data.sex === "Homme") {
      if (!!!data.info) {
        if (data.mission === "Vendeur" || data.mission === "Régisseur" || data.mission === "Street-marketeur" || data.mission === "Promoteur") {
          data.info = 'Jean noir, t-shirt uni, baskets noires';
        } else if (data.mission === "Serveur" || data.mission === "Barman" || data.mission === "Commis" || data.mission === "Runner" || data.mission === "Maître d'hôtel") {
          data.info = 'Costume noir, chemise noire, cravate noire, chaussures en cuir noires';
        } else if (data.mission === "Hôte d’accueil" || data.mission === "Responsable vestiaire" || data.mission === "Voiturier") {
          data.info = 'Costume noir, chemise blanche, cravate noire, chaussures en cuir noires';
        }
      }
      return `<br>
                                     <label class="pull-left"> Tenues pour les hommes :</label>
                                     <br>
            <input type="text" name="" id="cldf-` + data.mission + `-` + data.i + `" class="form-control homme cloth-descr" value="` + data.info + `"" required="required" placeholder="` + data.mission + `:" pattern="" title="">`;
    }
    if (data.sex === "Indifférent") {
      if (!!localStorage.getItem('suits-ids')) {
        var id = JSON.parse(localStorage.getItem('suits-ids'))[data.i + 1];
        var cloth = Cloth.findOne(id);
      }

      var info = data.info || '';
      var info1 = (!!cloth) ? cloth.info : '';
      if (!!!info) {
        if (data.mission === "Vendeur" || data.mission === "Régisseur" || data.mission === "Street-marketeur" || data.mission === "Promoteur") {
          info = 'Jean noir, t-shirt uni, baskets noires';
        } else if (data.mission === "Serveur" || data.mission === "Barman" || data.mission === "Commis" || data.mission === "Runner" || data.mission === "Maître d'hôtel") {
          info = 'Costume noir, chemise noire, cravate noire, chaussures en cuir noires';
        } else if (data.mission === "Hôte d’accueil" || data.mission === "Responsable vestiaire" || data.mission === "Voiturier") {
          info = 'Costume noir, chemise blanche, cravate noire, chaussures en cuir noires';
        }
      }

      if (!!!info1) {
        if (data.mission === "Vendeur" || data.mission === "Régisseur" || data.mission === "Street-marketeur" || data.mission === "Promoteur") {
          info1 = 'Jean noir, t-shirt uni, baskets noires';
        } else if (data.mission === "Serveur" || data.mission === "Barman" || data.mission === "Commis" || data.mission === "Runner" || data.mission === "Maître d'hôtel") {
          info1 = 'Tailleur pantalon noir, chemise noire, cravate noire, ballerines';
        } else if (data.mission === "Hôte d’accueil" || data.mission === "Responsable vestiaire" || data.mission === "Voiturier") {
          info1 = 'Robe sans manche noire, collants noirs, ballerines';
        }
      }
      return `<br>
                                     <label class="pull-left"> Tenues pour les hommes :</label>
                                     <br>
            <input type="text" name="" id="cldf-` + data.mission + `-` + data.i + `" class="form-control homme cloth-descr" value="` + info + `" required="required" placeholder="` + data.mission + `:" pattern="" title="">
              <br>
                                     <label class="pull-left"> Tenues pour les femmes :</label>
                                     <br>
            <input type="text" name="" id="cldf-` + data.mission + `-` + (data.i + 1) + `" class="form-control femme cloth-descr" value="` + info1 + `" required="required" placeholder="` + data.mission + `:" pattern="" title="">`;
    }
  },
  jobSelect: () => {

    var pattern = JSON.parse(localStorage.getItem('pattern'));

    let job = pattern.map((val, i) => {
      return val.mission;
    });
    var data = [];
    //Indifférent
    // pattern1 = _.where(pattern, {
    //     sex: 'Indifférent'
    // });
    // pattern = _.where(pattern, {
    //     sex: 'Homme'
    // });
    // pattern = _.flatten([pattern1, pattern]);

    miss = lodash.unionBy(pattern, 'mission');
    job = _.uniq(job);
    let newA = [];
    var count = 0;

    job.forEach((val, i) => {
      if (!!localStorage.getItem('suits-ids')) {
        var id = JSON.parse(localStorage.getItem('suits-ids'))[i];
        var cloth = Cloth.findOne(id);
      }

      // var clStore = JSON.parse(localStorage.getItem('suits-store'));
      // if (!!clStore && clStore.length > 0) {

      //   //Cloth.findOne({clStore);
      // }
      let temp = _.where(pattern, {
        mission: val
      });
      let temp1 = _.where(temp, {
        sex: 'Indifférent'
      });


      temp1 = temp1.map((val) => {
        if (!val) return;

        val.i = count;
        val.info = (!!cloth) ? cloth.info : '';
        count += 1;
        return val;
      });

      if (temp1.length > 0) {
        newA.push(temp1[0]);
        return;
      }
      let temp2 = _.where(temp, {
        sex: 'Homme'
      });
      let temp3 = _.where(temp, {
        sex: 'Femme'
      });
      if (!!temp2 && temp2.length > 0) {
        temp2 = temp2.map((val) => {
          if (!val) return;
          val.i = count + 1;
          val.info = (!!cloth) ? cloth.info : '';
          count += 1;
          return val;
        });
      }
      if (!!temp3 && temp3.length > 0) {
        temp3 = temp3.map((val) => {
          if (!val) return;
          val.info = (!!cloth) ? cloth.info : '';
          val.i = count + 1;
          count += 1;
          return val;
        });
      }

      if (temp2.length > 0 && temp3.length > 0) {
        temp2[0].sex = 'Indifférent';
        newA.push(temp2[0]);
      } else if (temp2.length > 0) {
        newA.push(temp2[0]);
      } else {
        newA.push(temp3[0]);
      }

    });

    newA.forEach((val, i) => {
      var foo = {
        mission: val.mission,
        i: i
      };
      foo.col = [val];
      console.log(foo);
      data.push(foo);
    });
    return data;
  },
  jobSelectF: () => {
    let pattern = JSON.parse(localStorage.getItem('pattern'));
    // let job = pattern.map(val => {
    //     return val.mission;
    // });
    //            sex: 'Femme'||'Indifférent'
    pattern1 = _.where(pattern, {
      sex: 'Indifférent'
    });

    pattern = _.where(pattern, {
      sex: 'Femme'
    });
    pattern = _.flatten([pattern1, pattern]);

    miss = lodash.unionBy(pattern, 'mission');
    // job = _.uniq(job);
    return miss;
  },
  sexPrefer: () => {
    return JSON.parse(localStorage.getItem('pattern'))[0].sex;
  },
  types: () => {

    var arr = JSON.parse(localStorage.getItem('pattern'));
    var arr2 = [];
    var count = 0;
    for (var i = 0; i < arr.length; i++) {
      var blob = false;

      for (var j = 0; j < i; j++) {
        if (i > 0 && arr[i].mission == arr[j].mission) blob = true;
      }
      if (!blob) {
        arr2.push({
          name: arr[i].mission,
          id: count
        });
        count++;
      }
    }
    console.log(arr2);
    return arr2;
  },

  missions: () => {
    return Missions.find({
      hostes: {
        $in: [Meteor.userId()]
      }
    }).count();
  },
  foo: () => {
    let pattern = JSON.parse(localStorage.getItem('pattern'));
    let job = pattern.map(val => {
      return val.mission;
    });
    job = _.uniq(job);
    //alert(job.length);
    let col = parseInt(JSON.parse(localStorage.getItem('hosts-col')));
    return _.range(0, job.length);
  },
  files: function () {
    var arr = Array.from(new Array(parseInt(JSON.parse(localStorage.getItem('hosts-col')))), () => 'a');

    console.log('aaaaa', Session.get('base-info'))

    var suits = Suits.find().fetch();
    var cl;
    var sp = JSON.parse(localStorage.getItem('sex-prefer')); // Session.get('sex-prefer');
    sp = sp.split('-');

    if (parseInt(sp[2]) > 0 || (parseInt(sp[0]) > 0 && parseInt(sp[1])) > 0 || sp[0] === 'Indifférent') {
      Session.set('sex-prefer', 'Indifférent');
      JSON.stringify(localStorage.setItem('sex-prefer', 'Indifférent'))
      cl = Cloth.find().fetch();
    } else if (parseInt(sp[0]) > 0 || sp[0] === 'Homme') {
      Session.set('sex-prefer', 'Homme');
      JSON.stringify(localStorage.setItem('sex-prefer', 'Homme'))
      //     if(sp[0] === 'Homme') {
      //         var caption = $('.caption').first();
      //         var id = caption.attr('id');
      //          var ids = Session.get('suits-ids');
      // if (ids.lastIndexOf(id) < 0) {
      //     ids.push(id);
      //     Session.set('suits-ids', ids);
      //     $('.required_box').first().addClass('clicked_box');
      // }
      //     }
      cl = Cloth.find({
        sex: 'Homme'
      }).fetch();
    } else if (parseInt(sp[1]) > 0 || sp[0] === 'Femme') {
      Session.set('sex-prefer', 'Femme');
      JSON.stringify(localStorage.setItem('sex-prefer', 'Femme'))
      cl = Cloth.find({
        sex: 'Femme'
      }).fetch();
    }

    var clid = cl.map((v, i) => {
      return v.suit_id;
    });
    Session.set('clid', clid)
    var data = [];
    data = Suits.find({
      _id: {
        $in: clid
      }
    }).fetch();
    data = cl.map((v, i) => {
      v.file = data[i];
      v.count = i;
      return v;
    });
    console.log(data);
    return data;
  }
});




Template.missionCreate5.helpers({
  finish: date => {
    if (date.length > 2) {
      date = date.slice(0, 2);
      date = parseInt(date);
      if (date > 24) {
        date = date - 24;
        date = date + 'h';
      }
    }
    return date;
  },
  fee: () => {
    var price = Session.get('price');
    return parseInt(.20 * price.total);
  },
  fullPrice: () => {
    let price = Session.get('price');
    return price.total + parseInt(.20 * price.total)
  },
  pick: () => {
    let price = Session.get('price');
    if (price.hr >= 16 && price.hr < 20) {
      return {
        color: 'col-red',
        text: ' Attention, le prix horaire que vous proposez est plus bas que la moyenne. Vous risquez de ne pas avoir les meilleurs profils pour votre mission.'
      };
    }
    // else if (price.hr <= 25)
    //   return {
    //     color: 'col-orange',
    //     text: 'Prix médiant'
    //   };
    else if (price.hr >= 21) {
      return {
        color: 'col-green',
        text: 'Bravo ! En augmentant le taux horaire vous augmentez vos chances d’avoir des profils qualifiés et motivés pour votre mission !'
      }
    }
  },
  genPdf: () => {
    if (!!Session.get('gopdf')) {
      let res = ReactiveMethod.call('getPdf', Session.get('gopdf'));
      if (!!res) {
        console.log('get it',res);
  //        var a = document.createElement('a');
  //  a.href = '/'+ res;
  //     a.setAttribute('target', '_blank');
  
  //  a.click();
  Session.set('gopdf',false);
        window.open('https://bemanners.com/' + res, '_blank');
        // window.location = '/' + res;
      }
    }

    // return '';
  },
  price: () => {

    return getPrice(); //Session.get('price').total;
  },
  hours: (s, f) => {
    return getMissHours(s, f);
  },
  preprice: () => {
    var price = JSON.parse(localStorage.getItem('price'));

    var baseInfo = Session.get('base-info');
    if (!baseInfo) {
      baseInfo = JSON.parse(localStorage.getItem('base-info'));
    }
    var begin = baseInfo.beginsTo;
    if (!begin) {
      begin = 1;
    }
    if (begin.length > 2) {
      begin = begin.slice(0, 2);
    } else {
      begin = begin.slice(0, 1);
    }
    var end = baseInfo.endsTo;
    if (!end) {
      end = 24;
    }
    if (end.length > 2) {
      end = end.slice(0, 2);
    } else {
      end = end.slice(0, 1);
    }
    begin = parseInt(begin);
    end = parseInt(end);
    var long = (end - begin);
    long = (long == 0) ? 1 : long;
    return (price.total / JSON.parse(localStorage.getItem('hosts-col'))) / long;
  },
  preprice2: () => {
    var price = JSON.parse(localStorage.getItem('price'));
    var baseInfo = Session.get('base-info');
    if (!baseInfo) {
      baseInfo = JSON.parse(localStorage.getItem('base-info'));
    }
    var begin = baseInfo.beginsTo;
    if (!begin) {
      begin = 1;
    }
    if (begin.length > 2) {
      begin = begin.slice(0, 2);
    } else {
      begin = begin.slice(0, 1);
    }
    var end = baseInfo.endsTo;
    if (!end) {
      end = 24;
    }
    if (end.length > 2) {
      end = end.slice(0, 2);
    } else {
      end = end.slice(0, 1);
    }
    begin = parseInt(begin);
    end = parseInt(end);
    var long = (end - begin);
    long = (long == 0) ? 1 : long;
    return price.total / long;
  },
  pattern: () => {
    // let pattern = Session.get('pattern');
    // let hostes= pattern.map( v => {
    //     let hostes =  _.findWhere(pattern,{date:v.date,mission:v.mission});
    //     let val = {};
    //     val.col = hostes.length;
    //     val.mission = hostes[0].mission

    // });
    return JSON.parse(localStorage.getItem('pattern')).map(
      val => {
        val.tx = Session.get('tax');
        val.date = translate(moment(val.date).locale('en').format("dddd Do MMM YYYY"));
        val.price = parseInt(Session.get('price').total / JSON.parse(localStorage.getItem('pattern')).length);
        return val;
      }
    );
  },
  hostes: () => {
    return JSON.parse(localStorage.getItem('hosts-col'));
  },
  test: function () {

  },
});


Template.missionCreate2.events({
  "click #miss-2-ind": (e) => {
    //$(e.target).attr('data');
    $('.button-colored').removeClass('active');
    $(e.target).addClass('active');
    $('.sex.pattern-' + $(e.target).attr('data') + ' select').val('Indifférent');
  },
  "click #miss-2-homme": (e) => {
    $('.button-colored').removeClass('active');
    $(e.target).addClass('active');
    $('.sex.pattern-' + $(e.target).attr('data') + ' select').val('Homme');
  },
  "click #miss-2-femme": (e) => {
    $('.button-colored').removeClass('active');
    $(e.target).addClass('active');
    $('.sex.pattern-' + $(e.target).attr('data') + ' select').val('Femme');
  }

});


Template.missionCreate5.onRendered(() => {
  Session.set('tax', parseInt($('#taux-horaire').val()));
});

Template.missionCreate5.events({
  "click #modalReg1": () => {
    $('#myModal11').modal({
      keyboard: true,
      backdrop: true
    });
  },
  'click #missPdf': () => {
    let baseInfo = Session.get('base-info');
    if (!baseInfo) {
      baseInfo = JSON.parse(localStorage.getItem('base-info'));
    }
    let pattern = JSON.parse(localStorage.getItem('pattern'));

    baseInfo.price = getPrice();
    baseInfo.pattern = pattern;
    let data = {
      mission: baseInfo,
      op: 'mission',
    };
    Session.set('gopdf', data);
  },
  'change #taux-horaire': function (event, template) {
    event.preventDefault();
    let val = parseInt($('#taux-horaire').val());
    if (val > 35 || val < 16) {
      $('#taux-horaire').val(20);
      return;
    }
    Session.set('tax', val);
    getPrice();
  },
  "click #processReg": function (event, template) {
    Router.go('/nouvelle-mission/5');
  }
});

Template.accountModal2.helpers({
  mission: () => {
    if (Session.get('missionId')) {
      return Missions.findOne({
        _id: Session.get('missionId')
      });
    }

  }
});
getMissHours = (s, f) => {
  var begin = s
  if (!begin) {
    begin = 1;
  }
  if (begin.length > 2) {
    begin = begin.slice(0, 2);
  } else {
    begin = begin.slice(0, 1);
  }
  var end = f;
  if (!end) {
    end = 24;
  }
  if (end.length > 2) {
    end = end.slice(0, 2);
  } else {
    end = end.slice(0, 1);
  }
  begin = parseInt(begin);
  end = parseInt(end);
  var long = (end - begin);
  return long;
}


getPrice = () => {
  // var baseInfo = JSON.parse(localStorage.getItem('base-info'));
  var pattern = JSON.parse(localStorage.getItem('pattern'));
  // HTTP.get('http://maps.google.com/maps/api/geocode/json', {
  //     params: {
  //         address: baseInfo.address
  //     }
  // }, (err, res) => {
  //    if (!err && res.data.results.length > 0) {
  // var hosts = JSON.parse(localStorage.getItem('hosts-col'));
  // hosts = parseInt(hosts);
  // console.log('hosts', hosts);
  // var curLat = res.data.results[0].geometry.location.lat;
  // var curLng = res.data.results[0].geometry.location.lng;
  var defLat = 48.8640493;
  var defLng = 2.3310526;
  var diffLat = 0;
  var diffLng = 0;
  var price = 0
  // diffLat = (curLat > defLat) ? defLat - curLat : curLat - defLat;

  // if (diffLat > 0.036) {
  //     //not in Paris
  //     price = 22;
  //     if (diffLat > 0.1) {
  //         //not close from Paris
  //         price = 25;
  //     }
  // }
  // if (curLng > defLng) {
  //     diffLng = curLng - defLng;
  // } else {
  //     diffLng = defLng - curLng;
  // }
  // if (diffLng > 0.076) {
  //     price = 22;
  //     if (diffLng > 0.19) {
  //         price = 25;
  //     }
  // }
  // if (price == 0) {
  //     price = 20;
  // }
  // var begin = baseInfo.beginsTo;
  // if (!begin) {
  //   begin = 1;
  // }
  // if (begin.length > 2) {
  //   begin = begin.slice(0, 2);
  // } else {
  //   begin = begin.slice(0, 1);
  // }
  // var end = baseInfo.endsTo;
  // if (!end) {
  //   end = 24;
  // }
  // if (end.length > 2) {
  //   end = end.slice(0, 2);
  // } else {
  //   end = end.slice(0, 1);
  // }
  // begin = parseInt(begin);
  // end = parseInt(end);
  // var duration = parseInt(baseInfo.duration.split(' ')[0]);
  // var long = (end - begin);
  // long = (long == 0) ? 1 : long;
  // if (long <= 2) {
  //   //Mission from 1 or 2 h => 25/h
  //   price += 5;
  // } else if (long > 9) { //Mission from more than 9h = 18/h
  //   price -= 2;
  // }
  // if (begin <= 7) {
  //   if (long < 3) {
  //     //         For the mission shortest than 3hours => 25/h
  //     price += 5;
  //   } else {
  //     //  For the mission longest than 3 hours => facturate on 25€ only the hours before 7h30 and 20h for the rest
  //   }
  // }
  // if (end > 22) {
  //   if (end > 23) {
  //     //For the mission who are going after 23h, faturate only the hours after 23 and the before on 20h/

  //   } else {
  //     //Mission after 23h(23h included) : 25/h
  //     price += 5;
  //   }
  // }
  price = 0;
  let total = 0;
  var tax = Session.get('tax') || 20;
  // var tax = parseInt($('#taux-horaire').val())||20;
  pattern = pattern.map((val, i) => {
    var dynPrice = 0;
    var begin = val.start;
    if (!begin) {
      begin = 1;
    }
    if (begin.length > 2) {
      begin = begin.slice(0, 2);
    } else {
      begin = begin.slice(0, 1);
    }
    var end = val.finish;
    if (!end) {
      end = 24;
    }
    if (end.length > 2) {
      end = end.slice(0, 2);
    } else {
      end = end.slice(0, 1);
    }
    begin = parseInt(begin);
    end = parseInt(end);
    var long = (end - begin);
    long = (long == 0) ? 1 : long;
    console.log('long', long, 'tax', tax);
    dynPrice = ((long * tax)) + price;
    val.price = dynPrice;
    val.id = i;
    val.hid = '';
    total += dynPrice;
    return val;
  });

  price = {
    total: total,
    hr: tax
  };
  Session.set('price', price);
  localStorage.setItem('pattern', JSON.stringify(pattern));
  localStorage.setItem('price', JSON.stringify(price));
  //  }

  // });
  return price.total;
}

Template.missionCreate7.helpers({
  hostes: () => {
    return Meteor.users.find({
      'profile.type': 'host'
    }, {
      limit: 50
    });
  },
  showSlider: () => {
    return (Session.get('mtype') !== 1) ? '' : 'hide';
  },
  storage: () => {
    var pattern = JSON.parse(localStorage.getItem('pattern'));
    if (!!pattern && pattern.length > 0)
      localStorage.setItem('pattern', JSON.stringify(pattern));
    // var suitsIds = Session.get('suits-ids');
    // if (!!suitsIds && suitsIds.length > 0)
    //     localStorage.setItem('suits-ids', JSON.stringify(suitsIds));
    var com = Companies.findOne({
      users: {
        $in: [Meteor.userId()]
      }
    });
    if (!!com && !!com.name) {
      return com.name
    }
    return false;
  },
  price: () => {
    //getPrice();
    // return Session.get('price').total;
  }
});

Template.missionCreate7.events({
  "click .request_button": (e) => {
    $('.request_button').removeClass('active');
    var id;
    if (!e.target.id) {
      id = $(e.target).parent().attr('id');
    } else {
      id = $(e.target);
    }

    $("#" + id).addClass('active');

    id = parseInt(id.split('-')[1]);
    //TODO unlock custom miss
    if (id !== 1) {
      swal("Le recrutement personnalisé n'est pas disponible pour le moment, il sera déployé très prochainement sur le site");
      id = 1;
    }
    Session.set('mtype', id);
  },
  "click #miss-pub": (e) => {
    let suits = {};
    suits = JSON.parse(localStorage.getItem('suits-ids'));
    suits = suits.h.concat(suits.f);
    var baseInfo = Session.get('base-info');
    if (!baseInfo) {
      baseInfo = JSON.parse(localStorage.getItem('base-info'));
    }
    var pattern = JSON.parse(localStorage.getItem('pattern'));

    var company = Companies.findOne({
      users: {
        $in: [Meteor.userId()]
      }
    });
    if (company && baseInfo) {
      company = company._id;
    } else {
      Meteor.logout(() => {
        sweetAlert('Il y a eu un petit problème..Veuillez réessayer dans quelques instants.');
      });
      return false;
    }
    let price = JSON.parse(localStorage.getItem('price'));
    var obj = {
      name: baseInfo.name,
      overview: baseInfo.overview,
      hostesCol: baseInfo.hostesCol,
      mtype: (Session.get('mtype') == 1) ? "EXPRESS" : "CUSTOM",
      address: baseInfo.address,
      city: baseInfo.city,
      zip: parseInt(baseInfo.zip),
      moreInfo: baseInfo.moreInfo,
      duration: baseInfo.duration,
      startDate: new Date(baseInfo.startDate[0]),
      beginsTo: baseInfo.beginsTo,
      referrer: baseInfo.referrer,
      endsTo: baseInfo.endsTo,
      preHostes: [],
      preHostes2: [],
      pattern: pattern,
      hr: (!!price) ? price.hr : 0,
      price: (!!price) ? price.total : 0,
      fee: .20 * price.total,
      rank: 0,
      suits: suits,
      hostes: [],
      company: company,
      creator: Meteor.userId(),
      status: 1,
      createdAt: new Date()
    };
    let full = Meteor.user().profile.full;
    if (!full) {
      $('#modal-notcomplete').modal('show');
      $('.gray_title_bg').hide();
      $('.complete_profile_statement').hide();
      document.querySelector('.customer_right').style.width = '100%';
      $('.order_bg,.profile_padding').removeClass('order_bg profile_padding');
      document.querySelectorAll('.customer_right input').forEach(e => {
        e.setAttribute('style', 'border-radius:10px !important');
      })

      //swal('Vos informations personnelles ne sont pas complètes, veuillez les remplir avant de pouvoir créer une mission.');
      return;
    }
    e.target.disabled = true;

    Missions.insert(obj, (err, res) => {
      localStorage.removeItem('suits-ids');
      localStorage.removeItem('pattern');
      localStorage.removeItem('sex-prefer');


      localStorage.removeItem('base-info');
      var cid = Session.get('cloth-id-cur');
      if (!!cid) {
        Cloth.update({
          _id: cid
        }, {
          $set: {
            mid: res
          }
        });
      }
      var type = '';
      if (!!Meteor.userId()) {
        var user = Meteor.user();
        type = user.profile.type;
      } else {
        type = 'guest';
      }
      let miss = Missions.findOne(res).name;
      $('.request_button').removeClass('active');
      Meteor.call('sendEmailAdm', 'La mission ' + miss + ' has been created !')
      Meteor.call('sendEmail',
        Meteor.user().emails[0].address,
        'julie@bemanners.com',
        'Julie de manners',
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
                    Bonjour ` + user.profile.nameManager + `,<br><br>
Nous vous confirmons que votre mission ` + baseInfo.name + ` a bien été publiée.
Nous reviendrons vers vous dès que des profils se seront inscrits.<br>
<br>
Cordialement,<br>
L'équipe Manners ☀️</span></span>
                </p>
        </div>

        </p>
        </div>
    </section>
<div style="margin-bottom: 45px;margin-left:auto;margin-right:auto;">
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

</html>`);


      Analytics.insert({
        date: new Date(),
        type: type,
        op: 'job',
        sex: JSON.stringify(localStorage.getItem('sex-prefer')),
        mtype: (Session.get('mtype') == 1) ? "EXPRESS" : "CUSTOM",
        name: user.profile.nameManager,
        data: Missions.findOne(res),
        path: Iron.Location.get().path
      });
      // if (!!suits) {
      //     suits.forEach((v, i) => {
      //     Cloth.insert({
      //         suit_id: v,
      //         mid: res,
      //         sex: Session.get('sex-prefer')
      //     });
      // });
      // }

      Session.set('missionId', res);
      // $('#myModal33').modal({
      //     keyboard: true,
      //     backdrop: true
      // });
      sweetAlert({
        title: "Bravo ",
        text: "Votre mission vient d'être publiée. Nous reviendrons vers vous dans quelques instants une fois que les Manners se seront inscrits."
      }, () => {
        Router.go('/client/mes-missions/' + res);
      });
    });
  },
  "click .rewiew_star": (e) => {
    console.log(e.target.id.split('-'));
    var id = parseInt(e.target.id.split('-')[2]);
    for (var i = 1; i <= id; i++) {
      $('#rewiew-star-' + i).removeClass('');
      $('#rewiew-star-' + i).addClass('active');
    }
  },
  "click .rewiew_star.active": (e) => {
    var id = parseInt(e.target.id.split('-')[2]);

    for (var i = 1; i <= 5; i++) {
      $('#rewiew-star-' + i).removeClass('active');
      $('#rewiew-star-' + i).addClass('');

    }
    for (var i = 1; i <= id; i++) {
      $('#rewiew-star-' + i).removeClass('');
      $('#rewiew-star-' + i).addClass('active');
    }
  },
  "click #mission-final": () => {
    $('#myModal33').modal('toggle');

    var id = parseInt($('.rewiew_star.active').attr('id').split('-')[2]);
    var mid = Session.get('missionId');
    Missions.update(mid, {
      $set: {
        rank: id
      }
    });
  },
  "submit #loginForm": (event, template) => {
    event.preventDefault();
    if (event.target.checkValidity()) {
      Meteor.loginWithPassword(
        event.target.email.value,
        event.target.password.value, (err) => {
          if (!err) {

          } else {
            sweetAlert('Vous avez fait une petite erreur...Recommencez!');
          }
        });

    } else {
      sweetAlert('Veuillez remplir le formulaire'); // form error message
    }

  },
  "click #modalReg": () => {

    $('#myModal2').modal({
      keyboard: true,
      backdrop: true
    });
  },
  "click #signUp": (e) => {
    e.preventDefault();
    var fields = document.querySelectorAll('#myModal2 input');
    var arr = Array.from(fields);
    var controls = [];
    var userObject = {
      username: "",
      mail: "",
      password: "",
      profile: {},
      createdAt: new Date()
    };
    arr.forEach((v) => {
      if (v.name === "manName") {
        userObject.username = v.value;
      } else if (v.name === "email") {
        userObject.email = v.value;
      } else if (v.name === "password") {
        userObject.password = v.value;
      } else if (v.type !== 'checkbox') {
        controls.push(v);
      }
    });

    controls.forEach((v) => {
      if (v.name !== 're-password') {
        userObject.profile[v.name] = v.value;
      }
    });

    Accounts.createUser(userObject, function (err) {
      if (!err) {
        Meteor.call('sendVerificationLink', (error, response) => {
          if (error) {
            alert(error.reason);
          } else {
            sweetAlert('Bravo !');
            Router.go('/nouvelle-mission/5');
          }
        });
      }
    });
  }
});

Template.missionCreate3.events({
  "change #add-photo": (e) => {
    // if (e.target.checked)
    //     $('#photo-area').removeClass('hide');
    // else
    //     $('#photo-area').addClass('hide');

  },
  "click #cloth-sbt-h": function () {
    $('#cloth-sbt-h').prop('disabled', true);
    let data = document.querySelectorAll('.cloth-descr.homme');
    var pack = [];
    if (data.length > 1) {
      data.forEach(val => {
        pack.push(Cloth.insert({
          info: val.value,
          sex: 'Homme',
          job: val.id.split('-')[1]
        }));
      });
    } else {
      console.log(data);
      pack.push(Cloth.insert({
        info: data[0].value,
        sex: 'Homme',
        job: data[0].id.split('-')[1]
      }));
    }
    if (!!localStorage.getItem('suits-ids')) {
      let arr2 = JSON.parse(localStorage.getItem('suits-ids'));
      pack = _.flatten([pack, arr2]);
    }

    localStorage.setItem('suits-ids', JSON.stringify(pack));
    // localStorage.setItem('suits-store', {,sid: JSON.stringify(pack)});
  },
  "click #cloth-sbt-f": function () {
    $('#cloth-sbt-f').prop('disabled', true);
    let data = document.querySelectorAll('.cloth-descr.homme');
    var pack = [];
    if (data.length > 1) {
      data.forEach(val => {
        pack.push(Cloth.insert({
          info: val.value,
          sex: 'Homme',
          job: val.id.split('-')[1]
        }));
      });
    } else {
      console.log(data);
      pack.push(Cloth.insert({
        info: data[0].value,
        sex: 'Homme',
        job: data[0].id.split('-')[1]
      }));
    }
    data = document.querySelectorAll('.cloth-descr.femme');
    var pack = [];
    if (data.length > 1) {
      data.forEach(val => {
        pack.push(Cloth.insert({
          info: val.value,
          sex: 'Femme',
          job: val.id.split('-')[1]
        }));
      });
    } else {
      pack.push(Cloth.insert({
        info: data[0].value,
        sex: 'Femme',
        job: data[0].id.split('-')[1]
      }));
    }
    if (!!localStorage.getItem('suits-ids')) {
      let arr2 = JSON.parse(localStorage.getItem('suits-ids'));
      pack = _.flatten([pack, arr2]);
    }

    localStorage.setItem('suits-ids', JSON.stringify(pack));
  },
  "click .caption": function (e) {
    e.preventDefault();
    //  var ids = Session.get('suits-ids');

    Session.set('suits-id', e.target.id);
    $('.caption').parent('.required_box').removeClass('clicked_box');
    $(e.target).parent('.required_box').addClass('clicked_box');

    // if (ids.lastIndexOf(e.target.id) < 0) {
    //   ///  ids.push(e.target.id);

    // } else {
    //     ids = ids.map((v) => {
    //         if (v !== e.target.id) return v;
    //     })
    //     Session.set('suits-ids', ids);
    //     $(e.target).parent('.required_box').removeClass('clicked_box');
    // }

  },

  "click .silhouette": function (e) {
    e.preventDefault();
    var ids = JSON.parse(localStorage.getItem('suits-ids')); //Session.get('suits-ids');
    var id = Session.get('suits-id');
    if (ids.lastIndexOf(id) < 0) {
      ids.push(id);
      //  Session.set('suits-ids', ids);
      $(e.target).parent('.required_box').parent('.col-md-3').parent('.col-md-12').addClass('clicked_silhouette');
    } else {
      ids = ids.map((v) => {
        if (v !== e.target.id) return v;
      })
      //  Session.set('suits-ids', ids);
      $(e.target).parent('.required_box').parent('.col-md-3').parent('.col-md-12').removeClass('clicked_silhouette');
    }

  },

  "click #button3": () => {
    var ids = {};
    if (!!localStorage.getItem('suits-ids')) {
      ids = JSON.parse(localStorage.getItem('suits-ids'));
    }
    let collect = {};
    let data = document.querySelectorAll('.cloth-descr.homme');
    var pack = [];
    var i = 0;
    console.log('ids', ids);
    // alert(val.id);
    if (data.length > 1) {
      data.forEach((val, i) => {
        if (!val) return;
        if (!val.value) return;
        var id;
        if (!!ids.h) {
          id = Cloth.update({
            _id: ids.h[i]
          }, {
            $set: {
              info: val.value,
              sex: 'Homme',
              job: val.id.split('-')[1],
              count: val.id.split('-')[2]
            }
          });
        }
        if (!id) {
          id = Cloth.insert({
            info: val.value,
            sex: 'Homme',
            job: val.id.split('-')[1],
            count: val.id.split('-')[2]
          });
        }
        pack.push(id);

      });
    } else {
      if (!!data[0] && !!data[0].value) {
        var id;
        if (!!ids.h) {
          var id = Cloth.update({
            _id: ids.h[0]
          }, {
            $set: {
              info: data[0].value,
              sex: 'Homme',
              job: data[0].id.split('-')[1],
              count: data[0].id.split('-')[2]
            }
          });
        }
        if (!id) {
          id = Cloth.insert({
            info: data[0].value,
            sex: 'Homme',
            job: data[0].id.split('-')[1],
            count: data[0].id.split('-')[2]
          });
        }
        pack.push(id);
      }

    }
    collect.h = pack;
    pack = [];
    id = [];
    var data1 = document.querySelectorAll('.cloth-descr.femme');
    if (data1.length > 1) {
      data1.forEach((val, i) => {
        if (!val) return;
        if (!val.value) return;
        if (!!ids.f) {
          var id = Cloth.update({
            _id: ids.f[i]
          }, {
            $set: {
              info: val.value,
              sex: 'Femme',
              job: val.id.split('-')[1],
              count: val.id.split('-')[2]
            }
          });
        }
        if (!id) {
          id = Cloth.insert({
            info: val.value,
            sex: 'Femme',
            job: val.id.split('-')[1],
            count: val.id.split('-')[2]
          });
        }
        pack.push(id);
      });
    } else {
      var id;
      if (!!ids.f) {
        var id = Cloth.update({
          _id: ids.f[0]
        }, {
          $set: {
            info: data[0].value,
            sex: 'Femme',
            job: data[0].id.split('-')[1],
            count: data[0].id.split('-')[2]
          }
        });
      }
      if (!id) {
        id = Cloth.insert({
          info: data[0].value,
          sex: 'Femme',
          job: data[0].id.split('-')[1],
          count: data[0].id.split('-')[2]
        });
      }
      pack.push(id);
    }
    collect.f = pack;
    pack = [];
    if (!!localStorage.getItem('suits-ids') && localStorage.getItem('suits-ids').length > 0) {
      let arr2 = JSON.parse(localStorage.getItem('suits-ids'));
      pack = _.flatten([pack, arr2]);
    }
    // let dataSt = {
    //   pid: val.id.split('-')[2],
    //   sid: JSON.stringify(pack)
    // };
    console.log(JSON.stringify(collect));
    localStorage.setItem('suits-ids', JSON.stringify(collect));
    // localStorage.setItem('suits-store', JSON.stringify(dataSt));

    // var ids = Session.get('suits-ids');
    //     var id = Session.get('suits-id');
    //     ids.push(id);
    //    // Session.set('suits-ids', ids);
    //     var cid = Session.get('cloth-id-cur');
    //     if (!!cid) {
    //         Cloth.update({
    //             _id: cid
    //         }, {
    //             $set: {
    //                 info: $('#cloth-info').val(),
    //                 sex: $('#cloth-sex').val()
    //             }
    //         });
    //     }
    Router.go('/nouvelle-mission/4');
  }
});


Template.missionCreate7.onRendered(() => {
  var owl = $("#owl-demo");

  owl.owlCarousel({
    items: 6, //10 items above 1000px browser width
    itemsDesktop: [1000, 6], //5 items between 1000px and 901px
    itemsDesktopSmall: [900, 3], // betweem 900px and 601px
    itemsTablet: [600, 2], //2 items between 600 and 0
    itemsMobile: false // itemsMobile disabled - inherit from itemsTablet option
  });

  // Custom Navigation Events
  $(".next1").click(function () {
    owl.trigger('owl.next');
  })
  $(".prev1").click(function () {
    owl.trigger('owl.prev');
  })
  $(".play1").click(function () {
    owl.trigger('owl.play', 1000); //owl.play event accept autoPlay speed as second parameter
  })
  $(".stop1").click(function () {
    owl.trigger('owl.stop');
  })

});

Template.MissionCreate.onRendered(() => {
  //   $('select').select2();

  $.fn.datepicker.dates['fr'] = {
    days: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
    daysShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    daysMin: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
    months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
    monthsShort: ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jui", "Aou", "Sep", "Oct", "Nov", "Dec"],
    today: "Aujourd'hui",
    clear: "Rafraîchir",
    format: "dd/mm/yyyy",
    titleFormat: "MM yyyy",
    /* Leverages same syntax as 'format' */
    weekStart: 0
  };
  var duration = $('#duration').val();

  var duration = parseInt(duration.split(' ')[0]);
  if (duration > 1) {
    var cols = _.range(0, duration);
    cols.forEach((v) => {
      $('#datetimepicker' + (v + 1)).datepicker({
        pickTime: false,
        language: 'fr'
      });
    });
  } else {
    $('#datetimepicker1').datepicker({
      pickTime: false,
      language: 'fr'
    });
  }
});


Template.MissionCreate.helpers({
  missMenu: () => {
    if (Iron.Location.get().path.split('/')[2] === '1') {
      return `<ul class="form_menu missioncreation-submenu-responsive">
                                    <li class="active"><span class="fa fa-info"></span><a href="/nouvelle-mission/1"> Détail</a></li>
                                    <li class="menu_devider"></li>
                                    <li><span class="fa fa-users"></span><a href="/nouvelle-mission/2"> Effectif</a></li>
                                    <li class="menu_devider"></li>
                                    <li><span class="fa fa-graduation-cap"></span><a href="/nouvelle-mission/3"> Tenue(s)</a></li>
                                    <li class="menu_devider"></li>
                                    <li><span class="fa fa-handshake-o"></span><a href="/nouvelle-mission/4"> Tarif</a></li>
                                    <li class="menu_devider"></li>
                                    <li ><span class="fa fa-check"></span> <a href="/nouvelle-mission/5">Validation</a></li>
        </ul>`
    } else if (Iron.Location.get().path.split('/')[2] === '2') {
      return `<ul class="form_menu missioncreation-submenu-responsive">
                                    <li><span class="fa fa-info"></span><a href="/nouvelle-mission/1"> Détail</a></li>
                                    <li class="menu_devider"></li>
                                    <li class="active"><span class="fa fa-users"></span><a href="/nouvelle-mission/2"> Effectif</a></li>
                                    <li class="menu_devider"></li>
                                    <li><span class="fa fa-graduation-cap"></span><a href="/nouvelle-mission/3"> Tenue(s)</a></li>
                                    <li class="menu_devider"></li>
                                    <li><span class="fa fa-handshake-o"></span><a href="/nouvelle-mission/4"> Tarif</a></li>
                                    <li class="menu_devider"></li>
                                    <li ><span class="fa fa-check"></span> <a href="/nouvelle-mission/5">Validation</a></li>
        </ul>`;
    } else if (Iron.Location.get().path.split('/')[2] === '3') {
      return `<ul class="form_menu missioncreation-submenu-responsive">
                                    <li><span class="fa fa-info"></span><a href="/nouvelle-mission/1"> Détail</a></li>
                                    <li class="menu_devider"></li>
                                    <li><span class="fa fa-users"></span><a href="/nouvelle-mission/2"> Effectif</a></li>
                                    <li class="menu_devider"></li>
                                    <li class="active"><span class="fa fa-graduation-cap"></span><a href="/nouvelle-mission/3"> Tenue(s)</a></li>
                                    <li class="menu_devider"></li>
                                    <li><span class="fa fa-handshake-o"></span><a href="/nouvelle-mission/4"> Tarif</a></li>
                                    <li class="menu_devider"></li>
                                    <li ><span class="fa fa-check"></span> <a href="/nouvelle-mission/5">Validation</a></li>
        </ul>`;
    } else if (Iron.Location.get().path.split('/')[2] === '4') {
      return `<ul class="form_menu missioncreation-submenu-responsive">
                                    <li><span class="fa fa-info"></span><a href="/nouvelle-mission/1"> Détail</a></li>
                                    <li class="menu_devider"></li>
                                    <li><span class="fa fa-users"></span><a href="/nouvelle-mission/2"> Effectif</a></li>
                                    <li class="menu_devider"></li>
                                    <li class="active"><span class="fa fa-graduation-cap"></span><a href="/nouvelle-mission/3"> Tenue(s)</a></li>
                                    <li class="menu_devider"></li>
                                    <li class="active"><span class="fa fa-handshake-o"></span><a href="/nouvelle-mission/4"> Tarif</a></li>
                                    <li class="menu_devider"></li>
                                    <li ><span class="fa fa-check"></span> <a href="/nouvelle-mission/5">Validation</a></li>
        </ul>`;
    } else if (Iron.Location.get().path.split('/')[2] === '4') {
      return `<ul class="form_menu missioncreation-submenu-responsive">
                                    <li><span class="fa fa-info"></span><a href="/nouvelle-mission/1"> Détail</a></li>
                                    <li class="menu_devider"></li>
                                    <li><span class="fa fa-users"></span><a href="/nouvelle-mission/2"> Effectif</a></li>
                                    <li class="menu_devider"></li>
                                    <li ><span class="fa fa-graduation-cap"></span><a href="/nouvelle-mission/3"> Tenue(s)</a></li>
                                    <li class="menu_devider"></li>
                                    <li class="active"><span class="fa fa-handshake-o"></span><a href="/nouvelle-mission/4"> Tarif</a></li>
                                    <li class="menu_devider"></li>
                                    <li class="active"><span class="fa fa-check"></span> <a href="/nouvelle-mission/5">Validation</a></li>
        </ul>`;
    }


  }
});
Template.MissionCreate.events({
  "change #host-col": () => {
    let col = parseInt(document.querySelector('#host-col').value);
    if (col >= 10) {
      swal({
        title: 'info',
        text: 'Nous sommes actuellement en phase de bétâ. Pour vos opérations nécessitant plus de 10 Manners, veuillez nous contacter au 01.76.39.00.01 ou par mail à contact@bemanners.com'
      })
    }
  },
  "click #button1": (event, template) => {
    event.preventDefault();
    var form = document.querySelector('form');
    var inputs = document.getElementsByClassName('form-control');
    var hostsCol = document.querySelector('#host-col');
    localStorage.setItem('hosts-col', JSON.stringify(hostsCol.value));
    // Session.set('hosts-col', hostsCol.value);
    var baseInfo = Session.get('base-info') || {};
    var canContinue = true;
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];

      if (!input.checkValidity()) {
        input.classList.add("not-valid");
        canContinue = false;
      } else {
        input.classList.remove("not-valid");
      }
    }

    if (form.checkValidity() && canContinue) {

      baseInfo.name = $('#name').val();
      baseInfo.referrer = $('#referrer').val();
      baseInfo.overview = $('#overview').val();
      baseInfo.duration = $('#duration').val();
      var duration = parseInt(baseInfo.duration.split(' ')[0]);
      baseInfo.hostesCol = parseInt(hostsCol.value) * duration;
      if (duration == 1) {
        var date = [$('#start-date-' + 1).val()]
      } else {
        var cols = _.range(1, duration + 1);
        var date = cols.map((v) => {
          return $('#start-date-' + v).val();
        });
      }
      date = date.map((v) => {
        if (!v) return false;
        v = v.split('/');
        v = v[1] + "/" + v[0] + "/" + v[2];
        return v;
      });
      baseInfo.startDate = date;
      baseInfo.endMission = $('#end-mission').val();
      baseInfo.beginsTo = $('#begins-to').val();
      baseInfo.endsTo = $('#ends-to').val();
      baseInfo.address = $('#address').val();
      baseInfo.moreInfo = $('#more-info').val();
      baseInfo.zip = $('#zip').val();
      baseInfo.city = $('#city').val();


      Session.set('base-info', baseInfo);
      localStorage.setItem('base-info', JSON.stringify(baseInfo));
      Router.go('/nouvelle-mission/2')


    } else {
      $.notify("Veuillez remplir les champs requis", "Attention");
    }
  },
  "click .selectPlace": (e) => {
    $('#address').val(e.target.innerHTML);
    HTTP.get('https://maps.google.com/maps/api/geocode/json', {
      params: {
        address: e.target.innerHTML
      }
    }, (err, res) => {
      console.log(res);
      $('#city').val(res.data.results[0].address_components[2].short_name);
      $('#zip').val(res.data.results[0].address_components[6].short_name);
      $('#address').val(res.data.results[0].address_components[0].short_name + " " + res.data.results[0].address_components[1].short_name)
    });
    Session.set('geoauto', []);
  },
  "input #address": (e) => {
    Meteor.call('geoAutocompl', e.target.value, (err, res) => {
      let data = res.predictions;
      data = data.map(res => res.description);
      Session.set('geoauto', data);
    });
  },
  "click #button4": () => {
    Router.go('/nouvelle-mission/5');

  },
  "click #buttonretour2": () => {
    Router.go('/nouvelle-mission/1');
    UI.insert(UI.render(Template.MissionCreate), $(''));
  },
  "click #buttonretour3": () => {
    Router.go('/nouvelle-mission/2');

  },
  "click #buttonretour4": () => {
    Router.go('/nouvelle-mission/3');
    UI.insert(UI.render(Template.missionCreate3), $(''));

  },
  "click #buttonretour5": () => {
    Router.go('/nouvelle-mission/4');

  },
  "click #button2": (event) => {
    event.preventDefault();
    var pattern = document.querySelectorAll('.sex select');
    var info = Session.get('base-info');
    if (!info) {
      info = JSON.parse(localStorage.getItem('base-info'));
    }
    var hostsCol = JSON.parse(localStorage.getItem('hosts-col'));
    var sexes = [];
    var hostes = [];
    var sexQuery = {
      homme: 0,
      femme: 0
    };

    Array.from(pattern).forEach((v) => {
      if (v.value === 'Homme') {
        sexQuery.homme += 1;
      } else if (v.value === 'Femme') {
        sexQuery.femme += 1;
      } else {
        sexQuery.homme += 1;
      }
      sexes.push(v.value);
    });


    console.log('----1-', pattern);

    pattern = document.querySelectorAll('.mission select');
    var missions = [];
    Array.from(pattern).forEach((v) => {
      missions.push(v.value);
    });

    pattern = document.querySelectorAll('.start select');
    var starts = [];
    Array.from(pattern).forEach((v) => {
      starts.push(v.value);
    });

    pattern = document.querySelectorAll('.finish select');
    var finishes = [];
    Array.from(pattern).forEach((v) => {
      finishes.push(v.value);
    });

    pattern = document.querySelectorAll('.finish select');
    var duration = parseInt(info.duration.split(' ')[0]);
    var hostCounter = parseInt(info.duration.split(' ')[0]);
    var dates = info.startDate;
    console.log('dates', dates);
    dates = dates.map((v) => {
      return new Date(v);
    })

    pattern = [];
    let sep = finishes.length / dates.length;
    let count = sep;
    pattern = finishes.map((val, i) => {
      let pattern = {};
      if ((i) == sep) {
        sep += count;
      }
      pattern.finish = val;
      pattern.start = starts[i];
      pattern.mission = missions[i];
      pattern.price = 0;
      pattern.sex = sexes[i];
      console.log('caches', parseInt(sep / dates.length) - 1);
      pattern.date = new Date(dates[parseInt(sep / count) - 1]);

      return pattern;
    });
    // for (var i in finishes) {
    //     if (finishes.hasOwnProperty(i)) {
    //         var date = new Date();
    //         //  if (!dates[i]) {
    //         if (!!dates[i]) {
    //             date = dates[i];
    //         } else {
    //             date = dates[0];
    //         }
    //         //  }

    //         pattern[i] = {
    //             finish: finishes[i],
    //             start: starts[i],
    //             mission: missions[i],
    //             sex: sexes[i],
    //             date: new Date(date),
    //             price: 0
    //         };
    //     }
    // }
    Session.set('pattern', pattern);
    localStorage.setItem('pattern', JSON.stringify(pattern));
    var sex = document.querySelectorAll('.sex select');
    var h = 0,
      f = 0,
      ind = 0;
    Array.from(sex).forEach((v, i) => {
      if (v.value === 'Homme') {
        h += 1;
      } else if (v.value === 'Femme') {
        f += 1;
      } else {
        ind += 1;
      }
    });
    JSON.stringify(localStorage.setItem('sex-prefer', h + '-' + f + '-' + ind))
    Session.set('sex-prefer', h + '-' + f + '-' + ind);
    Meteor.setTimeout(function () {
      Router.go('/nouvelle-mission/3');
    }, 500);
  }
});
