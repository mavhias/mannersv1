Template.ClientCompte.onCreated(
  function () {
    Session.set('profile-nav', 1);
    Session.set('control', 1);
    this.currentUpload = new ReactiveVar(false);

  });

Template.coordsProfile1.onRendered(() => {
  if (!!Meteor.user().profile.full) $('.complete_profile_statement').hide();
});


Template.infoProfile1.onRendered(() => {
  if (!!Meteor.user().profile.full) $('.complete_profile_statement').hide();
});

Template.paymentProfile1.helpers({
  dateConv: (date) => {
    return moment(new Date(date * 1000)).format("DD/MM/YYYY");
    // return translate(moment(new Date(date * 1000)).locale('en').format("dddd Do MMM YY"));
  },
  transacts: () => {
    var trans = ReactiveMethod.call('Payment.methods.getTransactions', Meteor.userId());
    if (trans == undefined) return false;
    let user = Meteor.user();
    trans = trans.map((val) => {
      // if (!!val.Tag) {
      val.name = user.profile.nameManager + ' ' + user.profile.lastNameManager;
      val.total = (val.DebitedFunds.Amount / 100) + (val.Fees.Amount / 100);
      val.fee = val.Fees.Amount / 100;
      val.price = val.DebitedFunds.Amount / 100;
      //   } else {
      //       return undefined;
      //   }
      return val;
    });
    trans = trans.clean(undefined);
    return trans;
  }
})


Template.infoProfile1.events({
      "submit #form_info": (e) => {
        e.preventDefault();
        if (!e.target.checkValidity()) {
          e.preventDefault(); // dismiss the default functionality
          sweetAlert('Veuillez remplir le formulaire'); // error message
          return false;
        }
        var id = Meteor.userId();
        let user = Meteor.users.findOne(id);
        Meteor.users.update(id, {
          $set: {
            'profile.legalCompanyName': e.target.legalCompanyName.value,
            'profile.desctext': e.target.desctext.value,
            'profile.hourate': e.target.hourate.value,
            'profile.zip': e.target.zip.value,
            'profile.legalFirstName': e.target.legalFirstName.value,
            'profile.legalName': e.target.legalName.value,
            'profile.legalEmail': e.target.legalEmail.value,
            'profile.manageDateofBirth': e.target.manageDateofBirth.value,
            'profile.legalNationality': e.target.legalNationality.value,
            // 'profile.iban': e.target.iban.value,
            // 'profile.bic': e.target.bic.value
            // 'profile.permB': e.target.permB.value,
            // 'profile.car': e.target.car.value,
            // 'profile.scooter': e.target.scooter.value,
            // 'profile.studdyLevel': e.target.studdyLevel.value,
            // 'profile.engLevel': e.target.engLevel.value,
            // 'profile.anlang2': e.target.anlang2.value
          }
        });

        // swal({
        //   title: "Sauvegardé !",
        //   text: "Bravo .",
        //   imageUrl: "images/logo.svg"
        // });
        var dataObject = {
          Name: e.target.legalCompanyName.value,
          LegalRepresentativeEmail: e.target.legalEmail.value,
          LegalRepresentativeAddress: {
            AddressLine1: e.target.desctext.value,
            Region: "Ile de France",
            City: e.target.hourate.value,
            PostalCode: e.target.zip.value,
            Country: 'FR'
          },
          LegalRepresentativeBirthday: parseInt(new Date(e.target.manageDateofBirth.value).getTime() / 1000),
          LegalRepresentativeCountryOfResidence: "FR",
          LegalRepresentativeNationality: e.target.legalNationality.value,
          LegalRepresentativeFirstName: e.target.legalFirstName.value,
          LegalRepresentativeLastName: e.target.legalName.value,
          LegalPersonType: "BUSINESS"
        };

          Meteor.call('Payment.methods.createWallet', Meteor.userId(), function (error, success) {
            if (error) {
              console.log('error', error);
            }
            if (success) {

            }
          });
          let addr = {
            "AddressLine1": e.target.desctext.value,
            //   "AddressLine2": user.profile.address2,
            "City": e.target.hourate.value,
            "Region": "Ile de France",
            "PostalCode": e.target.zip.value,
            "Country": e.target.legalNationality.value || 'FR'
          }
          // Meteor.call('Payment.methods.createBankAccount', Meteor.userId(), e.target.iban.value, e.target.bic.value, addr, (error, success) => {
          //   if (error) {
          //     console.log('error', error);
          //     swal('Error create bank account');
          //   }
          //   if (success) {
          //     // swal({
          //     //   title: "Sauvegardé !",
          //     //   text: "Bravo .",
          //     //   imageUrl: "images/logo.svg"
          //     // });

          //     $.notify("Nous avons bien pris en compte vos informations de facturation..", {
          //       clickToHide: true,
          //       autoHideDelay: 4000,
          //       style: 'happyblue'
          //     });
          //   }
          // });
          Meteor.call('Payment.methods.updateUser', dataObject, function (error, success) {
            if (error) {
              console.log('error', error);
            }
            if (success) {

            }
          });
          $.notify("Nous avons bien pris en compte vos informations de facturation..", {
            clickToHide: true,
            autoHideDelay: 4000,
            style: 'happyblue'
          });

          var check = 1;
          [user.profile.legalCompanyName, user.profile.desctext, user.profile.desctext, user.profile.hourate, user.profile.zip, user.profile.legalFirstName, user.profile.legalName, user.profile.legalEmail, user.profile.manageDateofBirth, user.profile.legalNationality].map(val => {
            if (!!val && val.length > 0 && Session.get('control') == 0) {
              return;
            } else {
              check -= 1;
            }

          });
          check = 1;
          $('.complete_profile_statement').hide();
          Meteor.users.update(id, {
            $set: {
              'profile.full': true
            }
          });
          $('#modal-notcomplete').modal('hide');
          let clText = `<!DOCTYPE html>
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
                   Bonjour ` + user.profile.nameManager + ` ` + user.profile.lastNameManager + `,<br><br>
Bienvenue chez Manners, la première plateforme entièrement dédiée aux<br>
indépendants des métiers de l'événementiel !<br>
<br>
Après avoir complété les informations de votre espace <a href="http://bemanners.com/client/mes-missions">Mon compte<a/>, vous allez pouvoir trouver simplement et rapidement des freelances qualifiés pour vous accompagner sur vos événements, opérations et missions en interne (accueil, service, vente, animation, etc.).<br>
<br>

<a href="bemanners.com/nouvelle-mission/1">CREER UNE MISSION</a><br><br>
Bonne journée,<br>
L'équipe Manners ☀️</span></span>
                </p>
        </div>

        </p>
        </div>
    </section>
<div style="margin-bottom: 45px">
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
            <p>2016 © </p>
            <br>
            <p>Rencontrez-nous : 24 avenue Marceau, 75008, Paris</p>
            <p>Contactez-nous : contact@bemanners.com | 01 76 39 00 01</p>
            <br><br>
            <a class="text-center" href="">Se désinscrire</a>
        </div>
    </footer>

</body>

</html>`;
          Meteor.call('sendEmailCli', Meteor.userId(), 'julie@bemanners.com', "Mail - Demande d'inscription", clText);



        }
      });


    Template.ClientCompte.helpers({
      genPdf: () => {
        if (!!Session.get('gopdf')) {
          let res = ReactiveMethod.call('getPdf', Session.get('gopdf'));
          if (!!res) {
            window.location = '/' + res;
          }
        }
      },
      dateConv: (date) => {
        return translate(moment(new Date(date * 1000)).locale('en').format("dddd Do MMM YY"));
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
            title: "Accès refusé",
            text: "Vous n'avez pas accès à cette page"
          }, () => {
            Router.go('/accueil');
          });
          return false;

        }
        return true;
      },

      nav: (val) => {
        return val === Session.get('profile-nav');
      }
    });

    Template.ClientCompte.events({
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
        Session.set('profile-nav', parseInt(e.target.id.split('-')[1]));
      },
      "submit #form_coords": (e, template) => {
        e.preventDefault();
        var id = Meteor.userId();
        Meteor.call('removeImages');
        if (!!document.querySelector('#fileselect6').files[0]) {

          var uploadInstance = Images.insert({
            meta: {
              ownerId: Meteor.userId()
            },
            file: document.querySelector('#fileselect6').files[0],
            streams: 'dynamic',
            chunkSize: 'dynamic'
          }, false);
          uploadInstance.on('start', function () {
            template.currentUpload.set(this);
          });

          uploadInstance.on('end', function (error, fileObj) {
            if (error) {
              alert('Problème durant le téléchargement : ' + error.reason);
            } else {

              // alert('File "' + fileObj.name + '" successfully uploaded');
            }
            template.currentUpload.set(false);
          });
          uploadInstance.start();
        }
        var user = Meteor.users.update(id, {
          $set: {
            // 'profile.photo': Session.get('photo'),
            'profile.nameManager': e.target.firstname.value,
            'profile.lastNameManager': e.target.name.value,
            //  'profile.qmanage': e.target.qmanage.value,
            //   'profile.nsoc': e.target.nsoc.value,
            'profile.entreprise': e.target.entreprise.value,
            //   'profile.binfo': e.target.binfo.value,
            //'profile.hpay': e.target.name.value,
            'profile.tel': e.target.tel.value,
            'profile.email': e.target.email.value,
            //    'profile.address': e.target.address.value,
            //    'profile.address2': e.target.address2.value,
            //          'profile.zip': e.target.zip.value,
            //        'profile.city': e.target.city.value,
            //      'profile.pays': e.target.pays.value,
          }
        });
        swal({
          title: "Sauvegardé !",
          text: "Bravo .",
          imageUrl: "images/logo.svg"
        });

        $.notify("Nous avons bien pris en compte vos informations de facturation..", {
          clickToHide: true,
          autoHideDelay: 400000,
          style: 'happyblue'
        });

      },
      "submit #bank-form": (e) => {
        e.preventDefault();
        var id = Meteor.userId();
        Meteor.users.update(id, {
          $set: {
            // 'profile.photo': Session.get('photo'),
            'profile.companyName': e.target.companyName.value,
            'profile.legalName': e.target.legalName.value,
            'profile.legalEmail': e.target.legalEmail.value,
            //   'profile.binfo': e.target.binfo.value,
            'profile.business': e.target.business.value,
            'profile.manageDateofBirth': e.target.manageDateofBirth.value,
            'profile.legalNationality': e.target.legalNationality.value,
            'profile.defaultFR': e.target.defaultFR.value || 'FR'
          }
        });


        let user = Meteor.users.findOne(id);
        let addr = {
          "AddressLine1": user.profile.address,
          "AddressLine2": user.profile.address2,
          "City": user.profile.city,
          "Region": "Ile de France",
          "PostalCode": user.profile.z,
          "Country": e.target.defaultFR.value || 'FR'
        }
        Meteor.call('Payment.methods.createBankAccount', Meteor.userId(), e.target.iban.value, e.target.iban.value, addr, (error, success) => {
          if (error) {
            console.log('error', error);
            swal('Error create bank account');
          }
          if (success) {
            // swal({
            //   title: "Sauvegardé !",
            //   text: "Bravo .",
            //   imageUrl: "images/logo.svg"
            // });

            $.notify("Nous avons bien pris en compte vos informations de facturation..", {
              clickToHide: true,
              autoHideDelay: 4000,
              style: 'happyblue'
            });
          }
        });
        [user.profile.companyName, user.profile.legalName, user.profile.legalEmail, user.profile.legalCompanyName, user.profile.business, user.profile.manageDateofBirth, user.profile.legalNationality].forEach(val => {
          if (!!val && val.length > 0)
            Session.set('control', 0);
          else {
            Session.set('control', -1);
          }

        });
      }

    });
