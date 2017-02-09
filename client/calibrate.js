var calibrate = function(serialPort) {
    var port = "/dev/ttyS0";
    var delimiter = "\r\n";
    var timer;

    function prep() {
        if!(timer){
            serialPort.write("*\r\n");
        }
        
        timer = setTimeout(Calibrate, 3000);
    }
    
    function stop(){
        clearTimeout(timer);
    }

    function setCommandMode() {
        serialPort.write("K 1\r\n");
    }

    function Calibrate() {
        serialPort.write("U\r\n");
        prep();
    }
};

module.exports = calibrate;
