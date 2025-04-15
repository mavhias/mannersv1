Template.HoteProfileC.helpers({

    favCol: () => {
        var prof = Meteor.user().profile;
        if (!!prof.favorites) {
            return prof.favorites.length;
        }
        return 0;
    },
    comments: () => {
        return Comments.find({
            user: Iron.Location.get().path.split('/')[3]
        });
    },
    empty: (val) => {
        if (!!val) return val;
        return 'Aucun';
    },
    commCol: () => {
        return Comments.find({
            user: Iron.Location.get().path.split('/')[3]
        }).count();
    },
    myCompany: () => {
        return Companies.findOne({
            users: {
                $in: [Iron.Location.get().path.split('/')[3]]
            }
        }).name;
    },
    user: () => {
        return Meteor.users.findOne({
            _id: Iron.Location.get().path.split('/')[3]
        });
    },
    travled: () => {
        return Meteor.users.findOne({
            _id: Iron.Location.get().path.split('/')[3]
        }).profile.travled || 0;
    },
    missions: () => {
        return Missions.find({
            hostes: {
                $in: [Iron.Location.get().path.split('/')[3]]
            }
        }).count();
    },
    recom: () => {
        return Recomendations.find({
            user: Iron.Location.get().path.split('/')[3]
        });

    },
    recomNum: () => {
        return Recomendations.find({
            user: Iron.Location.get().path.split('/')[3]
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
                $in: [Iron.Location.get().path.split('/')[3]]
            },
            status: {
                $not: 3
            }
        }).count();
    }
});

Template.HoteProfileC.events({
    'click #back': () => {
        Router.go('/nouvelle-mission/5');
    },
    'click #order': function (e) {
        e.preventDefault();

        // Session.set('amission-id', id);
        var id = location.href.split('/')[5];

        var f = Favorites.find({
            _id: Meteor.userId()
        }).count();
        if (f > 0) {
            Favorites.update({
                _id: Meteor.userId()
            }, {
                $push: {
                    users: id
                }
            });
        } else {
            Favorites.insert({
                _id: Meteor.userId(),
                users: [id]
            });
        }
        //         if (miss.hostes.length > miss.hostesCol) {
        //             Meteor.call('sendEmailCli',
        //                 id,
        //                 'julie@bemanners.com',
        //                 'Julie Manners',
        //                 `Bonjour [prénom],

        // Nous avons trouvé les [montant] Manners qui correspondent le plus à vos attentes pour la mission suivante :
        // - nom du client
        // - nom de la mission
        // - date de la mission

        // Vous pouvez accéder aux profils en cliquant ici :
        // <a href="http://bemanners.com/client/mes-missions">Valider la mission</a>


        // Merci,
        // L’équipe Manners
        // `);
        //             Meteor.call('sendEmailCli',
        //                 id,
        //                 'julie@bemanners.com',
        //                 'Julie Manners',
        //                 `Bonjour [prénom],

        // Nous avons trouvé plusieurs Manners qui correspondent à vos attentes pour la mission suivante :
        // - nom du client
        // - nom de la mission
        // - date de la mission

        // Vous pouvez désormais sélectionner les profils qui répondent le plus à vos besoins.
        // <a href="http://bemanners.com/client/mes-missions">sélectionner les manners</a>

        // Merci,
        // L’équipe Manners
        // `);

        //             return false;
        //         }


        // Missions.update(mid, {
        //     $push: {
        //         hostes: {
        //             id: id,
        //             date: date
        //         }
        //     }
        // });

        // if (miss.hostes.length == miss.hostesCol) {
        //     Missions.update(mid, {
        //         $set: {
        //             status: 3
        //         },
        //         $push: {
        //             hostes: {
        //                 id: id,
        //                 date: date
        //             }
        //         }
        //     });
        // } else {
        //     Missions.update(mid, {
        //         $set: {
        //             status: 4
        //         },
        //         $push: {
        //             hostes: {
        //                 id: id,
        //                 date: date
        //             }
        //         }
        //     });
        // }
    }
});