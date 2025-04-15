Template.HoteCompte.onCreated(
    function () {
        Session.set('profile-nav', 1);
        this.currentUpload = new ReactiveVar(false);
    });

Template.HoteCompte.helpers({
    authCheck: () => {
        if (!Meteor.userId()) {
            sweetAlert({
                title: "Désolé !",
                text: "Vous n'avez pas accès à cette page"
            }, () => {
                Router.go('/accueilhote');
            });
            return false;
        }

        var user = Meteor.user();
        if (user.profile.type === 'client') {
            sweetAlert({
                title: "Désolé !",
                text: "Vous n'avez pas accès à cette page"
            }, () => {
                Router.go('/accueilhote');
            });
            return false;

        }
        return true;
    },
    dateConv: (date) => {
        return translate(moment(date).locale('en').format("dddd Do MMM YY"));
    },

    client: (mid) => {
        if (!!mid) {
            var creator = Missions.findOne(mid).creator;
            alert(Meteor.users.findOne(creator).profile.nameManager);
            return Meteor.users.findOne(creator).profile.nameManager || 'No client';
        }
        return 'No client';
    },
    transacts: () => {
        var trans = ReactiveMethod.call('Payment.methods.getTransactions', Meteor.userId());
        if (trans == undefined || trans.length == 0) return [{
            Tag: false,
            CreationDate: '2016-03-12T00:00:00-06:00',
            Mission: false,
            DebitedFunds: {
                Amount: 1
            }
        }];
        trans = trans.map((val) => {
            if (!!val.Tag) {
                val.Mission = Missions.findOne(val.Tag).name;
            }
            return val;
        });
        return trans;

    },
    nav: (val) => {
        return val === Session.get('profile-nav');
    }
});

Template.infoProfile.helpers({
    descr: () => {
        return Profiles.findOne({
            userId: Meteor.userId()
        }).description;
    }
});

Template.HoteCompte.events({

    "click .nav": (e) => {
        Session.set('profile-nav', parseInt(e.target.id.split('-')[1]));
    },
    "submit #form_coords": (e, template) => {
        e.preventDefault();

        var id = Meteor.user()._id;
        let uInfo = Meteor.user();
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
                'profile.pays': e.target.pays.value,
            }
        });
         var dataObject = {
            Name: e.target.name.value,
            LegalRepresentativeEmail: e.target.email.value,
            LegalRepresentativeAddress: {
                AddressLine1: e.target.address.value,
                AddressLine2: e.target.address2.value,
                Region: "Ile de France",
                City: e.target.city.value,
                PostalCode: e.target.zip.value,
                Country: 'FR'
            },
            LegalRepresentativeBirthday: parseInt(new Date(uInfo.profile.birthday).getTime() / 1000),
            LegalRepresentativeCountryOfResidence: "FR",
            LegalRepresentativeNationality: "FR",
            LegalRepresentativeFirstName: e.target.firstname.value,
            LegalRepresentativeLastName: e.target.name.value,
            LegalPersonType: "BUSINESS"
        };
        Meteor.call('Payment.methods.updateUser', dataObject, function (error, success) {
            if (error) {
                console.log('error', error);
            }
            if (success) {

            }
        });
        $.notify("Nous avons bien pris en compte vos informations de facturation..", {
            clickToHide: true,
            autoHideDelay: 400000,
            style: 'happyblue'
        });
    },
    "submit #form_info": (e, template) => {
        e.preventDefault();
        Meteor.call('removeImages');
        Meteor.setTimeout(
            () => {
                //  swal("Saved", "success");
                $.notify("Nous avons bien pris en compte vos informations de facturation..", {
                    clickToHide: true,
                    autoHideDelay: 400000,
                    style: 'happyblue'
                });
                var id = Meteor.userId();

                var uploadInstance = Images.insert({
                    meta: {
                        ownerId: Meteor.userId()
                    },
                    file: document.querySelector('#fileselect3').files[0],
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

                        // alert('File "' + fileObj.name + '" successfully uploaded');
                    }
                    template.currentUpload.set(false);
                });

                uploadInstance.start();
                let val = e.target.desctext.value;
                if (!!Profiles.findOne({
                        userId: Meteor.userId()
                    })) {
                    Meteor.call('updateUserProfile', {
                        description: val
                    });
                } else {
                    Profiles.insert({
                        userId: Meteor.userId(),
                        description: val,
                        createdAt: new Date()
                    });
                }
                var user = Meteor.users.update(id, {
                    $set: {
                        'profile.photo': Session.get('photo'),
                        'profile.desctext': e.target.desctext.value,
                        //  'profile.hourate': e.target.hourate.value,
                        'profile.permB': e.target.permB.value,
                        'profile.car': e.target.car.value,
                        'profile.scooter': e.target.scooter.value,
                        'profile.studdyLevel': e.target.studdyLevel.value,
                        'profile.engLevel': e.target.engLevel.value,
                        'profile.anlang2': e.target.anlang2.value
                    }
                });
           
                // Meteor.call('Payment.methods.createBankAccount', Meteor.userId(), e.target.iban.value, e.target.iban.value, addr, (error, success) => {
                //     if (error) {
                //         console.log('error', error);
                //         swal('Error create bank account');
                //     }
                //     if (success) {
                //         swal({
                //             title: "Sauvegardé !",
                //             text: "Bravo .",
                //             imageUrl: "images/manners.svg"
                //         });
                //     }
                // });
            }, 700);




    }
});

Template.HoteCompte.onRendered(() => {
    var images = document.getElementsByClassName("crop-photo");
    var arr = [];
    for (var i = 0; i < images.length; i++) {
        arr.push({
            image: images[i].childNodes[0],
            loaded: false
        });
    }

    for (var j = 0; j < arr.length; j++) {
        var image = arr[j];
        arr[j].image.onload = () => {
            image.width = image.image.naturalWidth;
            image.height = image.image.naturalHeight;
            if (image.width > image.height) {
                image.image.classList.add("paysage");
                image.image.parentElement.classList.add("paysage");
            }
            if (image.width < image.height) {
                image.image.classList.add("portrait");
                image.image.parentElement.classList.add("portrait");
            }
        };

    }

    // document.getElementById("header-img").onload = () => {
    //     document.getElementById("header-img").width = document.getElementById("header-img").naturalWidth;
    //     document.getElementById("header-img").height = document.getElementById("header-img").naturalHeight;
    //     if (document.getElementById("header-img").width > document.getElementById("header-img").height) {
    //         document.getElementById("header-img").classList.add("paysage");
    //         document.getElementById("header-img").parentElement.classList.add("paysage");
    //     }
    //     if (image.width < image.height) {
    //         document.getElementById("header-img").classList.add("portrait");
    //         document.getElementById("header-img").parentElement.classList.add("portrait");
    //     }
    // };

});