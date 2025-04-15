function chouse(query) {
    var checs = document.querySelectorAll('#' + query);
    var i;
    var res;
    for (i = 0; i < checs.length; i++) {
        if (checs[i].checked) {
            res = checs[i].value;
        }
    }
return res;
}

///TypeError: undefined is not an object (evaluating 'event.target.question1.value')



Template.clientRegister.helpers({
    create: function () {

    },
    rendered: function () {

    },
    destroyed: function () {

    },
    input1: () => {
        let ch = Session.get('choose');
        if (!ch) {
            ch = {};
            ch.one = '<input type="text" class="form-control" name="namemanager" placeholder="Prénom du responsable" required>';
        }
        return ch.one;
    },
    input2: () => {
        let ch = Session.get('choose');
        if (!ch) {
            ch = {};
            ch.two = '<input type="text" class="form-control" name="lastnamemanager" placeholder="Nom du responsable" required>';
        }
        return ch.two;
    },
    hide: () => {
        let ch = Session.get('choose');
        return (!!ch) ? ch.hide : '';
    },
});

Template.clientRegister.events({
    'change #choose input:radio': (e) => {
        let data = {};

        if (!!e.target.checked && e.target.value !== 'prof') {
            Session.set('mput','legal')
            data.one = '<input type="text" class="form-control" name="namemanager" placeholder="Prénom"> required';
            data.two = '<input type="text" class="form-control" name="lastnamemanager" placeholder="Nom"> required';
            data.hide = 'hidden';
        } else {
            Session.set('mput','natural')
            data.one = '<input type="text" class="form-control" name="namemanager" placeholder="Prénom du responsable"> required';
            data.two = '<input type="text" class="form-control" name="lastnamemanager" placeholder="Nom du responsable"> required';
            data.hide = '';
        }
        Session.set('choose', data);
    },
    "click #modalReg2": () => {

        $('#myModal22').modal({
            keyboard: true,
            backdrop: true
        });
    },
    "submit #client": (event, template) => {
        event.preventDefault();
        if (event.target.password.value !== event.target.repeatpassword.value) {
            sweetAlert({title:'Erreur !',text:"Les deux mots de passe <br> entrés ne correspondent pas !",  html: true });
            return false;
        }

        let agr = document.querySelector('#agr');

        if (!agr.checked) {
            event.preventDefault(); // dismiss the default functionality
            sweetAlert('Veuillez remplir le formulaire'); // error message
            return false;
        }

        if (!event.target.checkValidity()) {
            event.preventDefault(); // dismiss the default functionality
            sweetAlert('Veuillez remplir le formulaire'); // error message
            return false;
        }
        //weetAlert('Inscription confirmée');
        let entreprise = event.target.entreprise.value;
        if (!entreprise) {
            entreprise = 'No company';
        }
        Accounts.createUser({
            password: event.target.password.value,
            email: event.target.email.value,
            profile: {
                type: 'client',
                verified: false,
                email:event.target.email.value,
                legalEmail:event.target.email.value,
                nameManager: event.target.namemanager.value,
                entreprise: entreprise,
                lastNameManager: event.target.lastnamemanager.value,
                legalFirstName: event.target.namemanager.value,
                legalName: event.target.lastnamemanager.value,
                tel: event.target.tel.value,
                individual: Session.get('mput') === 'legal',
                favorite: false,
                createdAt: new Date()
            }
        }, (err) => {
            if (!err) {
                var user = Meteor.user();
                // var individual = (!!user.profile.individual) ? 'natural' : 'legal';
                var individual = Session.get('mput');
                Meteor.call('Payment.methods.createMangoUser', user, Meteor.userId(), individual, (error, success) => {
                    if (error) {
                        console.log('error', error);
                    }
                    if (success) {

                    }
                });
                var type = user.profile.type;

                Analytics.insert({
                    date: new Date(),
                    type: type,
                    name: user.profile.nameManager,
                    op: 'register',
                    path: Iron.Location.get().path
                });
                let file = document.querySelector('#fileselect2').files;

                if (document.querySelector('#fileselect2').files.length > 0) {
                    file = document.querySelector('#fileselect2').files[0];
                } else {



                    Companies.insert({
                        name: entreprise,
                        users: [Meteor.userId()]
                    }, function (err) {
                        Meteor.call('sendVerificationLink', Meteor.userId(), (error, response) => {
                            if (error) {
                                alert(error.reason);
                            } else {
                                if (Router.current().route.getName() !== 'nouvelle-mission.:nav') {
                                    //                                Meteor.logout(() => {
                                        //    localStorage.setItem('userId', JSON.stringify(user._id));
                                        setTimeout(() => {
                                            swal({
                                                title: "Nous avons bien reçu vos informations",
                                                text: "Nous venons de vous envoyer un lien de confirmation par mail. Veuillez valider votre compte. Si vous n'avez rien reçu, nous pouvons vous le renvoyer.",
                                                type: "info",
                                                showCancelButton: true,
                                                confirmButtonColor: "#DD6B55",
                                                confirmButtonText: "Renvoyer un email",
                                                cancelButtonText: "Continuer",
                                                closeOnConfirm: false,
                                                closeOnCancel: false
                                            }, function (isConfirm) {
                                                if (isConfirm) {
                                                    Meteor.call('sendVerificationLink', Meteor.userId(), (error, response) => {
                                                        //swal("Deleted!", "Your imaginary file has been deleted.", "success");
                                                    $('#myModal22').modal('toggle');
                                                    setTimeout(()=>{
                                                         Router.go("/client/compte");
                                                        swal({
                                                            title: "Complétez vos informations",
                                                            text: "Complétez vos informations de profil et commencez à publier vos missions !"
                                                        }, function () {
                                                            //window.location.assign("/client/compte");
                                                        });
                                                    },500);
                                                   
                                                    });
                                                } else {
                                                    $('#myModal22').modal('toggle');
                                                     setTimeout(()=>{
                                                         Router.go("/client/compte");
                                                        swal({
                                                            title: "Complétez vos informations",
                                                            text: "Complétez vos informations de profil et commencez à publier vos missions !"
                                                        }, function () {
                                                            //window.location.assign("/client/compte");
                                                        });
                                                    },500);
                                                }
                                            });

                                        }, 500);
                                  
                                    //       });
                                }
                            }
                        });

                    });
                }


                var uploadInstance = Images.insert({
                    meta: {
                        ownerId: Meteor.userId()
                    },
                    file: file,
                    // transport:'http',
                    streams: 'dynamic',
                    chunkSize: 'dynamic'
                }, false);



                uploadInstance.on('start', function () {
                    template.currentUpload.set(this);
                });

                uploadInstance.on('end', function (error, fileObj) {
                    if (error) {
                        alert('Error during upload: ' + error.reason);
                    } else {

                        // Meteor.call('sendVerificationLink', (error, response) => {
                        //     if (error) {
                        //         alert(error.reason);
                        //     } else {
                        ///      sweetAlert('Congrats!');
                        //     window.location.assign("/");
                        //         else {
                        //         $('#myModal11').modal('toggle');
                        //         }
                        //     }
                        // });
                        // alert('File "' + fileObj.name + '" successfully uploaded');
                    }
                    template.currentUpload.set(false);
                });

                uploadInstance.start();
            } else {
                console.log(err);
                if (err.reason==='Email already exists.') {
                    swal('Ce mail est déjà utilisé')
                }
                else {
                    swal('Vous êtes déjà enregistré !');
                }
            }
        });
    }
});



Template.WindowRegistration.onRendered(() => {
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

    $('#birthday1').datepicker({
        pickTime: false,
        language: 'fr'
    });

});

Template.WindowRegistration.onCreated(function () {
    this.currentUpload = new ReactiveVar(false);
});

Template.WindowRegistration.helpers({
    input1: () => {
        let ch = Session.get('choose');
        if (!ch) {
            ch = {};
            ch.one = '<input type="text" class="form-control" name="namemanager" placeholder="Prénom du responsable">';
        }
        return ch.one;
    },
    input2: () => {
        let ch = Session.get('choose');
        if (!ch) {
            ch = {};
            ch.two = '<input type="text" class="form-control" name="lastnamemanager" placeholder="Nom du responsable">';
        }
        return ch.two;
    },
    hide: () => {
        let ch = Session.get('choose');
        return (!!ch) ? ch.hide : '';
    },
});

Template.WindowRegistration.events({
    "click #modalReg1": () => {

        $('#myModal11').modal({
            keyboard: true,
            backdrop: true
        });
    },
    'change #fileselect': function (e, template) {
        //  var files = event.target.files;
        var file = e.currentTarget.files[0];
        if (file) {
            // Session.set('photo', file);
        }
        //   for (var i = 0, ln = files.length; i < ln; i++) {
        // alert(newImages.insert(files[i]));
        //    Session.set('photo', Images.insert(files[i]));
        //  }
    },
    'change #fileselect1': function (e, template) {
        //   e.target.preventDefault();
        // var file = e.currentTarget.files[0];
        // if (file) {
        //     var uploadInstance = Images.insert({
        //         file: file,
        //         streams: 'dynamic',
        //         chunkSize: 'dynamic'
        //     }, false);

        //     uploadInstance.on('start', function () {
        //         template.currentUpload.set(this);
        //     });

        //     uploadInstance.on('end', function (error, fileObj) {
        //         if (error) {
        //             alert('Error during upload: ' + error.reason);
        //         } else {
        //             Session.set('cv', fileObj);
        //             //  alert('File "' + fileObj.name + '" successfully uploaded');
        //         }
        //         template.currentUpload.set(false);
        //     });

        //     uploadInstance.start();
        // }
        // var files = event.target.files;
        // for (var i = 0, ln = files.length; i < ln; i++) {
        //     Session.set('cv', Images.insert(files[i]));
        // }
    },
    'change #fileselect2': function (event) {
        //   e.target.preventDefault();
        var files = event.target.files;
        for (var i = 0, ln = files.length; i < ln; i++) {
            Session.set('photo1', Images.insert(files[i]));
        }
    },
    'change #choose input:radio': (e) => {
        let data = {};

        if (!!e.target.checked && e.target.value !== 'prof') {
            data.one = '<input type="text" class="form-control" name="namemanager" placeholder="Prénom">';
            data.two = '<input type="text" class="form-control" name="lastnamemanager" placeholder="Nom">';
            data.hide = 'hidden';
        } else {
            data.one = '<input type="text" class="form-control" name="namemanager" placeholder="Prénom du responsable">';
            data.two = '<input type="text" class="form-control" name="lastnamemanager" placeholder="Nom du responsable">';
            data.hide = '';
        }
        Session.set('choose', data);
    },
    "submit #host": (event, template) => {
        event.preventDefault();


        if (!event.target.checkValidity()) {
            event.preventDefault(); // dismiss the default functionality
            sweetAlert('Veuillez remplir le formulaire'); // error message
            return false;
        }
        sweetAlert('Inscription confirmée');
        var firstname = event.target.firstname.value;
        var name = event.target.name.value;
        var sex = event.target.sex.value;
        var phone = event.target.phone.value;
        var email = event.target.email.value;
        var address = event.target.address.value;
        var zip = event.target.zip.value;
        var city = event.target.city.value;
        var birthday = event.target.ageDay.value + '/' + event.target.ageMonth.value + '/' + event.target.age.value;
        var question1 = event.target.question1.value;
        var question2 = event.target.question2.value;
        var question3 = event.target.question3.value;
        var permB = document.querySelectorAll('#permB input');
        permB = [permB[0].checked, permB[1].checked, permB[2].checked, permB[3].checked, permB[4].checked];
        /// var car = document.querySelectorAll('#car input');
        //    car = [car[0].checked, car[1].checked, car[2].checked];
        //  var scooter = chouse('scooter'); // event.target.scooter.value;
        var height = event.target.height.value;
        //   var vest = chouse('vest'); //event.target.vest.value;
        // var suitJacketSize = chouse('suitJacketSize'); //event.target.suitJacketSize.value;
        //    var pantsSize = chouse('pantsSize'); //event.target.pantsSize.value;
        // var studdyLevel = chouse('studdyLevel'); //event.target.studdyLevel.value;
        var studdyLevel = document.querySelectorAll('#studdyLevel input');
        studdyLevel = [studdyLevel[0].checked, studdyLevel[1].checked, studdyLevel[2].checked, studdyLevel[3].checked, studdyLevel[4].checked, studdyLevel[5].checked, studdyLevel[6].checked];
        var engLevel = document.querySelectorAll('#engLevel input');
        engLevel = [engLevel[0].checked, engLevel[1].checked, engLevel[2].checked, engLevel[3].checked, engLevel[4].checked];
        var anlang2 = event.target.anlang2.value;
        var langLevel = chouse('langLevel'); //event.target.langLevel.value;
        var experience = event.target.experience1.value;
        var experience2 = event.target.experience2.value;
        var experience3 = event.target.experience3.value;
        var experience1d = event.target.experience1d.value;
        var experience2d = event.target.experience2d.value;
        var experience3d = event.target.experience3d.value;

        var age = event.target.age.value;
        Accounts.createUser({
            password: 'qwerty',
            email: email,
            profile: {
                type: 'host',
                verified: false,
                firstname: firstname,
                name: name,
                sex: sex,
                phone: phone,
                email: email,
                address: address,
                age: age,
                zip: zip,
                city: city,
                permB: permB,
                //   car: car,
                birthday: birthday,
                question1: question1,
                question2: question2,
                question3: question3,
                favorites: [],
                comment: event.target.comment.value,
                //         photo: Session.get('photo'),
                //       cv: Session.get('cv'),
                //    scooter: scooter,
                height: height,
                //  vest: vest,
                // suitJacketSize: suitJacketSize,
                //  pantsSize: pantsSize,
                studdyLevel: studdyLevel,
                engLevel: engLevel,
                anlang2: anlang2,
                experience: experience,
                experience2: experience2,
                experience3: experience3,
                experience1d: experience1d,
                experience2d: experience2d,
                experience3d: experience3d,
                createdAt: new Date()
            }
        }, (err) => {
            if (!err) {
                var user = Meteor.user();

                Meteor.call('Payment.methods.createMangoUser', user, Meteor.userId(), 'natural', (error, success) => {
                    if (error) {
                        console.log('error', error);
                    }
                    if (success) {

                    }
                });

                var type = user.profile.type;
                Analytics.insert({
                    date: new Date(),
                    type: type,
                    name: user.profile.name,
                    op: 'register',
                    path: Iron.Location.get().path
                });
                var uploadInstance = Images.insert({
                    meta: {
                        ownerId: Meteor.userId()
                    },
                    file: document.querySelector('#fileselect').files[0],
                    // transport:'http',
                    streams: 'dynamic',
                    chunkSize: 'dynamic'
                }, false);


                var uploadInstance1 = Cvs.insert({
                    meta: {
                        ownerId: Meteor.userId()
                    },
                    file: document.querySelector('#fileselect1').files[0],
                    // transport:'http',
                    streams: 'dynamic',
                    chunkSize: 'dynamic'
                }, false);


                uploadInstance.on('start', function () {
                    template.currentUpload.set(this);
                });

                uploadInstance.on('end', function (error, fileObj) {
                    if (error) {
                        alert('Error during upload: ' + error.reason);
                    } else {
                        uploadInstance1.start();


                        // alert('File "' + fileObj.name + '" successfully uploaded');
                    }
                    template.currentUpload.set(false);
                });

                uploadInstance.start();





                uploadInstance1.on('start', function () {
                    template.currentUpload.set(this);
                });

                uploadInstance1.on('end', function (error, fileObj) {
                    if (error) {
                        alert('Error during upload: ' + error.reason);
                    } else {

                        Meteor.call('sendVerificationLink', (error, response) => {
                            if (error) {
                                alert(error.reason);
                            } else {
                                // sweetAlert('Congrats!');
                                // window.location.assign("/");
                            }
                        });
                        // alert('File "' + fileObj.name + '" successfully uploaded');
                    }
                    template.currentUpload.set(false);
                });


                // sweetAlert({
                //     title: 'Merci',
                //     text: 'Votre candidature a bien été prise en compte, nous reviendrons vers vous dans les plus brefs délais.'
                // }, function () {
                //     window.location.assign("/");
                // });


            } else {
                sweetAlert('Vous êtes déjà enregistrés !');
            }
        });
    },
    "click #modalReg2": () => {

        $('#myModal22').modal({
            keyboard: true,
            backdrop: true
        });
    },
    // "submit #client": (event, template) => {
    //     event.preventDefault();
    //     if (event.target.password.value !== event.target.repeatpassword.value) {
    //         sweetAlert('Vous êtes déjà enregistrés !');
    //         return false;
    //     }

    //     let agr = document.querySelector('#agr');

    //     if (!agr.checked) {
    //         event.preventDefault(); // dismiss the default functionality
    //         sweetAlert('Veuillez remplir le formulaire'); // error message
    //         return false;
    //     }

    //     if (!event.target.checkValidity()) {
    //         event.preventDefault(); // dismiss the default functionality
    //         sweetAlert('Veuillez remplir le formulaire'); // error message
    //         return false;
    //     }
    //     sweetAlert('Inscription confirmée');
    //     let entreprise = event.target.entreprise.value;
    //     if (!entreprise) {
    //         entreprise = 'No company';
    //     }
    //     Accounts.createUser({
    //         password: event.target.password.value,
    //         email: event.target.email.value,
    //         profile: {
    //             type: 'client',
    //             verified: false,
    //             nameManager: event.target.namemanager.value,
    //             entreprise: entreprise,
    //             lastNameManager: event.target.lastnamemanager.value,
    //             tel: event.target.tel.value,
    //             individual: chouse('check5'),
    //             favorite: false,
    //             createdAt: new Date()
    //         }
    //     }, (err) => {
    //         if (!err) {
    //             var user = Meteor.user();

    //             var individual = (!!user.profile.individual) ? 'natural' : 'legal';
    //             Meteor.call('Payment.methods.createMangoUser', user, Meteor.userId(), individual, (error, success) => {
    //                 if (error) {
    //                     console.log('error', error);
    //                 }
    //                 if (success) {

    //                 }
    //             });
    //             var type = user.profile.type;
    //             Analytics.insert({
    //                 date: new Date(),
    //                 type: type,
    //                 name: user.profile.nameManager,
    //                 op: 'register',
    //                 path: Iron.Location.get().path
    //             });
    //             let file = document.querySelector('#fileselect2').files;
    //             if (document.querySelector('#fileselect2').files.length > 0) {
    //                 file = document.querySelector('#fileselect2').files[0];
    //             } else {
    //                 Meteor.call('sendVerificationLink', (error, response) => {
    //                     if (error) {
    //                         alert(error.reason);
    //                     } else {
    //                         sweetAlert('Congrats!');
    //                         window.location.assign("/");
    //                     }
    //                 });


    //                 Companies.insert({
    //                     name: entreprise,
    //                     users: [Meteor.userId()]
    //                 }, function (err) {

    //                     sweetAlert({
    //                         title: 'Merci',
    //                         text: 'Votre candidature a bien été prise en compte, nous reviendrons vers vous dans les plus brefs délais.'
    //                     }, function () {
    //                         window.location.assign("/");
    //                     });

    //                 });
    //             }


    //             var uploadInstance = Images.insert({
    //                 meta: {
    //                     ownerId: Meteor.userId()
    //                 },
    //                 file: file,
    //                 // transport:'http',
    //                 streams: 'dynamic',
    //                 chunkSize: 'dynamic'
    //             }, false);



    //             uploadInstance.on('start', function () {
    //                 template.currentUpload.set(this);
    //             });

    //             uploadInstance.on('end', function (error, fileObj) {
    //                 if (error) {
    //                     alert('Error during upload: ' + error.reason);
    //                 } else {

    //                     Meteor.call('sendVerificationLink', (error, response) => {
    //                         if (error) {
    //                             alert(error.reason);
    //                         } else {
    //                             sweetAlert('Congrats!');
    //                             window.location.assign("/");
    //                         }
    //                     });
    //                     // alert('File "' + fileObj.name + '" successfully uploaded');
    //                 }
    //                 template.currentUpload.set(false);
    //             });

    //             uploadInstance.start();







    //         } else {
    //             console.log(err);
    //             sweetAlert('Vous êtes déjà enregistrés !');
    //         }
    //     });
    // }
});