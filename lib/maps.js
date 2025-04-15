import SimpleSchema from 'simpl-schema';
import { Test } from '/imports/api/test.js';

//This is the default address schema
Schema = {};
Schema.Address = new SimpleSchema({
  formattedAddress: {
    type: String,
    optional: true
  },
  geopoint: {
    type: [Number], //[longitude, latitude]
    decimal: true,
    optional: true
  },
  city: {
    type: String,
    optional: true
  },
  postalCode: {
    type: String,
    optional: true
  },
  country: {
    type: String,
    optional: true
  },
  countryName: {
    type: String,
    optional: true
  }
});


Schema.Test = new SimpleSchema({
  address: {
    type: Schema.Address,
    optional: true,
    autoform: {
      type: 'google-places-input'
      // geopointName: "myOwnGeopointName" //optional, you can use a custom geopoint name
    }
  },
  text: { // useless in our example
    type: String,
    optional: true
  }
});
Test.attachSchema(Schema.Test);