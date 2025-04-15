import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
import { Messages } from '/imports/api/messages';

Template.sChatBox.onCreated(() => {
  Session.set('chatTo', '');
});

Template.sChatBox.helpers({
  getIm: (id) => {
    if (!id) return false;
    const user = Meteor.users.findOne(id);
    return user && user.profile && user.profile.photo ? user.profile.photo.url() : '/images/default-avatar.png';
  },
  
  msgSide: (from) => {
    return from !== Meteor.userId();
  },
  
  messages: () => {
    if (!Session.get('chatTo')) return [];
    return Messages.find({}, { sort: { time: 1 } });
  }
});

Template.sChatBox.events({
  'click #send': (event) => {
    sendMessage();
  },
  
  'keydown input#message': (event) => {
    if (event.which === 13) {
      sendMessage();
    }
  }
});

function sendMessage() {
  const messageInput = document.getElementById('message');
  const messageText = messageInput.value.trim();
  
  if (messageText) {
    const user = Meteor.user();
    const name = user ? (user.profile.name || user.profile.nameManager) : 'Anonymous';
    
    Messages.insert({
      name: name,
      from: Meteor.userId(),
      message: messageText,
      time: Date.now()
    });
    
    messageInput.value = '';
    const messArea = document.getElementById('mess-area');
    if (messArea) {
      messArea.scrollTop = messArea.scrollHeight;
    }
  }
}

Template.sChatBox.onRendered(() => {
  // Initialisation du scroll
  const messArea = document.getElementById('mess-area');
  if (messArea) {
    messArea.scrollTop = messArea.scrollHeight;
  }
}); 