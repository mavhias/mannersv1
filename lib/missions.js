import SimpleSchema from 'simpl-schema';
import { Missions } from '/imports/api/missions.js';

if (Meteor.isServer) {
    var Schemas = {};

    Schemas.Mission = new SimpleSchema({
        name: {
            type: String,
            label: "Nom de la mission *",
            optional: true,
            max: 200
        },
        overview: {
            type: String,
            label: "Descriptif mission",
            max: 1000
        },
        hostesCol: {
            type: Number,
            label: "Nombre d'hotes(ses)",
            min: 1,
            max: 10
        },
        address: {
            type: String,
            label: "Adresse *",
            optional: true
        },
        city: {
            type: String,
            label: "Ville *",
            optional: true,
            max: 1000
        },
        rank: {
            type: Number,
            optional: false,
            min: 0,
            max: 5
        },
        hr: {
            type: Number,
            optional: true,
            min: 0,
            max: 999999999
        },
        price: {
            type: Number,
            optional: true,
            min: 0,
            max: 999999999
        },
        fee: {
            type: Number,
            optional: true,
            min: 0,
            max: 999999999
        },
        zip: {
            type: Number,
            label: "Code Postal *",
            optional: true,
            min: 0,
            max: 100000000
        },
        moreInfo: {
            type: String,
            label: "informations supplémentaire",
            max: 1000
        },
        duration: {
            type: String,
            label: "Durée de la mission",
            max: 50
        },
        startDate: {
            type: Date,
            label: "Date de début<",
            optional: true
        },
        beginsTo: {
            type: String,
            label: "Commence à",
            max: 1000
        },
        endsTo: {
            type: String,
            label: "Termine à",
            max: 1000
        },
        mtype: {
            type: String
        },
        referrer: {
            type: String
        },
        pattern: {
            type: Array
        },
        "pattern.$": {
            type: Object
        },
        "pattern.$.finish": {
            type: String
        },
        "pattern.$.start": {
            type: String
        },
        "pattern.$.mission": {
            type: String
        },
        "pattern.$.sex": {
            type: String
        },
        "pattern.$.date": {
            type: String
        },
        "pattern.$.price": {
            type: Number
        },
        "pattern.$.id": {
            type: Number
        },
        "pattern.$.hid": {
            type: String
        },
        suits: {
            type: Array,
            optional: false
        },
        "suits.$": {
            type: String,
        },
        hostes: {
            type: Array,
            optional: false
        },
        "hostes.$": {
            type: Object
        },
        "hostes.$.id": {
            type: String
        },
        "hostes.$.pid": {
            type: String
        },
        "hostes.$.date": {
            type: String
        },
        "hostes.$.mission": {
            type: String
        },
        preHostes: {
            type: Array,
            optional: false
        },
        "preHostes.$": {
            type: Object
        },
        "preHostes.$.id": {
            type: String
        },
        "preHostes.$.date": {
            type: String
        },
        "preHostes.$.pid": {
            type: String
        },
        "preHostes.$.start": {
            type: String
        },
        "preHostes.$.finish": {
            type: String
        },
        "preHostes.$.mission": {
            type: String
        },
        preHostes2: {
            type: Array,
            optional: false
        },
        "preHostes2.$": {
            type: Object
        },
        "preHostes2.$.id": {
            type: String
        },
        "preHostes2.$.pid": {
            type: String
        },
        "preHostes2.$.date": {
            type: String
        },
        "preHostes2.$.mission": {
            type: String
        },
        company: {
            type: String,
            optional: false
        },
        creator: {
            type: String,
            optional: true
        },
        status: {
            type: Number,
            min: 1,
            max: 5
        },
        // paymentId: {
        //     type: Number,
        //     optional: false
        // },
        createdAt: {
            type: Date,
            optional: true
        }
    });
    Missions._ensureIndex({
        "name": "text"
    });
    // Missions.attachSchema(Schemas.Mission);


    Missions.allow({
        'insert': function () {
            // add custom authentication code here
            return true;
        },
        'update': function () {
            // add custom authentication code here
            return true;
        },
        'remove': function () {
            return true;
        }
    });
    Meteor.publish("missions", function () {
        return Missions.find();
    });
}