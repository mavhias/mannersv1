Template.index.events({
  'click .resend-verification-link' ( event, template ) {
    Meteor.call( 'sendVerificationLink', ( error, response ) => {
      if ( error ) {
        alert(error.reason);
      } else {
        let email = Meteor.user().emails[ 0 ].address;
        alert(`Verification sent to ${ email }!`);
      }
    });
  }
});
