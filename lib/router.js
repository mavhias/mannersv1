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

Router.route('/', {

  onAfterAction: function () {
    if (!Meteor.isClient) {
      return;
    }
    SEO.set({
      title: "Manners | Les meilleurs freelances en événementiel",
      meta: {
        'description': "Travaillez directement avec des freelances pour des missions d'accueil, service, animation, vente. Facturation et paiement en ligne simplifiés."
      },
      og: {
        'title': 'Manners',
        'description': 'Manners'
      }
    });
    if ($(window)) {
      $(window).scrollTop(0);
    }
  },
  action: function () {
    this.render('Home');
  }
});

Router.route('/devenir-manners', {
  onAfterAction: function () {

    //post = this.data().post;
    SEO.set({
      title: "Manners | Gagnez de l'argent en réalisant des missions ponctuelles",
      meta: {
        'description': "Réalisez des missions ponctuelles pour des événements, des opérations ou des missions en interne. Travaillez directement avec les entreprises."
      },
      og: {
        'title': '',
        'description': ''
      }
    });
  },
  action: function () {
    this.render('Become');
  }
});

Router.route('/questions-frequentes', {
  onAfterAction: function () {
    $(window).scrollTop(0);
    if (!Meteor.isClient) {
      return;
    }
    //post = this.data().post;
    SEO.set({
      title: "Manners | Questions fréquentes",
      meta: {
        'description': "Fonctionnement, tarifs, sécurité, facturation, paiements. Retrouvez ici les réponses à toutes vos questions."
      },
      og: {
        'title': '',
        'description': ''
      }
    });
  },
  action: function () {
    this.render('Faq');
  }
});

Router.route('/comment-ca-marche', {
  onAfterAction: function () {
    $(window).scrollTop(0);
    if (!Meteor.isClient) {
      return;
    }
    //post = this.data().post;
    SEO.set({
      title: "Manners | Comment ca marche ?",
      meta: {
        'description': "Manners est une plateforme qui simplifie la mise en relation entre des jeunes et des entreprises pour la réalisation de missions ponctuelles en événementiel."
      },
      og: {
        'title': '',
        'description': ''
      }
    });
  },
  action: function () {
    this.render('How');
  }
});


Router.route('/tenues', {
  onAfterAction: function () {
    $(window).scrollTop(0);
    if (!Meteor.isClient) {
      return;
    }
    //post = this.data().post;
    SEO.set({
      title: "Manners | Les tenues de nos partenaires ",
      meta: {
        'description': "Choisissez la tenue la plus adaptée à vos besoins. Nos partenaires travaillent avec leurs propres tenues."
      },
      og: {
        'title': '',
        'description': ''
      }
    });
  },
  action: function () {
    this.render('Uniform');
  }
});

Router.route('/inscription', {
  onAfterAction: function () {
    // if (!Meteor.isClient) {
    //     return;
    // }
    SEO.set({
      title: "Manners | Inscrivez-vous chez Manners",
      meta: {
        'description': "Vous êtes une entreprise ? Inscrivez-vous gratuitement. Vous souhaitez devenir Manners ? Inscrivez-vous et venez à notre rencontre."
      },
      og: {
        'title': '',
        'description': ''
      }
    });
  },
  action: function () {
    // setTimeout(function(){location.reload(true)},300);
    this.render('GuestRegister');
  }
});

// Router.route('/blog', function() {
//     window.location = 'http://be-independant.com/';
// });

Router.route('/instagram', function () {
  window.location = 'https://www.instagram.com/be_manners/';
});

Router.route('/facebook', function () {
  window.location = 'https://www.facebook.com/bemanners';
});

Router.route('/twitter', function () {
  window.location = 'https://www.twitter.com/bemanners';
});

Router.route('/linkedin', function () {
  window.location = 'https://www.linkedin.com/company/be-manners?trk=biz-companies-cym';
});



Router.route('/show-users', {
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


Router.route('/mango-form/:id', {
  onAfterAction: function () {
    $(window).scrollTop(0);
  },
  action: function () {
    this.render('MangoForm' + this.params.id);
  }
});

Router.route("/connexion", function () {
  SEO.set({
    title: "Manners | Connectez-vous sur votre espace perso",
    meta: {
      'description': "Vous êtes une entreprise ? Connectez-vous pour créer une mission. Vous êtes Manners ? Connectez-vous pour postuler à une mission."
    },
    og: {
      'title': '',
      'description': ''
    }
  });
  this.render("Login");
});

Router.route("/nouvelle-mission/:nav", {
  onAfterAction: function () {
    if (!Meteor.isClient) {
      return;
    }
    SEO.set({
      title: "Manners | Les meilleurs freelances en événementiel",
      meta: {
        'description': "Travaillez directement avec des freelances pour des missions d'accueil, service, animation, vente. Facturation et paiement en ligne simplifiés."
      },
      og: {
        'title': 'Manners',
        'description': 'Manners'
      }
    });
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

Router.route("/vos-tenues", function () {
  this.render("UploadSuits1");
});

Router.route("/paiement-confirmed/:mid", function ()  {
  this.render("paiementConfirmed");
});

Router.route("/verify-email/:token", {
  action: function () {
    Accounts.verifyEmail(this.params.token, function (error) {
      if (error) {
        alert(error.reason);
      } else {


      }
    });
  }
});

Router.route('/client/mes-missions', {
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


Router.map(function () {
  this.route('serverFile', {
    path: '/calend/',
    where: 'server',

    action: function () {
      //   var filename = this.params.filename;
      //   resp = {'lat' : this.request.body.lat,
      //           'lon' : this.request.body.lon};
      // Meteor.call('calendHack', this.request.json);
      Calends.insert(this.request.body);
      this.response.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8'
      });
      this.response.end(JSON.stringify({
        ok: "ok"
      }));
    }
  });
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



Router.route('/client/profils-favoris', {
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

Router.route('/client/mes-missions/:id', {
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


Router.route('/client/compte', {
  loadingTemplate: 'preloader',
  waitOn: function () {
    // return one handle, a function, or an array
    return [subs.subscribe('missions'), subs.subscribe('companies'), subs.subscribe('files.images.all')];
  },
  action: function () {
    this.render('ClientCompte');
  }
});


Router.route('/client/messagerie', {
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


Router.route('/client/history', function () {
  this.render('ClientHistory');
});

Router.route('/client/history/:op', function () {
  this.render('ClientHistory');
});

Router.route('/partenaire/messagerie', {
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

Router.route('/partenaire/mes-missions', {
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

Router.route('/partenaire/historique', {
  loadingTemplate: 'preloader',
  waitOn: function () {
    return [subs.subscribe('recomendations'), subs.subscribe('profiles'), subs.subscribe('missions')];
  },
  action: function () {
    this.render('HoteHistory');
  }
});

Router.route('/partenaire/historique/:op', {
  loadingTemplate: 'preloader',
  action: function () {
    this.render('HoteHistory');
  }
});

Router.route('/partenaire/profil', {
  waitOn: function () {
    return [subs.subscribe('files.images.all'), subs.subscribe('profiles'), subs.subscribe('recomendations'), subs.subscribe('missions')];
  },
  action: function () {
    this.render('HoteProfile');
  }
});

Router.route('/partenaire/profil/:id/', {
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

Router.route('/partenaire/mission/:id', {
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

Router.route('/inscrivez-vous', function () {
  this.render('WindowRegistration');

});

Router.route('/pagepresentation', function () {
  this.render('pageprez');

});

Router.route('/partenaire/compte', {
  loadingTemplate: 'preloader',
  waitOn: function () {
    return [subs.subscribe('profiles')];
  },
  action: function () {
    this.render('HoteCompte');
  }
});

Router.route('/accueil-client', {
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

Router.route('/accueil-hote', {
  // waitOn: function() {
  //     return [
  //         Meteor.subscribe("userList", "custom")
  //     ];
  // },
  action: function () {
    this.render('AccueilHote');
  }
});

Router.route('/bic', {
  action: function () {
    this.render('bic');
  }
});

Router.route('/administration/:op', {
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
      Router.go('/');
    }
  }
});

Router.route('/blog', {
  loadingTemplate: 'preloader',
  waitOn: function () {
    return [subs.subscribe('posts')];
  },
  action: function () {
    this.render('Blog');
  }
});

Router.route('/blog/:post', {
  waitOn: function () {
    return [subs.subscribe('posts')];
  },
  action: function () {
    this.render('BlogPost');
  }
});


Router.route('/job/serveur', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('JobServeur');
  }
});

Router.route('/job/barman', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('JobBarman');
  }
});

Router.route('/job/voiturier', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('JobVoiturier');
  }
});

Router.route('/job/vestiaire', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('JobVestiaire');
  }
});

Router.route('/job/accueil', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('JobAccueil');
  }
});

Router.route('/job/service', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('JobService');
  }
});

Router.route('/job/pointage', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('JobPointage');
  }
});

Router.route('/contact', function () {
  SEO.set({
    title: "Manners | Vous avez une question ? Contactez-nous",
    meta: {
      'description': "Vous avez une question ou une recommandation ? N’hésitez pas à nous contacter, notre équipe vous répondra dans les plus brefs délais."
    },
    og: {
      'title': '',
      'description': ''
    }
  });
  this.render('Contact');
});

Router.route('/nouvelle-mission/4', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('NouvelleMission4');
  }
});

Router.route('/paiement', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('PaiementMango');
  }
});

Router.route('/newhome', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('newHome');
  }
});



Router.route('/paiement/cb', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('paiementCb');
  }
});

Router.route('/paiement/sepa', {
  // waitOn: function() {
  //     return [Meteor.subscribe('posts')];
  // },
  action: function () {
    this.render('PaiementSepa');
  }
});

Router.route('/paiement/virement', {
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

Router.route('/paiement/in/:price', {
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

Router.route('/login/admin', function () {
  this.render('loginDashboard');
});

Router.route('/admindeux', function () {
  this.render('admindeux');
});
Router.route('/invoices', function () {
  this.render('invoice')
});

Router.route('/error/403', function () {
  this.render('403');
}, {
  name: 'error/403'
});
Router.route('/error/503', function () {
  this.render('503');
}, {
  name: 'error/503'
});
Router.route('/error/500', function () {
  this.render('500');
}, {
  name: 'error/500'
});

Router.route('/accueil', function () {
  this.render('AccueilClientInt');
}, {
  name: 'accueil'
});


Router.route('/accueilhote', function () {
  this.render('AccueilHoteInt');
}, {
  name: 'accueilhote'
});

Router.route('/404test', function () {
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
