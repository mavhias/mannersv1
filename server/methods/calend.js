var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
    createEvent: function (userId, startDate, endDate) {
        this.unblock();
        let calendar = google.calendar('v3');
        let user = Meteor.users.findOne(userId);
        if (!user) return;
        var event = {
            'summary': 'Appointment with ' + user.profile.firstname + ' ' + user.profile.name,
            'location': '800 Howard St., San Francisco, CA 94103',
            'description': 'A chance to hear more about Google\'s developer products.',
            'start': {
                'dateTime': startDate, //'2017-01-28T09:00:00-07:00',
                'timeZone': 'America/Los_Angeles',
            },
            'end': {
                'dateTime': endDate, //'2017-01-28T17:00:00-07:00',
                'timeZone': 'America/Los_Angeles',
            },
            'recurrence': [
                'RRULE:FREQ=DAILY;COUNT=2'
            ],
            'attendees': [{
                    'email': user.emails[0].address
                },

            ],
            'reminders': {
                'useDefault': false,
                'overrides': [{
                        'method': 'email',
                        'minutes': 24 * 60
                    },
                    {
                        'method': 'popup',
                        'minutes': 10
                    },
                ],
            },
        };
        // Refer to the Node.js quickstart on how to setup the environment:
        // https://developers.google.com/google-apps/calendar/quickstart/node
        // Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
        // stored credentials.
        var SCOPES = ['https://www.googleapis.com/auth/calendar'];
        var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
            process.env.USERPROFILE);
        var TOKEN_PATH = TOKEN_DIR + '/credentials.json';
        console.log(TOKEN_PATH);
        // Load client secrets from a local file.

        fs.readFile(TOKEN_PATH, function processClientSecrets(err, content) {
            if (err) {
                console.log('Error loading client secret file: ' + err);
                return;
            }
            // Authorize a client with the loaded credentials, then call the
            // Google Calendar API.
            authorize(JSON.parse(content), createEv);
        });



        /**
         * Create an OAuth2 client with the given credentials, and then execute the
         * given callback function.
         *
         * @param {Object} credentials The authorization client credentials.
         * @param {function} callback The callback to call with the authorized client.
         */

        function authorize(credentials, callback) {

            var clientSecret = 'At2ERQFETv5h4VwYH8jvADN7';
            var clientId = '720123193603-f39eqerbdih5pumatvh815ka019jfmlj.apps.googleusercontent.com';
            var redirectUrl = 'http://localhost:3000/oauth2callback';
            var auth = new googleAuth();
            var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
            var key = credentials;
            var jwtClient = new google.auth.JWT(
                key.client_email,
                null,
                key.private_key,
                SCOPES,
                null
            );


            jwtClient.authorize(function (err, tokens) {
                if (err) {
                    console.log(err);
                    return;
                }
                oauth2Client.setCredentials(tokens);
                callback(oauth2Client);
                // Make an authorized request to list Drive files.
            });
        }

        function createEv(auth) {
            calendar.events.insert({
                auth: auth,
                calendarId: 'primary',
                resource: event,
            }, function (err, event) {
                if (err) {
                    console.log('There was an error contacting the Calendar service: ' + err);
                    return;
                }
                console.log('Event created: %s', event.htmlLink);
                Fiber(function () {
                    Meteor.call('sendEmail',
                        user.emails[0].address,
                        'julie@bemanners.com',
                        'Appointment confirm',
                        'Veuillez confirmer votre rendez-vous via ce lien : ' + event.htmlLink);
                }).run();
            });

        }



    },
    'calend.add': async function(data) {
        this.unblock();
        check(data, Object);
        
        try {
            const result = await Calends.insert(data);
            return result;
        } catch (error) {
            throw new Meteor.Error('calend-error', error.message);
        }
    }
});