/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import {
  Factory
} from 'meteor/dburles:factory';
import {
  chai
} from 'meteor/practicalmeteor:chai';
import {
  Template
} from 'meteor/templating';
import {
  Missions
} from '../../lib/missions.js';
import {
  Companies
} from '../../lib/companies';
import {
  $
} from 'meteor/jquery';
if (Meteor.isServer) {
  describe('DB tests', function () {
    // beforeEach(function () {
    //   Template.registerHelper('_', key => key);
    // });
    // afterEach(function () {
    //   Template.deregisterHelper('_');
    // });
      it('fail creation, not enoth data',function(){
      var expect = chai.expect;
      Factory.define('companies', Companies, {
        users: 'new company'
      }).after(author => {
        expect(author).to.not.be.a('string');
      });
    });
    it('creates mission', function () {
      var expect = chai.expect;
      console.log('wedewdewdewdewdew',Missions);
      Factory.define('miss', Missions, {
        name: 'new Mission'
      }).after(author => {
        expect(author).to.be.a('string');
      });
 
    });
  
  });
}
