Questions = new Meteor.Collection('questions');

if (Meteor.isServer ) {
    Questions.allow({
        'insert': function() {
            // add custom authentication code here
            return true;
        },
        'update': function() {
            // add custom authentication code here
            return true;
        }
    });


    Meteor.publish("questions", function () {
    return Questions.find({});
});
      Meteor.startup(function() {
          if(Questions.find().count() === 0){
        Questions.insert({ question: 1, data: [{ title: 'Quelle est la différence entre une agence d’hôtes/hôtesses et Manners ?', data: 'sss', id: 1 }] });
         }
    });      
}
