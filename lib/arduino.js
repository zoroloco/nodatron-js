var cp       = require('child_process'),
    pathUtil = require('path'),
	utils    = require(pathUtil.join(__dirname,'./commonutils.js'));
	
function Arduino(log,device,baud){
	var self     = this;
	this._log    = log;
	this._cmd    = pathUtil.join(__dirname,"serialpy.py");
	this._arduino= null;
	
	Arduino.prototype.shutdown = function(){
		self._log.warn("Shutting down arduino serial connection.");
		if(!utils.isEmpty(self._arduino)){
		    process.kill(self._arduino.pid);	
		}		
	}
	
	Arduino.prototype.connect = function(receiveData){
		self._log.info("Spawning arduino serial connection script: "+self._cmd);
				
		self._arduino = cp.spawn('python',
		                       [self._cmd,
							   "--device",device,"--baud",baud]);
					
		//data came in from Arduino
		self._arduino.stdout.on('data', (data) => {			
			self._log.info("stdout: "+data);				
            if(!utils.isEmpty(receiveData)){
				receiveData(data);//forward the data to the callback.
			}			
		});

		self._arduino.stderr.on('data', (data) => {
		  self._log.error("stderr: "+data);
	
		});
		
		self._arduino.on('error', (err) => {
		  self._log.error("Failed to spawn child process with error "+err);
	
		});

		self._arduino.on('close', (code) => {
		  self._log.info("Arduino process closed with code "+code);
		});
		
		self._arduino.on('exit', (code) => {
			self._log.info("Arduino process exited with code "+code);
		
		});					
	}
	
	Arduino.prototype.sendCommand = function(cmd){
		if(!utils.isEmpty(self._arduino)){
			self._arduino.stdin.write(cmd);
		}
	}
}

module.exports = Arduino;