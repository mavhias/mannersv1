Template.AccueilHote.events({
   'click #menu-open': function() {
        $('.main-menu').css('display', 'block');
    },
    'click #menu-close': function() {
        $('.main-menu').css('display', 'none');
    },
    'click #close-newsletter': function() {
        $('#newsletter-box').css('display', 'none');
    }
});
Template.AccueilHote.helpers({
  myCompany: () => {
      var com = Companies.findOne({
          users: {
              $in: [Meteor.userId()]
          }
      });
      if (!!com && !!com.name) {
          return com.name
      }
      return false;
  }
});

Template.AccueilHote.onRendered(() => {
  var images = document.getElementsByClassName("crop-photo");
  var arr = [];
  for (var i = 0; i < images.length; i++)
  {
    arr.push({image:images[i].childNodes[0], loaded: false});
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
