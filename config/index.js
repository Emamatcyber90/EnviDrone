"use strict";

var bjson  = require('bjson'),
    settings = bjson('settings',function(observe){
      observe.on('change', function(changes){
          console.log('Path:', changes.path);
          console.log('Old Value:', changes.oldValue);
          console.log('New Value:', changes.value);
          console.log('-----');
      })
    });

if(Object.keys(settings).length === 0){

  //Create default settings
  settings.carbon = 800;
  settings.humidity = 40;
  settings.lightOn = 20;
  settings.lightOff = 7;
  settings.waterCycle = 120;
  settings.waterDuration = 3.5;
}

module.exports = settings;