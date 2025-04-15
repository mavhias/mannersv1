import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';
import $ from 'jquery';

var subs = new SubsManager({
  // will be cached only 20 recently used subscriptions
  cacheLimit: 20,
  // any subscription will be expired after 5 minutes of inactivity
  expireIn: 5
});
//Router.plugin('dataNotFound', {notFoundTemplate: '404'});


// Router.onBeforeAction(function(req, res, next) {

//     var allRoutes = _.map(Router.routes, function(route){
//       var routeName = typeof route.getName() === 'undefined' ?
//                       route.path() :
//                       route.getName(); 
//       return routeName
//     });
//   // in here next() is equivalent to this.next();
//   var re = new RegExp('/', 'g')
//   console.log(req.url.replace(re, '.'), allRoutes);
//   next();
// }, {where: 'server'});

FlowRouter.route('/', {
  name: 'home',
  action() {
    if (!Meteor.isClient) {
      return;
    }
    if ($(window)) {
      $(window).scrollTop(0);
    }
    this.render('AccueilHote');
  }
});

FlowRouter.route('/devenir-manners', {
  name: 'become',
  action() {
    if (!Meteor.isClient) {
      return;
    }
    this.render('Become');
  }
});

FlowRouter.route('/questions-frequentes', {
  onAfterAction: function () {
    $(window).scrollTop(0);
    if (!Meteor.isClient) {
      return;
    }
    //post = this.data().post;
  },
  action: function () {
    this.render('Faq');
  }
});

FlowRouter.route('/comment-ca-marche', {
  onAfterAction: function () {
    $(window).scrollTop(0);
    if (!Meteor.isClient) {
      return;
    }
    //post = this.data().post;
  },
  action: function () {
    this.render('How');
  }
});


FlowRouter.route('/tenues', {
  onAfterAction: function () {
    $(window).scrollTop(0);
    if (!Meteor.isClient) {
      return;
    }
    //post = this.data().post;
  },
  action: function () {
    this.render('Uniform');
  }
});

FlowRouter.route('/inscription', {
  onAfterAction: function () {
    // if (!Meteor.isClient) {
    //     return;
    // }
  },
  action: function () {
    // setTimeout(function(){location.reload(true)},300);
    this.render('GuestRegister');
  }
});

// Router.route('/blog', function() {
//     window.location = 'http://be-independant.com/';
// });

FlowRouter.route('/instagram', function () {
  window.location = 'https://www.instagram.com/be_manners/';
});

FlowRouter.route('/facebook', function () {
  window.location = 'https://www.facebook.com/bemanners';
});

FlowRouter.route('/twitter', function () {
  window.location = 'https://www.twitter.com/bemanners';
});

FlowRouter.route('/linkedin', function () {
  window.location = 'https://www.linkedin.com/company/be-manners?trk=biz-companies-cym';
});



FlowRouter.route('/show-users', {
  onAfterAction: function () {
    $(window).scrollTop(0);
  },
  waitOn: function () {
    return [
      subs.subscribe('files.images.all'),
      subs.subscribe('files.cvs.all')
      //  Meteor.subscribe("images", "all")
    ];
  },
  action: function () {
    this.render('ShowUsers');
  }
});


FlowRouter.route('/mango-form/:id', {
  onAfterAction: function () {
    $(window).scrollTop(0);
  },
  action: function () {
    this.render('MangoForm' + this.params.id);
  }
});

FlowRouter.route("/connexion", function () {
  this.render("Login");
});

FlowRouter.route("/nouvelle-mission/:nav", {
  onAfterAction: function () {
    if (!Meteor.isClient) {
      return;
    }
    if ($(window)) {
      $(window).scrollTop(0);
    }
  },
  action: function () {
    var nav = this.params.nav;
    this.render("MissionCreate", {
      data: () => {
        return {
          nav: parseInt(nav)
        }
      }
    });
  }
});

FlowRouter.route("/vos-tenues", function () {
  this.render("UploadSuits1");
});

FlowRouter.route("/paiement-confirmed/:mid", function () {
  this.render("paiementConfirmed");
});

FlowRouter.route("/verify-email/:token", {
  action: function () {
    Accounts.verifyEmail(this.params.token, function (error) {
      if (error) {
        alert(error.reason);
      } else {


      }
    });
  }
});

FlowRouter.route('/client/mes-missions', {
  loadingTemplate: 'preloader',
  waitOn: function () {
    // return one handle, a function, or an array
    return [subs.subscribe('missions'), subs.subscribe('companies'), subs.subscribe('files.images.all')];
  },
  action: function () {
    this.render('ClientMission');
  }
});

// Router.route('/calend', {
//         where: 'server'
//     })
//     .get(function () {
//         console.log(this.request);
//         this.response.end('get request\n');
//     })
//     .post(function () {
//         this.response.end('post request\n');
//     });


FlowRouter.route('/calend/', {
  where: 'server',
  action() {
    Calends.insert(this.request.body);
    this.response.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8'
    });
    this.response.end(JSON.stringify({
      ok: "ok"
    }));
  }
});

// Router.route('/calend', {
//   where: 'server'
// }).get(function () {
//   console.log(this.request);
//   this.response.statusCode = 200;
//   this.response.setHeader("Content-Type", "application/json");
//   this.response.setHeader("Access-Control-Allow-Origin", "*");
//   this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   this.response.end('Referral was successfully created');
// }).post(function () {
//   console.log(this.request);
//   this.response.statusCode = 200;
//   this.response.setHeader("Content-Type", "application/json");
//   this.response.setHeader("Access-Control-Allow-Origin", "*");
//   this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   this.response.end('Referral was successfully created');
// });



FlowRouter.route('/client/profils-favoris', {
  loadingTemplate: 'preloader',
  onAfterAction: function () {
    $(window).scrollTop(0);

  },
  waitOn: function () {
    // return one handle, a function, or an array
    return [subs.subscribe("userList", "cus"), subs.subscribe('recomendations'),
      subs.subscribe('files.images.all'), subs.subscribe('favorites')
    ];
  },
  action: function () {
    this.render('ClientRecom');
  }
});

FlowRouter.route('/client/mes-missions/:id', {
  loadingTemplate: 'preloader',
  waitOn: function () {
    return [subs.subscribe('missions'), subs.subscribe('companies'), subs.subscribe('userList', 'all'), subs.subscribe('files.images.all')

      ///       Meteor.subscribe("images", "all"), Meteor.subscribe("newImages", "all")
    ];
  },
  action: function () {
    this.render('ClientMissGen');
  }
});


FlowRouter.route('/client/compte', {
  loadingTemplate: 'preloader',
  waitOn: function () {
    // return one handle, a function, or an array
    return [subs.subscribe('missions'), subs.subscribe('companies'), subs.subscribe('files.images.all')];
  },
  action: function () {
    this.render('ClientCompte');
  }
});


FlowRouter.route('/client/messagerie', {
  // loadingTemplate: 'preloader',
  // waitOn: function () {
  //     return [subs.subscribe('missions'), subs.subscribe('companies'), subs.subscribe('userList', 'chat')
  //     ];
  // },
  action: function () {
    window.history.back();
    //this.render('ClientChat');
  }
});


FlowRouter.route('/client/history', function () {
  this.render('ClientHistory');
});

FlowRouter.route('/client/history/:op', function () {
  this.render('ClientHistory');
});

FlowRouter.route('/partenaire/messagerie', {
  // loadingTemplate: 'preloader',
  // waitOn: function () {
  //     return [subs.subscribe('missions'), subs.subscribe('companies'),
  //             subs.subscribe('files.images.all')
  //     ];
  // },
  action: function () {
    window.history.back();
    //this.render('HoteChat');
  }
});

FlowRouter.route('/partenaire/mes-missions', {
  loadingTemplate: 'preloader',
  waitOn: function () {
    return [
      subs.subscribe('missions'), subs.subscribe('companies'), subs.subscribe('files.images.all')
    ];
  },
  action: function () {
    this.render('HoteMission');
  }
});

FlowRouter.route('/partenaire/historique', {
  loadingTemplate: 'preloader',
  waitOn: function () {
    return [subs.subscribe('recomendations'), subs.subscribe('profiles'), subs.subscribe('missions')];
  },
  action: function () {
    this.render('HoteHistory');
  }
});

FlowRouter.route('/partenaire/historique/:op', {
  loadingTemplate: 'preloader',
  action: function () {
    this.render('HoteHistory');
  }
});

FlowRouter.route('/partenaire/profil', {
  waitOn: function () {
    return [subs.subscribe('files.images.all'), subs.subscribe('profiles'), subs.subscribe('recomendations'), subs.subscribe('missions')];
  },
  action: function () {
    this.render('HoteProfile');
  }
});

FlowRouter.route('/partenaire/profil/:id/', {
  loadingTemplate: 'preloader',
  waitOn: function () {
    return [subs.subscribe('missions'), subs.subscribe('companies'), subs.subscribe('profiles'), subs.subscribe('userList', 'all'), subs.subscribe('recomendations'),
      subs.subscribe('files.images.all'), subs.subscribe('favorites')
    ];
  },
  action: function () {
    this.render('HoteProfile');
  }
});

FlowRouter.route('/partenaire/mission/:id', {
  loadingTemplate: 'preloader',
  waitOn: function () {
    return [subs.subscribe('missions'), subs.subscribe('userList', 'all'), subs.subscribe('companies'),
      subs.subscribe('files.images.all')
    ];
  },
  action: function () {
    this.render('HoteGeneral');
  }
});

FlowRouter.route('/inscrivez-vous', function () {
  this.render('WindowRegistration');

});

FlowRouter.route('/pagepresentation', function () {
  this.render('pageprez');

});

FlowRouter.route('/partenaire/compte', {
  loadingTemplate: 'preloader',
  waitOn: function () {
    return [subs.subscribe('profiles')];
  },
  action: function () {
    this.render('HoteCompte');
  }
});

FlowRouter.route('/accueil-client', {
  loadingTemplate: 'preloader',
  waitOn: function () {
    return [
      subs.subscribe("userList", "cus"),
      subs.subscribe('files.images.all')
    ];
  },

  action: function () {
    this.render('AccueilClient');
  }
});

FlowRouter.route('/bic', {
  action: function () {
    this.render('bic');
  }
});

FlowRouter.route('/administration/:op', {
  loadingTemplate: 'preloader',
  // waitOn: function () {
  //   // return one handle, a function, or an array
  //   //subs.subscribe('analytics')
  //   return [subs.subscribe('analytics'), subs.subscribe('calends'), subs.subscribe('userList', 'all'),
  //     subs.subscribe("storegen"), subs.subscribe("favorites"),
  //     subs.subscribe('files.images.all'), subs.subscribe('files.png.all'),
  //     subs.subscribe('files.cni.all')
  //   ];
  // },
  action: function () {
    if (!!Meteor.userId() && Meteor.user().profile.type === 'admin') {
      this.render('Admin');
    } else {
      FlowRouter.go('/');
    }
  }
});

FlowRouter.route('/blog', {
  loadingTemplate: 'preloader',
  waitOn: function () {
    return [subs.subscribe('posts')];
  },
  action: function () {
    this.render('Blog');
  }
});

FlowRouter.route('/blog/:post', {
  waitOn: function () {
    return [subs.subscribe('posts')];
  },
  action: function () {
    this.render('BlogPost');
  }
});


FlowRouter.route('/job/serveur', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('JobServeur');
  }
});

FlowRouter.route('/job/barman', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('JobBarman');
  }
});

FlowRouter.route('/job/voiturier', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('JobVoiturier');
  }
});

FlowRouter.route('/job/vestiaire', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('JobVestiaire');
  }
});

FlowRouter.route('/job/accueil', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('JobAccueil');
  }
});

FlowRouter.route('/job/service', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('JobService');
  }
});

FlowRouter.route('/job/pointage', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('JobPointage');
  }
});

FlowRouter.route('/contact', function () {
  this.render('Contact');
});

FlowRouter.route('/nouvelle-mission/4', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('NouvelleMission4');
  }
});

FlowRouter.route('/paiement', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('PaiementMango');
  }
});

FlowRouter.route('/newhome', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('newHome');
  }
});



FlowRouter.route('/paiement/cb', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('paiementCb');
  }
});

FlowRouter.route('/paiement/sepa', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('PaiementSepa');
  }
});

FlowRouter.route('/paiement/virement', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('PaiementVir');
  }
});

/*
 Invoice SSR generator
 */

FlowRouter.route('/paiement/in/:price', {
  waitOn: function () {
    return [Meteor.subscribe('missions')];
  },
  action: function () {
    this.render('PaiementIn');
  }
});

// Router.route('/oauth2callback', function () {
//     var req = this.request;
//     var res = this.response;
//     res.end(this.request.query.code);
// }, {
//     where: 'server'
// });

/* Router.route('/get-invoice/:payinId', function () {
    const self = this;

    MangoPaySDK.payin.fetch(this.params.payinId, function (err, list) {
        if (err || !list) {
            console.error(err);
        } else {
            var user = Meteor.users.findOne({
                mangoUserId: list.AuthorId
            });
            var doc = new PDFDocument({
                size: 'A4',
                margin: 50
            });
            doc.fontSize(12);

            // Generate Bill Template :
            doc.text("Facture établie par Manners au nom et pour le compte de : ", 20, 10, {
                align: 'center',
                width: 500
            });
            doc.text("User : " + user.profile.nameManager + ' ' + user.profile.lastNameManager, 20, 30, {
                align: 'center',
                width: 500
            });
            doc.text("Facture N° : " + self.params.payinId, 20, 50, {
                align: 'center',
                width: 500
            });
            doc.text("Total : " + list.DebitedFunds.Amount + '€', 20, 70, {
                align: 'center',
                width: 500
            });
            doc.text("TTVA non applicable, article 293 B du code général des impôts.", 20, 90, {
                align: 'center',
                width: 500
            });
            doc.text("Manners SAS - 95, Avenue Achille Peretti, 92200, Neuilly sur Seine", 20, 110, {
                align: 'center',
                width: 500
            });
            doc.text("RCS : 818 722 860 00017", 20, 130, {
                align: 'center',
                width: 500
            });

            self.response.writeHead(200, {
                'Content-type': 'application/pdf',
                'Content-Disposition': "attachment; filename=facture.pdf"
            });
            self.response.end(doc.outputSync());
        }
    });
}, {
    where: 'server'
});

*/


// Router.configure({
//     loadingTemplate: 'preloader',
//     notFoundTemplate: "404"
// });

FlowRouter.route('/login/admin', function () {
  this.render('loginDashboard');
});

FlowRouter.route('/admindeux', function () {
  this.render('admindeux');
});
FlowRouter.route('/invoices', function () {
  this.render('invoice')
});

FlowRouter.route('/error/403', function () {
  this.render('403');
}, {
  name: 'error/403'
});
FlowRouter.route('/error/503', function () {
  this.render('503');
}, {
  name: 'error/503'
});
FlowRouter.route('/error/500', function () {
  this.render('500');
}, {
  name: 'error/500'
});

FlowRouter.route('/accueil', function () {
  this.render('AccueilClientInt');
}, {
  name: 'accueil'
});


FlowRouter.route('/404test', function () {
  this.render('404int');
}, {
  name: '404integrer'
});

// Router.route('pageNotFound', {
//     path: '/(.*)',
//     action: function () {
//         this.render('404');
//     }
// });
