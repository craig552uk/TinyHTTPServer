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

    return this;
  }


  // Public Methods

  /**
   * Start Web Server
   */
  TinyHTTPServer.prototype.start = function(){

  }

  /**
   * Stop Web Server
   */
  TinyHTTPServer.prototype.stop = function(){

  }


  // Private Methods

  /**
   * Create and open a TCP Socket
   */
  var tcp_socket = function(){

  }

  // Export
  window.TinyHTTPServer = TinyHTTPServer;

})(window)