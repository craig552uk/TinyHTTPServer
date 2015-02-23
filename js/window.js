
/*
 * Scripts for the app UI
 */

(function(window, $){

  var output = $('#output');

  var print_msg = function(message){
    output.append('<p>' + message + '</p>');
    output.scrollTop(output.height());
  }

  // output.click(function(){
  //   print_msg("Sample Output at " + new Date());
  // });

  chrome.runtime.getBackgroundPage(function(background){

    // Test TinyHTTPServer
    var http = new background.TinyHTTPServer();
    http.console.log = function(msg){
      console.log(msg)
      print_msg(msg);
    }
    http.console.error = function(msg){
      console.error(msg);
      print_msg("ERROR " + msg);
    }
    http.start();
  })



})(window, jQuery)