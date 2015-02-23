"use strict";

/*
 * Event handlers for this app
 */


/*
 * Fired when the app is launched from the launcher
 * https://developer.chrome.com/apps/app_runtime#event-onLaunched
 */
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('views/window.html', {
    'bounds': {
      'width': 400,
      'height': 500
    }
  });
});


/*
 * Sent to the event page just before it is unloaded
 * https://developer.chrome.com/apps/runtime#event-onSuspend
 */
chrome.runtime.onSuspend.addListener(function() {
  // Clean Up
});