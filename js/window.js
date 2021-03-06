
/*
 * Scripts for the app UI
 */

(function(window, $){

  var
  http, // HTTP Server instance
  output    = $('#output'),
  btn_dir   = $('#directory'),
  btn_start = $('#start'),
  btn_stop  = $('#stop');

  var print_msg = function(message){
    output.append('<p>' + message + '</p>');
    output[0].scrollTop = output[0].scrollHeight;
  }

  btn_dir.click(function(){
    chrome.fileSystem.chooseEntry({'type': 'openDirectory'}, function(directory){
      if(directory){
        // TODO save persistantly
        chrome.fileSystem.getDisplayPath(directory, function(display_path){
          print_msg("Web root directory: <strong>" + display_path + "</strong>");
          http && http.set_webroot(directory);
        })
      }
    })
  })

  btn_start.click(function(){
    http && http.start();
  })

  btn_stop.click(function(){
    http && http.stop();
  })

  chrome.runtime.getBackgroundPage(function(background){

    // Create TinyHTTPServer instance and assign messaging handlers
    http = new background.TinyHTTPServer();
    http.terminal.log = function(msg){
      print_msg(msg);
    }
    http.terminal.error = function(msg){
      print_msg("ERROR " + msg);
    }

    window.http = http; // For inspection

    print_msg("&nbsp;")
    print_msg("&nbsp;Tiny HTTP Server");
    print_msg("==================");
    print_msg("&nbsp;");
  })

})(window, jQuery)