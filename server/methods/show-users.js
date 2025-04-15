Meteor.methods({
    countUsers: function () {
        if (!this.userId) return false;
        return Meteor.users.find({
            'profile.type': 'host'
        }).count();
    },
    removeImages: function () {
        Images.remove({
            userId: this.userId
        })
    },
    authShowUsers: function (res) {
        if (res === '453t465h56R#%G4we4') {
            return true;
        }
    }
});