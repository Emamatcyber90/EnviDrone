"use strict";
var observer;
var moment = require('moment')
var FormatTime = require('../client/TimeService').FormatTime;
var SetTime = require('../client/TimeService').SetTime;
var bjson = require('bjson');
var settings = bjson('settings', function(observe) {
    observer = observe;
    observe.on('change', function(changes) {})
});

module.exports.config = settings;
module.exports.observe = observer