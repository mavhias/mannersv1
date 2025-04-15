import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Analytics } from '../../api/analytics.js';
import { Calends } from '../../api/calends.js';
import { Appointments } from '../../api/appointments.js';
import { Profiles } from '../../api/profiles.js';
import { Messages } from '../../api/messages.js';
import { Missions } from '../../api/missions.js';
import { Comments } from '../../api/comments.js';
import { Companies } from '../../api/companies.js';

import '../simple-schema-config.js';
import '../collections.js';
import './init-schemas.js';

// Import des schémas
import './schemas/analytics.js';
import './schemas/calends.js';
import './schemas/appointments.js';
import './schemas/profiles.js';
import './schemas/messages.js';
import './schemas/missions.js';
import './schemas/comments.js';
import './schemas/companies.js';

Meteor.startup(() => {
    // Code d'initialisation ici
}); 