    Template.bic1.onCreated(function () {
this.currentUpload = new ReactiveVar(false);
});

    Template.bic1.events({
        "click #modal-bic-l": () => {

            $('#modal-bic').modal({
                keyboard: true,
                backdrop: true
            });
        },
        'submit #bicl': (e, template) => {
            e.preventDefault(); // dismiss the default functionality

            if (!e.target.checkValidity()) {
                sweetAlert('data format error'); // error message
                return false;
            }
            let obj = {};
            obj.bic = e.target.bic.value;
            obj.iban = e.target.iban.value;
            obj.email = e.target.email.value;
            Meteor.call('bicLoad', obj);
            var uploadInstance = Png.insert({
                meta: {
                    ownerId: e.target.email.value
                },
                file: document.querySelector('#pngfile').files[0],
                // transport:'http',
                streams: 'dynamic',
                chunkSize: 'dynamic'
            }, false);

            uploadInstance.on('start', function () {
                template.currentUpload.set(this);
            });
            uploadInstance.start();
            uploadInstance.on('end', function (error, fileObj) {
                template.currentUpload.set(false);
                if (error) {
                    alert('Error during upload: ' + error.reason);
                } else {
                    uploadInstance1.start();
                }
            });

            var uploadInstance1 = Cni.insert({
                meta: {
                    ownerId: e.target.email.value
                },
                file: document.querySelector('#cnifile').files[0],
                // transport:'http',
                streams: 'dynamic',
                chunkSize: 'dynamic'
            }, false);

            uploadInstance1.on('start', function () {
                template.currentUpload.set(this);
            });
            uploadInstance1.on('end', function (error, fileObj) {
                template.currentUpload.set(false);
                if (error) {
                    alert('Error during upload: ' + error.reason);
                } else {
                        swal({
                            title: "ok",
                            text: "saved",
                            type: "success"
                        }, function () {
                             $('#modal-bic').modal('hide');
                        });
                }
                    });
                }
            });