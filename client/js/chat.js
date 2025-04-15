/**
 * Templates
 */

Array.prototype.clean = function(deleteValue) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == deleteValue) {
			this.splice(i, 1);
			i--;
		}
	}
	return this;
};

Template.chat.onCreated(() => {
	Session.set('chatTo', '');
});

Template.messages.helpers({
	getIm: (id) => {
		if (!id) return false;
		return Meteor.users.findOne(id).profile.photo.url();
	},
	msgSide: (v) => {
		if (v !== Meteor.userId())
			return 1;
		else return 0;
	},
	check: () => {
		if (!!Session.get('chatTo')) return '#fff';
		return '#eaeaea';
	},
	messages: () => {
		if (!Session.get('chatTo')) return false;
		return Messages.find({
			$or: [{
				from: {
					$in: [Meteor.userId(), Session.get('chatTo')]
				}
			}, {
				to: {
					$in: [Meteor.userId(), Session.get('chatTo')]
				}
			}]
		});
	}

});

Template.chat.helpers({
	type: () => {
		var side = Iron.Location.get().path.split('/')[2];
		return (side === 'chat') ? 1 : 0;
	},
	getUser: (id) => {
		var usr = Meteor.users.findOne({
			_id: id
		});
		if (usr.profile.type !== 'client') {
			return usr.profile.name;
		} else {
			return usr.profile.nameManager;
		}
	},
	getIm: (id) => {
		if (!id) return false;
		return Meteor.users.findOne(id).profile.photo.url();
	},
	transformList: (creator, li) => {
		if (!li) return false;
		if (creator !== Meteor.userId()) {
			li.push({
				id: creator,
				date: new Date()
			});
		}
		li = _.uniq(li, function(item, key, a) {
			return item.id;
		});
		return li.map((v) => {
			if (v.id !== Meteor.userId()) {
				return v;
			}
		}).clean(undefined);
	},
	users: () => {
		var id = Companies.findOne({
			users: {
				$in: [Meteor.userId()]
			}
		});
		if (!!id) {
			id = id._id;
			return Missions.find({
				company: id
			});
		} else {
			var data = Missions.find({
				hostes: {
					$elemMatch: {
						id: Meteor.userId()
					}
				}
			}).fetch();
			if (data.length == 0) {
				data = [{
					name: 'No missions'
				}];
			}
			return data;
		}

	}
});

Template.chat.events({
	'click a': (e, template) => {
		Session.set('chatTo', e.target.id);
	}
});

Template.chat.onRendered(() => {
	function toggleChevron(e) {
    $(e.target)
        .prev('.panel-heading')
        .find("i.indicator")
        .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
}
$('#accordion').on('hidden.bs.collapse', toggleChevron);
$('#accordion').on('shown.bs.collapse', toggleChevron);
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


Template.input.events = {
	'click #send': (event) => {
		if (Session.get('chatTo').length > 1) {
			client = Session.get('chatTo');
		}
		if (Meteor.user())
			var name = Meteor.user().profile.name || Meteor.user().profile.nameManager;
		else
			var name = 'Anonymous';
		var message = document.getElementById('message');
		if (message.value != '') {
			Messages.insert({
				name: name,
				from: Meteor.userId(),
				to: client,
				message: message.value,
				time: Date.now(),
			});

			document.getElementById('message').value = '';
			message.value = '';
			$('#mess-area').scrollTop(900000);
		}
	},
	'keydown input#message': function(event) {
		if (event.which == 13) { // 13 is the enter key event
			// var id = Iron.Location.get().path.split('/')[3];
			// var client = Missions.findOne({
			// 	_id: id
			// });
			// if (!!client) {
			// 	client = client.creator;
			// }
			if (Session.get('chatTo').length > 1) {
				client = Session.get('chatTo');
			}
			if (Meteor.user())
				var name = Meteor.user().profile.name || Meteor.user().profile.nameManager;
			else
				var name = 'Anonymous';
			var message = document.getElementById('message');
			if (message.value != '') {
				Messages.insert({
					name: name,
					from: Meteor.userId(),
					to: client,
					message: message.value,
					time: Date.now(),
				});

				document.getElementById('message').value = '';
				message.value = '';
				$('#mess-area').scrollTop(900000);
			}
		}
	}
}