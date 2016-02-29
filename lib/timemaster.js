var TimeMaster = {

  inventory: [],

};


var p = TimeMaster.prototype;

p.addTimer = function(name, delay, cb){

  TimeMaster.inventory[name] = {
    timer: setTimeout(cb, delay * 1000),
    startTime: (new Date()).getTime(),
    

  }
}