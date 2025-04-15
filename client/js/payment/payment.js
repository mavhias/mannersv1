Template.paiementConfirmed.onCreated(function () {
    let transId = location.href.split('/')[5].split('=')[1];
    console.log(transId);
    Meteor.call('Payment.methods.getTransactions', Meteor.userId(), function (error, success) {
        if (error) {
            console.log('error', error);
        }
        if (success) {
            success.forEach(val => {
                console.log(val);
                if (val.Id === transId && val.Status == "SUCCEEDED") {
                    let id = location.href.split('/')[4].split('?')[0];
                    Missions.update(id, {
                        $set: {
                            status: 3
                        }
                    });
                    Router.go('/client/mes-missions/' + id);

                } else if(val.Id === transId&&val.Status !== "SUCCEEDED") {
                    swal('error');
                }
            }, this);
        }
    });
});