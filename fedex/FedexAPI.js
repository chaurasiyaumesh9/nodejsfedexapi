var fedexAPI = require('../lib/index');
var util = require('util');
var fs = require('fs');

var fedex = new fedexAPI({
  environment: 'sandbox', // or live
  debug: true,
  key: 'qstnzUNc45LDASzH',
  password: 'PSO5FbBb8Hx0GzL3dgxE8AuVi',
  account_number: '510087640',
  meter_number: '100320172',
  imperial: true // set to false for metric
});

/**
 *  Rates
 */

module.exports = fedex;

