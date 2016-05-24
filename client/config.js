module.exports = (function () {

  var configInstance;

  function intialize () {

    function load() {
      // underlying printer mechanics
    }

    function turnOn() {
      // warm up
      // check for paper
    }

    return {
      // public + private states and behaviors
      print: print,
      turnOn: turnOn
    };
  }

  return {
    getInstance: function() {
      if(!configInstance) {
        configInstance = intialize();
      }
      return configInstance;
    }
  };

})();