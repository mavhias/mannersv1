Meteor.subscribe("questions");
//Meteor.subscribe("guestUser");
//Meteor.subscribe("images",'all');
Meteor.subscribe("suits");
Meteor.subscribe("missions");
Meteor.subscribe("recomendations");
Meteor.subscribe("reports");
Meteor.subscribe("companies");
Meteor.subscribe("comments");
//Meteor.subscribe("userList",'all');
Meteor.subscribe("cloth");
// Meteor.subscribe('files.images.all');
//Meteor.subscribe("newImages",'main');
Meteor.subscribe("posts");
Meteor.subscribe("messages");
Meteor.subscribe("favorites");

// Meteor.subscribe("analytics");

// visit logging 

// GoogleMaps.load({libraries: 'places'});
Meteor.startup(function() {
      Meteor.typeahead.inject();
//   GoogleMaps.load({
//     key: 'AIzaSyD0l1I8U-zdhGyNFCaXCFhZImZvsBRBc00', // optional, could be loaded via Meteor.settings.public.GOOGLE_MAP_API
//     libraries: 'places'  // can be an array
//   });
});
Accounts.onEmailVerificationLink((token) => {
    Accounts.verifyEmail(token);
    // let id = JSON.parse(localStorage.getItem('userId'));
    // if (!id || id === undefined) {
    //     id = JSON.parse(localStorage["userId"]);
    // }
    // if (!id || id === undefined) {
    //     swal({
    //         title: "browser is not supported",
    //         text: "Your browsers is not support localStorage, please disable any plugin that can block it"
    //     });
    //     return;
    // }
    // Meteor.subscribe("userList", id);
    // setTimeout(()=> {
    //, function () {

        // swal({
        // title: "Le lien est verifié",
        // text: "Votre compte est désormais confirmé :-)"
        // });
        $.notify("Votre inscription est confirmée");
        let user = Meteor.user();
        // Meteor.users.update(id, {
        //     $set: {
        //         'emails.0.verified': true
        //     }
        // });
        Router.go('/client/compte');
        
        if (user.profile.type === 'client') {

            Meteor.call('sendEmail',
                user.emails[0].address,
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
                   Bonjour ` + user.profile.nameManager + ` ` + user.profile.lastNameManager + `,<br><br>
Bienvenue chez Manners, la première plateforme entièrement dédiée aux<br>
indépendants des métiers de l'événementiel !<br>
<br>
Depuis votre espace <a href="bemanners.com/client/mes-missions">mon compte<a/>, vous allez pouvoir trouver simplement et rapidement des freelances qualifiés pour vous accompagner sur vos événements, opérations et missions en interne (accueil, service, vente, animation, etc.).<br>
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

</html>`);
        } else {
            alert('not client');

            Router.go('/accueilhote');
        }
//    });
//},700);

});


Accounts.onResetPasswordLink((token, done) => {
    swal({
        title: "Mot de passe oublié ?",
        text: "Veuillez entrez votre nouveau mot de passe:",
        type: "password",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top",
        inputPlaceholder: "Passe"
    }, function (inputValue) {
        if (inputValue === false) return false;
        if (inputValue === "") {
            swal.showInputError("Vous devez écrire quelque chose!");
            return false
        }
        swal("Confirmation!", "Votre mot de passe est changé en: " + inputValue, "success");
        Accounts.resetPassword(token, inputValue);
    });
    swal({
        title: "Réinitialiser votre mot de passe!",
        text: "S'il vous plaît entrer nouveau mot de passe:",
        type: "password",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top",
        inputPlaceholder: "Passe"
    }, function (inputValue) {
        if (inputValue === false) return false;
        if (inputValue === "") {
            swal.showInputError("Vous devez écrire quelque chose!");
            return false
        }
        swal("Nice!", "Votre mot de passe a été changé avec: " + inputValue, "success");
        Accounts.resetPassword(token, inputValue);
    });
});

Meteor.startup(function () {
    // var calendar = new GAPI.Calendar('720123193603-f39eqerbdih5pumatvh815ka019jfmlj.apps.googleusercontent.com');
    // calendar.get_content(function(content) {
    //     console.log(content);  // Calendar content.
    // });

    sChat.init('hYdbMjSfuuzzFiNnL', {
        ssl: true,
        welcomeMessage: 'Bonjour, comment pouvons-nous vous aider ?',
        hostName: 'www.simplechat.support',
        labels: {
            sendPlaceholder: 'Envoyez votre message..',
            headerTitle: 'Bienvenue sur notre site!'
        }
    });

    var type = '';
    if (!!Meteor.userId()) {
        var ut = Meteor.user();
        if (!!0) {
            type = ut.profile.type;
        } else {
            type = 'unknown'
        }
    } else {
        type = 'guest';
    }

    Analytics.insert({
        date: new Date(),
        type: type,
        op: 'visit',
        path: Iron.Location.get().path
    });
});

UI.registerHelper('getImage', (id) => {
    let data;
    if (!!id) {
        data = Images.find({
            userId: id
        }).each();
        data = data[0];
        if (!!data) return data.link();
    }
    return '/images/manner.jpg';


});

 UI.registerHelper('myCompany', () => {
        let user = Meteor.user();
        return user.profile.entreprise||'No Company';
        // var com = Companies.findOne({
        //     users: {
        //         $in: [Meteor.userId()]
        //     }
        // });
        // if (!!com && !!com.name) {
        //     return com.name
        // }
        // return false;
});

UI.registerHelper('getCv', (id) => {
    let data;
    if (!!id) {
        data = Cvs.find({
            userId: id
        }).each();
        data = data[0];
        if (!!data) return data.link();
    }
    return false;


});

UI.registerHelper('authCheck', (type) => {
    if (!Meteor.userId()) {
        sweetAlert({
            title: "Accès refusé",
            text: "Vous n'avez pas accès à cette page"
        }, () => {
            Router.go('/');
        });
        return false;
    }

    var user = Meteor.user();
    if (user.profile.type === type) {
        sweetAlert({
            title: "Accès refusé",
            text: "Vous n'avez pas accès à cette page"
        }, () => {
            Router.go('/');
        });
        return false;

    }
    return true;
});
UI.registerHelper('shortIt', function (stringToShorten, stringToShorten2, maxCharsAmount) {
    if ((stringToShorten.length + stringToShorten2.length) > maxCharsAmount) {
        var stringToShorten = stringToShorten + ' ' + stringToShorten2;
        return stringToShorten.substring(0, maxCharsAmount) + '...';
    }
    return stringToShorten + ' ' + stringToShorten2;
});

UI.registerHelper('shortIt1', function (stringToShorten, maxCharsAmount) {
    if ((stringToShorten.length) > maxCharsAmount) {
        return stringToShorten.substring(0, maxCharsAmount) + '...';
    }
    return stringToShorten;
});

Template.MailChimpListSubscribe.events({
    'click #subm': function () {
        sweetAlert("Merci, nous avons bien reçu votre demande. Nous allons prendre contact avec vous dans les plus brefs délais.");
    }
});

Template.Home.helpers({
    test: () => {}
});



Template.Home.rendered = function () {
    new WOW().init();
    $('.backToTopBtn').click(function () {
        $('html,body').animate({
            scrollTop: 0
        }, 'slow');
        return false;
    });
}

Template.body.events({
    'click #menu-open': function () {
        $('.main-menu').css('display', 'block');
    },
    'click #menu-close': function () {
        $('.main-menu').css('display', 'none');
    },
    'click #close-newsletter': function () {
        $('#newsletter-box').css('display', 'none');
    }
});

Template.Home.events({
    'click #menu-open': function () {
        $('.main-menu').css('display', 'block');
    },
    'click #menu-close': function () {
        $('.main-menu').css('display', 'none');
    },
    'click #close-newsletter': function () {
        $('#newsletter-box').css('display', 'none');
    }
});



Template.MangoForm1.rendered = function () {
    $('#my-datepicker').datepicker();

}

Template.MangoForm2.rendered = function () {
    $('#my-datepicker').datepicker();

}


// Template.MangoForm3.rendered = function() {
//     $('#my-datepicker').datepicker();

// }


Template.MangoForm1.events({
    'click #auth': function (e) {
        if ($('#password').val() === 'Nodelovers75?') {
            $('#form').removeClass('hidden');
            $('#authform').addClass('hidden');
        }
    },
    'submit form': function (e) {
        e.preventDefault();
        var res = {
            Address: {
                AddressLine1: e.target.address.value,
                AddressLine2: e.target.address2.value,
                City: e.target.city.value,
                Country: e.target.country.value,
                PostalCode: e.target.zip.value
            }
        };
        res.Birthday = Math.round(+new Date(e.target.age.value) / 1000);
        res.Email = e.target.email.value;
        res.Tag = e.target.tag.value;
        res.FirstName = e.target.firstname.value;
        res.LastName = e.target.lastname.value;

        res.Nationality = e.target.nationality.value;
        res.CountryOfResidence = e.target.residence.value;


        Meteor.call('mango.addUserNatural', res);


    }
});

Template.MangoForm2.events({
    'click #auth': function (e) {
        if ($('#password').val() === 'Nodelovers75?') {
            $('#form').removeClass('hidden');
            $('#authform').addClass('hidden');
        }
    },
    'submit form': function (e) {
        e.preventDefault();
        var res = {};

        res.Email = e.target.email.value;
        res.Name = e.target.name.value;
        res.Tag = e.target.tag.value;
        res.LegalPersonType = (parseInt(e.target.legalType)) ? MangoPaySDK.user.personTypes.BUSINESS : MangoPaySDK.user.personTypes.ORGANIZATION;
        res.LegalRepresentativeFirstName = e.target.legalFirstName.value;
        res.LegalRepresentativeLastName = e.target.legalLastName.value;
        res.LegalRepresentativeBirthday = Math.round(+new Date(e.target.legalAge.value) / 1000);
        res.LegalRepresentativeNationality = e.target.legalNationality.value;
        res.LegalRepresentativeCountryOfResidence = e.target.legalCountryOfResidence.value;
        Meteor.call('mango.addUserLegal', res);


    }
});


Template.Uniform.events({
    'click #menu-open': function () {
        $('.main-menu').css('display', 'block');
    },
    'click #menu-close': function () {
        $('.main-menu').css('display', 'none');
    }
});

Template.How.events({
    'click #menu-open': function () {
        $('.main-menu').css('display', 'block');
    },
    'click #menu-close': function () {
        $('.main-menu').css('display', 'none');
    }
});