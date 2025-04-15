import moment from 'moment'
import request from "sync-request";


const sendAlert = (user, miss) => {
  let cl = Meteor.users.findOne(user);
  if (!cl) return false;
  Meteor.call('sendEmail',
    cl.emails[0].address,
    'julie@bemanners.com',
    'mail sent from Julie de manners ( us )',
    `<!DOCTYPE html>
<html>
<head>
<!-- If you delete this meta tag, Half Life 3 will never be released. -->
<meta name="viewport" content="width=device-width" />

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

<title>Mail confirmation (RELANCE J-1)</title>

<link rel="stylesheet" type="text/css" href="http://bemanners.com:8888/stylesheets/email.css" />

</head>

<body bgcolor="#FFFFFF" topmargin="0" leftmargin="0" marginheight="0" marginwidth="0">

<img class="logo show-for-small-only" src="http://bemanners.com:8888/img/logo.png" alt="Manners"></a>

			<div class="content">
				<table>
					<tr>
						<td>

							<!-- A Real Hero (and a real human being) -->
			<h6 align="left">Bonjour ` + cl.profile.firstname + `</h6>
			<div class="text2">
		<p>Nous vous rappelons que votre mission ` + miss.name + ` commence dans moins de 12h.</p>
			<p>C'est le moment de vérifier que tout est bien en place avec vos Manners :</p>

			<div class="btn"><a href="#">Messagerie instantannée</a></div><br><br>

			<p> Merci. </p>
			<p>L'équipe Manners</p>

						</td>
					</tr>
				</table>
			</div>
			<!-- COLUMN WRAP -->
			<div class="divider"></div>

<footer class="footer" style="text-align:center">

                <div class="socialos">
                    <h2></h2> <!-- Réseaux sociaux -->
                    <div class="socials text-center">
                       <a href="https://www.facebook.com/bemanners/?fref=ts"><img src="http://bemanners.com:8888/img/facebook.png" alt=""></a>
                        <a href="https://twitter.com/BeManners"><img src="http://bemanners.com:8888/img/twitter.png" alt=""></a>
                        <a href="https://www.instagram.com/be_manners/"><img src="http://bemanners.com:8888/img/instagram.png" alt=""></a>
                        <a href="#"><img src="http://bemanners.com:8888/img/linkedin.png" alt=""></a>
                    </div>
                </div><br>
                <h4 style="font-weight:500; font-size: 23px;"> Envoyé avec amour par Manners </h4>
                <h6 style="font-weight:900; font-size: 14px; text-transform: uppercase; color:#444;">Préférences d'emails</h6>
</footer>


</body>
</html>
`);
}
let admins = ['rtr6xvYoup8o7eBgG',
  'EvHpao2h9Eg34pLKi',
  'tj7aBfKxo4jQpjmjr',
  'yKf4GyTMYQ8AEaKvb',
  'o6hKzM3CtCeiQhAGG'
];

const missionTimer = () => {
  let missions = Missions.find().fetch();
  missions.forEach(miss => {
    let duration = parseInt(miss.duration.split(' ')[0]);
    let end = miss.endTo;
    let date = moment(new Date(miss.startDate)).add(parseInt(end), 'hours').format();
    date = moment(date).add(duration - 1, 'day');
    let diff = new Date(date).getTime() - new Date().getTime();
    Meteor.setTimeout(() => {
      Missions.update(miss._id, {
        $set: {
          status: 4
        }
      });
      if (miss.start < moment().add(12, 'hours').toDate()) {
        if (!miss.alertSent) {
          Missions.update(miss._id, {
            $set: {
              alertSent: true
            }
          });
          sendAlert(miss.creator, miss);
        }
      }
    }, diff);
  });
}


Meteor.startup(function () {
  let app = Appointment.find().fetch();
  app.forEach(appV => {
    if (!!appV.answer) return;
    let diff = new Date(appV.date).getTime() - new Date().getTime();
    if (diff > 0) {
      setTimeout(() => {
        var user = Meteor.users.findOne(appV.user);
        let answ = false;
        let data = JSON.parse(request('GET', 'https://api.vyte.in/thirdparties/592af17bba526a64003b98b6/groups/bemanners_events/events').getBody('utf8'));
        data = data.map(val => {
          if (val.created_by.email === appV.email) {
            Apointment.update({
              user: user._id
            }, {
              $set: {
                answer: true
              }
            });
            answ = true;
          }
          if (!answer && appV.step == 2) {
            let mText = `Hello ` + user.profile.firstname + ` ` + user.profile.lastname + `,

Nous avons remarqué que tu n'as pas encore fixé de date pour venir nous rencontrer 😔

Tu peux toujours le faire grâce au lien suivant :
https://calendly.com/manners/rencontre/10-06-2016?back=1

Et n'oublie pas si ces créneaux ne te conviennent pas, envoie nous un mail, nous t'en proposerons un nouveau.

Nous t'invitons à lire le guide que nous avons élaboré avant notre rencontre.

Nous avons hâte de te rencontrer 😘
L'équipe Manners

JOINDRE GUIDE DU MANNERS`;
            Meteor.call('sendEmailCli',
              user._id,
              'julie@bemanners.com',
              "Manners | Tu nous aimes plus ? 💔",
              mText);
          } else if (!answer && appV.step == 3) {
            let mText = `Hello ` + user.profile.firstname + ` ` + user.profile.lastname + `,
Nous avons remarqué que tu n'as pas encore fixé de date pour venir nous rencontrer 😔

Tu peux toujours le faire grâce au lien suivant :
https://calendly.com/manners/rencontre/10-06-2016?back=1

Et n'oublie pas si ces créneaux ne te conviennent pas, envoie nous un mail, nous t'en proposerons un nouveau.

Nous t'invitons à lire le guide que nous avons élaboré avant notre rencontre.

Nous avons hâte de te rencontrer 😘
L'équipe Manners

JOINDRE GUIDE DU MANNERS
`;
            Meteor.call('sendEmailCli',
              user._id,
              'julie@bemanners.com',
              "Manners : Derniere chance",
              mText);
          } else if (!answer && step == 4) {
            let mText = `Hello ` + user.profile.firstname + ` ` + user.profile.lastname + ` 😊
J'espère que tu vas bien ?
Où en es-tu de tes démarches ? On a pas de news … On est triste 😢
As-tu besoin d'aide ?

Si tu as des questions surtout n'hésite pas à m'appeler directement sur mon portable.

Have a good day ☀️
L'équipe Manners`;
            Meteor.call('sendEmailCli',
              user._id,
              'julie@bemanners.com',
              "Manners | Besoin d'aide ? Tu nous manques 😢",
              mText);
          }
          return val;
        })
      }, diff);
    }

  });
  Meteor.setInterval(missionTimer, 1000 * 60 * 60 * 24);


  //       let obj = {
  //     File: new Buffer(body).toString('base64')
  //   };
  //   let obj = {
  //     "Tag": "custom meta111",
  //     "Type": "IDENTITY_PROOF"
  //   };
  //   //   userId = Meteor.users.findOne('').mangoUserId;

  //   let userId = '184920807';
  //   let test = MangoPayClient.get('/users/' + userId + '/kyc/documents/');
//     Meteor.bindEnvironment(function (err, res) {
//  base64Img.requestBase64('http://some.org/wp-content/uploads/2015/09/SOME-Logo-JPEG.jpg', function(err, res, body) {
//    console.log('dddd');
//     Meteor.call('Payment.methods.createKYC', 'w', body, function (error, success) {
//     if (error) {
//       console.log('error', error);
//     }
//     if (success) {
//       console.log(success);
//     }
//   });
// });



 


});
