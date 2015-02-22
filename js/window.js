
/*
 * Scripts for the app UI
 */

(function(window, $){

  var output = $('#output');

  var print_msg = function(message){
    output.append('<p>' + message + '</p>');
    output.scrollTop(output.height());
  }

  output.click(function(){
    print_msg("Sample Output at " + new Date());
  });


})(window, jQuery)