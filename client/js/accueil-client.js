Template.AccueilClient.onRendered(() => {

    $(".section-features .column").hover(function () {
        $("#content").addClass('transition');

    }, function () {
        $("#content").removeClass('transition');
    });


    var owl = $("#owl-demo");

    owl.owlCarousel({
        items: 6, //10 items above 1000px browser width
        itemsDesktop: [400, 6], //5 items between 1000px and 901px
        itemsDesktopSmall: [300, 6], // betweem 900px and 601px
        itemsTablet: [400, 2], //2 items between 600 and 0
        itemsMobile: false // itemsMobile disabled - inherit from itemsTablet option
    });

    // Custom Navigation Events
    $(".next1").click(function () {
        owl.trigger('owl.next');
    })
    $(".prev1").click(function () {
        owl.trigger('owl.prev');
    })
    $(".play1").click(function () {
        owl.trigger('owl.play', 1000); //owl.play event accept autoPlay speed as second parameter
    })
    $(".stop1").click(function () {
        owl.trigger('owl.stop');
    })


});

Template.AccueilClient.onCreated(() => {
       //     Meteor.subscribe("newImages", 'custom');
   
});
Template.AccueilClient.helpers({
    hostes: () => {

        return Meteor.users.find({
            'profile.type': 'host'
        }, {
            limit: 6
        }); 
    },
    items: () => {
        return [{
            name: 'ssss'
        }, {
            name: 'gggggg'
        }];
    }
});

Template.AccueilClient.events({
    'click #menu-open': function () {
        $('.main-menu').css('display', 'block');
    },
    'click #menu-close': function () {
        $('.main-menu').css('display', 'none');
    },
    'click #close-newsletter': function () {
        $('#newsletter-box').css('display', 'none');
    },
    "click #cliSub1": function (e) {
        e.preventDefault();
        var baseInfo = Session.get('base-info') || {};
        //   baseInfo.beginsTo = document.querySelector('#begins-to1').value;
        Session.set('base-info', baseInfo);
        setTimeout(function () {
            Router.go('/nouvelle-mission/1');
        }, 600);

    }
});

Template.AccueilClient.onRendered(() => {
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

    document.getElementById("header-img").onload = () => {
        document.getElementById("header-img").width = document.getElementById("header-img").naturalWidth;
        document.getElementById("header-img").height = document.getElementById("header-img").naturalHeight;
        if (document.getElementById("header-img").width > document.getElementById("header-img").height) {
            document.getElementById("header-img").classList.add("paysage");
            document.getElementById("header-img").parentElement.classList.add("paysage");
        }
        if (image.width < image.height) {
            document.getElementById("header-img").classList.add("portrait");
            document.getElementById("header-img").parentElement.classList.add("portrait");
        }
    };

});