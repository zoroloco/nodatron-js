var pathUtil = require('path'),
    net      = require('net'),
    os       = require('os'),
  	utils    = require(pathUtil.join(__dirname,'./commonutils.js'));

    function TcpServer(log,port){
    	var self     = this;
    	this._log    = log;
      this._port   = port;
      this._server;

      self._log.info("Echoing out network settings of the server:"+JSON.stringify(os.networkInterfaces()));

    	TcpServer.prototype.shutdown = function(){
    		self._log.warn("Shutting down tcp server.");
        if(!utils.isEmpty(self._server)){
          self._server.close(function(){
            self._log.info("TCP Server closed.");
          });
        }
    	}

    	TcpServer.prototype.connect = function(onReceiveData,onLostConnection){

        self._server = net.createServer((socket) => {
          self._log.info("Client has connected on port:"+self._port);

          //if(socket.write("write to client")){}

          socket.on('end', () => {
            self._log.warn("Client has disconnected.");
          });
        })

        //check the number of active connections
        self._server.getConnections(function(err,count){
          if(err){
            self._log.error("Error determining socket connection count:"+err);
          }
          else{
            self._log.info("Sockets connected = "+count);
          }
        });

        self._server.listen(self._port, () => {
           self._log.info("TCP server now bound:"+JSON.stringify(self._server.address()));
        });

        self._server.on('error', (e) => {
          if (e.code == 'EADDRINUSE') {
            self._log.error("Address in use.");
            //close event will be emitted after this event.
          }
        });

        //server close event emitted.(can be called from an error or explicitly)
        self._server.on('close', (e) =>{
          self._log.info("TCP Server has been closed.");
        });

        //call onLostConnection() when tcp issue occurs.
    	}//connect


    }//TcpServer

    module.exports = TcpServer;