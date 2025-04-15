Template.AccueilHote.onCreated(function() {
  // Initialisation du template
  this.subscribe('userList', 'all');
});

Template.AccueilHote.helpers({
  isLoggedIn() {
    return !!Meteor.userId();
  },
  
  currentUser() {
    return Meteor.user();
  },
  
  isAdmin() {
    return Meteor.user() && Meteor.user().profile && Meteor.user().profile.type === 'admin';
  }
});

Template.AccueilHote.events({
  'click #menu-open': function(event) {
    event.preventDefault();
    $('#main-menu').addClass('active');
  },
  
  'click #menu-close': function(event) {
    event.preventDefault();
    $('#main-menu').removeClass('active');
  },
  
  'click .menu-toggle-resp': function(event) {
    $('#main-menu').removeClass('active');
  }
}); 