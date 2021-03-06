/**
 * This is a sample use of the Nodatron module.  It will create a connection
 * to the Arduino and then send some text for the emic2speech module.
*/

var nodatron = require('nodatron');

var arduino = new nodatron({"device" : "/dev/ttyACM0","baud" : 9600});

arduino.on("connected", function(){
  var emic          = arduino.createEmicToSpeech(12);

  emic.speak("Hello. Do you want to play a game?");
});

arduino.on("serialLostConnection", function(msg){
  console.error(msg);
});
