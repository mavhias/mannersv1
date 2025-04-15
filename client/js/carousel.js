Template.carouselList.helpers({
    carouselItems: function() {
        if (this.templ === 'home') {
            return [{
                title: '1',
                imageUrl: '/images/slide1.jpg',
                index: 1,
                html: '<h2 id="slidephrase">"Grâce au système d\'évaluation,<br> je travaille toujours avec les mêmes clients."</h2><h3>Louis L.</h3>',
                htmla: '<h2 id="slidephrase">"Grâce au système d\'évaluation,<br> je travaille toujours avec les mêmes clients."</h2><h3>Louis L.</h3>'
            }, {
                title: '2',
                imageUrl: '/images/slide2.jpg',
                index: 2,
                html: '<h2 id="slidephrase">"Depuis que je me suis mise à mon compte,<br> je suis bien plus motivée."</h2><h3>Hélène R.</h3>',
                htmla: '<h2 id="slidephrase">"Depuis que je me suis mise à mon compte,<br> je suis bien plus motivée."</h2><h3>Hélène R.</h3>'
            }, {
                title: '3',
                imageUrl: '/images/slide3.jpg',
                index: 3,
                html: '<h2 id="slidephrase">"J\'ai établi une vraie relation de confiance<br>avec mes clients."</h2><h3>Sean H.</h3>',
                htmla: '<h2 id="slidephrase">"J\'ai établi une vraie relation de confiance<br>avec mes clients."</h2><h3>Sean H.</h3>'
            }];
        } else if (this.templ === 'become') {
            return [{
                title: '1',
                imageUrl: '/images/unnamed.jpg',
                index: 1,
                html: '<h1>Inscrivez-vous pour participer à nos séances de brief</h1><a href="/inscription"  class="button-colored">INSCRIPTION</a>',
                htmla: '<h1>Inscrivez-vous pour participer à nos séances de brief</h1><a href="/inscription" class="button-colored">INSCRIPTION</a>'
                }];
        } else if (this.templ === 'hote') {
            return [{
                title: '1',
                imageUrl: 'http://agence-csw.com/wp-content/uploads/2016/08/light-828547_1920.jpg',
                index: 1,
                html: '<div class="text-center"><h1>Inscrivez-vous et rejoignez la communauté</h1><a href="/inscription" class="button-colored">INSCRIPTION</a></div>',
                htmla: '<div id="hote-stext" class="text-center"><h1>Inscrivez-vous et rejoignez la communauté</h1></div>'

            }];
        } else if (this.templ === 'client') {
            return [{
                title: '1',
                imageUrl: '/images/slide1.jpg',
                index: 1,
             /*   html: '<div class="caption-left"><div class="catchphrase"><span>Travaillez directement avec les meilleurs</span><ul class="roll"><li>hôtes d\'accueil !</li><li>serveurs !</li><li>barmen !</li><li>street marketeurs !</li><li>voituriers !</li><li>hôtes d\'accueil !</li></ul></div>' +
                '<button class="button-colored" id="cliSub1" >CRÉER UNE MISSION</button>'+ */
               html: '<div class="caption-left"><div class="catchphrase"><span>Besoin de personnel qualifié ?</span></div><br><div class="subtitle-slider"><hr class="separator hidden-xs"><br>Nous sélectionnons pour vous les meilleurs free-lances en événementiel pour <br>vos événements et opérations ponctuelles.<br> Facturation et paiement simplifiés.</div>' +
                '<button class="button-slider" id="cliSub1" >Planifier une mission</button>'+
                '</div></div><div class="text-right"<h3>"Grâce au système d\'évaluation,<br> je travaille toujours avec les mêmes clients."</h3><h4>Louis L.</h4></div>',

               htmla: '<div class="caption-left"><div class="catchphrase"><span>Besoin de personnel qualifié ?</span></div><br><div class="subtitle-slider"><hr class="separator hidden-xs"><br>Nous sélectionnons pour vous les meilleurs free-lances en événementiel pour <br>vos événements et opérations ponctuelles.<br> Facturation et paiement simplifiés.</div>' +
                '<button class="button-slider" id="cliSub1">Planifier une mission</button>'+
                '</div></div><div class="text-right"<h3>"Grâce au système d\'évaluation,<br> je travaille toujours avec les mêmes clients."</h3><h4>Louis L.</h4></div>'

            }, {
                title: '2',
                imageUrl: '/images/slider2.png',
                index: 2,
               html: '<div class="caption-left"><div class="catchphrase"><span>Besoin de personnel qualifié ?</span></div><br><div class="subtitle-slider"><hr class="separator hidden-xs"><br>Nous sélectionnons pour vous les meilleurs free-lances en événementiel pour <br>vos événements et opérations ponctuelles.<br> Facturation et paiement simplifiés.</div>' +
                '<button class="button-slider" id="cliSub1" href="/nouvelle-mission/1">Planifier une mission</button>'+
                '</div><div class="text-right"<h3>"Depuis que je me suis mise à mon compte,<br> je suis bien plus motivée."</h3><h4>Hélène R.</h4></div>',

               htmla: '<div class="caption-left"><div class="catchphrase"><span>Besoin de personnel qualifié ?</span></div><br><div class="subtitle-slider"><hr class="separator hidden-xs"><br>Nous sélectionnons pour vous les meilleurs free-lances en événementiel pour <br>vos événements et opérations ponctuelles.<br> Facturation et paiement simplifiés.</div>' +
                '<button class="button-slider" id="cliSub1" href="/nouvelle-mission/1">Planifier une mission</button>'+
                '</div><div class="text-right"<h3>"Depuis que je me suis mise à mon compte,<br> je suis bien plus motivée."</h3><h4>Hélène R.</h4></div>'

            }, {
                title: '3',
                imageUrl: '/images/slide3.jpg',
                index: 3,
               html: '<div class="caption-left"><div class="catchphrase"><span>Besoin de personnel qualifié ?</span></div><br><div class="subtitle-slider"><hr class="separator hidden-xs"><br>Nous sélectionnons pour vous les meilleurs free-lances en événementiel pour <br>vos événements et opérations ponctuelles.<br> Facturation et paiement simplifiés.</div>' +
                '<button class="button-slider" id="cliSub1" >Planifier une mission</button>'+
                '</div><div class="text-right"<h3>"J\'ai établi une vraie relation de confiance<br>avec mes clients."</h3><h4>Sean H.</h4></div>',
               htmla: '<div class="caption-left"><div class="catchphrase"><span>Besoin de personnel qualifié ?</span></div><br><div class="subtitle-slider"><hr class="separator hidden-xs"><br>Nous sélectionnons pour vous les meilleurs free-lances en événementiel pour<br> vos événements et opérations ponctuelles.<br> Facturation et paiement simplifiés.</div>' +
                '<button class="button-slider" id="cliSub1" >Planifier une mission</button>'+
                '</div><div class="text-right"<h3>"J\'ai établi une vraie relation de confiance<br>avec mes clients."</h3><h4>Sean H.</h4></div>'

            }];
        }

    }
});

Template.caruselItem.events({
    "click #cliSub1": function(e) {
      e.preventDefault();
      var baseInfo = Session.get('base-info') || {};
      var hostsCol = document.querySelector('#host-col1');
    //   var name = document.querySelector('#name1');

    //   baseInfo.name = name.value;
      baseInfo.hostesCol = parseInt(hostsCol.value);
    //   baseInfo.beginsTo = document.querySelector('#begins-to1').value;
      Session.set('base-info', baseInfo);
      setTimeout(function() {
          Router.go('/nouvelle-mission/1');
      }, 600);

    },
    "click #cliSub2": function(e) {
      e.preventDefault();
      var baseInfo = Session.get('base-info') || {};
      var hostsCol = document.querySelector('#host-col2');
    //   var name = document.querySelector('#name2');

    //   baseInfo.name = name.value;
      baseInfo.hostesCol = parseInt(hostsCol.value);
    //   baseInfo.beginsTo = document.querySelector('#begins-to2').value;
      Session.set('base-info', baseInfo);
      setTimeout(function() {
          Router.go('/nouvelle-mission/1');
      }, 600);

    },
    "click #cliSub3": function(e) {
        e.preventDefault();
        var baseInfo = Session.get('base-info') || {};
        var hostsCol = document.querySelector('#host-col3');
        // var name = document.querySelector('#name3');

        // baseInfo.name = name.value;
        baseInfo.hostesCol = parseInt(hostsCol.value);
        // baseInfo.beginsTo = document.querySelector('#begins-to3').value;
        Session.set('base-info', baseInfo);
        setTimeout(function() {
            Router.go('/nouvelle-mission/1');
        }, 600);
    }
});

Template.caruselItem.helpers({
    isActive: function() {
        return (this.index === 0) ? 'active' : '';
    }
});
