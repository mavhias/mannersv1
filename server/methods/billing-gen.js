import phantom from "phantom";
import phantomjs from "phantomjs-prebuilt";
import path from "path";
import fs from "fs";
import moment from 'moment';
import $ from "jquery";
import jsdom from "jsdom";
import pdf from "html-pdf";
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// import Future from "fibers/future"
// <td class="">11/07/17</td>
// 						<td class="">20 - 22h</td>
// 						<td class="">Sylvain Godard</td>
// 						<td class="">22,50€</td>
// 						<td class="">6h</td>
// 						<td class="">45,00€</td>


Meteor.methods({
  'billing.generate': async function (data) {
    try {
      return new Promise((resolve, reject) => {
        Billing.generate(data, function (error, result) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log(result);
            resolve(result);
          }
        });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
});
