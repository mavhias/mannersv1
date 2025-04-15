Template.blog.helpers({
    posts: () => {
        return Posts.find();
    },
    user: (val) => {
        var user = Meteor.users.findOne({
            _id: val
        });
        if (user.profile.type === 'client') {
            return user.profile.nameManager + ' ' + user.profile.lastNameManager;
        } else {
            return user.profile.firstname + ' ' + user.profile.name;
        }
    },
    date: (val) => {
        return translate(moment(val).locale('en').format("dddd Do MMM YY"));
    }
});

Template.blogPost.helpers({
    post: function() {
        var path = Iron.Location.get().path;
        path = path.split('/')[2];
        return Posts.findOne({
            _id: path
        });
    },
    date: (val) => {
        return translate(moment(val).locale('en').format("dddd Do MMM YY"));
    }
});