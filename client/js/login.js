Template.Login.helpers({
    myCompany: () => {
        var com = Companies.findOne({
            users: {
                $in: [Meteor.userId()]
            }
        });
        if (!!com && !!com.name) {
            return com.name
        }
        return false;
    }
});

Template.Login.events({
    "click #reset-pass": function (e) {
        e.preventDefault();
        swal({
            title: "Mot de passe oublié ?",
            text: "Renseignez ici votre e-mail:",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "Email"
        }, function (inputValue) {
            if (inputValue === false) return false;
            if (inputValue === "") {
                swal.showInputError("Vous devez écrire quelque chose !");
                return false;
            }
            swal("Verification validée", "Un lien de vérification va être envoyé à votre adresse e-mail: " + inputValue, "Confirmé");
            Meteor.call('sendVerifyPassEmail', inputValue, function (error, success) {
                if (error) {
                    console.log('error', error);
                }
                if (success) {

                }
            });
        });
        //   sweetAlert('Veuillez remplir le formulaire');
    },
    "click .signin_btn": function (e) {
        e.preventDefault();
        //!TODO security login this is useless now
        if (!e.target.checkValidity()) {
            sweetAlert('Veuillez remplir le formulaire'); // error message
            return false;
        }
        Meteor.loginWithPassword(
            $('#email').val(),
            $('#password').val(), (err) => {
                if (!err) {

                    if (Meteor.user().profile.type === 'client') {
                        if (!Meteor.user().emails[0].verified) {
                            sweetAlert({
                                title: 'Validez votre e-mail',
                                text: "Il faut que vous validiez votre e-mail avant de pouvoir vous re-connecter."
                            }, () => {
                                Meteor.logout(() => {
                                    Router.go("/");
                                });
                            });

                        } else {
                            Router.go('/client/mes-missions/');
                        }
                    } else if (Meteor.user().profile.type === 'host') {
                        if (!Meteor.user().profile.verified) {
                            sweetAlert({
                                title: 'Revenez bientôt !',
                                text: "Votre candidature est en cours de validation, Nous revenons vers vous dans les meilleurs délais."
                            }, () => {
                                Meteor.logout(() => {
                                    Router.go("/");
                                });
                            });

                        } else {
                            Router.go('/partenaire/mes-missions');
                        }
                    } else if (Meteor.user().profile.type === "admin") {
                        Router.go('/client/mes-missions/');
                    } else {
                        Router.go('/');
                    }

                } else {
                    sweetAlert('Mot de passe ou compte incorrect');
                }
            });
    },
    "click #logout": (e) => {
        var tp = Meteor.user().profile.type;

        Meteor.logout(() => {
            if (tp === 'client') {
                Router.go('/accueil');
            } else {
                Router.go('/accueilhote');
            }
        });
    }
});