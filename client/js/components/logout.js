Template.logoutC.events({
  "click #logout-c": (e) => {
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
