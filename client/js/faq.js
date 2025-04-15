Template.Faq.rendered = function() {
    new WOW().init();
}

Template.Faq.helpers({
    listChouse: function(arg) {},
    questData: function() {
        if (Session.get('listChouse')) {
            return Questions.find({
                question: 1
            }, {
                fields: {
                    'data': 1
                }
            });
        } else {
            return Questions.find({
                question: 0
            }, {
                fields: {
                    'data': 1
                }
            });
        }
    }
});

Template.Faq.events({
    'click button': function(e) {
        $('button').removeAttr('style');
        $(e.target).css('color', '#666');
        $(e.target).css('background-color', '#fbae17', 'important');
        $(e.target).css('border', '1px solid white', 'important');

        Session.set('listChouse', parseInt(e.target.value));
        $('#accordion').removeClass('hidden');
    },

    'click #menu-open': function() {
        $('.main-menu').css('display', 'block');
    },
    'click #menu-close': function() {
        $('.main-menu').css('display', 'none');
    }
});
