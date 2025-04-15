import { Analytics } from '../../../api/analytics.js';
import SimpleSchema from 'simpl-schema';

const AnalyticsSchema = new SimpleSchema({
    userId: {
        type: String,
        optional: true,
        regEx: /^[a-zA-Z0-9]{17}$/ // Format d'ID Meteor standard
    },
    eventType: {
        type: String,
        allowedValues: ['page_view', 'click', 'form_submit', 'login', 'logout']
    },
    page: {
        type: String,
        max: 200
    },
    data: {
        type: Object,
        blackbox: true,
        optional: true
    },
    createdAt: {
        type: Date,
        optional: true,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            }
        }
    }
});

Analytics.attachSchema(AnalyticsSchema); 