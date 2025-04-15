import request from "sync-request";

Meteor.methods({
    appTimer: function (user, date, step) {
        this.unblock()
        date = moment(new Date(date)).add(2 - 1, 'day');
        // let alert = moment(date).subtract(12, 'hours').format();
        let diff = new Date(date).getTime() - new Date().getTime();
        setTimeout(
            () => {
                let answ = false;
                let data = JSON.parse(request('GET', 'https://api.vyte.in/thirdparties/592af17bba526a64003b98b6/groups/bemanners_events/events').getBody('utf8'));
                data = data.map(val => {
                    if (val.created_by.email === user.profile.email) {
                        Apointment.update({
                            user: user._id
                        }, {
                            $set: {
                                answer: true
                            }
                        });
                        answ = true;
                    }
                    if (!answer && step == 2) {
                        let mText = `Hello ` + user.profile.firstname + ` ` + user.profile.lastname + `,

Nous avons remarqué que tu n’as pas encore fixé de date pour venir nous rencontrer 😔

Tu peux toujours le faire grâce au lien suivant :
https://calendly.com/manners/rencontre/10-06-2016?back=1

Et n’oublie pas si ces créneaux ne te conviennent pas, envoie nous un mail, nous t’en proposerons un nouveau.

Nous t’invitons à lire le guide que nous avons élaboré avant notre rencontre.

Nous avons hâte de te rencontrer 😘
L’équipe Manners

JOINDRE GUIDE DU MANNERS`;
                        Meteor.call('sendEmailCli',
                            user._id,
                            'julie@bemanners.com',
                            "Manners | Tu nous aimes plus ? 💔",
                            mText);
                    } else if (!answer && step == 3) {
                        let mText = `Hello ` + user.profile.firstname + ` ` + user.profile.lastname + `,
Nous avons remarqué que tu n’as pas encore fixé de date pour venir nous rencontrer 😔

Tu peux toujours le faire grâce au lien suivant :
https://calendly.com/manners/rencontre/10-06-2016?back=1

Et n’oublie pas si ces créneaux ne te conviennent pas, envoie nous un mail, nous t’en proposerons un nouveau.

Nous t’invitons à lire le guide que nous avons élaboré avant notre rencontre.

Nous avons hâte de te rencontrer 😘
L’équipe Manners

JOINDRE GUIDE DU MANNERS
`;
                        Meteor.call('sendEmailCli',
                            user._id,
                            'julie@bemanners.com',
                            "Manners : Derniere chance",
                            mText);
                    } else if (!answer && step == 4) {
                        let mText = `Hello ` + user.profile.firstname + ` ` + user.profile.lastname + ` 😊
J’espère que tu vas bien ?
Où en es-tu de tes démarches ? On a pas de news … On est triste 😢
As-tu besoin d’aide ?

Si tu as des questions surtout n’hésite pas à m’appeler directement sur mon portable.

Have a good day ☀️
L'équipe Manners`;
                        Meteor.call('sendEmailCli',
                            user._id,
                            'julie@bemanners.com',
                            "Manners | Besoin d'aide ? Tu nous manques 😢",
                            mText);
                    }
                    return val;
                });

            }, diff);
    },
    loadVyte: function () {
        // var baseRequest = {
        //     headers: {
        //         'x-token': 'NFIIGJJDCDBJGKRDY6IHN3NWFZK4WYV7'
        //     }
        // };
        //  var option = {
        //     qs: {
        //         input: text,
        //         types: 'address',
        //         key: 'AIzaSyDUOjoD-2OogqSYswX85mIkowupAoNcASo',
        //         language: 'fr',
        //         components:{country:'fr'}
        //     }
        // };
        // console.dir(JSON.parse(request('GET', 'https://calendly.com/api/v1/users/me/event_types', baseRequest).getBody('utf8')));
        return JSON.parse(request('GET', 'https://api.vyte.in/thirdparties/592af17bba526a64003b98b6/groups/bemanners_events/events').getBody('utf8'));
    },
    bicLoad: function (obj) {
        this.unblock();
        this.email = obj.email;
        this.bic = obj.bic;
        this.iban = obj.iban;
        Meteor.users.update({
            'email.0.address': this.email
        }, {
            $set: {
                'profile.bic': this.bic,
                'profile.iban': this.iban
            }
        });

    }
});