Template.myForm.events({
    'click #button9': (e) => {
    e.preventDefault();
var cid = Session.get('cloth-id-cur');

        if (!!cid) {
            Cloth.update({
                _id: cid
            }, {
                $set: {
                    info: $('#cloth-info').val(),
                    sex: $('#cloth-sex').val(),
                    job: $('#cloth-job').val()
                }
            });
        }
    },
    'change #fileselect': function(event, template) {
        var files = event.target.files;
        for (var i = 0, ln = files.length; i < ln; i++) {
            Suits.insert(files[i], (err, fileObj) => {
                Cloth.insert({
                    suit_id: fileObj._id
                }, (err, fileObj) => {
                  Session.set('cloth-id-cur', fileObj);
                });
                //Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
            });
        }
    }
});

Template.fileList.helpers({
    files: function() {
        return Suits.find();
    }
});
