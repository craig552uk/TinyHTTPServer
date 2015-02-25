"use strict";

/**
 * HTTP Server Object
 */

(function(window){


  // Class definition

  var TinyHTTPServer = function(options){
    this.options = options || {};
    this.port    = this.options.port || 8080;
    this.host    = this.options.host || "127.0.0.1";
    this.webroot = this.options.webroot;
    this.running = false;
    this.terminal = {'log': function(msg){}, 'error': function(msg){}}; // Local console output handlers
    this.socket_id;

    return this;
  }

  // Public Methods

  /**
   * Start Web Server
   */
  TinyHTTPServer.prototype.start = function(){
    this.socket_id = open_tcp_socket(this);
    if(this.socket_id){
      console.log("Opened socket with id " + this.socket_id)
      this.running = true;
    }
  }

  /**
   * Stop Web Server
   */
  TinyHTTPServer.prototype.stop = function(){
    if(this.socket_id){
      console.log("Stopping socket with id " + this.socket_id)
      close_tcp_socket(this);
      this.running = false;
      this.socket_id = undefined;
    }else{
      this.error("No socket open with id " + this.socket_id);
    }
  }


  // Private Methods
  var

  /**
   * Create, open and listen on a TCP Socket
   */
  open_tcp_socket = function(http){
    var socket_id;

    // Create socket
    chrome.sockets.tcpServer.create(function(socket_info) {
      socket_id = socket_info.socketId

      // Use socket to listen on name:port
      chrome.sockets.tcpServer.listen(socket_id, http.host, http.port, function(result_code){
        if(result_code < 0){
          terminal.error("Could not create TCP socket " + chrome.runtime.lastError.message)

        }else{
          http.terminal.log("Serving on <a href=\"http://" + http.host + ":" + http.port + "\" target=\"_blank\">http://" + http.host + ":" + http.port + "</a>");

          // Listen on socket for connections
          chrome.sockets.tcpServer.onAccept.addListener(function(accept){

            // Handler to receive data
            chrome.sockets.tcp.onReceive.addListener(function(request){
              if(request.socketId != accept.clientSocketId){ return; }

              // Handle request, build response
              var response = request_handler(request, http.terminal);

              // Send response back to client
              chrome.sockets.tcp.send(accept.clientSocketId, response, function(resultCode) {
                  if(resultCode.resultCode < 0){
                    http.terminal.error("Could not send data " + chrome.runtime.lastError.message)
                  }
              });
            });

            // Socket of new connection is paused by defualt, so we unpause it
            chrome.sockets.tcp.setPaused(accept.clientSocketId, false);
          });

          // Save socket id in HTTP object
          http.socket_id = socket_id;
        }
      })
    });
  },


  /**
   * Close TCP socket
   */
  close_tcp_socket = function(http){
    chrome.sockets.tcpServer.close(http.socket_id, function(){
      http.terminal.log("Stopped listening on " + http.host + ":" + http.port);
    })
  },


  /**
   * Convert ArrayBuffer to String
   */
  buffer_to_string = function(buffer, encoding){
    encoding = encoding || 'utf-8';
    var dataView = new DataView(buffer);
    var decoder  = new TextDecoder(encoding);
    return decoder.decode(dataView);
  },


  /**
   * Convert string to ArrayBuffer
   */
  string_to_buffer = function(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  },

  /**
   * Accept an HTTP request
   * Return an HTTP response
   */
  request_handler = function(request, terminal){
    var
    request_head  = buffer_to_string(request.data).split("\r\n"),
    response_body = "Hello Shite World!",
    response_head = [
      "HTTP/1.1 200 OK",
      "Date: " + (new Date()).toGMTString(),
      "Accept-Ranges: bytes",
      "Content-Length: " + response_body.length,
      "Content-Type: text/html",
      "",
      response_body
    ];

    terminal.log("---")
    terminal.log(request_head.join("<br>"));
    terminal.log("---")
    terminal.log(response_head.join("<br>"));

    return string_to_buffer(response_head.join("\r\n"));
  }


  // Export Class
  window.TinyHTTPServer = TinyHTTPServer;

})(window)