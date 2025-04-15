if(Meteor.isClient) {
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '909556402492582',
      status     : true,
      xfbml      : true,
      version    : 'v2.5'
    });
  };
}

   