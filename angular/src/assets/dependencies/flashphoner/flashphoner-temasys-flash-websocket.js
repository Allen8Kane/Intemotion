/*! adapterjs - v0.14.3-6d236da - 2017-05-24 */

// Adapter's interface.
var AdapterJS = AdapterJS || {};

AdapterJS.options = AdapterJS.options || {};

// uncomment to get virtual webcams
// AdapterJS.options.getAllCams = true;

// uncomment to prevent the install prompt when the plugin in not yet installed
// AdapterJS.options.hidePluginInstallPrompt = true;

// AdapterJS version
AdapterJS.VERSION = '0.14.3-6d236da';

// This function will be called when the WebRTC API is ready to be used
// Whether it is the native implementation (Chrome, Firefox, Opera) or
// the plugin
// You may Override this function to synchronise the start of your application
// with the WebRTC API being ready.
// If you decide not to override use this synchronisation, it may result in
// an extensive CPU usage on the plugin start (once per tab loaded)
// Params:
//    - isUsingPlugin: true is the WebRTC plugin is being used, false otherwise
//
AdapterJS.onwebrtcready = AdapterJS.onwebrtcready || function(isUsingPlugin) {
  // The WebRTC API is ready.
  // Override me and do whatever you want here
};

// New interface to store multiple callbacks, private
AdapterJS._onwebrtcreadies = [];

// Sets a callback function to be called when the WebRTC interface is ready.
// The first argument is the function to callback.\
// Throws an error if the first argument is not a function
AdapterJS.webRTCReady = function (baseCallback) {
  if (typeof baseCallback !== 'function') {
    throw new Error('Callback provided is not a function');
  }

  var callback = function () {
    // Make users having requirejs to use the webRTCReady function to define first
    // When you set a setTimeout(definePolyfill, 0), it overrides the WebRTC function
    // This is be more than 0s
    if (typeof window.require === 'function' &&
      typeof AdapterJS._defineMediaSourcePolyfill === 'function') {
      AdapterJS._defineMediaSourcePolyfill();
    }

    // All WebRTC interfaces are ready, just call the callback
    baseCallback(null !== AdapterJS.WebRTCPlugin.plugin);
  };



  if (true === AdapterJS.onwebrtcreadyDone) {
    callback();
  } else {
    // will be triggered automatically when your browser/plugin is ready.
    AdapterJS._onwebrtcreadies.push(callback);
  }
};

// Plugin namespace
AdapterJS.WebRTCPlugin = AdapterJS.WebRTCPlugin || {};

// The object to store plugin information
/* jshint ignore:start */
AdapterJS.WebRTCPlugin.pluginInfo = AdapterJS.WebRTCPlugin.pluginInfo || {
  prefix : 'Tem',
  plugName : 'TemWebRTCPlugin',
  pluginId : 'plugin0',
  type : 'application/x-temwebrtcplugin',
  onload : '__TemWebRTCReady0',
  portalLink : 'https://skylink.io/plugin/',
  downloadLink : null, //set below
  companyName: 'Temasys',
  downloadLinks : {
    mac: 'https://bit.ly/webrtcpluginpkg',
    win: 'https://bit.ly/webrtcpluginmsi'
  }
};
if(typeof AdapterJS.WebRTCPlugin.pluginInfo.downloadLinks !== "undefined" && AdapterJS.WebRTCPlugin.pluginInfo.downloadLinks !== null) {
  if(!!navigator.platform.match(/^Mac/i)) {
    AdapterJS.WebRTCPlugin.pluginInfo.downloadLink = AdapterJS.WebRTCPlugin.pluginInfo.downloadLinks.mac;
  }
  else if(!!navigator.platform.match(/^Win/i)) {
    AdapterJS.WebRTCPlugin.pluginInfo.downloadLink = AdapterJS.WebRTCPlugin.pluginInfo.downloadLinks.win;
  }
}

/* jshint ignore:end */

AdapterJS.WebRTCPlugin.TAGS = {
  NONE  : 'none',
  AUDIO : 'audio',
  VIDEO : 'video'
};

// Unique identifier of each opened page
AdapterJS.WebRTCPlugin.pageId = Math.random().toString(36).slice(2);

// Use this whenever you want to call the plugin.
AdapterJS.WebRTCPlugin.plugin = null;

// Set log level for the plugin once it is ready.
// The different values are
// This is an asynchronous function that will run when the plugin is ready
AdapterJS.WebRTCPlugin.setLogLevel = null;

// Defines webrtc's JS interface according to the plugin's implementation.
// Define plugin Browsers as WebRTC Interface.
AdapterJS.WebRTCPlugin.defineWebRTCInterface = null;

// This function detects whether or not a plugin is installed.
// Checks if Not IE (firefox, for example), else if it's IE,
// we're running IE and do something. If not it is not supported.
AdapterJS.WebRTCPlugin.isPluginInstalled = null;

 // Lets adapter.js wait until the the document is ready before injecting the plugin
AdapterJS.WebRTCPlugin.pluginInjectionInterval = null;

// Inject the HTML DOM object element into the page.
AdapterJS.WebRTCPlugin.injectPlugin = null;

// States of readiness that the plugin goes through when
// being injected and stated
AdapterJS.WebRTCPlugin.PLUGIN_STATES = {
  NONE : 0,           // no plugin use
  INITIALIZING : 1,   // Detected need for plugin
  INJECTING : 2,      // Injecting plugin
  INJECTED: 3,        // Plugin element injected but not usable yet
  READY: 4            // Plugin ready to be used
};

// Current state of the plugin. You cannot use the plugin before this is
// equal to AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY
AdapterJS.WebRTCPlugin.pluginState = AdapterJS.WebRTCPlugin.PLUGIN_STATES.NONE;

// True is AdapterJS.onwebrtcready was already called, false otherwise
// Used to make sure AdapterJS.onwebrtcready is only called once
AdapterJS.onwebrtcreadyDone = false;

// Log levels for the plugin.
// To be set by calling AdapterJS.WebRTCPlugin.setLogLevel
/*
Log outputs are prefixed in some cases.
  INFO: Information reported by the plugin.
  ERROR: Errors originating from within the plugin.
  WEBRTC: Error originating from within the libWebRTC library
*/
// From the least verbose to the most verbose
AdapterJS.WebRTCPlugin.PLUGIN_LOG_LEVELS = {
  NONE : 'NONE',
  ERROR : 'ERROR',
  WARNING : 'WARNING',
  INFO: 'INFO',
  VERBOSE: 'VERBOSE',
  SENSITIVE: 'SENSITIVE'
};

// Does a waiting check before proceeding to load the plugin.
AdapterJS.WebRTCPlugin.WaitForPluginReady = null;

// This methid will use an interval to wait for the plugin to be ready.
AdapterJS.WebRTCPlugin.callWhenPluginReady = null;

// !!!! WARNING: DO NOT OVERRIDE THIS FUNCTION. !!!
// This function will be called when plugin is ready. It sends necessary
// details to the plugin.
// The function will wait for the document to be ready and the set the
// plugin state to AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY,
// indicating that it can start being requested.
// This function is not in the IE/Safari condition brackets so that
// TemPluginLoaded function might be called on Chrome/Firefox.
// This function is the only private function that is not encapsulated to
// allow the plugin method to be called.
__TemWebRTCReady0 = function () {
  if (document.readyState === 'complete') {
    AdapterJS.WebRTCPlugin.pluginState = AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY;
    AdapterJS.maybeThroughWebRTCReady();
  } else {
    var timer = setInterval(function () {
      if (document.readyState === 'complete') {
        // TODO: update comments, we wait for the document to be ready
        clearInterval(timer);
        AdapterJS.WebRTCPlugin.pluginState = AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY;
        AdapterJS.maybeThroughWebRTCReady();
      }
    }, 100);
  }
};

AdapterJS.maybeThroughWebRTCReady = function() {
  if (!AdapterJS.onwebrtcreadyDone) {
    AdapterJS.onwebrtcreadyDone = true;

    // If new interface for multiple callbacks used
    if (AdapterJS._onwebrtcreadies.length) {
      AdapterJS._onwebrtcreadies.forEach(function (callback) {
        if (typeof(callback) === 'function') {
          callback(AdapterJS.WebRTCPlugin.plugin !== null);
        }
      });
    // Else if no callbacks on new interface assuming user used old(deprecated) way to set callback through AdapterJS.onwebrtcready = ...
    } else if (typeof(AdapterJS.onwebrtcready) === 'function') {
      AdapterJS.onwebrtcready(AdapterJS.WebRTCPlugin.plugin !== null);
    }
  }
};

// Text namespace
AdapterJS.TEXT = {
  PLUGIN: {
    REQUIRE_INSTALLATION: 'This website requires you to install a WebRTC-enabling plugin ' +
      'to work on this browser.',
    NOT_SUPPORTED: 'Your browser does not support WebRTC.',
    BUTTON: 'Install Now'
  },
  REFRESH: {
    REQUIRE_REFRESH: 'Please refresh page',
    BUTTON: 'Refresh Page'
  }
};

// The result of ice connection states.
// - starting: Ice connection is starting.
// - checking: Ice connection is checking.
// - connected Ice connection is connected.
// - completed Ice connection is connected.
// - done Ice connection has been completed.
// - disconnected Ice connection has been disconnected.
// - failed Ice connection has failed.
// - closed Ice connection is closed.
AdapterJS._iceConnectionStates = {
  starting : 'starting',
  checking : 'checking',
  connected : 'connected',
  completed : 'connected',
  done : 'completed',
  disconnected : 'disconnected',
  failed : 'failed',
  closed : 'closed'
};

//The IceConnection states that has been fired for each peer.
AdapterJS._iceConnectionFiredStates = [];


// Check if WebRTC Interface is defined.
AdapterJS.isDefined = null;

// This function helps to retrieve the webrtc detected browser information.
// This sets:
// - webrtcDetectedBrowser: The browser agent name.
// - webrtcDetectedVersion: The browser version.
// - webrtcMinimumVersion: The minimum browser version still supported by AJS.
// - webrtcDetectedType: The types of webRTC support.
//   - 'moz': Mozilla implementation of webRTC.
//   - 'webkit': WebKit implementation of webRTC.
//   - 'plugin': Using the plugin implementation.
AdapterJS.parseWebrtcDetectedBrowser = function () {
  var hasMatch = null;

  // Detect Opera (8.0+)
  if ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
    hasMatch = navigator.userAgent.match(/OPR\/(\d+)/i) || [];

    webrtcDetectedBrowser   = 'opera';
    webrtcDetectedVersion   = parseInt(hasMatch[1] || '0', 10);
    webrtcMinimumVersion    = 26;
    webrtcDetectedType      = 'webkit';
    webrtcDetectedDCSupport = 'SCTP'; // Opera 20+ uses Chrome 33

  // Detect Bowser on iOS
  } else if (navigator.userAgent.match(/Bowser\/[0-9.]*/g)) {
    hasMatch = navigator.userAgent.match(/Bowser\/[0-9.]*/g) || [];

    var chromiumVersion = parseInt((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./i) || [])[2] || '0', 10);

    webrtcDetectedBrowser   = 'bowser';
    webrtcDetectedVersion   = parseFloat((hasMatch[0] || '0/0').split('/')[1], 10);
    webrtcMinimumVersion    = 0;
    webrtcDetectedType      = 'webkit';
    webrtcDetectedDCSupport = chromiumVersion > 30 ? 'SCTP' : 'RTP';


  // Detect Opera on iOS (does not support WebRTC yet)
  } else if (navigator.userAgent.indexOf('OPiOS') > 0) {
    hasMatch = navigator.userAgent.match(/OPiOS\/([0-9]+)\./);

    // Browser which do not support webrtc yet
    webrtcDetectedBrowser   = 'opera';
    webrtcDetectedVersion   = parseInt(hasMatch[1] || '0', 10);
    webrtcMinimumVersion    = 0;
    webrtcDetectedType      = null;
    webrtcDetectedDCSupport = null;

  // Detect Chrome on iOS (does not support WebRTC yet)
  } else if (navigator.userAgent.indexOf('CriOS') > 0) {
    hasMatch = navigator.userAgent.match(/CriOS\/([0-9]+)\./) || [];

    webrtcDetectedBrowser   = 'chrome';
    webrtcDetectedVersion   = parseInt(hasMatch[1] || '0', 10);
    webrtcMinimumVersion    = 0;
    webrtcDetectedType      = null;
    webrtcDetectedDCSupport = null;

  // Detect Firefox on iOS (does not support WebRTC yet)
  } else if (navigator.userAgent.indexOf('FxiOS') > 0) {
    hasMatch = navigator.userAgent.match(/FxiOS\/([0-9]+)\./) || [];

    // Browser which do not support webrtc yet
    webrtcDetectedBrowser   = 'firefox';
    webrtcDetectedVersion   = parseInt(hasMatch[1] || '0', 10);
    webrtcMinimumVersion    = 0;
    webrtcDetectedType      = null;
    webrtcDetectedDCSupport = null;

  // Detect IE (6-11)
  } else if (/*@cc_on!@*/false || !!document.documentMode) {
    hasMatch = /\brv[ :]+(\d+)/g.exec(navigator.userAgent) || [];

    webrtcDetectedBrowser   = 'IE';
    webrtcDetectedVersion   = parseInt(hasMatch[1], 10);
    webrtcMinimumVersion    = 9;
    webrtcDetectedType      = 'plugin';
    webrtcDetectedDCSupport = 'SCTP';

    if (!webrtcDetectedVersion) {
      hasMatch = /\bMSIE[ :]+(\d+)/g.exec(navigator.userAgent) || [];

      webrtcDetectedVersion = parseInt(hasMatch[1] || '0', 10);
    }

  // Detect Edge (20+)
  } else if (!!window.StyleMedia || navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) {
    hasMatch = navigator.userAgent.match(/Edge\/(\d+).(\d+)$/) || [];

    // Previous webrtc/adapter uses minimum version as 10547 but checking in the Edge release history,
    // It's close to 13.10547 and ObjectRTC API is fully supported in that version

    webrtcDetectedBrowser   = 'edge';
    webrtcDetectedVersion   = parseFloat((hasMatch[0] || '0/0').split('/')[1], 10);
    webrtcMinimumVersion    = 13.10547;
    webrtcDetectedType      = 'ms';
    webrtcDetectedDCSupport = null;

  // Detect Firefox (1.0+)
  // Placed before Safari check to ensure Firefox on Android is detected
  } else if (typeof InstallTrigger !== 'undefined' || navigator.userAgent.indexOf('irefox') > 0) {
    hasMatch = navigator.userAgent.match(/Firefox\/([0-9]+)\./) || [];

    webrtcDetectedBrowser   = 'firefox';
    webrtcDetectedVersion   = parseInt(hasMatch[1] || '0', 10);
    webrtcMinimumVersion    = 33;
    webrtcDetectedType      = 'moz';
    webrtcDetectedDCSupport = 'SCTP';

  // Detect Chrome (1+ and mobile)
  // Placed before Safari check to ensure Chrome on Android is detected
  } else if ((!!window.chrome && !!window.chrome.webstore) || navigator.userAgent.indexOf('Chrom') > 0) {
    hasMatch = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./i) || [];

    webrtcDetectedBrowser   = 'chrome';
    webrtcDetectedVersion   = parseInt(hasMatch[2] || '0', 10);
    webrtcMinimumVersion    = 38;
    webrtcDetectedType      = 'webkit';
    webrtcDetectedDCSupport = webrtcDetectedVersion > 30 ? 'SCTP' : 'RTP'; // Chrome 31+ supports SCTP without flags

  // Detect Safari
  } else if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
    hasMatch = navigator.userAgent.match(/version\/(\d+)/i) || [];

    var isMobile = navigator.userAgent.match(/(iPhone|iPad)/gi) || [];

    webrtcDetectedBrowser   = 'safari';
    webrtcDetectedVersion   = parseInt(hasMatch[1] || '0', 10);
    webrtcMinimumVersion    = 7;
    webrtcDetectedType      = isMobile.length === 0 ? 'plugin' : null;
    webrtcDetectedDCSupport = isMobile.length === 0 ? 'SCTP' : null;

  }

  window.webrtcDetectedBrowser   = webrtcDetectedBrowser;
  window.webrtcDetectedVersion   = webrtcDetectedVersion;
  window.webrtcMinimumVersion    = webrtcMinimumVersion;
  window.webrtcDetectedType      = webrtcDetectedType; // Scope it to window for better consistency
  window.webrtcDetectedDCSupport = webrtcDetectedDCSupport; // Scope it to window for better consistency
};

AdapterJS.addEvent = function(elem, evnt, func) {
  if (elem.addEventListener) { // W3C DOM
    elem.addEventListener(evnt, func, false);
  } else if (elem.attachEvent) {// OLD IE DOM
    elem.attachEvent('on'+evnt, func);
  } else { // No much to do
    elem[evnt] = func;
  }
};

AdapterJS.renderNotificationBar = function (message, buttonText, buttonCallback) {
  // only inject once the page is ready
  if (document.readyState !== 'complete') {
    return;
  }

  var w = window;
  var i = document.createElement('iframe');
  i.name = 'adapterjs-alert';
  i.style.position = 'fixed';
  i.style.top = '-41px';
  i.style.left = 0;
  i.style.right = 0;
  i.style.width = '100%';
  i.style.height = '40px';
  i.style.backgroundColor = '#ffffe1';
  i.style.border = 'none';
  i.style.borderBottom = '1px solid #888888';
  i.style.zIndex = '9999999';
  if(typeof i.style.webkitTransition === 'string') {
    i.style.webkitTransition = 'all .5s ease-out';
  } else if(typeof i.style.transition === 'string') {
    i.style.transition = 'all .5s ease-out';
  }
  document.body.appendChild(i);
  var c = (i.contentWindow) ? i.contentWindow :
    (i.contentDocument.document) ? i.contentDocument.document : i.contentDocument;
  c.document.open();
  c.document.write('<span style="display: inline-block; font-family: Helvetica, Arial,' +
    'sans-serif; font-size: .9rem; padding: 4px; vertical-align: ' +
    'middle; cursor: default;">' + message + '</span>');
  if(buttonText && typeof buttonCallback === 'function') {
    c.document.write('<button id="okay">' + buttonText + '</button><button id="cancel">Cancel</button>');
    c.document.close();

    // On click on okay
    AdapterJS.addEvent(c.document.getElementById('okay'), 'click', function (e) {
      e.preventDefault();
      try {
        e.cancelBubble = true;
      } catch(error) { }
      buttonCallback(e);
    });

    // On click on Cancel - all bars has same logic so keeping it that way for now
    AdapterJS.addEvent(c.document.getElementById('cancel'), 'click', function(e) {
      w.document.body.removeChild(i);
    });
  } else {
    c.document.close();
  }
  setTimeout(function() {
    if(typeof i.style.webkitTransform === 'string') {
      i.style.webkitTransform = 'translateY(40px)';
    } else if(typeof i.style.transform === 'string') {
      i.style.transform = 'translateY(40px)';
    } else {
      i.style.top = '0px';
    }
  }, 300);
};

// -----------------------------------------------------------
// Detected webrtc implementation. Types are:
// - 'moz': Mozilla implementation of webRTC.
// - 'webkit': WebKit implementation of webRTC.
// - 'plugin': Using the plugin implementation.
webrtcDetectedType = null;

// Set the settings for creating DataChannels, MediaStream for
// Cross-browser compability.
// - This is only for SCTP based support browsers.
// the 'urls' attribute.
checkMediaDataChannelSettings =
  function (peerBrowserAgent, peerBrowserVersion, callback, constraints) {
  if (typeof callback !== 'function') {
    return;
  }
  var beOfferer = true;
  var isLocalFirefox = webrtcDetectedBrowser === 'firefox';
  // Nightly version does not require MozDontOfferDataChannel for interop
  var isLocalFirefoxInterop = webrtcDetectedType === 'moz' && webrtcDetectedVersion > 30;
  var isPeerFirefox = peerBrowserAgent === 'firefox';
  var isPeerFirefoxInterop = peerBrowserAgent === 'firefox' &&
    ((peerBrowserVersion) ? (peerBrowserVersion > 30) : false);

  // Resends an updated version of constraints for MozDataChannel to work
  // If other userAgent is firefox and user is firefox, remove MozDataChannel
  if ((isLocalFirefox && isPeerFirefox) || (isLocalFirefoxInterop)) {
    try {
      delete constraints.mandatory.MozDontOfferDataChannel;
    } catch (error) {
      console.error('Failed deleting MozDontOfferDataChannel');
      console.error(error);
    }
  } else if ((isLocalFirefox && !isPeerFirefox)) {
    constraints.mandatory.MozDontOfferDataChannel = true;
  }
  if (!isLocalFirefox) {
    // temporary measure to remove Moz* constraints in non Firefox browsers
    for (var prop in constraints.mandatory) {
      if (constraints.mandatory.hasOwnProperty(prop)) {
        if (prop.indexOf('Moz') !== -1) {
          delete constraints.mandatory[prop];
        }
      }
    }
  }
  // Firefox (not interopable) cannot offer DataChannel as it will cause problems to the
  // interopability of the media stream
  if (isLocalFirefox && !isPeerFirefox && !isLocalFirefoxInterop) {
    beOfferer = false;
  }
  callback(beOfferer, constraints);
};

// Handles the differences for all browsers ice connection state output.
// - Tested outcomes are:
//   - Chrome (offerer)  : 'checking' > 'completed' > 'completed'
//   - Chrome (answerer) : 'checking' > 'connected'
//   - Firefox (offerer) : 'checking' > 'connected'
//   - Firefox (answerer): 'checking' > 'connected'
checkIceConnectionState = function (peerId, iceConnectionState, callback) {
  if (typeof callback !== 'function') {
    console.warn('No callback specified in checkIceConnectionState. Aborted.');
    return;
  }
  peerId = (peerId) ? peerId : 'peer';

  if (!AdapterJS._iceConnectionFiredStates[peerId] ||
    iceConnectionState === AdapterJS._iceConnectionStates.disconnected ||
    iceConnectionState === AdapterJS._iceConnectionStates.failed ||
    iceConnectionState === AdapterJS._iceConnectionStates.closed) {
    AdapterJS._iceConnectionFiredStates[peerId] = [];
  }
  iceConnectionState = AdapterJS._iceConnectionStates[iceConnectionState];
  if (AdapterJS._iceConnectionFiredStates[peerId].indexOf(iceConnectionState) < 0) {
    AdapterJS._iceConnectionFiredStates[peerId].push(iceConnectionState);
    if (iceConnectionState === AdapterJS._iceConnectionStates.connected) {
      setTimeout(function () {
        AdapterJS._iceConnectionFiredStates[peerId]
          .push(AdapterJS._iceConnectionStates.done);
        callback(AdapterJS._iceConnectionStates.done);
      }, 1000);
    }
    callback(iceConnectionState);
  }
  return;
};

// Firefox:
// - Creates iceServer from the url for Firefox.
// - Create iceServer with stun url.
// - Create iceServer with turn url.
//   - Ignore the transport parameter from TURN url for FF version <=27.
//   - Return null for createIceServer if transport=tcp.
// - FF 27 and above supports transport parameters in TURN url,
// - So passing in the full url to create iceServer.
// Chrome:
// - Creates iceServer from the url for Chrome M33 and earlier.
//   - Create iceServer with stun url.
//   - Chrome M28 & above uses below TURN format.
// Plugin:
// - Creates Ice Server for Plugin Browsers
//   - If Stun - Create iceServer with stun url.
//   - Else - Create iceServer with turn url
//   - This is a WebRTC Function
createIceServer = null;

// Firefox:
// - Creates IceServers for Firefox
//   - Use .url for FireFox.
//   - Multiple Urls support
// Chrome:
// - Creates iceServers from the urls for Chrome M34 and above.
//   - .urls is supported since Chrome M34.
//   - Multiple Urls support
// Plugin:
// - Creates Ice Servers for Plugin Browsers
//   - Multiple Urls support
//   - This is a WebRTC Function
createIceServers = null;
//------------------------------------------------------------

//Creates MediaStream object.
MediaStream = (typeof MediaStream === 'function') ? MediaStream : null;

//The RTCPeerConnection object.
RTCPeerConnection = (typeof RTCPeerConnection === 'function') ?
  RTCPeerConnection : null;

// Creates RTCSessionDescription object for Plugin Browsers
RTCSessionDescription = (typeof RTCSessionDescription === 'function') ?
  RTCSessionDescription : null;

// Creates RTCIceCandidate object for Plugin Browsers
RTCIceCandidate = (typeof RTCIceCandidate === 'function') ?
  RTCIceCandidate : null;

// Get UserMedia (only difference is the prefix).
// Code from Adam Barth.
getUserMedia = null;

// Attach a media stream to an element.
attachMediaStream = null;

// Re-attach a media stream to an element.
reattachMediaStream = null;


// Detected browser agent name. Types are:
// - 'firefox': Firefox browser.
// - 'chrome': Chrome browser.
// - 'opera': Opera browser.
// - 'safari': Safari browser.
// - 'IE' - Internet Explorer browser.
webrtcDetectedBrowser = null;

// Detected browser version.
webrtcDetectedVersion = null;

// The minimum browser version still supported by AJS.
webrtcMinimumVersion  = null;

// Check for browser types and react accordingly
if ( (navigator.mozGetUserMedia ||
      navigator.webkitGetUserMedia ||
      (navigator.mediaDevices &&
       navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)))
    && !((navigator.userAgent.match(/android/ig) || []).length === 0 &&
        (navigator.userAgent.match(/chrome/ig) || []).length === 0 && navigator.userAgent.indexOf('Safari/') > 0)) {

  ///////////////////////////////////////////////////////////////////
  // INJECTION OF GOOGLE'S ADAPTER.JS CONTENT

  // Store the original native RTCPC in msRTCPeerConnection object
  if (navigator.userAgent.match(/Edge\/(\d+).(\d+)$/) && window.RTCPeerConnection) {
    window.msRTCPeerConnection = window.RTCPeerConnection;
  }

/* jshint ignore:start */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.adapter = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(requirecopy,module,exports){
 /* eslint-env node */
'use strict';

// SDP helpers.
var SDPUtils = {};

// Generate an alphanumeric identifier for cname or mids.
// TODO: use UUIDs instead? https://gist.github.com/jed/982883
SDPUtils.generateIdentifier = function() {
  return Math.random().toString(36).substr(2, 10);
};

// The RTCP CNAME used by all peerconnections from the same JS.
SDPUtils.localCName = SDPUtils.generateIdentifier();

// Splits SDP into lines, dealing with both CRLF and LF.
SDPUtils.splitLines = function(blob) {
  return blob.trim().split('\n').map(function(line) {
    return line.trim();
  });
};
// Splits SDP into sessionpart and mediasections. Ensures CRLF.
SDPUtils.splitSections = function(blob) {
  var parts = blob.split('\nm=');
  return parts.map(function(part, index) {
    return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
  });
};

// Returns lines that start with a certain prefix.
SDPUtils.matchPrefix = function(blob, prefix) {
  return SDPUtils.splitLines(blob).filter(function(line) {
    return line.indexOf(prefix) === 0;
  });
};

// Parses an ICE candidate line. Sample input:
// candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
// rport 55996"
SDPUtils.parseCandidate = function(line) {
  var parts;
  // Parse both variants.
  if (line.indexOf('a=candidate:') === 0) {
    parts = line.substring(12).split(' ');
  } else {
    parts = line.substring(10).split(' ');
  }

  var candidate = {
    foundation: parts[0],
    component: parts[1],
    protocol: parts[2].toLowerCase(),
    priority: parseInt(parts[3], 10),
    ip: parts[4],
    port: parseInt(parts[5], 10),
    // skip parts[6] == 'typ'
    type: parts[7]
  };

  for (var i = 8; i < parts.length; i += 2) {
    switch (parts[i]) {
      case 'raddr':
        candidate.relatedAddress = parts[i + 1];
        break;
      case 'rport':
        candidate.relatedPort = parseInt(parts[i + 1], 10);
        break;
      case 'tcptype':
        candidate.tcpType = parts[i + 1];
        break;
      default: // Unknown extensions are silently ignored.
        break;
    }
  }
  return candidate;
};

// Translates a candidate object into SDP candidate attribute.
SDPUtils.writeCandidate = function(candidate) {
  var sdp = [];
  sdp.push(candidate.foundation);
  sdp.push(candidate.component);
  sdp.push(candidate.protocol.toUpperCase());
  sdp.push(candidate.priority);
  sdp.push(candidate.ip);
  sdp.push(candidate.port);

  var type = candidate.type;
  sdp.push('typ');
  sdp.push(type);
  if (type !== 'host' && candidate.relatedAddress &&
      candidate.relatedPort) {
    sdp.push('raddr');
    sdp.push(candidate.relatedAddress); // was: relAddr
    sdp.push('rport');
    sdp.push(candidate.relatedPort); // was: relPort
  }
  if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
    sdp.push('tcptype');
    sdp.push(candidate.tcpType);
  }
  return 'candidate:' + sdp.join(' ');
};

// Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
// a=rtpmap:111 opus/48000/2
SDPUtils.parseRtpMap = function(line) {
  var parts = line.substr(9).split(' ');
  var parsed = {
    payloadType: parseInt(parts.shift(), 10) // was: id
  };

  parts = parts[0].split('/');

  parsed.name = parts[0];
  parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
  // was: channels
  parsed.numChannels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
  return parsed;
};

// Generate an a=rtpmap line from RTCRtpCodecCapability or
// RTCRtpCodecParameters.
SDPUtils.writeRtpMap = function(codec) {
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate +
      (codec.numChannels !== 1 ? '/' + codec.numChannels : '') + '\r\n';
};

// Parses an a=extmap line (headerextension from RFC 5285). Sample input:
// a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
SDPUtils.parseExtmap = function(line) {
  var parts = line.substr(9).split(' ');
  return {
    id: parseInt(parts[0], 10),
    uri: parts[1]
  };
};

// Generates a=extmap line from RTCRtpHeaderExtensionParameters or
// RTCRtpHeaderExtension.
SDPUtils.writeExtmap = function(headerExtension) {
  return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) +
       ' ' + headerExtension.uri + '\r\n';
};

// Parses an ftmp line, returns dictionary. Sample input:
// a=fmtp:96 vbr=on;cng=on
// Also deals with vbr=on; cng=on
SDPUtils.parseFmtp = function(line) {
  var parsed = {};
  var kv;
  var parts = line.substr(line.indexOf(' ') + 1).split(';');
  for (var j = 0; j < parts.length; j++) {
    kv = parts[j].trim().split('=');
    parsed[kv[0].trim()] = kv[1];
  }
  return parsed;
};

// Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeFmtp = function(codec) {
  var line = '';
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.parameters && Object.keys(codec.parameters).length) {
    var params = [];
    Object.keys(codec.parameters).forEach(function(param) {
      params.push(param + '=' + codec.parameters[param]);
    });
    line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
  }
  return line;
};

// Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
// a=rtcp-fb:98 nack rpsi
SDPUtils.parseRtcpFb = function(line) {
  var parts = line.substr(line.indexOf(' ') + 1).split(' ');
  return {
    type: parts.shift(),
    parameter: parts.join(' ')
  };
};
// Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeRtcpFb = function(codec) {
  var lines = '';
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
    // FIXME: special handling for trr-int?
    codec.rtcpFeedback.forEach(function(fb) {
      lines += 'a=rtcp-fb:' + pt + ' ' + fb.type +
      (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') +
          '\r\n';
    });
  }
  return lines;
};

// Parses an RFC 5576 ssrc media attribute. Sample input:
// a=ssrc:3735928559 cname:something
SDPUtils.parseSsrcMedia = function(line) {
  var sp = line.indexOf(' ');
  var parts = {
    ssrc: parseInt(line.substr(7, sp - 7), 10)
  };
  var colon = line.indexOf(':', sp);
  if (colon > -1) {
    parts.attribute = line.substr(sp + 1, colon - sp - 1);
    parts.value = line.substr(colon + 1);
  } else {
    parts.attribute = line.substr(sp + 1);
  }
  return parts;
};

// Extracts the MID (RFC 5888) from a media section.
// returns the MID or undefined if no mid line was found.
SDPUtils.getMid = function(mediaSection) {
  var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
  if (mid) {
    return mid.substr(6);
  }
}

// Extracts DTLS parameters from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the fingerprint line as input. See also getIceParameters.
SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.splitLines(mediaSection);
  // Search in session part, too.
  lines = lines.concat(SDPUtils.splitLines(sessionpart));
  var fpLine = lines.filter(function(line) {
    return line.indexOf('a=fingerprint:') === 0;
  })[0].substr(14);
  // Note: a=setup line is ignored since we use the 'auto' role.
  // Note2: 'algorithm' is not case sensitive except in Edge.
  var dtlsParameters = {
    role: 'auto',
    fingerprints: [{
      algorithm: fpLine.split(' ')[0].toLowerCase(),
      value: fpLine.split(' ')[1]
    }]
  };
  return dtlsParameters;
};

// Serializes DTLS parameters to SDP.
SDPUtils.writeDtlsParameters = function(params, setupType) {
  var sdp = 'a=setup:' + setupType + '\r\n';
  params.fingerprints.forEach(function(fp) {
    sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
  });
  return sdp;
};
// Parses ICE information from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the ice-ufrag and ice-pwd lines as input.
SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.splitLines(mediaSection);
  // Search in session part, too.
  lines = lines.concat(SDPUtils.splitLines(sessionpart));
  var iceParameters = {
    usernameFragment: lines.filter(function(line) {
      return line.indexOf('a=ice-ufrag:') === 0;
    })[0].substr(12),
    password: lines.filter(function(line) {
      return line.indexOf('a=ice-pwd:') === 0;
    })[0].substr(10)
  };
  return iceParameters;
};

// Serializes ICE parameters to SDP.
SDPUtils.writeIceParameters = function(params) {
  return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' +
      'a=ice-pwd:' + params.password + '\r\n';
};

// Parses the SDP media section and returns RTCRtpParameters.
SDPUtils.parseRtpParameters = function(mediaSection) {
  var description = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: [],
    rtcp: []
  };
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  for (var i = 3; i < mline.length; i++) { // find all codecs from mline[3..]
    var pt = mline[i];
    var rtpmapline = SDPUtils.matchPrefix(
        mediaSection, 'a=rtpmap:' + pt + ' ')[0];
    if (rtpmapline) {
      var codec = SDPUtils.parseRtpMap(rtpmapline);
      var fmtps = SDPUtils.matchPrefix(
          mediaSection, 'a=fmtp:' + pt + ' ');
      // Only the first a=fmtp:<pt> is considered.
      codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
      codec.rtcpFeedback = SDPUtils.matchPrefix(
          mediaSection, 'a=rtcp-fb:' + pt + ' ')
        .map(SDPUtils.parseRtcpFb);
      description.codecs.push(codec);
      // parse FEC mechanisms from rtpmap lines.
      switch (codec.name.toUpperCase()) {
        case 'RED':
        case 'ULPFEC':
          description.fecMechanisms.push(codec.name.toUpperCase());
          break;
        default: // only RED and ULPFEC are recognized as FEC mechanisms.
          break;
      }
    }
  }
  SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function(line) {
    description.headerExtensions.push(SDPUtils.parseExtmap(line));
  });
  // FIXME: parse rtcp.
  return description;
};

// Generates parts of the SDP media section describing the capabilities /
// parameters.
SDPUtils.writeRtpDescription = function(kind, caps) {
  var sdp = '';

  // Build the mline.
  sdp += 'm=' + kind + ' ';
  sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
  sdp += ' UDP/TLS/RTP/SAVPF ';
  sdp += caps.codecs.map(function(codec) {
    if (codec.preferredPayloadType !== undefined) {
      return codec.preferredPayloadType;
    }
    return codec.payloadType;
  }).join(' ') + '\r\n';

  sdp += 'c=IN IP4 0.0.0.0\r\n';
  sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

  // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
  caps.codecs.forEach(function(codec) {
    sdp += SDPUtils.writeRtpMap(codec);
    sdp += SDPUtils.writeFmtp(codec);
    sdp += SDPUtils.writeRtcpFb(codec);
  });
  var maxptime = 0;
  caps.codecs.forEach(function(codec) {
    if (codec.maxptime > maxptime) {
      maxptime = codec.maxptime;
    }
  });
  if (maxptime > 0) {
    sdp += 'a=maxptime:' + maxptime + '\r\n';
  }
  sdp += 'a=rtcp-mux\r\n';

  caps.headerExtensions.forEach(function(extension) {
    sdp += SDPUtils.writeExtmap(extension);
  });
  // FIXME: write fecMechanisms.
  return sdp;
};

// Parses the SDP media section and returns an array of
// RTCRtpEncodingParameters.
SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
  var encodingParameters = [];
  var description = SDPUtils.parseRtpParameters(mediaSection);
  var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
  var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;

  // filter a=ssrc:... cname:, ignore PlanB-msid
  var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
  .map(function(line) {
    return SDPUtils.parseSsrcMedia(line);
  })
  .filter(function(parts) {
    return parts.attribute === 'cname';
  });
  var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
  var secondarySsrc;

  var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID')
  .map(function(line) {
    var parts = line.split(' ');
    parts.shift();
    return parts.map(function(part) {
      return parseInt(part, 10);
    });
  });
  if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
    secondarySsrc = flows[0][1];
  }

  description.codecs.forEach(function(codec) {
    if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
      var encParam = {
        ssrc: primarySsrc,
        codecPayloadType: parseInt(codec.parameters.apt, 10),
        rtx: {
          ssrc: secondarySsrc
        }
      };
      encodingParameters.push(encParam);
      if (hasRed) {
        encParam = JSON.parse(JSON.stringify(encParam));
        encParam.fec = {
          ssrc: secondarySsrc,
          mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
        };
        encodingParameters.push(encParam);
      }
    }
  });
  if (encodingParameters.length === 0 && primarySsrc) {
    encodingParameters.push({
      ssrc: primarySsrc
    });
  }

  // we support both b=AS and b=TIAS but interpret AS as TIAS.
  var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
  if (bandwidth.length) {
    if (bandwidth[0].indexOf('b=TIAS:') === 0) {
      bandwidth = parseInt(bandwidth[0].substr(7), 10);
    } else if (bandwidth[0].indexOf('b=AS:') === 0) {
      bandwidth = parseInt(bandwidth[0].substr(5), 10);
    }
    encodingParameters.forEach(function(params) {
      params.maxBitrate = bandwidth;
    });
  }
  return encodingParameters;
};

// parses http://draft.ortc.org/#rtcrtcpparameters*
SDPUtils.parseRtcpParameters = function(mediaSection) {
  var rtcpParameters = {};

  var cname;
  // Gets the first SSRC. Note that with RTX there might be multiple
  // SSRCs.
  var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
      .map(function(line) {
        return SDPUtils.parseSsrcMedia(line);
      })
      .filter(function(obj) {
        return obj.attribute === 'cname';
      })[0];
  if (remoteSsrc) {
    rtcpParameters.cname = remoteSsrc.value;
    rtcpParameters.ssrc = remoteSsrc.ssrc;
  }

  // Edge uses the compound attribute instead of reducedSize
  // compound is !reducedSize
  var rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
  rtcpParameters.reducedSize = rsize.length > 0;
  rtcpParameters.compound = rsize.length === 0;

  // parses the rtcp-mux attrіbute.
  // Note that Edge does not support unmuxed RTCP.
  var mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
  rtcpParameters.mux = mux.length > 0;

  return rtcpParameters;
};

// parses either a=msid: or a=ssrc:... msid lines an returns
// the id of the MediaStream and MediaStreamTrack.
SDPUtils.parseMsid = function(mediaSection) {
  var parts;
  var spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
  if (spec.length === 1) {
    parts = spec[0].substr(7).split(' ');
    return {stream: parts[0], track: parts[1]};
  }
  var planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
  .map(function(line) {
    return SDPUtils.parseSsrcMedia(line);
  })
  .filter(function(parts) {
    return parts.attribute === 'msid';
  });
  if (planB.length > 0) {
    parts = planB[0].value.split(' ');
    return {stream: parts[0], track: parts[1]};
  }
};

SDPUtils.writeSessionBoilerplate = function() {
  // FIXME: sess-id should be an NTP timestamp.
  return 'v=0\r\n' +
      'o=thisisadapterortc 8169639915646943137 2 IN IP4 127.0.0.1\r\n' +
      's=-\r\n' +
      't=0 0\r\n';
};

SDPUtils.writeMediaSection = function(transceiver, caps, type, stream) {
  var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

  // Map ICE parameters (ufrag, pwd) to SDP.
  sdp += SDPUtils.writeIceParameters(
      transceiver.iceGatherer.getLocalParameters());

  // Map DTLS parameters to SDP.
  sdp += SDPUtils.writeDtlsParameters(
      transceiver.dtlsTransport.getLocalParameters(),
      type === 'offer' ? 'actpass' : 'active');

  sdp += 'a=mid:' + transceiver.mid + '\r\n';

  if (transceiver.rtpSender && transceiver.rtpReceiver) {
    sdp += 'a=sendrecv\r\n';
  } else if (transceiver.rtpSender) {
    sdp += 'a=sendonly\r\n';
  } else if (transceiver.rtpReceiver) {
    sdp += 'a=recvonly\r\n';
  } else {
    sdp += 'a=inactive\r\n';
  }

  if (transceiver.rtpSender) {
    // spec.
    var msid = 'msid:' + stream.id + ' ' +
        transceiver.rtpSender.track.id + '\r\n';
    sdp += 'a=' + msid;

    // for Chrome.
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
        ' ' + msid;
    if (transceiver.sendEncodingParameters[0].rtx) {
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
          ' ' + msid;
      sdp += 'a=ssrc-group:FID ' +
          transceiver.sendEncodingParameters[0].ssrc + ' ' +
          transceiver.sendEncodingParameters[0].rtx.ssrc +
          '\r\n';
    }
  }
  // FIXME: this should be written by writeRtpDescription.
  sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
      ' cname:' + SDPUtils.localCName + '\r\n';
  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
        ' cname:' + SDPUtils.localCName + '\r\n';
  }
  return sdp;
};

// Gets the direction from the mediaSection or the sessionpart.
SDPUtils.getDirection = function(mediaSection, sessionpart) {
  // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
  var lines = SDPUtils.splitLines(mediaSection);
  for (var i = 0; i < lines.length; i++) {
    switch (lines[i]) {
      case 'a=sendrecv':
      case 'a=sendonly':
      case 'a=recvonly':
      case 'a=inactive':
        return lines[i].substr(2);
      default:
        // FIXME: What should happen here?
    }
  }
  if (sessionpart) {
    return SDPUtils.getDirection(sessionpart);
  }
  return 'sendrecv';
};

SDPUtils.getKind = function(mediaSection) {
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  return mline[0].substr(2);
};

SDPUtils.isRejected = function(mediaSection) {
  return mediaSection.split(' ', 2)[1] === '0';
};

// Expose public methods.
module.exports = SDPUtils;

},{}],2:[function(requirecopy,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */

'use strict';

// Shimming starts here.
(function() {
  // Utils.
  var logging = requirecopy('./utils').log;
  var browserDetails = requirecopy('./utils').browserDetails;
  // Export to the adapter global object visible in the browser.
  module.exports.browserDetails = browserDetails;
  module.exports.extractVersion = requirecopy('./utils').extractVersion;
  module.exports.disableLog = requirecopy('./utils').disableLog;

  // Uncomment the line below if you want logging to occur, including logging
  // for the switch statement below. Can also be turned on in the browser via
  // adapter.disableLog(false), but then logging from the switch statement below
  // will not appear.
  // requirecopy('./utils').disableLog(false);

  // Browser shims.
  var chromeShim = requirecopy('./chrome/chrome_shim') || null;
  var edgeShim = requirecopy('./edge/edge_shim') || null;
  var firefoxShim = requirecopy('./firefox/firefox_shim') || null;
  var safariShim = requirecopy('./safari/safari_shim') || null;

  // Shim browser if found.
  switch (browserDetails.browser) {
    case 'opera': // fallthrough as it uses chrome shims
    case 'chrome':
      if (!chromeShim || !chromeShim.shimPeerConnection) {
        logging('Chrome shim is not included in this adapter release.');
        return;
      }
      logging('adapter.js shimming chrome.');
      // Export to the adapter global object visible in the browser.
      module.exports.browserShim = chromeShim;

      chromeShim.shimGetUserMedia();
      chromeShim.shimMediaStream();
      chromeShim.shimSourceObject();
      chromeShim.shimPeerConnection();
      chromeShim.shimOnTrack();
      break;
    case 'firefox':
      if (!firefoxShim || !firefoxShim.shimPeerConnection) {
        logging('Firefox shim is not included in this adapter release.');
        return;
      }
      logging('adapter.js shimming firefox.');
      // Export to the adapter global object visible in the browser.
      module.exports.browserShim = firefoxShim;

      firefoxShim.shimGetUserMedia();
      firefoxShim.shimSourceObject();
      firefoxShim.shimPeerConnection();
      firefoxShim.shimOnTrack();
      break;
    case 'edge':
      if (!edgeShim || !edgeShim.shimPeerConnection) {
        logging('MS edge shim is not included in this adapter release.');
        return;
      }
      logging('adapter.js shimming edge.');
      // Export to the adapter global object visible in the browser.
      module.exports.browserShim = edgeShim;

      edgeShim.shimGetUserMedia();
      edgeShim.shimPeerConnection();
      break;
    case 'safari':
      if (!safariShim) {
        logging('Safari shim is not included in this adapter release.');
        return;
      }
      logging('adapter.js shimming safari.');
      // Export to the adapter global object visible in the browser.
      module.exports.browserShim = safariShim;

      safariShim.shimGetUserMedia();
      break;
    default:
      logging('Unsupported browser!');
  }
})();

},{"./chrome/chrome_shim":3,"./edge/edge_shim":5,"./firefox/firefox_shim":7,"./safari/safari_shim":9,"./utils":10}],3:[function(requirecopy,module,exports){

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */
'use strict';
var logging = requirecopy('../utils.js').log;
var browserDetails = requirecopy('../utils.js').browserDetails;

var chromeShim = {
  shimMediaStream: function() {
    window.MediaStream = window.MediaStream || window.webkitMediaStream;
  },

  shimOnTrack: function() {
    if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
        window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
        get: function() {
          return this._ontrack;
        },
        set: function(f) {
          var self = this;
          if (this._ontrack) {
            this.removeEventListener('track', this._ontrack);
            this.removeEventListener('addstream', this._ontrackpoly);
          }
          this.addEventListener('track', this._ontrack = f);
          this.addEventListener('addstream', this._ontrackpoly = function(e) {
            // onaddstream does not fire when a track is added to an existing
            // stream. But stream.onaddtrack is implemented so we use that.
            e.stream.addEventListener('addtrack', function(te) {
              var event = new Event('track');
              event.track = te.track;
              event.receiver = {track: te.track};
              event.streams = [e.stream];
              self.dispatchEvent(event);
            });
            e.stream.getTracks().forEach(function(track) {
              var event = new Event('track');
              event.track = track;
              event.receiver = {track: track};
              event.streams = [e.stream];
              this.dispatchEvent(event);
            }.bind(this));
          }.bind(this));
        }
      });
    }
  },

  shimSourceObject: function() {
    if (typeof window === 'object') {
      if (window.HTMLMediaElement &&
        !('srcObject' in window.HTMLMediaElement.prototype)) {
        // Shim the srcObject property, once, when HTMLMediaElement is found.
        Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
          get: function() {
            return this._srcObject;
          },
          set: function(stream) {
            var self = this;
            // Use _srcObject as a private property for this shim
            this._srcObject = stream;
            if (this.src) {
              URL.revokeObjectURL(this.src);
            }

            if (!stream) {
              this.src = '';
              return;
            }
            this.src = URL.createObjectURL(stream);
            // We need to recreate the blob url when a track is added or
            // removed. Doing it manually since we want to avoid a recursion.
            stream.addEventListener('addtrack', function() {
              if (self.src) {
                URL.revokeObjectURL(self.src);
              }
              self.src = URL.createObjectURL(stream);
            });
            stream.addEventListener('removetrack', function() {
              if (self.src) {
                URL.revokeObjectURL(self.src);
              }
              self.src = URL.createObjectURL(stream);
            });
          }
        });
      }
    }
  },

  shimPeerConnection: function() {
    // The RTCPeerConnection object.
    window.RTCPeerConnection = function(pcConfig, pcConstraints) {
      // Translate iceTransportPolicy to iceTransports,
      // see https://code.google.com/p/webrtc/issues/detail?id=4869
      logging('PeerConnection');
      if (pcConfig && pcConfig.iceTransportPolicy) {
        pcConfig.iceTransports = pcConfig.iceTransportPolicy;
      }

      var pc = new webkitRTCPeerConnection(pcConfig, pcConstraints);
      var origGetStats = pc.getStats.bind(pc);
      pc.getStats = function(selector, successCallback, errorCallback) {
        var self = this;
        var args = arguments;

        // If selector is a function then we are in the old style stats so just
        // pass back the original getStats format to avoid breaking old users.
        if (arguments.length > 0 && typeof selector === 'function') {
          return origGetStats(selector, successCallback);
        }

        var fixChromeStats_ = function(response) {
          var standardReport = {};
          var reports = response.result();
          reports.forEach(function(report) {
            var standardStats = {
              id: report.id,
              timestamp: report.timestamp,
              type: report.type
            };
            report.names().forEach(function(name) {
              standardStats[name] = report.stat(name);
            });
            standardReport[standardStats.id] = standardStats;
          });

          return standardReport;
        };

        // shim getStats with maplike support
        var makeMapStats = function(stats, legacyStats) {
          var map = new Map(Object.keys(stats).map(function(key) {
            return[key, stats[key]];
          }));
          legacyStats = legacyStats || stats;
          Object.keys(legacyStats).forEach(function(key) {
            map[key] = legacyStats[key];
          });
          return map;
        };

        if (arguments.length >= 2) {
          var successCallbackWrapper_ = function(response) {
            args[1](makeMapStats(fixChromeStats_(response)));
          };

          return origGetStats.apply(this, [successCallbackWrapper_,
              arguments[0]]);
        }

        // promise-support
        return new Promise(function(resolve, reject) {
          if (args.length === 1 && typeof selector === 'object') {
            origGetStats.apply(self, [
              function(response) {
                resolve(makeMapStats(fixChromeStats_(response)));
              }, reject]);
          } else {
            // Preserve legacy chrome stats only on legacy access of stats obj
            origGetStats.apply(self, [
              function(response) {
                resolve(makeMapStats(fixChromeStats_(response),
                    response.result()));
              }, reject]);
          }
        }).then(successCallback, errorCallback);
      };

      return pc;
    };
    window.RTCPeerConnection.prototype = webkitRTCPeerConnection.prototype;

    // wrap static methods. Currently just generateCertificate.
    if (webkitRTCPeerConnection.generateCertificate) {
      Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
        get: function() {
          return webkitRTCPeerConnection.generateCertificate;
        }
      });
    }

    ['createOffer', 'createAnswer'].forEach(function(method) {
      var nativeMethod = webkitRTCPeerConnection.prototype[method];
      webkitRTCPeerConnection.prototype[method] = function() {
        var self = this;
        if (arguments.length < 1 || (arguments.length === 1 &&
            typeof arguments[0] === 'object')) {
          var opts = arguments.length === 1 ? arguments[0] : undefined;
          return new Promise(function(resolve, reject) {
            nativeMethod.apply(self, [resolve, reject, opts]);
          });
        }
        return nativeMethod.apply(this, arguments);
      };
    });

    // add promise support -- natively available in Chrome 51
    if (browserDetails.version < 51) {
      ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
          .forEach(function(method) {
            var nativeMethod = webkitRTCPeerConnection.prototype[method];
            webkitRTCPeerConnection.prototype[method] = function() {
              var args = arguments;
              var self = this;
              var promise = new Promise(function(resolve, reject) {
                nativeMethod.apply(self, [args[0], resolve, reject]);
              });
              if (args.length < 2) {
                return promise;
              }
              return promise.then(function() {
                args[1].apply(null, []);
              },
              function(err) {
                if (args.length >= 3) {
                  args[2].apply(null, [err]);
                }
              });
            };
          });
    }

    // shim implicit creation of RTCSessionDescription/RTCIceCandidate
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
        .forEach(function(method) {
          var nativeMethod = webkitRTCPeerConnection.prototype[method];
          webkitRTCPeerConnection.prototype[method] = function() {
            arguments[0] = new ((method === 'addIceCandidate') ?
                RTCIceCandidate : RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          };
        });

    // support for addIceCandidate(null)
    var nativeAddIceCandidate =
        RTCPeerConnection.prototype.addIceCandidate;
    RTCPeerConnection.prototype.addIceCandidate = function() {
      return arguments[0] === null ? Promise.resolve()
          : nativeAddIceCandidate.apply(this, arguments);
    };
  }
};


// Expose public methods.
module.exports = {
  shimMediaStream: chromeShim.shimMediaStream,
  shimOnTrack: chromeShim.shimOnTrack,
  shimSourceObject: chromeShim.shimSourceObject,
  shimPeerConnection: chromeShim.shimPeerConnection,
  shimGetUserMedia: requirecopy('./getusermedia')
};

},{"../utils.js":10,"./getusermedia":4}],4:[function(requirecopy,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */
'use strict';
var logging = requirecopy('../utils.js').log;

// Expose public methods.
module.exports = function() {
  var constraintsToChrome_ = function(c) {
    if (typeof c !== 'object' || c.mandatory || c.optional) {
      return c;
    }
    var cc = {};
    Object.keys(c).forEach(function(key) {
      if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
        return;
      }
      var r = (typeof c[key] === 'object') ? c[key] : {ideal: c[key]};
      if (r.exact !== undefined && typeof r.exact === 'number') {
        r.min = r.max = r.exact;
      }
      var oldname_ = function(prefix, name) {
        if (prefix) {
          return prefix + name.charAt(0).toUpperCase() + name.slice(1);
        }
        return (name === 'deviceId') ? 'sourceId' : name;
      };
      if (r.ideal !== undefined) {
        cc.optional = cc.optional || [];
        var oc = {};
        if (typeof r.ideal === 'number') {
          oc[oldname_('min', key)] = r.ideal;
          cc.optional.push(oc);
          oc = {};
          oc[oldname_('max', key)] = r.ideal;
          cc.optional.push(oc);
        } else {
          oc[oldname_('', key)] = r.ideal;
          cc.optional.push(oc);
        }
      }
      if (r.exact !== undefined && typeof r.exact !== 'number') {
        cc.mandatory = cc.mandatory || {};
        cc.mandatory[oldname_('', key)] = r.exact;
      } else {
        ['min', 'max'].forEach(function(mix) {
          if (r[mix] !== undefined) {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname_(mix, key)] = r[mix];
          }
        });
      }
    });
    if (c.advanced) {
      cc.optional = (cc.optional || []).concat(c.advanced);
    }
    return cc;
  };

  var shimConstraints_ = function(constraints, func) {
    constraints = JSON.parse(JSON.stringify(constraints));
    if (constraints && constraints.audio) {
      constraints.audio = constraintsToChrome_(constraints.audio);
    }
    if (constraints && typeof constraints.video === 'object') {
      // Shim facingMode for mobile, where it defaults to "user".
      var face = constraints.video.facingMode;
      face = face && ((typeof face === 'object') ? face : {ideal: face});

      if ((face && (face.exact === 'user' || face.exact === 'environment' ||
                    face.ideal === 'user' || face.ideal === 'environment')) &&
          !(navigator.mediaDevices.getSupportedConstraints &&
            navigator.mediaDevices.getSupportedConstraints().facingMode)) {
        delete constraints.video.facingMode;
        if (face.exact === 'environment' || face.ideal === 'environment') {
          // Look for "back" in label, or use last cam (typically back cam).
          return navigator.mediaDevices.enumerateDevices()
          .then(function(devices) {
            devices = devices.filter(function(d) {
              return d.kind === 'videoinput';
            });
            var back = devices.find(function(d) {
              return d.label.toLowerCase().indexOf('back') !== -1;
            }) || (devices.length && devices[devices.length - 1]);
            if (back) {
              constraints.video.deviceId = face.exact ? {exact: back.deviceId} :
                                                        {ideal: back.deviceId};
            }
            constraints.video = constraintsToChrome_(constraints.video);
            logging('chrome: ' + JSON.stringify(constraints));
            return func(constraints);
          });
        }
      }
      constraints.video = constraintsToChrome_(constraints.video);
    }
    logging('chrome: ' + JSON.stringify(constraints));
    return func(constraints);
  };

  var shimError_ = function(e) {
    return {
      name: {
        PermissionDeniedError: 'NotAllowedError',
        ConstraintNotSatisfiedError: 'OverconstrainedError'
      }[e.name] || e.name,
      message: e.message,
      constraint: e.constraintName,
      toString: function() {
        return this.name + (this.message && ': ') + this.message;
      }
    };
  };

  var getUserMedia_ = function(constraints, onSuccess, onError) {
    shimConstraints_(constraints, function(c) {
      navigator.webkitGetUserMedia(c, onSuccess, function(e) {
        onError(shimError_(e));
      });
    });
  };

  navigator.getUserMedia = getUserMedia_;

  // Returns the result of getUserMedia as a Promise.
  var getUserMediaPromise_ = function(constraints) {
    return new Promise(function(resolve, reject) {
      navigator.getUserMedia(constraints, resolve, reject);
    });
  };

  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {
      getUserMedia: getUserMediaPromise_,
      enumerateDevices: function() {
        return new Promise(function(resolve) {
          var kinds = {audio: 'audioinput', video: 'videoinput'};
          return MediaStreamTrack.getSources(function(devices) {
            resolve(devices.map(function(device) {
              return {label: device.label,
                      kind: kinds[device.kind],
                      deviceId: device.id,
                      groupId: ''};
            }));
          });
        });
      }
    };
  }

  // A shim for getUserMedia method on the mediaDevices object.
  // TODO(KaptenJansson) remove once implemented in Chrome stable.
  if (!navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      return getUserMediaPromise_(constraints);
    };
  } else {
    // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
    // function which returns a Promise, it does not accept spec-style
    // constraints.
    var origGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(cs) {
      return shimConstraints_(cs, function(c) {
        return origGetUserMedia(c).catch(function(e) {
          return Promise.reject(shimError_(e));
        });
      });
    };
  }

  // Dummy devicechange event methods.
  // TODO(KaptenJansson) remove once implemented in Chrome stable.
  if (typeof navigator.mediaDevices.addEventListener === 'undefined') {
    navigator.mediaDevices.addEventListener = function() {
      logging('Dummy mediaDevices.addEventListener called.');
    };
  }
  if (typeof navigator.mediaDevices.removeEventListener === 'undefined') {
    navigator.mediaDevices.removeEventListener = function() {
      logging('Dummy mediaDevices.removeEventListener called.');
    };
  }
};

},{"../utils.js":10}],5:[function(requirecopy,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */
'use strict';

var SDPUtils = requirecopy('sdp');
var browserDetails = requirecopy('../utils').browserDetails;

var edgeShim = {
  shimPeerConnection: function() {
    if (window.RTCIceGatherer) {
      // ORTC defines an RTCIceCandidate object but no constructor.
      // Not implemented in Edge.
      if (!window.RTCIceCandidate) {
        window.RTCIceCandidate = function(args) {
          return args;
        };
      }
      // ORTC does not have a session description object but
      // other browsers (i.e. Chrome) that will support both PC and ORTC
      // in the future might have this defined already.
      if (!window.RTCSessionDescription) {
        window.RTCSessionDescription = function(args) {
          return args;
        };
      }
    }

    window.RTCPeerConnection = function(config) {
      var self = this;

      var _eventTarget = document.createDocumentFragment();
      ['addEventListener', 'removeEventListener', 'dispatchEvent']
          .forEach(function(method) {
            self[method] = _eventTarget[method].bind(_eventTarget);
          });

      this.onicecandidate = null;
      this.onaddstream = null;
      this.ontrack = null;
      this.onremovestream = null;
      this.onsignalingstatechange = null;
      this.oniceconnectionstatechange = null;
      this.onnegotiationneeded = null;
      this.ondatachannel = null;

      this.localStreams = [];
      this.remoteStreams = [];
      this.getLocalStreams = function() {
        return self.localStreams;
      };
      this.getRemoteStreams = function() {
        return self.remoteStreams;
      };

      this.localDescription = new RTCSessionDescription({
        type: '',
        sdp: ''
      });
      this.remoteDescription = new RTCSessionDescription({
        type: '',
        sdp: ''
      });
      this.signalingState = 'stable';
      this.iceConnectionState = 'new';
      this.iceGatheringState = 'new';

      this.iceOptions = {
        gatherPolicy: 'all',
        iceServers: []
      };
      if (config && config.iceTransportPolicy) {
        switch (config.iceTransportPolicy) {
          case 'all':
          case 'relay':
            this.iceOptions.gatherPolicy = config.iceTransportPolicy;
            break;
          case 'none':
            // FIXME: remove once implementation and spec have added this.
            throw new TypeError('iceTransportPolicy "none" not supported');
          default:
            // don't set iceTransportPolicy.
            break;
        }
      }
      this.usingBundle = config && config.bundlePolicy === 'max-bundle';

      if (config && config.iceServers) {
        // Edge does not like
        // 1) stun:
        // 2) turn: that does not have all of turn:host:port?transport=udp
        // 3) turn: with ipv6 addresses
        var iceServers = JSON.parse(JSON.stringify(config.iceServers));
        this.iceOptions.iceServers = iceServers.filter(function(server) {
          if (server && server.urls) {
            var urls = server.urls;
            if (typeof urls === 'string') {
              urls = [urls];
            }
            urls = urls.filter(function(url) {
              return (url.indexOf('turn:') === 0 &&
                  url.indexOf('transport=udp') !== -1 &&
                  url.indexOf('turn:[') === -1) ||
                  (url.indexOf('stun:') === 0 &&
                    browserDetails.version >= 14393);
            })[0];
            return !!urls;
          }
          return false;
        });
      }

      // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
      // everything that is needed to describe a SDP m-line.
      this.transceivers = [];

      // since the iceGatherer is currently created in createOffer but we
      // must not emit candidates until after setLocalDescription we buffer
      // them in this array.
      this._localIceCandidatesBuffer = [];
    };

    window.RTCPeerConnection.prototype._emitBufferedCandidates = function() {
      var self = this;
      var sections = SDPUtils.splitSections(self.localDescription.sdp);
      // FIXME: need to apply ice candidates in a way which is async but
      // in-order
      this._localIceCandidatesBuffer.forEach(function(event) {
        var end = !event.candidate || Object.keys(event.candidate).length === 0;
        if (end) {
          for (var j = 1; j < sections.length; j++) {
            if (sections[j].indexOf('\r\na=end-of-candidates\r\n') === -1) {
              sections[j] += 'a=end-of-candidates\r\n';
            }
          }
        } else if (event.candidate.candidate.indexOf('typ endOfCandidates')
            === -1) {
          sections[event.candidate.sdpMLineIndex + 1] +=
              'a=' + event.candidate.candidate + '\r\n';
        }
        self.localDescription.sdp = sections.join('');
        self.dispatchEvent(event);
        if (self.onicecandidate !== null) {
          self.onicecandidate(event);
        }
        if (!event.candidate && self.iceGatheringState !== 'complete') {
          var complete = self.transceivers.every(function(transceiver) {
            return transceiver.iceGatherer &&
                transceiver.iceGatherer.state === 'completed';
          });
          if (complete) {
            self.iceGatheringState = 'complete';
          }
        }
      });
      this._localIceCandidatesBuffer = [];
    };

    window.RTCPeerConnection.prototype.addStream = function(stream) {
      // Clone is necessary for local demos mostly, attaching directly
      // to two different senders does not work (build 10547).
      this.localStreams.push(stream.clone());
      this._maybeFireNegotiationNeeded();
    };

    window.RTCPeerConnection.prototype.removeStream = function(stream) {
      var idx = this.localStreams.indexOf(stream);
      if (idx > -1) {
        this.localStreams.splice(idx, 1);
        this._maybeFireNegotiationNeeded();
      }
    };

    window.RTCPeerConnection.prototype.getSenders = function() {
      return this.transceivers.filter(function(transceiver) {
        return !!transceiver.rtpSender;
      })
      .map(function(transceiver) {
        return transceiver.rtpSender;
      });
    };

    window.RTCPeerConnection.prototype.getReceivers = function() {
      return this.transceivers.filter(function(transceiver) {
        return !!transceiver.rtpReceiver;
      })
      .map(function(transceiver) {
        return transceiver.rtpReceiver;
      });
    };

    // Determines the intersection of local and remote capabilities.
    window.RTCPeerConnection.prototype._getCommonCapabilities =
        function(localCapabilities, remoteCapabilities) {
          var commonCapabilities = {
            codecs: [],
            headerExtensions: [],
            fecMechanisms: []
          };
          localCapabilities.codecs.forEach(function(lCodec) {
            for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
              var rCodec = remoteCapabilities.codecs[i];
              if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() &&
                  lCodec.clockRate === rCodec.clockRate &&
                  lCodec.numChannels === rCodec.numChannels) {
                // push rCodec so we reply with offerer payload type
                commonCapabilities.codecs.push(rCodec);

                // determine common feedback mechanisms
                rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function(fb) {
                  for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
                    if (lCodec.rtcpFeedback[j].type === fb.type &&
                        lCodec.rtcpFeedback[j].parameter === fb.parameter) {
                      return true;
                    }
                  }
                  return false;
                });
                // FIXME: also need to determine .parameters
                //  see https://github.com/openpeer/ortc/issues/569
                break;
              }
            }
          });

          localCapabilities.headerExtensions
              .forEach(function(lHeaderExtension) {
                for (var i = 0; i < remoteCapabilities.headerExtensions.length;
                     i++) {
                  var rHeaderExtension = remoteCapabilities.headerExtensions[i];
                  if (lHeaderExtension.uri === rHeaderExtension.uri) {
                    commonCapabilities.headerExtensions.push(rHeaderExtension);
                    break;
                  }
                }
              });

          // FIXME: fecMechanisms
          return commonCapabilities;
        };

    // Create ICE gatherer, ICE transport and DTLS transport.
    window.RTCPeerConnection.prototype._createIceAndDtlsTransports =
        function(mid, sdpMLineIndex) {
          var self = this;
          var iceGatherer = new RTCIceGatherer(self.iceOptions);
          var iceTransport = new RTCIceTransport(iceGatherer);
          iceGatherer.onlocalcandidate = function(evt) {
            var event = new Event('icecandidate');
            event.candidate = {sdpMid: mid, sdpMLineIndex: sdpMLineIndex};

            var cand = evt.candidate;
            var end = !cand || Object.keys(cand).length === 0;
            // Edge emits an empty object for RTCIceCandidateComplete‥
            if (end) {
              // polyfill since RTCIceGatherer.state is not implemented in
              // Edge 10547 yet.
              if (iceGatherer.state === undefined) {
                iceGatherer.state = 'completed';
              }

              // Emit a candidate with type endOfCandidates to make the samples
              // work. Edge requires addIceCandidate with this empty candidate
              // to start checking. The real solution is to signal
              // end-of-candidates to the other side when getting the null
              // candidate but some apps (like the samples) don't do that.
              event.candidate.candidate =
                  'candidate:1 1 udp 1 0.0.0.0 9 typ endOfCandidates';
            } else {
              // RTCIceCandidate doesn't have a component, needs to be added
              cand.component = iceTransport.component === 'RTCP' ? 2 : 1;
              event.candidate.candidate = SDPUtils.writeCandidate(cand);
            }

            // update local description.
            var sections = SDPUtils.splitSections(self.localDescription.sdp);
            if (event.candidate.candidate.indexOf('typ endOfCandidates')
                === -1) {
              sections[event.candidate.sdpMLineIndex + 1] +=
                  'a=' + event.candidate.candidate + '\r\n';
            } else {
              sections[event.candidate.sdpMLineIndex + 1] +=
                  'a=end-of-candidates\r\n';
            }
            self.localDescription.sdp = sections.join('');

            var complete = self.transceivers.every(function(transceiver) {
              return transceiver.iceGatherer &&
                  transceiver.iceGatherer.state === 'completed';
            });

            // Emit candidate if localDescription is set.
            // Also emits null candidate when all gatherers are complete.
            switch (self.iceGatheringState) {
              case 'new':
                self._localIceCandidatesBuffer.push(event);
                if (end && complete) {
                  self._localIceCandidatesBuffer.push(
                      new Event('icecandidate'));
                }
                break;
              case 'gathering':
                self._emitBufferedCandidates();
                self.dispatchEvent(event);
                if (self.onicecandidate !== null) {
                  self.onicecandidate(event);
                }
                if (complete) {
                  self.dispatchEvent(new Event('icecandidate'));
                  if (self.onicecandidate !== null) {
                    self.onicecandidate(new Event('icecandidate'));
                  }
                  self.iceGatheringState = 'complete';
                }
                break;
              case 'complete':
                // should not happen... currently!
                break;
              default: // no-op.
                break;
            }
          };
          iceTransport.onicestatechange = function() {
            self._updateConnectionState();
          };

          var dtlsTransport = new RTCDtlsTransport(iceTransport);
          dtlsTransport.ondtlsstatechange = function() {
            self._updateConnectionState();
          };
          dtlsTransport.onerror = function() {
            // onerror does not set state to failed by itself.
            dtlsTransport.state = 'failed';
            self._updateConnectionState();
          };

          return {
            iceGatherer: iceGatherer,
            iceTransport: iceTransport,
            dtlsTransport: dtlsTransport
          };
        };

    // Start the RTP Sender and Receiver for a transceiver.
    window.RTCPeerConnection.prototype._transceive = function(transceiver,
        send, recv) {
      var params = this._getCommonCapabilities(transceiver.localCapabilities,
          transceiver.remoteCapabilities);
      if (send && transceiver.rtpSender) {
        params.encodings = transceiver.sendEncodingParameters;
        params.rtcp = {
          cname: SDPUtils.localCName
        };
        if (transceiver.recvEncodingParameters.length) {
          params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
        }
        transceiver.rtpSender.send(params);
      }
      if (recv && transceiver.rtpReceiver) {
        params.encodings = transceiver.recvEncodingParameters;
        params.rtcp = {
          cname: transceiver.cname
        };
        if (transceiver.sendEncodingParameters.length) {
          params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
        }
        transceiver.rtpReceiver.receive(params);
      }
    };

    window.RTCPeerConnection.prototype.setLocalDescription =
        function(description) {
          var self = this;
          var sections;
          var sessionpart;
          if (description.type === 'offer') {
            // FIXME: What was the purpose of this empty if statement?
            // if (!this._pendingOffer) {
            // } else {
            if (this._pendingOffer) {
              // VERY limited support for SDP munging. Limited to:
              // * changing the order of codecs
              sections = SDPUtils.splitSections(description.sdp);
              sessionpart = sections.shift();
              sections.forEach(function(mediaSection, sdpMLineIndex) {
                var caps = SDPUtils.parseRtpParameters(mediaSection);
                self._pendingOffer[sdpMLineIndex].localCapabilities = caps;
              });
              this.transceivers = this._pendingOffer;
              delete this._pendingOffer;
            }
          } else if (description.type === 'answer') {
            sections = SDPUtils.splitSections(self.remoteDescription.sdp);
            sessionpart = sections.shift();
            var isIceLite = SDPUtils.matchPrefix(sessionpart,
                'a=ice-lite').length > 0;
            sections.forEach(function(mediaSection, sdpMLineIndex) {
              var transceiver = self.transceivers[sdpMLineIndex];
              var iceGatherer = transceiver.iceGatherer;
              var iceTransport = transceiver.iceTransport;
              var dtlsTransport = transceiver.dtlsTransport;
              var localCapabilities = transceiver.localCapabilities;
              var remoteCapabilities = transceiver.remoteCapabilities;

              var rejected = mediaSection.split('\n', 1)[0]
                  .split(' ', 2)[1] === '0';

              if (!rejected && !transceiver.isDatachannel) {
                var remoteIceParameters = SDPUtils.getIceParameters(
                    mediaSection, sessionpart);
                if (isIceLite) {
                  var cands = SDPUtils.matchPrefix(mediaSection, 'a=candidate:')
                  .map(function(cand) {
                    return SDPUtils.parseCandidate(cand);
                  })
                  .filter(function(cand) {
                    return cand.component === '1';
                  });
                  // ice-lite only includes host candidates in the SDP so we can
                  // use setRemoteCandidates (which implies an
                  // RTCIceCandidateComplete)
                  if (cands.length) {
                    iceTransport.setRemoteCandidates(cands);
                  }
                }
                var remoteDtlsParameters = SDPUtils.getDtlsParameters(
                    mediaSection, sessionpart);
                if (isIceLite) {
                  remoteDtlsParameters.role = 'server';
                }

                if (!self.usingBundle || sdpMLineIndex === 0) {
                  iceTransport.start(iceGatherer, remoteIceParameters,
                      isIceLite ? 'controlling' : 'controlled');
                  dtlsTransport.start(remoteDtlsParameters);
                }

                // Calculate intersection of capabilities.
                var params = self._getCommonCapabilities(localCapabilities,
                    remoteCapabilities);

                // Start the RTCRtpSender. The RTCRtpReceiver for this
                // transceiver has already been started in setRemoteDescription.
                self._transceive(transceiver,
                    params.codecs.length > 0,
                    false);
              }
            });
          }

          this.localDescription = {
            type: description.type,
            sdp: description.sdp
          };
          switch (description.type) {
            case 'offer':
              this._updateSignalingState('have-local-offer');
              break;
            case 'answer':
              this._updateSignalingState('stable');
              break;
            default:
              throw new TypeError('unsupported type "' + description.type +
                  '"');
          }

          // If a success callback was provided, emit ICE candidates after it
          // has been executed. Otherwise, emit callback after the Promise is
          // resolved.
          var hasCallback = arguments.length > 1 &&
            typeof arguments[1] === 'function';
          if (hasCallback) {
            var cb = arguments[1];
            window.setTimeout(function() {
              cb();
              if (self.iceGatheringState === 'new') {
                self.iceGatheringState = 'gathering';
              }
              self._emitBufferedCandidates();
            }, 0);
          }
          var p = Promise.resolve();
          p.then(function() {
            if (!hasCallback) {
              if (self.iceGatheringState === 'new') {
                self.iceGatheringState = 'gathering';
              }
              // Usually candidates will be emitted earlier.
              window.setTimeout(self._emitBufferedCandidates.bind(self), 500);
            }
          });
          return p;
        };

    window.RTCPeerConnection.prototype.setRemoteDescription =
        function(description) {
          var self = this;
          var stream = new MediaStream();
          var receiverList = [];
          var sections = SDPUtils.splitSections(description.sdp);
          var sessionpart = sections.shift();
          var isIceLite = SDPUtils.matchPrefix(sessionpart,
              'a=ice-lite').length > 0;
          this.usingBundle = SDPUtils.matchPrefix(sessionpart,
              'a=group:BUNDLE ').length > 0;
          sections.forEach(function(mediaSection, sdpMLineIndex) {
            var lines = SDPUtils.splitLines(mediaSection);
            var mline = lines[0].substr(2).split(' ');
            var kind = mline[0];
            var rejected = mline[1] === '0';
            var direction = SDPUtils.getDirection(mediaSection, sessionpart);

            var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:');
            if (mid.length) {
              mid = mid[0].substr(6);
            } else {
              mid = SDPUtils.generateIdentifier();
            }

            // Reject datachannels which are not implemented yet.
            if (kind === 'application' && mline[2] === 'DTLS/SCTP') {
              self.transceivers[sdpMLineIndex] = {
                mid: mid,
                isDatachannel: true
              };
              return;
            }

            var transceiver;
            var iceGatherer;
            var iceTransport;
            var dtlsTransport;
            var rtpSender;
            var rtpReceiver;
            var sendEncodingParameters;
            var recvEncodingParameters;
            var localCapabilities;

            var track;
            // FIXME: ensure the mediaSection has rtcp-mux set.
            var remoteCapabilities = SDPUtils.parseRtpParameters(mediaSection);
            var remoteIceParameters;
            var remoteDtlsParameters;
            if (!rejected) {
              remoteIceParameters = SDPUtils.getIceParameters(mediaSection,
                  sessionpart);
              remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection,
                  sessionpart);
              remoteDtlsParameters.role = 'client';
            }
            recvEncodingParameters =
                SDPUtils.parseRtpEncodingParameters(mediaSection);

            var cname;
            // Gets the first SSRC. Note that with RTX there might be multiple
            // SSRCs.
            var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
                .map(function(line) {
                  return SDPUtils.parseSsrcMedia(line);
                })
                .filter(function(obj) {
                  return obj.attribute === 'cname';
                })[0];
            if (remoteSsrc) {
              cname = remoteSsrc.value;
            }

            var isComplete = SDPUtils.matchPrefix(mediaSection,
                'a=end-of-candidates', sessionpart).length > 0;
            var cands = SDPUtils.matchPrefix(mediaSection, 'a=candidate:')
                .map(function(cand) {
                  return SDPUtils.parseCandidate(cand);
                })
                .filter(function(cand) {
                  return cand.component === '1';
                });
            if (description.type === 'offer' && !rejected) {
              var transports = self.usingBundle && sdpMLineIndex > 0 ? {
                iceGatherer: self.transceivers[0].iceGatherer,
                iceTransport: self.transceivers[0].iceTransport,
                dtlsTransport: self.transceivers[0].dtlsTransport
              } : self._createIceAndDtlsTransports(mid, sdpMLineIndex);

              if (isComplete) {
                transports.iceTransport.setRemoteCandidates(cands);
              }

              localCapabilities = RTCRtpReceiver.getCapabilities(kind);
              sendEncodingParameters = [{
                ssrc: (2 * sdpMLineIndex + 2) * 1001
              }];

              rtpReceiver = new RTCRtpReceiver(transports.dtlsTransport, kind);

              track = rtpReceiver.track;
              receiverList.push([track, rtpReceiver]);
              // FIXME: not correct when there are multiple streams but that is
              // not currently supported in this shim.
              stream.addTrack(track);

              // FIXME: look at direction.
              if (self.localStreams.length > 0 &&
                  self.localStreams[0].getTracks().length >= sdpMLineIndex) {
                var localTrack;
                if (kind === 'audio') {
                  localTrack = self.localStreams[0].getAudioTracks()[0];
                } else if (kind === 'video') {
                  localTrack = self.localStreams[0].getVideoTracks()[0];
                }
                if (localTrack) {
                  rtpSender = new RTCRtpSender(localTrack,
                      transports.dtlsTransport);
                }
              }

              self.transceivers[sdpMLineIndex] = {
                iceGatherer: transports.iceGatherer,
                iceTransport: transports.iceTransport,
                dtlsTransport: transports.dtlsTransport,
                localCapabilities: localCapabilities,
                remoteCapabilities: remoteCapabilities,
                rtpSender: rtpSender,
                rtpReceiver: rtpReceiver,
                kind: kind,
                mid: mid,
                cname: cname,
                sendEncodingParameters: sendEncodingParameters,
                recvEncodingParameters: recvEncodingParameters
              };
              // Start the RTCRtpReceiver now. The RTPSender is started in
              // setLocalDescription.
              self._transceive(self.transceivers[sdpMLineIndex],
                  false,
                  direction === 'sendrecv' || direction === 'sendonly');
            } else if (description.type === 'answer' && !rejected) {
              transceiver = self.transceivers[sdpMLineIndex];
              iceGatherer = transceiver.iceGatherer;
              iceTransport = transceiver.iceTransport;
              dtlsTransport = transceiver.dtlsTransport;
              rtpSender = transceiver.rtpSender;
              rtpReceiver = transceiver.rtpReceiver;
              sendEncodingParameters = transceiver.sendEncodingParameters;
              localCapabilities = transceiver.localCapabilities;

              self.transceivers[sdpMLineIndex].recvEncodingParameters =
                  recvEncodingParameters;
              self.transceivers[sdpMLineIndex].remoteCapabilities =
                  remoteCapabilities;
              self.transceivers[sdpMLineIndex].cname = cname;

              if ((isIceLite || isComplete) && cands.length) {
                iceTransport.setRemoteCandidates(cands);
              }
              if (!self.usingBundle || sdpMLineIndex === 0) {
                iceTransport.start(iceGatherer, remoteIceParameters,
                    'controlling');
                dtlsTransport.start(remoteDtlsParameters);
              }

              self._transceive(transceiver,
                  direction === 'sendrecv' || direction === 'recvonly',
                  direction === 'sendrecv' || direction === 'sendonly');

              if (rtpReceiver &&
                  (direction === 'sendrecv' || direction === 'sendonly')) {
                track = rtpReceiver.track;
                receiverList.push([track, rtpReceiver]);
                stream.addTrack(track);
              } else {
                // FIXME: actually the receiver should be created later.
                delete transceiver.rtpReceiver;
              }
            }
          });

          this.remoteDescription = {
            type: description.type,
            sdp: description.sdp
          };
          switch (description.type) {
            case 'offer':
              this._updateSignalingState('have-remote-offer');
              break;
            case 'answer':
              this._updateSignalingState('stable');
              break;
            default:
              throw new TypeError('unsupported type "' + description.type +
                  '"');
          }
          if (stream.getTracks().length) {
            self.remoteStreams.push(stream);
            window.setTimeout(function() {
              var event = new Event('addstream');
              event.stream = stream;
              self.dispatchEvent(event);
              if (self.onaddstream !== null) {
                window.setTimeout(function() {
                  self.onaddstream(event);
                }, 0);
              }

              receiverList.forEach(function(item) {
                var track = item[0];
                var receiver = item[1];
                var trackEvent = new Event('track');
                trackEvent.track = track;
                trackEvent.receiver = receiver;
                trackEvent.streams = [stream];
                self.dispatchEvent(event);
                if (self.ontrack !== null) {
                  window.setTimeout(function() {
                    self.ontrack(trackEvent);
                  }, 0);
                }
              });
            }, 0);
          }
          if (arguments.length > 1 && typeof arguments[1] === 'function') {
            window.setTimeout(arguments[1], 0);
          }
          return Promise.resolve();
        };

    window.RTCPeerConnection.prototype.close = function() {
      this.transceivers.forEach(function(transceiver) {
        /* not yet
        if (transceiver.iceGatherer) {
          transceiver.iceGatherer.close();
        }
        */
        if (transceiver.iceTransport) {
          transceiver.iceTransport.stop();
        }
        if (transceiver.dtlsTransport) {
          transceiver.dtlsTransport.stop();
        }
        if (transceiver.rtpSender) {
          transceiver.rtpSender.stop();
        }
        if (transceiver.rtpReceiver) {
          transceiver.rtpReceiver.stop();
        }
      });
      // FIXME: clean up tracks, local streams, remote streams, etc
      this._updateSignalingState('closed');
    };

    // Update the signaling state.
    window.RTCPeerConnection.prototype._updateSignalingState =
        function(newState) {
          this.signalingState = newState;
          var event = new Event('signalingstatechange');
          this.dispatchEvent(event);
          if (this.onsignalingstatechange !== null) {
            this.onsignalingstatechange(event);
          }
        };

    // Determine whether to fire the negotiationneeded event.
    window.RTCPeerConnection.prototype._maybeFireNegotiationNeeded =
        function() {
          // Fire away (for now).
          var event = new Event('negotiationneeded');
          this.dispatchEvent(event);
          if (this.onnegotiationneeded !== null) {
            this.onnegotiationneeded(event);
          }
        };

    // Update the connection state.
    window.RTCPeerConnection.prototype._updateConnectionState = function() {
      var self = this;
      var newState;
      var states = {
        'new': 0,
        closed: 0,
        connecting: 0,
        checking: 0,
        connected: 0,
        completed: 0,
        failed: 0
      };
      this.transceivers.forEach(function(transceiver) {
        states[transceiver.iceTransport.state]++;
        states[transceiver.dtlsTransport.state]++;
      });
      // ICETransport.completed and connected are the same for this purpose.
      states.connected += states.completed;

      newState = 'new';
      if (states.failed > 0) {
        newState = 'failed';
      } else if (states.connecting > 0 || states.checking > 0) {
        newState = 'connecting';
      } else if (states.disconnected > 0) {
        newState = 'disconnected';
      } else if (states.new > 0) {
        newState = 'new';
      } else if (states.connected > 0 || states.completed > 0) {
        newState = 'connected';
      }

      if (newState !== self.iceConnectionState) {
        self.iceConnectionState = newState;
        var event = new Event('iceconnectionstatechange');
        this.dispatchEvent(event);
        if (this.oniceconnectionstatechange !== null) {
          this.oniceconnectionstatechange(event);
        }
      }
    };

    window.RTCPeerConnection.prototype.createOffer = function() {
      var self = this;
      if (this._pendingOffer) {
        throw new Error('createOffer called while there is a pending offer.');
      }
      var offerOptions;
      if (arguments.length === 1 && typeof arguments[0] !== 'function') {
        offerOptions = arguments[0];
      } else if (arguments.length === 3) {
        offerOptions = arguments[2];
      }

      var tracks = [];
      var numAudioTracks = 0;
      var numVideoTracks = 0;
      // Default to sendrecv.
      if (this.localStreams.length) {
        numAudioTracks = this.localStreams[0].getAudioTracks().length;
        numVideoTracks = this.localStreams[0].getVideoTracks().length;
      }
      // Determine number of audio and video tracks we need to send/recv.
      if (offerOptions) {
        // Reject Chrome legacy constraints.
        if (offerOptions.mandatory || offerOptions.optional) {
          throw new TypeError(
              'Legacy mandatory/optional constraints not supported.');
        }
        if (offerOptions.offerToReceiveAudio !== undefined) {
          numAudioTracks = offerOptions.offerToReceiveAudio;
        }
        if (offerOptions.offerToReceiveVideo !== undefined) {
          numVideoTracks = offerOptions.offerToReceiveVideo;
        }
      }
      if (this.localStreams.length) {
        // Push local streams.
        this.localStreams[0].getTracks().forEach(function(track) {
          tracks.push({
            kind: track.kind,
            track: track,
            wantReceive: track.kind === 'audio' ?
                numAudioTracks > 0 : numVideoTracks > 0
          });
          if (track.kind === 'audio') {
            numAudioTracks--;
          } else if (track.kind === 'video') {
            numVideoTracks--;
          }
        });
      }
      // Create M-lines for recvonly streams.
      while (numAudioTracks > 0 || numVideoTracks > 0) {
        if (numAudioTracks > 0) {
          tracks.push({
            kind: 'audio',
            wantReceive: true
          });
          numAudioTracks--;
        }
        if (numVideoTracks > 0) {
          tracks.push({
            kind: 'video',
            wantReceive: true
          });
          numVideoTracks--;
        }
      }

      var sdp = SDPUtils.writeSessionBoilerplate();
      var transceivers = [];
      tracks.forEach(function(mline, sdpMLineIndex) {
        // For each track, create an ice gatherer, ice transport,
        // dtls transport, potentially rtpsender and rtpreceiver.
        var track = mline.track;
        var kind = mline.kind;
        var mid = SDPUtils.generateIdentifier();

        var transports = self.usingBundle && sdpMLineIndex > 0 ? {
          iceGatherer: transceivers[0].iceGatherer,
          iceTransport: transceivers[0].iceTransport,
          dtlsTransport: transceivers[0].dtlsTransport
        } : self._createIceAndDtlsTransports(mid, sdpMLineIndex);

        var localCapabilities = RTCRtpSender.getCapabilities(kind);
        var rtpSender;
        var rtpReceiver;

        // generate an ssrc now, to be used later in rtpSender.send
        var sendEncodingParameters = [{
          ssrc: (2 * sdpMLineIndex + 1) * 1001
        }];
        if (track) {
          rtpSender = new RTCRtpSender(track, transports.dtlsTransport);
        }

        if (mline.wantReceive) {
          rtpReceiver = new RTCRtpReceiver(transports.dtlsTransport, kind);
        }

        transceivers[sdpMLineIndex] = {
          iceGatherer: transports.iceGatherer,
          iceTransport: transports.iceTransport,
          dtlsTransport: transports.dtlsTransport,
          localCapabilities: localCapabilities,
          remoteCapabilities: null,
          rtpSender: rtpSender,
          rtpReceiver: rtpReceiver,
          kind: kind,
          mid: mid,
          sendEncodingParameters: sendEncodingParameters,
          recvEncodingParameters: null
        };
      });
      if (this.usingBundle) {
        sdp += 'a=group:BUNDLE ' + transceivers.map(function(t) {
          return t.mid;
        }).join(' ') + '\r\n';
      }
      tracks.forEach(function(mline, sdpMLineIndex) {
        var transceiver = transceivers[sdpMLineIndex];
        sdp += SDPUtils.writeMediaSection(transceiver,
            transceiver.localCapabilities, 'offer', self.localStreams[0]);
      });

      this._pendingOffer = transceivers;
      var desc = new RTCSessionDescription({
        type: 'offer',
        sdp: sdp
      });
      if (arguments.length && typeof arguments[0] === 'function') {
        window.setTimeout(arguments[0], 0, desc);
      }
      return Promise.resolve(desc);
    };

    window.RTCPeerConnection.prototype.createAnswer = function() {
      var self = this;

      var sdp = SDPUtils.writeSessionBoilerplate();
      if (this.usingBundle) {
        sdp += 'a=group:BUNDLE ' + this.transceivers.map(function(t) {
          return t.mid;
        }).join(' ') + '\r\n';
      }
      this.transceivers.forEach(function(transceiver) {
        if (transceiver.isDatachannel) {
          sdp += 'm=application 0 DTLS/SCTP 5000\r\n' +
              'c=IN IP4 0.0.0.0\r\n' +
              'a=mid:' + transceiver.mid + '\r\n';
          return;
        }
        // Calculate intersection of capabilities.
        var commonCapabilities = self._getCommonCapabilities(
            transceiver.localCapabilities,
            transceiver.remoteCapabilities);

        sdp += SDPUtils.writeMediaSection(transceiver, commonCapabilities,
            'answer', self.localStreams[0]);
      });

      var desc = new RTCSessionDescription({
        type: 'answer',
        sdp: sdp
      });
      if (arguments.length && typeof arguments[0] === 'function') {
        window.setTimeout(arguments[0], 0, desc);
      }
      return Promise.resolve(desc);
    };

    window.RTCPeerConnection.prototype.addIceCandidate = function(candidate) {
      if (candidate === null) {
        this.transceivers.forEach(function(transceiver) {
          transceiver.iceTransport.addRemoteCandidate({});
        });
      } else {
        var mLineIndex = candidate.sdpMLineIndex;
        if (candidate.sdpMid) {
          for (var i = 0; i < this.transceivers.length; i++) {
            if (this.transceivers[i].mid === candidate.sdpMid) {
              mLineIndex = i;
              break;
            }
          }
        }
        var transceiver = this.transceivers[mLineIndex];
        if (transceiver) {
          var cand = Object.keys(candidate.candidate).length > 0 ?
              SDPUtils.parseCandidate(candidate.candidate) : {};
          // Ignore Chrome's invalid candidates since Edge does not like them.
          if (cand.protocol === 'tcp' && (cand.port === 0 || cand.port === 9)) {
            return;
          }
          // Ignore RTCP candidates, we assume RTCP-MUX.
          if (cand.component !== '1') {
            return;
          }
          // A dirty hack to make samples work.
          if (cand.type === 'endOfCandidates') {
            cand = {};
          }
          transceiver.iceTransport.addRemoteCandidate(cand);

          // update the remoteDescription.
          var sections = SDPUtils.splitSections(this.remoteDescription.sdp);
          sections[mLineIndex + 1] += (cand.type ? candidate.candidate.trim()
              : 'a=end-of-candidates') + '\r\n';
          this.remoteDescription.sdp = sections.join('');
        }
      }
      if (arguments.length > 1 && typeof arguments[1] === 'function') {
        window.setTimeout(arguments[1], 0);
      }
      return Promise.resolve();
    };

    window.RTCPeerConnection.prototype.getStats = function() {
      var promises = [];
      this.transceivers.forEach(function(transceiver) {
        ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport',
            'dtlsTransport'].forEach(function(method) {
              if (transceiver[method]) {
                promises.push(transceiver[method].getStats());
              }
            });
      });
      var cb = arguments.length > 1 && typeof arguments[1] === 'function' &&
          arguments[1];
      return new Promise(function(resolve) {
        // shim getStats with maplike support
        var results = new Map();
        Promise.all(promises).then(function(res) {
          res.forEach(function(result) {
            Object.keys(result).forEach(function(id) {
              results.set(id, result[id]);
              results[id] = result[id];
            });
          });
          if (cb) {
            window.setTimeout(cb, 0, results);
          }
          resolve(results);
        });
      });
    };
  }
};

// Expose public methods.
module.exports = {
  shimPeerConnection: edgeShim.shimPeerConnection,
  shimGetUserMedia: requirecopy('./getusermedia')
};

},{"../utils":10,"./getusermedia":6,"sdp":1}],6:[function(requirecopy,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */
'use strict';

// Expose public methods.
module.exports = function() {
  var shimError_ = function(e) {
    return {
      name: {PermissionDeniedError: 'NotAllowedError'}[e.name] || e.name,
      message: e.message,
      constraint: e.constraint,
      toString: function() {
        return this.name;
      }
    };
  };

  // getUserMedia error shim.
  var origGetUserMedia = navigator.mediaDevices.getUserMedia.
      bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia = function(c) {
    return origGetUserMedia(c).catch(function(e) {
      return Promise.reject(shimError_(e));
    });
  };
};

},{}],7:[function(requirecopy,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */
'use strict';

var browserDetails = requirecopy('../utils').browserDetails;

var firefoxShim = {
  shimOnTrack: function() {
    if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
        window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
        get: function() {
          return this._ontrack;
        },
        set: function(f) {
          if (this._ontrack) {
            this.removeEventListener('track', this._ontrack);
            this.removeEventListener('addstream', this._ontrackpoly);
          }
          this.addEventListener('track', this._ontrack = f);
          this.addEventListener('addstream', this._ontrackpoly = function(e) {
            e.stream.getTracks().forEach(function(track) {
              var event = new Event('track');
              event.track = track;
              event.receiver = {track: track};
              event.streams = [e.stream];
              this.dispatchEvent(event);
            }.bind(this));
          }.bind(this));
        }
      });
    }
  },

  shimSourceObject: function() {
    // Firefox has supported mozSrcObject since FF22, unprefixed in 42.
    if (typeof window === 'object') {
      if (window.HTMLMediaElement &&
        !('srcObject' in window.HTMLMediaElement.prototype)) {
        // Shim the srcObject property, once, when HTMLMediaElement is found.
        Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
          get: function() {
            return this.mozSrcObject;
          },
          set: function(stream) {
            this.mozSrcObject = stream;
          }
        });
      }
    }
  },

  shimPeerConnection: function() {
    if (typeof window !== 'object' || !(window.RTCPeerConnection ||
        window.mozRTCPeerConnection)) {
      return; // probably media.peerconnection.enabled=false in about:config
    }
    // The RTCPeerConnection object.
    if (!window.RTCPeerConnection) {
      window.RTCPeerConnection = function(pcConfig, pcConstraints) {
        if (browserDetails.version < 38) {
          // .urls is not supported in FF < 38.
          // create RTCIceServers with a single url.
          if (pcConfig && pcConfig.iceServers) {
            var newIceServers = [];
            for (var i = 0; i < pcConfig.iceServers.length; i++) {
              var server = pcConfig.iceServers[i];
              if (server.hasOwnProperty('urls')) {
                for (var j = 0; j < server.urls.length; j++) {
                  var newServer = {
                    url: server.urls[j]
                  };
                  if (server.urls[j].indexOf('turn') === 0) {
                    newServer.username = server.username;
                    newServer.credential = server.credential;
                  }
                  newIceServers.push(newServer);
                }
              } else {
                newIceServers.push(pcConfig.iceServers[i]);
              }
            }
            pcConfig.iceServers = newIceServers;
          }
        }
        return new mozRTCPeerConnection(pcConfig, pcConstraints);
      };
      window.RTCPeerConnection.prototype = mozRTCPeerConnection.prototype;

      // wrap static methods. Currently just generateCertificate.
      if (mozRTCPeerConnection.generateCertificate) {
        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
          get: function() {
            return mozRTCPeerConnection.generateCertificate;
          }
        });
      }

      window.RTCSessionDescription = mozRTCSessionDescription;
      window.RTCIceCandidate = mozRTCIceCandidate;
    }

    // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
        .forEach(function(method) {
          var nativeMethod = RTCPeerConnection.prototype[method];
          RTCPeerConnection.prototype[method] = function() {
            arguments[0] = new ((method === 'addIceCandidate') ?
                RTCIceCandidate : RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          };
        });

    // support for addIceCandidate(null)
    var nativeAddIceCandidate =
        RTCPeerConnection.prototype.addIceCandidate;
    RTCPeerConnection.prototype.addIceCandidate = function() {
      return arguments[0] === null ? Promise.resolve()
          : nativeAddIceCandidate.apply(this, arguments);
    };

    // shim getStats with maplike support
    var makeMapStats = function(stats) {
      var map = new Map();
      Object.keys(stats).forEach(function(key) {
        map.set(key, stats[key]);
        map[key] = stats[key];
      });
      return map;
    };

    var nativeGetStats = RTCPeerConnection.prototype.getStats;
    RTCPeerConnection.prototype.getStats = function(selector, onSucc, onErr) {
      return nativeGetStats.apply(this, [selector || null])
        .then(function(stats) {
          return makeMapStats(stats);
        })
        .then(onSucc, onErr);
    };
  }
};

// Expose public methods.
module.exports = {
  shimOnTrack: firefoxShim.shimOnTrack,
  shimSourceObject: firefoxShim.shimSourceObject,
  shimPeerConnection: firefoxShim.shimPeerConnection,
  shimGetUserMedia: requirecopy('./getusermedia')
};

},{"../utils":10,"./getusermedia":8}],8:[function(requirecopy,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */
'use strict';

var logging = requirecopy('../utils').log;
var browserDetails = requirecopy('../utils').browserDetails;

// Expose public methods.
module.exports = function() {
  var shimError_ = function(e) {
    return {
      name: {
        SecurityError: 'NotAllowedError',
        PermissionDeniedError: 'NotAllowedError'
      }[e.name] || e.name,
      message: {
        'The operation is insecure.': 'The request is not allowed by the ' +
        'user agent or the platform in the current context.'
      }[e.message] || e.message,
      constraint: e.constraint,
      toString: function() {
        return this.name + (this.message && ': ') + this.message;
      }
    };
  };

  // getUserMedia constraints shim.
  var getUserMedia_ = function(constraints, onSuccess, onError) {
    var constraintsToFF37_ = function(c) {
      if (typeof c !== 'object' || c.require) {
        return c;
      }
      var require = [];
      Object.keys(c).forEach(function(key) {
        if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
          return;
        }
        var r = c[key] = (typeof c[key] === 'object') ?
            c[key] : {ideal: c[key]};
        if (r.min !== undefined ||
            r.max !== undefined || r.exact !== undefined) {
          require.push(key);
        }
        if (r.exact !== undefined) {
          if (typeof r.exact === 'number') {
            r. min = r.max = r.exact;
          } else {
            c[key] = r.exact;
          }
          delete r.exact;
        }
        if (r.ideal !== undefined) {
          c.advanced = c.advanced || [];
          var oc = {};
          if (typeof r.ideal === 'number') {
            oc[key] = {min: r.ideal, max: r.ideal};
          } else {
            oc[key] = r.ideal;
          }
          c.advanced.push(oc);
          delete r.ideal;
          if (!Object.keys(r).length) {
            delete c[key];
          }
        }
      });
      if (require.length) {
        c.require = require;
      }
      return c;
    };
    constraints = JSON.parse(JSON.stringify(constraints));
    if (browserDetails.version < 38) {
      logging('spec: ' + JSON.stringify(constraints));
      if (constraints.audio) {
        constraints.audio = constraintsToFF37_(constraints.audio);
      }
      if (constraints.video) {
        constraints.video = constraintsToFF37_(constraints.video);
      }
      logging('ff37: ' + JSON.stringify(constraints));
    }
    return navigator.mozGetUserMedia(constraints, onSuccess, function(e) {
      onError(shimError_(e));
    });
  };

  // Returns the result of getUserMedia as a Promise.
  var getUserMediaPromise_ = function(constraints) {
    return new Promise(function(resolve, reject) {
      getUserMedia_(constraints, resolve, reject);
    });
  };

  // Shim for mediaDevices on older versions.
  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {getUserMedia: getUserMediaPromise_,
      addEventListener: function() { },
      removeEventListener: function() { }
    };
  }
  navigator.mediaDevices.enumerateDevices =
      navigator.mediaDevices.enumerateDevices || function() {
        return new Promise(function(resolve) {
          var infos = [
            {kind: 'audioinput', deviceId: 'default', label: '', groupId: ''},
            {kind: 'videoinput', deviceId: 'default', label: '', groupId: ''}
          ];
          resolve(infos);
        });
      };

  if (browserDetails.version < 41) {
    // Work around http://bugzil.la/1169665
    var orgEnumerateDevices =
        navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
    navigator.mediaDevices.enumerateDevices = function() {
      return orgEnumerateDevices().then(undefined, function(e) {
        if (e.name === 'NotFoundError') {
          return [];
        }
        throw e;
      });
    };
  }
  if (browserDetails.version < 49) {
    var origGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(c) {
      return origGetUserMedia(c).catch(function(e) {
        return Promise.reject(shimError_(e));
      });
    };
  }
  navigator.getUserMedia = function(constraints, onSuccess, onError) {
    if (browserDetails.version < 44) {
      return getUserMedia_(constraints, onSuccess, onError);
    }
    // Replace Firefox 44+'s deprecation warning with unprefixed version.
    console.warn('navigator.getUserMedia has been replaced by ' +
                 'navigator.mediaDevices.getUserMedia');
    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
  };
};

},{"../utils":10}],9:[function(requirecopy,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
'use strict';
var safariShim = {
  // TODO: DrAlex, should be here, double check against LayoutTests
  // shimOnTrack: function() { },

  // TODO: once the back-end for the mac port is done, add.
  // TODO: check for webkitGTK+
  // shimPeerConnection: function() { },

  shimGetUserMedia: function() {
    navigator.getUserMedia = navigator.webkitGetUserMedia;
  }
};

// Expose public methods.
module.exports = {
  shimGetUserMedia: safariShim.shimGetUserMedia
  // TODO
  // shimOnTrack: safariShim.shimOnTrack,
  // shimPeerConnection: safariShim.shimPeerConnection
};

},{}],10:[function(requirecopy,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */
'use strict';

var logDisabled_ = true;

// Utility methods.
var utils = {
  disableLog: function(bool) {
    if (typeof bool !== 'boolean') {
      return new Error('Argument type: ' + typeof bool +
          '. Please use a boolean.');
    }
    logDisabled_ = bool;
    return (bool) ? 'adapter.js logging disabled' :
        'adapter.js logging enabled';
  },

  log: function() {
    if (typeof window === 'object') {
      if (logDisabled_) {
        return;
      }
      if (typeof console !== 'undefined' && typeof console.log === 'function') {
        console.log.apply(console, arguments);
      }
    }
  },

  /**
   * Extract browser version out of the provided user agent string.
   *
   * @param {!string} uastring userAgent string.
   * @param {!string} expr Regular expression used as match criteria.
   * @param {!number} pos position in the version string to be returned.
   * @return {!number} browser version.
   */
  extractVersion: function(uastring, expr, pos) {
    var match = uastring.match(expr);
    return match && match.length >= pos && parseInt(match[pos], 10);
  },

  /**
   * Browser detector.
   *
   * @return {object} result containing browser and version
   *     properties.
   */
  detectBrowser: function() {
    // Returned result object.
    var result = {};
    result.browser = null;
    result.version = null;

    // Fail early if it's not a browser
    if (typeof window === 'undefined' || !window.navigator) {
      result.browser = 'Not a browser.';
      return result;
    }

    // Firefox.
    if (navigator.mozGetUserMedia) {
      result.browser = 'firefox';
      result.version = this.extractVersion(navigator.userAgent,
          /Firefox\/([0-9]+)\./, 1);

    // all webkit-based browsers
    } else if (navigator.webkitGetUserMedia) {
      // Chrome, Chromium, Webview, Opera, all use the chrome shim for now
      if (window.webkitRTCPeerConnection) {
        result.browser = 'chrome';
        result.version = this.extractVersion(navigator.userAgent,
          /Chrom(e|ium)\/([0-9]+)\./, 2);

      // Safari or unknown webkit-based
      // for the time being Safari has support for MediaStreams but not webRTC
      } else {
        // Safari UA substrings of interest for reference:
        // - webkit version:           AppleWebKit/602.1.25 (also used in Op,Cr)
        // - safari UI version:        Version/9.0.3 (unique to Safari)
        // - safari UI webkit version: Safari/601.4.4 (also used in Op,Cr)
        //
        // if the webkit version and safari UI webkit versions are equals,
        // ... this is a stable version.
        //
        // only the internal webkit version is important today to know if
        // media streams are supported
        //
        if (navigator.userAgent.match(/Version\/(\d+).(\d+)/)) {
          result.browser = 'safari';
          result.version = this.extractVersion(navigator.userAgent,
            /AppleWebKit\/([0-9]+)\./, 1);

        // unknown webkit-based browser
        } else {
          result.browser = 'Unsupported webkit-based browser ' +
              'with GUM support but no WebRTC support.';
          return result;
        }
      }

    // Edge.
    } else if (navigator.mediaDevices &&
        navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) {
      result.browser = 'edge';
      result.version = this.extractVersion(navigator.userAgent,
          /Edge\/(\d+).(\d+)$/, 2);

    // Default fallthrough: not supported.
    } else {
      result.browser = 'Not a supported browser.';
      return result;
    }

    return result;
  }
};

// Export.
module.exports = {
  log: utils.log,
  disableLog: utils.disableLog,
  browserDetails: utils.detectBrowser(),
  extractVersion: utils.extractVersion
};

},{}]},{},[2])(2)
});
/* jshint ignore:end */

  // END OF INJECTION OF GOOGLE'S ADAPTER.JS CONTENT
  ///////////////////////////////////////////////////////////////////

  AdapterJS.parseWebrtcDetectedBrowser();

  ///////////////////////////////////////////////////////////////////
  // EXTENSION FOR CHROME, FIREFOX AND EDGE
  // Includes legacy functions
  // -- createIceServer
  // -- createIceServers
  // -- MediaStreamTrack.getSources
  //
  // and additional shims
  // -- attachMediaStream
  // -- reattachMediaStream
  // -- requestUserMedia
  // -- a call to AdapterJS.maybeThroughWebRTCReady (notifies WebRTC is ready)

  // Add support for legacy functions createIceServer and createIceServers
  if ( navigator.mozGetUserMedia ) {
    // Shim for MediaStreamTrack.getSources.
    MediaStreamTrack.getSources = function(successCb) {
      setTimeout(function() {
        var infos = [
          { kind: 'audio', id: 'default', label:'', facing:'' },
          { kind: 'video', id: 'default', label:'', facing:'' }
        ];
        successCb(infos);
      }, 0);
    };

    // Attach a media stream to an element.
    attachMediaStream = function(element, stream) {
      element.srcObject = stream;
      return element;
    };

    reattachMediaStream = function(to, from) {
      to.srcObject = from.srcObject;
      return to;
    };

    createIceServer = function (url, username, password) {
      console.warn('createIceServer is deprecated. It should be replaced with an application level implementation.');
      // Note: Google's import of AJS will auto-reverse to 'url': '...' for FF < 38

      var iceServer = null;
      var urlParts = url.split(':');
      if (urlParts[0].indexOf('stun') === 0) {
        iceServer = { urls : [url] };
      } else if (urlParts[0].indexOf('turn') === 0) {
        if (webrtcDetectedVersion < 27) {
          var turnUrlParts = url.split('?');
          if (turnUrlParts.length === 1 ||
            turnUrlParts[1].indexOf('transport=udp') === 0) {
            iceServer = {
              urls : [turnUrlParts[0]],
              credential : password,
              username : username
            };
          }
        } else {
          iceServer = {
            urls : [url],
            credential : password,
            username : username
          };
        }
      }
      return iceServer;
    };

    createIceServers = function (urls, username, password) {
      console.warn('createIceServers is deprecated. It should be replaced with an application level implementation.');

      var iceServers = [];
      for (i = 0; i < urls.length; i++) {
        var iceServer = createIceServer(urls[i], username, password);
        if (iceServer !== null) {
          iceServers.push(iceServer);
        }
      }
      return iceServers;
    };
  } else if ( navigator.webkitGetUserMedia ) {
    // Attach a media stream to an element.
    attachMediaStream = function(element, stream) {
      if (webrtcDetectedVersion >= 43) {
        element.srcObject = stream;
      } else if (typeof element.src !== 'undefined') {
        element.src = URL.createObjectURL(stream);
      } else {
        console.error('Error attaching stream to element.');
        // logging('Error attaching stream to element.');
      }
      return element;
    };

    reattachMediaStream = function(to, from) {
      if (webrtcDetectedVersion >= 43) {
        to.srcObject = from.srcObject;
      } else {
        to.src = from.src;
      }
      return to;
    };

    createIceServer = function (url, username, password) {
      console.warn('createIceServer is deprecated. It should be replaced with an application level implementation.');

      var iceServer = null;
      var urlParts = url.split(':');
      if (urlParts[0].indexOf('stun') === 0) {
        iceServer = { 'url' : url };
      } else if (urlParts[0].indexOf('turn') === 0) {
        iceServer = {
          'url' : url,
          'credential' : password,
          'username' : username
        };
      }
      return iceServer;
    };

    createIceServers = function (urls, username, password) {
      console.warn('createIceServers is deprecated. It should be replaced with an application level implementation.');

      var iceServers = [];
      if (webrtcDetectedVersion >= 34) {
        iceServers = {
          'urls' : urls,
          'credential' : password,
          'username' : username
        };
      } else {
        for (i = 0; i < urls.length; i++) {
          var iceServer = createIceServer(urls[i], username, password);
          if (iceServer !== null) {
            iceServers.push(iceServer);
          }
        }
      }
      return iceServers;
    };
  } else if (navigator.mediaDevices && navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) {
    // Attach a media stream to an element.
    attachMediaStream = function(element, stream) {
      element.srcObject = stream;
      return element;
    };

    reattachMediaStream = function(to, from) {
      to.srcObject = from.srcObject;
      return to;
    };
  }

  // Need to override attachMediaStream and reattachMediaStream
  // to support the plugin's logic
  attachMediaStream_base = attachMediaStream;

  if (webrtcDetectedBrowser === 'opera') {
    attachMediaStream_base = function (element, stream) {
      if (webrtcDetectedVersion > 38) {
        element.srcObject = stream;
      } else if (typeof element.src !== 'undefined') {
        element.src = URL.createObjectURL(stream);
      }
      // Else it doesn't work
    };
  }

  attachMediaStream = function (element, stream) {
    if ((webrtcDetectedBrowser === 'chrome' ||
         webrtcDetectedBrowser === 'opera') &&
        !stream) {
      // Chrome does not support "src = null"
      element.src = '';
    } else {
      attachMediaStream_base(element, stream);
    }
    return element;
  };
  reattachMediaStream_base = reattachMediaStream;
  reattachMediaStream = function (to, from) {
    reattachMediaStream_base(to, from);
    return to;
  };

  // Propagate attachMediaStream and gUM in window and AdapterJS
  window.attachMediaStream      = attachMediaStream;
  window.reattachMediaStream    = reattachMediaStream;
  window.getUserMedia           = function(constraints, onSuccess, onFailure) {
    navigator.getUserMedia(constraints, onSuccess, onFailure);
  };
  AdapterJS.attachMediaStream   = attachMediaStream;
  AdapterJS.reattachMediaStream = reattachMediaStream;
  AdapterJS.getUserMedia        = getUserMedia;

  // Removed Google defined promises when promise is not defined
  if (typeof Promise === 'undefined') {
    requestUserMedia = null;
  }

  AdapterJS.maybeThroughWebRTCReady();

  // END OF EXTENSION OF CHROME, FIREFOX AND EDGE
  ///////////////////////////////////////////////////////////////////

} else { // TRY TO USE PLUGIN

  ///////////////////////////////////////////////////////////////////
  // WEBRTC PLUGIN SHIM
  // Will automatically check if the plugin is available and inject it
  // into the DOM if it is.
  // When the plugin is not available, will prompt a banner to suggest installing it
  // Use AdapterJS.options.hidePluginInstallPrompt to prevent this banner from popping
  //
  // Shims the follwing:
  // -- getUserMedia
  // -- MediaStream
  // -- MediaStreamTrack
  // -- MediaStreamTrack.getSources
  // -- RTCPeerConnection
  // -- RTCSessionDescription
  // -- RTCIceCandidate
  // -- createIceServer
  // -- createIceServers
  // -- attachMediaStream
  // -- reattachMediaStream
  // -- webrtcDetectedBrowser
  // -- webrtcDetectedVersion

  // IE 9 is not offering an implementation of console.log until you open a console
  if (typeof console !== 'object' || typeof console.log !== 'function') {
    /* jshint -W020 */
    console = {} || console;
    // Implemented based on console specs from MDN
    // You may override these functions
    console.log = function (arg) {};
    console.info = function (arg) {};
    console.error = function (arg) {};
    console.dir = function (arg) {};
    console.exception = function (arg) {};
    console.trace = function (arg) {};
    console.warn = function (arg) {};
    console.count = function (arg) {};
    console.debug = function (arg) {};
    console.count = function (arg) {};
    console.time = function (arg) {};
    console.timeEnd = function (arg) {};
    console.group = function (arg) {};
    console.groupCollapsed = function (arg) {};
    console.groupEnd = function (arg) {};
    /* jshint +W020 */
  }
  AdapterJS.parseWebrtcDetectedBrowser();
  isIE = webrtcDetectedBrowser === 'IE';

  /* jshint -W035 */
  AdapterJS.WebRTCPlugin.WaitForPluginReady = function() {
    while (AdapterJS.WebRTCPlugin.pluginState !== AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY) {
      /* empty because it needs to prevent the function from running. */
    }
  };
  /* jshint +W035 */

  AdapterJS.WebRTCPlugin.callWhenPluginReady = function (callback) {
    if (AdapterJS.WebRTCPlugin.pluginState === AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY) {
      // Call immediately if possible
      // Once the plugin is set, the code will always take this path
      callback();
    } else {
      // otherwise start a 100ms interval
      var checkPluginReadyState = setInterval(function () {
        if (AdapterJS.WebRTCPlugin.pluginState === AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY) {
          clearInterval(checkPluginReadyState);
          callback();
        }
      }, 100);
    }
  };

  AdapterJS.WebRTCPlugin.setLogLevel = function(logLevel) {
    AdapterJS.WebRTCPlugin.callWhenPluginReady(function() {
      AdapterJS.WebRTCPlugin.plugin.setLogLevel(logLevel);
    });
  };

  AdapterJS.WebRTCPlugin.injectPlugin = function () {
    // only inject once the page is ready
    if (document.readyState !== 'complete') {
      return;
    }

    // Prevent multiple injections
    if (AdapterJS.WebRTCPlugin.pluginState !== AdapterJS.WebRTCPlugin.PLUGIN_STATES.INITIALIZING) {
      return;
    }

    AdapterJS.WebRTCPlugin.pluginState = AdapterJS.WebRTCPlugin.PLUGIN_STATES.INJECTING;

    if (webrtcDetectedBrowser === 'IE' && webrtcDetectedVersion <= 10) {
      var frag = document.createDocumentFragment();
      AdapterJS.WebRTCPlugin.plugin = document.createElement('div');
      AdapterJS.WebRTCPlugin.plugin.innerHTML = '<object id="' +
        AdapterJS.WebRTCPlugin.pluginInfo.pluginId + '" type="' +
        AdapterJS.WebRTCPlugin.pluginInfo.type + '" ' + 'width="1" height="1">' +
        '<param name="pluginId" value="' +
        AdapterJS.WebRTCPlugin.pluginInfo.pluginId + '" /> ' +
        '<param name="windowless" value="false" /> ' +
        '<param name="pageId" value="' + AdapterJS.WebRTCPlugin.pageId + '" /> ' +
        '<param name="onload" value="' + AdapterJS.WebRTCPlugin.pluginInfo.onload + '" />' +
        '<param name="tag" value="' + AdapterJS.WebRTCPlugin.TAGS.NONE + '" />' +
        // uncomment to be able to use virtual cams
        (AdapterJS.options.getAllCams ? '<param name="forceGetAllCams" value="True" />':'') +

        '</object>';
      while (AdapterJS.WebRTCPlugin.plugin.firstChild) {
        frag.appendChild(AdapterJS.WebRTCPlugin.plugin.firstChild);
      }
      document.body.appendChild(frag);

      // Need to re-fetch the plugin
      AdapterJS.WebRTCPlugin.plugin =
        document.getElementById(AdapterJS.WebRTCPlugin.pluginInfo.pluginId);
    } else {
      // Load Plugin
      AdapterJS.WebRTCPlugin.plugin = document.createElement('object');
      AdapterJS.WebRTCPlugin.plugin.id =
        AdapterJS.WebRTCPlugin.pluginInfo.pluginId;
      // IE will only start the plugin if it's ACTUALLY visible
      if (isIE) {
        AdapterJS.WebRTCPlugin.plugin.width = '1px';
        AdapterJS.WebRTCPlugin.plugin.height = '1px';
      } else { // The size of the plugin on Safari should be 0x0px
              // so that the autorisation prompt is at the top
        AdapterJS.WebRTCPlugin.plugin.width = '0px';
        AdapterJS.WebRTCPlugin.plugin.height = '0px';
      }
      AdapterJS.WebRTCPlugin.plugin.type = AdapterJS.WebRTCPlugin.pluginInfo.type;
      AdapterJS.WebRTCPlugin.plugin.innerHTML = '<param name="onload" value="' +
        AdapterJS.WebRTCPlugin.pluginInfo.onload + '">' +
        '<param name="pluginId" value="' +
        AdapterJS.WebRTCPlugin.pluginInfo.pluginId + '">' +
        '<param name="windowless" value="false" /> ' +
        (AdapterJS.options.getAllCams ? '<param name="forceGetAllCams" value="True" />':'') +
        '<param name="pageId" value="' + AdapterJS.WebRTCPlugin.pageId + '">' +
        '<param name="tag" value="' + AdapterJS.WebRTCPlugin.TAGS.NONE + '" />';
      document.body.appendChild(AdapterJS.WebRTCPlugin.plugin);
    }


    AdapterJS.WebRTCPlugin.pluginState = AdapterJS.WebRTCPlugin.PLUGIN_STATES.INJECTED;
  };

  AdapterJS.WebRTCPlugin.isPluginInstalled =
    function (comName, plugName, plugType, installedCb, notInstalledCb) {
    if (!isIE) {
      var pluginArray = navigator.mimeTypes;
      for (var i = 0; i < pluginArray.length; i++) {
        if (pluginArray[i].type.indexOf(plugType) >= 0) {
          installedCb();
          return;
        }
      }
      notInstalledCb();
    } else {
      try {
        var axo = new ActiveXObject(comName + '.' + plugName);
      } catch (e) {
        notInstalledCb();
        return;
      }
      installedCb();
    }
  };

  AdapterJS.WebRTCPlugin.defineWebRTCInterface = function () {
    if (AdapterJS.WebRTCPlugin.pluginState ===
        AdapterJS.WebRTCPlugin.PLUGIN_STATES.READY) {
      console.error('AdapterJS - WebRTC interface has already been defined');
      return;
    }

    AdapterJS.WebRTCPlugin.pluginState = AdapterJS.WebRTCPlugin.PLUGIN_STATES.INITIALIZING;

    AdapterJS.isDefined = function (variable) {
      return variable !== null && variable !== undefined;
    };

    createIceServer = function (url, username, password) {
      var iceServer = null;
      var urlParts = url.split(':');
      if (urlParts[0].indexOf('stun') === 0) {
        iceServer = {
          'url' : url,
          'hasCredentials' : false
        };
      } else if (urlParts[0].indexOf('turn') === 0) {
        iceServer = {
          'url' : url,
          'hasCredentials' : true,
          'credential' : password,
          'username' : username
        };
      }
      return iceServer;
    };

    createIceServers = function (urls, username, password) {
      var iceServers = [];
      for (var i = 0; i < urls.length; ++i) {
        iceServers.push(createIceServer(urls[i], username, password));
      }
      return iceServers;
    };

    RTCSessionDescription = function (info) {
      AdapterJS.WebRTCPlugin.WaitForPluginReady();
      return AdapterJS.WebRTCPlugin.plugin.
        ConstructSessionDescription(info.type, info.sdp);
    };

    MediaStream = function (mediaStreamOrTracks) {
      AdapterJS.WebRTCPlugin.WaitForPluginReady();
      return AdapterJS.WebRTCPlugin.plugin.MediaStream(mediaStreamOrTracks);
    }

    RTCPeerConnection = function (servers, constraints) {
      // Validate server argumenr
      if (!(servers === undefined ||
            servers === null ||
            Array.isArray(servers.iceServers))) {
        throw new Error('Failed to construct \'RTCPeerConnection\': Malformed RTCConfiguration');
      }

      // Validate constraints argument
      if (typeof constraints !== 'undefined' && constraints !== null) {
        var invalidConstraits = false;
        invalidConstraits |= typeof constraints !== 'object';
        invalidConstraits |= constraints.hasOwnProperty('mandatory') &&
                              constraints.mandatory !== undefined &&
                              constraints.mandatory !== null &&
                              constraints.mandatory.constructor !== Object;
        invalidConstraits |= constraints.hasOwnProperty('optional') &&
                              constraints.optional !== undefined &&
                              constraints.optional !== null &&
                              !Array.isArray(constraints.optional);
        if (invalidConstraits) {
          throw new Error('Failed to construct \'RTCPeerConnection\': Malformed constraints object');
        }
      }

      // Call relevant PeerConnection constructor according to plugin version
      AdapterJS.WebRTCPlugin.WaitForPluginReady();

      // RTCPeerConnection prototype from the old spec
      var iceServers = null;
      if (servers && Array.isArray(servers.iceServers)) {
        iceServers = servers.iceServers;
        for (var i = 0; i < iceServers.length; i++) {
          // Legacy plugin versions compatibility
          if (iceServers[i].urls && !iceServers[i].url) {
            iceServers[i].url = iceServers[i].urls;
          }
          iceServers[i].hasCredentials = AdapterJS.
            isDefined(iceServers[i].username) &&
            AdapterJS.isDefined(iceServers[i].credential);
        }
      }

      if (AdapterJS.WebRTCPlugin.plugin.PEER_CONNECTION_VERSION &&
          AdapterJS.WebRTCPlugin.plugin.PEER_CONNECTION_VERSION > 1) {
        // RTCPeerConnection prototype from the new spec
        if (iceServers) {
          servers.iceServers = iceServers;
        }
        return AdapterJS.WebRTCPlugin.plugin.PeerConnection(servers);
      } else {
        var mandatory = (constraints && constraints.mandatory) ?
          constraints.mandatory : null;
        var optional = (constraints && constraints.optional) ?
          constraints.optional : null;
        return AdapterJS.WebRTCPlugin.plugin.
          PeerConnection(AdapterJS.WebRTCPlugin.pageId,
          iceServers, mandatory, optional);
      }
    };

    MediaStreamTrack = function(){};
    MediaStreamTrack.getSources = function (callback) {
      AdapterJS.WebRTCPlugin.callWhenPluginReady(function() {
        AdapterJS.WebRTCPlugin.plugin.GetSources(callback);
      });
    };

    // getUserMedia constraints shim.
    // Copied from Chrome
    var constraintsToPlugin = function(c) {
      if (typeof c !== 'object' || c.mandatory || c.optional) {
        return c;
      }
      var cc = {};
      Object.keys(c).forEach(function(key) {
        if (key === 'require' || key === 'advanced') {
          return;
        }
        if (typeof c[key] === 'string') {
          cc[key] = c[key];
          return;
        }
        var r = (typeof c[key] === 'object') ? c[key] : {ideal: c[key]};
        if (r.exact !== undefined && typeof r.exact === 'number') {
          r.min = r.max = r.exact;
        }
        var oldname = function(prefix, name) {
          if (prefix) {
            return prefix + name.charAt(0).toUpperCase() + name.slice(1);
          }
          return (name === 'deviceId') ? 'sourceId' : name;
        };

        // HACK : Specially handling: if deviceId is an object with exact property,
        //          change it such that deviceId value is not in exact property
        // Reason : AJS-286 (deviceId in WebRTC samples not in the format specified as specifications)
        if ( oldname('', key) === 'sourceId' && r.exact !== undefined ) {
          r.ideal = r.exact;
          r.exact = undefined;
        }

        if (r.ideal !== undefined) {
          cc.optional = cc.optional || [];
          var oc = {};
          if (typeof r.ideal === 'number') {
            oc[oldname('min', key)] = r.ideal;
            cc.optional.push(oc);
            oc = {};
            oc[oldname('max', key)] = r.ideal;
            cc.optional.push(oc);
          } else {
            oc[oldname('', key)] = r.ideal;
            cc.optional.push(oc);
          }
        }
        if (r.exact !== undefined && typeof r.exact !== 'number') {
          cc.mandatory = cc.mandatory || {};
          cc.mandatory[oldname('', key)] = r.exact;
        } else {
          ['min', 'max'].forEach(function(mix) {
            if (r[mix] !== undefined) {
              cc.mandatory = cc.mandatory || {};
              cc.mandatory[oldname(mix, key)] = r[mix];
            }
          });
        }
      });
      if (c.advanced) {
        cc.optional = (cc.optional || []).concat(c.advanced);
      }
      return cc;
    };

    getUserMedia = function (constraints, successCallback, failureCallback) {
      var cc = {};
      cc.audio = constraints.audio ?
        constraintsToPlugin(constraints.audio) : false;
      cc.video = constraints.video ?
        constraintsToPlugin(constraints.video) : false;

      AdapterJS.WebRTCPlugin.callWhenPluginReady(function() {
        AdapterJS.WebRTCPlugin.plugin.
          getUserMedia(cc, successCallback, failureCallback);
      });
    };
    window.navigator.getUserMedia = getUserMedia;

    // Defined mediaDevices when promises are available
    if ( !navigator.mediaDevices &&
      typeof Promise !== 'undefined') {
      requestUserMedia = function(constraints) {
        return new Promise(function(resolve, reject) {
          try {
            getUserMedia(constraints, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };
      navigator.mediaDevices = {getUserMedia: requestUserMedia,
                                enumerateDevices: function() {
        return new Promise(function(resolve) {
          var kinds = {audio: 'audioinput', video: 'videoinput'};
          return MediaStreamTrack.getSources(function(devices) {
            resolve(devices.map(function(device) {
              return {label: device.label,
                      kind: kinds[device.kind],
                      id: device.id,
                      deviceId: device.id,
                      groupId: ''};
            }));
          });
        });
      }};
    }

    attachMediaStream = function (element, stream) {
      if (!element || !element.parentNode) {
        return;
      }

      var streamId;
      if (stream === null) {
        streamId = '';
      } else {
        if (typeof stream.enableSoundTracks !== 'undefined') {
          stream.enableSoundTracks(true);
        }
        streamId = stream.id;
      }

      var elementId = element.id.length === 0 ? Math.random().toString(36).slice(2) : element.id;
      var nodeName = element.nodeName.toLowerCase();
      if (nodeName !== 'object') { // not a plugin <object> tag yet
        var tag;
        switch(nodeName) {
          case 'audio':
            tag = AdapterJS.WebRTCPlugin.TAGS.AUDIO;
            break;
          case 'video':
            tag = AdapterJS.WebRTCPlugin.TAGS.VIDEO;
            break;
          default:
            tag = AdapterJS.WebRTCPlugin.TAGS.NONE;
          }

        var frag = document.createDocumentFragment();
        var temp = document.createElement('div');
        var classHTML = '';
        if (element.className) {
          classHTML = 'class="' + element.className + '" ';
        } else if (element.attributes && element.attributes['class']) {
          classHTML = 'class="' + element.attributes['class'].value + '" ';
        }

        temp.innerHTML = '<object id="' + elementId + '" ' + classHTML +
          'type="' + AdapterJS.WebRTCPlugin.pluginInfo.type + '">' +
          '<param name="pluginId" value="' + elementId + '" /> ' +
          '<param name="pageId" value="' + AdapterJS.WebRTCPlugin.pageId + '" /> ' +
          '<param name="windowless" value="true" /> ' +
          '<param name="streamId" value="' + streamId + '" /> ' +
          '<param name="tag" value="' + tag + '" /> ' +
          '</object>';
        while (temp.firstChild) {
          frag.appendChild(temp.firstChild);
        }

        var height = '';
        var width = '';
        if (element.clientWidth || element.clientHeight) {
          width = element.clientWidth;
          height = element.clientHeight;
        }
        else if (element.width || element.height) {
          width = element.width;
          height = element.height;
        }

        element.parentNode.insertBefore(frag, element);
        frag = document.getElementById(elementId);
        frag.width = width;
        frag.height = height;
        element.parentNode.removeChild(element);
      } else { // already an <object> tag, just change the stream id
        var children = element.children;
        for (var i = 0; i !== children.length; ++i) {
          if (children[i].name === 'streamId') {
            children[i].value = streamId;
            break;
          }
        }
        element.setStreamId(streamId);
      }
      var newElement = document.getElementById(elementId);
      AdapterJS.forwardEventHandlers(newElement, element, Object.getPrototypeOf(element));

      return newElement;
    };

    reattachMediaStream = function (to, from) {
      var stream = null;
      var children = from.children;
      for (var i = 0; i !== children.length; ++i) {
        if (children[i].name === 'streamId') {
          AdapterJS.WebRTCPlugin.WaitForPluginReady();
          stream = AdapterJS.WebRTCPlugin.plugin
            .getStreamWithId(AdapterJS.WebRTCPlugin.pageId, children[i].value);
          break;
        }
      }
      if (stream !== null) {
        return attachMediaStream(to, stream);
      } else {
        console.log('Could not find the stream associated with this element');
      }
    };

    // Propagate attachMediaStream and gUM in window and AdapterJS
    window.attachMediaStream      = attachMediaStream;
    window.reattachMediaStream    = reattachMediaStream;
    window.getUserMedia           = getUserMedia;
    AdapterJS.attachMediaStream   = attachMediaStream;
    AdapterJS.reattachMediaStream = reattachMediaStream;
    AdapterJS.getUserMedia        = getUserMedia;

    AdapterJS.forwardEventHandlers = function (destElem, srcElem, prototype) {
      var properties = Object.getOwnPropertyNames( prototype );
      for(var prop in properties) {
        if (prop) {
          var propName = properties[prop];

          if (typeof propName.slice === 'function' &&
              propName.slice(0,2) === 'on' &&
              typeof srcElem[propName] === 'function') {
              AdapterJS.addEvent(destElem, propName.slice(2), srcElem[propName]);
          }
        }
      }
      var subPrototype = Object.getPrototypeOf(prototype);
      if(!!subPrototype) {
        AdapterJS.forwardEventHandlers(destElem, srcElem, subPrototype);
      }
    };

    RTCIceCandidate = function (candidate) {
      if (!candidate.sdpMid) {
        candidate.sdpMid = '';
      }

      AdapterJS.WebRTCPlugin.WaitForPluginReady();
      return AdapterJS.WebRTCPlugin.plugin.ConstructIceCandidate(
        candidate.sdpMid, candidate.sdpMLineIndex, candidate.candidate
      );
    };

    // inject plugin
    AdapterJS.addEvent(document, 'readystatechange', AdapterJS.WebRTCPlugin.injectPlugin);
    AdapterJS.WebRTCPlugin.injectPlugin();
  };

  // This function will be called if the plugin is needed (browser different
  // from Chrome or Firefox), but the plugin is not installed.
  AdapterJS.WebRTCPlugin.pluginNeededButNotInstalledCb = AdapterJS.WebRTCPlugin.pluginNeededButNotInstalledCb ||
    function() {
      AdapterJS.addEvent(document,
                        'readystatechange',
                         AdapterJS.WebRTCPlugin.pluginNeededButNotInstalledCbPriv);
      AdapterJS.WebRTCPlugin.pluginNeededButNotInstalledCbPriv();
    };

  AdapterJS.WebRTCPlugin.pluginNeededButNotInstalledCbPriv = function () {
    if (AdapterJS.options.hidePluginInstallPrompt) {
      return;
    }

    var downloadLink = AdapterJS.WebRTCPlugin.pluginInfo.downloadLink;
    if(downloadLink) { // if download link
      var popupString;
      if (AdapterJS.WebRTCPlugin.pluginInfo.portalLink) { // is portal link
       popupString = 'This website requires you to install the ' +
        ' <a href="' + AdapterJS.WebRTCPlugin.pluginInfo.portalLink +
        '" target="_blank">' + AdapterJS.WebRTCPlugin.pluginInfo.companyName +
        ' WebRTC Plugin</a>' +
        ' to work on this browser.';
      } else { // no portal link, just print a generic explanation
       popupString = AdapterJS.TEXT.PLUGIN.REQUIRE_INSTALLATION;
      }

      AdapterJS.renderNotificationBar(popupString, AdapterJS.TEXT.PLUGIN.BUTTON, function () {
        window.open(downloadLink, '_top');

        var pluginInstallInterval = setInterval(function(){
          if(! isIE) {
            navigator.plugins.refresh(false);
          }
          AdapterJS.WebRTCPlugin.isPluginInstalled(
            AdapterJS.WebRTCPlugin.pluginInfo.prefix,
            AdapterJS.WebRTCPlugin.pluginInfo.plugName,
            AdapterJS.WebRTCPlugin.pluginInfo.type,
            function() { // plugin now installed
              clearInterval(pluginInstallInterval);
              AdapterJS.WebRTCPlugin.defineWebRTCInterface();
            },
            function() {
              // still no plugin detected, nothing to do
            });
        } , 500);
      });
    } else { // no download link, just print a generic explanation
      AdapterJS.renderNotificationBar(AdapterJS.TEXT.PLUGIN.NOT_SUPPORTED);
    }
  };


  // Try to detect the plugin and act accordingly
  AdapterJS.WebRTCPlugin.isPluginInstalled(
    AdapterJS.WebRTCPlugin.pluginInfo.prefix,
    AdapterJS.WebRTCPlugin.pluginInfo.plugName,
    AdapterJS.WebRTCPlugin.pluginInfo.type,
    AdapterJS.WebRTCPlugin.defineWebRTCInterface,
    AdapterJS.WebRTCPlugin.pluginNeededButNotInstalledCb);

  // END OF WEBRTC PLUGIN SHIM
  ///////////////////////////////////////////////////////////////////
}

// Placed it here so that the module.exports from the browserified
//   adapterjs will not override our AdapterJS exports
// Browserify compatibility
if(typeof exports !== 'undefined') {
  module.exports = AdapterJS;
}

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Flashphoner = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (process,global){(function (){
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.0.5
 */
(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.ES6Promise = factory();
})(this, function () {
  'use strict';

  function objectOrFunction(x) {
    return typeof x === 'function' || _typeof(x) === 'object' && x !== null;
  }

  function isFunction(x) {
    return typeof x === 'function';
  }

  var _isArray = undefined;

  if (!Array.isArray) {
    _isArray = function _isArray(x) {
      return Object.prototype.toString.call(x) === '[object Array]';
    };
  } else {
    _isArray = Array.isArray;
  }

  var isArray = _isArray;
  var len = 0;
  var vertxNext = undefined;
  var customSchedulerFn = undefined;

  var asap = function asap(callback, arg) {
    queue[len] = callback;
    queue[len + 1] = arg;
    len += 2;

    if (len === 2) {
      // If len is 2, that means that we need to schedule an async flush.
      // If additional callbacks are queued before the queue is flushed, they
      // will be processed by this flush that we are scheduling.
      if (customSchedulerFn) {
        customSchedulerFn(flush);
      } else {
        scheduleFlush();
      }
    }
  };

  function setScheduler(scheduleFn) {
    customSchedulerFn = scheduleFn;
  }

  function setAsap(asapFn) {
    asap = asapFn;
  }

  var browserWindow = typeof window !== 'undefined' ? window : undefined;
  var browserGlobal = browserWindow || {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]'; // test for web worker but not in IE10

  var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined'; // node

  function useNextTick() {
    // node version 0.10.x displays a deprecation warning when nextTick is used recursively
    // see https://github.com/cujojs/when/issues/410 for details
    return function () {
      return process.nextTick(flush);
    };
  } // vertx


  function useVertxTimer() {
    if (typeof vertxNext !== 'undefined') {
      return function () {
        vertxNext(flush);
      };
    }

    return useSetTimeout();
  }

  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, {
      characterData: true
    });
    return function () {
      node.data = iterations = ++iterations % 2;
    };
  } // web worker


  function useMessageChannel() {
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    return function () {
      return channel.port2.postMessage(0);
    };
  }

  function useSetTimeout() {
    // Store setTimeout reference so es6-promise will be unaffected by
    // other code modifying setTimeout (like sinon.useFakeTimers())
    var globalSetTimeout = setTimeout;
    return function () {
      return globalSetTimeout(flush, 1);
    };
  }

  var queue = new Array(1000);

  function flush() {
    for (var i = 0; i < len; i += 2) {
      var callback = queue[i];
      var arg = queue[i + 1];
      callback(arg);
      queue[i] = undefined;
      queue[i + 1] = undefined;
    }

    len = 0;
  }

  function attemptVertx() {
    try {
      var r = require;
      var vertx = r('vertx');
      vertxNext = vertx.runOnLoop || vertx.runOnContext;
      return useVertxTimer();
    } catch (e) {
      return useSetTimeout();
    }
  }

  var scheduleFlush = undefined; // Decide what async method to use to triggering processing of queued callbacks:

  if (isNode) {
    scheduleFlush = useNextTick();
  } else if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else if (isWorker) {
    scheduleFlush = useMessageChannel();
  } else if (browserWindow === undefined && typeof require === 'function') {
    scheduleFlush = attemptVertx();
  } else {
    scheduleFlush = useSetTimeout();
  }

  function then(onFulfillment, onRejection) {
    var _arguments = arguments;
    var parent = this;
    var child = new this.constructor(noop);

    if (child[PROMISE_ID] === undefined) {
      makePromise(child);
    }

    var _state = parent._state;

    if (_state) {
      (function () {
        var callback = _arguments[_state - 1];
        asap(function () {
          return invokeCallback(_state, child, callback, parent._result);
        });
      })();
    } else {
      subscribe(parent, child, onFulfillment, onRejection);
    }

    return child;
  }
  /**
    `Promise.resolve` returns a promise that will become resolved with the
    passed `value`. It is shorthand for the following:
  
    ```javascript
    let promise = new Promise(function(resolve, reject){
      resolve(1);
    });
  
    promise.then(function(value){
      // value === 1
    });
    ```
  
    Instead of writing the above, your code now simply becomes the following:
  
    ```javascript
    let promise = Promise.resolve(1);
  
    promise.then(function(value){
      // value === 1
    });
    ```
  
    @method resolve
    @static
    @param {Any} value value that the returned promise will be resolved with
    Useful for tooling.
    @return {Promise} a promise that will become fulfilled with the given
    `value`
  */


  function resolve(object) {
    /*jshint validthis:true */
    var Constructor = this;

    if (object && _typeof(object) === 'object' && object.constructor === Constructor) {
      return object;
    }

    var promise = new Constructor(noop);

    _resolve(promise, object);

    return promise;
  }

  var PROMISE_ID = Math.random().toString(36).substring(16);

  function noop() {}

  var PENDING = void 0;
  var FULFILLED = 1;
  var REJECTED = 2;
  var GET_THEN_ERROR = new ErrorObject();

  function selfFulfillment() {
    return new TypeError("You cannot resolve a promise with itself");
  }

  function cannotReturnOwn() {
    return new TypeError('A promises callback cannot return that same promise.');
  }

  function getThen(promise) {
    try {
      return promise.then;
    } catch (error) {
      GET_THEN_ERROR.error = error;
      return GET_THEN_ERROR;
    }
  }

  function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
    try {
      then.call(value, fulfillmentHandler, rejectionHandler);
    } catch (e) {
      return e;
    }
  }

  function handleForeignThenable(promise, thenable, then) {
    asap(function (promise) {
      var sealed = false;
      var error = tryThen(then, thenable, function (value) {
        if (sealed) {
          return;
        }

        sealed = true;

        if (thenable !== value) {
          _resolve(promise, value);
        } else {
          fulfill(promise, value);
        }
      }, function (reason) {
        if (sealed) {
          return;
        }

        sealed = true;

        _reject(promise, reason);
      }, 'Settle: ' + (promise._label || ' unknown promise'));

      if (!sealed && error) {
        sealed = true;

        _reject(promise, error);
      }
    }, promise);
  }

  function handleOwnThenable(promise, thenable) {
    if (thenable._state === FULFILLED) {
      fulfill(promise, thenable._result);
    } else if (thenable._state === REJECTED) {
      _reject(promise, thenable._result);
    } else {
      subscribe(thenable, undefined, function (value) {
        return _resolve(promise, value);
      }, function (reason) {
        return _reject(promise, reason);
      });
    }
  }

  function handleMaybeThenable(promise, maybeThenable, then$$) {
    if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
      handleOwnThenable(promise, maybeThenable);
    } else {
      if (then$$ === GET_THEN_ERROR) {
        _reject(promise, GET_THEN_ERROR.error);
      } else if (then$$ === undefined) {
        fulfill(promise, maybeThenable);
      } else if (isFunction(then$$)) {
        handleForeignThenable(promise, maybeThenable, then$$);
      } else {
        fulfill(promise, maybeThenable);
      }
    }
  }

  function _resolve(promise, value) {
    if (promise === value) {
      _reject(promise, selfFulfillment());
    } else if (objectOrFunction(value)) {
      handleMaybeThenable(promise, value, getThen(value));
    } else {
      fulfill(promise, value);
    }
  }

  function publishRejection(promise) {
    if (promise._onerror) {
      promise._onerror(promise._result);
    }

    publish(promise);
  }

  function fulfill(promise, value) {
    if (promise._state !== PENDING) {
      return;
    }

    promise._result = value;
    promise._state = FULFILLED;

    if (promise._subscribers.length !== 0) {
      asap(publish, promise);
    }
  }

  function _reject(promise, reason) {
    if (promise._state !== PENDING) {
      return;
    }

    promise._state = REJECTED;
    promise._result = reason;
    asap(publishRejection, promise);
  }

  function subscribe(parent, child, onFulfillment, onRejection) {
    var _subscribers = parent._subscribers;
    var length = _subscribers.length;
    parent._onerror = null;
    _subscribers[length] = child;
    _subscribers[length + FULFILLED] = onFulfillment;
    _subscribers[length + REJECTED] = onRejection;

    if (length === 0 && parent._state) {
      asap(publish, parent);
    }
  }

  function publish(promise) {
    var subscribers = promise._subscribers;
    var settled = promise._state;

    if (subscribers.length === 0) {
      return;
    }

    var child = undefined,
        callback = undefined,
        detail = promise._result;

    for (var i = 0; i < subscribers.length; i += 3) {
      child = subscribers[i];
      callback = subscribers[i + settled];

      if (child) {
        invokeCallback(settled, child, callback, detail);
      } else {
        callback(detail);
      }
    }

    promise._subscribers.length = 0;
  }

  function ErrorObject() {
    this.error = null;
  }

  var TRY_CATCH_ERROR = new ErrorObject();

  function tryCatch(callback, detail) {
    try {
      return callback(detail);
    } catch (e) {
      TRY_CATCH_ERROR.error = e;
      return TRY_CATCH_ERROR;
    }
  }

  function invokeCallback(settled, promise, callback, detail) {
    var hasCallback = isFunction(callback),
        value = undefined,
        error = undefined,
        succeeded = undefined,
        failed = undefined;

    if (hasCallback) {
      value = tryCatch(callback, detail);

      if (value === TRY_CATCH_ERROR) {
        failed = true;
        error = value.error;
        value = null;
      } else {
        succeeded = true;
      }

      if (promise === value) {
        _reject(promise, cannotReturnOwn());

        return;
      }
    } else {
      value = detail;
      succeeded = true;
    }

    if (promise._state !== PENDING) {// noop
    } else if (hasCallback && succeeded) {
      _resolve(promise, value);
    } else if (failed) {
      _reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      _reject(promise, value);
    }
  }

  function initializePromise(promise, resolver) {
    try {
      resolver(function resolvePromise(value) {
        _resolve(promise, value);
      }, function rejectPromise(reason) {
        _reject(promise, reason);
      });
    } catch (e) {
      _reject(promise, e);
    }
  }

  var id = 0;

  function nextId() {
    return id++;
  }

  function makePromise(promise) {
    promise[PROMISE_ID] = id++;
    promise._state = undefined;
    promise._result = undefined;
    promise._subscribers = [];
  }

  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this._input = input;
      this.length = input.length;
      this._remaining = input.length;
      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;

        this._enumerate();

        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      _reject(this.promise, validationError());
    }
  }

  function validationError() {
    return new Error('Array Methods must be provided an Array');
  }

  ;

  Enumerator.prototype._enumerate = function () {
    var length = this.length;
    var _input = this._input;

    for (var i = 0; this._state === PENDING && i < length; i++) {
      this._eachEntry(_input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function (entry, i) {
    var c = this._instanceConstructor;
    var resolve$$ = c.resolve;

    if (resolve$$ === resolve) {
      var _then = getThen(entry);

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise) {
        var promise = new c(noop);
        handleMaybeThenable(promise, entry, _then);

        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$) {
          return resolve$$(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function (state, i, value) {
    var promise = this.promise;

    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        _reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function (promise, i) {
    var enumerator = this;
    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };
  /**
    `Promise.all` accepts an array of promises, and returns a new promise which
    is fulfilled with an array of fulfillment values for the passed promises, or
    rejected with the reason of the first passed promise to be rejected. It casts all
    elements of the passed iterable to promises as it runs this algorithm.
  
    Example:
  
    ```javascript
    let promise1 = resolve(1);
    let promise2 = resolve(2);
    let promise3 = resolve(3);
    let promises = [ promise1, promise2, promise3 ];
  
    Promise.all(promises).then(function(array){
      // The array here would be [ 1, 2, 3 ];
    });
    ```
  
    If any of the `promises` given to `all` are rejected, the first promise
    that is rejected will be given as an argument to the returned promises's
    rejection handler. For example:
  
    Example:
  
    ```javascript
    let promise1 = resolve(1);
    let promise2 = reject(new Error("2"));
    let promise3 = reject(new Error("3"));
    let promises = [ promise1, promise2, promise3 ];
  
    Promise.all(promises).then(function(array){
      // Code here never runs because there are rejected promises!
    }, function(error) {
      // error.message === "2"
    });
    ```
  
    @method all
    @static
    @param {Array} entries array of promises
    @param {String} label optional string for labeling the promise.
    Useful for tooling.
    @return {Promise} promise that is fulfilled when all `promises` have been
    fulfilled, or rejected if any of them become rejected.
    @static
  */


  function all(entries) {
    return new Enumerator(this, entries).promise;
  }
  /**
    `Promise.race` returns a new promise which is settled in the same way as the
    first passed promise to settle.
  
    Example:
  
    ```javascript
    let promise1 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 1');
      }, 200);
    });
  
    let promise2 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 2');
      }, 100);
    });
  
    Promise.race([promise1, promise2]).then(function(result){
      // result === 'promise 2' because it was resolved before promise1
      // was resolved.
    });
    ```
  
    `Promise.race` is deterministic in that only the state of the first
    settled promise matters. For example, even if other promises given to the
    `promises` array argument are resolved, but the first settled promise has
    become rejected before the other promises became fulfilled, the returned
    promise will become rejected:
  
    ```javascript
    let promise1 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 1');
      }, 200);
    });
  
    let promise2 = new Promise(function(resolve, reject){
      setTimeout(function(){
        reject(new Error('promise 2'));
      }, 100);
    });
  
    Promise.race([promise1, promise2]).then(function(result){
      // Code here never runs
    }, function(reason){
      // reason.message === 'promise 2' because promise 2 became rejected before
      // promise 1 became fulfilled
    });
    ```
  
    An example real-world use case is implementing timeouts:
  
    ```javascript
    Promise.race([ajax('foo.json'), timeout(5000)])
    ```
  
    @method race
    @static
    @param {Array} promises array of promises to observe
    Useful for tooling.
    @return {Promise} a promise which settles in the same way as the first passed
    promise to settle.
  */


  function race(entries) {
    /*jshint validthis:true */
    var Constructor = this;

    if (!isArray(entries)) {
      return new Constructor(function (_, reject) {
        return reject(new TypeError('You must pass an array to race.'));
      });
    } else {
      return new Constructor(function (resolve, reject) {
        var length = entries.length;

        for (var i = 0; i < length; i++) {
          Constructor.resolve(entries[i]).then(resolve, reject);
        }
      });
    }
  }
  /**
    `Promise.reject` returns a promise rejected with the passed `reason`.
    It is shorthand for the following:
  
    ```javascript
    let promise = new Promise(function(resolve, reject){
      reject(new Error('WHOOPS'));
    });
  
    promise.then(function(value){
      // Code here doesn't run because the promise is rejected!
    }, function(reason){
      // reason.message === 'WHOOPS'
    });
    ```
  
    Instead of writing the above, your code now simply becomes the following:
  
    ```javascript
    let promise = Promise.reject(new Error('WHOOPS'));
  
    promise.then(function(value){
      // Code here doesn't run because the promise is rejected!
    }, function(reason){
      // reason.message === 'WHOOPS'
    });
    ```
  
    @method reject
    @static
    @param {Any} reason value that the returned promise will be rejected with.
    Useful for tooling.
    @return {Promise} a promise rejected with the given `reason`.
  */


  function reject(reason) {
    /*jshint validthis:true */
    var Constructor = this;
    var promise = new Constructor(noop);

    _reject(promise, reason);

    return promise;
  }

  function needsResolver() {
    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
  }

  function needsNew() {
    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
  }
  /**
    Promise objects represent the eventual result of an asynchronous operation. The
    primary way of interacting with a promise is through its `then` method, which
    registers callbacks to receive either a promise's eventual value or the reason
    why the promise cannot be fulfilled.
  
    Terminology
    -----------
  
    - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
    - `thenable` is an object or function that defines a `then` method.
    - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
    - `exception` is a value that is thrown using the throw statement.
    - `reason` is a value that indicates why a promise was rejected.
    - `settled` the final resting state of a promise, fulfilled or rejected.
  
    A promise can be in one of three states: pending, fulfilled, or rejected.
  
    Promises that are fulfilled have a fulfillment value and are in the fulfilled
    state.  Promises that are rejected have a rejection reason and are in the
    rejected state.  A fulfillment value is never a thenable.
  
    Promises can also be said to *resolve* a value.  If this value is also a
    promise, then the original promise's settled state will match the value's
    settled state.  So a promise that *resolves* a promise that rejects will
    itself reject, and a promise that *resolves* a promise that fulfills will
    itself fulfill.
  
  
    Basic Usage:
    ------------
  
    ```js
    let promise = new Promise(function(resolve, reject) {
      // on success
      resolve(value);
  
      // on failure
      reject(reason);
    });
  
    promise.then(function(value) {
      // on fulfillment
    }, function(reason) {
      // on rejection
    });
    ```
  
    Advanced Usage:
    ---------------
  
    Promises shine when abstracting away asynchronous interactions such as
    `XMLHttpRequest`s.
  
    ```js
    function getJSON(url) {
      return new Promise(function(resolve, reject){
        let xhr = new XMLHttpRequest();
  
        xhr.open('GET', url);
        xhr.onreadystatechange = handler;
        xhr.responseType = 'json';
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send();
  
        function handler() {
          if (this.readyState === this.DONE) {
            if (this.status === 200) {
              resolve(this.response);
            } else {
              reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
            }
          }
        };
      });
    }
  
    getJSON('/posts.json').then(function(json) {
      // on fulfillment
    }, function(reason) {
      // on rejection
    });
    ```
  
    Unlike callbacks, promises are great composable primitives.
  
    ```js
    Promise.all([
      getJSON('/posts'),
      getJSON('/comments')
    ]).then(function(values){
      values[0] // => postsJSON
      values[1] // => commentsJSON
  
      return values;
    });
    ```
  
    @class Promise
    @param {function} resolver
    Useful for tooling.
    @constructor
  */


  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  Promise.all = all;
  Promise.race = race;
  Promise.resolve = resolve;
  Promise.reject = reject;
  Promise._setScheduler = setScheduler;
  Promise._setAsap = setAsap;
  Promise._asap = asap;
  Promise.prototype = {
    constructor: Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.
    
      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```
    
      Chaining
      --------
    
      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.
    
      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });
    
      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
    
      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```
    
      Assimilation
      ------------
    
      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.
    
      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```
    
      If the assimliated promise rejects, then the downstream promise will also reject.
    
      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```
    
      Simple Example
      --------------
    
      Synchronous Example
    
      ```javascript
      let result;
    
      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```
    
      Errback Example
    
      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```
    
      Promise Example;
    
      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```
    
      Advanced Example
      --------------
    
      Synchronous Example
    
      ```javascript
      let author, books;
    
      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```
    
      Errback Example
    
      ```js
    
      function foundBooks(books) {
    
      }
    
      function failure(reason) {
    
      }
    
      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```
    
      Promise Example;
    
      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```
    
      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
    then: then,

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.
    
      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }
    
      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }
    
      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```
    
      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
    'catch': function _catch(onRejection) {
      return this.then(null, onRejection);
    }
  };

  function polyfill() {
    var local = undefined;

    if (typeof global !== 'undefined') {
      local = global;
    } else if (typeof self !== 'undefined') {
      local = self;
    } else {
      try {
        local = Function('return this')();
      } catch (e) {
        throw new Error('polyfill failed because global object is unavailable in this environment');
      }
    }

    var P = local.Promise;

    if (P) {
      var promiseToString = null;

      try {
        promiseToString = Object.prototype.toString.call(P.resolve());
      } catch (e) {// silently ignored
      }

      if (promiseToString === '[object Promise]' && !P.cast) {
        return;
      }
    }

    local.Promise = Promise;
  } // Strange compat..


  Promise.polyfill = polyfill;
  Promise.Promise = Promise;
  return Promise;
});

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":4}],3:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
/**
* KalmanFilter
* @class
* @author Wouter Bulten
* @see {@link http://github.com/wouterbulten/kalmanjs}
* @version Version: 1.0.0-beta
* @copyright Copyright 2015-2018 Wouter Bulten
* @license MIT License
* @preserve
*/


var KalmanFilter = /*#__PURE__*/function () {
  /**
  * Create 1-dimensional kalman filter
  * @param  {Number} options.R Process noise
  * @param  {Number} options.Q Measurement noise
  * @param  {Number} options.A State vector
  * @param  {Number} options.B Control vector
  * @param  {Number} options.C Measurement vector
  * @return {KalmanFilter}
  */
  function KalmanFilter() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$R = _ref.R,
        R = _ref$R === void 0 ? 1 : _ref$R,
        _ref$Q = _ref.Q,
        Q = _ref$Q === void 0 ? 1 : _ref$Q,
        _ref$A = _ref.A,
        A = _ref$A === void 0 ? 1 : _ref$A,
        _ref$B = _ref.B,
        B = _ref$B === void 0 ? 0 : _ref$B,
        _ref$C = _ref.C,
        C = _ref$C === void 0 ? 1 : _ref$C;

    _classCallCheck(this, KalmanFilter);

    this.R = R; // noise power desirable

    this.Q = Q; // noise power estimated

    this.A = A;
    this.C = C;
    this.B = B;
    this.cov = NaN;
    this.x = NaN; // estimated signal without noise
  }
  /**
  * Filter a new value
  * @param  {Number} z Measurement
  * @param  {Number} u Control
  * @return {Number}
  */


  _createClass(KalmanFilter, [{
    key: "filter",
    value: function filter(z) {
      var u = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (isNaN(this.x)) {
        this.x = 1 / this.C * z;
        this.cov = 1 / this.C * this.Q * (1 / this.C);
      } else {
        // Compute prediction
        var predX = this.predict(u);
        var predCov = this.uncertainty(); // Kalman gain

        var K = predCov * this.C * (1 / (this.C * predCov * this.C + this.Q)); // Correction

        this.x = predX + K * (z - this.C * predX);
        this.cov = predCov - K * this.C * predCov;
      }

      return this.x;
    }
    /**
    * Predict next value
    * @param  {Number} [u] Control
    * @return {Number}
    */

  }, {
    key: "predict",
    value: function predict() {
      var u = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return this.A * this.x + this.B * u;
    }
    /**
    * Return uncertainty of filter
    * @return {Number}
    */

  }, {
    key: "uncertainty",
    value: function uncertainty() {
      return this.A * this.cov * this.A + this.R;
    }
    /**
    * Return the last filtered measurement
    * @return {Number}
    */

  }, {
    key: "lastMeasurement",
    value: function lastMeasurement() {
      return this.x;
    }
    /**
    * Set measurement noise Q
    * @param {Number} noise
    */

  }, {
    key: "setMeasurementNoise",
    value: function setMeasurementNoise(noise) {
      this.Q = noise;
    }
    /**
    * Set the process noise R
    * @param {Number} noise
    */

  }, {
    key: "setProcessNoise",
    value: function setProcessNoise(noise) {
      this.R = noise;
    }
  }]);

  return KalmanFilter;
}();

module.exports = KalmanFilter;

},{}],4:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};

},{}],5:[function(require,module,exports){
(function (setImmediate){(function (){
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (root) {
  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function noop() {} // Polyfill for Function.prototype.bind


  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }

  function Promise(fn) {
    if (!(this instanceof Promise)) throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    this._state = 0;
    this._handled = false;
    this._value = undefined;
    this._deferreds = [];
    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }

    if (self._state === 0) {
      self._deferreds.push(deferred);

      return;
    }

    self._handled = true;

    Promise._immediateFn(function () {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;

      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }

      var ret;

      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }

      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');

      if (newValue && (_typeof(newValue) === 'object' || typeof newValue === 'function')) {
        var then = newValue.then;

        if (newValue instanceof Promise) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }

      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise._immediateFn(function () {
        if (!self._handled) {
          Promise._unhandledRejectionFn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }

    self._deferreds = null;
  }

  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }
  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */


  function doResolve(fn, self) {
    var done = false;

    try {
      fn(function (value) {
        if (done) return;
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }

  Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };

  Promise.prototype.then = function (onFulfilled, onRejected) {
    var prom = new this.constructor(noop);
    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise.all = function (arr) {
    return new Promise(function (resolve, reject) {
      if (!arr || typeof arr.length === 'undefined') throw new TypeError('Promise.all accepts an array');
      var args = Array.prototype.slice.call(arr);
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (_typeof(val) === 'object' || typeof val === 'function')) {
            var then = val.then;

            if (typeof then === 'function') {
              then.call(val, function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }

          args[i] = val;

          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise.resolve = function (value) {
    if (value && _typeof(value) === 'object' && value.constructor === Promise) {
      return value;
    }

    return new Promise(function (resolve) {
      resolve(value);
    });
  };

  Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
      reject(value);
    });
  };

  Promise.race = function (values) {
    return new Promise(function (resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  }; // Use polyfill for setImmediate for performance gains


  Promise._immediateFn = typeof setImmediate === 'function' && function (fn) {
    setImmediate(fn);
  } || function (fn) {
    setTimeoutFunc(fn, 0);
  };

  Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };
  /**
   * Set the immediate function to execute callbacks
   * @param fn {function} Function to execute
   * @deprecated
   */


  Promise._setImmediateFn = function _setImmediateFn(fn) {
    Promise._immediateFn = fn;
  };
  /**
   * Change the function to execute on unhandled rejection
   * @param {function} fn Function to execute on unhandled rejection
   * @deprecated
   */


  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
    Promise._unhandledRejectionFn = fn;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Promise;
  } else if (!root.Promise) {
    root.Promise = Promise;
  }
})(this);

}).call(this)}).call(this,require("timers").setImmediate)
},{"timers":9}],6:[function(require,module,exports){
/*
 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

var SDPUtils = require('sdp');

function fixStatsType(stat) {
  return {
    inboundrtp: 'inbound-rtp',
    outboundrtp: 'outbound-rtp',
    candidatepair: 'candidate-pair',
    localcandidate: 'local-candidate',
    remotecandidate: 'remote-candidate'
  }[stat.type] || stat.type;
}

function writeMediaSection(transceiver, caps, type, stream, dtlsRole) {
  var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps); // Map ICE parameters (ufrag, pwd) to SDP.

  sdp += SDPUtils.writeIceParameters(transceiver.iceGatherer.getLocalParameters()); // Map DTLS parameters to SDP.

  sdp += SDPUtils.writeDtlsParameters(transceiver.dtlsTransport.getLocalParameters(), type === 'offer' ? 'actpass' : dtlsRole || 'active');
  sdp += 'a=mid:' + transceiver.mid + '\r\n';

  if (transceiver.rtpSender && transceiver.rtpReceiver) {
    sdp += 'a=sendrecv\r\n';
  } else if (transceiver.rtpSender) {
    sdp += 'a=sendonly\r\n';
  } else if (transceiver.rtpReceiver) {
    sdp += 'a=recvonly\r\n';
  } else {
    sdp += 'a=inactive\r\n';
  }

  if (transceiver.rtpSender) {
    var trackId = transceiver.rtpSender._initialTrackId || transceiver.rtpSender.track.id;
    transceiver.rtpSender._initialTrackId = trackId; // spec.

    var msid = 'msid:' + (stream ? stream.id : '-') + ' ' + trackId + '\r\n';
    sdp += 'a=' + msid; // for Chrome. Legacy should no longer be required.

    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc + ' ' + msid; // RTX

    if (transceiver.sendEncodingParameters[0].rtx) {
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc + ' ' + msid;
      sdp += 'a=ssrc-group:FID ' + transceiver.sendEncodingParameters[0].ssrc + ' ' + transceiver.sendEncodingParameters[0].rtx.ssrc + '\r\n';
    }
  } // FIXME: this should be written by writeRtpDescription.


  sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc + ' cname:' + SDPUtils.localCName + '\r\n';

  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc + ' cname:' + SDPUtils.localCName + '\r\n';
  }

  return sdp;
} // Edge does not like
// 1) stun: filtered after 14393 unless ?transport=udp is present
// 2) turn: that does not have all of turn:host:port?transport=udp
// 3) turn: with ipv6 addresses
// 4) turn: occurring muliple times


function filterIceServers(iceServers, edgeVersion) {
  var hasTurn = false;
  iceServers = JSON.parse(JSON.stringify(iceServers));
  return iceServers.filter(function (server) {
    if (server && (server.urls || server.url)) {
      var urls = server.urls || server.url;

      if (server.url && !server.urls) {
        console.warn('RTCIceServer.url is deprecated! Use urls instead.');
      }

      var isString = typeof urls === 'string';

      if (isString) {
        urls = [urls];
      }

      urls = urls.filter(function (url) {
        var validTurn = url.indexOf('turn:') === 0 && url.indexOf('transport=udp') !== -1 && url.indexOf('turn:[') === -1 && !hasTurn;

        if (validTurn) {
          hasTurn = true;
          return true;
        }

        return url.indexOf('stun:') === 0 && edgeVersion >= 14393 && url.indexOf('?transport=udp') === -1;
      });
      delete server.url;
      server.urls = isString ? urls[0] : urls;
      return !!urls.length;
    }
  });
} // Determines the intersection of local and remote capabilities.


function getCommonCapabilities(localCapabilities, remoteCapabilities) {
  var commonCapabilities = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: []
  };

  var findCodecByPayloadType = function findCodecByPayloadType(pt, codecs) {
    pt = parseInt(pt, 10);

    for (var i = 0; i < codecs.length; i++) {
      if (codecs[i].payloadType === pt || codecs[i].preferredPayloadType === pt) {
        return codecs[i];
      }
    }
  };

  var rtxCapabilityMatches = function rtxCapabilityMatches(lRtx, rRtx, lCodecs, rCodecs) {
    var lCodec = findCodecByPayloadType(lRtx.parameters.apt, lCodecs);
    var rCodec = findCodecByPayloadType(rRtx.parameters.apt, rCodecs);
    return lCodec && rCodec && lCodec.name.toLowerCase() === rCodec.name.toLowerCase();
  };

  localCapabilities.codecs.forEach(function (lCodec) {
    for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
      var rCodec = remoteCapabilities.codecs[i];

      if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() && lCodec.clockRate === rCodec.clockRate) {
        if (lCodec.name.toLowerCase() === 'rtx' && lCodec.parameters && rCodec.parameters.apt) {
          // for RTX we need to find the local rtx that has a apt
          // which points to the same local codec as the remote one.
          if (!rtxCapabilityMatches(lCodec, rCodec, localCapabilities.codecs, remoteCapabilities.codecs)) {
            continue;
          }
        }

        rCodec = JSON.parse(JSON.stringify(rCodec)); // deepcopy
        // number of channels is the highest common number of channels

        rCodec.numChannels = Math.min(lCodec.numChannels, rCodec.numChannels); // push rCodec so we reply with offerer payload type

        commonCapabilities.codecs.push(rCodec); // determine common feedback mechanisms

        rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function (fb) {
          for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
            if (lCodec.rtcpFeedback[j].type === fb.type && lCodec.rtcpFeedback[j].parameter === fb.parameter) {
              return true;
            }
          }

          return false;
        }); // FIXME: also need to determine .parameters
        //  see https://github.com/openpeer/ortc/issues/569

        break;
      }
    }
  });
  localCapabilities.headerExtensions.forEach(function (lHeaderExtension) {
    for (var i = 0; i < remoteCapabilities.headerExtensions.length; i++) {
      var rHeaderExtension = remoteCapabilities.headerExtensions[i];

      if (lHeaderExtension.uri === rHeaderExtension.uri) {
        commonCapabilities.headerExtensions.push(rHeaderExtension);
        break;
      }
    }
  }); // FIXME: fecMechanisms

  return commonCapabilities;
} // is action=setLocalDescription with type allowed in signalingState


function isActionAllowedInSignalingState(action, type, signalingState) {
  return {
    offer: {
      setLocalDescription: ['stable', 'have-local-offer'],
      setRemoteDescription: ['stable', 'have-remote-offer']
    },
    answer: {
      setLocalDescription: ['have-remote-offer', 'have-local-pranswer'],
      setRemoteDescription: ['have-local-offer', 'have-remote-pranswer']
    }
  }[type][action].indexOf(signalingState) !== -1;
}

function maybeAddCandidate(iceTransport, candidate) {
  // Edge's internal representation adds some fields therefore
  // not all fieldѕ are taken into account.
  var alreadyAdded = iceTransport.getRemoteCandidates().find(function (remoteCandidate) {
    return candidate.foundation === remoteCandidate.foundation && candidate.ip === remoteCandidate.ip && candidate.port === remoteCandidate.port && candidate.priority === remoteCandidate.priority && candidate.protocol === remoteCandidate.protocol && candidate.type === remoteCandidate.type;
  });

  if (!alreadyAdded) {
    iceTransport.addRemoteCandidate(candidate);
  }

  return !alreadyAdded;
}

function makeError(name, description) {
  var e = new Error(description);
  e.name = name; // legacy error codes from https://heycam.github.io/webidl/#idl-DOMException-error-names

  e.code = {
    NotSupportedError: 9,
    InvalidStateError: 11,
    InvalidAccessError: 15,
    TypeError: undefined,
    OperationError: undefined
  }[name];
  return e;
}

module.exports = function (window, edgeVersion) {
  // https://w3c.github.io/mediacapture-main/#mediastream
  // Helper function to add the track to the stream and
  // dispatch the event ourselves.
  function addTrackToStreamAndFireEvent(track, stream) {
    stream.addTrack(track);
    stream.dispatchEvent(new window.MediaStreamTrackEvent('addtrack', {
      track: track
    }));
  }

  function removeTrackFromStreamAndFireEvent(track, stream) {
    stream.removeTrack(track);
    stream.dispatchEvent(new window.MediaStreamTrackEvent('removetrack', {
      track: track
    }));
  }

  function fireAddTrack(pc, track, receiver, streams) {
    var trackEvent = new Event('track');
    trackEvent.track = track;
    trackEvent.receiver = receiver;
    trackEvent.transceiver = {
      receiver: receiver
    };
    trackEvent.streams = streams;
    window.setTimeout(function () {
      pc._dispatchEvent('track', trackEvent);
    });
  }

  var RTCPeerConnection = function RTCPeerConnection(config) {
    var pc = this;

    var _eventTarget = document.createDocumentFragment();

    ['addEventListener', 'removeEventListener', 'dispatchEvent'].forEach(function (method) {
      pc[method] = _eventTarget[method].bind(_eventTarget);
    });
    this.canTrickleIceCandidates = null;
    this.needNegotiation = false;
    this.localStreams = [];
    this.remoteStreams = [];
    this._localDescription = null;
    this._remoteDescription = null;
    this.signalingState = 'stable';
    this.iceConnectionState = 'new';
    this.connectionState = 'new';
    this.iceGatheringState = 'new';
    config = JSON.parse(JSON.stringify(config || {}));
    this.usingBundle = config.bundlePolicy === 'max-bundle';

    if (config.rtcpMuxPolicy === 'negotiate') {
      throw makeError('NotSupportedError', 'rtcpMuxPolicy \'negotiate\' is not supported');
    } else if (!config.rtcpMuxPolicy) {
      config.rtcpMuxPolicy = 'require';
    }

    switch (config.iceTransportPolicy) {
      case 'all':
      case 'relay':
        break;

      default:
        config.iceTransportPolicy = 'all';
        break;
    }

    switch (config.bundlePolicy) {
      case 'balanced':
      case 'max-compat':
      case 'max-bundle':
        break;

      default:
        config.bundlePolicy = 'balanced';
        break;
    }

    config.iceServers = filterIceServers(config.iceServers || [], edgeVersion);
    this._iceGatherers = [];

    if (config.iceCandidatePoolSize) {
      for (var i = config.iceCandidatePoolSize; i > 0; i--) {
        this._iceGatherers.push(new window.RTCIceGatherer({
          iceServers: config.iceServers,
          gatherPolicy: config.iceTransportPolicy
        }));
      }
    } else {
      config.iceCandidatePoolSize = 0;
    }

    this._config = config; // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
    // everything that is needed to describe a SDP m-line.

    this.transceivers = [];
    this._sdpSessionId = SDPUtils.generateSessionId();
    this._sdpSessionVersion = 0;
    this._dtlsRole = undefined; // role for a=setup to use in answers.

    this._isClosed = false;
  };

  Object.defineProperty(RTCPeerConnection.prototype, 'localDescription', {
    configurable: true,
    get: function get() {
      return this._localDescription;
    }
  });
  Object.defineProperty(RTCPeerConnection.prototype, 'remoteDescription', {
    configurable: true,
    get: function get() {
      return this._remoteDescription;
    }
  }); // set up event handlers on prototype

  RTCPeerConnection.prototype.onicecandidate = null;
  RTCPeerConnection.prototype.onaddstream = null;
  RTCPeerConnection.prototype.ontrack = null;
  RTCPeerConnection.prototype.onremovestream = null;
  RTCPeerConnection.prototype.onsignalingstatechange = null;
  RTCPeerConnection.prototype.oniceconnectionstatechange = null;
  RTCPeerConnection.prototype.onconnectionstatechange = null;
  RTCPeerConnection.prototype.onicegatheringstatechange = null;
  RTCPeerConnection.prototype.onnegotiationneeded = null;
  RTCPeerConnection.prototype.ondatachannel = null;

  RTCPeerConnection.prototype._dispatchEvent = function (name, event) {
    if (this._isClosed) {
      return;
    }

    this.dispatchEvent(event);

    if (typeof this['on' + name] === 'function') {
      this['on' + name](event);
    }
  };

  RTCPeerConnection.prototype._emitGatheringStateChange = function () {
    var event = new Event('icegatheringstatechange');

    this._dispatchEvent('icegatheringstatechange', event);
  };

  RTCPeerConnection.prototype.getConfiguration = function () {
    return this._config;
  };

  RTCPeerConnection.prototype.getLocalStreams = function () {
    return this.localStreams;
  };

  RTCPeerConnection.prototype.getRemoteStreams = function () {
    return this.remoteStreams;
  }; // internal helper to create a transceiver object.
  // (which is not yet the same as the WebRTC 1.0 transceiver)


  RTCPeerConnection.prototype._createTransceiver = function (kind, doNotAdd) {
    var hasBundleTransport = this.transceivers.length > 0;
    var transceiver = {
      track: null,
      iceGatherer: null,
      iceTransport: null,
      dtlsTransport: null,
      localCapabilities: null,
      remoteCapabilities: null,
      rtpSender: null,
      rtpReceiver: null,
      kind: kind,
      mid: null,
      sendEncodingParameters: null,
      recvEncodingParameters: null,
      stream: null,
      associatedRemoteMediaStreams: [],
      wantReceive: true
    };

    if (this.usingBundle && hasBundleTransport) {
      transceiver.iceTransport = this.transceivers[0].iceTransport;
      transceiver.dtlsTransport = this.transceivers[0].dtlsTransport;
    } else {
      var transports = this._createIceAndDtlsTransports();

      transceiver.iceTransport = transports.iceTransport;
      transceiver.dtlsTransport = transports.dtlsTransport;
    }

    if (!doNotAdd) {
      this.transceivers.push(transceiver);
    }

    return transceiver;
  };

  RTCPeerConnection.prototype.addTrack = function (track, stream) {
    if (this._isClosed) {
      throw makeError('InvalidStateError', 'Attempted to call addTrack on a closed peerconnection.');
    }

    var alreadyExists = this.transceivers.find(function (s) {
      return s.track === track;
    });

    if (alreadyExists) {
      throw makeError('InvalidAccessError', 'Track already exists.');
    }

    var transceiver;

    for (var i = 0; i < this.transceivers.length; i++) {
      if (!this.transceivers[i].track && this.transceivers[i].kind === track.kind) {
        transceiver = this.transceivers[i];
      }
    }

    if (!transceiver) {
      transceiver = this._createTransceiver(track.kind);
    }

    this._maybeFireNegotiationNeeded();

    if (this.localStreams.indexOf(stream) === -1) {
      this.localStreams.push(stream);
    }

    transceiver.track = track;
    transceiver.stream = stream;
    transceiver.rtpSender = new window.RTCRtpSender(track, transceiver.dtlsTransport);
    return transceiver.rtpSender;
  };

  RTCPeerConnection.prototype.addStream = function (stream) {
    var pc = this;

    if (edgeVersion >= 15025) {
      stream.getTracks().forEach(function (track) {
        pc.addTrack(track, stream);
      });
    } else {
      // Clone is necessary for local demos mostly, attaching directly
      // to two different senders does not work (build 10547).
      // Fixed in 15025 (or earlier)
      var clonedStream = stream.clone();
      stream.getTracks().forEach(function (track, idx) {
        var clonedTrack = clonedStream.getTracks()[idx];
        track.addEventListener('enabled', function (event) {
          clonedTrack.enabled = event.enabled;
        });
      });
      clonedStream.getTracks().forEach(function (track) {
        pc.addTrack(track, clonedStream);
      });
    }
  };

  RTCPeerConnection.prototype.removeTrack = function (sender) {
    if (this._isClosed) {
      throw makeError('InvalidStateError', 'Attempted to call removeTrack on a closed peerconnection.');
    }

    if (!(sender instanceof window.RTCRtpSender)) {
      throw new TypeError('Argument 1 of RTCPeerConnection.removeTrack ' + 'does not implement interface RTCRtpSender.');
    }

    var transceiver = this.transceivers.find(function (t) {
      return t.rtpSender === sender;
    });

    if (!transceiver) {
      throw makeError('InvalidAccessError', 'Sender was not created by this connection.');
    }

    var stream = transceiver.stream;
    transceiver.rtpSender.stop();
    transceiver.rtpSender = null;
    transceiver.track = null;
    transceiver.stream = null; // remove the stream from the set of local streams

    var localStreams = this.transceivers.map(function (t) {
      return t.stream;
    });

    if (localStreams.indexOf(stream) === -1 && this.localStreams.indexOf(stream) > -1) {
      this.localStreams.splice(this.localStreams.indexOf(stream), 1);
    }

    this._maybeFireNegotiationNeeded();
  };

  RTCPeerConnection.prototype.removeStream = function (stream) {
    var pc = this;
    stream.getTracks().forEach(function (track) {
      var sender = pc.getSenders().find(function (s) {
        return s.track === track;
      });

      if (sender) {
        pc.removeTrack(sender);
      }
    });
  };

  RTCPeerConnection.prototype.getSenders = function () {
    return this.transceivers.filter(function (transceiver) {
      return !!transceiver.rtpSender;
    }).map(function (transceiver) {
      return transceiver.rtpSender;
    });
  };

  RTCPeerConnection.prototype.getReceivers = function () {
    return this.transceivers.filter(function (transceiver) {
      return !!transceiver.rtpReceiver;
    }).map(function (transceiver) {
      return transceiver.rtpReceiver;
    });
  };

  RTCPeerConnection.prototype._createIceGatherer = function (sdpMLineIndex, usingBundle) {
    var pc = this;

    if (usingBundle && sdpMLineIndex > 0) {
      return this.transceivers[0].iceGatherer;
    } else if (this._iceGatherers.length) {
      return this._iceGatherers.shift();
    }

    var iceGatherer = new window.RTCIceGatherer({
      iceServers: this._config.iceServers,
      gatherPolicy: this._config.iceTransportPolicy
    });
    Object.defineProperty(iceGatherer, 'state', {
      value: 'new',
      writable: true
    });
    this.transceivers[sdpMLineIndex].bufferedCandidateEvents = [];

    this.transceivers[sdpMLineIndex].bufferCandidates = function (event) {
      var end = !event.candidate || Object.keys(event.candidate).length === 0; // polyfill since RTCIceGatherer.state is not implemented in
      // Edge 10547 yet.

      iceGatherer.state = end ? 'completed' : 'gathering';

      if (pc.transceivers[sdpMLineIndex].bufferedCandidateEvents !== null) {
        pc.transceivers[sdpMLineIndex].bufferedCandidateEvents.push(event);
      }
    };

    iceGatherer.addEventListener('localcandidate', this.transceivers[sdpMLineIndex].bufferCandidates);
    return iceGatherer;
  }; // start gathering from an RTCIceGatherer.


  RTCPeerConnection.prototype._gather = function (mid, sdpMLineIndex) {
    var pc = this;
    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;

    if (iceGatherer.onlocalcandidate) {
      return;
    }

    var bufferedCandidateEvents = this.transceivers[sdpMLineIndex].bufferedCandidateEvents;
    this.transceivers[sdpMLineIndex].bufferedCandidateEvents = null;
    iceGatherer.removeEventListener('localcandidate', this.transceivers[sdpMLineIndex].bufferCandidates);

    iceGatherer.onlocalcandidate = function (evt) {
      if (pc.usingBundle && sdpMLineIndex > 0) {
        // if we know that we use bundle we can drop candidates with
        // ѕdpMLineIndex > 0. If we don't do this then our state gets
        // confused since we dispose the extra ice gatherer.
        return;
      }

      var event = new Event('icecandidate');
      event.candidate = {
        sdpMid: mid,
        sdpMLineIndex: sdpMLineIndex
      };
      var cand = evt.candidate; // Edge emits an empty object for RTCIceCandidateComplete‥

      var end = !cand || Object.keys(cand).length === 0;

      if (end) {
        // polyfill since RTCIceGatherer.state is not implemented in
        // Edge 10547 yet.
        if (iceGatherer.state === 'new' || iceGatherer.state === 'gathering') {
          iceGatherer.state = 'completed';
        }
      } else {
        if (iceGatherer.state === 'new') {
          iceGatherer.state = 'gathering';
        } // RTCIceCandidate doesn't have a component, needs to be added


        cand.component = 1; // also the usernameFragment. TODO: update SDP to take both variants.

        cand.ufrag = iceGatherer.getLocalParameters().usernameFragment;
        var serializedCandidate = SDPUtils.writeCandidate(cand);
        event.candidate = Object.assign(event.candidate, SDPUtils.parseCandidate(serializedCandidate));
        event.candidate.candidate = serializedCandidate;

        event.candidate.toJSON = function () {
          return {
            candidate: event.candidate.candidate,
            sdpMid: event.candidate.sdpMid,
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            usernameFragment: event.candidate.usernameFragment
          };
        };
      } // update local description.


      var sections = SDPUtils.getMediaSections(pc._localDescription.sdp);

      if (!end) {
        sections[event.candidate.sdpMLineIndex] += 'a=' + event.candidate.candidate + '\r\n';
      } else {
        sections[event.candidate.sdpMLineIndex] += 'a=end-of-candidates\r\n';
      }

      pc._localDescription.sdp = SDPUtils.getDescription(pc._localDescription.sdp) + sections.join('');
      var complete = pc.transceivers.every(function (transceiver) {
        return transceiver.iceGatherer && transceiver.iceGatherer.state === 'completed';
      });

      if (pc.iceGatheringState !== 'gathering') {
        pc.iceGatheringState = 'gathering';

        pc._emitGatheringStateChange();
      } // Emit candidate. Also emit null candidate when all gatherers are
      // complete.


      if (!end) {
        pc._dispatchEvent('icecandidate', event);
      }

      if (complete) {
        pc._dispatchEvent('icecandidate', new Event('icecandidate'));

        pc.iceGatheringState = 'complete';

        pc._emitGatheringStateChange();
      }
    }; // emit already gathered candidates.


    window.setTimeout(function () {
      bufferedCandidateEvents.forEach(function (e) {
        iceGatherer.onlocalcandidate(e);
      });
    }, 0);
  }; // Create ICE transport and DTLS transport.


  RTCPeerConnection.prototype._createIceAndDtlsTransports = function () {
    var pc = this;
    var iceTransport = new window.RTCIceTransport(null);

    iceTransport.onicestatechange = function () {
      pc._updateIceConnectionState();

      pc._updateConnectionState();
    };

    var dtlsTransport = new window.RTCDtlsTransport(iceTransport);

    dtlsTransport.ondtlsstatechange = function () {
      pc._updateConnectionState();
    };

    dtlsTransport.onerror = function () {
      // onerror does not set state to failed by itself.
      Object.defineProperty(dtlsTransport, 'state', {
        value: 'failed',
        writable: true
      });

      pc._updateConnectionState();
    };

    return {
      iceTransport: iceTransport,
      dtlsTransport: dtlsTransport
    };
  }; // Destroy ICE gatherer, ICE transport and DTLS transport.
  // Without triggering the callbacks.


  RTCPeerConnection.prototype._disposeIceAndDtlsTransports = function (sdpMLineIndex) {
    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;

    if (iceGatherer) {
      delete iceGatherer.onlocalcandidate;
      delete this.transceivers[sdpMLineIndex].iceGatherer;
    }

    var iceTransport = this.transceivers[sdpMLineIndex].iceTransport;

    if (iceTransport) {
      delete iceTransport.onicestatechange;
      delete this.transceivers[sdpMLineIndex].iceTransport;
    }

    var dtlsTransport = this.transceivers[sdpMLineIndex].dtlsTransport;

    if (dtlsTransport) {
      delete dtlsTransport.ondtlsstatechange;
      delete dtlsTransport.onerror;
      delete this.transceivers[sdpMLineIndex].dtlsTransport;
    }
  }; // Start the RTP Sender and Receiver for a transceiver.


  RTCPeerConnection.prototype._transceive = function (transceiver, send, recv) {
    var params = getCommonCapabilities(transceiver.localCapabilities, transceiver.remoteCapabilities);

    if (send && transceiver.rtpSender) {
      params.encodings = transceiver.sendEncodingParameters;
      params.rtcp = {
        cname: SDPUtils.localCName,
        compound: transceiver.rtcpParameters.compound
      };

      if (transceiver.recvEncodingParameters.length) {
        params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
      }

      transceiver.rtpSender.send(params);
    }

    if (recv && transceiver.rtpReceiver && params.codecs.length > 0) {
      // remove RTX field in Edge 14942
      if (transceiver.kind === 'video' && transceiver.recvEncodingParameters && edgeVersion < 15019) {
        transceiver.recvEncodingParameters.forEach(function (p) {
          delete p.rtx;
        });
      }

      if (transceiver.recvEncodingParameters.length) {
        params.encodings = transceiver.recvEncodingParameters;
      } else {
        params.encodings = [{}];
      }

      params.rtcp = {
        compound: transceiver.rtcpParameters.compound
      };

      if (transceiver.rtcpParameters.cname) {
        params.rtcp.cname = transceiver.rtcpParameters.cname;
      }

      if (transceiver.sendEncodingParameters.length) {
        params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
      }

      transceiver.rtpReceiver.receive(params);
    }
  };

  RTCPeerConnection.prototype.setLocalDescription = function (description) {
    var pc = this; // Note: pranswer is not supported.

    if (['offer', 'answer'].indexOf(description.type) === -1) {
      return Promise.reject(makeError('TypeError', 'Unsupported type "' + description.type + '"'));
    }

    if (!isActionAllowedInSignalingState('setLocalDescription', description.type, pc.signalingState) || pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError', 'Can not set local ' + description.type + ' in state ' + pc.signalingState));
    }

    var sections;
    var sessionpart;

    if (description.type === 'offer') {
      // VERY limited support for SDP munging. Limited to:
      // * changing the order of codecs
      sections = SDPUtils.splitSections(description.sdp);
      sessionpart = sections.shift();
      sections.forEach(function (mediaSection, sdpMLineIndex) {
        var caps = SDPUtils.parseRtpParameters(mediaSection);
        pc.transceivers[sdpMLineIndex].localCapabilities = caps;
      });
      pc.transceivers.forEach(function (transceiver, sdpMLineIndex) {
        pc._gather(transceiver.mid, sdpMLineIndex);
      });
    } else if (description.type === 'answer') {
      sections = SDPUtils.splitSections(pc._remoteDescription.sdp);
      sessionpart = sections.shift();
      var isIceLite = SDPUtils.matchPrefix(sessionpart, 'a=ice-lite').length > 0;
      sections.forEach(function (mediaSection, sdpMLineIndex) {
        var transceiver = pc.transceivers[sdpMLineIndex];
        var iceGatherer = transceiver.iceGatherer;
        var iceTransport = transceiver.iceTransport;
        var dtlsTransport = transceiver.dtlsTransport;
        var localCapabilities = transceiver.localCapabilities;
        var remoteCapabilities = transceiver.remoteCapabilities; // treat bundle-only as not-rejected.

        var rejected = SDPUtils.isRejected(mediaSection) && SDPUtils.matchPrefix(mediaSection, 'a=bundle-only').length === 0;

        if (!rejected && !transceiver.rejected) {
          var remoteIceParameters = SDPUtils.getIceParameters(mediaSection, sessionpart);
          var remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection, sessionpart);

          if (isIceLite) {
            remoteDtlsParameters.role = 'server';
          }

          if (!pc.usingBundle || sdpMLineIndex === 0) {
            pc._gather(transceiver.mid, sdpMLineIndex);

            if (iceTransport.state === 'new') {
              iceTransport.start(iceGatherer, remoteIceParameters, isIceLite ? 'controlling' : 'controlled');
            }

            if (dtlsTransport.state === 'new') {
              dtlsTransport.start(remoteDtlsParameters);
            }
          } // Calculate intersection of capabilities.


          var params = getCommonCapabilities(localCapabilities, remoteCapabilities); // Start the RTCRtpSender. The RTCRtpReceiver for this
          // transceiver has already been started in setRemoteDescription.

          pc._transceive(transceiver, params.codecs.length > 0, false);
        }
      });
    }

    pc._localDescription = {
      type: description.type,
      sdp: description.sdp
    };

    if (description.type === 'offer') {
      pc._updateSignalingState('have-local-offer');
    } else {
      pc._updateSignalingState('stable');
    }

    return Promise.resolve();
  };

  RTCPeerConnection.prototype.setRemoteDescription = function (description) {
    var pc = this; // Note: pranswer is not supported.

    if (['offer', 'answer'].indexOf(description.type) === -1) {
      return Promise.reject(makeError('TypeError', 'Unsupported type "' + description.type + '"'));
    }

    if (!isActionAllowedInSignalingState('setRemoteDescription', description.type, pc.signalingState) || pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError', 'Can not set remote ' + description.type + ' in state ' + pc.signalingState));
    }

    var streams = {};
    pc.remoteStreams.forEach(function (stream) {
      streams[stream.id] = stream;
    });
    var receiverList = [];
    var sections = SDPUtils.splitSections(description.sdp);
    var sessionpart = sections.shift();
    var isIceLite = SDPUtils.matchPrefix(sessionpart, 'a=ice-lite').length > 0;
    var usingBundle = SDPUtils.matchPrefix(sessionpart, 'a=group:BUNDLE ').length > 0;
    pc.usingBundle = usingBundle;
    var iceOptions = SDPUtils.matchPrefix(sessionpart, 'a=ice-options:')[0];

    if (iceOptions) {
      pc.canTrickleIceCandidates = iceOptions.substr(14).split(' ').indexOf('trickle') >= 0;
    } else {
      pc.canTrickleIceCandidates = false;
    }

    sections.forEach(function (mediaSection, sdpMLineIndex) {
      var lines = SDPUtils.splitLines(mediaSection);
      var kind = SDPUtils.getKind(mediaSection); // treat bundle-only as not-rejected.

      var rejected = SDPUtils.isRejected(mediaSection) && SDPUtils.matchPrefix(mediaSection, 'a=bundle-only').length === 0;
      var protocol = lines[0].substr(2).split(' ')[2];
      var direction = SDPUtils.getDirection(mediaSection, sessionpart);
      var remoteMsid = SDPUtils.parseMsid(mediaSection);
      var mid = SDPUtils.getMid(mediaSection) || SDPUtils.generateIdentifier(); // Reject datachannels which are not implemented yet.

      if (rejected || kind === 'application' && (protocol === 'DTLS/SCTP' || protocol === 'UDP/DTLS/SCTP')) {
        // TODO: this is dangerous in the case where a non-rejected m-line
        //     becomes rejected.
        pc.transceivers[sdpMLineIndex] = {
          mid: mid,
          kind: kind,
          protocol: protocol,
          rejected: true
        };
        return;
      }

      if (!rejected && pc.transceivers[sdpMLineIndex] && pc.transceivers[sdpMLineIndex].rejected) {
        // recycle a rejected transceiver.
        pc.transceivers[sdpMLineIndex] = pc._createTransceiver(kind, true);
      }

      var transceiver;
      var iceGatherer;
      var iceTransport;
      var dtlsTransport;
      var rtpReceiver;
      var sendEncodingParameters;
      var recvEncodingParameters;
      var localCapabilities;
      var track; // FIXME: ensure the mediaSection has rtcp-mux set.

      var remoteCapabilities = SDPUtils.parseRtpParameters(mediaSection);
      var remoteIceParameters;
      var remoteDtlsParameters;

      if (!rejected) {
        remoteIceParameters = SDPUtils.getIceParameters(mediaSection, sessionpart);
        remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection, sessionpart);
        remoteDtlsParameters.role = 'client';
      }

      recvEncodingParameters = SDPUtils.parseRtpEncodingParameters(mediaSection);
      var rtcpParameters = SDPUtils.parseRtcpParameters(mediaSection);
      var isComplete = SDPUtils.matchPrefix(mediaSection, 'a=end-of-candidates', sessionpart).length > 0;
      var cands = SDPUtils.matchPrefix(mediaSection, 'a=candidate:').map(function (cand) {
        return SDPUtils.parseCandidate(cand);
      }).filter(function (cand) {
        return cand.component === 1;
      }); // Check if we can use BUNDLE and dispose transports.

      if ((description.type === 'offer' || description.type === 'answer') && !rejected && usingBundle && sdpMLineIndex > 0 && pc.transceivers[sdpMLineIndex]) {
        pc._disposeIceAndDtlsTransports(sdpMLineIndex);

        pc.transceivers[sdpMLineIndex].iceGatherer = pc.transceivers[0].iceGatherer;
        pc.transceivers[sdpMLineIndex].iceTransport = pc.transceivers[0].iceTransport;
        pc.transceivers[sdpMLineIndex].dtlsTransport = pc.transceivers[0].dtlsTransport;

        if (pc.transceivers[sdpMLineIndex].rtpSender) {
          pc.transceivers[sdpMLineIndex].rtpSender.setTransport(pc.transceivers[0].dtlsTransport);
        }

        if (pc.transceivers[sdpMLineIndex].rtpReceiver) {
          pc.transceivers[sdpMLineIndex].rtpReceiver.setTransport(pc.transceivers[0].dtlsTransport);
        }
      }

      if (description.type === 'offer' && !rejected) {
        transceiver = pc.transceivers[sdpMLineIndex] || pc._createTransceiver(kind);
        transceiver.mid = mid;

        if (!transceiver.iceGatherer) {
          transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex, usingBundle);
        }

        if (cands.length && transceiver.iceTransport.state === 'new') {
          if (isComplete && (!usingBundle || sdpMLineIndex === 0)) {
            transceiver.iceTransport.setRemoteCandidates(cands);
          } else {
            cands.forEach(function (candidate) {
              maybeAddCandidate(transceiver.iceTransport, candidate);
            });
          }
        }

        localCapabilities = window.RTCRtpReceiver.getCapabilities(kind); // filter RTX until additional stuff needed for RTX is implemented
        // in adapter.js

        if (edgeVersion < 15019) {
          localCapabilities.codecs = localCapabilities.codecs.filter(function (codec) {
            return codec.name !== 'rtx';
          });
        }

        sendEncodingParameters = transceiver.sendEncodingParameters || [{
          ssrc: (2 * sdpMLineIndex + 2) * 1001
        }]; // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams

        var isNewTrack = false;

        if (direction === 'sendrecv' || direction === 'sendonly') {
          isNewTrack = !transceiver.rtpReceiver;
          rtpReceiver = transceiver.rtpReceiver || new window.RTCRtpReceiver(transceiver.dtlsTransport, kind);

          if (isNewTrack) {
            var stream;
            track = rtpReceiver.track; // FIXME: does not work with Plan B.

            if (remoteMsid && remoteMsid.stream === '-') {// no-op. a stream id of '-' means: no associated stream.
            } else if (remoteMsid) {
              if (!streams[remoteMsid.stream]) {
                streams[remoteMsid.stream] = new window.MediaStream();
                Object.defineProperty(streams[remoteMsid.stream], 'id', {
                  get: function get() {
                    return remoteMsid.stream;
                  }
                });
              }

              Object.defineProperty(track, 'id', {
                get: function get() {
                  return remoteMsid.track;
                }
              });
              stream = streams[remoteMsid.stream];
            } else {
              if (!streams["default"]) {
                streams["default"] = new window.MediaStream();
              }

              stream = streams["default"];
            }

            if (stream) {
              addTrackToStreamAndFireEvent(track, stream);
              transceiver.associatedRemoteMediaStreams.push(stream);
            }

            receiverList.push([track, rtpReceiver, stream]);
          }
        } else if (transceiver.rtpReceiver && transceiver.rtpReceiver.track) {
          transceiver.associatedRemoteMediaStreams.forEach(function (s) {
            var nativeTrack = s.getTracks().find(function (t) {
              return t.id === transceiver.rtpReceiver.track.id;
            });

            if (nativeTrack) {
              removeTrackFromStreamAndFireEvent(nativeTrack, s);
            }
          });
          transceiver.associatedRemoteMediaStreams = [];
        }

        transceiver.localCapabilities = localCapabilities;
        transceiver.remoteCapabilities = remoteCapabilities;
        transceiver.rtpReceiver = rtpReceiver;
        transceiver.rtcpParameters = rtcpParameters;
        transceiver.sendEncodingParameters = sendEncodingParameters;
        transceiver.recvEncodingParameters = recvEncodingParameters; // Start the RTCRtpReceiver now. The RTPSender is started in
        // setLocalDescription.

        pc._transceive(pc.transceivers[sdpMLineIndex], false, isNewTrack);
      } else if (description.type === 'answer' && !rejected) {
        transceiver = pc.transceivers[sdpMLineIndex];
        iceGatherer = transceiver.iceGatherer;
        iceTransport = transceiver.iceTransport;
        dtlsTransport = transceiver.dtlsTransport;
        rtpReceiver = transceiver.rtpReceiver;
        sendEncodingParameters = transceiver.sendEncodingParameters;
        localCapabilities = transceiver.localCapabilities;
        pc.transceivers[sdpMLineIndex].recvEncodingParameters = recvEncodingParameters;
        pc.transceivers[sdpMLineIndex].remoteCapabilities = remoteCapabilities;
        pc.transceivers[sdpMLineIndex].rtcpParameters = rtcpParameters;

        if (cands.length && iceTransport.state === 'new') {
          if ((isIceLite || isComplete) && (!usingBundle || sdpMLineIndex === 0)) {
            iceTransport.setRemoteCandidates(cands);
          } else {
            cands.forEach(function (candidate) {
              maybeAddCandidate(transceiver.iceTransport, candidate);
            });
          }
        }

        if (!usingBundle || sdpMLineIndex === 0) {
          if (iceTransport.state === 'new') {
            iceTransport.start(iceGatherer, remoteIceParameters, 'controlling');
          }

          if (dtlsTransport.state === 'new') {
            dtlsTransport.start(remoteDtlsParameters);
          }
        } // If the offer contained RTX but the answer did not,
        // remove RTX from sendEncodingParameters.


        var commonCapabilities = getCommonCapabilities(transceiver.localCapabilities, transceiver.remoteCapabilities);
        var hasRtx = commonCapabilities.codecs.filter(function (c) {
          return c.name.toLowerCase() === 'rtx';
        }).length;

        if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
          delete transceiver.sendEncodingParameters[0].rtx;
        }

        pc._transceive(transceiver, direction === 'sendrecv' || direction === 'recvonly', direction === 'sendrecv' || direction === 'sendonly'); // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams


        if (rtpReceiver && (direction === 'sendrecv' || direction === 'sendonly')) {
          track = rtpReceiver.track;

          if (remoteMsid) {
            if (!streams[remoteMsid.stream]) {
              streams[remoteMsid.stream] = new window.MediaStream();
            }

            addTrackToStreamAndFireEvent(track, streams[remoteMsid.stream]);
            receiverList.push([track, rtpReceiver, streams[remoteMsid.stream]]);
          } else {
            if (!streams["default"]) {
              streams["default"] = new window.MediaStream();
            }

            addTrackToStreamAndFireEvent(track, streams["default"]);
            receiverList.push([track, rtpReceiver, streams["default"]]);
          }
        } else {
          // FIXME: actually the receiver should be created later.
          delete transceiver.rtpReceiver;
        }
      }
    });

    if (pc._dtlsRole === undefined) {
      pc._dtlsRole = description.type === 'offer' ? 'active' : 'passive';
    }

    pc._remoteDescription = {
      type: description.type,
      sdp: description.sdp
    };

    if (description.type === 'offer') {
      pc._updateSignalingState('have-remote-offer');
    } else {
      pc._updateSignalingState('stable');
    }

    Object.keys(streams).forEach(function (sid) {
      var stream = streams[sid];

      if (stream.getTracks().length) {
        if (pc.remoteStreams.indexOf(stream) === -1) {
          pc.remoteStreams.push(stream);
          var event = new Event('addstream');
          event.stream = stream;
          window.setTimeout(function () {
            pc._dispatchEvent('addstream', event);
          });
        }

        receiverList.forEach(function (item) {
          var track = item[0];
          var receiver = item[1];

          if (stream.id !== item[2].id) {
            return;
          }

          fireAddTrack(pc, track, receiver, [stream]);
        });
      }
    });
    receiverList.forEach(function (item) {
      if (item[2]) {
        return;
      }

      fireAddTrack(pc, item[0], item[1], []);
    }); // check whether addIceCandidate({}) was called within four seconds after
    // setRemoteDescription.

    window.setTimeout(function () {
      if (!(pc && pc.transceivers)) {
        return;
      }

      pc.transceivers.forEach(function (transceiver) {
        if (transceiver.iceTransport && transceiver.iceTransport.state === 'new' && transceiver.iceTransport.getRemoteCandidates().length > 0) {
          console.warn('Timeout for addRemoteCandidate. Consider sending ' + 'an end-of-candidates notification');
          transceiver.iceTransport.addRemoteCandidate({});
        }
      });
    }, 4000);
    return Promise.resolve();
  };

  RTCPeerConnection.prototype.close = function () {
    this.transceivers.forEach(function (transceiver) {
      /* not yet
      if (transceiver.iceGatherer) {
        transceiver.iceGatherer.close();
      }
      */
      if (transceiver.iceTransport) {
        transceiver.iceTransport.stop();
      }

      if (transceiver.dtlsTransport) {
        transceiver.dtlsTransport.stop();
      }

      if (transceiver.rtpSender) {
        transceiver.rtpSender.stop();
      }

      if (transceiver.rtpReceiver) {
        transceiver.rtpReceiver.stop();
      }
    }); // FIXME: clean up tracks, local streams, remote streams, etc

    this._isClosed = true;

    this._updateSignalingState('closed');
  }; // Update the signaling state.


  RTCPeerConnection.prototype._updateSignalingState = function (newState) {
    this.signalingState = newState;
    var event = new Event('signalingstatechange');

    this._dispatchEvent('signalingstatechange', event);
  }; // Determine whether to fire the negotiationneeded event.


  RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function () {
    var pc = this;

    if (this.signalingState !== 'stable' || this.needNegotiation === true) {
      return;
    }

    this.needNegotiation = true;
    window.setTimeout(function () {
      if (pc.needNegotiation) {
        pc.needNegotiation = false;
        var event = new Event('negotiationneeded');

        pc._dispatchEvent('negotiationneeded', event);
      }
    }, 0);
  }; // Update the ice connection state.


  RTCPeerConnection.prototype._updateIceConnectionState = function () {
    var newState;
    var states = {
      'new': 0,
      closed: 0,
      checking: 0,
      connected: 0,
      completed: 0,
      disconnected: 0,
      failed: 0
    };
    this.transceivers.forEach(function (transceiver) {
      if (transceiver.iceTransport && !transceiver.rejected) {
        states[transceiver.iceTransport.state]++;
      }
    });
    newState = 'new';

    if (states.failed > 0) {
      newState = 'failed';
    } else if (states.checking > 0) {
      newState = 'checking';
    } else if (states.disconnected > 0) {
      newState = 'disconnected';
    } else if (states["new"] > 0) {
      newState = 'new';
    } else if (states.connected > 0) {
      newState = 'connected';
    } else if (states.completed > 0) {
      newState = 'completed';
    }

    if (newState !== this.iceConnectionState) {
      this.iceConnectionState = newState;
      var event = new Event('iceconnectionstatechange');

      this._dispatchEvent('iceconnectionstatechange', event);
    }
  }; // Update the connection state.


  RTCPeerConnection.prototype._updateConnectionState = function () {
    var newState;
    var states = {
      'new': 0,
      closed: 0,
      connecting: 0,
      connected: 0,
      completed: 0,
      disconnected: 0,
      failed: 0
    };
    this.transceivers.forEach(function (transceiver) {
      if (transceiver.iceTransport && transceiver.dtlsTransport && !transceiver.rejected) {
        states[transceiver.iceTransport.state]++;
        states[transceiver.dtlsTransport.state]++;
      }
    }); // ICETransport.completed and connected are the same for this purpose.

    states.connected += states.completed;
    newState = 'new';

    if (states.failed > 0) {
      newState = 'failed';
    } else if (states.connecting > 0) {
      newState = 'connecting';
    } else if (states.disconnected > 0) {
      newState = 'disconnected';
    } else if (states["new"] > 0) {
      newState = 'new';
    } else if (states.connected > 0) {
      newState = 'connected';
    }

    if (newState !== this.connectionState) {
      this.connectionState = newState;
      var event = new Event('connectionstatechange');

      this._dispatchEvent('connectionstatechange', event);
    }
  };

  RTCPeerConnection.prototype.createOffer = function () {
    var pc = this;

    if (pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError', 'Can not call createOffer after close'));
    }

    var numAudioTracks = pc.transceivers.filter(function (t) {
      return t.kind === 'audio';
    }).length;
    var numVideoTracks = pc.transceivers.filter(function (t) {
      return t.kind === 'video';
    }).length; // Determine number of audio and video tracks we need to send/recv.

    var offerOptions = arguments[0];

    if (offerOptions) {
      // Reject Chrome legacy constraints.
      if (offerOptions.mandatory || offerOptions.optional) {
        throw new TypeError('Legacy mandatory/optional constraints not supported.');
      }

      if (offerOptions.offerToReceiveAudio !== undefined) {
        if (offerOptions.offerToReceiveAudio === true) {
          numAudioTracks = 1;
        } else if (offerOptions.offerToReceiveAudio === false) {
          numAudioTracks = 0;
        } else {
          numAudioTracks = offerOptions.offerToReceiveAudio;
        }
      }

      if (offerOptions.offerToReceiveVideo !== undefined) {
        if (offerOptions.offerToReceiveVideo === true) {
          numVideoTracks = 1;
        } else if (offerOptions.offerToReceiveVideo === false) {
          numVideoTracks = 0;
        } else {
          numVideoTracks = offerOptions.offerToReceiveVideo;
        }
      }
    }

    pc.transceivers.forEach(function (transceiver) {
      if (transceiver.kind === 'audio') {
        numAudioTracks--;

        if (numAudioTracks < 0) {
          transceiver.wantReceive = false;
        }
      } else if (transceiver.kind === 'video') {
        numVideoTracks--;

        if (numVideoTracks < 0) {
          transceiver.wantReceive = false;
        }
      }
    }); // Create M-lines for recvonly streams.

    while (numAudioTracks > 0 || numVideoTracks > 0) {
      if (numAudioTracks > 0) {
        pc._createTransceiver('audio');

        numAudioTracks--;
      }

      if (numVideoTracks > 0) {
        pc._createTransceiver('video');

        numVideoTracks--;
      }
    }

    var sdp = SDPUtils.writeSessionBoilerplate(pc._sdpSessionId, pc._sdpSessionVersion++);
    pc.transceivers.forEach(function (transceiver, sdpMLineIndex) {
      // For each track, create an ice gatherer, ice transport,
      // dtls transport, potentially rtpsender and rtpreceiver.
      var track = transceiver.track;
      var kind = transceiver.kind;
      var mid = transceiver.mid || SDPUtils.generateIdentifier();
      transceiver.mid = mid;

      if (!transceiver.iceGatherer) {
        transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex, pc.usingBundle);
      }

      var localCapabilities = window.RTCRtpSender.getCapabilities(kind); // filter RTX until additional stuff needed for RTX is implemented
      // in adapter.js

      if (edgeVersion < 15019) {
        localCapabilities.codecs = localCapabilities.codecs.filter(function (codec) {
          return codec.name !== 'rtx';
        });
      }

      localCapabilities.codecs.forEach(function (codec) {
        // work around https://bugs.chromium.org/p/webrtc/issues/detail?id=6552
        // by adding level-asymmetry-allowed=1
        if (codec.name === 'H264' && codec.parameters['level-asymmetry-allowed'] === undefined) {
          codec.parameters['level-asymmetry-allowed'] = '1';
        } // for subsequent offers, we might have to re-use the payload
        // type of the last offer.


        if (transceiver.remoteCapabilities && transceiver.remoteCapabilities.codecs) {
          transceiver.remoteCapabilities.codecs.forEach(function (remoteCodec) {
            if (codec.name.toLowerCase() === remoteCodec.name.toLowerCase() && codec.clockRate === remoteCodec.clockRate) {
              codec.preferredPayloadType = remoteCodec.payloadType;
            }
          });
        }
      });
      localCapabilities.headerExtensions.forEach(function (hdrExt) {
        var remoteExtensions = transceiver.remoteCapabilities && transceiver.remoteCapabilities.headerExtensions || [];
        remoteExtensions.forEach(function (rHdrExt) {
          if (hdrExt.uri === rHdrExt.uri) {
            hdrExt.id = rHdrExt.id;
          }
        });
      }); // generate an ssrc now, to be used later in rtpSender.send

      var sendEncodingParameters = transceiver.sendEncodingParameters || [{
        ssrc: (2 * sdpMLineIndex + 1) * 1001
      }];

      if (track) {
        // add RTX
        if (edgeVersion >= 15019 && kind === 'video' && !sendEncodingParameters[0].rtx) {
          sendEncodingParameters[0].rtx = {
            ssrc: sendEncodingParameters[0].ssrc + 1
          };
        }
      }

      if (transceiver.wantReceive) {
        transceiver.rtpReceiver = new window.RTCRtpReceiver(transceiver.dtlsTransport, kind);
      }

      transceiver.localCapabilities = localCapabilities;
      transceiver.sendEncodingParameters = sendEncodingParameters;
    }); // always offer BUNDLE and dispose on return if not supported.

    if (pc._config.bundlePolicy !== 'max-compat') {
      sdp += 'a=group:BUNDLE ' + pc.transceivers.map(function (t) {
        return t.mid;
      }).join(' ') + '\r\n';
    }

    sdp += 'a=ice-options:trickle\r\n';
    pc.transceivers.forEach(function (transceiver, sdpMLineIndex) {
      sdp += writeMediaSection(transceiver, transceiver.localCapabilities, 'offer', transceiver.stream, pc._dtlsRole);
      sdp += 'a=rtcp-rsize\r\n';

      if (transceiver.iceGatherer && pc.iceGatheringState !== 'new' && (sdpMLineIndex === 0 || !pc.usingBundle)) {
        transceiver.iceGatherer.getLocalCandidates().forEach(function (cand) {
          cand.component = 1;
          sdp += 'a=' + SDPUtils.writeCandidate(cand) + '\r\n';
        });

        if (transceiver.iceGatherer.state === 'completed') {
          sdp += 'a=end-of-candidates\r\n';
        }
      }
    });
    var desc = new window.RTCSessionDescription({
      type: 'offer',
      sdp: sdp
    });
    return Promise.resolve(desc);
  };

  RTCPeerConnection.prototype.createAnswer = function () {
    var pc = this;

    if (pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError', 'Can not call createAnswer after close'));
    }

    if (!(pc.signalingState === 'have-remote-offer' || pc.signalingState === 'have-local-pranswer')) {
      return Promise.reject(makeError('InvalidStateError', 'Can not call createAnswer in signalingState ' + pc.signalingState));
    }

    var sdp = SDPUtils.writeSessionBoilerplate(pc._sdpSessionId, pc._sdpSessionVersion++);

    if (pc.usingBundle) {
      sdp += 'a=group:BUNDLE ' + pc.transceivers.map(function (t) {
        return t.mid;
      }).join(' ') + '\r\n';
    }

    sdp += 'a=ice-options:trickle\r\n';
    var mediaSectionsInOffer = SDPUtils.getMediaSections(pc._remoteDescription.sdp).length;
    pc.transceivers.forEach(function (transceiver, sdpMLineIndex) {
      if (sdpMLineIndex + 1 > mediaSectionsInOffer) {
        return;
      }

      if (transceiver.rejected) {
        if (transceiver.kind === 'application') {
          if (transceiver.protocol === 'DTLS/SCTP') {
            // legacy fmt
            sdp += 'm=application 0 DTLS/SCTP 5000\r\n';
          } else {
            sdp += 'm=application 0 ' + transceiver.protocol + ' webrtc-datachannel\r\n';
          }
        } else if (transceiver.kind === 'audio') {
          sdp += 'm=audio 0 UDP/TLS/RTP/SAVPF 0\r\n' + 'a=rtpmap:0 PCMU/8000\r\n';
        } else if (transceiver.kind === 'video') {
          sdp += 'm=video 0 UDP/TLS/RTP/SAVPF 120\r\n' + 'a=rtpmap:120 VP8/90000\r\n';
        }

        sdp += 'c=IN IP4 0.0.0.0\r\n' + 'a=inactive\r\n' + 'a=mid:' + transceiver.mid + '\r\n';
        return;
      } // FIXME: look at direction.


      if (transceiver.stream) {
        var localTrack;

        if (transceiver.kind === 'audio') {
          localTrack = transceiver.stream.getAudioTracks()[0];
        } else if (transceiver.kind === 'video') {
          localTrack = transceiver.stream.getVideoTracks()[0];
        }

        if (localTrack) {
          // add RTX
          if (edgeVersion >= 15019 && transceiver.kind === 'video' && !transceiver.sendEncodingParameters[0].rtx) {
            transceiver.sendEncodingParameters[0].rtx = {
              ssrc: transceiver.sendEncodingParameters[0].ssrc + 1
            };
          }
        }
      } // Calculate intersection of capabilities.


      var commonCapabilities = getCommonCapabilities(transceiver.localCapabilities, transceiver.remoteCapabilities);
      var hasRtx = commonCapabilities.codecs.filter(function (c) {
        return c.name.toLowerCase() === 'rtx';
      }).length;

      if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
        delete transceiver.sendEncodingParameters[0].rtx;
      }

      sdp += writeMediaSection(transceiver, commonCapabilities, 'answer', transceiver.stream, pc._dtlsRole);

      if (transceiver.rtcpParameters && transceiver.rtcpParameters.reducedSize) {
        sdp += 'a=rtcp-rsize\r\n';
      }
    });
    var desc = new window.RTCSessionDescription({
      type: 'answer',
      sdp: sdp
    });
    return Promise.resolve(desc);
  };

  RTCPeerConnection.prototype.addIceCandidate = function (candidate) {
    var pc = this;
    var sections;

    if (candidate && !(candidate.sdpMLineIndex !== undefined || candidate.sdpMid)) {
      return Promise.reject(new TypeError('sdpMLineIndex or sdpMid required'));
    } // TODO: needs to go into ops queue.


    return new Promise(function (resolve, reject) {
      if (!pc._remoteDescription) {
        return reject(makeError('InvalidStateError', 'Can not add ICE candidate without a remote description'));
      } else if (!candidate || candidate.candidate === '') {
        for (var j = 0; j < pc.transceivers.length; j++) {
          if (pc.transceivers[j].rejected) {
            continue;
          }

          pc.transceivers[j].iceTransport.addRemoteCandidate({});
          sections = SDPUtils.getMediaSections(pc._remoteDescription.sdp);
          sections[j] += 'a=end-of-candidates\r\n';
          pc._remoteDescription.sdp = SDPUtils.getDescription(pc._remoteDescription.sdp) + sections.join('');

          if (pc.usingBundle) {
            break;
          }
        }
      } else {
        var sdpMLineIndex = candidate.sdpMLineIndex;

        if (candidate.sdpMid) {
          for (var i = 0; i < pc.transceivers.length; i++) {
            if (pc.transceivers[i].mid === candidate.sdpMid) {
              sdpMLineIndex = i;
              break;
            }
          }
        }

        var transceiver = pc.transceivers[sdpMLineIndex];

        if (transceiver) {
          if (transceiver.rejected) {
            return resolve();
          }

          var cand = Object.keys(candidate.candidate).length > 0 ? SDPUtils.parseCandidate(candidate.candidate) : {}; // Ignore Chrome's invalid candidates since Edge does not like them.

          if (cand.protocol === 'tcp' && (cand.port === 0 || cand.port === 9)) {
            return resolve();
          } // Ignore RTCP candidates, we assume RTCP-MUX.


          if (cand.component && cand.component !== 1) {
            return resolve();
          } // when using bundle, avoid adding candidates to the wrong
          // ice transport. And avoid adding candidates added in the SDP.


          if (sdpMLineIndex === 0 || sdpMLineIndex > 0 && transceiver.iceTransport !== pc.transceivers[0].iceTransport) {
            if (!maybeAddCandidate(transceiver.iceTransport, cand)) {
              return reject(makeError('OperationError', 'Can not add ICE candidate'));
            }
          } // update the remoteDescription.


          var candidateString = candidate.candidate.trim();

          if (candidateString.indexOf('a=') === 0) {
            candidateString = candidateString.substr(2);
          }

          sections = SDPUtils.getMediaSections(pc._remoteDescription.sdp);
          sections[sdpMLineIndex] += 'a=' + (cand.type ? candidateString : 'end-of-candidates') + '\r\n';
          pc._remoteDescription.sdp = SDPUtils.getDescription(pc._remoteDescription.sdp) + sections.join('');
        } else {
          return reject(makeError('OperationError', 'Can not add ICE candidate'));
        }
      }

      resolve();
    });
  };

  RTCPeerConnection.prototype.getStats = function (selector) {
    if (selector && selector instanceof window.MediaStreamTrack) {
      var senderOrReceiver = null;
      this.transceivers.forEach(function (transceiver) {
        if (transceiver.rtpSender && transceiver.rtpSender.track === selector) {
          senderOrReceiver = transceiver.rtpSender;
        } else if (transceiver.rtpReceiver && transceiver.rtpReceiver.track === selector) {
          senderOrReceiver = transceiver.rtpReceiver;
        }
      });

      if (!senderOrReceiver) {
        throw makeError('InvalidAccessError', 'Invalid selector.');
      }

      return senderOrReceiver.getStats();
    }

    var promises = [];
    this.transceivers.forEach(function (transceiver) {
      ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport', 'dtlsTransport'].forEach(function (method) {
        if (transceiver[method]) {
          promises.push(transceiver[method].getStats());
        }
      });
    });
    return Promise.all(promises).then(function (allStats) {
      var results = new Map();
      allStats.forEach(function (stats) {
        stats.forEach(function (stat) {
          results.set(stat.id, stat);
        });
      });
      return results;
    });
  }; // fix low-level stat names and return Map instead of object.


  var ortcObjects = ['RTCRtpSender', 'RTCRtpReceiver', 'RTCIceGatherer', 'RTCIceTransport', 'RTCDtlsTransport'];
  ortcObjects.forEach(function (ortcObjectName) {
    var obj = window[ortcObjectName];

    if (obj && obj.prototype && obj.prototype.getStats) {
      var nativeGetstats = obj.prototype.getStats;

      obj.prototype.getStats = function () {
        return nativeGetstats.apply(this).then(function (nativeStats) {
          var mapStats = new Map();
          Object.keys(nativeStats).forEach(function (id) {
            nativeStats[id].type = fixStatsType(nativeStats[id]);
            mapStats.set(id, nativeStats[id]);
          });
          return mapStats;
        });
      };
    }
  }); // legacy callback shims. Should be moved to adapter.js some days.

  var methods = ['createOffer', 'createAnswer'];
  methods.forEach(function (method) {
    var nativeMethod = RTCPeerConnection.prototype[method];

    RTCPeerConnection.prototype[method] = function () {
      var args = arguments;

      if (typeof args[0] === 'function' || typeof args[1] === 'function') {
        // legacy
        return nativeMethod.apply(this, [arguments[2]]).then(function (description) {
          if (typeof args[0] === 'function') {
            args[0].apply(null, [description]);
          }
        }, function (error) {
          if (typeof args[1] === 'function') {
            args[1].apply(null, [error]);
          }
        });
      }

      return nativeMethod.apply(this, arguments);
    };
  });
  methods = ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'];
  methods.forEach(function (method) {
    var nativeMethod = RTCPeerConnection.prototype[method];

    RTCPeerConnection.prototype[method] = function () {
      var args = arguments;

      if (typeof args[1] === 'function' || typeof args[2] === 'function') {
        // legacy
        return nativeMethod.apply(this, arguments).then(function () {
          if (typeof args[1] === 'function') {
            args[1].apply(null);
          }
        }, function (error) {
          if (typeof args[2] === 'function') {
            args[2].apply(null, [error]);
          }
        });
      }

      return nativeMethod.apply(this, arguments);
    };
  }); // getStats is special. It doesn't have a spec legacy method yet we support
  // getStats(something, cb) without error callbacks.

  ['getStats'].forEach(function (method) {
    var nativeMethod = RTCPeerConnection.prototype[method];

    RTCPeerConnection.prototype[method] = function () {
      var args = arguments;

      if (typeof args[1] === 'function') {
        return nativeMethod.apply(this, arguments).then(function () {
          if (typeof args[1] === 'function') {
            args[1].apply(null);
          }
        });
      }

      return nativeMethod.apply(this, arguments);
    };
  });
  return RTCPeerConnection;
};

},{"sdp":7}],7:[function(require,module,exports){
/* eslint-env node */
'use strict'; // SDP helpers.

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var SDPUtils = {}; // Generate an alphanumeric identifier for cname or mids.
// TODO: use UUIDs instead? https://gist.github.com/jed/982883

SDPUtils.generateIdentifier = function () {
  return Math.random().toString(36).substr(2, 10);
}; // The RTCP CNAME used by all peerconnections from the same JS.


SDPUtils.localCName = SDPUtils.generateIdentifier(); // Splits SDP into lines, dealing with both CRLF and LF.

SDPUtils.splitLines = function (blob) {
  return blob.trim().split('\n').map(function (line) {
    return line.trim();
  });
}; // Splits SDP into sessionpart and mediasections. Ensures CRLF.


SDPUtils.splitSections = function (blob) {
  var parts = blob.split('\nm=');
  return parts.map(function (part, index) {
    return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
  });
}; // returns the session description.


SDPUtils.getDescription = function (blob) {
  var sections = SDPUtils.splitSections(blob);
  return sections && sections[0];
}; // returns the individual media sections.


SDPUtils.getMediaSections = function (blob) {
  var sections = SDPUtils.splitSections(blob);
  sections.shift();
  return sections;
}; // Returns lines that start with a certain prefix.


SDPUtils.matchPrefix = function (blob, prefix) {
  return SDPUtils.splitLines(blob).filter(function (line) {
    return line.indexOf(prefix) === 0;
  });
}; // Parses an ICE candidate line. Sample input:
// candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
// rport 55996"


SDPUtils.parseCandidate = function (line) {
  var parts; // Parse both variants.

  if (line.indexOf('a=candidate:') === 0) {
    parts = line.substring(12).split(' ');
  } else {
    parts = line.substring(10).split(' ');
  }

  var candidate = {
    foundation: parts[0],
    component: parseInt(parts[1], 10),
    protocol: parts[2].toLowerCase(),
    priority: parseInt(parts[3], 10),
    ip: parts[4],
    address: parts[4],
    // address is an alias for ip.
    port: parseInt(parts[5], 10),
    // skip parts[6] == 'typ'
    type: parts[7]
  };

  for (var i = 8; i < parts.length; i += 2) {
    switch (parts[i]) {
      case 'raddr':
        candidate.relatedAddress = parts[i + 1];
        break;

      case 'rport':
        candidate.relatedPort = parseInt(parts[i + 1], 10);
        break;

      case 'tcptype':
        candidate.tcpType = parts[i + 1];
        break;

      case 'ufrag':
        candidate.ufrag = parts[i + 1]; // for backward compability.

        candidate.usernameFragment = parts[i + 1];
        break;

      default:
        // extension handling, in particular ufrag
        candidate[parts[i]] = parts[i + 1];
        break;
    }
  }

  return candidate;
}; // Translates a candidate object into SDP candidate attribute.


SDPUtils.writeCandidate = function (candidate) {
  var sdp = [];
  sdp.push(candidate.foundation);
  sdp.push(candidate.component);
  sdp.push(candidate.protocol.toUpperCase());
  sdp.push(candidate.priority);
  sdp.push(candidate.address || candidate.ip);
  sdp.push(candidate.port);
  var type = candidate.type;
  sdp.push('typ');
  sdp.push(type);

  if (type !== 'host' && candidate.relatedAddress && candidate.relatedPort) {
    sdp.push('raddr');
    sdp.push(candidate.relatedAddress);
    sdp.push('rport');
    sdp.push(candidate.relatedPort);
  }

  if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
    sdp.push('tcptype');
    sdp.push(candidate.tcpType);
  }

  if (candidate.usernameFragment || candidate.ufrag) {
    sdp.push('ufrag');
    sdp.push(candidate.usernameFragment || candidate.ufrag);
  }

  return 'candidate:' + sdp.join(' ');
}; // Parses an ice-options line, returns an array of option tags.
// a=ice-options:foo bar


SDPUtils.parseIceOptions = function (line) {
  return line.substr(14).split(' ');
}; // Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
// a=rtpmap:111 opus/48000/2


SDPUtils.parseRtpMap = function (line) {
  var parts = line.substr(9).split(' ');
  var parsed = {
    payloadType: parseInt(parts.shift(), 10) // was: id

  };
  parts = parts[0].split('/');
  parsed.name = parts[0];
  parsed.clockRate = parseInt(parts[1], 10); // was: clockrate

  parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1; // legacy alias, got renamed back to channels in ORTC.

  parsed.numChannels = parsed.channels;
  return parsed;
}; // Generate an a=rtpmap line from RTCRtpCodecCapability or
// RTCRtpCodecParameters.


SDPUtils.writeRtpMap = function (codec) {
  var pt = codec.payloadType;

  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }

  var channels = codec.channels || codec.numChannels || 1;
  return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate + (channels !== 1 ? '/' + channels : '') + '\r\n';
}; // Parses an a=extmap line (headerextension from RFC 5285). Sample input:
// a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
// a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset


SDPUtils.parseExtmap = function (line) {
  var parts = line.substr(9).split(' ');
  return {
    id: parseInt(parts[0], 10),
    direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
    uri: parts[1]
  };
}; // Generates a=extmap line from RTCRtpHeaderExtensionParameters or
// RTCRtpHeaderExtension.


SDPUtils.writeExtmap = function (headerExtension) {
  return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) + (headerExtension.direction && headerExtension.direction !== 'sendrecv' ? '/' + headerExtension.direction : '') + ' ' + headerExtension.uri + '\r\n';
}; // Parses an ftmp line, returns dictionary. Sample input:
// a=fmtp:96 vbr=on;cng=on
// Also deals with vbr=on; cng=on


SDPUtils.parseFmtp = function (line) {
  var parsed = {};
  var kv;
  var parts = line.substr(line.indexOf(' ') + 1).split(';');

  for (var j = 0; j < parts.length; j++) {
    kv = parts[j].trim().split('=');
    parsed[kv[0].trim()] = kv[1];
  }

  return parsed;
}; // Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.


SDPUtils.writeFmtp = function (codec) {
  var line = '';
  var pt = codec.payloadType;

  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }

  if (codec.parameters && Object.keys(codec.parameters).length) {
    var params = [];
    Object.keys(codec.parameters).forEach(function (param) {
      if (codec.parameters[param]) {
        params.push(param + '=' + codec.parameters[param]);
      } else {
        params.push(param);
      }
    });
    line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
  }

  return line;
}; // Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
// a=rtcp-fb:98 nack rpsi


SDPUtils.parseRtcpFb = function (line) {
  var parts = line.substr(line.indexOf(' ') + 1).split(' ');
  return {
    type: parts.shift(),
    parameter: parts.join(' ')
  };
}; // Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.


SDPUtils.writeRtcpFb = function (codec) {
  var lines = '';
  var pt = codec.payloadType;

  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }

  if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
    // FIXME: special handling for trr-int?
    codec.rtcpFeedback.forEach(function (fb) {
      lines += 'a=rtcp-fb:' + pt + ' ' + fb.type + (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') + '\r\n';
    });
  }

  return lines;
}; // Parses an RFC 5576 ssrc media attribute. Sample input:
// a=ssrc:3735928559 cname:something


SDPUtils.parseSsrcMedia = function (line) {
  var sp = line.indexOf(' ');
  var parts = {
    ssrc: parseInt(line.substr(7, sp - 7), 10)
  };
  var colon = line.indexOf(':', sp);

  if (colon > -1) {
    parts.attribute = line.substr(sp + 1, colon - sp - 1);
    parts.value = line.substr(colon + 1);
  } else {
    parts.attribute = line.substr(sp + 1);
  }

  return parts;
};

SDPUtils.parseSsrcGroup = function (line) {
  var parts = line.substr(13).split(' ');
  return {
    semantics: parts.shift(),
    ssrcs: parts.map(function (ssrc) {
      return parseInt(ssrc, 10);
    })
  };
}; // Extracts the MID (RFC 5888) from a media section.
// returns the MID or undefined if no mid line was found.


SDPUtils.getMid = function (mediaSection) {
  var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];

  if (mid) {
    return mid.substr(6);
  }
};

SDPUtils.parseFingerprint = function (line) {
  var parts = line.substr(14).split(' ');
  return {
    algorithm: parts[0].toLowerCase(),
    // algorithm is case-sensitive in Edge.
    value: parts[1]
  };
}; // Extracts DTLS parameters from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the fingerprint line as input. See also getIceParameters.


SDPUtils.getDtlsParameters = function (mediaSection, sessionpart) {
  var lines = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=fingerprint:'); // Note: a=setup line is ignored since we use the 'auto' role.
  // Note2: 'algorithm' is not case sensitive except in Edge.

  return {
    role: 'auto',
    fingerprints: lines.map(SDPUtils.parseFingerprint)
  };
}; // Serializes DTLS parameters to SDP.


SDPUtils.writeDtlsParameters = function (params, setupType) {
  var sdp = 'a=setup:' + setupType + '\r\n';
  params.fingerprints.forEach(function (fp) {
    sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
  });
  return sdp;
}; // Parses a=crypto lines into
//   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#dictionary-rtcsrtpsdesparameters-members


SDPUtils.parseCryptoLine = function (line) {
  var parts = line.substr(9).split(' ');
  return {
    tag: parseInt(parts[0], 10),
    cryptoSuite: parts[1],
    keyParams: parts[2],
    sessionParams: parts.slice(3)
  };
};

SDPUtils.writeCryptoLine = function (parameters) {
  return 'a=crypto:' + parameters.tag + ' ' + parameters.cryptoSuite + ' ' + (_typeof(parameters.keyParams) === 'object' ? SDPUtils.writeCryptoKeyParams(parameters.keyParams) : parameters.keyParams) + (parameters.sessionParams ? ' ' + parameters.sessionParams.join(' ') : '') + '\r\n';
}; // Parses the crypto key parameters into
//   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#rtcsrtpkeyparam*


SDPUtils.parseCryptoKeyParams = function (keyParams) {
  if (keyParams.indexOf('inline:') !== 0) {
    return null;
  }

  var parts = keyParams.substr(7).split('|');
  return {
    keyMethod: 'inline',
    keySalt: parts[0],
    lifeTime: parts[1],
    mkiValue: parts[2] ? parts[2].split(':')[0] : undefined,
    mkiLength: parts[2] ? parts[2].split(':')[1] : undefined
  };
};

SDPUtils.writeCryptoKeyParams = function (keyParams) {
  return keyParams.keyMethod + ':' + keyParams.keySalt + (keyParams.lifeTime ? '|' + keyParams.lifeTime : '') + (keyParams.mkiValue && keyParams.mkiLength ? '|' + keyParams.mkiValue + ':' + keyParams.mkiLength : '');
}; // Extracts all SDES paramters.


SDPUtils.getCryptoParameters = function (mediaSection, sessionpart) {
  var lines = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=crypto:');
  return lines.map(SDPUtils.parseCryptoLine);
}; // Parses ICE information from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the ice-ufrag and ice-pwd lines as input.


SDPUtils.getIceParameters = function (mediaSection, sessionpart) {
  var ufrag = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=ice-ufrag:')[0];
  var pwd = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=ice-pwd:')[0];

  if (!(ufrag && pwd)) {
    return null;
  }

  return {
    usernameFragment: ufrag.substr(12),
    password: pwd.substr(10)
  };
}; // Serializes ICE parameters to SDP.


SDPUtils.writeIceParameters = function (params) {
  return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' + 'a=ice-pwd:' + params.password + '\r\n';
}; // Parses the SDP media section and returns RTCRtpParameters.


SDPUtils.parseRtpParameters = function (mediaSection) {
  var description = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: [],
    rtcp: []
  };
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');

  for (var i = 3; i < mline.length; i++) {
    // find all codecs from mline[3..]
    var pt = mline[i];
    var rtpmapline = SDPUtils.matchPrefix(mediaSection, 'a=rtpmap:' + pt + ' ')[0];

    if (rtpmapline) {
      var codec = SDPUtils.parseRtpMap(rtpmapline);
      var fmtps = SDPUtils.matchPrefix(mediaSection, 'a=fmtp:' + pt + ' '); // Only the first a=fmtp:<pt> is considered.

      codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
      codec.rtcpFeedback = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-fb:' + pt + ' ').map(SDPUtils.parseRtcpFb);
      description.codecs.push(codec); // parse FEC mechanisms from rtpmap lines.

      switch (codec.name.toUpperCase()) {
        case 'RED':
        case 'ULPFEC':
          description.fecMechanisms.push(codec.name.toUpperCase());
          break;

        default:
          // only RED and ULPFEC are recognized as FEC mechanisms.
          break;
      }
    }
  }

  SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function (line) {
    description.headerExtensions.push(SDPUtils.parseExtmap(line));
  }); // FIXME: parse rtcp.

  return description;
}; // Generates parts of the SDP media section describing the capabilities /
// parameters.


SDPUtils.writeRtpDescription = function (kind, caps) {
  var sdp = ''; // Build the mline.

  sdp += 'm=' + kind + ' ';
  sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.

  sdp += ' UDP/TLS/RTP/SAVPF ';
  sdp += caps.codecs.map(function (codec) {
    if (codec.preferredPayloadType !== undefined) {
      return codec.preferredPayloadType;
    }

    return codec.payloadType;
  }).join(' ') + '\r\n';
  sdp += 'c=IN IP4 0.0.0.0\r\n';
  sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n'; // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.

  caps.codecs.forEach(function (codec) {
    sdp += SDPUtils.writeRtpMap(codec);
    sdp += SDPUtils.writeFmtp(codec);
    sdp += SDPUtils.writeRtcpFb(codec);
  });
  var maxptime = 0;
  caps.codecs.forEach(function (codec) {
    if (codec.maxptime > maxptime) {
      maxptime = codec.maxptime;
    }
  });

  if (maxptime > 0) {
    sdp += 'a=maxptime:' + maxptime + '\r\n';
  }

  sdp += 'a=rtcp-mux\r\n';

  if (caps.headerExtensions) {
    caps.headerExtensions.forEach(function (extension) {
      sdp += SDPUtils.writeExtmap(extension);
    });
  } // FIXME: write fecMechanisms.


  return sdp;
}; // Parses the SDP media section and returns an array of
// RTCRtpEncodingParameters.


SDPUtils.parseRtpEncodingParameters = function (mediaSection) {
  var encodingParameters = [];
  var description = SDPUtils.parseRtpParameters(mediaSection);
  var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
  var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1; // filter a=ssrc:... cname:, ignore PlanB-msid

  var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map(function (line) {
    return SDPUtils.parseSsrcMedia(line);
  }).filter(function (parts) {
    return parts.attribute === 'cname';
  });
  var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
  var secondarySsrc;
  var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID').map(function (line) {
    var parts = line.substr(17).split(' ');
    return parts.map(function (part) {
      return parseInt(part, 10);
    });
  });

  if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
    secondarySsrc = flows[0][1];
  }

  description.codecs.forEach(function (codec) {
    if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
      var encParam = {
        ssrc: primarySsrc,
        codecPayloadType: parseInt(codec.parameters.apt, 10)
      };

      if (primarySsrc && secondarySsrc) {
        encParam.rtx = {
          ssrc: secondarySsrc
        };
      }

      encodingParameters.push(encParam);

      if (hasRed) {
        encParam = JSON.parse(JSON.stringify(encParam));
        encParam.fec = {
          ssrc: primarySsrc,
          mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
        };
        encodingParameters.push(encParam);
      }
    }
  });

  if (encodingParameters.length === 0 && primarySsrc) {
    encodingParameters.push({
      ssrc: primarySsrc
    });
  } // we support both b=AS and b=TIAS but interpret AS as TIAS.


  var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');

  if (bandwidth.length) {
    if (bandwidth[0].indexOf('b=TIAS:') === 0) {
      bandwidth = parseInt(bandwidth[0].substr(7), 10);
    } else if (bandwidth[0].indexOf('b=AS:') === 0) {
      // use formula from JSEP to convert b=AS to TIAS value.
      bandwidth = parseInt(bandwidth[0].substr(5), 10) * 1000 * 0.95 - 50 * 40 * 8;
    } else {
      bandwidth = undefined;
    }

    encodingParameters.forEach(function (params) {
      params.maxBitrate = bandwidth;
    });
  }

  return encodingParameters;
}; // parses http://draft.ortc.org/#rtcrtcpparameters*


SDPUtils.parseRtcpParameters = function (mediaSection) {
  var rtcpParameters = {}; // Gets the first SSRC. Note tha with RTX there might be multiple
  // SSRCs.

  var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map(function (line) {
    return SDPUtils.parseSsrcMedia(line);
  }).filter(function (obj) {
    return obj.attribute === 'cname';
  })[0];

  if (remoteSsrc) {
    rtcpParameters.cname = remoteSsrc.value;
    rtcpParameters.ssrc = remoteSsrc.ssrc;
  } // Edge uses the compound attribute instead of reducedSize
  // compound is !reducedSize


  var rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
  rtcpParameters.reducedSize = rsize.length > 0;
  rtcpParameters.compound = rsize.length === 0; // parses the rtcp-mux attrіbute.
  // Note that Edge does not support unmuxed RTCP.

  var mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
  rtcpParameters.mux = mux.length > 0;
  return rtcpParameters;
}; // parses either a=msid: or a=ssrc:... msid lines and returns
// the id of the MediaStream and MediaStreamTrack.


SDPUtils.parseMsid = function (mediaSection) {
  var parts;
  var spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');

  if (spec.length === 1) {
    parts = spec[0].substr(7).split(' ');
    return {
      stream: parts[0],
      track: parts[1]
    };
  }

  var planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map(function (line) {
    return SDPUtils.parseSsrcMedia(line);
  }).filter(function (msidParts) {
    return msidParts.attribute === 'msid';
  });

  if (planB.length > 0) {
    parts = planB[0].value.split(' ');
    return {
      stream: parts[0],
      track: parts[1]
    };
  }
}; // SCTP
// parses draft-ietf-mmusic-sctp-sdp-26 first and falls back
// to draft-ietf-mmusic-sctp-sdp-05


SDPUtils.parseSctpDescription = function (mediaSection) {
  var mline = SDPUtils.parseMLine(mediaSection);
  var maxSizeLine = SDPUtils.matchPrefix(mediaSection, 'a=max-message-size:');
  var maxMessageSize;

  if (maxSizeLine.length > 0) {
    maxMessageSize = parseInt(maxSizeLine[0].substr(19), 10);
  }

  if (isNaN(maxMessageSize)) {
    maxMessageSize = 65536;
  }

  var sctpPort = SDPUtils.matchPrefix(mediaSection, 'a=sctp-port:');

  if (sctpPort.length > 0) {
    return {
      port: parseInt(sctpPort[0].substr(12), 10),
      protocol: mline.fmt,
      maxMessageSize: maxMessageSize
    };
  }

  var sctpMapLines = SDPUtils.matchPrefix(mediaSection, 'a=sctpmap:');

  if (sctpMapLines.length > 0) {
    var parts = SDPUtils.matchPrefix(mediaSection, 'a=sctpmap:')[0].substr(10).split(' ');
    return {
      port: parseInt(parts[0], 10),
      protocol: parts[1],
      maxMessageSize: maxMessageSize
    };
  }
}; // SCTP
// outputs the draft-ietf-mmusic-sctp-sdp-26 version that all browsers
// support by now receiving in this format, unless we originally parsed
// as the draft-ietf-mmusic-sctp-sdp-05 format (indicated by the m-line
// protocol of DTLS/SCTP -- without UDP/ or TCP/)


SDPUtils.writeSctpDescription = function (media, sctp) {
  var output = [];

  if (media.protocol !== 'DTLS/SCTP') {
    output = ['m=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.protocol + '\r\n', 'c=IN IP4 0.0.0.0\r\n', 'a=sctp-port:' + sctp.port + '\r\n'];
  } else {
    output = ['m=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.port + '\r\n', 'c=IN IP4 0.0.0.0\r\n', 'a=sctpmap:' + sctp.port + ' ' + sctp.protocol + ' 65535\r\n'];
  }

  if (sctp.maxMessageSize !== undefined) {
    output.push('a=max-message-size:' + sctp.maxMessageSize + '\r\n');
  }

  return output.join('');
}; // Generate a session ID for SDP.
// https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-5.2.1
// recommends using a cryptographically random +ve 64-bit value
// but right now this should be acceptable and within the right range


SDPUtils.generateSessionId = function () {
  return Math.random().toString().substr(2, 21);
}; // Write boilder plate for start of SDP
// sessId argument is optional - if not supplied it will
// be generated randomly
// sessVersion is optional and defaults to 2
// sessUser is optional and defaults to 'thisisadapterortc'


SDPUtils.writeSessionBoilerplate = function (sessId, sessVer, sessUser) {
  var sessionId;
  var version = sessVer !== undefined ? sessVer : 2;

  if (sessId) {
    sessionId = sessId;
  } else {
    sessionId = SDPUtils.generateSessionId();
  }

  var user = sessUser || 'thisisadapterortc'; // FIXME: sess-id should be an NTP timestamp.

  return 'v=0\r\n' + 'o=' + user + ' ' + sessionId + ' ' + version + ' IN IP4 127.0.0.1\r\n' + 's=-\r\n' + 't=0 0\r\n';
};

SDPUtils.writeMediaSection = function (transceiver, caps, type, stream) {
  var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps); // Map ICE parameters (ufrag, pwd) to SDP.

  sdp += SDPUtils.writeIceParameters(transceiver.iceGatherer.getLocalParameters()); // Map DTLS parameters to SDP.

  sdp += SDPUtils.writeDtlsParameters(transceiver.dtlsTransport.getLocalParameters(), type === 'offer' ? 'actpass' : 'active');
  sdp += 'a=mid:' + transceiver.mid + '\r\n';

  if (transceiver.direction) {
    sdp += 'a=' + transceiver.direction + '\r\n';
  } else if (transceiver.rtpSender && transceiver.rtpReceiver) {
    sdp += 'a=sendrecv\r\n';
  } else if (transceiver.rtpSender) {
    sdp += 'a=sendonly\r\n';
  } else if (transceiver.rtpReceiver) {
    sdp += 'a=recvonly\r\n';
  } else {
    sdp += 'a=inactive\r\n';
  }

  if (transceiver.rtpSender) {
    // spec.
    var msid = 'msid:' + stream.id + ' ' + transceiver.rtpSender.track.id + '\r\n';
    sdp += 'a=' + msid; // for Chrome.

    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc + ' ' + msid;

    if (transceiver.sendEncodingParameters[0].rtx) {
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc + ' ' + msid;
      sdp += 'a=ssrc-group:FID ' + transceiver.sendEncodingParameters[0].ssrc + ' ' + transceiver.sendEncodingParameters[0].rtx.ssrc + '\r\n';
    }
  } // FIXME: this should be written by writeRtpDescription.


  sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc + ' cname:' + SDPUtils.localCName + '\r\n';

  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc + ' cname:' + SDPUtils.localCName + '\r\n';
  }

  return sdp;
}; // Gets the direction from the mediaSection or the sessionpart.


SDPUtils.getDirection = function (mediaSection, sessionpart) {
  // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
  var lines = SDPUtils.splitLines(mediaSection);

  for (var i = 0; i < lines.length; i++) {
    switch (lines[i]) {
      case 'a=sendrecv':
      case 'a=sendonly':
      case 'a=recvonly':
      case 'a=inactive':
        return lines[i].substr(2);

      default: // FIXME: What should happen here?

    }
  }

  if (sessionpart) {
    return SDPUtils.getDirection(sessionpart);
  }

  return 'sendrecv';
};

SDPUtils.getKind = function (mediaSection) {
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  return mline[0].substr(2);
};

SDPUtils.isRejected = function (mediaSection) {
  return mediaSection.split(' ', 2)[1] === '0';
};

SDPUtils.parseMLine = function (mediaSection) {
  var lines = SDPUtils.splitLines(mediaSection);
  var parts = lines[0].substr(2).split(' ');
  return {
    kind: parts[0],
    port: parseInt(parts[1], 10),
    protocol: parts[2],
    fmt: parts.slice(3).join(' ')
  };
};

SDPUtils.parseOLine = function (mediaSection) {
  var line = SDPUtils.matchPrefix(mediaSection, 'o=')[0];
  var parts = line.substr(2).split(' ');
  return {
    username: parts[0],
    sessionId: parts[1],
    sessionVersion: parseInt(parts[2], 10),
    netType: parts[3],
    addressType: parts[4],
    address: parts[5]
  };
}; // a very naive interpretation of a valid SDP.


SDPUtils.isValidSDP = function (blob) {
  if (typeof blob !== 'string' || blob.length === 0) {
    return false;
  }

  var lines = SDPUtils.splitLines(blob);

  for (var i = 0; i < lines.length; i++) {
    if (lines[i].length < 2 || lines[i].charAt(1) !== '=') {
      return false;
    } // TODO: check the modifier a bit more.

  }

  return true;
}; // Expose public methods.


if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object') {
  module.exports = SDPUtils;
}

},{}],8:[function(require,module,exports){
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
var swfobject = function () {
  var D = "undefined",
      r = "object",
      S = "Shockwave Flash",
      W = "ShockwaveFlash.ShockwaveFlash",
      q = "application/x-shockwave-flash",
      R = "SWFObjectExprInst",
      x = "onreadystatechange",
      O = window,
      j = document,
      t = navigator,
      T = false,
      U = [h],
      o = [],
      N = [],
      I = [],
      l,
      Q,
      E,
      B,
      J = false,
      a = false,
      n,
      G,
      m = true,
      M = function () {
    var aa = _typeof(j.getElementById) != D && _typeof(j.getElementsByTagName) != D && _typeof(j.createElement) != D,
        ah = t.userAgent.toLowerCase(),
        Y = t.platform.toLowerCase(),
        ae = Y ? /win/.test(Y) : /win/.test(ah),
        ac = Y ? /mac/.test(Y) : /mac/.test(ah),
        af = /webkit/.test(ah) ? parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false,
        X = !+"\v1",
        ag = [0, 0, 0],
        ab = null;

    if (_typeof(t.plugins) != D && _typeof(t.plugins[S]) == r) {
      ab = t.plugins[S].description;

      if (ab && !(_typeof(t.mimeTypes) != D && t.mimeTypes[q] && !t.mimeTypes[q].enabledPlugin)) {
        T = true;
        X = false;
        ab = ab.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
        ag[0] = parseInt(ab.replace(/^(.*)\..*$/, "$1"), 10);
        ag[1] = parseInt(ab.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
        ag[2] = /[a-zA-Z]/.test(ab) ? parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
      }
    } else {
      if (_typeof(O[['Active'].concat('Object').join('X')]) != D) {
        try {
          var ad = new window[['Active'].concat('Object').join('X')](W);

          if (ad) {
            ab = ad.GetVariable("$version");

            if (ab) {
              X = true;
              ab = ab.split(" ")[1].split(",");
              ag = [parseInt(ab[0], 10), parseInt(ab[1], 10), parseInt(ab[2], 10)];
            }
          }
        } catch (Z) {}
      }
    }

    return {
      w3: aa,
      pv: ag,
      wk: af,
      ie: X,
      win: ae,
      mac: ac
    };
  }(),
      k = function () {
    if (!M.w3) {
      return;
    }

    if (_typeof(j.readyState) != D && j.readyState == "complete" || _typeof(j.readyState) == D && (j.getElementsByTagName("body")[0] || j.body)) {
      f();
    }

    if (!J) {
      if (_typeof(j.addEventListener) != D) {
        j.addEventListener("DOMContentLoaded", f, false);
      }

      if (M.ie && M.win) {
        j.attachEvent(x, function () {
          if (j.readyState == "complete") {
            j.detachEvent(x, arguments.callee);
            f();
          }
        });

        if (O == top) {
          (function () {
            if (J) {
              return;
            }

            try {
              j.documentElement.doScroll("left");
            } catch (X) {
              setTimeout(arguments.callee, 0);
              return;
            }

            f();
          })();
        }
      }

      if (M.wk) {
        (function () {
          if (J) {
            return;
          }

          if (!/loaded|complete/.test(j.readyState)) {
            setTimeout(arguments.callee, 0);
            return;
          }

          f();
        })();
      }

      s(f);
    }
  }();

  function f() {
    if (J) {
      return;
    }

    try {
      var Z = j.getElementsByTagName("body")[0].appendChild(C("span"));
      Z.parentNode.removeChild(Z);
    } catch (aa) {
      return;
    }

    J = true;
    var X = U.length;

    for (var Y = 0; Y < X; Y++) {
      U[Y]();
    }
  }

  function K(X) {
    if (J) {
      X();
    } else {
      U[U.length] = X;
    }
  }

  function s(Y) {
    if (_typeof(O.addEventListener) != D) {
      O.addEventListener("load", Y, false);
    } else {
      if (_typeof(j.addEventListener) != D) {
        j.addEventListener("load", Y, false);
      } else {
        if (_typeof(O.attachEvent) != D) {
          i(O, "onload", Y);
        } else {
          if (typeof O.onload == "function") {
            var X = O.onload;

            O.onload = function () {
              X();
              Y();
            };
          } else {
            O.onload = Y;
          }
        }
      }
    }
  }

  function h() {
    if (T) {
      V();
    } else {
      H();
    }
  }

  function V() {
    var X = j.getElementsByTagName("body")[0];
    var aa = C(r);
    aa.setAttribute("type", q);
    var Z = X.appendChild(aa);

    if (Z) {
      var Y = 0;

      (function () {
        if (_typeof(Z.GetVariable) != D) {
          var ab = Z.GetVariable("$version");

          if (ab) {
            ab = ab.split(" ")[1].split(",");
            M.pv = [parseInt(ab[0], 10), parseInt(ab[1], 10), parseInt(ab[2], 10)];
          }
        } else {
          if (Y < 10) {
            Y++;
            setTimeout(arguments.callee, 10);
            return;
          }
        }

        X.removeChild(aa);
        Z = null;
        H();
      })();
    } else {
      H();
    }
  }

  function H() {
    var ag = o.length;

    if (ag > 0) {
      for (var af = 0; af < ag; af++) {
        var Y = o[af].id;
        var ab = o[af].callbackFn;
        var aa = {
          success: false,
          id: Y
        };

        if (M.pv[0] > 0) {
          var ae = c(Y);

          if (ae) {
            if (F(o[af].swfVersion) && !(M.wk && M.wk < 312)) {
              w(Y, true);

              if (ab) {
                aa.success = true;
                aa.ref = z(Y);
                ab(aa);
              }
            } else {
              if (o[af].expressInstall && A()) {
                var ai = {};
                ai.data = o[af].expressInstall;
                ai.width = ae.getAttribute("width") || "0";
                ai.height = ae.getAttribute("height") || "0";

                if (ae.getAttribute("class")) {
                  ai.styleclass = ae.getAttribute("class");
                }

                if (ae.getAttribute("align")) {
                  ai.align = ae.getAttribute("align");
                }

                var ah = {};
                var X = ae.getElementsByTagName("param");
                var ac = X.length;

                for (var ad = 0; ad < ac; ad++) {
                  if (X[ad].getAttribute("name").toLowerCase() != "movie") {
                    ah[X[ad].getAttribute("name")] = X[ad].getAttribute("value");
                  }
                }

                P(ai, ah, Y, ab);
              } else {
                p(ae);

                if (ab) {
                  ab(aa);
                }
              }
            }
          }
        } else {
          w(Y, true);

          if (ab) {
            var Z = z(Y);

            if (Z && _typeof(Z.SetVariable) != D) {
              aa.success = true;
              aa.ref = Z;
            }

            ab(aa);
          }
        }
      }
    }
  }

  function z(aa) {
    var X = null;
    var Y = c(aa);

    if (Y && Y.nodeName == "OBJECT") {
      if (_typeof(Y.SetVariable) != D) {
        X = Y;
      } else {
        var Z = Y.getElementsByTagName(r)[0];

        if (Z) {
          X = Z;
        }
      }
    }

    return X;
  }

  function A() {
    return !a && F("6.0.65") && (M.win || M.mac) && !(M.wk && M.wk < 312);
  }

  function P(aa, ab, X, Z) {
    a = true;
    E = Z || null;
    B = {
      success: false,
      id: X
    };
    var ae = c(X);

    if (ae) {
      if (ae.nodeName == "OBJECT") {
        l = g(ae);
        Q = null;
      } else {
        l = ae;
        Q = X;
      }

      aa.id = R;

      if (_typeof(aa.width) == D || !/%$/.test(aa.width) && parseInt(aa.width, 10) < 310) {
        aa.width = "310";
      }

      if (_typeof(aa.height) == D || !/%$/.test(aa.height) && parseInt(aa.height, 10) < 137) {
        aa.height = "137";
      }

      j.title = j.title.slice(0, 47) + " - Flash Player Installation";
      var ad = M.ie && M.win ? ['Active'].concat('').join('X') : "PlugIn",
          ac = "MMredirectURL=" + O.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + ad + "&MMdoctitle=" + j.title;

      if (_typeof(ab.flashvars) != D) {
        ab.flashvars += "&" + ac;
      } else {
        ab.flashvars = ac;
      }

      if (M.ie && M.win && ae.readyState != 4) {
        var Y = C("div");
        X += "SWFObjectNew";
        Y.setAttribute("id", X);
        ae.parentNode.insertBefore(Y, ae);
        ae.style.display = "none";

        (function () {
          if (ae.readyState == 4) {
            ae.parentNode.removeChild(ae);
          } else {
            setTimeout(arguments.callee, 10);
          }
        })();
      }

      u(aa, ab, X);
    }
  }

  function p(Y) {
    if (M.ie && M.win && Y.readyState != 4) {
      var X = C("div");
      Y.parentNode.insertBefore(X, Y);
      X.parentNode.replaceChild(g(Y), X);
      Y.style.display = "none";

      (function () {
        if (Y.readyState == 4) {
          Y.parentNode.removeChild(Y);
        } else {
          setTimeout(arguments.callee, 10);
        }
      })();
    } else {
      Y.parentNode.replaceChild(g(Y), Y);
    }
  }

  function g(ab) {
    var aa = C("div");

    if (M.win && M.ie) {
      aa.innerHTML = ab.innerHTML;
    } else {
      var Y = ab.getElementsByTagName(r)[0];

      if (Y) {
        var ad = Y.childNodes;

        if (ad) {
          var X = ad.length;

          for (var Z = 0; Z < X; Z++) {
            if (!(ad[Z].nodeType == 1 && ad[Z].nodeName == "PARAM") && !(ad[Z].nodeType == 8)) {
              aa.appendChild(ad[Z].cloneNode(true));
            }
          }
        }
      }
    }

    return aa;
  }

  function u(ai, ag, Y) {
    var X,
        aa = c(Y);

    if (M.wk && M.wk < 312) {
      return X;
    }

    if (aa) {
      if (_typeof(ai.id) == D) {
        ai.id = Y;
      }

      if (M.ie && M.win) {
        var ah = "";

        for (var ae in ai) {
          if (ai[ae] != Object.prototype[ae]) {
            if (ae.toLowerCase() == "data") {
              ag.movie = ai[ae];
            } else {
              if (ae.toLowerCase() == "styleclass") {
                ah += ' class="' + ai[ae] + '"';
              } else {
                if (ae.toLowerCase() != "classid") {
                  ah += " " + ae + '="' + ai[ae] + '"';
                }
              }
            }
          }
        }

        var af = "";

        for (var ad in ag) {
          if (ag[ad] != Object.prototype[ad]) {
            af += '<param name="' + ad + '" value="' + ag[ad] + '" />';
          }
        }

        aa.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + ah + ">" + af + "</object>";
        N[N.length] = ai.id;
        X = c(ai.id);
      } else {
        var Z = C(r);
        Z.setAttribute("type", q);

        for (var ac in ai) {
          if (ai[ac] != Object.prototype[ac]) {
            if (ac.toLowerCase() == "styleclass") {
              Z.setAttribute("class", ai[ac]);
            } else {
              if (ac.toLowerCase() != "classid") {
                Z.setAttribute(ac, ai[ac]);
              }
            }
          }
        }

        for (var ab in ag) {
          if (ag[ab] != Object.prototype[ab] && ab.toLowerCase() != "movie") {
            e(Z, ab, ag[ab]);
          }
        }

        aa.parentNode.replaceChild(Z, aa);
        X = Z;
      }
    }

    return X;
  }

  function e(Z, X, Y) {
    var aa = C("param");
    aa.setAttribute("name", X);
    aa.setAttribute("value", Y);
    Z.appendChild(aa);
  }

  function y(Y) {
    var X = c(Y);

    if (X && X.nodeName == "OBJECT") {
      if (M.ie && M.win) {
        X.style.display = "none";

        (function () {
          if (X.readyState == 4) {
            b(Y);
          } else {
            setTimeout(arguments.callee, 10);
          }
        })();
      } else {
        X.parentNode.removeChild(X);
      }
    }
  }

  function b(Z) {
    var Y = c(Z);

    if (Y) {
      for (var X in Y) {
        if (typeof Y[X] == "function") {
          Y[X] = null;
        }
      }

      Y.parentNode.removeChild(Y);
    }
  }

  function c(Z) {
    var X = null;

    try {
      X = j.getElementById(Z);
    } catch (Y) {}

    return X;
  }

  function C(X) {
    return j.createElement(X);
  }

  function i(Z, X, Y) {
    Z.attachEvent(X, Y);
    I[I.length] = [Z, X, Y];
  }

  function F(Z) {
    var Y = M.pv,
        X = Z.split(".");
    X[0] = parseInt(X[0], 10);
    X[1] = parseInt(X[1], 10) || 0;
    X[2] = parseInt(X[2], 10) || 0;
    return Y[0] > X[0] || Y[0] == X[0] && Y[1] > X[1] || Y[0] == X[0] && Y[1] == X[1] && Y[2] >= X[2] ? true : false;
  }

  function v(ac, Y, ad, ab) {
    if (M.ie && M.mac) {
      return;
    }

    var aa = j.getElementsByTagName("head")[0];

    if (!aa) {
      return;
    }

    var X = ad && typeof ad == "string" ? ad : "screen";

    if (ab) {
      n = null;
      G = null;
    }

    if (!n || G != X) {
      var Z = C("style");
      Z.setAttribute("type", "text/css");
      Z.setAttribute("media", X);
      n = aa.appendChild(Z);

      if (M.ie && M.win && _typeof(j.styleSheets) != D && j.styleSheets.length > 0) {
        n = j.styleSheets[j.styleSheets.length - 1];
      }

      G = X;
    }

    if (M.ie && M.win) {
      if (n && _typeof(n.addRule) == r) {
        n.addRule(ac, Y);
      }
    } else {
      if (n && _typeof(j.createTextNode) != D) {
        n.appendChild(j.createTextNode(ac + " {" + Y + "}"));
      }
    }
  }

  function w(Z, X) {
    if (!m) {
      return;
    }

    var Y = X ? "visible" : "hidden";

    if (J && c(Z)) {
      c(Z).style.visibility = Y;
    } else {
      v("#" + Z, "visibility:" + Y);
    }
  }

  function L(Y) {
    var Z = /[\\\"<>\.;]/;
    var X = Z.exec(Y) != null;
    return X && (typeof encodeURIComponent === "undefined" ? "undefined" : _typeof(encodeURIComponent)) != D ? encodeURIComponent(Y) : Y;
  }

  var d = function () {
    if (M.ie && M.win) {
      window.attachEvent("onunload", function () {
        var ac = I.length;

        for (var ab = 0; ab < ac; ab++) {
          I[ab][0].detachEvent(I[ab][1], I[ab][2]);
        }

        var Z = N.length;

        for (var aa = 0; aa < Z; aa++) {
          y(N[aa]);
        }

        for (var Y in M) {
          M[Y] = null;
        }

        M = null;

        for (var X in swfobject) {
          swfobject[X] = null;
        }

        swfobject = null;
      });
    }
  }();

  return {
    registerObject: function registerObject(ab, X, aa, Z) {
      if (M.w3 && ab && X) {
        var Y = {};
        Y.id = ab;
        Y.swfVersion = X;
        Y.expressInstall = aa;
        Y.callbackFn = Z;
        o[o.length] = Y;
        w(ab, false);
      } else {
        if (Z) {
          Z({
            success: false,
            id: ab
          });
        }
      }
    },
    getObjectById: function getObjectById(X) {
      if (M.w3) {
        return z(X);
      }
    },
    embedSWF: function embedSWF(ab, ah, ae, ag, Y, aa, Z, ad, af, ac) {
      var X = {
        success: false,
        id: ah
      };

      if (M.w3 && !(M.wk && M.wk < 312) && ab && ah && ae && ag && Y) {
        w(ah, false);
        K(function () {
          ae += "";
          ag += "";
          var aj = {};

          if (af && _typeof(af) === r) {
            for (var al in af) {
              aj[al] = af[al];
            }
          }

          aj.data = ab;
          aj.width = ae;
          aj.height = ag;
          var am = {};

          if (ad && _typeof(ad) === r) {
            for (var ak in ad) {
              am[ak] = ad[ak];
            }
          }

          if (Z && _typeof(Z) === r) {
            for (var ai in Z) {
              if (_typeof(am.flashvars) != D) {
                am.flashvars += "&" + ai + "=" + Z[ai];
              } else {
                am.flashvars = ai + "=" + Z[ai];
              }
            }
          }

          if (F(Y)) {
            var an = u(aj, am, ah);

            if (aj.id == ah) {
              w(ah, true);
            }

            X.success = true;
            X.ref = an;
          } else {
            if (aa && A()) {
              aj.data = aa;
              P(aj, am, ah, ac);
              return;
            } else {
              w(ah, true);
            }
          }

          if (ac) {
            ac(X);
          }
        });
      } else {
        if (ac) {
          ac(X);
        }
      }
    },
    switchOffAutoHideShow: function switchOffAutoHideShow() {
      m = false;
    },
    ua: M,
    getFlashPlayerVersion: function getFlashPlayerVersion() {
      return {
        major: M.pv[0],
        minor: M.pv[1],
        release: M.pv[2]
      };
    },
    hasFlashPlayerVersion: F,
    createSWF: function createSWF(Z, Y, X) {
      if (M.w3) {
        return u(Z, Y, X);
      } else {
        return undefined;
      }
    },
    showExpressInstall: function showExpressInstall(Z, aa, X, Y) {
      if (M.w3 && A()) {
        P(Z, aa, X, Y);
      }
    },
    removeSWF: function removeSWF(X) {
      if (M.w3) {
        y(X);
      }
    },
    createCSS: function createCSS(aa, Z, Y, X) {
      if (M.w3) {
        v(aa, Z, Y, X);
      }
    },
    addDomLoadEvent: K,
    addLoadEvent: s,
    getQueryParamValue: function getQueryParamValue(aa) {
      var Z = j.location.search || j.location.hash;

      if (Z) {
        if (/\?/.test(Z)) {
          Z = Z.split("?")[1];
        }

        if (aa == null) {
          return L(Z);
        }

        var Y = Z.split("&");

        for (var X = 0; X < Y.length; X++) {
          if (Y[X].substring(0, Y[X].indexOf("=")) == aa) {
            return L(Y[X].substring(Y[X].indexOf("=") + 1));
          }
        }
      }

      return "";
    },
    expressInstallCallback: function expressInstallCallback() {
      if (a) {
        var X = c(R);

        if (X && l) {
          X.parentNode.replaceChild(l, X);

          if (Q) {
            w(Q, true);

            if (M.ie && M.win) {
              l.style.display = "block";
            }
          }

          if (E) {
            E(B);
          }
        }

        a = false;
      }
    }
  };
}();

module.exports = swfobject;

},{}],9:[function(require,module,exports){
(function (setImmediate,clearImmediate){(function (){
var nextTick = require('process/browser.js').nextTick;

var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0; // DOM APIs, for completeness

exports.setTimeout = function () {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};

exports.setInterval = function () {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};

exports.clearTimeout = exports.clearInterval = function (timeout) {
  timeout.close();
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}

Timeout.prototype.unref = Timeout.prototype.ref = function () {};

Timeout.prototype.close = function () {
  this._clearFn.call(window, this._id);
}; // Does not start the time, just sets up the members needed.


exports.enroll = function (item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function (item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function (item) {
  clearTimeout(item._idleTimeoutId);
  var msecs = item._idleTimeout;

  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout) item._onTimeout();
    }, msecs);
  }
}; // That's not how node.js implements it but the exposed api is the same.


exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function (fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);
  immediateIds[id] = true;
  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      } // Prevent ids from leaking


      exports.clearImmediate(id);
    }
  });
  return id;
};
exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function (id) {
  delete immediateIds[id];
};

}).call(this)}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":4,"timers":9}],10:[function(require,module,exports){
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex; // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4

  return [bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]]].join('');
}

module.exports = bytesToUuid;

},{}],11:[function(require,module,exports){
// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = typeof crypto != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto);

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

},{}],12:[function(require,module,exports){
var rng = require('./lib/rng');

var bytesToUuid = require('./lib/bytesToUuid'); // **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html


var _nodeId;

var _clockseq; // Previous uuid creation time


var _lastMSecs = 0;
var _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];
  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    var seedBytes = rng();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;

},{"./lib/bytesToUuid":10,"./lib/rng":11}],13:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _adapter_factory = require('./adapter_factory.js');

var adapter = (0, _adapter_factory.adapterFactory)({
  window: typeof window === 'undefined' ? undefined : window
});
exports["default"] = adapter;

},{"./adapter_factory.js":14}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adapterFactory = adapterFactory;

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

var _chrome_shim = require('./chrome/chrome_shim');

var chromeShim = _interopRequireWildcard(_chrome_shim);

var _edge_shim = require('./edge/edge_shim');

var edgeShim = _interopRequireWildcard(_edge_shim);

var _firefox_shim = require('./firefox/firefox_shim');

var firefoxShim = _interopRequireWildcard(_firefox_shim);

var _safari_shim = require('./safari/safari_shim');

var safariShim = _interopRequireWildcard(_safari_shim);

var _common_shim = require('./common_shim');

var commonShim = _interopRequireWildcard(_common_shim);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
} // Shimming starts here.

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */


function adapterFactory() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      window = _ref.window;

  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    shimChrome: true,
    shimFirefox: true,
    shimEdge: true,
    shimSafari: true
  }; // Utils.

  var logging = utils.log;
  var browserDetails = utils.detectBrowser(window);
  var adapter = {
    browserDetails: browserDetails,
    commonShim: commonShim,
    extractVersion: utils.extractVersion,
    disableLog: utils.disableLog,
    disableWarnings: utils.disableWarnings
  }; // Shim browser if found.

  switch (browserDetails.browser) {
    case 'chrome':
      if (!chromeShim || !chromeShim.shimPeerConnection || !options.shimChrome) {
        logging('Chrome shim is not included in this adapter release.');
        return adapter;
      }

      if (browserDetails.version === null) {
        logging('Chrome shim can not determine version, not shimming.');
        return adapter;
      }

      logging('adapter.js shimming chrome.'); // Export to the adapter global object visible in the browser.

      adapter.browserShim = chromeShim;
      chromeShim.shimGetUserMedia(window);
      chromeShim.shimMediaStream(window);
      chromeShim.shimPeerConnection(window);
      chromeShim.shimOnTrack(window);
      chromeShim.shimAddTrackRemoveTrack(window);
      chromeShim.shimGetSendersWithDtmf(window);
      chromeShim.shimGetStats(window);
      chromeShim.shimSenderReceiverGetStats(window);
      chromeShim.fixNegotiationNeeded(window);
      commonShim.shimRTCIceCandidate(window);
      commonShim.shimConnectionState(window);
      commonShim.shimMaxMessageSize(window);
      commonShim.shimSendThrowTypeError(window);
      commonShim.removeAllowExtmapMixed(window);
      break;

    case 'firefox':
      if (!firefoxShim || !firefoxShim.shimPeerConnection || !options.shimFirefox) {
        logging('Firefox shim is not included in this adapter release.');
        return adapter;
      }

      logging('adapter.js shimming firefox.'); // Export to the adapter global object visible in the browser.

      adapter.browserShim = firefoxShim;
      firefoxShim.shimGetUserMedia(window);
      firefoxShim.shimPeerConnection(window);
      firefoxShim.shimOnTrack(window);
      firefoxShim.shimRemoveStream(window);
      firefoxShim.shimSenderGetStats(window);
      firefoxShim.shimReceiverGetStats(window);
      firefoxShim.shimRTCDataChannel(window);
      firefoxShim.shimAddTransceiver(window);
      firefoxShim.shimGetParameters(window);
      firefoxShim.shimCreateOffer(window);
      firefoxShim.shimCreateAnswer(window);
      commonShim.shimRTCIceCandidate(window);
      commonShim.shimConnectionState(window);
      commonShim.shimMaxMessageSize(window);
      commonShim.shimSendThrowTypeError(window);
      break;

    case 'edge':
      if (!edgeShim || !edgeShim.shimPeerConnection || !options.shimEdge) {
        logging('MS edge shim is not included in this adapter release.');
        return adapter;
      }

      logging('adapter.js shimming edge.'); // Export to the adapter global object visible in the browser.

      adapter.browserShim = edgeShim;
      edgeShim.shimGetUserMedia(window);
      edgeShim.shimGetDisplayMedia(window);
      edgeShim.shimPeerConnection(window);
      edgeShim.shimReplaceTrack(window); // the edge shim implements the full RTCIceCandidate object.

      commonShim.shimMaxMessageSize(window);
      commonShim.shimSendThrowTypeError(window);
      break;

    case 'safari':
      if (!safariShim || !options.shimSafari) {
        logging('Safari shim is not included in this adapter release.');
        return adapter;
      }

      logging('adapter.js shimming safari.'); // Export to the adapter global object visible in the browser.

      adapter.browserShim = safariShim;
      safariShim.shimRTCIceServerUrls(window);
      safariShim.shimCreateOfferLegacy(window);
      safariShim.shimCallbacksAPI(window);
      safariShim.shimLocalStreamsAPI(window);
      safariShim.shimRemoteStreamsAPI(window);
      safariShim.shimTrackEventTransceiver(window);
      safariShim.shimGetUserMedia(window);
      safariShim.shimAudioContext(window);
      commonShim.shimRTCIceCandidate(window);
      commonShim.shimMaxMessageSize(window);
      commonShim.shimSendThrowTypeError(window);
      commonShim.removeAllowExtmapMixed(window);
      break;

    default:
      logging('Unsupported browser!');
      break;
  }

  return adapter;
} // Browser shims.

},{"./chrome/chrome_shim":15,"./common_shim":18,"./edge/edge_shim":19,"./firefox/firefox_shim":23,"./safari/safari_shim":26,"./utils":27}],15:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

function _typeof2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shimGetDisplayMedia = exports.shimGetUserMedia = undefined;

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
};

var _getusermedia = require('./getusermedia');

Object.defineProperty(exports, 'shimGetUserMedia', {
  enumerable: true,
  get: function get() {
    return _getusermedia.shimGetUserMedia;
  }
});

var _getdisplaymedia = require('./getdisplaymedia');

Object.defineProperty(exports, 'shimGetDisplayMedia', {
  enumerable: true,
  get: function get() {
    return _getdisplaymedia.shimGetDisplayMedia;
  }
});
exports.shimMediaStream = shimMediaStream;
exports.shimOnTrack = shimOnTrack;
exports.shimGetSendersWithDtmf = shimGetSendersWithDtmf;
exports.shimGetStats = shimGetStats;
exports.shimSenderReceiverGetStats = shimSenderReceiverGetStats;
exports.shimAddTrackRemoveTrackWithNative = shimAddTrackRemoveTrackWithNative;
exports.shimAddTrackRemoveTrack = shimAddTrackRemoveTrack;
exports.shimPeerConnection = shimPeerConnection;
exports.fixNegotiationNeeded = fixNegotiationNeeded;

var _utils = require('../utils.js');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function shimMediaStream(window) {
  window.MediaStream = window.MediaStream || window.webkitMediaStream;
}

function shimOnTrack(window) {
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && !('ontrack' in window.RTCPeerConnection.prototype)) {
    Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
      get: function get() {
        return this._ontrack;
      },
      set: function set(f) {
        if (this._ontrack) {
          this.removeEventListener('track', this._ontrack);
        }

        this.addEventListener('track', this._ontrack = f);
      },
      enumerable: true,
      configurable: true
    });
    var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;

    window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
      var _this = this;

      if (!this._ontrackpoly) {
        this._ontrackpoly = function (e) {
          // onaddstream does not fire when a track is added to an existing
          // stream. But stream.onaddtrack is implemented so we use that.
          e.stream.addEventListener('addtrack', function (te) {
            var receiver = void 0;

            if (window.RTCPeerConnection.prototype.getReceivers) {
              receiver = _this.getReceivers().find(function (r) {
                return r.track && r.track.id === te.track.id;
              });
            } else {
              receiver = {
                track: te.track
              };
            }

            var event = new Event('track');
            event.track = te.track;
            event.receiver = receiver;
            event.transceiver = {
              receiver: receiver
            };
            event.streams = [e.stream];

            _this.dispatchEvent(event);
          });
          e.stream.getTracks().forEach(function (track) {
            var receiver = void 0;

            if (window.RTCPeerConnection.prototype.getReceivers) {
              receiver = _this.getReceivers().find(function (r) {
                return r.track && r.track.id === track.id;
              });
            } else {
              receiver = {
                track: track
              };
            }

            var event = new Event('track');
            event.track = track;
            event.receiver = receiver;
            event.transceiver = {
              receiver: receiver
            };
            event.streams = [e.stream];

            _this.dispatchEvent(event);
          });
        };

        this.addEventListener('addstream', this._ontrackpoly);
      }

      return origSetRemoteDescription.apply(this, arguments);
    };
  } else {
    // even if RTCRtpTransceiver is in window, it is only used and
    // emitted in unified-plan. Unfortunately this means we need
    // to unconditionally wrap the event.
    utils.wrapPeerConnectionEvent(window, 'track', function (e) {
      if (!e.transceiver) {
        Object.defineProperty(e, 'transceiver', {
          value: {
            receiver: e.receiver
          }
        });
      }

      return e;
    });
  }
}

function shimGetSendersWithDtmf(window) {
  // Overrides addTrack/removeTrack, depends on shimAddTrackRemoveTrack.
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && !('getSenders' in window.RTCPeerConnection.prototype) && 'createDTMFSender' in window.RTCPeerConnection.prototype) {
    var shimSenderWithDtmf = function shimSenderWithDtmf(pc, track) {
      return {
        track: track,

        get dtmf() {
          if (this._dtmf === undefined) {
            if (track.kind === 'audio') {
              this._dtmf = pc.createDTMFSender(track);
            } else {
              this._dtmf = null;
            }
          }

          return this._dtmf;
        },

        _pc: pc
      };
    }; // augment addTrack when getSenders is not available.


    if (!window.RTCPeerConnection.prototype.getSenders) {
      window.RTCPeerConnection.prototype.getSenders = function getSenders() {
        this._senders = this._senders || [];
        return this._senders.slice(); // return a copy of the internal state.
      };

      var origAddTrack = window.RTCPeerConnection.prototype.addTrack;

      window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
        var sender = origAddTrack.apply(this, arguments);

        if (!sender) {
          sender = shimSenderWithDtmf(this, track);

          this._senders.push(sender);
        }

        return sender;
      };

      var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;

      window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
        origRemoveTrack.apply(this, arguments);

        var idx = this._senders.indexOf(sender);

        if (idx !== -1) {
          this._senders.splice(idx, 1);
        }
      };
    }

    var origAddStream = window.RTCPeerConnection.prototype.addStream;

    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      var _this2 = this;

      this._senders = this._senders || [];
      origAddStream.apply(this, [stream]);
      stream.getTracks().forEach(function (track) {
        _this2._senders.push(shimSenderWithDtmf(_this2, track));
      });
    };

    var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;

    window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
      var _this3 = this;

      this._senders = this._senders || [];
      origRemoveStream.apply(this, [stream]);
      stream.getTracks().forEach(function (track) {
        var sender = _this3._senders.find(function (s) {
          return s.track === track;
        });

        if (sender) {
          // remove sender
          _this3._senders.splice(_this3._senders.indexOf(sender), 1);
        }
      });
    };
  } else if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && 'getSenders' in window.RTCPeerConnection.prototype && 'createDTMFSender' in window.RTCPeerConnection.prototype && window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
    var origGetSenders = window.RTCPeerConnection.prototype.getSenders;

    window.RTCPeerConnection.prototype.getSenders = function getSenders() {
      var _this4 = this;

      var senders = origGetSenders.apply(this, []);
      senders.forEach(function (sender) {
        return sender._pc = _this4;
      });
      return senders;
    };

    Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
      get: function get() {
        if (this._dtmf === undefined) {
          if (this.track.kind === 'audio') {
            this._dtmf = this._pc.createDTMFSender(this.track);
          } else {
            this._dtmf = null;
          }
        }

        return this._dtmf;
      }
    });
  }
}

function shimGetStats(window) {
  if (!window.RTCPeerConnection) {
    return;
  }

  var origGetStats = window.RTCPeerConnection.prototype.getStats;

  window.RTCPeerConnection.prototype.getStats = function getStats() {
    var _this5 = this;

    var _arguments = Array.prototype.slice.call(arguments),
        selector = _arguments[0],
        onSucc = _arguments[1],
        onErr = _arguments[2]; // If selector is a function then we are in the old style stats so just
    // pass back the original getStats format to avoid breaking old users.


    if (arguments.length > 0 && typeof selector === 'function') {
      return origGetStats.apply(this, arguments);
    } // When spec-style getStats is supported, return those when called with
    // either no arguments or the selector argument is null.


    if (origGetStats.length === 0 && (arguments.length === 0 || typeof selector !== 'function')) {
      return origGetStats.apply(this, []);
    }

    var fixChromeStats_ = function fixChromeStats_(response) {
      var standardReport = {};
      var reports = response.result();
      reports.forEach(function (report) {
        var standardStats = {
          id: report.id,
          timestamp: report.timestamp,
          type: {
            localcandidate: 'local-candidate',
            remotecandidate: 'remote-candidate'
          }[report.type] || report.type
        };
        report.names().forEach(function (name) {
          standardStats[name] = report.stat(name);
        });
        standardReport[standardStats.id] = standardStats;
      });
      return standardReport;
    }; // shim getStats with maplike support


    var makeMapStats = function makeMapStats(stats) {
      return new Map(Object.keys(stats).map(function (key) {
        return [key, stats[key]];
      }));
    };

    if (arguments.length >= 2) {
      var successCallbackWrapper_ = function successCallbackWrapper_(response) {
        onSucc(makeMapStats(fixChromeStats_(response)));
      };

      return origGetStats.apply(this, [successCallbackWrapper_, selector]);
    } // promise-support


    return new Promise(function (resolve, reject) {
      origGetStats.apply(_this5, [function (response) {
        resolve(makeMapStats(fixChromeStats_(response)));
      }, reject]);
    }).then(onSucc, onErr);
  };
}

function shimSenderReceiverGetStats(window) {
  if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && window.RTCRtpSender && window.RTCRtpReceiver)) {
    return;
  } // shim sender stats.


  if (!('getStats' in window.RTCRtpSender.prototype)) {
    var origGetSenders = window.RTCPeerConnection.prototype.getSenders;

    if (origGetSenders) {
      window.RTCPeerConnection.prototype.getSenders = function getSenders() {
        var _this6 = this;

        var senders = origGetSenders.apply(this, []);
        senders.forEach(function (sender) {
          return sender._pc = _this6;
        });
        return senders;
      };
    }

    var origAddTrack = window.RTCPeerConnection.prototype.addTrack;

    if (origAddTrack) {
      window.RTCPeerConnection.prototype.addTrack = function addTrack() {
        var sender = origAddTrack.apply(this, arguments);
        sender._pc = this;
        return sender;
      };
    }

    window.RTCRtpSender.prototype.getStats = function getStats() {
      var sender = this;
      return this._pc.getStats().then(function (result) {
        return (
          /* Note: this will include stats of all senders that
           *   send a track with the same id as sender.track as
           *   it is not possible to identify the RTCRtpSender.
           */
          utils.filterStats(result, sender.track, true)
        );
      });
    };
  } // shim receiver stats.


  if (!('getStats' in window.RTCRtpReceiver.prototype)) {
    var origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;

    if (origGetReceivers) {
      window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
        var _this7 = this;

        var receivers = origGetReceivers.apply(this, []);
        receivers.forEach(function (receiver) {
          return receiver._pc = _this7;
        });
        return receivers;
      };
    }

    utils.wrapPeerConnectionEvent(window, 'track', function (e) {
      e.receiver._pc = e.srcElement;
      return e;
    });

    window.RTCRtpReceiver.prototype.getStats = function getStats() {
      var receiver = this;
      return this._pc.getStats().then(function (result) {
        return utils.filterStats(result, receiver.track, false);
      });
    };
  }

  if (!('getStats' in window.RTCRtpSender.prototype && 'getStats' in window.RTCRtpReceiver.prototype)) {
    return;
  } // shim RTCPeerConnection.getStats(track).


  var origGetStats = window.RTCPeerConnection.prototype.getStats;

  window.RTCPeerConnection.prototype.getStats = function getStats() {
    if (arguments.length > 0 && arguments[0] instanceof window.MediaStreamTrack) {
      var track = arguments[0];
      var sender = void 0;
      var receiver = void 0;
      var err = void 0;
      this.getSenders().forEach(function (s) {
        if (s.track === track) {
          if (sender) {
            err = true;
          } else {
            sender = s;
          }
        }
      });
      this.getReceivers().forEach(function (r) {
        if (r.track === track) {
          if (receiver) {
            err = true;
          } else {
            receiver = r;
          }
        }

        return r.track === track;
      });

      if (err || sender && receiver) {
        return Promise.reject(new DOMException('There are more than one sender or receiver for the track.', 'InvalidAccessError'));
      } else if (sender) {
        return sender.getStats();
      } else if (receiver) {
        return receiver.getStats();
      }

      return Promise.reject(new DOMException('There is no sender or receiver for the track.', 'InvalidAccessError'));
    }

    return origGetStats.apply(this, arguments);
  };
}

function shimAddTrackRemoveTrackWithNative(window) {
  // shim addTrack/removeTrack with native variants in order to make
  // the interactions with legacy getLocalStreams behave as in other browsers.
  // Keeps a mapping stream.id => [stream, rtpsenders...]
  window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
    var _this8 = this;

    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    return Object.keys(this._shimmedLocalStreams).map(function (streamId) {
      return _this8._shimmedLocalStreams[streamId][0];
    });
  };

  var origAddTrack = window.RTCPeerConnection.prototype.addTrack;

  window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
    if (!stream) {
      return origAddTrack.apply(this, arguments);
    }

    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    var sender = origAddTrack.apply(this, arguments);

    if (!this._shimmedLocalStreams[stream.id]) {
      this._shimmedLocalStreams[stream.id] = [stream, sender];
    } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
      this._shimmedLocalStreams[stream.id].push(sender);
    }

    return sender;
  };

  var origAddStream = window.RTCPeerConnection.prototype.addStream;

  window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
    var _this9 = this;

    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    stream.getTracks().forEach(function (track) {
      var alreadyExists = _this9.getSenders().find(function (s) {
        return s.track === track;
      });

      if (alreadyExists) {
        throw new DOMException('Track already exists.', 'InvalidAccessError');
      }
    });
    var existingSenders = this.getSenders();
    origAddStream.apply(this, arguments);
    var newSenders = this.getSenders().filter(function (newSender) {
      return existingSenders.indexOf(newSender) === -1;
    });
    this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
  };

  var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;

  window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    delete this._shimmedLocalStreams[stream.id];
    return origRemoveStream.apply(this, arguments);
  };

  var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;

  window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
    var _this10 = this;

    this._shimmedLocalStreams = this._shimmedLocalStreams || {};

    if (sender) {
      Object.keys(this._shimmedLocalStreams).forEach(function (streamId) {
        var idx = _this10._shimmedLocalStreams[streamId].indexOf(sender);

        if (idx !== -1) {
          _this10._shimmedLocalStreams[streamId].splice(idx, 1);
        }

        if (_this10._shimmedLocalStreams[streamId].length === 1) {
          delete _this10._shimmedLocalStreams[streamId];
        }
      });
    }

    return origRemoveTrack.apply(this, arguments);
  };
}

function shimAddTrackRemoveTrack(window) {
  if (!window.RTCPeerConnection) {
    return;
  }

  var browserDetails = utils.detectBrowser(window); // shim addTrack and removeTrack.

  if (window.RTCPeerConnection.prototype.addTrack && browserDetails.version >= 65) {
    return shimAddTrackRemoveTrackWithNative(window);
  } // also shim pc.getLocalStreams when addTrack is shimmed
  // to return the original streams.


  var origGetLocalStreams = window.RTCPeerConnection.prototype.getLocalStreams;

  window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
    var _this11 = this;

    var nativeStreams = origGetLocalStreams.apply(this);
    this._reverseStreams = this._reverseStreams || {};
    return nativeStreams.map(function (stream) {
      return _this11._reverseStreams[stream.id];
    });
  };

  var origAddStream = window.RTCPeerConnection.prototype.addStream;

  window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
    var _this12 = this;

    this._streams = this._streams || {};
    this._reverseStreams = this._reverseStreams || {};
    stream.getTracks().forEach(function (track) {
      var alreadyExists = _this12.getSenders().find(function (s) {
        return s.track === track;
      });

      if (alreadyExists) {
        throw new DOMException('Track already exists.', 'InvalidAccessError');
      }
    }); // Add identity mapping for consistency with addTrack.
    // Unless this is being used with a stream from addTrack.

    if (!this._reverseStreams[stream.id]) {
      var newStream = new window.MediaStream(stream.getTracks());
      this._streams[stream.id] = newStream;
      this._reverseStreams[newStream.id] = stream;
      stream = newStream;
    }

    origAddStream.apply(this, [stream]);
  };

  var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;

  window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
    this._streams = this._streams || {};
    this._reverseStreams = this._reverseStreams || {};
    origRemoveStream.apply(this, [this._streams[stream.id] || stream]);
    delete this._reverseStreams[this._streams[stream.id] ? this._streams[stream.id].id : stream.id];
    delete this._streams[stream.id];
  };

  window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
    var _this13 = this;

    if (this.signalingState === 'closed') {
      throw new DOMException('The RTCPeerConnection\'s signalingState is \'closed\'.', 'InvalidStateError');
    }

    var streams = [].slice.call(arguments, 1);

    if (streams.length !== 1 || !streams[0].getTracks().find(function (t) {
      return t === track;
    })) {
      // this is not fully correct but all we can manage without
      // [[associated MediaStreams]] internal slot.
      throw new DOMException('The adapter.js addTrack polyfill only supports a single ' + ' stream which is associated with the specified track.', 'NotSupportedError');
    }

    var alreadyExists = this.getSenders().find(function (s) {
      return s.track === track;
    });

    if (alreadyExists) {
      throw new DOMException('Track already exists.', 'InvalidAccessError');
    }

    this._streams = this._streams || {};
    this._reverseStreams = this._reverseStreams || {};
    var oldStream = this._streams[stream.id];

    if (oldStream) {
      // this is using odd Chrome behaviour, use with caution:
      // https://bugs.chromium.org/p/webrtc/issues/detail?id=7815
      // Note: we rely on the high-level addTrack/dtmf shim to
      // create the sender with a dtmf sender.
      oldStream.addTrack(track); // Trigger ONN async.

      Promise.resolve().then(function () {
        _this13.dispatchEvent(new Event('negotiationneeded'));
      });
    } else {
      var newStream = new window.MediaStream([track]);
      this._streams[stream.id] = newStream;
      this._reverseStreams[newStream.id] = stream;
      this.addStream(newStream);
    }

    return this.getSenders().find(function (s) {
      return s.track === track;
    });
  }; // replace the internal stream id with the external one and
  // vice versa.


  function replaceInternalStreamId(pc, description) {
    var sdp = description.sdp;
    Object.keys(pc._reverseStreams || []).forEach(function (internalId) {
      var externalStream = pc._reverseStreams[internalId];
      var internalStream = pc._streams[externalStream.id];
      sdp = sdp.replace(new RegExp(internalStream.id, 'g'), externalStream.id);
    });
    return new RTCSessionDescription({
      type: description.type,
      sdp: sdp
    });
  }

  function replaceExternalStreamId(pc, description) {
    var sdp = description.sdp;
    Object.keys(pc._reverseStreams || []).forEach(function (internalId) {
      var externalStream = pc._reverseStreams[internalId];
      var internalStream = pc._streams[externalStream.id];
      sdp = sdp.replace(new RegExp(externalStream.id, 'g'), internalStream.id);
    });
    return new RTCSessionDescription({
      type: description.type,
      sdp: sdp
    });
  }

  ['createOffer', 'createAnswer'].forEach(function (method) {
    var nativeMethod = window.RTCPeerConnection.prototype[method];

    var methodObj = _defineProperty({}, method, function () {
      var _this14 = this;

      var args = arguments;
      var isLegacyCall = arguments.length && typeof arguments[0] === 'function';

      if (isLegacyCall) {
        return nativeMethod.apply(this, [function (description) {
          var desc = replaceInternalStreamId(_this14, description);
          args[0].apply(null, [desc]);
        }, function (err) {
          if (args[1]) {
            args[1].apply(null, err);
          }
        }, arguments[2]]);
      }

      return nativeMethod.apply(this, arguments).then(function (description) {
        return replaceInternalStreamId(_this14, description);
      });
    });

    window.RTCPeerConnection.prototype[method] = methodObj[method];
  });
  var origSetLocalDescription = window.RTCPeerConnection.prototype.setLocalDescription;

  window.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
    if (!arguments.length || !arguments[0].type) {
      return origSetLocalDescription.apply(this, arguments);
    }

    arguments[0] = replaceExternalStreamId(this, arguments[0]);
    return origSetLocalDescription.apply(this, arguments);
  }; // TODO: mangle getStats: https://w3c.github.io/webrtc-stats/#dom-rtcmediastreamstats-streamidentifier


  var origLocalDescription = Object.getOwnPropertyDescriptor(window.RTCPeerConnection.prototype, 'localDescription');
  Object.defineProperty(window.RTCPeerConnection.prototype, 'localDescription', {
    get: function get() {
      var description = origLocalDescription.get.apply(this);

      if (description.type === '') {
        return description;
      }

      return replaceInternalStreamId(this, description);
    }
  });

  window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
    var _this15 = this;

    if (this.signalingState === 'closed') {
      throw new DOMException('The RTCPeerConnection\'s signalingState is \'closed\'.', 'InvalidStateError');
    } // We can not yet check for sender instanceof RTCRtpSender
    // since we shim RTPSender. So we check if sender._pc is set.


    if (!sender._pc) {
      throw new DOMException('Argument 1 of RTCPeerConnection.removeTrack ' + 'does not implement interface RTCRtpSender.', 'TypeError');
    }

    var isLocal = sender._pc === this;

    if (!isLocal) {
      throw new DOMException('Sender was not created by this connection.', 'InvalidAccessError');
    } // Search for the native stream the senders track belongs to.


    this._streams = this._streams || {};
    var stream = void 0;
    Object.keys(this._streams).forEach(function (streamid) {
      var hasTrack = _this15._streams[streamid].getTracks().find(function (track) {
        return sender.track === track;
      });

      if (hasTrack) {
        stream = _this15._streams[streamid];
      }
    });

    if (stream) {
      if (stream.getTracks().length === 1) {
        // if this is the last track of the stream, remove the stream. This
        // takes care of any shimmed _senders.
        this.removeStream(this._reverseStreams[stream.id]);
      } else {
        // relying on the same odd chrome behaviour as above.
        stream.removeTrack(sender.track);
      }

      this.dispatchEvent(new Event('negotiationneeded'));
    }
  };
}

function shimPeerConnection(window) {
  var browserDetails = utils.detectBrowser(window);

  if (!window.RTCPeerConnection && window.webkitRTCPeerConnection) {
    // very basic support for old versions.
    window.RTCPeerConnection = window.webkitRTCPeerConnection;
  }

  if (!window.RTCPeerConnection) {
    return;
  }

  var addIceCandidateNullSupported = window.RTCPeerConnection.prototype.addIceCandidate.length === 0; // shim implicit creation of RTCSessionDescription/RTCIceCandidate

  if (browserDetails.version < 53) {
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'].forEach(function (method) {
      var nativeMethod = window.RTCPeerConnection.prototype[method];

      var methodObj = _defineProperty({}, method, function () {
        arguments[0] = new (method === 'addIceCandidate' ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
        return nativeMethod.apply(this, arguments);
      });

      window.RTCPeerConnection.prototype[method] = methodObj[method];
    });
  } // support for addIceCandidate(null or undefined)


  var nativeAddIceCandidate = window.RTCPeerConnection.prototype.addIceCandidate;

  window.RTCPeerConnection.prototype.addIceCandidate = function addIceCandidate() {
    if (!addIceCandidateNullSupported && !arguments[0]) {
      if (arguments[1]) {
        arguments[1].apply(null);
      }

      return Promise.resolve();
    } // Firefox 68+ emits and processes {candidate: "", ...}, ignore
    // in older versions. Native support planned for Chrome M77.


    if (browserDetails.version < 78 && arguments[0] && arguments[0].candidate === '') {
      return Promise.resolve();
    }

    return nativeAddIceCandidate.apply(this, arguments);
  };
} // Attempt to fix ONN in plan-b mode.


function fixNegotiationNeeded(window) {
  var browserDetails = utils.detectBrowser(window);
  utils.wrapPeerConnectionEvent(window, 'negotiationneeded', function (e) {
    var pc = e.target;

    if (browserDetails.version < 72 || pc.getConfiguration && pc.getConfiguration().sdpSemantics === 'plan-b') {
      if (pc.signalingState !== 'stable') {
        return;
      }
    }

    return e;
  });
}

},{"../utils.js":27,"./getdisplaymedia":16,"./getusermedia":17}],16:[function(require,module,exports){
/*
 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shimGetDisplayMedia = shimGetDisplayMedia;

function shimGetDisplayMedia(window, getSourceId) {
  if (window.navigator.mediaDevices && 'getDisplayMedia' in window.navigator.mediaDevices) {
    return;
  }

  if (!window.navigator.mediaDevices) {
    return;
  } // getSourceId is a function that returns a promise resolving with
  // the sourceId of the screen/window/tab to be shared.


  if (typeof getSourceId !== 'function') {
    console.error('shimGetDisplayMedia: getSourceId argument is not ' + 'a function');
    return;
  }

  window.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
    return getSourceId(constraints).then(function (sourceId) {
      var widthSpecified = constraints.video && constraints.video.width;
      var heightSpecified = constraints.video && constraints.video.height;
      var frameRateSpecified = constraints.video && constraints.video.frameRate;
      constraints.video = {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId,
          maxFrameRate: frameRateSpecified || 3
        }
      };

      if (widthSpecified) {
        constraints.video.mandatory.maxWidth = widthSpecified;
      }

      if (heightSpecified) {
        constraints.video.mandatory.maxHeight = heightSpecified;
      }

      return window.navigator.mediaDevices.getUserMedia(constraints);
    });
  };
}

},{}],17:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

function _typeof2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
};

exports.shimGetUserMedia = shimGetUserMedia;

var _utils = require('../utils.js');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
}

var logging = utils.log;

function shimGetUserMedia(window) {
  var navigator = window && window.navigator;

  if (!navigator.mediaDevices) {
    return;
  }

  var browserDetails = utils.detectBrowser(window);

  var constraintsToChrome_ = function constraintsToChrome_(c) {
    if ((typeof c === 'undefined' ? 'undefined' : _typeof(c)) !== 'object' || c.mandatory || c.optional) {
      return c;
    }

    var cc = {};
    Object.keys(c).forEach(function (key) {
      if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
        return;
      }

      var r = _typeof(c[key]) === 'object' ? c[key] : {
        ideal: c[key]
      };

      if (r.exact !== undefined && typeof r.exact === 'number') {
        r.min = r.max = r.exact;
      }

      var oldname_ = function oldname_(prefix, name) {
        if (prefix) {
          return prefix + name.charAt(0).toUpperCase() + name.slice(1);
        }

        return name === 'deviceId' ? 'sourceId' : name;
      };

      if (r.ideal !== undefined) {
        cc.optional = cc.optional || [];
        var oc = {};

        if (typeof r.ideal === 'number') {
          oc[oldname_('min', key)] = r.ideal;
          cc.optional.push(oc);
          oc = {};
          oc[oldname_('max', key)] = r.ideal;
          cc.optional.push(oc);
        } else {
          oc[oldname_('', key)] = r.ideal;
          cc.optional.push(oc);
        }
      }

      if (r.exact !== undefined && typeof r.exact !== 'number') {
        cc.mandatory = cc.mandatory || {};
        cc.mandatory[oldname_('', key)] = r.exact;
      } else {
        ['min', 'max'].forEach(function (mix) {
          if (r[mix] !== undefined) {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname_(mix, key)] = r[mix];
          }
        });
      }
    });

    if (c.advanced) {
      cc.optional = (cc.optional || []).concat(c.advanced);
    }

    return cc;
  };

  var shimConstraints_ = function shimConstraints_(constraints, func) {
    if (browserDetails.version >= 61) {
      return func(constraints);
    }

    constraints = JSON.parse(JSON.stringify(constraints));

    if (constraints && _typeof(constraints.audio) === 'object') {
      var remap = function remap(obj, a, b) {
        if (a in obj && !(b in obj)) {
          obj[b] = obj[a];
          delete obj[a];
        }
      };

      constraints = JSON.parse(JSON.stringify(constraints));
      remap(constraints.audio, 'autoGainControl', 'googAutoGainControl');
      remap(constraints.audio, 'noiseSuppression', 'googNoiseSuppression');
      constraints.audio = constraintsToChrome_(constraints.audio);
    }

    if (constraints && _typeof(constraints.video) === 'object') {
      // Shim facingMode for mobile & surface pro.
      var face = constraints.video.facingMode;
      face = face && ((typeof face === 'undefined' ? 'undefined' : _typeof(face)) === 'object' ? face : {
        ideal: face
      });
      var getSupportedFacingModeLies = browserDetails.version < 66;

      if (face && (face.exact === 'user' || face.exact === 'environment' || face.ideal === 'user' || face.ideal === 'environment') && !(navigator.mediaDevices.getSupportedConstraints && navigator.mediaDevices.getSupportedConstraints().facingMode && !getSupportedFacingModeLies)) {
        delete constraints.video.facingMode;
        var matches = void 0;

        if (face.exact === 'environment' || face.ideal === 'environment') {
          matches = ['back', 'rear'];
        } else if (face.exact === 'user' || face.ideal === 'user') {
          matches = ['front'];
        }

        if (matches) {
          // Look for matches in label, or use last cam for back (typical).
          return navigator.mediaDevices.enumerateDevices().then(function (devices) {
            devices = devices.filter(function (d) {
              return d.kind === 'videoinput';
            });
            var dev = devices.find(function (d) {
              return matches.some(function (match) {
                return d.label.toLowerCase().includes(match);
              });
            });

            if (!dev && devices.length && matches.includes('back')) {
              dev = devices[devices.length - 1]; // more likely the back cam
            }

            if (dev) {
              constraints.video.deviceId = face.exact ? {
                exact: dev.deviceId
              } : {
                ideal: dev.deviceId
              };
            }

            constraints.video = constraintsToChrome_(constraints.video);
            logging('chrome: ' + JSON.stringify(constraints));
            return func(constraints);
          });
        }
      }

      constraints.video = constraintsToChrome_(constraints.video);
    }

    logging('chrome: ' + JSON.stringify(constraints));
    return func(constraints);
  };

  var shimError_ = function shimError_(e) {
    if (browserDetails.version >= 64) {
      return e;
    }

    return {
      name: {
        PermissionDeniedError: 'NotAllowedError',
        PermissionDismissedError: 'NotAllowedError',
        InvalidStateError: 'NotAllowedError',
        DevicesNotFoundError: 'NotFoundError',
        ConstraintNotSatisfiedError: 'OverconstrainedError',
        TrackStartError: 'NotReadableError',
        MediaDeviceFailedDueToShutdown: 'NotAllowedError',
        MediaDeviceKillSwitchOn: 'NotAllowedError',
        TabCaptureError: 'AbortError',
        ScreenCaptureError: 'AbortError',
        DeviceCaptureError: 'AbortError'
      }[e.name] || e.name,
      message: e.message,
      constraint: e.constraint || e.constraintName,
      toString: function toString() {
        return this.name + (this.message && ': ') + this.message;
      }
    };
  };

  var getUserMedia_ = function getUserMedia_(constraints, onSuccess, onError) {
    shimConstraints_(constraints, function (c) {
      navigator.webkitGetUserMedia(c, onSuccess, function (e) {
        if (onError) {
          onError(shimError_(e));
        }
      });
    });
  };

  navigator.getUserMedia = getUserMedia_.bind(navigator); // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
  // function which returns a Promise, it does not accept spec-style
  // constraints.

  if (navigator.mediaDevices.getUserMedia) {
    var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

    navigator.mediaDevices.getUserMedia = function (cs) {
      return shimConstraints_(cs, function (c) {
        return origGetUserMedia(c).then(function (stream) {
          if (c.audio && !stream.getAudioTracks().length || c.video && !stream.getVideoTracks().length) {
            stream.getTracks().forEach(function (track) {
              track.stop();
            });
            throw new DOMException('', 'NotFoundError');
          }

          return stream;
        }, function (e) {
          return Promise.reject(shimError_(e));
        });
      });
    };
  }
}

},{"../utils.js":27}],18:[function(require,module,exports){
/*
 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

function _typeof2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
};

exports.shimRTCIceCandidate = shimRTCIceCandidate;
exports.shimMaxMessageSize = shimMaxMessageSize;
exports.shimSendThrowTypeError = shimSendThrowTypeError;
exports.shimConnectionState = shimConnectionState;
exports.removeAllowExtmapMixed = removeAllowExtmapMixed;

var _sdp = require('sdp');

var _sdp2 = _interopRequireDefault(_sdp);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

function shimRTCIceCandidate(window) {
  // foundation is arbitrarily chosen as an indicator for full support for
  // https://w3c.github.io/webrtc-pc/#rtcicecandidate-interface
  if (!window.RTCIceCandidate || window.RTCIceCandidate && 'foundation' in window.RTCIceCandidate.prototype) {
    return;
  }

  var NativeRTCIceCandidate = window.RTCIceCandidate;

  window.RTCIceCandidate = function RTCIceCandidate(args) {
    // Remove the a= which shouldn't be part of the candidate string.
    if ((typeof args === 'undefined' ? 'undefined' : _typeof(args)) === 'object' && args.candidate && args.candidate.indexOf('a=') === 0) {
      args = JSON.parse(JSON.stringify(args));
      args.candidate = args.candidate.substr(2);
    }

    if (args.candidate && args.candidate.length) {
      // Augment the native candidate with the parsed fields.
      var nativeCandidate = new NativeRTCIceCandidate(args);

      var parsedCandidate = _sdp2["default"].parseCandidate(args.candidate);

      var augmentedCandidate = Object.assign(nativeCandidate, parsedCandidate); // Add a serializer that does not serialize the extra attributes.

      augmentedCandidate.toJSON = function toJSON() {
        return {
          candidate: augmentedCandidate.candidate,
          sdpMid: augmentedCandidate.sdpMid,
          sdpMLineIndex: augmentedCandidate.sdpMLineIndex,
          usernameFragment: augmentedCandidate.usernameFragment
        };
      };

      return augmentedCandidate;
    }

    return new NativeRTCIceCandidate(args);
  };

  window.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype; // Hook up the augmented candidate in onicecandidate and
  // addEventListener('icecandidate', ...)

  utils.wrapPeerConnectionEvent(window, 'icecandidate', function (e) {
    if (e.candidate) {
      Object.defineProperty(e, 'candidate', {
        value: new window.RTCIceCandidate(e.candidate),
        writable: 'false'
      });
    }

    return e;
  });
}

function shimMaxMessageSize(window) {
  if (!window.RTCPeerConnection) {
    return;
  }

  var browserDetails = utils.detectBrowser(window);

  if (!('sctp' in window.RTCPeerConnection.prototype)) {
    Object.defineProperty(window.RTCPeerConnection.prototype, 'sctp', {
      get: function get() {
        return typeof this._sctp === 'undefined' ? null : this._sctp;
      }
    });
  }

  var sctpInDescription = function sctpInDescription(description) {
    if (!description || !description.sdp) {
      return false;
    }

    var sections = _sdp2["default"].splitSections(description.sdp);

    sections.shift();
    return sections.some(function (mediaSection) {
      var mLine = _sdp2["default"].parseMLine(mediaSection);

      return mLine && mLine.kind === 'application' && mLine.protocol.indexOf('SCTP') !== -1;
    });
  };

  var getRemoteFirefoxVersion = function getRemoteFirefoxVersion(description) {
    // TODO: Is there a better solution for detecting Firefox?
    var match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);

    if (match === null || match.length < 2) {
      return -1;
    }

    var version = parseInt(match[1], 10); // Test for NaN (yes, this is ugly)

    return version !== version ? -1 : version;
  };

  var getCanSendMaxMessageSize = function getCanSendMaxMessageSize(remoteIsFirefox) {
    // Every implementation we know can send at least 64 KiB.
    // Note: Although Chrome is technically able to send up to 256 KiB, the
    //       data does not reach the other peer reliably.
    //       See: https://bugs.chromium.org/p/webrtc/issues/detail?id=8419
    var canSendMaxMessageSize = 65536;

    if (browserDetails.browser === 'firefox') {
      if (browserDetails.version < 57) {
        if (remoteIsFirefox === -1) {
          // FF < 57 will send in 16 KiB chunks using the deprecated PPID
          // fragmentation.
          canSendMaxMessageSize = 16384;
        } else {
          // However, other FF (and RAWRTC) can reassemble PPID-fragmented
          // messages. Thus, supporting ~2 GiB when sending.
          canSendMaxMessageSize = 2147483637;
        }
      } else if (browserDetails.version < 60) {
        // Currently, all FF >= 57 will reset the remote maximum message size
        // to the default value when a data channel is created at a later
        // stage. :(
        // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
        canSendMaxMessageSize = browserDetails.version === 57 ? 65535 : 65536;
      } else {
        // FF >= 60 supports sending ~2 GiB
        canSendMaxMessageSize = 2147483637;
      }
    }

    return canSendMaxMessageSize;
  };

  var getMaxMessageSize = function getMaxMessageSize(description, remoteIsFirefox) {
    // Note: 65536 bytes is the default value from the SDP spec. Also,
    //       every implementation we know supports receiving 65536 bytes.
    var maxMessageSize = 65536; // FF 57 has a slightly incorrect default remote max message size, so
    // we need to adjust it here to avoid a failure when sending.
    // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1425697

    if (browserDetails.browser === 'firefox' && browserDetails.version === 57) {
      maxMessageSize = 65535;
    }

    var match = _sdp2["default"].matchPrefix(description.sdp, 'a=max-message-size:');

    if (match.length > 0) {
      maxMessageSize = parseInt(match[0].substr(19), 10);
    } else if (browserDetails.browser === 'firefox' && remoteIsFirefox !== -1) {
      // If the maximum message size is not present in the remote SDP and
      // both local and remote are Firefox, the remote peer can receive
      // ~2 GiB.
      maxMessageSize = 2147483637;
    }

    return maxMessageSize;
  };

  var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;

  window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
    this._sctp = null; // Chrome decided to not expose .sctp in plan-b mode.
    // As usual, adapter.js has to do an 'ugly worakaround'
    // to cover up the mess.

    if (browserDetails.browser === 'chrome' && browserDetails.version >= 76) {
      var _getConfiguration = this.getConfiguration(),
          sdpSemantics = _getConfiguration.sdpSemantics;

      if (sdpSemantics === 'plan-b') {
        Object.defineProperty(this, 'sctp', {
          get: function get() {
            return typeof this._sctp === 'undefined' ? null : this._sctp;
          },
          enumerable: true,
          configurable: true
        });
      }
    }

    if (sctpInDescription(arguments[0])) {
      // Check if the remote is FF.
      var isFirefox = getRemoteFirefoxVersion(arguments[0]); // Get the maximum message size the local peer is capable of sending

      var canSendMMS = getCanSendMaxMessageSize(isFirefox); // Get the maximum message size of the remote peer.

      var remoteMMS = getMaxMessageSize(arguments[0], isFirefox); // Determine final maximum message size

      var maxMessageSize = void 0;

      if (canSendMMS === 0 && remoteMMS === 0) {
        maxMessageSize = Number.POSITIVE_INFINITY;
      } else if (canSendMMS === 0 || remoteMMS === 0) {
        maxMessageSize = Math.max(canSendMMS, remoteMMS);
      } else {
        maxMessageSize = Math.min(canSendMMS, remoteMMS);
      } // Create a dummy RTCSctpTransport object and the 'maxMessageSize'
      // attribute.


      var sctp = {};
      Object.defineProperty(sctp, 'maxMessageSize', {
        get: function get() {
          return maxMessageSize;
        }
      });
      this._sctp = sctp;
    }

    return origSetRemoteDescription.apply(this, arguments);
  };
}

function shimSendThrowTypeError(window) {
  if (!(window.RTCPeerConnection && 'createDataChannel' in window.RTCPeerConnection.prototype)) {
    return;
  } // Note: Although Firefox >= 57 has a native implementation, the maximum
  //       message size can be reset for all data channels at a later stage.
  //       See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831


  function wrapDcSend(dc, pc) {
    var origDataChannelSend = dc.send;

    dc.send = function send() {
      var data = arguments[0];
      var length = data.length || data.size || data.byteLength;

      if (dc.readyState === 'open' && pc.sctp && length > pc.sctp.maxMessageSize) {
        throw new TypeError('Message too large (can send a maximum of ' + pc.sctp.maxMessageSize + ' bytes)');
      }

      return origDataChannelSend.apply(dc, arguments);
    };
  }

  var origCreateDataChannel = window.RTCPeerConnection.prototype.createDataChannel;

  window.RTCPeerConnection.prototype.createDataChannel = function createDataChannel() {
    var dataChannel = origCreateDataChannel.apply(this, arguments);
    wrapDcSend(dataChannel, this);
    return dataChannel;
  };

  utils.wrapPeerConnectionEvent(window, 'datachannel', function (e) {
    wrapDcSend(e.channel, e.target);
    return e;
  });
}
/* shims RTCConnectionState by pretending it is the same as iceConnectionState.
 * See https://bugs.chromium.org/p/webrtc/issues/detail?id=6145#c12
 * for why this is a valid hack in Chrome. In Firefox it is slightly incorrect
 * since DTLS failures would be hidden. See
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1265827
 * for the Firefox tracking bug.
 */


function shimConnectionState(window) {
  if (!window.RTCPeerConnection || 'connectionState' in window.RTCPeerConnection.prototype) {
    return;
  }

  var proto = window.RTCPeerConnection.prototype;
  Object.defineProperty(proto, 'connectionState', {
    get: function get() {
      return {
        completed: 'connected',
        checking: 'connecting'
      }[this.iceConnectionState] || this.iceConnectionState;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, 'onconnectionstatechange', {
    get: function get() {
      return this._onconnectionstatechange || null;
    },
    set: function set(cb) {
      if (this._onconnectionstatechange) {
        this.removeEventListener('connectionstatechange', this._onconnectionstatechange);
        delete this._onconnectionstatechange;
      }

      if (cb) {
        this.addEventListener('connectionstatechange', this._onconnectionstatechange = cb);
      }
    },
    enumerable: true,
    configurable: true
  });
  ['setLocalDescription', 'setRemoteDescription'].forEach(function (method) {
    var origMethod = proto[method];

    proto[method] = function () {
      if (!this._connectionstatechangepoly) {
        this._connectionstatechangepoly = function (e) {
          var pc = e.target;

          if (pc._lastConnectionState !== pc.connectionState) {
            pc._lastConnectionState = pc.connectionState;
            var newEvent = new Event('connectionstatechange', e);
            pc.dispatchEvent(newEvent);
          }

          return e;
        };

        this.addEventListener('iceconnectionstatechange', this._connectionstatechangepoly);
      }

      return origMethod.apply(this, arguments);
    };
  });
}

function removeAllowExtmapMixed(window) {
  /* remove a=extmap-allow-mixed for webrtc.org < M71 */
  if (!window.RTCPeerConnection) {
    return;
  }

  var browserDetails = utils.detectBrowser(window);

  if (browserDetails.browser === 'chrome' && browserDetails.version >= 71) {
    return;
  }

  if (browserDetails.browser === 'safari' && browserDetails.version >= 605) {
    return;
  }

  var nativeSRD = window.RTCPeerConnection.prototype.setRemoteDescription;

  window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription(desc) {
    if (desc && desc.sdp && desc.sdp.indexOf('\na=extmap-allow-mixed') !== -1) {
      desc.sdp = desc.sdp.split('\n').filter(function (line) {
        return line.trim() !== 'a=extmap-allow-mixed';
      }).join('\n');
    }

    return nativeSRD.apply(this, arguments);
  };
}

},{"./utils":27,"sdp":7}],19:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shimGetDisplayMedia = exports.shimGetUserMedia = undefined;

var _getusermedia = require('./getusermedia');

Object.defineProperty(exports, 'shimGetUserMedia', {
  enumerable: true,
  get: function get() {
    return _getusermedia.shimGetUserMedia;
  }
});

var _getdisplaymedia = require('./getdisplaymedia');

Object.defineProperty(exports, 'shimGetDisplayMedia', {
  enumerable: true,
  get: function get() {
    return _getdisplaymedia.shimGetDisplayMedia;
  }
});
exports.shimPeerConnection = shimPeerConnection;
exports.shimReplaceTrack = shimReplaceTrack;

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

var _filtericeservers = require('./filtericeservers');

var _rtcpeerconnectionShim = require('rtcpeerconnection-shim');

var _rtcpeerconnectionShim2 = _interopRequireDefault(_rtcpeerconnectionShim);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
}

function shimPeerConnection(window) {
  var browserDetails = utils.detectBrowser(window);

  if (window.RTCIceGatherer) {
    if (!window.RTCIceCandidate) {
      window.RTCIceCandidate = function RTCIceCandidate(args) {
        return args;
      };
    }

    if (!window.RTCSessionDescription) {
      window.RTCSessionDescription = function RTCSessionDescription(args) {
        return args;
      };
    } // this adds an additional event listener to MediaStrackTrack that signals
    // when a tracks enabled property was changed. Workaround for a bug in
    // addStream, see below. No longer required in 15025+


    if (browserDetails.version < 15025) {
      var origMSTEnabled = Object.getOwnPropertyDescriptor(window.MediaStreamTrack.prototype, 'enabled');
      Object.defineProperty(window.MediaStreamTrack.prototype, 'enabled', {
        set: function set(value) {
          origMSTEnabled.set.call(this, value);
          var ev = new Event('enabled');
          ev.enabled = value;
          this.dispatchEvent(ev);
        }
      });
    }
  } // ORTC defines the DTMF sender a bit different.
  // https://github.com/w3c/ortc/issues/714


  if (window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
    Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
      get: function get() {
        if (this._dtmf === undefined) {
          if (this.track.kind === 'audio') {
            this._dtmf = new window.RTCDtmfSender(this);
          } else if (this.track.kind === 'video') {
            this._dtmf = null;
          }
        }

        return this._dtmf;
      }
    });
  } // Edge currently only implements the RTCDtmfSender, not the
  // RTCDTMFSender alias. See http://draft.ortc.org/#rtcdtmfsender2*


  if (window.RTCDtmfSender && !window.RTCDTMFSender) {
    window.RTCDTMFSender = window.RTCDtmfSender;
  }

  var RTCPeerConnectionShim = (0, _rtcpeerconnectionShim2["default"])(window, browserDetails.version);

  window.RTCPeerConnection = function RTCPeerConnection(config) {
    if (config && config.iceServers) {
      config.iceServers = (0, _filtericeservers.filterIceServers)(config.iceServers, browserDetails.version);
      utils.log('ICE servers after filtering:', config.iceServers);
    }

    return new RTCPeerConnectionShim(config);
  };

  window.RTCPeerConnection.prototype = RTCPeerConnectionShim.prototype;
}

function shimReplaceTrack(window) {
  // ORTC has replaceTrack -- https://github.com/w3c/ortc/issues/614
  if (window.RTCRtpSender && !('replaceTrack' in window.RTCRtpSender.prototype)) {
    window.RTCRtpSender.prototype.replaceTrack = window.RTCRtpSender.prototype.setTrack;
  }
}

},{"../utils":27,"./filtericeservers":20,"./getdisplaymedia":21,"./getusermedia":22,"rtcpeerconnection-shim":6}],20:[function(require,module,exports){
/*
 *  Copyright (c) 2018 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterIceServers = filterIceServers;

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
} // Edge does not like
// 1) stun: filtered after 14393 unless ?transport=udp is present
// 2) turn: that does not have all of turn:host:port?transport=udp
// 3) turn: with ipv6 addresses
// 4) turn: occurring muliple times


function filterIceServers(iceServers, edgeVersion) {
  var hasTurn = false;
  iceServers = JSON.parse(JSON.stringify(iceServers));
  return iceServers.filter(function (server) {
    if (server && (server.urls || server.url)) {
      var urls = server.urls || server.url;

      if (server.url && !server.urls) {
        utils.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
      }

      var isString = typeof urls === 'string';

      if (isString) {
        urls = [urls];
      }

      urls = urls.filter(function (url) {
        // filter STUN unconditionally.
        if (url.indexOf('stun:') === 0) {
          return false;
        }

        var validTurn = url.startsWith('turn') && !url.startsWith('turn:[') && url.includes('transport=udp');

        if (validTurn && !hasTurn) {
          hasTurn = true;
          return true;
        }

        return validTurn && !hasTurn;
      });
      delete server.url;
      server.urls = isString ? urls[0] : urls;
      return !!urls.length;
    }
  });
}

},{"../utils":27}],21:[function(require,module,exports){
/*
 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shimGetDisplayMedia = shimGetDisplayMedia;

function shimGetDisplayMedia(window) {
  if (!('getDisplayMedia' in window.navigator)) {
    return;
  }

  if (!window.navigator.mediaDevices) {
    return;
  }

  if (window.navigator.mediaDevices && 'getDisplayMedia' in window.navigator.mediaDevices) {
    return;
  }

  window.navigator.mediaDevices.getDisplayMedia = window.navigator.getDisplayMedia.bind(window.navigator);
}

},{}],22:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shimGetUserMedia = shimGetUserMedia;

function shimGetUserMedia(window) {
  var navigator = window && window.navigator;

  var shimError_ = function shimError_(e) {
    return {
      name: {
        PermissionDeniedError: 'NotAllowedError'
      }[e.name] || e.name,
      message: e.message,
      constraint: e.constraint,
      toString: function toString() {
        return this.name;
      }
    };
  }; // getUserMedia error shim.


  var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

  navigator.mediaDevices.getUserMedia = function (c) {
    return origGetUserMedia(c)["catch"](function (e) {
      return Promise.reject(shimError_(e));
    });
  };
}

},{}],23:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

function _typeof2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shimGetDisplayMedia = exports.shimGetUserMedia = undefined;

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
};

var _getusermedia = require('./getusermedia');

Object.defineProperty(exports, 'shimGetUserMedia', {
  enumerable: true,
  get: function get() {
    return _getusermedia.shimGetUserMedia;
  }
});

var _getdisplaymedia = require('./getdisplaymedia');

Object.defineProperty(exports, 'shimGetDisplayMedia', {
  enumerable: true,
  get: function get() {
    return _getdisplaymedia.shimGetDisplayMedia;
  }
});
exports.shimOnTrack = shimOnTrack;
exports.shimPeerConnection = shimPeerConnection;
exports.shimSenderGetStats = shimSenderGetStats;
exports.shimReceiverGetStats = shimReceiverGetStats;
exports.shimRemoveStream = shimRemoveStream;
exports.shimRTCDataChannel = shimRTCDataChannel;
exports.shimAddTransceiver = shimAddTransceiver;
exports.shimGetParameters = shimGetParameters;
exports.shimCreateOffer = shimCreateOffer;
exports.shimCreateAnswer = shimCreateAnswer;

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function shimOnTrack(window) {
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCTrackEvent && 'receiver' in window.RTCTrackEvent.prototype && !('transceiver' in window.RTCTrackEvent.prototype)) {
    Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
      get: function get() {
        return {
          receiver: this.receiver
        };
      }
    });
  }
}

function shimPeerConnection(window) {
  var browserDetails = utils.detectBrowser(window);

  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !(window.RTCPeerConnection || window.mozRTCPeerConnection)) {
    return; // probably media.peerconnection.enabled=false in about:config
  }

  if (!window.RTCPeerConnection && window.mozRTCPeerConnection) {
    // very basic support for old versions.
    window.RTCPeerConnection = window.mozRTCPeerConnection;
  }

  if (browserDetails.version < 53) {
    // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'].forEach(function (method) {
      var nativeMethod = window.RTCPeerConnection.prototype[method];

      var methodObj = _defineProperty({}, method, function () {
        arguments[0] = new (method === 'addIceCandidate' ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
        return nativeMethod.apply(this, arguments);
      });

      window.RTCPeerConnection.prototype[method] = methodObj[method];
    });
  } // support for addIceCandidate(null or undefined)
  // as well as ignoring {sdpMid, candidate: ""}


  if (browserDetails.version < 68) {
    var nativeAddIceCandidate = window.RTCPeerConnection.prototype.addIceCandidate;

    window.RTCPeerConnection.prototype.addIceCandidate = function addIceCandidate() {
      if (!arguments[0]) {
        if (arguments[1]) {
          arguments[1].apply(null);
        }

        return Promise.resolve();
      } // Firefox 68+ emits and processes {candidate: "", ...}, ignore
      // in older versions.


      if (arguments[0] && arguments[0].candidate === '') {
        return Promise.resolve();
      }

      return nativeAddIceCandidate.apply(this, arguments);
    };
  }

  var modernStatsTypes = {
    inboundrtp: 'inbound-rtp',
    outboundrtp: 'outbound-rtp',
    candidatepair: 'candidate-pair',
    localcandidate: 'local-candidate',
    remotecandidate: 'remote-candidate'
  };
  var nativeGetStats = window.RTCPeerConnection.prototype.getStats;

  window.RTCPeerConnection.prototype.getStats = function getStats() {
    var _arguments = Array.prototype.slice.call(arguments),
        selector = _arguments[0],
        onSucc = _arguments[1],
        onErr = _arguments[2];

    return nativeGetStats.apply(this, [selector || null]).then(function (stats) {
      if (browserDetails.version < 53 && !onSucc) {
        // Shim only promise getStats with spec-hyphens in type names
        // Leave callback version alone; misc old uses of forEach before Map
        try {
          stats.forEach(function (stat) {
            stat.type = modernStatsTypes[stat.type] || stat.type;
          });
        } catch (e) {
          if (e.name !== 'TypeError') {
            throw e;
          } // Avoid TypeError: "type" is read-only, in old versions. 34-43ish


          stats.forEach(function (stat, i) {
            stats.set(i, Object.assign({}, stat, {
              type: modernStatsTypes[stat.type] || stat.type
            }));
          });
        }
      }

      return stats;
    }).then(onSucc, onErr);
  };
}

function shimSenderGetStats(window) {
  if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && window.RTCRtpSender)) {
    return;
  }

  if (window.RTCRtpSender && 'getStats' in window.RTCRtpSender.prototype) {
    return;
  }

  var origGetSenders = window.RTCPeerConnection.prototype.getSenders;

  if (origGetSenders) {
    window.RTCPeerConnection.prototype.getSenders = function getSenders() {
      var _this = this;

      var senders = origGetSenders.apply(this, []);
      senders.forEach(function (sender) {
        return sender._pc = _this;
      });
      return senders;
    };
  }

  var origAddTrack = window.RTCPeerConnection.prototype.addTrack;

  if (origAddTrack) {
    window.RTCPeerConnection.prototype.addTrack = function addTrack() {
      var sender = origAddTrack.apply(this, arguments);
      sender._pc = this;
      return sender;
    };
  }

  window.RTCRtpSender.prototype.getStats = function getStats() {
    return this.track ? this._pc.getStats(this.track) : Promise.resolve(new Map());
  };
}

function shimReceiverGetStats(window) {
  if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && window.RTCRtpSender)) {
    return;
  }

  if (window.RTCRtpSender && 'getStats' in window.RTCRtpReceiver.prototype) {
    return;
  }

  var origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;

  if (origGetReceivers) {
    window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
      var _this2 = this;

      var receivers = origGetReceivers.apply(this, []);
      receivers.forEach(function (receiver) {
        return receiver._pc = _this2;
      });
      return receivers;
    };
  }

  utils.wrapPeerConnectionEvent(window, 'track', function (e) {
    e.receiver._pc = e.srcElement;
    return e;
  });

  window.RTCRtpReceiver.prototype.getStats = function getStats() {
    return this._pc.getStats(this.track);
  };
}

function shimRemoveStream(window) {
  if (!window.RTCPeerConnection || 'removeStream' in window.RTCPeerConnection.prototype) {
    return;
  }

  window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
    var _this3 = this;

    utils.deprecated('removeStream', 'removeTrack');
    this.getSenders().forEach(function (sender) {
      if (sender.track && stream.getTracks().includes(sender.track)) {
        _this3.removeTrack(sender);
      }
    });
  };
}

function shimRTCDataChannel(window) {
  // rename DataChannel to RTCDataChannel (native fix in FF60):
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1173851
  if (window.DataChannel && !window.RTCDataChannel) {
    window.RTCDataChannel = window.DataChannel;
  }
}

function shimAddTransceiver(window) {
  // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
  // Firefox ignores the init sendEncodings options passed to addTransceiver
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
  if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection)) {
    return;
  }

  var origAddTransceiver = window.RTCPeerConnection.prototype.addTransceiver;

  if (origAddTransceiver) {
    window.RTCPeerConnection.prototype.addTransceiver = function addTransceiver() {
      this.setParametersPromises = [];
      var initParameters = arguments[1];
      var shouldPerformCheck = initParameters && 'sendEncodings' in initParameters;

      if (shouldPerformCheck) {
        // If sendEncodings params are provided, validate grammar
        initParameters.sendEncodings.forEach(function (encodingParam) {
          if ('rid' in encodingParam) {
            var ridRegex = /^[a-z0-9]{0,16}$/i;

            if (!ridRegex.test(encodingParam.rid)) {
              throw new TypeError('Invalid RID value provided.');
            }
          }

          if ('scaleResolutionDownBy' in encodingParam) {
            if (!(parseFloat(encodingParam.scaleResolutionDownBy) >= 1.0)) {
              throw new RangeError('scale_resolution_down_by must be >= 1.0');
            }
          }

          if ('maxFramerate' in encodingParam) {
            if (!(parseFloat(encodingParam.maxFramerate) >= 0)) {
              throw new RangeError('max_framerate must be >= 0.0');
            }
          }
        });
      }

      var transceiver = origAddTransceiver.apply(this, arguments);

      if (shouldPerformCheck) {
        // Check if the init options were applied. If not we do this in an
        // asynchronous way and save the promise reference in a global object.
        // This is an ugly hack, but at the same time is way more robust than
        // checking the sender parameters before and after the createOffer
        // Also note that after the createoffer we are not 100% sure that
        // the params were asynchronously applied so we might miss the
        // opportunity to recreate offer.
        var sender = transceiver.sender;
        var params = sender.getParameters();

        if (!('encodings' in params) || // Avoid being fooled by patched getParameters() below.
        params.encodings.length === 1 && Object.keys(params.encodings[0]).length === 0) {
          params.encodings = initParameters.sendEncodings;
          sender.sendEncodings = initParameters.sendEncodings;
          this.setParametersPromises.push(sender.setParameters(params).then(function () {
            delete sender.sendEncodings;
          })["catch"](function () {
            delete sender.sendEncodings;
          }));
        }
      }

      return transceiver;
    };
  }
}

function shimGetParameters(window) {
  if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCRtpSender)) {
    return;
  }

  var origGetParameters = window.RTCRtpSender.prototype.getParameters;

  if (origGetParameters) {
    window.RTCRtpSender.prototype.getParameters = function getParameters() {
      var params = origGetParameters.apply(this, arguments);

      if (!('encodings' in params)) {
        params.encodings = [].concat(this.sendEncodings || [{}]);
      }

      return params;
    };
  }
}

function shimCreateOffer(window) {
  // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
  // Firefox ignores the init sendEncodings options passed to addTransceiver
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
  if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection)) {
    return;
  }

  var origCreateOffer = window.RTCPeerConnection.prototype.createOffer;

  window.RTCPeerConnection.prototype.createOffer = function createOffer() {
    var _this4 = this,
        _arguments2 = arguments;

    if (this.setParametersPromises && this.setParametersPromises.length) {
      return Promise.all(this.setParametersPromises).then(function () {
        return origCreateOffer.apply(_this4, _arguments2);
      })["finally"](function () {
        _this4.setParametersPromises = [];
      });
    }

    return origCreateOffer.apply(this, arguments);
  };
}

function shimCreateAnswer(window) {
  // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
  // Firefox ignores the init sendEncodings options passed to addTransceiver
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
  if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection)) {
    return;
  }

  var origCreateAnswer = window.RTCPeerConnection.prototype.createAnswer;

  window.RTCPeerConnection.prototype.createAnswer = function createAnswer() {
    var _this5 = this,
        _arguments3 = arguments;

    if (this.setParametersPromises && this.setParametersPromises.length) {
      return Promise.all(this.setParametersPromises).then(function () {
        return origCreateAnswer.apply(_this5, _arguments3);
      })["finally"](function () {
        _this5.setParametersPromises = [];
      });
    }

    return origCreateAnswer.apply(this, arguments);
  };
}

},{"../utils":27,"./getdisplaymedia":24,"./getusermedia":25}],24:[function(require,module,exports){
/*
 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shimGetDisplayMedia = shimGetDisplayMedia;

function shimGetDisplayMedia(window, preferredMediaSource) {
  if (window.navigator.mediaDevices && 'getDisplayMedia' in window.navigator.mediaDevices) {
    return;
  }

  if (!window.navigator.mediaDevices) {
    return;
  }

  window.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
    if (!(constraints && constraints.video)) {
      var err = new DOMException('getDisplayMedia without video ' + 'constraints is undefined');
      err.name = 'NotFoundError'; // from https://heycam.github.io/webidl/#idl-DOMException-error-names

      err.code = 8;
      return Promise.reject(err);
    }

    if (constraints.video === true) {
      constraints.video = {
        mediaSource: preferredMediaSource
      };
    } else {
      constraints.video.mediaSource = preferredMediaSource;
    }

    return window.navigator.mediaDevices.getUserMedia(constraints);
  };
}

},{}],25:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

function _typeof2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
};

exports.shimGetUserMedia = shimGetUserMedia;

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
}

function shimGetUserMedia(window) {
  var browserDetails = utils.detectBrowser(window);
  var navigator = window && window.navigator;
  var MediaStreamTrack = window && window.MediaStreamTrack;

  navigator.getUserMedia = function (constraints, onSuccess, onError) {
    // Replace Firefox 44+'s deprecation warning with unprefixed version.
    utils.deprecated('navigator.getUserMedia', 'navigator.mediaDevices.getUserMedia');
    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
  };

  if (!(browserDetails.version > 55 && 'autoGainControl' in navigator.mediaDevices.getSupportedConstraints())) {
    var remap = function remap(obj, a, b) {
      if (a in obj && !(b in obj)) {
        obj[b] = obj[a];
        delete obj[a];
      }
    };

    var nativeGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

    navigator.mediaDevices.getUserMedia = function (c) {
      if ((typeof c === 'undefined' ? 'undefined' : _typeof(c)) === 'object' && _typeof(c.audio) === 'object') {
        c = JSON.parse(JSON.stringify(c));
        remap(c.audio, 'autoGainControl', 'mozAutoGainControl');
        remap(c.audio, 'noiseSuppression', 'mozNoiseSuppression');
      }

      return nativeGetUserMedia(c);
    };

    if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
      var nativeGetSettings = MediaStreamTrack.prototype.getSettings;

      MediaStreamTrack.prototype.getSettings = function () {
        var obj = nativeGetSettings.apply(this, arguments);
        remap(obj, 'mozAutoGainControl', 'autoGainControl');
        remap(obj, 'mozNoiseSuppression', 'noiseSuppression');
        return obj;
      };
    }

    if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
      var nativeApplyConstraints = MediaStreamTrack.prototype.applyConstraints;

      MediaStreamTrack.prototype.applyConstraints = function (c) {
        if (this.kind === 'audio' && (typeof c === 'undefined' ? 'undefined' : _typeof(c)) === 'object') {
          c = JSON.parse(JSON.stringify(c));
          remap(c, 'autoGainControl', 'mozAutoGainControl');
          remap(c, 'noiseSuppression', 'mozNoiseSuppression');
        }

        return nativeApplyConstraints.apply(this, [c]);
      };
    }
  }
}

},{"../utils":27}],26:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
'use strict';

function _typeof2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
};

exports.shimLocalStreamsAPI = shimLocalStreamsAPI;
exports.shimRemoteStreamsAPI = shimRemoteStreamsAPI;
exports.shimCallbacksAPI = shimCallbacksAPI;
exports.shimGetUserMedia = shimGetUserMedia;
exports.shimConstraints = shimConstraints;
exports.shimRTCIceServerUrls = shimRTCIceServerUrls;
exports.shimTrackEventTransceiver = shimTrackEventTransceiver;
exports.shimCreateOfferLegacy = shimCreateOfferLegacy;
exports.shimAudioContext = shimAudioContext;

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
}

function shimLocalStreamsAPI(window) {
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !window.RTCPeerConnection) {
    return;
  }

  if (!('getLocalStreams' in window.RTCPeerConnection.prototype)) {
    window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
      if (!this._localStreams) {
        this._localStreams = [];
      }

      return this._localStreams;
    };
  }

  if (!('addStream' in window.RTCPeerConnection.prototype)) {
    var _addTrack = window.RTCPeerConnection.prototype.addTrack;

    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      var _this = this;

      if (!this._localStreams) {
        this._localStreams = [];
      }

      if (!this._localStreams.includes(stream)) {
        this._localStreams.push(stream);
      } // Try to emulate Chrome's behaviour of adding in audio-video order.
      // Safari orders by track id.


      stream.getAudioTracks().forEach(function (track) {
        return _addTrack.call(_this, track, stream);
      });
      stream.getVideoTracks().forEach(function (track) {
        return _addTrack.call(_this, track, stream);
      });
    };

    window.RTCPeerConnection.prototype.addTrack = function addTrack(track) {
      var _this2 = this;

      for (var _len = arguments.length, streams = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        streams[_key - 1] = arguments[_key];
      }

      if (streams) {
        streams.forEach(function (stream) {
          if (!_this2._localStreams) {
            _this2._localStreams = [stream];
          } else if (!_this2._localStreams.includes(stream)) {
            _this2._localStreams.push(stream);
          }
        });
      }

      return _addTrack.apply(this, arguments);
    };
  }

  if (!('removeStream' in window.RTCPeerConnection.prototype)) {
    window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
      var _this3 = this;

      if (!this._localStreams) {
        this._localStreams = [];
      }

      var index = this._localStreams.indexOf(stream);

      if (index === -1) {
        return;
      }

      this._localStreams.splice(index, 1);

      var tracks = stream.getTracks();
      this.getSenders().forEach(function (sender) {
        if (tracks.includes(sender.track)) {
          _this3.removeTrack(sender);
        }
      });
    };
  }
}

function shimRemoteStreamsAPI(window) {
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !window.RTCPeerConnection) {
    return;
  }

  if (!('getRemoteStreams' in window.RTCPeerConnection.prototype)) {
    window.RTCPeerConnection.prototype.getRemoteStreams = function getRemoteStreams() {
      return this._remoteStreams ? this._remoteStreams : [];
    };
  }

  if (!('onaddstream' in window.RTCPeerConnection.prototype)) {
    Object.defineProperty(window.RTCPeerConnection.prototype, 'onaddstream', {
      get: function get() {
        return this._onaddstream;
      },
      set: function set(f) {
        var _this4 = this;

        if (this._onaddstream) {
          this.removeEventListener('addstream', this._onaddstream);
          this.removeEventListener('track', this._onaddstreampoly);
        }

        this.addEventListener('addstream', this._onaddstream = f);
        this.addEventListener('track', this._onaddstreampoly = function (e) {
          e.streams.forEach(function (stream) {
            if (!_this4._remoteStreams) {
              _this4._remoteStreams = [];
            }

            if (_this4._remoteStreams.includes(stream)) {
              return;
            }

            _this4._remoteStreams.push(stream);

            var event = new Event('addstream');
            event.stream = stream;

            _this4.dispatchEvent(event);
          });
        });
      }
    });
    var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;

    window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
      var pc = this;

      if (!this._onaddstreampoly) {
        this.addEventListener('track', this._onaddstreampoly = function (e) {
          e.streams.forEach(function (stream) {
            if (!pc._remoteStreams) {
              pc._remoteStreams = [];
            }

            if (pc._remoteStreams.indexOf(stream) >= 0) {
              return;
            }

            pc._remoteStreams.push(stream);

            var event = new Event('addstream');
            event.stream = stream;
            pc.dispatchEvent(event);
          });
        });
      }

      return origSetRemoteDescription.apply(pc, arguments);
    };
  }
}

function shimCallbacksAPI(window) {
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !window.RTCPeerConnection) {
    return;
  }

  var prototype = window.RTCPeerConnection.prototype;
  var origCreateOffer = prototype.createOffer;
  var origCreateAnswer = prototype.createAnswer;
  var setLocalDescription = prototype.setLocalDescription;
  var setRemoteDescription = prototype.setRemoteDescription;
  var addIceCandidate = prototype.addIceCandidate;

  prototype.createOffer = function createOffer(successCallback, failureCallback) {
    var options = arguments.length >= 2 ? arguments[2] : arguments[0];
    var promise = origCreateOffer.apply(this, [options]);

    if (!failureCallback) {
      return promise;
    }

    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };

  prototype.createAnswer = function createAnswer(successCallback, failureCallback) {
    var options = arguments.length >= 2 ? arguments[2] : arguments[0];
    var promise = origCreateAnswer.apply(this, [options]);

    if (!failureCallback) {
      return promise;
    }

    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };

  var withCallback = function withCallback(description, successCallback, failureCallback) {
    var promise = setLocalDescription.apply(this, [description]);

    if (!failureCallback) {
      return promise;
    }

    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };

  prototype.setLocalDescription = withCallback;

  withCallback = function withCallback(description, successCallback, failureCallback) {
    var promise = setRemoteDescription.apply(this, [description]);

    if (!failureCallback) {
      return promise;
    }

    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };

  prototype.setRemoteDescription = withCallback;

  withCallback = function withCallback(candidate, successCallback, failureCallback) {
    var promise = addIceCandidate.apply(this, [candidate]);

    if (!failureCallback) {
      return promise;
    }

    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };

  prototype.addIceCandidate = withCallback;
}

function shimGetUserMedia(window) {
  var navigator = window && window.navigator;

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // shim not needed in Safari 12.1
    var mediaDevices = navigator.mediaDevices;

    var _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);

    navigator.mediaDevices.getUserMedia = function (constraints) {
      return _getUserMedia(shimConstraints(constraints));
    };
  }

  if (!navigator.getUserMedia && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.getUserMedia = function getUserMedia(constraints, cb, errcb) {
      navigator.mediaDevices.getUserMedia(constraints).then(cb, errcb);
    }.bind(navigator);
  }
}

function shimConstraints(constraints) {
  if (constraints && constraints.video !== undefined) {
    return Object.assign({}, constraints, {
      video: utils.compactObject(constraints.video)
    });
  }

  return constraints;
}

function shimRTCIceServerUrls(window) {
  if (!window.RTCPeerConnection) {
    return;
  } // migrate from non-spec RTCIceServer.url to RTCIceServer.urls


  var OrigPeerConnection = window.RTCPeerConnection;

  window.RTCPeerConnection = function RTCPeerConnection(pcConfig, pcConstraints) {
    if (pcConfig && pcConfig.iceServers) {
      var newIceServers = [];

      for (var i = 0; i < pcConfig.iceServers.length; i++) {
        var server = pcConfig.iceServers[i];

        if (!server.hasOwnProperty('urls') && server.hasOwnProperty('url')) {
          utils.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
          server = JSON.parse(JSON.stringify(server));
          server.urls = server.url;
          delete server.url;
          newIceServers.push(server);
        } else {
          newIceServers.push(pcConfig.iceServers[i]);
        }
      }

      pcConfig.iceServers = newIceServers;
    }

    return new OrigPeerConnection(pcConfig, pcConstraints);
  };

  window.RTCPeerConnection.prototype = OrigPeerConnection.prototype; // wrap static methods. Currently just generateCertificate.

  if ('generateCertificate' in OrigPeerConnection) {
    Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
      get: function get() {
        return OrigPeerConnection.generateCertificate;
      }
    });
  }
}

function shimTrackEventTransceiver(window) {
  // Add event.transceiver member over deprecated event.receiver
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCTrackEvent && 'receiver' in window.RTCTrackEvent.prototype && !('transceiver' in window.RTCTrackEvent.prototype)) {
    Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
      get: function get() {
        return {
          receiver: this.receiver
        };
      }
    });
  }
}

function shimCreateOfferLegacy(window) {
  var origCreateOffer = window.RTCPeerConnection.prototype.createOffer;

  window.RTCPeerConnection.prototype.createOffer = function createOffer(offerOptions) {
    if (offerOptions) {
      if (typeof offerOptions.offerToReceiveAudio !== 'undefined') {
        // support bit values
        offerOptions.offerToReceiveAudio = !!offerOptions.offerToReceiveAudio;
      }

      var audioTransceiver = this.getTransceivers().find(function (transceiver) {
        return transceiver.receiver.track.kind === 'audio';
      });

      if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
        if (audioTransceiver.direction === 'sendrecv') {
          if (audioTransceiver.setDirection) {
            audioTransceiver.setDirection('sendonly');
          } else {
            audioTransceiver.direction = 'sendonly';
          }
        } else if (audioTransceiver.direction === 'recvonly') {
          if (audioTransceiver.setDirection) {
            audioTransceiver.setDirection('inactive');
          } else {
            audioTransceiver.direction = 'inactive';
          }
        }
      } else if (offerOptions.offerToReceiveAudio === true && !audioTransceiver) {
        this.addTransceiver('audio');
      }

      if (typeof offerOptions.offerToReceiveVideo !== 'undefined') {
        // support bit values
        offerOptions.offerToReceiveVideo = !!offerOptions.offerToReceiveVideo;
      }

      var videoTransceiver = this.getTransceivers().find(function (transceiver) {
        return transceiver.receiver.track.kind === 'video';
      });

      if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
        if (videoTransceiver.direction === 'sendrecv') {
          if (videoTransceiver.setDirection) {
            videoTransceiver.setDirection('sendonly');
          } else {
            videoTransceiver.direction = 'sendonly';
          }
        } else if (videoTransceiver.direction === 'recvonly') {
          if (videoTransceiver.setDirection) {
            videoTransceiver.setDirection('inactive');
          } else {
            videoTransceiver.direction = 'inactive';
          }
        }
      } else if (offerOptions.offerToReceiveVideo === true && !videoTransceiver) {
        this.addTransceiver('video');
      }
    }

    return origCreateOffer.apply(this, arguments);
  };
}

function shimAudioContext(window) {
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || window.AudioContext) {
    return;
  }

  window.AudioContext = window.webkitAudioContext;
}

},{"../utils":27}],27:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

function _typeof2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
};

exports.extractVersion = extractVersion;
exports.wrapPeerConnectionEvent = wrapPeerConnectionEvent;
exports.disableLog = disableLog;
exports.disableWarnings = disableWarnings;
exports.log = log;
exports.deprecated = deprecated;
exports.detectBrowser = detectBrowser;
exports.compactObject = compactObject;
exports.walkStats = walkStats;
exports.filterStats = filterStats;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var logDisabled_ = true;
var deprecationWarnings_ = true;
/**
 * Extract browser version out of the provided user agent string.
 *
 * @param {!string} uastring userAgent string.
 * @param {!string} expr Regular expression used as match criteria.
 * @param {!number} pos position in the version string to be returned.
 * @return {!number} browser version.
 */

function extractVersion(uastring, expr, pos) {
  var match = uastring.match(expr);
  return match && match.length >= pos && parseInt(match[pos], 10);
} // Wraps the peerconnection event eventNameToWrap in a function
// which returns the modified event object (or false to prevent
// the event).


function wrapPeerConnectionEvent(window, eventNameToWrap, wrapper) {
  if (!window.RTCPeerConnection) {
    return;
  }

  var proto = window.RTCPeerConnection.prototype;
  var nativeAddEventListener = proto.addEventListener;

  proto.addEventListener = function (nativeEventName, cb) {
    if (nativeEventName !== eventNameToWrap) {
      return nativeAddEventListener.apply(this, arguments);
    }

    var wrappedCallback = function wrappedCallback(e) {
      var modifiedEvent = wrapper(e);

      if (modifiedEvent) {
        if (cb.handleEvent) {
          cb.handleEvent(modifiedEvent);
        } else {
          cb(modifiedEvent);
        }
      }
    };

    this._eventMap = this._eventMap || {};

    if (!this._eventMap[eventNameToWrap]) {
      this._eventMap[eventNameToWrap] = new Map();
    }

    this._eventMap[eventNameToWrap].set(cb, wrappedCallback);

    return nativeAddEventListener.apply(this, [nativeEventName, wrappedCallback]);
  };

  var nativeRemoveEventListener = proto.removeEventListener;

  proto.removeEventListener = function (nativeEventName, cb) {
    if (nativeEventName !== eventNameToWrap || !this._eventMap || !this._eventMap[eventNameToWrap]) {
      return nativeRemoveEventListener.apply(this, arguments);
    }

    if (!this._eventMap[eventNameToWrap].has(cb)) {
      return nativeRemoveEventListener.apply(this, arguments);
    }

    var unwrappedCb = this._eventMap[eventNameToWrap].get(cb);

    this._eventMap[eventNameToWrap]["delete"](cb);

    if (this._eventMap[eventNameToWrap].size === 0) {
      delete this._eventMap[eventNameToWrap];
    }

    if (Object.keys(this._eventMap).length === 0) {
      delete this._eventMap;
    }

    return nativeRemoveEventListener.apply(this, [nativeEventName, unwrappedCb]);
  };

  Object.defineProperty(proto, 'on' + eventNameToWrap, {
    get: function get() {
      return this['_on' + eventNameToWrap];
    },
    set: function set(cb) {
      if (this['_on' + eventNameToWrap]) {
        this.removeEventListener(eventNameToWrap, this['_on' + eventNameToWrap]);
        delete this['_on' + eventNameToWrap];
      }

      if (cb) {
        this.addEventListener(eventNameToWrap, this['_on' + eventNameToWrap] = cb);
      }
    },
    enumerable: true,
    configurable: true
  });
}

function disableLog(bool) {
  if (typeof bool !== 'boolean') {
    return new Error('Argument type: ' + (typeof bool === 'undefined' ? 'undefined' : _typeof(bool)) + '. Please use a boolean.');
  }

  logDisabled_ = bool;
  return bool ? 'adapter.js logging disabled' : 'adapter.js logging enabled';
}
/**
 * Disable or enable deprecation warnings
 * @param {!boolean} bool set to true to disable warnings.
 */


function disableWarnings(bool) {
  if (typeof bool !== 'boolean') {
    return new Error('Argument type: ' + (typeof bool === 'undefined' ? 'undefined' : _typeof(bool)) + '. Please use a boolean.');
  }

  deprecationWarnings_ = !bool;
  return 'adapter.js deprecation warnings ' + (bool ? 'disabled' : 'enabled');
}

function log() {
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
    if (logDisabled_) {
      return;
    }

    if (typeof console !== 'undefined' && typeof console.log === 'function') {
      console.log.apply(console, arguments);
    }
  }
}
/**
 * Shows a deprecation warning suggesting the modern and spec-compatible API.
 */


function deprecated(oldMethod, newMethod) {
  if (!deprecationWarnings_) {
    return;
  }

  console.warn(oldMethod + ' is deprecated, please use ' + newMethod + ' instead.');
}
/**
 * Browser detector.
 *
 * @return {object} result containing browser and version
 *     properties.
 */


function detectBrowser(window) {
  // Returned result object.
  var result = {
    browser: null,
    version: null
  }; // Fail early if it's not a browser

  if (typeof window === 'undefined' || !window.navigator) {
    result.browser = 'Not a browser.';
    return result;
  }

  var navigator = window.navigator;

  if (navigator.mozGetUserMedia) {
    // Firefox.
    result.browser = 'firefox';
    result.version = extractVersion(navigator.userAgent, /Firefox\/(\d+)\./, 1);
  } else if (navigator.webkitGetUserMedia || window.isSecureContext === false && window.webkitRTCPeerConnection && !window.RTCIceGatherer) {
    // Chrome, Chromium, Webview, Opera.
    // Version matches Chrome/WebRTC version.
    // Chrome 74 removed webkitGetUserMedia on http as well so we need the
    // more complicated fallback to webkitRTCPeerConnection.
    result.browser = 'chrome';
    result.version = extractVersion(navigator.userAgent, /Chrom(e|ium)\/(\d+)\./, 2);
  } else if (navigator.mediaDevices && navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) {
    // Edge.
    result.browser = 'edge';
    result.version = extractVersion(navigator.userAgent, /Edge\/(\d+).(\d+)$/, 2);
  } else if (window.RTCPeerConnection && navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) {
    // Safari.
    result.browser = 'safari';
    result.version = extractVersion(navigator.userAgent, /AppleWebKit\/(\d+)\./, 1);
    result.supportsUnifiedPlan = window.RTCRtpTransceiver && 'currentDirection' in window.RTCRtpTransceiver.prototype;
  } else {
    // Default fallthrough: not supported.
    result.browser = 'Not a supported browser.';
    return result;
  }

  return result;
}
/**
 * Checks if something is an object.
 *
 * @param {*} val The something you want to check.
 * @return true if val is an object, false otherwise.
 */


function isObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]';
}
/**
 * Remove all empty objects and undefined values
 * from a nested object -- an enhanced and vanilla version
 * of Lodash's `compact`.
 */


function compactObject(data) {
  if (!isObject(data)) {
    return data;
  }

  return Object.keys(data).reduce(function (accumulator, key) {
    var isObj = isObject(data[key]);
    var value = isObj ? compactObject(data[key]) : data[key];
    var isEmptyObject = isObj && !Object.keys(value).length;

    if (value === undefined || isEmptyObject) {
      return accumulator;
    }

    return Object.assign(accumulator, _defineProperty({}, key, value));
  }, {});
}
/* iterates the stats graph recursively. */


function walkStats(stats, base, resultSet) {
  if (!base || resultSet.has(base.id)) {
    return;
  }

  resultSet.set(base.id, base);
  Object.keys(base).forEach(function (name) {
    if (name.endsWith('Id')) {
      walkStats(stats, stats.get(base[name]), resultSet);
    } else if (name.endsWith('Ids')) {
      base[name].forEach(function (id) {
        walkStats(stats, stats.get(id), resultSet);
      });
    }
  });
}
/* filter getStats for a sender/receiver track. */


function filterStats(result, track, outbound) {
  var streamStatsType = outbound ? 'outbound-rtp' : 'inbound-rtp';
  var filteredResult = new Map();

  if (track === null) {
    return filteredResult;
  }

  var trackStats = [];
  result.forEach(function (value) {
    if (value.type === 'track' && value.trackIdentifier === track.id) {
      trackStats.push(value);
    }
  });
  trackStats.forEach(function (trackStat) {
    result.forEach(function (stats) {
      if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
        walkStats(result, stats, filteredResult);
      }
    });
  });
  return filteredResult;
}

},{}],28:[function(require,module,exports){
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _0x8674 = ['feedDecoder', 'postMessage', 'now', 'getBufferTimeLength', 'Unknown\x20request', 'bind', 'audioChunkLength', 'context', 'sampleRate', 'videoWidth', 'videoHeight', 'token', 'dropDelayMultiplier', 'Failed\x20to\x20init\x20stream\x20receiver\x20', 'videoDecoder', 'decoderPath', 'onmessage', 'No\x20timestamp\x20available\x20for\x20decoded\x20picture,\x20discarding', 'shift', 'STOPPED', 'audioBuffer', 'sync', 'start', 'setVolume', 'requestVideoFrameCallback', 'Failed\x20to\x20init\x20video\x20decoder\x20', 'fps', 'framesRendered', 'noDataSince', 'prototype', 'receivedIframe', 'lastPlayedVideoTime', 'kframe', 'decode', 'payload', 'play', 'stream', 'STARTUP', 'playFirstSound', 'createBuffer', 'getChannelData', 'random', 'createBufferSource', 'buffer', 'connect', 'destination', 'mute', 'PAUSED', 'unmute', 'resume', 'getVolume', 'lastFpsTime', 'lastPlayedVideoTimestamp', 'log', 'trace', 'requestVideoFrameCallback,\x20audio\x20player\x20time\x20', '\x20callback\x20timestamp\x20', 'render', 'playing', 'dispatchEvent', 'riseApiEvent', 'lastEventRised', 'PLAYBACK_PROBLEM', 'logToCanvas', 'ctx2D', 'height', 'fillStyle', 'black', 'font', 'textAlign', 'center', 'width', '40pt', 'fillText', 'initLogger', 'verbosity', 'console', 'apply', 'warn', 'wsLogger', 'debug', 'renderFunction', 'force2D', 'YTexture', 'CBTexture', 'CRTexture', 'RGBTexture', 'rgbaBuffer', 'mbWidth', 'codedWidth', 'halfWidth', 'precision\x20mediump\x20float;', 'uniform\x20sampler2D\x20CBTexture;', 'void\x20main()\x20{', 'float\x20y\x20=\x20texture2D(YTexture,\x20texCoord).r;', 'float\x20cb\x20=\x20texture2D(CBTexture,\x20texCoord).r\x20-\x200.5;', 'gl_FragColor\x20=\x20vec4(', 'y\x20+\x20-0.343\x20*\x20cb\x20-\x200.711\x20*\x20cr,', '1.0', 'join', 'attribute\x20vec2\x20vertex;', 'varying\x20vec2\x20texCoord;', 'texCoord\x20=\x20vertex;', 'gl_Position\x20=\x20vec4((vertex\x20*\x202.0\x20-\x201.0)\x20*\x20vec2(1,\x20-1),\x200.0,\x201.0);', 'SHADER_VERTEX_IDENTITY_RGBA', 'varying\x20vec2\x20tc;', 'void\x20main(){', 'gl_Position\x20=\x20vertex;', 'SHADER_FRAGMENT_RGBA', 'uniform\x20sampler2D\x20RGBTexture;', 'gl_FragColor\x20=\x20texture2D(RGBTexture,\x20tc);', 'getContext', 'experimental-webgl', 'inputFormat', 'rgba', 'initWebGLRGB', 'initWebGLYUV', 'renderFrame2D', 'bindBuffer', 'ARRAY_BUFFER', 'bufferData', 'STATIC_DRAW', 'program', 'attachShader', 'compileShader', 'SHADER_VERTEX_IDENTITY_YUV', 'FRAGMENT_SHADER', 'SHADER_FRAGMENT_YCBCRTORGBA', 'linkProgram', 'getProgramParameter', 'Failed\x20to\x20init\x20WebGL!\x20Message\x20', 'getProgramInfoLog', 'useProgram', 'createTexture', 'getAttribLocation', 'vertex', 'enableVertexAttribArray', 'vertexAttribPointer', 'createProgram', 'bindAttribLocation', 'FLOAT', 'renderFrameGLRGB', 'undefined', 'createImageData', 'putImageData', 'clear', 'COLOR_BUFFER_BIT', 'DEPTH_BUFFER_BIT', 'TEXTURE_2D', 'texParameteri', 'TEXTURE_MAG_FILTER', 'LINEAR', 'TEXTURE_MIN_FILTER', 'CLAMP_TO_EDGE', 'TEXTURE_WRAP_T', 'getUniformLocation', 'createShader', 'getShaderParameter', 'COMPILE_STATUS', 'getShaderInfoLog', 'isUsingWebGL', 'activeTexture', 'bindTexture', 'texImage2D', 'LUMINANCE', 'UNSIGNED_BYTE', 'TEXTURE1', 'TEXTURE2', 'drawArrays', 'TRIANGLE_STRIP', 'TEXTURE0', 'RGBA', 'TRIANGLES', 'type', 'YCbCrToRGBA', 'set', 'Changing\x20canvas\x20resolution\x20from\x20', '\x20to\x20', 'lastTimeRendered', 'getLastTimeRendered', 'nodeConnected', 'gainNode', 'createGain', 'abs', 'Audio\x20node\x20buffer\x20size\x20', 'internalBufferSize', 'createScriptProcessor', 'audioJSNode', 'previousSync', 'lastSync', 'lastSyncTime', 'playbackTime', 'value', 'disconnect', 'resetBuffers', 'playAudio', 'getBufferLength', 'currentTime', 'audioChunkTimeLength', 'No\x20audio!\x20', 'previousSyncTime', 'Audio\x20player\x20mute', 'gain', 'Audio\x20player\x20resume', 'setTimeout', 'state', 'initialized', 'init', 'canvas', 'api', 'configuration', 'initBuffers', 'initialVolume', 'audioPlayer', 'error', 'Failed\x20to\x20init\x20audio\x20player\x20', 'yuv', 'videoRenderer', 'Failed\x20to\x20init\x20video\x20renderer\x20', 'receiver', 'terminate', 'receiverPath', 'addEventListener', 'message', 'data', 'status', 'failed', 'closed', 'stop', 'AVData', 'audioLength', 'audioReceived', 'audio', 'length', 'videoLength', 'Received\x20video,\x20frames:', 'videoReceived', 'video', 'videoBuffer', 'push', 'videoFrameTimeLength', 'getCurrentSync', 'PLAYING', 'muted', 'decodedVideoBuffer', 'tsVideoWaitingList'];

(function (_0x56e2ba, _0x54ffbb) {
  var _0x53abc2 = function _0x53abc2(_0x5bd6fa) {
    while (--_0x5bd6fa) {
      _0x56e2ba['push'](_0x56e2ba['shift']());
    }
  };

  _0x53abc2(++_0x54ffbb);
})(_0x8674, 0x1c2);

var _0x162a = function _0x162a(_0x289e5c, _0x18e4c1) {
  _0x289e5c = _0x289e5c - 0x0;
  var _0x1d4b0e = _0x8674[_0x289e5c];
  return _0x1d4b0e;
};

var requestAnimFrame = function () {
  return function (_0x452c50) {
    window[_0x162a('0x0')](_0x452c50, 0x3e8 / 0x1e);
  };
}();

function WSPlayer() {
  this[_0x162a('0x1')] = WSPlayerState['STOPPED'];
  this[_0x162a('0x2')] = ![];
}

WSPlayer['prototype'][_0x162a('0x3')] = function (_0x566b31, _0x2633b5, _0x439354) {
  this['canvas'] = _0x566b31[_0x162a('0x4')];
  this[_0x162a('0x5')] = _0x566b31[_0x162a('0x5')];
  this[_0x162a('0x6')] = _0x566b31;

  this[_0x162a('0x7')]();

  this[_0x162a('0x8')] = -0x1;

  try {
    this[_0x162a('0x9')] = new AudioPlayer(_0x2633b5);
  } catch (_0x388ad2) {
    wsLogger[_0x162a('0xa')](_0x162a('0xb') + _0x388ad2);

    return;
  }

  try {
    this['videoRenderer'] = new VideoRenderer(this[_0x162a('0x4')], ![], _0x162a('0xc'));

    this[_0x162a('0xd')]['init']();
  } catch (_0x4a3ba3) {
    wsLogger['error'](_0x162a('0xe') + _0x4a3ba3);
    return;
  }

  if (!_0x439354) {
    try {
      if (this[_0x162a('0xf')]) {
        this[_0x162a('0xf')][_0x162a('0x10')]();
      }

      this[_0x162a('0xf')] = new Worker(_0x566b31[_0x162a('0x11')]);

      this['receiver'][_0x162a('0x12')](_0x162a('0x13'), function (_0xd32be3) {
        switch (_0xd32be3[_0x162a('0x14')][_0x162a('0x13')]) {
          case 'connection':
            if (_0xd32be3[_0x162a('0x14')][_0x162a('0x15')] == _0x162a('0x16') || _0xd32be3[_0x162a('0x14')][_0x162a('0x15')] == _0x162a('0x17')) {
              this[_0x162a('0x18')]();

              this[_0x162a('0x2')] = ![];
            }

            break;

          case _0x162a('0x19'):
            var _0x223990;

            if (_0xd32be3[_0x162a('0x14')][_0x162a('0x1a')] > 0x0) {
              this[_0x162a('0x1b')] = !![];

              for (_0x223990 = 0x0; _0x223990 < _0xd32be3[_0x162a('0x14')][_0x162a('0x1c')][_0x162a('0x1d')]; _0x223990++) {
                this[_0x162a('0x9')]['playAudio'](_0xd32be3['data']['audio'][_0x223990]);
              }
            }

            if (_0xd32be3[_0x162a('0x14')][_0x162a('0x1e')] > 0x0) {
              wsLogger['debug'](_0x162a('0x1f') + _0xd32be3[_0x162a('0x14')]['videoLength']);
              this[_0x162a('0x20')] = !![];

              for (_0x223990 = 0x0; _0x223990 < _0xd32be3[_0x162a('0x14')][_0x162a('0x21')][_0x162a('0x1d')]; _0x223990++) {
                this[_0x162a('0x22')][_0x162a('0x23')](_0xd32be3[_0x162a('0x14')]['video'][_0x223990]);
              }

              this[_0x162a('0x24')] = _0xd32be3[_0x162a('0x14')][_0x162a('0x1e')] / _0xd32be3['data']['video'][_0x162a('0x1d')];
            }

            var _0x3677b1 = this[_0x162a('0x9')][_0x162a('0x25')]();

            if (this[_0x162a('0x22')][_0x162a('0x1d')] > 0x0) {
              if (this[_0x162a('0x1')] == WSPlayerState[_0x162a('0x26')]) {
                if (this[_0x162a('0xd')][_0x162a('0x27')]) {
                  this[_0x162a('0x28')][_0x162a('0x1d')] = 0x0;
                  this[_0x162a('0x29')][_0x162a('0x1d')] = 0x0;

                  while (this[_0x162a('0x22')][_0x162a('0x1d')] > 0x0) {
                    if (this['videoBuffer'][0x0]['ts'] < _0x3677b1 + 0x32) {
                      this['feedDecoder']();
                    } else {
                      break;
                    }
                  }
                } else if (this[_0x162a('0x29')][_0x162a('0x1d')] < 0x2) {
                  this['feedDecoder']();
                }
              } else {
                while (this[_0x162a('0x2a')]()) {}
              }
            }

            this['receiver'][_0x162a('0x2b')]({
              'message': 'ack',
              'data': {
                'seq': _0xd32be3[_0x162a('0x14')]['seq'],
                'time': Date[_0x162a('0x2c')](),
                'audioReceivedLength': _0xd32be3[_0x162a('0x14')][_0x162a('0x1a')],
                'videoReceivedLength': _0xd32be3[_0x162a('0x14')][_0x162a('0x1e')],
                'audioCurrentTime': _0x3677b1,
                'audioBufferTimeLength': this['audioPlayer'][_0x162a('0x2d')](),
                'videoBufferTimeLength': (this[_0x162a('0x22')]['length'] + this[_0x162a('0x29')][_0x162a('0x1d')] + this[_0x162a('0x28')]['length']) * this[_0x162a('0x24')]
              }
            });

            break;

          default:
            wsLogger[_0x162a('0xa')](_0x162a('0x2e'));

        }
      }[_0x162a('0x2f')](this), ![]);

      var _0x56370c = {};
      _0x56370c[_0x162a('0x30')] = this[_0x162a('0x9')]['internalBufferSize'];
      _0x56370c['audioContextSampleRate'] = this[_0x162a('0x9')][_0x162a('0x31')][_0x162a('0x32')];
      _0x56370c[_0x162a('0x33')] = _0x566b31[_0x162a('0x33')];
      _0x56370c[_0x162a('0x34')] = _0x566b31[_0x162a('0x34')];
      _0x56370c['urlWsServer'] = _0x566b31['urlWsServer'];
      _0x56370c[_0x162a('0x35')] = _0x566b31[_0x162a('0x35')];
      _0x56370c['audioBufferWaitFor'] = _0x566b31['audioBufferWaitFor'];
      _0x56370c['videoBufferWaitFor'] = _0x566b31['videoBufferWaitFor'];
      _0x56370c['dropDelayMultiplier'] = _0x566b31[_0x162a('0x36')];

      this[_0x162a('0xf')][_0x162a('0x2b')]({
        'message': _0x162a('0x3'),
        'data': _0x56370c
      });
    } catch (_0x2e5046) {
      wsLogger[_0x162a('0xa')](_0x162a('0x37') + _0x2e5046);

      return;
    }
  }

  try {
    if (this[_0x162a('0x38')]) {
      this[_0x162a('0x38')][_0x162a('0x10')]();
    }

    this[_0x162a('0x38')] = new Worker(_0x566b31[_0x162a('0x39')]);

    this['videoDecoder'][_0x162a('0x3a')] = function (_0x67846e) {
      if (this[_0x162a('0x29')][_0x162a('0x1d')] == 0x0) {
        wsLogger['warn'](_0x162a('0x3b'));
        return;
      }

      _0x67846e['data']['sync'] = this[_0x162a('0x29')][_0x162a('0x3c')]();
      this['decodedVideoBuffer']['push'](_0x67846e[_0x162a('0x14')]);

      if (this['state'] != WSPlayerState['PLAYING'] && this[_0x162a('0x1')] != WSPlayerState[_0x162a('0x3d')]) {
        if (this[_0x162a('0x28')][_0x162a('0x1d')] < 0x5) {
          if (this[_0x162a('0x28')]['length'] > 0x1 && this[_0x162a('0x9')][_0x162a('0x3e')][_0x162a('0x1d')] > 0x0) {
            if (this[_0x162a('0x9')][_0x162a('0x3e')][0x0][_0x162a('0x3f')] > this['decodedVideoBuffer'][0x0]['sync']) {
              this[_0x162a('0x28')][0x0] = null;

              this[_0x162a('0x28')]['shift']();
            }
          }

          this[_0x162a('0x2a')]();
        } else {
          this[_0x162a('0x1')] = WSPlayerState['PLAYING'];

          this['audioPlayer'][_0x162a('0x40')]();

          if (this[_0x162a('0x8')] != -0x1) {
            this[_0x162a('0x41')](this[_0x162a('0x8')]);

            this[_0x162a('0x8')] = -0x1;
          }

          requestAnimFrame(this[_0x162a('0x42')]['bind'](this));
        }
      } else {
        if (this[_0x162a('0x29')][_0x162a('0x1d')] < 0x2) {
          this['feedDecoder']();
        }
      }
    }[_0x162a('0x2f')](this);

    this[_0x162a('0x38')][_0x162a('0x2b')]({
      'message': 'init',
      'width': _0x566b31[_0x162a('0x33')],
      'height': _0x566b31[_0x162a('0x34')],
      'outputGl': !![]
    });
  } catch (_0x5236ab) {
    wsLogger[_0x162a('0xa')](_0x162a('0x43') + _0x5236ab);

    return;
  }

  this[_0x162a('0x44')] = 0x0;
  this['lastFpsTime'] = 0x0;
  this[_0x162a('0x45')] = 0x0;
  this['noDataFlag'] = ![];
  this[_0x162a('0x46')] = 0x0;
  this['initialized'] = !![];
};

WSPlayer[_0x162a('0x47')][_0x162a('0x7')] = function () {
  this[_0x162a('0x1b')] = ![];
  this[_0x162a('0x20')] = ![];

  if (this[_0x162a('0x22')]) {
    this[_0x162a('0x22')][_0x162a('0x1d')] = 0x0;
  } else {
    this[_0x162a('0x22')] = [];
  }

  if (this['tsVideoWaitingList']) {
    this[_0x162a('0x29')][_0x162a('0x1d')] = 0x0;
  } else {
    this[_0x162a('0x29')] = [];
  }

  if (this['decodedVideoBuffer']) {
    this[_0x162a('0x28')]['length'] = 0x0;
  } else {
    this[_0x162a('0x28')] = [];
  }

  this[_0x162a('0x48')] = ![];
  this[_0x162a('0x49')] = 0x0;
  this['lastPlayedVideoTimestamp'] = 0x0;
};

WSPlayer['prototype'][_0x162a('0x2a')] = function () {
  if (this[_0x162a('0x22')][_0x162a('0x1d')] > 0x0) {
    if (this[_0x162a('0x48')] || this[_0x162a('0x22')][0x0][_0x162a('0x4a')]) {
      this[_0x162a('0x48')] = !![];

      if (!this['videoRenderer'][_0x162a('0x27')]) {
        this['tsVideoWaitingList'][_0x162a('0x23')](this[_0x162a('0x22')][0x0]['ts']);
      }

      this['videoDecoder'][_0x162a('0x2b')]({
        'message': _0x162a('0x4b'),
        'skip': this[_0x162a('0xd')][_0x162a('0x27')],
        'data': this[_0x162a('0x22')][0x0][_0x162a('0x4c')]
      }, [this['videoBuffer'][0x0][_0x162a('0x4c')]['buffer']]);

      this[_0x162a('0x22')][0x0] = null;

      this[_0x162a('0x22')][_0x162a('0x3c')]();

      return !![];
    }

    this[_0x162a('0x22')][0x0] = null;

    this['videoBuffer'][_0x162a('0x3c')]();
  }
};

WSPlayer['prototype'][_0x162a('0x4d')] = function (_0x394048) {
  if (!this['initialized']) {
    wsLogger['error']('Can\x27t\x20play\x20stream,\x20player\x20not\x20initialized!');
    return;
  }

  this[_0x162a('0x7')]();

  this['receiver'][_0x162a('0x2b')]({
    'message': _0x162a('0x4d')
  });

  this[_0x162a('0x4e')] = _0x394048;
  this['unmute']();
  this[_0x162a('0x1')] = WSPlayerState[_0x162a('0x4f')];
};

WSPlayer[_0x162a('0x47')][_0x162a('0x50')] = function () {
  var _0x17a93a = this[_0x162a('0x9')][_0x162a('0x31')][_0x162a('0x51')](0x1, 0x1b9, 0xac44);

  var _0x311ab3 = _0x17a93a[_0x162a('0x52')](0x0);

  for (var _0x455a72 = 0x0; _0x455a72 < _0x311ab3['length']; _0x455a72++) {
    _0x311ab3[_0x455a72] = Math[_0x162a('0x53')]() * 0x2 - 0x1;
  }

  var _0x2b7b90 = this[_0x162a('0x9')][_0x162a('0x31')][_0x162a('0x54')]();

  _0x2b7b90[_0x162a('0x55')] = _0x17a93a;

  _0x2b7b90[_0x162a('0x56')](this['audioPlayer'][_0x162a('0x31')][_0x162a('0x57')]);

  _0x2b7b90[_0x162a('0x40')](0x0);
};

WSPlayer[_0x162a('0x47')]['pause'] = function () {
  this[_0x162a('0x58')]();

  this[_0x162a('0xf')][_0x162a('0x2b')]({
    'message': 'pause'
  });

  this[_0x162a('0x1')] = WSPlayerState[_0x162a('0x59')];
};

WSPlayer['prototype'][_0x162a('0x58')] = function () {
  if (this[_0x162a('0x9')]) {
    this[_0x162a('0x9')][_0x162a('0x58')](!![]);
  }

  if (this[_0x162a('0xd')]) {
    this[_0x162a('0xd')][_0x162a('0x58')](!![]);
  }
};

WSPlayer[_0x162a('0x47')][_0x162a('0x5a')] = function () {
  if (this['audioPlayer']) {
    this[_0x162a('0x9')]['mute'](![]);
  }

  if (this['videoRenderer']) {
    this[_0x162a('0xd')][_0x162a('0x58')](![]);
  }
};

WSPlayer[_0x162a('0x47')][_0x162a('0x5b')] = function () {
  this[_0x162a('0x7')]();

  this[_0x162a('0x1')] = WSPlayerState[_0x162a('0x4f')];

  this[_0x162a('0xf')][_0x162a('0x2b')]({
    'message': _0x162a('0x5b')
  });

  this['unmute']();
};

WSPlayer['prototype']['setVolume'] = function (_0x5a1f09) {
  if (this[_0x162a('0x1')] == WSPlayerState[_0x162a('0x26')]) {
    this[_0x162a('0x9')][_0x162a('0x41')](_0x5a1f09);
  } else {
    this[_0x162a('0x8')] = _0x5a1f09;
  }
};

WSPlayer[_0x162a('0x47')][_0x162a('0x5c')] = function () {
  return this[_0x162a('0x9')]['getVolume']();
};

WSPlayer[_0x162a('0x47')][_0x162a('0x18')] = function () {
  this['state'] = WSPlayerState[_0x162a('0x3d')];

  if (this[_0x162a('0xf')]) {
    this[_0x162a('0xf')][_0x162a('0x2b')]({
      'message': _0x162a('0x18')
    });
  }

  if (this[_0x162a('0x9')]) {
    this[_0x162a('0x9')]['stop']();
  }

  if (this[_0x162a('0xd')]) {
    this[_0x162a('0xd')][_0x162a('0x18')]();
  }

  this['fps'] = 0x0;
  this[_0x162a('0x5d')] = 0x0;
  this[_0x162a('0x45')] = 0x0;
};

WSPlayer[_0x162a('0x47')][_0x162a('0x42')] = function (_0x253d91) {
  if (this[_0x162a('0x1')] != WSPlayerState[_0x162a('0x26')]) {
    return;
  }

  if (this[_0x162a('0x28')][_0x162a('0x1d')] > 0x0) {
    var _0x813081 = this[_0x162a('0x9')][_0x162a('0x25')]();

    if (_0x813081 == -0x1) {
      var _0x44a14e = Date[_0x162a('0x2c')]();

      if (this[_0x162a('0x49')] == 0x0) {
        _0x813081 = this[_0x162a('0x28')][0x0]['sync'];
        this[_0x162a('0x49')] = _0x44a14e;
        this[_0x162a('0x5e')] = _0x813081;

        wsLogger[_0x162a('0x5f')]('Init\x20Video\x20playout\x20without\x20sync,\x20currentTime\x20' + _0x44a14e + ',\x20timestamp\x20' + this['lastPlayedVideoTimestamp']);
      } else {
        var _0x393d46 = _0x44a14e - this[_0x162a('0x49')];

        var _0x160d46 = this['decodedVideoBuffer'][0x0][_0x162a('0x3f')] - this['lastPlayedVideoTimestamp'];

        if (_0x393d46 >= _0x160d46) {
          _0x813081 = this[_0x162a('0x28')][0x0]['sync'];
          this[_0x162a('0x49')] += _0x160d46;
          this[_0x162a('0x5e')] = _0x813081;
        } else {
          _0x813081 = this[_0x162a('0x28')][0x0][_0x162a('0x3f')] - 0x1;
        }
      }
    }

    wsLogger[_0x162a('0x60')](_0x162a('0x61') + _0x813081 + _0x162a('0x62') + _0x253d91);

    if (_0x813081 - this[_0x162a('0x28')][0x0][_0x162a('0x3f')] > 0x64 && this[_0x162a('0x28')]['length'] > 0x1) {
      this[_0x162a('0x28')][_0x162a('0x3c')]();
    }

    if (this[_0x162a('0x28')][0x0][_0x162a('0x3f')] <= _0x813081) {
      this['videoRenderer'][_0x162a('0x63')](this[_0x162a('0x28')]['shift']());

      this['framesRendered']++;

      if (this[_0x162a('0x45')] == 0x1) {
        var _0x2e90ca = this[_0x162a('0x4')];

        setTimeout(function () {
          var _0x1e1c6f = new CustomEvent(_0x162a('0x64'));

          _0x2e90ca[_0x162a('0x65')](_0x1e1c6f);
        }, 0xa);
      }
    }
  }

  if (this[_0x162a('0x29')][_0x162a('0x1d')] < 0x3) {
    this['feedDecoder']();
  }

  requestAnimFrame(this[_0x162a('0x42')]['bind'](this));
};

WSPlayer[_0x162a('0x47')][_0x162a('0x66')] = function (_0x35dabe) {
  if (this[_0x162a('0x67')]) {
    if (Date[_0x162a('0x2c')]() - this['lastEventRised'] < 0x3e8) {
      return;
    }
  }

  var _0x54b410 = {
    'status': _0x162a('0x68'),
    'info': _0x35dabe
  };

  this[_0x162a('0x5')](_0x54b410);

  this[_0x162a('0x67')] = Date['now']();
};

WSPlayer[_0x162a('0x47')][_0x162a('0x69')] = function (_0x3c7c23) {
  var _0x248bc3 = this[_0x162a('0xd')][_0x162a('0x6a')];

  if (_0x248bc3) {
    var _0x2635b7 = _0x248bc3['measureText'](_0x3c7c23);

    _0x248bc3['fillStyle'] = 'white';
    var _0x4db686 = 0x1e;

    _0x248bc3['fillRect'](0x0, this['canvas'][_0x162a('0x6b')] / 0x2 - _0x4db686 / 0x2, this[_0x162a('0x4')]['width'], _0x4db686);

    _0x248bc3[_0x162a('0x6c')] = _0x162a('0x6d');
    _0x248bc3[_0x162a('0x6e')] = '30pt';
    _0x248bc3[_0x162a('0x6f')] = _0x162a('0x70');

    _0x248bc3['fillText'](_0x3c7c23, this[_0x162a('0x4')][_0x162a('0x71')] / 0x2, this[_0x162a('0x4')][_0x162a('0x6b')] / 0x2);
  } else {}
};

WSPlayer[_0x162a('0x47')]['fpsToCanvas'] = function (_0x48eb03) {
  var _0x4b03da = this[_0x162a('0xd')][_0x162a('0x6a')];

  if (_0x4b03da) {
    _0x4b03da[_0x162a('0x6c')] = 'red';
    _0x4b03da[_0x162a('0x6e')] = _0x162a('0x72');

    _0x4b03da[_0x162a('0x73')](_0x48eb03, 0x14, this['canvas'][_0x162a('0x6b')] - 0x14);
  } else {}
};

WSPlayer['prototype'][_0x162a('0x74')] = function (_0x43edeb) {
  this[_0x162a('0x75')] = _0x43edeb || 0x2;

  var _0x556035 = this;

  if (window['wsLogger'] == undefined) {
    window['wsLogger'] = {
      'log': function log() {
        if (_0x556035[_0x162a('0x75')] >= 0x2) {
          window[_0x162a('0x76')][_0x162a('0x5f')][_0x162a('0x77')](window[_0x162a('0x76')], arguments);
        }
      },
      'warn': function warn() {
        if (_0x556035[_0x162a('0x75')] >= 0x1) {
          window[_0x162a('0x76')][_0x162a('0x78')][_0x162a('0x77')](window[_0x162a('0x76')], arguments);
        }
      },
      'error': function error() {
        if (_0x556035[_0x162a('0x75')] >= 0x0) {
          window[_0x162a('0x76')][_0x162a('0xa')][_0x162a('0x77')](window[_0x162a('0x76')], arguments);
        }
      },
      'debug': function debug() {
        if (_0x556035[_0x162a('0x75')] >= 0x3) {
          window['console'][_0x162a('0x5f')][_0x162a('0x77')](window['console'], arguments);
        }
      },
      'trace': function trace() {
        if (_0x556035[_0x162a('0x75')] >= 0x4) {
          window['console'][_0x162a('0x5f')]['apply'](window[_0x162a('0x76')], arguments);
        }
      }
    };
  }

  if (window[_0x162a('0x79')][_0x162a('0x7a')] == undefined) {
    window['wsLogger']['debug'] = function () {
      if (_0x556035[_0x162a('0x75')] >= 0x3) {
        window[_0x162a('0x76')][_0x162a('0x5f')][_0x162a('0x77')](window[_0x162a('0x76')], arguments);
      }
    };
  }

  if (window['wsLogger'][_0x162a('0x60')] == undefined) {
    window['wsLogger'][_0x162a('0x60')] = function () {
      if (_0x556035[_0x162a('0x75')] >= 0x4) {
        window[_0x162a('0x76')][_0x162a('0x5f')]['apply'](window[_0x162a('0x76')], arguments);
      }
    };
  }
};

WSPlayer[_0x162a('0x47')]['getStreamStatistics'] = function (_0x351dd5) {
  if (_0x351dd5 == _0x162a('0x1c')) {
    return this['audioReceived'];
  } else if (_0x351dd5 == _0x162a('0x21')) {
    return this[_0x162a('0x20')];
  }
};

var VideoRenderer = function VideoRenderer(_0x2008fb, _0x328799, _0x5c39da) {
  this[_0x162a('0x4')] = _0x2008fb;
  this[_0x162a('0x71')] = _0x2008fb[_0x162a('0x71')];
  this['height'] = _0x2008fb['height'];
  this[_0x162a('0x7b')] = null;
  this[_0x162a('0x6a')] = null;
  this[_0x162a('0x7c')] = _0x328799;
  this['inputFormat'] = _0x5c39da;
  this['gl'] = null;
  this['program'] = null;
  this[_0x162a('0x55')] = null;
  this[_0x162a('0x7d')] = null;
  this[_0x162a('0x7e')] = null;
  this[_0x162a('0x7f')] = null;
  this[_0x162a('0x80')] = null;
  this[_0x162a('0x81')] = null;
  this[_0x162a('0x82')] = null;
  this[_0x162a('0x83')] = null;
  this[_0x162a('0x84')] = null;
  this['muted'] = ![];
  this['SHADER_FRAGMENT_YCBCRTORGBA'] = [_0x162a('0x85'), 'uniform\x20sampler2D\x20YTexture;', _0x162a('0x86'), 'uniform\x20sampler2D\x20CRTexture;', 'varying\x20vec2\x20texCoord;', _0x162a('0x87'), _0x162a('0x88'), 'float\x20cr\x20=\x20texture2D(CRTexture,\x20texCoord).r\x20-\x200.5;', _0x162a('0x89'), _0x162a('0x8a'), 'y\x20+\x201.4\x20*\x20cr,', _0x162a('0x8b'), 'y\x20+\x201.765\x20*\x20cb,', _0x162a('0x8c'), ');', '}'][_0x162a('0x8d')]('\x0a');
  this['SHADER_VERTEX_IDENTITY_YUV'] = [_0x162a('0x8e'), _0x162a('0x8f'), 'void\x20main()\x20{', _0x162a('0x90'), _0x162a('0x91'), '}'][_0x162a('0x8d')]('\x0a');
  this[_0x162a('0x92')] = ['attribute\x20vec4\x20vertex;', _0x162a('0x93'), _0x162a('0x94'), _0x162a('0x95'), 'tc\x20=\x20vertex.xy*0.5+0.5;', '}'][_0x162a('0x8d')]('\x0a');
  this[_0x162a('0x96')] = ['precision\x20mediump\x20float;', _0x162a('0x97'), 'varying\x20vec2\x20tc;', 'void\x20main(){', _0x162a('0x98'), '}'][_0x162a('0x8d')]('\x0a');
};

VideoRenderer[_0x162a('0x47')]['init'] = function () {
  if (!this[_0x162a('0x7c')]) {
    try {
      var _0x1a7035 = this['gl'] = this[_0x162a('0x4')][_0x162a('0x99')]('webgl') || this[_0x162a('0x4')][_0x162a('0x99')](_0x162a('0x9a'));
    } catch (_0x1fa2db) {
      wsLogger[_0x162a('0xa')]('Failed\x20to\x20get\x20webgl\x20context,\x20error\x20' + _0x1fa2db);
    }
  }

  if (_0x1a7035) {
    if (this[_0x162a('0x9b')] == _0x162a('0x9c')) {
      this[_0x162a('0x9d')](_0x1a7035);
    } else {
      this[_0x162a('0x9e')](_0x1a7035);
    }
  } else {
    this[_0x162a('0x6a')] = this[_0x162a('0x4')][_0x162a('0x99')]('2d');
    this['renderFunction'] = this[_0x162a('0x9f')];
  }

  this[_0x162a('0x7')]();
};

VideoRenderer[_0x162a('0x47')][_0x162a('0x9e')] = function (_0x4f5fef) {
  this[_0x162a('0x55')] = _0x4f5fef[_0x162a('0x51')]();

  _0x4f5fef[_0x162a('0xa0')](_0x4f5fef[_0x162a('0xa1')], this['buffer']);

  _0x4f5fef[_0x162a('0xa2')](_0x4f5fef[_0x162a('0xa1')], new Float32Array([0x0, 0x0, 0x0, 0x1, 0x1, 0x0, 0x1, 0x1]), _0x4f5fef[_0x162a('0xa3')]);

  this[_0x162a('0xa4')] = _0x4f5fef['createProgram']();

  _0x4f5fef[_0x162a('0xa5')](this['program'], this[_0x162a('0xa6')](_0x4f5fef['VERTEX_SHADER'], this[_0x162a('0xa7')]));

  _0x4f5fef[_0x162a('0xa5')](this[_0x162a('0xa4')], this[_0x162a('0xa6')](_0x4f5fef[_0x162a('0xa8')], this[_0x162a('0xa9')]));

  _0x4f5fef[_0x162a('0xaa')](this[_0x162a('0xa4')]);

  if (!_0x4f5fef[_0x162a('0xab')](this['program'], _0x4f5fef['LINK_STATUS'])) {
    wsLogger[_0x162a('0xa')](_0x162a('0xac') + _0x4f5fef[_0x162a('0xad')](this[_0x162a('0xa4')]));

    this['ctx2D'] = this[_0x162a('0x4')][_0x162a('0x99')]('2d');
    this['renderFunction'] = this[_0x162a('0x9f')];
    return;
  }

  _0x4f5fef[_0x162a('0xae')](this[_0x162a('0xa4')]);

  this['YTexture'] = this['createTexture'](0x0, _0x162a('0x7d'));
  this[_0x162a('0x7f')] = this[_0x162a('0xaf')](0x1, _0x162a('0x7f'));
  this[_0x162a('0x7e')] = this['createTexture'](0x2, 'CBTexture');

  var _0x441c07 = _0x4f5fef[_0x162a('0xb0')](this[_0x162a('0xa4')], _0x162a('0xb1'));

  _0x4f5fef[_0x162a('0xb2')](_0x441c07);

  _0x4f5fef[_0x162a('0xb3')](_0x441c07, 0x2, _0x4f5fef['FLOAT'], ![], 0x0, 0x0);

  this[_0x162a('0x7b')] = this['renderFrameGLYUV'];
};

VideoRenderer[_0x162a('0x47')][_0x162a('0x9d')] = function (_0x45a8b0) {
  this[_0x162a('0x55')] = _0x45a8b0[_0x162a('0x51')]();

  _0x45a8b0['bindBuffer'](_0x45a8b0[_0x162a('0xa1')], this[_0x162a('0x55')]);

  _0x45a8b0[_0x162a('0xa2')](_0x45a8b0[_0x162a('0xa1')], new Float32Array([-0x1, -0x1, 0x1, -0x1, 0x1, 0x1, 0x1, 0x1, -0x1, 0x1, -0x1, -0x1]), _0x45a8b0[_0x162a('0xa3')]);

  this[_0x162a('0xa4')] = _0x45a8b0[_0x162a('0xb4')]();

  _0x45a8b0['attachShader'](this[_0x162a('0xa4')], this[_0x162a('0xa6')](_0x45a8b0['VERTEX_SHADER'], this[_0x162a('0x92')]));

  _0x45a8b0['attachShader'](this[_0x162a('0xa4')], this['compileShader'](_0x45a8b0[_0x162a('0xa8')], this['SHADER_FRAGMENT_RGBA']));

  _0x45a8b0[_0x162a('0xb5')](this[_0x162a('0xa4')], 0x0, _0x162a('0xb1'));

  _0x45a8b0[_0x162a('0xaa')](this['program']);

  if (!_0x45a8b0['getProgramParameter'](this[_0x162a('0xa4')], _0x45a8b0['LINK_STATUS'])) {
    wsLogger['error'](_0x162a('0xac') + _0x45a8b0[_0x162a('0xad')](this[_0x162a('0xa4')]));
    this[_0x162a('0x6a')] = this[_0x162a('0x4')][_0x162a('0x99')]('2d');
    this[_0x162a('0x7b')] = this[_0x162a('0x9f')];
    return;
  }

  _0x45a8b0[_0x162a('0xae')](this[_0x162a('0xa4')]);

  _0x45a8b0[_0x162a('0xb2')](0x0);

  _0x45a8b0[_0x162a('0xb3')](0x0, 0x2, _0x45a8b0[_0x162a('0xb6')], ![], 0x0, 0x0);

  this['RGBTexture'] = this[_0x162a('0xaf')](0x0, 'RGBTexture');
  this['renderFunction'] = this[_0x162a('0xb7')];
};

VideoRenderer[_0x162a('0x47')][_0x162a('0x7')] = function () {
  this[_0x162a('0x71')] = this[_0x162a('0x4')]['width'];
  this[_0x162a('0x6b')] = this[_0x162a('0x4')][_0x162a('0x6b')];
  this[_0x162a('0x82')] = parseInt(this[_0x162a('0x71')]) + 0xf >> 0x4;
  this[_0x162a('0x83')] = this['mbWidth'] << 0x4;
  this[_0x162a('0x84')] = this[_0x162a('0x82')] << 0x3;

  var _0xe37a89;

  if ((typeof Uint8ClampedArray === "undefined" ? "undefined" : _typeof(Uint8ClampedArray)) !== _0x162a('0xb8')) {
    _0xe37a89 = Uint8ClampedArray;
  } else {
    _0xe37a89 = Uint8Array;
  }

  if (this['ctx2D']) {
    this[_0x162a('0x81')] = new _0xe37a89(this['canvas']['width'] * this['canvas']['height'] * 0x4);

    for (var _0x46edaf = 0x0, _0x9090eb = this[_0x162a('0x81')][_0x162a('0x1d')]; _0x46edaf < _0x9090eb; _0x46edaf++) {
      this[_0x162a('0x81')][_0x46edaf] = 0xff;
    }
  } else if (this['gl']) {
    this['gl']['viewport'](0x0, 0x0, this[_0x162a('0x71')], this['height']);
  }
};

VideoRenderer[_0x162a('0x47')][_0x162a('0x18')] = function () {
  if (this[_0x162a('0x6a')]) {
    var _0x2083e7 = this[_0x162a('0x6a')][_0x162a('0xb9')](this[_0x162a('0x71')], this[_0x162a('0x6b')]);

    this['ctx2D'][_0x162a('0xba')](_0x2083e7, 0x0, 0x0);
  } else if (this['gl']) {
    this['gl'][_0x162a('0xbb')](this['gl'][_0x162a('0xbc')] | this['gl'][_0x162a('0xbd')]);
  }
};

VideoRenderer[_0x162a('0x47')][_0x162a('0xaf')] = function (_0x10fdad, _0x34889c) {
  var _0x6b3e76 = this['gl'];

  var _0x18fcea = _0x6b3e76[_0x162a('0xaf')]();

  _0x6b3e76['bindTexture'](_0x6b3e76[_0x162a('0xbe')], _0x18fcea);

  _0x6b3e76[_0x162a('0xbf')](_0x6b3e76[_0x162a('0xbe')], _0x6b3e76[_0x162a('0xc0')], _0x6b3e76[_0x162a('0xc1')]);

  _0x6b3e76['texParameteri'](_0x6b3e76[_0x162a('0xbe')], _0x6b3e76[_0x162a('0xc2')], _0x6b3e76[_0x162a('0xc1')]);

  _0x6b3e76[_0x162a('0xbf')](_0x6b3e76[_0x162a('0xbe')], _0x6b3e76['TEXTURE_WRAP_S'], _0x6b3e76[_0x162a('0xc3')]);

  _0x6b3e76[_0x162a('0xbf')](_0x6b3e76['TEXTURE_2D'], _0x6b3e76[_0x162a('0xc4')], _0x6b3e76[_0x162a('0xc3')]);

  _0x6b3e76['uniform1i'](_0x6b3e76[_0x162a('0xc5')](this['program'], _0x34889c), _0x10fdad);

  return _0x18fcea;
};

VideoRenderer['prototype']['compileShader'] = function (_0x41c03b, _0x5f4578) {
  var _0x4f8efd = this['gl'];

  var _0x57e0eb = _0x4f8efd[_0x162a('0xc6')](_0x41c03b);

  _0x4f8efd['shaderSource'](_0x57e0eb, _0x5f4578);

  _0x4f8efd[_0x162a('0xa6')](_0x57e0eb);

  if (!_0x4f8efd[_0x162a('0xc7')](_0x57e0eb, _0x4f8efd[_0x162a('0xc8')])) {
    throw new Error(_0x4f8efd[_0x162a('0xc9')](_0x57e0eb));
  }

  return _0x57e0eb;
};

VideoRenderer[_0x162a('0x47')][_0x162a('0xca')] = function () {
  return (this['gl'] !== null || this['gl'] !== undefined) && (this['ctx2D'] == null || this[_0x162a('0x6a')] == undefined);
};

VideoRenderer[_0x162a('0x47')]['renderFrameGLYUV'] = function (_0x24528e) {
  var _0x5c538d = this['gl'];

  _0x5c538d[_0x162a('0xcb')](_0x5c538d['TEXTURE0']);

  _0x5c538d[_0x162a('0xcc')](_0x5c538d[_0x162a('0xbe')], this[_0x162a('0x7d')]);

  _0x5c538d[_0x162a('0xcd')](_0x5c538d[_0x162a('0xbe')], 0x0, _0x5c538d[_0x162a('0xce')], this[_0x162a('0x83')], this[_0x162a('0x6b')], 0x0, _0x5c538d[_0x162a('0xce')], _0x5c538d[_0x162a('0xcf')], _0x24528e['y']);

  _0x5c538d[_0x162a('0xcb')](_0x5c538d[_0x162a('0xd0')]);

  _0x5c538d['bindTexture'](_0x5c538d[_0x162a('0xbe')], this['CRTexture']);

  _0x5c538d[_0x162a('0xcd')](_0x5c538d['TEXTURE_2D'], 0x0, _0x5c538d[_0x162a('0xce')], this[_0x162a('0x84')], this[_0x162a('0x6b')] / 0x2, 0x0, _0x5c538d[_0x162a('0xce')], _0x5c538d[_0x162a('0xcf')], _0x24528e['cr']);

  _0x5c538d[_0x162a('0xcb')](_0x5c538d[_0x162a('0xd1')]);

  _0x5c538d[_0x162a('0xcc')](_0x5c538d['TEXTURE_2D'], this[_0x162a('0x7e')]);

  _0x5c538d[_0x162a('0xcd')](_0x5c538d[_0x162a('0xbe')], 0x0, _0x5c538d['LUMINANCE'], this[_0x162a('0x84')], this['height'] / 0x2, 0x0, _0x5c538d[_0x162a('0xce')], _0x5c538d[_0x162a('0xcf')], _0x24528e['cb']);

  _0x5c538d[_0x162a('0xd2')](_0x5c538d[_0x162a('0xd3')], 0x0, 0x4);
};

VideoRenderer['prototype'][_0x162a('0xb7')] = function (_0x5982ea) {
  var _0x36021f = this['gl'];

  _0x36021f[_0x162a('0xcb')](_0x36021f[_0x162a('0xd4')]);

  _0x36021f['bindTexture'](_0x36021f[_0x162a('0xbe')], this['RGBTexture']);

  _0x36021f[_0x162a('0xcd')](_0x36021f['TEXTURE_2D'], 0x0, _0x36021f[_0x162a('0xd5')], _0x5982ea[_0x162a('0x71')], _0x5982ea['height'], 0x0, _0x36021f[_0x162a('0xd5')], _0x36021f['UNSIGNED_BYTE'], _0x5982ea[_0x162a('0x14')]);

  _0x36021f[_0x162a('0xd2')](_0x36021f[_0x162a('0xd6')], 0x0, 0x6);
};

VideoRenderer[_0x162a('0x47')]['renderFrame2D'] = function (_0x4d5a01) {
  var _0x84c411 = this[_0x162a('0x6a')][_0x162a('0xb9')](_0x4d5a01['width'], _0x4d5a01[_0x162a('0x6b')]);

  if (_0x4d5a01[_0x162a('0xd7')] == _0x162a('0xc')) {
    this[_0x162a('0xd8')](_0x4d5a01);

    _0x84c411['data'][_0x162a('0xd9')](this[_0x162a('0x81')]);
  } else {
    _0x84c411[_0x162a('0x14')]['set'](_0x4d5a01[_0x162a('0x14')]);
  }

  this[_0x162a('0x6a')][_0x162a('0xba')](_0x84c411, 0x0, 0x0);
};

VideoRenderer[_0x162a('0x47')]['render'] = function (_0x467dad) {
  if (!this[_0x162a('0x27')]) {
    if (this[_0x162a('0x4')][_0x162a('0x71')] != _0x467dad['width'] || this[_0x162a('0x4')][_0x162a('0x6b')] != _0x467dad[_0x162a('0x6b')]) {
      wsLogger[_0x162a('0x5f')](_0x162a('0xda') + this[_0x162a('0x4')][_0x162a('0x71')] + 'x' + this[_0x162a('0x4')]['height'] + _0x162a('0xdb') + _0x467dad[_0x162a('0x71')] + 'x' + _0x467dad[_0x162a('0x6b')]);

      this[_0x162a('0x4')]['width'] = _0x467dad[_0x162a('0x71')];
      this[_0x162a('0x4')][_0x162a('0x6b')] = _0x467dad[_0x162a('0x6b')];

      var _0x44e234 = new Event('resize');

      this[_0x162a('0x4')][_0x162a('0x65')](_0x44e234);

      this[_0x162a('0x7')]();
    }

    this[_0x162a('0x7b')](_0x467dad);
  }

  this[_0x162a('0xdc')] = Date[_0x162a('0x2c')]();
};

VideoRenderer[_0x162a('0x47')]['YCbCrToRGBA'] = function (_0x3a6afc) {
  var _0x2d188b = _0x3a6afc['y'];
  var _0x31895c = _0x3a6afc['cb'];
  var _0x1a9970 = _0x3a6afc['cr'];

  var _0x410b7d = this[_0x162a('0x81')];

  var _0x599197 = 0x0;

  var _0x7186b7 = this[_0x162a('0x83')];

  var _0xfec764 = this['codedWidth'] + (this[_0x162a('0x83')] - _0x3a6afc[_0x162a('0x71')]);

  var _0x48cdb2 = 0x0;

  var _0x5adcf1 = this[_0x162a('0x84')] - (_0x3a6afc['width'] >> 0x1);

  var _0x1efcdf = 0x0;

  var _0x306a15 = _0x3a6afc[_0x162a('0x71')] * 0x4;

  var _0x5b89c9 = _0x3a6afc[_0x162a('0x71')] * 0x4;

  var _0x83a94e = _0x3a6afc[_0x162a('0x71')] >> 0x1;

  var _0x46e569 = _0x3a6afc[_0x162a('0x6b')] >> 0x1;

  var _0x170074, _0x356f54, _0x42843a, _0x402f62, _0x1fe8a6, _0xb3c8fd;

  for (var _0x4574e3 = 0x0; _0x4574e3 < _0x46e569; _0x4574e3++) {
    for (var _0x33b5b4 = 0x0; _0x33b5b4 < _0x83a94e; _0x33b5b4++) {
      _0x356f54 = _0x31895c[_0x48cdb2];
      _0x42843a = _0x1a9970[_0x48cdb2];
      _0x48cdb2++;
      _0x402f62 = _0x42843a + (_0x42843a * 0x67 >> 0x8) - 0xb3;
      _0x1fe8a6 = (_0x356f54 * 0x58 >> 0x8) - 0x2c + (_0x42843a * 0xb7 >> 0x8) - 0x5b;
      _0xb3c8fd = _0x356f54 + (_0x356f54 * 0xc6 >> 0x8) - 0xe3;
      var _0xba7424 = _0x2d188b[_0x599197++];
      var _0x5ab42c = _0x2d188b[_0x599197++];
      _0x410b7d[_0x1efcdf] = _0xba7424 + _0x402f62;
      _0x410b7d[_0x1efcdf + 0x1] = _0xba7424 - _0x1fe8a6;
      _0x410b7d[_0x1efcdf + 0x2] = _0xba7424 + _0xb3c8fd;
      _0x410b7d[_0x1efcdf + 0x4] = _0x5ab42c + _0x402f62;
      _0x410b7d[_0x1efcdf + 0x5] = _0x5ab42c - _0x1fe8a6;
      _0x410b7d[_0x1efcdf + 0x6] = _0x5ab42c + _0xb3c8fd;
      _0x1efcdf += 0x8;
      var _0x2dbbbe = _0x2d188b[_0x7186b7++];
      var _0x1e85ab = _0x2d188b[_0x7186b7++];
      _0x410b7d[_0x306a15] = _0x2dbbbe + _0x402f62;
      _0x410b7d[_0x306a15 + 0x1] = _0x2dbbbe - _0x1fe8a6;
      _0x410b7d[_0x306a15 + 0x2] = _0x2dbbbe + _0xb3c8fd;
      _0x410b7d[_0x306a15 + 0x4] = _0x1e85ab + _0x402f62;
      _0x410b7d[_0x306a15 + 0x5] = _0x1e85ab - _0x1fe8a6;
      _0x410b7d[_0x306a15 + 0x6] = _0x1e85ab + _0xb3c8fd;
      _0x306a15 += 0x8;
    }

    _0x599197 += _0xfec764;
    _0x7186b7 += _0xfec764;
    _0x1efcdf += _0x5b89c9;
    _0x306a15 += _0x5b89c9;
    _0x48cdb2 += _0x5adcf1;
  }
};

VideoRenderer['prototype'][_0x162a('0xdd')] = function () {
  return this['lastTimeRendered'];
};

VideoRenderer[_0x162a('0x47')][_0x162a('0x58')] = function (_0x282d57) {
  if (_0x282d57) {
    this['muted'] = !![];
  } else {
    this[_0x162a('0x27')] = ![];
  }
};

function AudioPlayer(_0x21395c) {
  var _0xfdbf8 = this;

  this[_0x162a('0x7')]();

  this[_0x162a('0xde')] = ![];
  this[_0x162a('0x31')] = _0x21395c;
  this[_0x162a('0xdf')] = _0x21395c[_0x162a('0xe0')]();

  this[_0x162a('0xdf')][_0x162a('0x56')](_0x21395c['destination']);

  this[_0x162a('0x58')](!![]);

  wsLogger[_0x162a('0x5f')]('Sample\x20rate\x20' + this[_0x162a('0x31')][_0x162a('0x32')]);

  var _0x363810 = [];

  var _0x4a5353;

  for (_0x4a5353 = 0x100; _0x4a5353 <= 0x4000; _0x4a5353 = _0x4a5353 * 0x2) {
    _0x363810[_0x162a('0x23')](_0x4a5353);
  }

  var _0x4d6dd9 = this[_0x162a('0x31')][_0x162a('0x32')] / 0x1;

  var _0x3b65d4 = _0x363810[0x0];

  var _0x4e4e5e = Math[_0x162a('0xe1')](_0x4d6dd9 - _0x3b65d4);

  for (_0x4a5353 = 0x0; _0x4a5353 < _0x363810['length']; _0x4a5353++) {
    var _0xec6c77 = Math[_0x162a('0xe1')](_0x4d6dd9 - _0x363810[_0x4a5353]);

    if (_0xec6c77 < _0x4e4e5e) {
      _0x4e4e5e = _0xec6c77;
      _0x3b65d4 = _0x363810[_0x4a5353];
    }
  }

  wsLogger[_0x162a('0x5f')](_0x162a('0xe2') + _0x3b65d4);

  this[_0x162a('0xe3')] = _0x3b65d4;
  this['audioChunkTimeLength'] = this['internalBufferSize'] / this[_0x162a('0x31')][_0x162a('0x32')] * 0x3e8;

  try {
    this[_0x162a('0x31')][_0x162a('0xe4')] = this[_0x162a('0x31')]['createScriptProcessor'] || this['context']['createJavaScriptNode'];
    this['audioJSNode'] = this[_0x162a('0x31')]['createScriptProcessor'](this[_0x162a('0xe3')], 0x1, 0x1);
  } catch (_0x5e2288) {
    wsLogger[_0x162a('0xa')]('JS\x20Audio\x20Node\x20is\x20not\x20supported\x20in\x20this\x20browser' + _0x5e2288);
  }

  this[_0x162a('0xe5')]['onaudioprocess'] = function (_0x26db61) {
    var _0x163877 = _0x26db61['outputBuffer'][_0x162a('0x52')](0x0);

    var _0x4a5353;

    if (_0xfdbf8[_0x162a('0x3e')][_0x162a('0x1d')] > 0x0) {
      var _0x1d8762 = _0xfdbf8[_0x162a('0x3e')][_0x162a('0x3c')]();

      for (_0x4a5353 = 0x0; _0x4a5353 < _0x163877['length']; _0x4a5353++) {
        _0x163877[_0x4a5353] = _0x1d8762[_0x162a('0x4c')][_0x4a5353];
      }

      if (!_0xfdbf8['lastSync']) {
        _0xfdbf8['previousSync'] = _0x1d8762[_0x162a('0x3f')];
      } else {
        _0xfdbf8[_0x162a('0xe6')] = _0xfdbf8[_0x162a('0xe7')];
      }

      _0xfdbf8['lastSync'] = _0x1d8762[_0x162a('0x3f')];

      if (!_0xfdbf8[_0x162a('0xe8')]) {
        _0xfdbf8['previousSyncTime'] = _0x26db61[_0x162a('0xe9')] * 0x3e8;
      } else {
        _0xfdbf8['previousSyncTime'] = _0xfdbf8[_0x162a('0xe8')];
      }

      _0xfdbf8['lastSyncTime'] = _0x26db61[_0x162a('0xe9')] * 0x3e8;
      _0xfdbf8['bufferExhausted'] = ![];
    } else {
      for (_0x4a5353 = 0x0; _0x4a5353 < _0x163877['length']; _0x4a5353++) {
        _0x163877[_0x4a5353] = 0x0;
      }

      _0xfdbf8['bufferExhausted'] = !![];

      if (_0xfdbf8[_0x162a('0xdf')]['gain'][_0x162a('0xea')] != 0x0) {
        wsLogger[_0x162a('0x7a')]('No\x20audio\x20in\x20audio\x20buffer!');
      }
    }
  };
}

AudioPlayer[_0x162a('0x47')][_0x162a('0x40')] = function () {
  if (!this[_0x162a('0xde')]) {
    this['audioJSNode'][_0x162a('0x56')](this['gainNode']);

    this[_0x162a('0xde')] = !![];
  }

  this[_0x162a('0x58')](![]);
};

AudioPlayer[_0x162a('0x47')]['stop'] = function () {
  this['audioJSNode'][_0x162a('0xeb')]();

  this[_0x162a('0xde')] = ![];
  this[_0x162a('0xe7')] = undefined;
  this[_0x162a('0xe8')] = undefined;
  this[_0x162a('0x3e')] = [];
  this['mute'](!![]);
};

AudioPlayer[_0x162a('0x47')][_0x162a('0x7')] = function () {
  if (this[_0x162a('0x3e')]) {
    this[_0x162a('0x3e')]['length'] = 0x0;
  } else {
    this[_0x162a('0x3e')] = [];
  }
};

AudioPlayer[_0x162a('0x47')][_0x162a('0xec')] = function () {
  this['initBuffers']();
};

AudioPlayer[_0x162a('0x47')][_0x162a('0xed')] = function (_0x554ebf) {
  this['audioBuffer'][_0x162a('0x23')](_0x554ebf);
};

AudioPlayer[_0x162a('0x47')][_0x162a('0xee')] = function () {
  return this[_0x162a('0x3e')]['length'];
};

AudioPlayer[_0x162a('0x47')][_0x162a('0x25')] = function () {
  if (this[_0x162a('0xe7')] && this['lastSyncTime']) {
    var _0x21f724 = this[_0x162a('0x31')][_0x162a('0xef')] * 0x3e8;

    if (_0x21f724 >= this[_0x162a('0xe8')]) {
      if (_0x21f724 - this[_0x162a('0xe8')] > this[_0x162a('0xf0')]) {
        wsLogger[_0x162a('0x7a')](_0x162a('0xf1') + (_0x21f724 - this[_0x162a('0xf0')] - this[_0x162a('0xe8')]));

        return this['lastSync'] + this[_0x162a('0xf0')];
      }

      return _0x21f724 - this[_0x162a('0xe8')] + this['lastSync'];
    } else {
      return _0x21f724 - this[_0x162a('0xf2')] + this[_0x162a('0xe6')];
    }
  }

  return -0x1;
};

AudioPlayer[_0x162a('0x47')][_0x162a('0x2d')] = function () {
  var _0x4d5368 = this[_0x162a('0x31')][_0x162a('0xef')] * 0x3e8 - this[_0x162a('0xe8')];

  var _0xd6ff56 = this[_0x162a('0xf0')] - _0x4d5368;

  return _0xd6ff56 > 0x0 ? this['audioChunkTimeLength'] * this[_0x162a('0x3e')]['length'] + _0xd6ff56 : this[_0x162a('0xf0')] * this['audioBuffer'][_0x162a('0x1d')];
};

AudioPlayer[_0x162a('0x47')]['getLastTimePlayed'] = function () {
  return this[_0x162a('0xe8')];
};

AudioPlayer['prototype'][_0x162a('0x58')] = function (_0x197c70) {
  if (_0x197c70) {
    wsLogger[_0x162a('0x5f')](_0x162a('0xf3'));

    this['gainNode'][_0x162a('0xf4')]['value'] = 0x0;
  } else {
    wsLogger['log'](_0x162a('0xf5'));
    this[_0x162a('0xdf')][_0x162a('0xf4')][_0x162a('0xea')] = 0x1;
  }
};

AudioPlayer['prototype'][_0x162a('0x41')] = function (_0x36b36f) {
  this[_0x162a('0xdf')][_0x162a('0xf4')][_0x162a('0xea')] = _0x36b36f / 0x64;
};

AudioPlayer['prototype'][_0x162a('0x5c')] = function () {
  return this['gainNode'][_0x162a('0xf4')][_0x162a('0xea')] * 0x64;
};

var WSPlayerState = function WSPlayerState() {};

WSPlayerState[_0x162a('0x3d')] = _0x162a('0x3d');
WSPlayerState[_0x162a('0x26')] = 'PLAYING';
WSPlayerState[_0x162a('0x59')] = 'PAUSED';
WSPlayerState['STARTUP'] = 'STARTUP';
exports['WSPlayer'] = WSPlayer;

},{}],29:[function(require,module,exports){
'use strict';
/**
 * @namespace Flashphoner.constants.SESSION_STATUS
 * @see Session
 */

var sessionStatus = {};
/**
 * Fires when {@link Session} ws socket opens.
 * @event CONNECTED
 * @memberof Flashphoner.constants.SESSION_STATUS
 */

define(sessionStatus, 'CONNECTED', 'CONNECTED');
/**
 * Fires when {@link Session} receives connect ack from REST App.
 * @event ESTABLISHED
 * @memberof Flashphoner.constants.SESSION_STATUS
 */

define(sessionStatus, 'ESTABLISHED', 'ESTABLISHED');
/**
 * Fires when {@link Session} disconnects.
 * @event DISCONNECTED
 * @memberof Flashphoner.constants.SESSION_STATUS
 */

define(sessionStatus, 'DISCONNECTED', 'DISCONNECTED');
/**
 * Fires if {@link Session} call of rest method error.
 * @event WARN
 * @memberof Flashphoner.constants.SESSION_STATUS
 */

define(sessionStatus, 'WARN', 'WARN');
/**
 * Fires if {@link Session} connection failed.
 * Some of the reasons can be network connection failed, REST App failed
 * @event FAILED
 * @memberof Flashphoner.constants.SESSION_STATUS
 */

define(sessionStatus, 'FAILED', 'FAILED');
/**
 * Fires wneh {@link Session} receives debug event
 * @event DEBUG
 * @memberof Flashphoner.constants.SESSION_STATUS
 */

define(sessionStatus, 'DEBUG', 'DEBUG');
/**
 * Fires when {@link Session} receives custom REST App message.
 *
 * @event APP_DATA
 * @memberof Flashphoner.constants.SESSION_STATUS
 */

define(sessionStatus, 'APP_DATA', 'APP_DATA');
/**
 * Fires when {@link Session} receives status of sendData operation.
 *
 * @event SEND_DATA_STATUS
 * @memberof Flashphoner.constants.SESSION_STATUS
 */

define(sessionStatus, 'SEND_DATA_STATUS', 'SEND_DATA_STATUS'); //State of newly created Session

define(sessionStatus, 'PENDING', 'PENDING');
/**
 * Fires when {@link Session} registers as sip client.
 *
 * @event APP_DATA
 * @memberof Flashphoner.constants.SESSION_STATUS
 */

define(sessionStatus, 'REGISTERED', 'REGISTERED');
/**
 * Fires when {@link Session} unregisters as sip client.
 *
 * @event APP_DATA
 * @memberof Flashphoner.constants.SESSION_STATUS
 */

define(sessionStatus, 'UNREGISTERED', 'UNREGISTERED');
define(sessionStatus, 'INCOMING_CALL', 'INCOMING_CALL');
/**
 * @namespace Flashphoner.constants.STREAM_STATUS
 * @see Stream
 */

var streamStatus = {}; //State of newly created Stream

define(streamStatus, 'NEW', 'NEW'); //State between publish/play and server response

define(streamStatus, 'PENDING', 'PENDING');
/**
 * Fires when {@link Stream} starts publishing.
 * @event PUBLISHING
 * @memberof Flashphoner.constants.STREAM_STATUS
 */

define(streamStatus, 'PUBLISHING', 'PUBLISHING');
/**
 * Fires when {@link Stream} starts playing.
 * @event PLAYING
 * @memberof Flashphoner.constants.STREAM_STATUS
 */

define(streamStatus, 'PLAYING', 'PLAYING');
/**
 * Fires if {@link Stream} paused.
 * @event PAUSED
 * @memberof Flashphoner.constants.STREAM_STATUS
 */

define(streamStatus, 'PAUSED', 'PAUSED');
/**
 * Fires if {@link Stream} was unpublished.
 * @event UNPUBLISHING
 * @memberof Flashphoner.constants.STREAM_STATUS
 */

define(streamStatus, 'UNPUBLISHED', 'UNPUBLISHED');
/**
 * Fires if {@link Stream} was stopped.
 * @event STOPPED
 * @memberof Flashphoner.constants.STREAM_STATUS
 */

define(streamStatus, 'STOPPED', 'STOPPED');
/**
 * Fires if {@link Stream} failed.
 * @event FAILED
 * @memberof Flashphoner.constants.STREAM_STATUS
 */

define(streamStatus, 'FAILED', 'FAILED');
/**
 * Fires if {@link Stream} playback problem.
 * @event PLAYBACK_PROBLEM
 * @memberof Flashphoner.constants.STREAM_STATUS
 */

define(streamStatus, 'PLAYBACK_PROBLEM', 'PLAYBACK_PROBLEM');
/**
 * Fires if {@link Stream} resize.
 * @event RESIZE
 * @memberof Flashphoner.constants.STREAM_STATUS
 */

define(streamStatus, 'RESIZE', 'RESIZE');
/**
 * Fires when {@link Stream} snapshot becomes available.
 * Snapshot is base64 encoded png available through {@link Stream.getInfo}
 * @event SNAPSHOT_COMPLETE
 * @memberof Flashphoner.constants.STREAM_STATUS
 */

define(streamStatus, 'SNAPSHOT_COMPLETE', 'SNAPSHOT_COMPLETE');
/**
 * Fires on subscribe {@link Stream} if bitrate is higher than available network bandwidth.
 * @event NOT_ENOUGH_BANDWIDTH
 * @memberof Flashphoner.constants.NOT_ENOUGH_BANDWIDTH
 */

define(streamStatus, 'NOT_ENOUGH_BANDWIDTH', 'NOT_ENOUGH_BANDWIDTH');
/**
 * @namespace Flashphoner.constants.CALL_STATUS
 * @see Call
 */

var callStatus = {}; //State of newly created Call

define(callStatus, 'NEW', 'NEW');
define(callStatus, 'RING', 'RING');
define(callStatus, 'RING_MEDIA', 'RING_MEDIA');
define(callStatus, 'HOLD', 'HOLD');
define(callStatus, 'ESTABLISHED', 'ESTABLISHED');
define(callStatus, 'FINISH', 'FINISH');
define(callStatus, 'BUSY', 'BUSY');
define(callStatus, 'SESSION_PROGRESS', 'SESSION_PROGRESS');
define(callStatus, 'FAILED', 'FAILED');
define(callStatus, 'PENDING', 'PENDING');
define(callStatus, 'TRYING', 'TRYING');
/**
* @namespace Flashphoner.constants.STREAM_STATUS_INFO
* @see Stream
*/

var streamStatusInfo = {};
/**
 * Indicates general error during ICE negotiation. Usually occurs if client is behind some exotic nat/firewall.
 * @event FAILED_BY_ICE_ERROR
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_BY_ICE_ERROR', 'Failed by ICE error');
/**
 * Timeout has been reached during ICE establishment.
 * @event FAILED_BY_ICE_TIMEOUT
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_BY_ICE_TIMEOUT', 'Failed by ICE timeout');
/**
 * ICE refresh failed on session.
 * @event FAILED_BY_KEEP_ALIVE
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_BY_KEEP_ALIVE', 'Failed by ICE keep alive');
/**
 * DTLS has wrong fingerprint.
 * @event FAILED_BY_DTLS_FINGERPRINT_ERROR
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_BY_DTLS_FINGERPRINT_ERROR', 'Failed by DTLS fingerprint error');
/**
 * Client did not send DTLS packets or packets were lost/corrupted during transmission.
 * @event FAILED_BY_DTLS_ERROR
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_BY_DTLS_ERROR', 'Failed by DTLS error');
/**
 * Indicates general HLS packetizer error, can occur during initialization or packetization (wrong input or out of disk space).
 * @event FAILED_BY_HLS_WRITER_ERROR
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_BY_HLS_WRITER_ERROR', 'Failed by HLS writer error');
/**
 * Indicates general RTMP republishing error, can occur during initialization or rtmp packetization.
 * @event FAILED_BY_RTMP_WRITER_ERROR
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_BY_RTMP_WRITER_ERROR', 'Failed by RTMP writer error');
/**
 * RTP session failed by RTP activity timer.
 * @event FAILED_BY_RTP_ACTIVITY
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_BY_RTP_ACTIVITY', 'Failed by RTP activity');
/**
 * Related session was disconnected.
 * @event STOPPED_BY_SESSION_DISCONNECT
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'STOPPED_BY_SESSION_DISCONNECT', 'Stopped by session disconnect');
/**
 * Stream was stopped by rest terminate request.
 * @event STOPPED_BY_REST_TERMINATE
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'STOPPED_BY_REST_TERMINATE', 'Stopped by rest /terminate');
/**
 * Related publisher stopped its stream or lost connection.
 * @event STOPPED_BY_PUBLISHER_STOP
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'STOPPED_BY_PUBLISHER_STOP', 'Stopped by publisher stop');
/**
 * Stop the media session by user after call was finished or unpublish stream.
 * @event STOPPED_BY_USER
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'STOPPED_BY_USER', 'Stopped by user');
/**
 * Error occurred on the stream.
 * @event FAILED_BY_ERROR
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_BY_ERROR', 'Failed by error');
/**
 * Indicates that error occurred during media session creation. This might be SDP parsing error, all ports are busy, wrong session related config etc.
 * @event FAILED_TO_ADD_STREAM_TO_PROXY
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_TO_ADD_STREAM_TO_PROXY', 'Failed to add stream to proxy');
/**
 * Stopped shapshot distributor.
 * @event DISTRIBUTOR_STOPPED
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'DISTRIBUTOR_STOPPED', 'Distributor stopped');
/**
 * Publish stream is not ready, try again later.
 * @event PUBLISH_STREAM_IS_NOT_READY
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'PUBLISH_STREAM_IS_NOT_READY', 'Publish stream is not ready');
/**
 * Stream with this name is not found, check the correct of the name.
 * @event STREAM_NOT_FOUND
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'STREAM_NOT_FOUND', 'Stream not found');
/**
 * Server already has a publish stream with the same name, try using different one.
 * @event STREAM_NAME_ALREADY_IN_USE
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'STREAM_NAME_ALREADY_IN_USE', 'Stream name is already in use');
/**
 * Error indicates that stream object received by server has empty mediaSessionId field.
 * @event MEDIASESSION_ID_NULL
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'MEDIASESSION_ID_NULL', 'MediaSessionId is null');
/**
 * Published or subscribed sessions used this MediaSessionId.
 * @event MEDIASESSION_ID_ALREADY_IN_USE
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'MEDIASESSION_ID_ALREADY_IN_USE', 'MediaSessionId is already in use');
/**
 * Session is not initialized or terminated on play ordinary stream.
 * @event SESSION_NOT_READY
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'SESSION_NOT_READY', 'Session not ready');
/**
 * Actual session does not exist.
 * @event SESSION_DOES_NOT_EXIST
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'SESSION_DOES_NOT_EXIST', 'Session does not exist');
/**
 * RTSP has wrong format on play stream, check correct of the RTSP url.
 * @event RTSP_HAS_WRONG_FORMAT
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'RTSP_HAS_WRONG_FORMAT', 'Rtsp has wrong format');
/**
 * Failed to play vod stream, this format is not supported.
 * @event FILE_HAS_WRONG_FORMAT
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FILE_HAS_WRONG_FORMAT', 'File has wrong format');
/**
 * Failed to connect to rtsp stream.
 * @event FAILED_TO_CONNECT_TO_RTSP_STREAM
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_TO_CONNECT_TO_RTSP_STREAM', 'Failed to connect to rtsp stream');
/**
 * Rtsp stream is not found, agent received "404-Not Found".
 * @event RTSP_STREAM_NOT_FOUND
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'RTSP_STREAM_NOT_FOUND', 'Rtsp stream not found');
/**
 * On shutdown RTSP agent.
 * @event RTSPAGENT_SHUTDOWN
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'RTSPAGENT_SHUTDOWN', 'RtspAgent shutdown');
/**
 * Stream failed
 * @event STREAM_FAILED
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'STREAM_FAILED', 'Stream failed');
/**
 * No common codecs on setup track, did not found corresponding trackId->mediaPort.
 * @event NO_COMMON_CODECS
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'NO_COMMON_CODECS', 'No common codecs');
/**
 * Bad referenced rtsp link, check for correct, example: rtsp://user:b@d_password@127.0.0.1/stream.
 * @event BAD_URI
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'BAD_URI', 'Bad URI');
/**
 * General VOD error, indicates that Exception occurred while reading/processing media file.
 * @event GOT_EXCEPTION_WHILE_STREAMING_FILE
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'GOT_EXCEPTION_WHILE_STREAMING_FILE', 'Got exception while streaming file');
/**
 * Requested stream shutdown.
 * @event REQUESTED_STREAM_SHUTDOWN
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'REQUESTED_STREAM_SHUTDOWN', 'Requested stream shutdown');
/**
 * Failed to create movie, file can not be read.
 * @event FAILED_TO_READ_FILE
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_TO_READ_FILE', 'Failed to read file');
/**
 * File does not exist, check filename.
 * @event FILE_NOT_FOUND
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FILE_NOT_FOUND', 'File not found');
/**
 * Server failed to establish websocket connection with origin server.
 * @event FAILED_TO_CONNECT_TO_ORIGIN_STREAM
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_TO_CONNECT_TO_ORIGIN_STREAM', 'Failed to connect to origin stream');
/**
 * CDN stream not found.
 * @event CDN_STREAM_NOT_FOUND
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'CDN_STREAM_NOT_FOUND', 'CDN stream not found');
/**
 * Indicates that provided URL protocol in stream name is invalid.
 * Valid: vod://file.mp4
 * Invalid: dov://file.mp4
 * @event FAILED_TO_GET_AGENT_STORAGE
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_TO_GET_AGENT_STORAGE', 'Failed to get agent storage');
/**
 * Shutdown agent servicing origin stream.
 * @event AGENT_SERVICING_ORIGIN_STREAM_IS_SHUTTING_DOWN
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'AGENT_SERVICING_ORIGIN_STREAM_IS_SHUTTING_DOWN', 'Agent servicing origin stream is shutting down');
/**
 * Terminated by keep-alive on walk through subscribers.
 * @event TERMINATED_BY_KEEP_ALIVE
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'TERMINATED_BY_KEEP_ALIVE', 'Terminated by keep-alive');
/**
 * Transcoding required, but disabled in settings
 * @event TRANSCODING_REQUIRED_BUT_DISABLED
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'TRANSCODING_REQUIRED_BUT_DISABLED', 'Transcoding required, but disabled');
/**
 * Access restricted by access list
 * @event RESTRICTED_ACCESS
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'RESTRICTED_ACCESS', 'Restricted access');
/**
 * No available transcoders for stream
 * @event RESTRICTED_ACCESS
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'NO_AVAILABLE_TRANSCODERS', 'No available transcoders');
/**
* @namespace Flashphoner.constants.CALL_STATUS_INFO
* @see Call
*/

var callStatusInfo = {};
/**
 * Normal call hangup.
 * @event NORMAL_CALL_CLEARING
 * @memberof Flashphoner.constants.CALL_STATUS_INFO
 */

define(callStatusInfo, 'NORMAL_CALL_CLEARING', 'Normal call clearing');
/**
 * Error occurred on session creation.
 * @event FAILED_BY_SESSION_CREATION
 * @memberof Flashphoner.constants.CALL_STATUS_INFO
 */

define(callStatusInfo, 'FAILED_BY_SESSION_CREATION', 'Failed by session creation');
/**
 * Failed by error during ICE establishment.
 * @event FAILED_BY_ICE_ERROR
 * @memberof Flashphoner.constants.CALL_STATUS_INFO
 */

define(callStatusInfo, 'FAILED_BY_ICE_ERROR', 'Failed by ICE error');
/**
 * RTP session failed by RTP activity timer.
 * @event FAILED_BY_RTP_ACTIVITY
 * @memberof Flashphoner.constants.CALL_STATUS_INFO
 */

define(callStatusInfo, 'FAILED_BY_RTP_ACTIVITY', 'Failed by RTP activity');
/**
 * FF writer was failed on RTMP.
 * @event FAILED_BY_RTMP_WRITER_ERROR
 * @memberof Flashphoner.constants.CALL_STATUS_INFO
 */

define(callStatusInfo, 'FAILED_BY_RTMP_WRITER_ERROR', 'Failed by RTMP writer error');
/**
 * DTLS wrong fingerprint.
 * @event FAILED_BY_DTLS_FINGERPRINT_ERROR
 * @memberof Flashphoner.constants.CALL_STATUS_INFO
 */

define(callStatusInfo, 'FAILED_BY_DTLS_FINGERPRINT_ERROR', 'Failed by DTLS fingerprint error');
/**
 * No common codecs in sdp
 * @event NO_COMMON_CODECS
 * @memberof Flashphoner.constants.CALL_STATUS_INFO
 */

define(callStatusInfo, 'NO_COMMON_CODECS', 'No common codecs');
/**
 * Client did not send DTLS packets or packets were lost/corrupted during transmission.
 * @event FAILED_BY_DTLS_ERROR
 * @memberof Flashphoner.constants.CALL_STATUS_INFO
 */

define(callStatusInfo, 'FAILED_BY_DTLS_ERROR', 'Failed by DTLS error');
/**
 * Error occurred during call
 * @event FAILED_BY_ERROR
 * @memberof Flashphoner.constants.CALL_STATUS_INFO
 */

define(callStatusInfo, 'FAILED_BY_ERROR', 'Failed by error');
/**
 * Call failed by request timeout
 * @event FAILED_BY_REQUEST_TIMEOUT
 * @memberof Flashphoner.constants.CALL_STATUS_INFO
 */

define(callStatusInfo, 'FAILED_BY_REQUEST_TIMEOUT', 'Failed by request timeout');
/**
 * Transcoding required, but disabled in settings
 * @event TRANSCODING_REQUIRED_BUT_DISABLED
 * @memberof Flashphoner.constants.CALL_STATUS_INFO
 */

define(callStatusInfo, 'TRANSCODING_REQUIRED_BUT_DISABLED', 'Transcoding required, but disabled');
/**
* @namespace Flashphoner.constants.ERROR_INFO
*/

var errorInfo = {};
/**
 * Error if none of MediaProviders available
 * @event NONE_OF_MEDIAPROVIDERS_AVAILABLE
 * @memberof Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'NONE_OF_MEDIAPROVIDERS_AVAILABLE', 'None of MediaProviders available');
/**
 * Error if none of preferred MediaProviders available
 * @event NONE_OF_PREFERRED_MEDIAPROVIDERS_AVAILABLE
 * @memberof Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'NONE_OF_PREFERRED_MEDIAPROVIDERS_AVAILABLE', 'None of preferred MediaProviders available');
/**
 * Error if API is not initialized
 * @event FLASHPHONER_API_NOT_INITIALIZED
 * @memberof Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'FLASHPHONER_API_NOT_INITIALIZED', 'Flashphoner API is not initialized');
/**
 * Error if options.urlServer is not specified
 * @event OPTIONS_URLSERVER_MUST_BE_PROVIDED
 * @memberof Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'OPTIONS_URLSERVER_MUST_BE_PROVIDED', 'options.urlServer must be provided');
/**
 * Error if session state is not REGISTERED
 * @event INVALID_SESSION_STATE
 * @memberof Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'INVALID_SESSION_STATE', 'Invalid session state');
/**
 * Error if no options provided
 * @event OPTIONS_MUST_BE_PROVIDED
 * @memberof Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'OPTIONS_MUST_BE_PROVIDED', 'options must be provided');
/**
 * Error if call status is not {@link Flashphoner.constants.CALL_STATUS.NEW}
 * @event INVALID_CALL_STATE
 * @memberof Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'INVALID_CALL_STATE', 'Invalid call state');
/**
 * Error if event is not specified
 * @event EVENT_CANT_BE_NULL
 * @memberof Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'EVENT_CANT_BE_NULL', 'Event can\'t be null');
/**
 * Error if callback is not a valid function
 * @event CALLBACK_NEEDS_TO_BE_A_VALID_FUNCTION
 * @memberof Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'CALLBACK_NEEDS_TO_BE_A_VALID_FUNCTION', 'Callback needs to be a valid function');
/**
 * Error if session state is not ESTABLISHED
 * @event INVALID_SESSION_STATE
 * @memberof Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'INVALID_SESSION_STATE', 'Invalid session state');
/**
 * Error if options.name is not specified
 * @event OPTIONS_NAME_MUST_BE_PROVIDED
 * @memberof Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'OPTIONS_NAME_MUST_BE_PROVIDED', 'options.name must be provided');
/**
 * Error if number of cams is less than 2 or already used custom stream
 * @event CAN_NOT_SWITCH_CAM
 * @memberOf Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'CAN_NOT_SWITCH_CAM', 'Number of cams is less than 2 or already used custom stream');
/**
 * Error if number of mics is less than 2 or already used custom stream
 * @event CAN_NOT_SWITCH_MIC
 * @memberOf Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'CAN_NOT_SWITCH_MIC', 'Number of mics is less than 2 or already used custom stream');
/**
 * Error if recived local error
 * @event CAN_NOT_SWITCH_MIC
 * @memberOf Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'LOCAL_ERROR', 'Local error');
var mediaDeviceKind = {};
define(mediaDeviceKind, 'OUTPUT', 'output');
define(mediaDeviceKind, 'INPUT', 'input');
define(mediaDeviceKind, 'ALL', 'all');
var transportType = {};
define(transportType, 'UDP', 'UDP');
define(transportType, 'TCP', 'TCP');
var connectionQuality = {};
define(connectionQuality, 'PERFECT', 'PERFECT');
define(connectionQuality, 'GOOD', 'GOOD');
define(connectionQuality, 'BAD', 'BAD');
define(connectionQuality, 'UNKNOWN', 'UNKNOWN');
define(connectionQuality, 'UPDATE', 'UPDATE');
var constants = {};
define(constants, 'SESSION_STATUS', sessionStatus);
define(constants, 'STREAM_STATUS', streamStatus);
define(constants, 'CALL_STATUS', callStatus);
define(constants, 'STREAM_STATUS_INFO', streamStatusInfo);
define(constants, 'CALL_STATUS_INFO', callStatusInfo);
define(constants, 'ERROR_INFO', errorInfo);
define(constants, 'MEDIA_DEVICE_KIND', mediaDeviceKind);
define(constants, 'TRANSPORT_TYPE', transportType);
define(constants, 'CONNECTION_QUALITY', connectionQuality); //define helper

function define(obj, name, value) {
  Object.defineProperty(obj, name, {
    value: value,
    enumerable: true
  });
}

module.exports = constants;

},{}],30:[function(require,module,exports){
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var swfobject = require('swfobject');

var Promise = require('promise-polyfill');

var uuid_v1 = require('uuid/v1');

var connections = {};
var flashScope;
var swfLocation = "media-provider.swf";
var DEFAULT_SDP = "v=0\r\n" + "o=- 1988962254 1988962254 IN IP4 0.0.0.0\r\n" + "c=IN IP4 0.0.0.0\r\n" + "t=0 0\r\n" + "a=sdplang:en\r\n" + "m=video 0 RTP/AVP 112\r\n" + "a=rtpmap:112 H264/90000\r\n" + "a=fmtp:112 packetization-mode=1; profile-level-id=420020\r\n" + "a=VIDEO_STATE\r\n" + "m=audio 0 RTP/AVP 8 0 100 102 103 104 105 106 107 108 109 110\r\n" + "a=rtpmap:0 PCMU/8000\r\n" + "a=rtpmap:8 PCMA/8000\r\n" + "a=rtpmap:100 SPEEX/16000\r\n" + "a=rtpmap:102 mpeg4-generic/48000/1\r\n" + "a=rtpmap:103 mpeg4-generic/8000/1\r\n" + "a=rtpmap:104 mpeg4-generic/11025/1\r\n" + "a=rtpmap:105 mpeg4-generic/12000/1\r\n" + "a=rtpmap:106 mpeg4-generic/16000/1\r\n" + "a=rtpmap:107 mpeg4-generic/22050/1\r\n" + "a=rtpmap:108 mpeg4-generic/24000/1\r\n" + "a=rtpmap:109 mpeg4-generic/32000/1\r\n" + "a=rtpmap:110 mpeg4-generic/44100/1\r\n" + "a=AUDIO_STATE\r\n";
var CACHED_INSTANCE_POSTFIX = "CACHED_FLASH_INSTANCE";
var defaultConstraints;
var logger;
var LOG_PREFIX = "flash";

var createConnection = function createConnection(options) {
  return new Promise(function (resolve, reject) {
    var id = options.id;
    var authToken = options.authToken;
    var display = options.display || options.localDisplay;
    var flashBufferTime = options.flashBufferTime || 0;
    var url = getConnectionUrl(options.mainUrl, options.flashProto, options.flashPort); //todo state from flash instance

    var state = function state() {
      return "new";
    };

    var flash = getCacheInstance(display);

    if (flash) {
      flash.reset(id);
      flash.id = id;
      installCallback(flash, 'addLogMessage', function (message) {
        logger.info(LOG_PREFIX, "Flash[" + id + "]:" + message);
      });
      installCallback(flash, 'connectionStatus', function (status) {
        removeCallback(flash, 'connectionStatus');

        if (status === "Success") {
          connections[id] = exports;
          resolve(exports);
        } else {
          reject(new Error("Flash connection returned status " + status));
        }
      });
      flash.connect(url, authToken, options.login);
    } else {
      loadSwf(id, display, options.flashShowFullScreenButton || "false").then(function (swf) {
        installCallback(swf, 'connectionStatus', function (status) {
          removeCallback(swf, 'connectionStatus');

          if (status === "Success") {
            connections[id] = exports;
            resolve(exports);
          } else {
            reject(new Error("Flash connection returned status " + status));
          }
        });
        flash = swf;
        flash.connect(url, authToken, options.login);
      })["catch"](reject);
    }

    var createOffer = function createOffer(options) {
      return new Promise(function (resolve, reject) {
        var receiveAudio = options.receiveAudio == undefined ? false : options.receiveAudio;
        var receiveVideo = options.receiveVideo == undefined ? false : options.receiveVideo;
        var sendAudio = flash.isHasAudio();
        var sendVideo = flash.isHasVideo();
        var sdp = DEFAULT_SDP;

        if (receiveAudio && sendAudio) {
          sdp = sdp.replace("AUDIO_STATE", "sendrecv");
        } else if (receiveAudio && !sendAudio) {
          sdp = sdp.replace("AUDIO_STATE", "recvonly");
        } else if (!receiveAudio && sendAudio) {
          sdp = sdp.replace("AUDIO_STATE", "sendonly");
        } else {
          sdp = sdp.replace("AUDIO_STATE", "inactive");
        }

        if (receiveVideo && sendVideo) {
          sdp = sdp.replace("VIDEO_STATE", "sendrecv");
        } else if (receiveVideo && !sendVideo) {
          sdp = sdp.replace("VIDEO_STATE", "recvonly");
        } else if (!receiveVideo && sendVideo) {
          sdp = sdp.replace("VIDEO_STATE", "sendonly");
        } else {
          sdp = sdp.replace("VIDEO_STATE", "inactive");
        }

        var o = {};
        o.sdp = sdp;
        o.hasAudio = flash.isHasAudio();
        o.hasVideo = flash.isHasVideo();
        resolve(o);
      });
    };

    var createAnswer = function createAnswer(options) {
      return new Promise(function (resolve, reject) {
        var receiveAudio = options.receiveAudio == undefined ? true : options.receiveAudio;
        var receiveVideo = options.receiveVideo == undefined ? false : options.receiveVideo;
        var sendAudio = flash.isHasAudio();
        var sendVideo = flash.isHasVideo();
        var sdp = DEFAULT_SDP;

        if (receiveAudio && sendAudio) {
          sdp = sdp.replace("AUDIO_STATE", "sendrecv");
        } else if (receiveAudio && !sendAudio) {
          sdp = sdp.replace("AUDIO_STATE", "recvonly");
        } else if (!receiveAudio && sendAudio) {
          sdp = sdp.replace("AUDIO_STATE", "sendonly");
        } else {
          sdp = sdp.replace("AUDIO_STATE", "inactive");
        }

        if (receiveVideo && sendVideo) {
          sdp = sdp.replace("VIDEO_STATE", "sendrecv");
        } else if (receiveVideo && !sendVideo) {
          sdp = sdp.replace("VIDEO_STATE", "recvonly");
        } else if (!receiveVideo && sendVideo) {
          sdp = sdp.replace("VIDEO_STATE", "sendonly");
        } else {
          sdp = sdp.replace("VIDEO_STATE", "inactive");
        }

        resolve(sdp);
      });
    };

    var changeAudioCodec = function changeAudioCodec(codec) {
      flash.changeAudioCodec(codec);
    };

    var setRemoteSdp = function setRemoteSdp(sdp, reinit, id) {
      logger.debug(LOG_PREFIX, "setRemoteSDP:");
      logger.debug(LOG_PREFIX, sdp);
      return new Promise(function (resolve, reject) {
        var state = extractMediaState(sdp);
        if (reinit) flash.updateId(id);
        flash.setup(state.incoming, state.outgoing, flash.isHasAudio(), flash.isHasVideo(), flashBufferTime, reinit);
        resolve(connections[id]);
      });
    };

    var close = function close(cacheCamera) {
      if (flash) {
        flash.disconnect();

        if (!getCacheInstance(display) && flash.hasAccessToAudio() && cacheCamera) {
          cacheInstance(flash);
        } else {
          clearCallbacks(flash);
          swfobject.removeSWF(flash.id);
        }

        flash = null;
      }
    };

    var getVolume = function getVolume() {
      if (flash) {
        return flash.getVolume();
      }

      return -1;
    };

    var setVolume = function setVolume(volume) {
      if (flash) {
        flash.setVolume(volume);
      }
    };

    var muteAudio = function muteAudio() {
      if (flash) {
        flash.muteAudio();
      }
    };

    var unmuteAudio = function unmuteAudio() {
      if (flash) {
        flash.unmuteAudio();
      }
    };

    var isAudioMuted = function isAudioMuted() {
      if (flash) {
        return flash.isAudioMuted();
      }

      return true;
    };

    var muteVideo = function muteVideo() {
      if (flash) {
        flash.muteVideo();
      }
    };

    var unmuteVideo = function unmuteVideo() {
      if (flash) {
        flash.unmuteVideo();
      }
    };

    var isVideoMuted = function isVideoMuted() {
      if (flash) {
        return flash.isVideoMuted();
      }

      return true;
    };

    var getStats = function getStats(callbackFn) {
      if (flash) {
        var statistics = flash.getStats();
        var param;

        if (statistics.hasOwnProperty("incoming")) {
          for (param in statistics.incoming.info) {
            if (param.indexOf("audio") > -1) {
              statistics.incoming.audio[param] = statistics.incoming.info[param];
            }

            if (param.indexOf("video") > -1) {
              statistics.incoming.video[param] = statistics.incoming.info[param];
            }
          }

          delete statistics.incoming.info;
        }

        if (statistics.hasOwnProperty("outgoing")) {
          for (param in statistics.outgoing.info) {
            if (param.indexOf("audio") > -1) {
              statistics.outgoing.audio[param] = statistics.outgoing.info[param];
            }

            if (param.indexOf("video") > -1) {
              statistics.outgoing.video[param] = statistics.outgoing.info[param];
            }
          }

          delete statistics.outgoing.info;
        }

        statistics.type = "flash";
        callbackFn(statistics);
      }
    };

    var fullScreen = function fullScreen() {
      if (flash) {
        flash.fullScreen();
      }
    };

    var switchCam = function switchCam() {};

    var switchMic = function switchMic() {};

    var setMicrophoneGain = function setMicrophoneGain(volume) {};

    var switchToScreen = function switchToScreen() {};

    var switchToCam = function switchToCam() {};

    var exports = {};
    exports.state = state;
    exports.createOffer = createOffer;
    exports.createAnswer = createAnswer;
    exports.setRemoteSdp = setRemoteSdp;
    exports.changeAudioCodec = changeAudioCodec;
    exports.close = close;
    exports.setVolume = setVolume;
    exports.setMicrophoneGain = setMicrophoneGain;
    exports.getVolume = getVolume;
    exports.muteAudio = muteAudio;
    exports.unmuteAudio = unmuteAudio;
    exports.isAudioMuted = isAudioMuted;
    exports.muteVideo = muteVideo;
    exports.unmuteVideo = unmuteVideo;
    exports.isVideoMuted = isVideoMuted;
    exports.getStats = getStats;
    exports.fullScreen = fullScreen;
    exports.switchCam = switchCam;
    exports.switchMic = switchMic;
    exports.switchToScreen = switchToScreen;
    exports.switchToCam = switchToCam;
  });
}; //install global part to use flash ExternalInterface


function installFlashScope() {
  if (flashScope == undefined) {
    var globalApiObject = window.Flashphoner;

    if (globalApiObject == undefined) {
      throw new Error("Can't install global scope, there is no window.Flashphoner variable.");
    }

    globalApiObject['FlashApiScope'] = {};
    flashScope = window.Flashphoner.FlashApiScope;
  }
}
/**
 *
 * @param id This can be string representing scopeId or object element (swf)
 * @param name callback name
 * @param value callback function
 */


function installCallback(id, name, value) {
  installFlashScope();
  var scopeId = getInstanceScopeId(id);

  if (flashScope[scopeId] == undefined) {
    flashScope[scopeId] = {};
  }

  flashScope[scopeId][name] = value;
}
/**
 *
 * @param id This can be string representing scopeId or object element (swf)
 * @param name callback name
 */


function removeCallback(id, name) {
  delete flashScope[getInstanceScopeId(id)][name];
}

function cacheInstance(flash) {
  installCallback(flash, 'addLogMessage', function (message) {
    logger.info(LOG_PREFIX, "Flash[" + flash.id + "]:" + message);
  });
  removeCallback(flash, "connectionStatus");
  flash.reset(flash.id + CACHED_INSTANCE_POSTFIX);
  flash.id = flash.id + CACHED_INSTANCE_POSTFIX;
}
/**
 *
 * @param id This can be string representing scopeId or object element (swf)
 */


function clearCallbacks(id) {
  delete flashScope[getInstanceScopeId(id)];
}

function getInstanceScopeId(flash) {
  if (typeof flash === "string") {
    return flash;
  }

  for (var i = 0; i < flash.children.length; i++) {
    if (flash.children[i].name == "scopeId") {
      return flash.children[i].value;
    }
  }
}

var getMediaAccess = function getMediaAccess(constraints, display) {
  return new Promise(function (resolve, reject) {
    var flash = getCacheInstance(display);

    if (!flash) {
      var id = uuid_v1() + CACHED_INSTANCE_POSTFIX;
      loadSwf(id, display).then(function (swf) {
        //todo return camera and mic id
        installCallback(swf, "accessGranted", function () {
          removeCallback(swf, "accessGranted");
          resolve(display);
        });
        installCallback(swf, "accessDenied", function () {
          removeCallback(swf, "accessDenied");
          reject(new Error("Failed to get access to audio and video"));
        });

        if (!constraints) {
          constraints = defaultConstraints;
        }

        if (!swf.getMediaAccess(normalizeConstraints(constraints))) {
          reject(new Error("Failed to get access to audio and video"));
        }
      });
    } else {
      installCallback(flash, "accessGranted", function () {
        removeCallback(flash, "accessGranted");
        resolve(display);
      });
      installCallback(flash, "accessDenied", function () {
        removeCallback(flash, "accessDenied");
        reject(new Error("Failed to get access to audio and video"));
      });

      if (!flash.getMediaAccess(normalizeConstraints(constraints))) {
        reject(new Error("Failed to get access to audio and video"));
      }
    }
  });
};

var releaseMedia = function releaseMedia(display) {
  var flash = getCacheInstance(display);

  if (flash) {
    clearCallbacks(flash);
    swfobject.removeSWF(flash.id);
    return true;
  }

  return false;
}; //swf helpers
//TODO wrap params to object


var loadSwf = function loadSwf(id, display, showFullScreenButton) {
  return new Promise(function (resolve, reject) {
    var swf;
    var divWrapper = document.createElement('div');
    divWrapper.id = id;
    display.appendChild(divWrapper);
    var flashvars = {
      id: id,
      showFullScreenButton: showFullScreenButton || "false"
    };
    var params = {};
    params.menu = "true";
    params.swliveconnect = "true";
    params.allowFullScreen = "true";
    params.allowscriptaccess = "always";
    params.wmode = "opaque";
    params.scopeId = id;
    var attributes = {};
    attributes.allowfullscreen = "true";
    installCallback(id, 'addLogMessage', function (message) {
      logger.info(LOG_PREFIX, "Flash[" + id + "]:" + message);
    });
    installCallback(id, 'initialized', function () {
      resolve(swf);
    });
    installCallback(id, 'videoResolution', function (width, height) {
      swf.videoWidth = width;
      swf.videoHeight = height;
      setTimeout(function () {
        var event = new CustomEvent("resize");
        swf.dispatchEvent(event);
      }, 10);
      setTimeout(function () {
        var event = new CustomEvent("playing");
        swf.dispatchEvent(event);
      }, 10);
    }); //todo switch from id to element (divWrapper)

    swfobject.embedSWF(swfLocation, id, "100%", "100%", "11.2.0", "expressInstall.swf", flashvars, params, attributes, function (ret) {
      swf = ret.ref;

      if (!ret.success) {
        reject(new Error("Failed to load flash media provider swf with id " + id));
      }
    });
  });
};

function getCacheInstance(display) {
  var i;

  for (i = 0; i < display.children.length; i++) {
    if (display.children[i] && display.children[i].id.indexOf(CACHED_INSTANCE_POSTFIX) != -1) {
      logger.info(LOG_PREFIX, "FOUND FLASH CACHED INSTANCE, id " + display.children[i].id);
      return display.children[i];
    }
  }
} //sdp helper, extract state from server sdp


function extractMediaState(sdp) {
  var state = {
    incoming: false,
    outgoing: false
  };

  if (sdp.indexOf("a=sendrecv") != -1) {
    state.incoming = true;
    state.outgoing = true;
  } else if (sdp.indexOf("a=recvonly") != -1) {
    state.outgoing = true;
  } else if (sdp.indexOf("a=sendonly") != -1) {
    state.incoming = true;
  }

  return state;
} //connection ip


function getConnectionUrl(mainUrl, proto, port) {
  var a = document.createElement('a');
  a.href = mainUrl;
  return proto + "://" + a.hostname + ":" + port + "/";
}
/**
 * Check Flash Player available
 *
 * @returns {boolean} flash player available
 */


var available = function available() {
  return swfobject.hasFlashPlayerVersion("11.2.0");
};

var listDevices = function listDevices() {
  return new Promise(function (resolve, reject) {
    var display = document.createElement('div');
    display.setAttribute("style", "width:1px;height:1px");
    var id = uuid_v1(); //attach display to document, otherwise swf won't be loaded

    document.body.appendChild(display);
    loadSwf(id, display).then(function (swf) {
      var list = swf.listDevices(); //remove swf, display

      swfobject.removeSWF(id);
      document.body.removeChild(display);
      resolve(list);
    }, reject);
  });
};

function normalizeConstraints(constraints) {
  if (constraints && typeof constraints.video !== 'undefined') {
    if (constraints.video.hasOwnProperty('frameRate') && constraints.video.frameRate !== 'object') {
      var frameRate = constraints.video.frameRate;

      if (frameRate == 0 || isNaN(frameRate)) {
        delete constraints.video.frameRate;
      }
    }

    if (constraints.video === false) {
      delete constraints.video;
    } else if (constraints.video === true) {
      // Set default video constraints
      constraints.video = {
        width: 320,
        height: 240
      };
    } else {
      if (constraints.video.hasOwnProperty('width')) {
        var width = constraints.video.width;

        if (isNaN(width) || width == 0) {
          logger.warn(LOG_PREFIX, "Width or height property has zero/NaN value, set default resolution 320x240");
          constraints.video.width = 320;
          constraints.video.height = 240;
        }

        if (_typeof(width) == 'object') {
          constraints.video.width = constraints.video.width.exact || constraints.video.width.max || constraints.video.width.min;
        }
      }

      if (constraints.video.hasOwnProperty('height')) {
        var height = constraints.video.height;

        if (isNaN(height) || height == 0) {
          logger.warn(LOG_PREFIX, "Width or height property has zero/NaN value, set default resolution 320x240");
          constraints.video.width = 320;
          constraints.video.height = 240;
        }

        if (_typeof(height) == 'object') {
          constraints.video.height = constraints.video.height.exact || constraints.video.height.max || constraints.video.height.min;
        }
      }
    }
  }

  return constraints;
} //CustomEvent IE polyfill


(function () {
  function CustomEvent(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();

var playFirstSound = function playFirstSound() {
  return true;
};

var playFirstVideo = function playFirstVideo() {
  return new Promise(function (resolve, reject) {
    resolve();
  });
};

module.exports = {
  createConnection: createConnection,
  getMediaAccess: getMediaAccess,
  releaseMedia: releaseMedia,
  available: available,
  listDevices: listDevices,
  playFirstSound: playFirstSound,
  playFirstVideo: playFirstVideo,
  configure: function configure(configuration) {
    swfLocation = configuration.flashMediaProviderSwfLocation;
    defaultConstraints = configuration.constraints;
    logger = configuration.logger;
    logger.info(LOG_PREFIX, "Initialized");
  }
};

},{"promise-polyfill":5,"swfobject":8,"uuid/v1":12}],31:[function(require,module,exports){
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var uuid_v1 = require('uuid/v1');

var constants = require("./constants");

var util = require('./util');

var logger = require('./util').logger;

var loggerConf = {
  push: false,
  severity: "INFO"
};

var Promise = require('promise-polyfill');

var KalmanFilter = require('kalmanjs');

var browserDetails = require('webrtc-adapter')["default"].browserDetails;

var LOG_PREFIX = "core";
var isUsingTemasysPlugin = false;
/**
 * @namespace Flashphoner
 */

var SESSION_STATUS = constants.SESSION_STATUS;
var STREAM_STATUS = constants.STREAM_STATUS;
var CALL_STATUS = constants.CALL_STATUS;
var TRANSPORT_TYPE = constants.TRANSPORT_TYPE;
var CONNECTION_QUALITY = constants.CONNECTION_QUALITY;
var ERROR_INFO = constants.ERROR_INFO;
var VIDEO_RATE_GOOD_QUALITY_PERCENT_DIFFERENCE = 20;
var VIDEO_RATE_BAD_QUALITY_PERCENT_DIFFERENCE = 50;
var LOW_VIDEO_RATE_THRESHOLD_BAD_PERFECT = 50000;
var LOW_VIDEO_RATE_BAD_QUALITY_PERCENT_DIFFERENCE = 150;
var OUTBOUND_VIDEO_RATE = "outboundVideoRate";
var INBOUND_VIDEO_RATE = "inboundVideoRate";
var MediaProvider = {};
var sessions = {};
var initialized = false;
var disableConnectionQualityCalculation;
/**
 * Static initializer.
 *
 * @param {Object} options Global api options
 * @param {Function=} options.mediaProvidersReadyCallback Callback of initialized WebRTC Plugin
 * @param {String=} options.flashMediaProviderSwfLocation Location of media-provider.swf file
 * @param {string=} options.preferredMediaProvider DEPRECATED: Use preferred media provider if available
 * @param {Array=} options.preferredMediaProviders Use preferred media providers order
 * @param {String=} options.receiverLocation Location of WSReceiver.js file
 * @param {String=} options.decoderLocation Location of video-worker2.js file
 * @param {String=} options.screenSharingExtensionId Chrome screen sharing extension id
 * @param {Object=} options.constraints Default local media constraints
 * @param {Object=} options.logger Enable logging
 * @throws {Error} Error if none of MediaProviders available
 * @memberof Flashphoner
 */

var init = function init(options) {
  if (!initialized) {
    if (!options) {
      options = {};
    }

    loggerConf = options.logger || loggerConf;

    if (options.logger !== null) {
      loggerConf.enableLogs = true;
    } // init logger


    logger.init(loggerConf.severity || "INFO", loggerConf.push || false, loggerConf.customLogger, loggerConf.enableLogs);
    var waitingTemasys = false;

    try {
      var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn("Failed to create audio context");
    }

    disableConnectionQualityCalculation = options.disableConnectionQualityCalculation;

    var webRtcProvider = require("./webrtc-media-provider");

    if (webRtcProvider && webRtcProvider.hasOwnProperty('available') && webRtcProvider.available()) {
      MediaProvider.WebRTC = webRtcProvider;
      var webRtcConf = {
        constraints: options.constraints || getDefaultMediaConstraints(),
        extensionId: options.screenSharingExtensionId,
        audioContext: audioContext,
        logger: logger,
        createMicGainNode: options.createMicGainNode
      };
      webRtcProvider.configure(webRtcConf);
    } else {
      webRtcProvider = require("./temasys-media-provider");

      if (webRtcProvider && webRtcProvider.hasOwnProperty('available') && AdapterJS) {
        waitingTemasys = true;
        AdapterJS.webRTCReady(function (isUsingPlugin) {
          isUsingTemasysPlugin = isUsingPlugin;

          if (isUsingPlugin || webRtcProvider.available()) {
            MediaProvider.WebRTC = webRtcProvider;
            var webRtcConf = {
              constraints: options.constraints || getDefaultMediaConstraints(),
              extensionId: options.screenSharingExtensionId,
              logger: logger
            };
            webRtcProvider.configure(webRtcConf); // Just reorder media provider list

            var _MediaProvider = {};
            _MediaProvider.WebRTC = MediaProvider.WebRTC;

            for (var p in MediaProvider) {
              _MediaProvider[p] = MediaProvider[p];
            }

            MediaProvider = _MediaProvider;
          }

          if (options.mediaProvidersReadyCallback) {
            options.mediaProvidersReadyCallback(Object.keys(MediaProvider));
          }
        });
      }
    }

    var flashProvider = require("./flash-media-provider");

    if (flashProvider && flashProvider.hasOwnProperty('available') && flashProvider.available() && (!MediaProvider.WebRTC || options.preferredMediaProviders && options.preferredMediaProviders.indexOf("Flash") >= 0)) {
      MediaProvider.Flash = flashProvider;
      var flashConf = {
        constraints: options.constraints || getDefaultMediaConstraints(),
        flashMediaProviderSwfLocation: options.flashMediaProviderSwfLocation,
        logger: logger
      };
      flashProvider.configure(flashConf);
    }

    var mediaSourceMediaProvider = require("./media-source-media-provider");

    if (mediaSourceMediaProvider && mediaSourceMediaProvider.hasOwnProperty('available') && mediaSourceMediaProvider.available()) {
      MediaProvider.MSE = mediaSourceMediaProvider;
      var mseConf = {
        audioContext: audioContext,
        browserDetails: browserDetails.browser
      };
      mediaSourceMediaProvider.configure(mseConf);
    }

    var websocketProvider = require("./websocket-media-provider");

    if (websocketProvider && websocketProvider.hasOwnProperty('available') && websocketProvider.available(audioContext)) {
      MediaProvider.WSPlayer = websocketProvider;
      var wsConf = {
        receiverLocation: options.receiverLocation,
        decoderLocation: options.decoderLocation,
        audioContext: audioContext,
        logger: logger
      };
      websocketProvider.configure(wsConf);
    } //check at least 1 provider available


    if (getMediaProviders().length == 0) {
      throw new Error('None of MediaProviders available');
    } else if (options.preferredMediaProvider) {
      if (MediaProvider.hasOwnProperty(options.preferredMediaProvider)) {
        if (getMediaProviders()[0] != options.preferredMediaProvider) {
          // Just reorder media provider list
          var _MediaProvider = {};
          _MediaProvider[options.preferredMediaProvider] = MediaProvider[options.preferredMediaProvider];

          for (var p in MediaProvider) {
            _MediaProvider[p] = MediaProvider[p];
          }

          MediaProvider = _MediaProvider;
        }
      } else {
        logger.warn(LOG_PREFIX, "Preferred media provider is not available.");
      }
    }

    if (options.preferredMediaProviders && options.preferredMediaProviders.length > 0) {
      var newMediaProvider = {};

      for (var i in options.preferredMediaProviders) {
        if (options.preferredMediaProviders.hasOwnProperty(i)) {
          var pMP = options.preferredMediaProviders[i];

          if (MediaProvider.hasOwnProperty(pMP)) {
            newMediaProvider[pMP] = MediaProvider[pMP];
          }
        }
      }

      if (util.isEmptyObject(newMediaProvider)) {
        throw new Error("None of preferred MediaProviders available");
      } else {
        MediaProvider = newMediaProvider;
      }
    }

    if (!waitingTemasys && options.mediaProvidersReadyCallback) {
      options.mediaProvidersReadyCallback(Object.keys(MediaProvider));
    }

    logger.info(LOG_PREFIX, "Initialized");
    initialized = true;
  }
};
/**
 * Get available MediaProviders.
 *
 * @returns {Array} Available MediaProviders
 * @memberof Flashphoner
 */


var getMediaProviders = function getMediaProviders() {
  return Object.keys(MediaProvider);
};
/**
 * Play audio chunk
 * @param {boolean} noise Use noise in playing
 * @memberof Flashphoner
 */


var playFirstSound = function playFirstSound(noise) {
  var mediaProvider = getMediaProviders()[0];
  MediaProvider[mediaProvider].playFirstSound(noise);
};
/**
 * Play video chunk
 *
 * @memberof Flashphoner
 */


var playFirstVideo = function playFirstVideo(display, isLocal, src) {
  for (var mp in MediaProvider) {
    return MediaProvider[mp].playFirstVideo(display, isLocal, src);
  }
};
/**
 * Get logger
 *
 * @returns {Object} Logger
 * @memberof Flashphoner
 */


var getLogger = function getLogger() {
  if (!initialized) {
    console.warn("Initialize API first.");
  } else {
    return logger;
  }
};
/**
 * @typedef Flashphoner.MediaDeviceList
 * @type Object
 * @property {Flashphoner.MediaDevice[]} audio Audio devices (microphones)
 * @property {Flashphoner.MediaDevice[]} video Video devices (cameras)
 */

/**
 * @typedef Flashphoner.MediaDevice
 * @type Object
 * @property {String} type Type of device: mic, camera, screen
 * @property {String} id Unique id
 * @property {String} label Device label
 */

/**
 * Get available local media devices
 *
 * @param {String=} mediaProvider Media provider that will be asked for device list
 * @param {Boolean=} labels Ask user for microphone access before getting device list.
 * This will make device label available.
 * @param {Flashphoner.constants.MEDIA_DEVICE_KIND} kind Media devices kind to access:
 * MEDIA_DEVICE_KIND.INPUT (default) get access to input devices only (camera, mic).
 * MEDIA_DEVICE_KIND.OUTPUT get access to output devices only (speaker, headphone).
 * MEDIA_DEVICE_KIND.ALL get access to all devices (cam, mic, speaker, headphone).
 * @param {Object=} deviceConstraints If labels == true.
 * If {audio: true, video: false}, then access to the camera will not be requested.
 * If {audio: false, video: true}, then access to the microphone will not be requested.
 * @returns {Promise.<Flashphoner.MediaDeviceList>} Promise with media device list on fulfill
 * @throws {Error} Error if API is not initialized
 * @memberof Flashphoner
 */


var getMediaDevices = function getMediaDevices(mediaProvider, labels, kind, deviceConstraints) {
  if (!initialized) {
    throw new Error("Flashphoner API is not initialized");
  }

  if (!mediaProvider) {
    mediaProvider = getMediaProviders()[0];
  }

  return MediaProvider[mediaProvider].listDevices(labels, kind, deviceConstraints);
};
/**
 * Get access to local media
 *
 * @param {Object} constraints Media constraints
 * @param {Object} constraints.audio Audio constraints
 * @param {String=} constraints.audio.deviceId Audio device id
 * @param {Object} constraints.video Video constraints
 * @param {String=} constraints.video.deviceId Video device id
 * @param {number} constraints.video.width Video width
 * @param {number} constraints.video.height Video height
 * @param {number} constraints.video.frameRate Video fps
 * @param {String} constraints.video.type Video device type: camera, screen
 * @param {String} constraints.video.mediaSource Video source type for FF: screen, window
 * @param {HTMLElement} display Div element local media should be displayed in
 * @param {String} mediaProvider Media provider type
 * @param {Boolean} disableConstraintsNormalization Disable constraints normalization
 * @returns {Promise.<HTMLElement>} Promise with display on fulfill
 * @throws {Error} Error if API is not initialized
 * @memberof Flashphoner
 */


var getMediaAccess = function getMediaAccess(constraints, display, mediaProvider, disableConstraintsNormalization) {
  if (!initialized) {
    throw new Error("Flashphoner API is not initialized");
  }

  if (!mediaProvider) {
    mediaProvider = getMediaProviders()[0];
  }

  return MediaProvider[mediaProvider].getMediaAccess(constraints, display, disableConstraintsNormalization);
}; //default constraints helper


var getDefaultMediaConstraints = function getDefaultMediaConstraints() {
  if (browserDetails.browser == "safari") {
    return {
      audio: true,
      video: {
        width: {
          min: 320,
          max: 640
        },
        height: {
          min: 240,
          max: 480
        }
      }
    };
  } else {
    return {
      audio: true,
      video: {
        width: 320,
        height: 240
      }
    };
  }
};

function getConstraintsProperty(constraints, property, defaultValue) {
  if (!constraints || !property) return defaultValue;
  var res;
  var properties = property.split(".");

  for (var prop in constraints) {
    if (prop == properties[0]) {
      res = constraints[prop];
      if (properties.length > 1) res = getConstraintsProperty(constraints[prop], properties[1], defaultValue);
    } else if (_typeof(constraints[prop]) === "object") {
      for (var p in constraints[prop]) {
        if (p == property) res = constraints[prop][p];
      }
    }
  }

  if (typeof res === "boolean") return res;
  return res || defaultValue;
}
/**
 * Release local media
 *
 * @param {HTMLElement} display Div element with local media
 * @param {String=} mediaProvider Media provider type
 * @returns {Boolean} True if media was found and released
 * @throws {Error} Error if API is not initialized
 * @memberof Flashphoner
 */


var releaseLocalMedia = function releaseLocalMedia(display, mediaProvider) {
  if (!initialized) {
    throw new Error("Flashphoner API is not initialized");
  }

  if (!mediaProvider) {
    mediaProvider = getMediaProviders()[0];
  }

  return MediaProvider[mediaProvider].releaseMedia(display);
};
/**
 * Get active sessions.
 *
 * @returns {Session[]} Array containing active sessions
 * @memberof Flashphoner
 */


var getSessions = function getSessions() {
  return util.copyObjectToArray(sessions);
};
/**
 * Get session by id.
 *
 * @param {string} id Session id
 * @returns {Session} Session
 * @memberof Flashphoner
 */


var getSession = function getSession(id) {
  return sessions[id];
};
/**
 * Create new session and connect to server.
 *
 * @param {Object} options Session options
 * @param {string} options.urlServer Server address in form of [ws,wss]://host.domain:port
 * @param {string} options.authToken Token for auth on server with keepalived client
 * @param {Boolean=} options.keepAlive Keep alive client on server after disconnect
 * @param {string=} options.lbUrl Load-balancer address
 * @param {string=} options.flashProto Flash protocol [rtmp,rtmfp]
 * @param {Integer=} options.flashPort Flash server port [1935]
 * @param {string=} options.appKey REST App key
 * @param {Object=} options.custom User provided custom object that will be available in REST App code
 * @param {Object=} options.sipOptions Sip configuration
 * @param {Object=} options.mediaOptions Media connection configuration
 * @param {Integer=} options.timeout Connection timeout in milliseconds
 * @returns {Session} Created session
 * @throws {Error} Error if API is not initialized
 * @throws {TypeError} Error if options.urlServer is not specified
 * @memberof Flashphoner
 */


var createSession = function createSession(options) {
  if (!initialized) {
    throw new Error("Flashphoner API is not initialized");
  }

  if (!options || !options.urlServer) {
    throw new TypeError("options.urlServer must be provided");
  }

  var id_ = uuid_v1();
  var sessionStatus = SESSION_STATUS.PENDING;
  var urlServer = options.urlServer;
  var lbUrl = options.lbUrl;
  var flashProto = options.flashProto || "rtmfp";
  var flashPort = options.flashPort || 1935;
  var appKey = options.appKey || "defaultApp";
  var mediaOptions = options.mediaOptions;
  var keepAlive = options.keepAlive;
  var timeout = options.timeout;
  var connectionTimeout;
  var cConfig; //SIP config

  var sipConfig;

  if (options.sipOptions) {
    sipConfig = {
      sipLogin: options.sipOptions.login,
      sipAuthenticationName: options.sipOptions.authenticationName,
      sipPassword: options.sipOptions.password,
      sipDomain: options.sipOptions.domain,
      sipOutboundProxy: options.sipOptions.outboundProxy,
      sipProxy: options.sipOptions.proxy,
      sipPort: options.sipOptions.port,
      sipRegisterRequired: options.sipOptions.registerRequired
    };
  } //media provider auth token received from server


  var authToken = options.authToken; //object for storing new and active streams

  var streams = {};
  var calls = {};
  var mediaConnections = {}; //session to stream callbacks

  var streamRefreshHandlers = {}; //session to call callbacks

  var callRefreshHandlers = {};
  /**
   * Represents connection to REST App.
   * Can create and store Streams.
   *
   * @see Flashphoner.createSession
   * @namespace Session
   */

  var session = {}; //callbacks added using session.on()

  var callbacks = {};
  var wsConnection;

  if (lbUrl) {
    requestURL(lbUrl);
  } else {
    createWS(urlServer);
  } //todo remove


  var remoteSdpCache = {}; //Request URL from load-balancer

  function requestURL(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.timeout = 5000;

    request.ontimeout = function () {
      logger.warn(LOG_PREFIX, "Timeout during geting url from balancer!");
      createWS(urlServer);
    };

    request.error = function () {
      logger.warn(LOG_PREFIX, "Error during geting url from balancer!");
      createWS(urlServer);
    };

    request.onload = function (e) {
      if (request.status == 200 && request.readyState == 4) {
        var result = JSON.parse(request.responseText);

        if (urlServer.indexOf("wss://") !== -1) {
          urlServer = "wss://" + result.server + ":" + result.wss;
        } else {
          urlServer = "ws://" + result.server + ":" + result.ws;
        }

        flashPort = result.flash;
        logger.debug(LOG_PREFIX, "Got url from load balancer " + result.server);
        createWS(urlServer);
      }
    };

    request.send();
  } //connect session to server


  function createWS(url) {
    wsConnection = new WebSocket(url);

    if (timeout != undefined && timeout > 0) {
      connectionTimeout = setTimeout(function () {
        if (wsConnection.readyState == 0) {
          console.log("WS connection timeout");
          wsConnection.close();
        }
      }, timeout);
    }

    wsConnection.onerror = function () {
      onSessionStatusChange(SESSION_STATUS.FAILED);
    };

    wsConnection.onclose = function () {
      if (sessionStatus !== SESSION_STATUS.FAILED) {
        onSessionStatusChange(SESSION_STATUS.DISCONNECTED);
      }
    };

    wsConnection.onopen = function () {
      onSessionStatusChange(SESSION_STATUS.CONNECTED);
      clearTimeout(connectionTimeout);
      cConfig = {
        appKey: appKey,
        mediaProviders: Object.keys(MediaProvider),
        keepAlive: keepAlive,
        authToken: authToken,
        clientVersion: "0.5.28",
        clientOSVersion: window.navigator.appVersion,
        clientBrowserVersion: window.navigator.userAgent,
        msePacketizationVersion: 2,
        custom: options.custom
      };

      if (sipConfig) {
        util.copyObjectPropsToAnotherObject(sipConfig, cConfig);
      } //connect to REST App


      send("connection", cConfig);
      logger.setConnection(wsConnection);
    };

    wsConnection.onmessage = function (event) {
      var data = {};

      if (event.data instanceof Blob) {
        data.message = "binaryData";
      } else {
        data = JSON.parse(event.data);
        var obj = data.data[0];
      }

      switch (data.message) {
        case 'ping':
          send("pong", null);
          break;

        case 'getUserData':
          authToken = obj.authToken;
          cConfig = obj;
          onSessionStatusChange(SESSION_STATUS.ESTABLISHED, obj);
          break;

        case 'setRemoteSDP':
          var mediaSessionId = data.data[0];
          var sdp = data.data[1];

          if (streamRefreshHandlers[mediaSessionId]) {
            //pass server's sdp to stream
            streamRefreshHandlers[mediaSessionId](null, sdp);
          } else if (callRefreshHandlers[mediaSessionId]) {
            //pass server's sdp to call
            callRefreshHandlers[mediaSessionId](null, sdp);
          } else {
            remoteSdpCache[mediaSessionId] = sdp;
            logger.info(LOG_PREFIX, "Media not found, id " + mediaSessionId);
          }

          break;

        case 'notifyVideoFormat':
        case 'notifyStreamStatusEvent':
          if (streamRefreshHandlers[obj.mediaSessionId]) {
            //update stream status
            streamRefreshHandlers[obj.mediaSessionId](obj);
          }

          break;

        case 'DataStatusEvent':
          restAppCommunicator.resolveData(obj);
          break;

        case 'OnDataEvent':
          if (callbacks[SESSION_STATUS.APP_DATA]) {
            callbacks[SESSION_STATUS.APP_DATA](obj);
          }

          break;

        case 'fail':
          if (obj.apiMethod && obj.apiMethod == "StreamStatusEvent") {
            if (streamRefreshHandlers[obj.id]) {
              //update stream status
              streamRefreshHandlers[obj.id](obj);
            }
          }

          if (callbacks[SESSION_STATUS.WARN]) {
            callbacks[SESSION_STATUS.WARN](obj);
          }

          break;

        case 'registered':
          onSessionStatusChange(SESSION_STATUS.REGISTERED);
          break;

        case 'notifyAudioCodec':
          // This case for Flash only
          var mediaSessionId = data.data[0];
          var codec = data.data[1];

          if (callRefreshHandlers[mediaSessionId]) {
            callRefreshHandlers[mediaSessionId](null, null, codec);
          }

          break;

        case 'notifyTransferEvent':
          callRefreshHandlers[obj.callId](null, null, null, obj);
          break;

        case 'notifyTryingResponse':
        case 'hold':
        case 'ring':
        case 'talk':
        case 'finish':
          if (callRefreshHandlers[obj.callId]) {
            //update call status
            callRefreshHandlers[obj.callId](obj);
          }

          break;

        case 'notifyIncomingCall':
          if (callRefreshHandlers[obj.callId]) {
            logger.error(LOG_PREFIX, "Call already exists, id " + obj.callId);
          }

          if (callbacks[SESSION_STATUS.INCOMING_CALL]) {
            callbacks[SESSION_STATUS.INCOMING_CALL](createCall(obj));
          } else {//todo hangup call
          }

          break;

        case 'notifySessionDebugEvent':
          logger.info(LOG_PREFIX, "Session debug status " + obj.status);

          if (callbacks[SESSION_STATUS.DEBUG]) {
            callbacks[SESSION_STATUS.DEBUG](obj);
          }

          break;

        case 'availableStream':
          var availableStream = {};
          availableStream.mediaSessionId = obj.id;
          availableStream.available = obj.status;

          if (streamRefreshHandlers[availableStream.mediaSessionId]) {
            streamRefreshHandlers[availableStream.mediaSessionId](availableStream);
          }

          break;

        case OUTBOUND_VIDEO_RATE:
        case INBOUND_VIDEO_RATE:
          if (streamRefreshHandlers[obj.mediaSessionId]) {
            obj.status = data.message;
            streamRefreshHandlers[obj.mediaSessionId](obj);
          }

          break;

        default: //logger.info(LOG_PREFIX, "Unknown server message " + data.message);

      }
    };
  } //WebSocket send helper


  function send(message, data) {
    wsConnection.send(JSON.stringify({
      message: message,
      data: [data]
    }));
  } //Session status update helper


  function onSessionStatusChange(newStatus, obj) {
    sessionStatus = newStatus;

    if (sessionStatus == SESSION_STATUS.DISCONNECTED || sessionStatus == SESSION_STATUS.FAILED) {
      //remove streams
      for (var prop in streamRefreshHandlers) {
        if (streamRefreshHandlers.hasOwnProperty(prop) && typeof streamRefreshHandlers[prop] === 'function') {
          streamRefreshHandlers[prop]({
            status: STREAM_STATUS.FAILED
          });
        }
      } //remove session from list


      delete sessions[id_];
    }

    if (callbacks[sessionStatus]) {
      callbacks[sessionStatus](session, obj);
    }
  }
  /**
   * @callback sdpHook
   * @param {Object} sdp Callback options
   * @param {String} sdp.sdpString Sdp from the server
   * @returns {String} sdp New sdp
   */

  /**
   * Create call.
   *
   * @param {Object} options Call options
   * @param {string} options.callee Call remote party id
   * @param {string=} options.visibleName Call caller visible name
   * @param {Object} options.constraints Call constraints
   * @param {string} options.mediaProvider MediaProvider type to use with this call
   * @param {Boolean=} options.receiveAudio Receive audio
   * @param {Boolean=} options.receiveVideo Receive video
   * @param {Boolean=} options.cacheLocalResources Display will contain local video after call release
   * @param {HTMLElement} options.localVideoDisplay Div element local video should be displayed in
   * @param {HTMLElement} options.remoteVideoDisplay Div element remote video should be displayed in
   * @param {Object=} options.custom User provided custom object that will be available in REST App code
   * @param {Array<string>=} options.stripCodecs Array of codecs which should be stripped from SDP (WebRTC)
   * @param {Array<string>=} options.sipSDP Array of custom SDP params (ex. bandwidth (b=))
   * @param {Array<string>=} options.sipHeaders Array of custom SIP headers
   * @param {sdpHook} sdpHook The callback that handles sdp from the server
   * @returns {Call} Call
   * @throws {TypeError} Error if no options provided
   * @throws {Error} Error if session state is not REGISTERED
   * @memberof Session
   * @inner
   */


  var createCall = function createCall(options) {
    //check session state
    if (sessionStatus !== SESSION_STATUS.REGISTERED && sessionStatus !== SESSION_STATUS.ESTABLISHED) {
      logger.info(LOG_PREFIX, "Status is " + sessionStatus);
      throw new Error('Invalid session state');
    } //check options


    if (!options) {
      throw new TypeError("options must be provided");
    }

    var login = appKey == 'clickToCallApp' ? '' : cConfig.sipLogin;
    var caller_ = options.incoming ? options.caller : login;
    var callee_ = options.callee;
    var visibleName_ = options.visibleName || login;
    var id_ = options.callId || uuid_v1();
    var mediaProvider = options.mediaProvider || getMediaProviders()[0];
    var mediaConnection;
    var localDisplay = options.localVideoDisplay;
    var remoteDisplay = options.remoteVideoDisplay;
    var info_;
    var errorInfo_; // Constraints

    if (options.constraints) {
      var constraints = options.constraints;
    }

    if (options.disableConstraintsNormalization) {
      var disableConstraintsNormalization = options.disableConstraintsNormalization;
    }

    var audioOutputId;
    var audioProperty = getConstraintsProperty(constraints, "audio", undefined);

    if (_typeof(audioProperty) === 'object') {
      audioOutputId = getConstraintsProperty(audioProperty, "outputId", 0);
    }

    var stripCodecs = options.stripCodecs || []; // Receive media

    var receiveAudio = typeof options.receiveAudio !== 'undefined' ? options.receiveAudio : true;
    var receiveVideo = typeof options.receiveVideo !== 'undefined' ? options.receiveVideo : true;
    var cacheLocalResources = options.cacheLocalResources;
    var status_ = CALL_STATUS.NEW;
    var callbacks = {};
    var hasTransferredCall = false;
    var sdpHook = options.sdpHook;
    var sipSDP = options.sipSDP;
    var sipHeaders = options.sipHeaders;
    /**
     * Represents sip call.
     *
     * @namespace Call
     * @see Session~createCall
     */

    var call = {};

    callRefreshHandlers[id_] = function (callInfo, sdp, codec, transfer) {
      if (transfer) {
        if (!mediaConnections[id_]) {
          mediaConnections[id_] = mediaConnection;
        }

        if (transfer.status == "COMPLETED") {
          delete mediaConnections[id_];
        }

        return;
      } //transferred call


      if (!mediaConnection && Object.keys(mediaConnections).length != 0) {
        for (var mc in mediaConnections) {
          mediaConnection = mediaConnections[mc];
          hasTransferredCall = true;
          delete mediaConnections[mc];
        }
      } //set audio codec (Flash only)


      if (codec) {
        if (mediaProvider == "Flash") {
          mediaConnection.changeAudioCodec(codec.name);
        }

        return;
      } //set remote sdp


      if (sdp && sdp !== '') {
        sdp = sdpHookHandler(sdp, sdpHook);
        mediaConnection.setRemoteSdp(sdp, hasTransferredCall, id_).then(function () {});
        return;
      }

      var event = callInfo.status;
      status_ = event; //release call

      if (event == CALL_STATUS.FAILED || event == CALL_STATUS.FINISH || event == CALL_STATUS.BUSY) {
        delete calls[id_];
        delete callRefreshHandlers[id_];

        if (Object.keys(calls).length == 0) {
          if (mediaConnection) mediaConnection.close(cacheLocalResources);
        }
      } //fire call event


      if (callbacks[event]) {
        callbacks[event](call);
      }
    };
    /**
     * Initiate outgoing call.
     *
     * @throws {Error} Error if call status is not {@link Flashphoner.constants.CALL_STATUS.NEW}
     * @memberof Call
     * @name call
     * @inner
     */


    var call_ = function call_() {
      if (status_ !== CALL_STATUS.NEW) {
        throw new Error("Invalid call state");
      }

      status_ = CALL_STATUS.PENDING;
      var hasAudio = true; //get access to camera

      MediaProvider[mediaProvider].getMediaAccess(constraints, localDisplay, disableConstraintsNormalization).then(function () {
        if (status_ == CALL_STATUS.FAILED) {
          //call failed while we were waiting for media access, release media
          if (!cacheLocalResources) {
            releaseLocalMedia(localDisplay, mediaProvider);
          }

          return;
        } //create mediaProvider connection


        MediaProvider[mediaProvider].createConnection({
          id: id_,
          localDisplay: localDisplay,
          remoteDisplay: remoteDisplay,
          authToken: authToken,
          mainUrl: urlServer,
          flashProto: flashProto,
          flashPort: flashPort,
          bidirectional: true,
          login: login,
          constraints: constraints,
          connectionConfig: mediaOptions,
          audioOutputId: audioOutputId
        }).then(function (newConnection) {
          mediaConnection = newConnection;
          return mediaConnection.createOffer({
            sendAudio: true,
            sendVideo: true,
            receiveAudio: receiveAudio,
            receiveVideo: receiveVideo,
            stripCodecs: stripCodecs
          });
        }).then(function (offer) {
          send("call", {
            callId: id_,
            incoming: false,
            hasVideo: offer.hasVideo,
            hasAudio: offer.hasAudio,
            status: status_,
            mediaProvider: mediaProvider,
            sdp: offer.sdp,
            sipSDP: sipSDP,
            caller: login,
            callee: callee_,
            custom: options.custom,
            visibleName: visibleName_
          });
        });
      })["catch"](function (error) {
        logger.error(LOG_PREFIX, error);
        status_ = CALL_STATUS.FAILED;
        info_ = ERROR_INFO.LOCAL_ERROR;
        errorInfo_ = error.message;
        callRefreshHandlers[id_]({
          status: CALL_STATUS.FAILED
        });
        hangup();
      });
    };
    /**
     * Hangup call.
     *
     * @memberof Call
     * @inner
     */


    var hangup = function hangup() {
      if (status_ == CALL_STATUS.NEW) {
        callRefreshHandlers[id_]({
          status: CALL_STATUS.FAILED
        });
        return;
      } else if (status_ == CALL_STATUS.PENDING) {
        if (!cacheLocalResources) {
          releaseLocalMedia(localDisplay, mediaProvider);
        }

        callRefreshHandlers[id_]({
          status: CALL_STATUS.FAILED
        });

        if (options.incoming) {
          send("hangup", {
            callId: id_
          });
        }

        return;
      }

      send("hangup", {
        callId: id_
      }); //free media provider

      if (mediaConnection) {
        mediaConnection.close(cacheLocalResources);
      }
    };
    /**
     * @callback sdpHook
     * @param {Object} sdp Callback options
     * @param {String} sdp.sdpString Sdp from the server
     * @returns {String} sdp New sdp
     */

    /**
     * Answer incoming call.
     * @param {Object} answerOptions Call options
     * @param {HTMLElement} answerOptions.localVideoDisplay Div element local video should be displayed in
     * @param {HTMLElement} answerOptions.remoteVideoDisplay Div element remote video should be displayed in
     * @param {Boolean=} answerOptions.receiveAudio Receive audio
     * @param {Boolean=} answerOptions.receiveVideo Receive video
     * @param {String=} answerOptions.constraints Answer call with constraints
     * @param {Array<string>=} answerOptions.stripCodecs Array of codecs which should be stripped from SDP (WebRTC)
     * @param {Array<string>=} answerOptions.sipSDP Array of custom SDP params (ex. bandwidth (b=))
     * @param {Array<string>=} answerOptions.sipHeaders Array of custom SIP headers
     * @param {sdpHook} sdpHook The callback that handles sdp from the server
     * @throws {Error} Error if call status is not {@link Flashphoner.constants.CALL_STATUS.NEW}
     * @memberof Call
     * @name call
     * @inner
     */


    var answer = function answer(answerOptions) {
      if (status_ !== CALL_STATUS.NEW && status_ !== CALL_STATUS.RING) {
        throw new Error("Invalid call state");
      }

      localDisplay = answerOptions.localVideoDisplay;
      remoteDisplay = answerOptions.remoteVideoDisplay;
      constraints = answerOptions.constraints || getDefaultMediaConstraints();
      status_ = CALL_STATUS.PENDING;
      var sdp;
      var sdpHook = answerOptions.sdpHook;
      sipSDP = answerOptions.sipSDP;
      sipHeaders = answerOptions.sipHeaders;

      if (!remoteSdpCache[id_]) {
        logger.error(LOG_PREFIX, "No remote sdp available");
        throw new Error("No remote sdp available");
      } else {
        sdp = sdpHookHandler(remoteSdpCache[id_], sdpHook);
        delete remoteSdpCache[id_];
      }

      if (util.SDP.matchPrefix(sdp, "m=video").length == 0) {
        constraints.video = false;
      }

      var stripCodecs = answerOptions.stripCodecs || [];
      var hasAudio = true; //get access to camera

      MediaProvider[mediaProvider].getMediaAccess(constraints, localDisplay, disableConstraintsNormalization).then(function () {
        if (status_ == CALL_STATUS.FAILED) {
          //call failed while we were waiting for media access, release media
          if (!cacheLocalResources) {
            releaseLocalMedia(localDisplay, mediaProvider);
          }

          return;
        } //create mediaProvider connection


        MediaProvider[mediaProvider].createConnection({
          id: id_,
          localDisplay: localDisplay,
          remoteDisplay: remoteDisplay,
          authToken: authToken,
          mainUrl: urlServer,
          flashProto: flashProto,
          flashPort: flashPort,
          bidirectional: true,
          login: cConfig.sipLogin,
          constraints: constraints,
          connectionConfig: mediaOptions,
          audioOutputId: audioOutputId
        }).then(function (newConnection) {
          mediaConnection = newConnection;
          return mediaConnection.setRemoteSdp(sdp);
        }).then(function () {
          return mediaConnection.createAnswer({
            receiveAudio: options.receiveAudio,
            receiveVideo: options.receiveVideo,
            stripCodecs: stripCodecs
          });
        }).then(function (sdp) {
          if (status_ != CALL_STATUS.FINISH && status_ != CALL_STATUS.FAILED) {
            send("answer", {
              callId: id_,
              incoming: true,
              hasVideo: true,
              hasAudio: hasAudio,
              status: status_,
              mediaProvider: mediaProvider,
              sdp: sdp,
              sipSDP: sipSDP,
              caller: cConfig.login,
              callee: callee_,
              custom: options.custom
            });
          } else {
            hangup();
          }
        });
      })["catch"](function (error) {
        logger.error(LOG_PREFIX, error);
        info_ = ERROR_INFO.LOCAL_ERROR;
        errorInfo_ = error.message;
        status_ = CALL_STATUS.FAILED;
        callRefreshHandlers[id_]({
          status: CALL_STATUS.FAILED
        });
      });
    };
    /**
     * Get call status.
     *
     * @returns {string} One of {@link Flashphoner.constants.CALL_STATUS}
     * @memberof Call
     * @inner
     */


    var status = function status() {
      return status_;
    };
    /**
     * Get call id.
     *
     * @returns {string} Call id
     * @memberof Call
     * @inner
     */


    var id = function id() {
      return id_;
    };
    /**
     * Get caller id.
     *
     * @returns {string} Caller id
     * @memberof Call
     * @inner
     */


    var caller = function caller() {
      return caller_;
    };
    /**
     * Get callee id.
     *
     * @returns {string} Callee id
     * @memberof Call
     * @inner
     */


    var callee = function callee() {
      return callee_;
    };
    /**
     * Get caller visible name.
     *
     * @returns {string} Caller visible name
     * @memberof Call
     * @inner
     */


    var visibleName = function visibleName() {
      return visibleName_;
    };
    /**
     * Media controls
     */

    /**
     * Set other oupout audio device
     *
     * @param {string} id Id of output device
     * @memberof Call
     * @inner
     */


    var setAudioOutputId = function setAudioOutputId(id) {
      audioOutputId = id;

      if (mediaConnection && mediaConnection.setAudioOutputId) {
        return mediaConnection.setAudioOutputId(id);
      }
    };
    /**
     * Set volume of remote media
     *
     * @param {number} volume Volume between 0 and 100
     * @memberof Call
     * @inner
     */


    var setVolume = function setVolume(volume) {
      if (mediaConnection) {
        mediaConnection.setVolume(volume);
      }
    };
    /**
     * Get current volume
     *
     * @returns {number} Volume or -1 if audio is not available
     * @memberof Call
     * @inner
     */


    var getVolume = function getVolume() {
      if (mediaConnection) {
        return mediaConnection.getVolume();
      }

      return -1;
    };
    /**
     * Mute outgoing audio
     *
     * @memberof Call
     * @inner
     */


    var muteAudio = function muteAudio() {
      if (mediaConnection) {
        mediaConnection.muteAudio();
      }
    };
    /**
     * Unmute outgoing audio
     *
     * @memberof Call
     * @inner
     */


    var unmuteAudio = function unmuteAudio() {
      if (mediaConnection) {
        mediaConnection.unmuteAudio();
      }
    };
    /**
     * Check outgoing audio mute state
     *
     * @returns {boolean} True if audio is muted or not available
     * @memberof Call
     * @inner
     */


    var isAudioMuted = function isAudioMuted() {
      if (mediaConnection) {
        return mediaConnection.isAudioMuted();
      }

      return true;
    };
    /**
     * Mute outgoing video
     *
     * @memberof Call
     * @inner
     */


    var muteVideo = function muteVideo() {
      if (mediaConnection) {
        mediaConnection.muteVideo();
      }
    };
    /**
     * Unmute outgoing video
     *
     * @memberof Call
     * @inner
     */


    var unmuteVideo = function unmuteVideo() {
      if (mediaConnection) {
        mediaConnection.unmuteVideo();
      }
    };
    /**
     * Check outgoing video mute state
     *
     * @returns {boolean} True if video is muted or not available
     * @memberof Call
     * @inner
     */


    var isVideoMuted = function isVideoMuted() {
      if (mediaConnection) {
        return mediaConnection.isVideoMuted();
      }

      return true;
    };
    /**
     * @callback callbackFn
     * @param {Object} result
     */

    /**
     * Get statistics
     *
     * @param {callbackFn} callbackFn The callback that handles response
     * @param {Boolean} nativeStats  If true, use native browser statistics
     * @returns {Object} Call audio\video statistics
     * @memberof Call
     * @inner
     */


    var getStats = function getStats(callbackFn, nativeStats) {
      if (mediaConnection) {
        mediaConnection.getStats(callbackFn, nativeStats);
      }
    };
    /**
     * Place call on hold
     *
     * @memberof Call
     * @inner
     */


    var hold = function hold() {
      send("hold", {
        callId: id_
      });
    };
    /**
     * Place call on hold for transfer
     *
     * @memberof Call
     * @inner
     */


    var holdForTransfer = function holdForTransfer() {
      send("hold", {
        callId: id_,
        holdForTransfer: true
      });
    };
    /**
     * Unhold the call
     *
     * @memberof Call
     * @inner
     */


    var unhold = function unhold() {
      send("unhold", {
        callId: id_
      });
    };
    /**
     * Send DTMF
     *
     * @param {number} number Number
     * @param {string=} type DTMF Type (RFC2833, INFO, INFO_RELAY)
     * @memberof Call
     * @inner
     */


    var sendDTMF = function sendDTMF(number, type) {
      send("sendDtmf", {
        callId: id_,
        type: type || "RFC2833",
        dtmf: number
      });
    };
    /**
     * Transfer call
     *
     * @param {String} traget Transfer target
     * @memberof Call
     * @inner
     */


    var transfer = function transfer(target) {
      send("transfer", {
        callId: id_,
        target: target
      });
    };
    /**
     * Call event callback.
     *
     * @callback Call~eventCallback
     * @param {Call} call Call that corresponds to the event
     */

    /**
     * Add call event callback.
     *
     * @param {string} event One of {@link Flashphoner.constants.CALL_STATUS} events
     * @param {Call~eventCallback} callback Callback function
     * @returns {Call} Call callback was attached to
     * @throws {TypeError} Error if event is not specified
     * @throws {Error} Error if callback is not a valid function
     * @memberof Call
     * @inner
     */


    var on = function on(event, callback) {
      if (!event) {
        throw new TypeError("Event can't be null");
      }

      if (!callback || typeof callback !== 'function') {
        throw new Error("Callback needs to be a valid function");
      }

      callbacks[event] = callback;
      return call;
    };
    /**
     * Switch camera in real-time.
     * Works only with WebRTC
     *
     * @memberOf Call
     * @inner
     * @throws {Error} Error if call status is not {@link Flashphoner.constants.CALL_STATUS.ESTABLISHED} and not {@link Flashphoner.constants.CALL_STATUS.HOLD}
     */


    var switchCam = function switchCam(deviceId) {
      if (status_ !== CALL_STATUS.ESTABLISHED && !constraints.video && status_ !== CALL_STATUS.HOLD) {
        throw new Error('Invalid call state');
      }

      return mediaConnection.switchCam(deviceId);
    };
    /**
     * Switch mic in real-time.
     * Works only with WebRTC
     *
     * @memberOf Call
     * @inner
     * @throws {Error} Error if call status is not {@link Flashphoner.constants.CALL_STATUS.ESTABLISHED} and not {@link Flashphoner.constants.CALL_STATUS.HOLD}
     */


    var switchMic = function switchMic(deviceId) {
      if (status_ !== CALL_STATUS.ESTABLISHED && status_ !== CALL_STATUS.HOLD) {
        throw new Error('Invalid call state');
      }

      return mediaConnection.switchMic(deviceId);
    };
    /**
     * Switch to screen in real-time.
     * Works only with WebRTC
     *
     * @param {String} source Screen sharing source (for firefox)
     * @param {Boolean} woExtension Screen sharing without extension (for chrome)
     * @memberOf Call
     * @inner
     * @throws {Error} Error if stream status is not {@link Flashphoner.constants.STREAM_STATUS.PUBLISHING}
     */


    var switchToScreen = function switchToScreen(source, woExtension) {
      if (status_ !== CALL_STATUS.ESTABLISHED && status_ !== CALL_STATUS.HOLD) {
        throw new Error('Invalid call state');
      }

      return mediaConnection.switchToScreen(source, woExtension);
    };
    /**
     * Switch to cam in real-time.
     * Works only with WebRTC
     *
     * @memberOf Call
     * @inner
     * @throws {Error} Error if stream status is not {@link Flashphoner.constants.STREAM_STATUS.PUBLISHING}
     */


    var switchToCam = function switchToCam() {
      if (status_ !== CALL_STATUS.ESTABLISHED && status_ !== CALL_STATUS.HOLD) {
        throw new Error('Invalid call state');
      }

      mediaConnection.switchToCam();
    };
    /**
     * Get call info
     * @returns {string} Info
     * @memberof Stream
     * @inner
     */


    var getInfo = function getInfo() {
      return info_;
    };
    /**
     * Get stream error info
     * @returns {string} Error info
     * @memberof Stream
     * @inner
     */


    var getErrorInfo = function getErrorInfo() {
      return errorInfo_;
    };

    call.call = call_;
    call.answer = answer;
    call.hangup = hangup;
    call.id = id;
    call.getInfo = getInfo;
    call.getErrorInfo = getErrorInfo;
    call.status = status;
    call.getStats = getStats;
    call.setAudioOutputId = setAudioOutputId;
    call.setVolume = setVolume;
    call.getVolume = getVolume;
    call.muteAudio = muteAudio;
    call.unmuteAudio = unmuteAudio;
    call.isAudioMuted = isAudioMuted;
    call.muteVideo = muteVideo;
    call.unmuteVideo = unmuteVideo;
    call.isVideoMuted = isVideoMuted;
    call.caller = caller;
    call.callee = callee;
    call.visibleName = visibleName;
    call.hold = hold;
    call.holdForTransfer = holdForTransfer;
    call.unhold = unhold;
    call.sendDTMF = sendDTMF;
    call.transfer = transfer;
    call.on = on;
    call.switchCam = switchCam;
    call.switchMic = switchMic;
    call.switchToScreen = switchToScreen;
    call.switchToCam = switchToCam;
    calls[id_] = call;
    return call;
  };
  /**
   * @callback sdpHook
   * @param {Object} sdp Callback options
   * @param {String} sdp.sdpString Sdp from the server
   * @returns {String} sdp New sdp
   */

  /**
   * Create stream.
   *
   * @param {Object} options Stream options
   * @param {string} options.name Stream name
   * @param {Object=} options.constraints Stream constraints
   * @param {Boolean|Object} [options.constraints.audio=true] Specifies if published stream should have audio. Played stream always should have audio: the property should not be set to false in that case.
   * @param {string=} [options.constraints.audio.outputId] Set width to publish or play stream with this value
   * @param {Boolean|Object} [options.constraints.video=true] Specifies if published or played stream should have video, or sets video constraints
   * @param {Integer} [options.constraints.video.width=0] Set width to publish or play stream with this value
   * @param {Integer} [options.constraints.video.height=0] Set height to publish or play stream with this value
   * @param {Integer} [options.constraints.video.bitrate=0] DEPRECATED FOR PUBLISH: Set bitrate to publish or play stream with this value
   * @param {Integer} [options.constraints.video.minBitrate=0] Set minimal bitrate to publish stream with this value
   * @param {Integer} [options.constraints.video.maxBitrate=0] Set maximal bitrate to publish stream with this value
   * @param {Integer} [options.constraints.video.quality=0] Set quality to play stream with this value
   * @param {MediaStream} [options.constraints.customStream] Set a MediaStream  for publish stream from canvas.
   * @param {Boolean=} options.receiveAudio DEPRECATED: Receive audio
   * @param {Boolean=} options.receiveVideo DEPRECATED: Receive video
   * @param {Integer=} options.playWidth DEPRECATED: Set width to play stream with this value
   * @param {Integer=} options.playHeight DEPRECATED: Set height to play stream with this value
   * @param {string=} options.mediaProvider MediaProvider type to use with this stream
   * @param {Boolean} [options.record=false] Enable stream recording
   * @param {Boolean=} options.cacheLocalResources Display will contain local video after stream release
   * @param {HTMLElement} options.display Div element stream should be displayed in
   * @param {Object=} options.custom User provided custom object that will be available in REST App code
   * @param {Integer} [options.flashBufferTime=0] Specifies how long to buffer messages before starting to display the stream (Flash-only)
   * @param {Array<string>=} options.stripCodecs Array of codecs which should be stripped from SDP (WebRTC)
   * @param {string=} options.rtmpUrl Rtmp url stream should be forwarded to
   * @param {Object=} options.mediaConnectionConstraints Stream specific constraints for underlying RTCPeerConnection
   * @param {Boolean=} options.flashShowFullScreenButton Show full screen button in flash
   * @param {string=} options.transport Transport to be used by server for WebRTC media, {@link Flashphoner.constants.TRANSPORT_TYPE}
   * @param {Boolean=} options.cvoExtension Enable rtp video orientation extension
   * @param {Integer=} options.playoutDelay Time delay between network reception of media and playout
   * @param {sdpHook} sdpHook The callback that handles sdp from the server
   * @returns {Stream} Stream
   * @throws {TypeError} Error if no options provided
   * @throws {TypeError} Error if options.name is not specified
   * @throws {Error} Error if session state is not ESTABLISHED
   * @memberof Session
   * @inner
   */


  var createStream = function createStream(options) {
    //Array to transmit promises from stream.available() to streamRefreshHandlers
    var availableCallbacks = []; //check session state

    if (sessionStatus !== SESSION_STATUS.ESTABLISHED) {
      throw new Error('Invalid session state');
    } //check options


    if (!options) {
      throw new TypeError("options must be provided");
    }

    if (!options.name) {
      throw new TypeError("options.name must be provided");
    }

    var clientKf = new KalmanFilter();
    var serverKf = new KalmanFilter();
    var id_ = uuid_v1();
    var name_ = options.name;
    var mediaProvider = options.mediaProvider || getMediaProviders()[0];
    var mediaConnection;
    var display = options.display; // Constraints

    if (options.constraints && Object.keys(options.constraints).length != 0) {
      var constraints = options.constraints;
    }

    if (options.disableConstraintsNormalization) {
      var disableConstraintsNormalization = options.disableConstraintsNormalization;
    }

    var mediaConnectionConstraints = options.mediaConnectionConstraints; // Receive media

    var receiveAudio;
    var audioOutputId;
    var audioProperty = getConstraintsProperty(constraints, "audio", undefined);

    if (typeof audioProperty === 'boolean') {
      receiveAudio = audioProperty;
    } else if (_typeof(audioProperty) === 'object') {
      receiveAudio = true;

      var _stereo = getConstraintsProperty(audioProperty, "stereo", 0);

      var _bitrate = getConstraintsProperty(audioProperty, "bitrate", 0);

      var _fec = getConstraintsProperty(audioProperty, "fec", 0);

      audioOutputId = getConstraintsProperty(audioProperty, "outputId", 0);
      var _codecOptions = "";
      if (_bitrate) _codecOptions += "maxaveragebitrate=" + _bitrate + ";";
      if (_stereo) _codecOptions += "stereo=1;sprop-stereo=1;";
      if (_fec) _codecOptions += "useinbandfec=1;";
    } else {
      receiveAudio = typeof options.receiveAudio !== 'undefined' ? options.receiveAudio : true;
    }

    var receiveVideo;
    var videoProperty = getConstraintsProperty(constraints, "video", undefined);

    if (typeof videoProperty === 'boolean') {
      receiveVideo = videoProperty;
    } else if (_typeof(videoProperty) === 'object') {
      receiveVideo = true;
    } else {
      receiveVideo = typeof options.receiveVideo !== 'undefined' ? options.receiveVideo : true;
    } // Bitrate


    var bitrate = getConstraintsProperty(constraints, "video.bitrate", 0);
    var minBitrate = getConstraintsProperty(constraints, "video.minBitrate", 0);
    var maxBitrate = getConstraintsProperty(constraints, "video.maxBitrate", 0); // Quality

    var quality = getConstraintsProperty(constraints, "video.quality", 0);
    if (quality > 100) quality = 100; // Play resolution

    var playWidth = typeof options.playWidth !== 'undefined' ? options.playWidth : getConstraintsProperty(constraints, "video.width", 0);
    var playHeight = typeof options.playHeight !== 'undefined' ? options.playHeight : getConstraintsProperty(constraints, "video.height", 0);
    var stripCodecs = options.stripCodecs || [];
    var resolution = {};
    var published_ = false;
    var record_ = options.record || false;
    var recordFileName = null;
    var cacheLocalResources = options.cacheLocalResources;
    var status_ = STREAM_STATUS.NEW;
    var rtmpUrl = options.rtmpUrl;
    var info_;
    var errorInfo_;
    var remoteBitrate = -1;
    var networkBandwidth = -1;
    var sdpHook = options.sdpHook;
    var transportType = options.transport;
    var cvoExtension = options.cvoExtension;
    var remoteVideo = options.remoteVideo; //callbacks added using stream.on()

    var callbacks = {};
    var playoutDelay = options.playoutDelay;
    var connectionQuality;
    var videoBytes = 0;
    /**
     * Represents media stream.
     *
     * @namespace Stream
     * @see Session~createStream
     */

    var stream = {};

    streamRefreshHandlers[id_] = function (streamInfo, sdp) {
      //set remote sdp
      if (sdp && sdp !== '') {
        var _sdp = sdp;
        if (_codecOptions) _sdp = util.SDP.writeFmtp(sdp, _codecOptions, "opus");
        _sdp = sdpHookHandler(_sdp, sdpHook);
        mediaConnection.setRemoteSdp(_sdp).then(function () {});
        return;
      }

      if (streamInfo.available != undefined) {
        for (var i = 0; i < availableCallbacks.length; i++) {
          if (streamInfo.available == "true") {
            availableCallbacks[i].resolve(stream);
          } else {
            availableCallbacks[i].reject(stream);
          }
        }

        availableCallbacks = [];
        return;
      }

      var event = streamInfo.status;

      if (event == INBOUND_VIDEO_RATE || event == OUTBOUND_VIDEO_RATE) {
        detectConnectionQuality(event, streamInfo);
        return;
      }

      if (event == STREAM_STATUS.RESIZE) {
        resolution.width = streamInfo.streamerVideoWidth;
        resolution.height = streamInfo.streamerVideoHeight;
      } else if (event == STREAM_STATUS.SNAPSHOT_COMPLETE) {} else if (event == STREAM_STATUS.NOT_ENOUGH_BANDWIDTH) {
        var info = streamInfo.info.split("/");
        remoteBitrate = info[0];
        networkBandwidth = info[1];
      } else {
        status_ = event;
      }

      if (streamInfo.info) info_ = streamInfo.info; //release stream

      if (event == STREAM_STATUS.FAILED || event == STREAM_STATUS.STOPPED || event == STREAM_STATUS.UNPUBLISHED) {
        delete streams[id_];
        delete streamRefreshHandlers[id_];

        if (mediaConnection) {
          mediaConnection.close(cacheLocalResources);
        }
      }

      if (record_ && typeof streamInfo.recordName !== 'undefined') {
        recordFileName = streamInfo.recordName;
      } //fire stream event


      if (callbacks[event]) {
        callbacks[event](stream);
      }
    };

    var detectConnectionQuality = function detectConnectionQuality(event, streamInfo) {
      if (disableConnectionQualityCalculation) {
        return;
      }

      mediaConnection.getStats(function (stats) {
        var bytesSentReceived = 0;

        if (stats) {
          if (event == OUTBOUND_VIDEO_RATE && stats.inboundStream && stats.inboundStream.video && stats.inboundStream.video.bytesReceived > 0) {
            bytesSentReceived = stats.inboundStream.video.bytesReceived;
          } else if (stats.outboundStream && stats.outboundStream.video && stats.outboundStream.video.bytesSent > 0) {
            bytesSentReceived = stats.outboundStream.video.bytesSent;
          } else {
            return;
          }
        }

        if (!videoBytes) {
          videoBytes = bytesSentReceived;
          return;
        }

        var currentVideoRate = (bytesSentReceived - videoBytes) * 8;

        if (currentVideoRate == 0) {
          return;
        }

        var clientFiltered = clientKf.filter(currentVideoRate);
        var serverFiltered = serverKf.filter(streamInfo.videoRate);
        var videoRateDifference = Math.abs((serverFiltered - clientFiltered) / ((serverFiltered + clientFiltered) / 2)) * 100;
        var currentQuality;

        if (serverFiltered < LOW_VIDEO_RATE_THRESHOLD_BAD_PERFECT || clientFiltered < LOW_VIDEO_RATE_THRESHOLD_BAD_PERFECT) {
          if (videoRateDifference > LOW_VIDEO_RATE_BAD_QUALITY_PERCENT_DIFFERENCE) {
            currentQuality = CONNECTION_QUALITY.BAD;
          } else {
            currentQuality = CONNECTION_QUALITY.PERFECT;
          }
        } else {
          if (videoRateDifference > VIDEO_RATE_BAD_QUALITY_PERCENT_DIFFERENCE) {
            currentQuality = CONNECTION_QUALITY.BAD;
          } else if (videoRateDifference > VIDEO_RATE_GOOD_QUALITY_PERCENT_DIFFERENCE) {
            currentQuality = CONNECTION_QUALITY.GOOD;
          } else {
            currentQuality = CONNECTION_QUALITY.PERFECT;
          }
        }

        if (callbacks[CONNECTION_QUALITY.UPDATE]) {
          connectionQuality = currentQuality;
          callbacks[CONNECTION_QUALITY.UPDATE](connectionQuality, clientFiltered, serverFiltered);
        }

        videoBytes = bytesSentReceived;
      });
      return;
    };
    /**
     * Play stream.
     *
     * @throws {Error} Error if stream status is not {@link Flashphoner.constants.STREAM_STATUS.NEW}
     * @memberof Stream
     * @inner
     */


    var play = function play() {
      logger.debug(LOG_PREFIX, "Play stream " + name_);

      if (status_ !== STREAM_STATUS.NEW) {
        throw new Error("Invalid stream state");
      }

      status_ = STREAM_STATUS.PENDING; //create mediaProvider connection

      MediaProvider[mediaProvider].createConnection({
        id: id_,
        display: display,
        authToken: authToken,
        mainUrl: urlServer,
        flashProto: flashProto,
        flashPort: flashPort,
        flashBufferTime: options.flashBufferTime || 0,
        flashShowFullScreenButton: options.flashShowFullScreenButton || false,
        connectionConfig: mediaOptions,
        connectionConstraints: mediaConnectionConstraints,
        audioOutputId: audioOutputId,
        remoteVideo: remoteVideo,
        playoutDelay: playoutDelay
      }, streamRefreshHandlers[id_]).then(function (newConnection) {
        mediaConnection = newConnection;

        try {
          streamRefreshHandlers[id_]({
            status: status_
          });
        } catch (e) {
          console.warn(e);
        }

        return mediaConnection.createOffer({
          receiveAudio: receiveAudio,
          receiveVideo: receiveVideo,
          stripCodecs: stripCodecs,
          stereo: _stereo
        });
      }).then(function (offer) {
        logger.debug(LOG_PREFIX, "Offer SDP:\n" + offer.sdp); //request stream with offer sdp from server

        send("playStream", {
          mediaSessionId: id_,
          name: name_,
          published: published_,
          hasVideo: true,
          hasAudio: true,
          status: status_,
          record: false,
          width: playWidth,
          height: playHeight,
          mediaProvider: mediaProvider,
          sdp: offer.sdp,
          custom: options.custom,
          bitrate: bitrate,
          minBitrate: minBitrate,
          maxBitrate: maxBitrate,
          quality: quality,
          constraints: constraints,
          transport: transportType,
          cvoExtension: cvoExtension
        });

        if (offer.player) {
          offer.player.play(id_);
        }
      })["catch"](function (error) {
        //todo fire stream failed status
        throw error;
      });
    };
    /**
     * Publish stream.
     *
     * @throws {Error} Error if stream status is not {@link Flashphoner.constants.STREAM_STATUS.NEW}
     * @memberof Stream
     * @inner
     */


    var publish = function publish() {
      logger.debug(LOG_PREFIX, "Publish stream " + name_);

      if (status_ !== STREAM_STATUS.NEW) {
        throw new Error("Invalid stream state");
      }

      status_ = STREAM_STATUS.PENDING;
      published_ = true;
      var hasAudio = true;

      if (constraints && constraints.video && constraints.video.type && constraints.video.type == "screen") {
        hasAudio = false;
      } //get access to camera


      MediaProvider[mediaProvider].getMediaAccess(constraints, display, disableConstraintsNormalization).then(function () {
        if (status_ == STREAM_STATUS.FAILED) {
          //stream failed while we were waiting for media access, release media
          if (!cacheLocalResources) {
            releaseLocalMedia(display, mediaProvider);
          }

          return;
        } //create mediaProvider connection


        MediaProvider[mediaProvider].createConnection({
          id: id_,
          display: display,
          authToken: authToken,
          mainUrl: urlServer,
          flashProto: flashProto,
          flashPort: flashPort,
          constraints: constraints,
          connectionConfig: mediaOptions,
          connectionConstraints: mediaConnectionConstraints,
          customStream: constraints && constraints.customStream ? constraints.customStream : false
        }).then(function (newConnection) {
          mediaConnection = newConnection;
          return mediaConnection.createOffer({
            stripCodecs: stripCodecs
          });
        }).then(function (offer) {
          logger.debug(LOG_PREFIX, "Offer SDP:\n" + offer.sdp); //publish stream with offer sdp to server

          send("publishStream", {
            mediaSessionId: id_,
            name: name_,
            published: published_,
            hasVideo: offer.hasVideo,
            hasAudio: offer.hasAudio,
            status: status_,
            record: record_,
            mediaProvider: mediaProvider,
            sdp: offer.sdp,
            custom: options.custom,
            bitrate: bitrate,
            minBitrate: minBitrate,
            maxBitrate: maxBitrate,
            rtmpUrl: rtmpUrl,
            constraints: constraints,
            transport: transportType,
            cvoExtension: cvoExtension
          });
        });
      })["catch"](function (error) {
        logger.warn(LOG_PREFIX, error);
        info_ = ERROR_INFO.LOCAL_ERROR;
        errorInfo_ = error.message;
        status_ = STREAM_STATUS.FAILED; //fire stream event

        if (callbacks[status_]) {
          callbacks[status_](stream);
        }
      });
    };
    /**
     * Switch camera in real-time.
     * Works only with WebRTC
     *
     * @memberOf Stream
     * @inner
     * @throws {Error} Error if stream status is not {@link Flashphoner.constants.STREAM_STATUS.PUBLISHING}
     */


    var switchCam = function switchCam(deviceId) {
      if (status_ !== STREAM_STATUS.PUBLISHING) {
        throw new Error('Invalid stream state');
      }

      return mediaConnection.switchCam(deviceId);
    };
    /**
     * Switch microphone in real-time.
     * Works only with WebRTC
     *
     * @memberOf Stream
     * @inner
     * @throws {Error} Error if stream status is not {@link Flashphoner.constants.STREAM_STATUS.PUBLISHING}
     */


    var switchMic = function switchMic(deviceId) {
      if (status_ !== STREAM_STATUS.PUBLISHING) {
        throw new Error('Invalid stream state');
      }

      return mediaConnection.switchMic(deviceId);
    };
    /**
     * Switch to screen in real-time.
     * Works only with WebRTC
     *
     * @param {String} source Screen sharing source (for firefox)
     * @param {Boolean} woExtension Screen sharing without extension (for chrome)
     * @memberOf Stream
     * @inner
     * @throws {Error} Error if stream status is not {@link Flashphoner.constants.STREAM_STATUS.PUBLISHING}
     */


    var switchToScreen = function switchToScreen(source, woExtension) {
      if (status_ !== STREAM_STATUS.PUBLISHING) {
        throw new Error('Invalid stream state');
      }

      return mediaConnection.switchToScreen(source, woExtension);
    };
    /**
     * Switch to cam in real-time.
     * Works only with WebRTC
     *
     * @memberOf Stream
     * @inner
     * @throws {Error} Error if stream status is not {@link Flashphoner.constants.STREAM_STATUS.PUBLISHING}
     */


    var switchToCam = function switchToCam() {
      if (status_ !== STREAM_STATUS.PUBLISHING) {
        throw new Error('Invalid stream state');
      }

      mediaConnection.switchToCam();
    };
    /**
     * Unmute remote audio
     *
     * @memberOf Stream
     * @inner
     */


    var unmuteRemoteAudio = function unmuteRemoteAudio() {
      if (mediaConnection && mediaProvider != 'Flash') {
        mediaConnection.unmuteRemoteAudio();
      }
    };
    /**
     * Mute remote audio
     *
     * @memberOf Stream
     * @inner
     */


    var muteRemoteAudio = function muteRemoteAudio() {
      if (mediaConnection && mediaProvider != 'Flash') {
        mediaConnection.muteRemoteAudio();
      }
    };
    /**
     * Is remote audio muted
     *
     * @memberOf Stream
     * @inner
     */


    var isRemoteAudioMuted = function isRemoteAudioMuted() {
      if (mediaConnection && mediaProvider != 'Flash') {
        return mediaConnection.isRemoteAudioMuted();
      }

      return false;
    };
    /**
     * Set Microphone Gain
     *
     * @memberOf Stream
     * @inner
     * @throws {Error} Error if stream status is not {@link Flashphoner.constants.STREAM_STATUS.PUBLISHING}
     */


    var setMicrophoneGain = function setMicrophoneGain(volume) {
      if (status_ !== STREAM_STATUS.PUBLISHING) {
        throw new Error('Invalid stream state');
      }

      mediaConnection.setMicrophoneGain(volume);
    };
    /**
     * Stop stream.
     *
     * @memberof Stream
     * @inner
     */


    var stop = function stop() {
      logger.debug(LOG_PREFIX, "Stop stream " + name_);

      if (status_ == STREAM_STATUS.NEW) {
        //trigger FAILED status
        streamRefreshHandlers[id_]({
          status: STREAM_STATUS.FAILED
        });
        return;
      } else if (status_ == STREAM_STATUS.PENDING) {
        logger.warn(LOG_PREFIX, "Stopping stream before server response " + id_);
        setTimeout(stop, 200);
        return;
      } else if (status_ == STREAM_STATUS.FAILED) {
        logger.warn(LOG_PREFIX, "Stream status FAILED");
        return;
      }

      if (published_) {
        send("unPublishStream", {
          mediaSessionId: id_,
          name: name_,
          published: published_,
          hasVideo: true,
          hasAudio: true,
          status: status_,
          record: false
        });
      } else {
        send("stopStream", {
          mediaSessionId: id_,
          name: name_,
          published: published_,
          hasVideo: true,
          hasAudio: true,
          status: status_,
          record: false
        });
      } //free media provider


      if (mediaConnection) {
        mediaConnection.close(cacheLocalResources);
      }
    };
    /**
     * Request remote stream snapshot.
     * @throws {Error} Error if stream status is not {@link Flashphoner.constants.STREAM_STATUS.NEW}
     * @memberof Stream
     * @inner
     */


    var snapshot = function snapshot() {
      logger.debug(LOG_PREFIX, "Request snapshot, stream " + name_);

      if (status_ !== STREAM_STATUS.NEW && status_ !== STREAM_STATUS.PLAYING && status_ !== STREAM_STATUS.PUBLISHING) {
        throw new Error("Invalid stream state");
      }

      send("snapshot", {
        name: name_,
        mediaSessionId: id_
      });
    };
    /**
     * Get stream status.
     *
     * @returns {string} One of {@link Flashphoner.constants.STREAM_STATUS}
     * @memberof Stream
     * @inner
     */


    var status = function status() {
      return status_;
    };
    /**
     * Get stream id.
     *
     * @returns {string} Stream id
     * @memberof Stream
     * @inner
     */


    var id = function id() {
      return id_;
    };
    /**
     * Get stream name.
     *
     * @returns {string} Stream name
     * @memberof Stream
     * @inner
     */


    var name = function name() {
      return name_;
    };
    /**
     * Is stream published.
     *
     * @returns {Boolean} True if stream published, otherwise false
     * @memberof Stream
     * @inner
     */


    var published = function published() {
      return published_;
    };
    /**
     * Get record file name
     * @returns {string} File name
     * @memberof Stream
     * @inner
     */


    var getRecordInfo = function getRecordInfo() {
      return recordFileName;
    };
    /**
     * Get stream info
     * @returns {string} Info
     * @memberof Stream
     * @inner
     */


    var getInfo = function getInfo() {
      return info_;
    };
    /**
     * Get stream error info
     * @returns {string} Error info
     * @memberof Stream
     * @inner
     */


    var getErrorInfo = function getErrorInfo() {
      return errorInfo_;
    };
    /**
     * Get stream video size
     * @returns {Object} Video size
     * @memberof Stream
     * @inner
     */


    var videoResolution = function videoResolution() {
      if (!published_) {
        return resolution;
      } else {
        throw new Error("This function available only on playing stream");
      }
    };
    /**
     * Media controls
     */

    /**
     * Set other oupout audio device
     *
     * @param {string} id Id of output device
     * @memberof Call
     * @inner
     */


    var setAudioOutputId = function setAudioOutputId(id) {
      audioOutputId = id;

      if (mediaConnection && mediaConnection.setAudioOutputId) {
        return mediaConnection.setAudioOutputId(id);
      }
    };
    /**
     * Set volume of remote media
     *
     * @param {number} volume Volume between 0 and 100
     * @memberof Stream
     * @inner
     */


    var setVolume = function setVolume(volume) {
      if (mediaConnection) {
        mediaConnection.setVolume(volume);
      }
    };
    /**
     * Get current volume
     *
     * @returns {number} Volume or -1 if audio is not available
     * @memberof Stream
     * @inner
     */


    var getVolume = function getVolume() {
      if (mediaConnection) {
        return mediaConnection.getVolume();
      }

      return -1;
    };
    /**
     * Mute outgoing audio
     *
     * @memberof Stream
     * @inner
     */


    var muteAudio = function muteAudio() {
      if (mediaConnection) {
        mediaConnection.muteAudio();
      }
    };
    /**
     * Unmute outgoing audio
     *
     * @memberof Stream
     * @inner
     */


    var unmuteAudio = function unmuteAudio() {
      if (mediaConnection) {
        mediaConnection.unmuteAudio();
      }
    };
    /**
     * Check outgoing audio mute state
     *
     * @returns {boolean} True if audio is muted or not available
     * @memberof Stream
     * @inner
     */


    var isAudioMuted = function isAudioMuted() {
      if (mediaConnection) {
        return mediaConnection.isAudioMuted();
      }

      return true;
    };
    /**
     * Mute outgoing video
     *
     * @memberof Stream
     * @inner
     */


    var muteVideo = function muteVideo() {
      if (mediaConnection) {
        mediaConnection.muteVideo();
      }
    };
    /**
     * Unmute outgoing video
     *
     * @memberof Stream
     * @inner
     */


    var unmuteVideo = function unmuteVideo() {
      if (mediaConnection) {
        mediaConnection.unmuteVideo();
      }
    };
    /**
     * Check outgoing video mute state
     *
     * @returns {boolean} True if video is muted or not available
     * @memberof Stream
     * @inner
     */


    var isVideoMuted = function isVideoMuted() {
      if (mediaConnection) {
        return mediaConnection.isVideoMuted();
      }

      return true;
    };
    /**
     * Get statistics
     *
     * @param {callbackFn} callbackFn The callback that handles response
     * @param {Boolean} nativeStats If true, use native browser statistics
     * @returns {Object} Stream audio\video statistics
     * @memberof Stream
     * @inner
     */


    var getStats = function getStats(callbackFn, nativeStats) {
      if (mediaConnection) {
        mediaConnection.getStats(callbackFn, nativeStats);
      }
    };
    /**
     * Get remote bitrate reported by server, works only for subscribe Stream
     *
     * @returns {number} Remote bitrate in bps or -1
     * @memberof Stream
     * @inner
     */


    var getRemoteBitrate = function getRemoteBitrate() {
      return remoteBitrate;
    };
    /**
     * Get network bandwidth reported by server, works only for subscribe Stream
     *
     * @returns {number} Network bandwidth in bps or -1
     * @memberof Stream
     * @inner
     */


    var getNetworkBandwidth = function getNetworkBandwidth() {
      return networkBandwidth;
    };
    /**
     * Request full screen for player stream
     * @memberof Stream
     * @inner
     */


    var fullScreen = function fullScreen() {
      if (published()) {
        logger.warn(LOG_PREFIX, "Full screen is allowed only for played streams");
      } else {
        if (mediaConnection) mediaConnection.fullScreen();
      }
    };
    /**
     * Stream event callback.
     *
     * @callback Stream~eventCallback
     * @param {Stream} stream Stream that corresponds to the event
     */

    /**
     * Add stream event callback.
     *
     * @param {string} event One of {@link Flashphoner.constants.STREAM_STATUS} events
     * @param {Stream~eventCallback} callback Callback function
     * @returns {Stream} Stream callback was attached to
     * @throws {TypeError} Error if event is not specified
     * @throws {Error} Error if callback is not a valid function
     * @memberof Stream
     * @inner
     */


    var on = function on(event, callback) {
      if (!event) {
        throw new TypeError("Event can't be null");
      }

      if (!callback || typeof callback !== 'function') {
        throw new Error("Callback needs to be a valid function");
      }

      callbacks[event] = callback;
      return stream;
    };
    /**
     * Сhecks the availability of stream on the server
     *
     * @returns {Promise} Resolves if is stream available, otherwise rejects
     * @memberof Stream
     * @inner
     */


    var available = function available() {
      return new Promise(function (resolve, reject) {
        send("availableStream", {
          mediaSessionId: id_,
          name: name_
        });
        var promise = {};
        promise.resolve = resolve;
        promise.reject = reject;
        availableCallbacks.push(promise);
      });
    };

    stream.play = play;
    stream.publish = publish;
    stream.stop = stop;
    stream.id = id;
    stream.status = status;
    stream.name = name;
    stream.published = published;
    stream.getRecordInfo = getRecordInfo;
    stream.getInfo = getInfo;
    stream.getErrorInfo = getErrorInfo;
    stream.videoResolution = videoResolution;
    stream.setAudioOutputId = setAudioOutputId;
    stream.setVolume = setVolume;
    stream.unmuteRemoteAudio = unmuteRemoteAudio;
    stream.muteRemoteAudio = muteRemoteAudio;
    stream.isRemoteAudioMuted = isRemoteAudioMuted;
    stream.setMicrophoneGain = setMicrophoneGain;
    stream.getVolume = getVolume;
    stream.muteAudio = muteAudio;
    stream.unmuteAudio = unmuteAudio;
    stream.isAudioMuted = isAudioMuted;
    stream.muteVideo = muteVideo;
    stream.unmuteVideo = unmuteVideo;
    stream.isVideoMuted = isVideoMuted;
    stream.getStats = getStats;
    stream.snapshot = snapshot;
    stream.getNetworkBandwidth = getNetworkBandwidth;
    stream.getRemoteBitrate = getRemoteBitrate;
    stream.fullScreen = fullScreen;
    stream.on = on;
    stream.available = available;
    stream.switchCam = switchCam;
    stream.switchMic = switchMic;
    stream.switchToScreen = switchToScreen;
    stream.switchToCam = switchToCam;
    streams[id_] = stream;
    return stream;
  };
  /**
   * Disconnect session.
   *
   * @memberof Session
   * @inner
   */


  var disconnect = function disconnect() {
    if (wsConnection) {
      wsConnection.close();
    }
  };
  /**
   * Get session id
   *
   * @returns {string} session id
   * @memberof Session
   * @inner
   */


  var id = function id() {
    return id_;
  };
  /**
   * Get server address
   *
   * @returns {string} Server url
   * @memberof Session
   * @inner
   */


  var getServerUrl = function getServerUrl() {
    return urlServer;
  };
  /**
   * Get session status
   *
   * @returns {string} One of {@link Flashphoner.constants.SESSION_STATUS}
   * @memberof Session
   * @inner
   */


  var status = function status() {
    return sessionStatus;
  };
  /**
   * Get stream by id.
   *
   * @param {string} streamId Stream id
   * @returns {Stream} Stream
   * @memberof Session
   * @inner
   */


  var getStream = function getStream(streamId) {
    return streams[streamId];
  };
  /**
   * Get streams.
   *
   * @returns {Array<Stream>} Streams
   * @memberof Session
   * @inner
   */


  var getStreams = function getStreams() {
    return util.copyObjectToArray(streams);
  };
  /**
   * Submit bug report.
   *
   * @param {Object} reportObject Report object
   * @memberof Session
   * @inner
   */


  var submitBugReport = function submitBugReport(reportObject) {
    send("submitBugReport", reportObject);
  };
  /**
   * Start session debug
   * @memberof Session
   * @inner
   */


  var startDebug = function startDebug() {
    logger.setPushLogs(true);
    logger.setLevel("DEBUG");
    send("sessionDebug", {
      command: "start"
    });
  };
  /**
   * Stop session debug
   * @memberof Session
   * @inner
   */


  var stopDebug = function stopDebug() {
    logger.setLevel("INFO");
    send("sessionDebug", {
      command: "stop"
    });
  };
  /**
   * Session event callback.
   *
   * @callback Session~eventCallback
   * @param {Session} session Session that corresponds to the event
   */

  /**
   * Add session event callback.
   *
   * @param {string} event One of {@link Flashphoner.constants.SESSION_STATUS} events
   * @param {Session~eventCallback} callback Callback function
   * @returns {Session} Session
   * @throws {TypeError} Error if event is not specified
   * @throws {Error} Error if callback is not a valid function
   * @memberof Session
   * @inner
   */


  var on = function on(event, callback) {
    if (!event) {
      throw new Error("Event can't be null", "TypeError");
    }

    if (!callback || typeof callback !== 'function') {
      throw new Error("Callback needs to be a valid function");
    }

    callbacks[event] = callback;
    return session;
  };

  var restAppCommunicator = function () {
    var pending = {};
    var exports = {};
    /**
     * Send data to REST App
     *
     * @param {Object} data Object to send
     * @returns {Promise} Resolves if data accepted, otherwise rejects
     * @memberof Session
     * @name sendData
     * @method
     * @inner
     */

    exports.sendData = function (data) {
      return new Promise(function (resolve, reject) {
        var obj = {
          operationId: uuid_v1(),
          payload: data
        };
        pending[obj.operationId] = {
          FAILED: function FAILED(info) {
            reject(info);
          },
          ACCEPTED: function ACCEPTED(info) {
            resolve(info);
          }
        };
        send("sendData", obj);
      });
    };

    exports.resolveData = function (data) {
      if (pending[data.operationId]) {
        var handler = pending[data.operationId];
        delete pending[data.operationId];
        delete data.operationId;
        handler[data.status](data);
      }
    };

    return exports;
  }();

  var sdpHookHandler = function sdpHookHandler(sdp, sdpHook) {
    if (sdpHook != undefined && typeof sdpHook == 'function') {
      var sdpObject = {
        sdpString: sdp
      };
      var newSdp = sdpHook(sdpObject);

      if (newSdp != null && newSdp != "") {
        return newSdp;
      }

      return sdp;
    }

    return sdp;
  }; //export Session


  session.id = id;
  session.status = status;
  session.getServerUrl = getServerUrl;
  session.createStream = createStream;
  session.createCall = createCall;
  session.getStream = getStream;
  session.getStreams = getStreams;
  session.sendData = restAppCommunicator.sendData;
  session.disconnect = disconnect;
  session.submitBugReport = submitBugReport;
  session.startDebug = startDebug;
  session.stopDebug = stopDebug;
  session.on = on; //save interface to global map

  sessions[id_] = session;
  return session;
};

var isUsingTemasys = function isUsingTemasys() {
  return isUsingTemasysPlugin;
};

module.exports = {
  init: init,
  isUsingTemasys: isUsingTemasys,
  getMediaProviders: getMediaProviders,
  getMediaDevices: getMediaDevices,
  getMediaAccess: getMediaAccess,
  releaseLocalMedia: releaseLocalMedia,
  getSessions: getSessions,
  getSession: getSession,
  createSession: createSession,
  playFirstSound: playFirstSound,
  playFirstVideo: playFirstVideo,
  getLogger: getLogger,
  roomApi: require('./room-module'),
  constants: constants,

  /**
   * The Screensharing whitelist is no longer needed to share your screen or windows starting Firefox 52
   * https://wiki.mozilla.org/Screensharing
   */
  firefoxScreenSharingExtensionInstalled: true
};

},{"./constants":29,"./flash-media-provider":30,"./media-source-media-provider":32,"./room-module":33,"./temasys-media-provider":34,"./util":35,"./webrtc-media-provider":1,"./websocket-media-provider":36,"kalmanjs":3,"promise-polyfill":5,"uuid/v1":12,"webrtc-adapter":13}],32:[function(require,module,exports){
(function (global){(function (){
function _typeof(obj){"@babel/helpers - typeof";if(typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"){_typeof=function _typeof(obj){return typeof obj;};}else{_typeof=function _typeof(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};}return _typeof(obj);}!function(t){if("object"==(typeof exports==="undefined"?"undefined":_typeof(exports))&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).MediaSourceMediaProvider=t();}}(function(){return function t(e,r,n){function i(a,s){if(!r[a]){if(!e[a]){var f="function"==typeof require&&require;if(!s&&f)return f(a,!0);if(o)return o(a,!0);var u=new Error("Cannot find module '"+a+"'");throw u.code="MODULE_NOT_FOUND",u;}var c=r[a]={exports:{}};e[a][0].call(c.exports,function(t){return i(e[a][1][t]||t);},c,c.exports,t,e,r,n);}return r[a].exports;}for(var o="function"==typeof require&&require,a=0;a<n.length;a++){i(n[a]);}return i;}({1:[function(t,e,r){e.exports=function(t,e){if(t===e)return!0;if(t.byteLength!==e.byteLength)return!1;for(var r=new DataView(t),n=new DataView(e),i=t.byteLength;i--;){if(r.getUint8(i)!==n.getUint8(i))return!1;}return!0;};},{}],2:[function(t,e,r){"use strict";var n=r;n.bignum=t(16),n.define=t(3).define,n.base=t(5),n.constants=t(9),n.decoders=t(11),n.encoders=t(14);},{11:11,14:14,16:16,3:3,5:5,9:9}],3:[function(t,e,r){"use strict";var n=t(14),i=t(11),o=t(468);function a(t,e){this.name=t,this.body=e,this.decoders={},this.encoders={};}r.define=function(t,e){return new a(t,e);},a.prototype._createNamed=function(t){var e=this.name;function r(t){this._initNamed(t,e);}return o(r,t),r.prototype._initNamed=function(e,r){t.call(this,e,r);},new r(this);},a.prototype._getDecoder=function(t){return t=t||"der",this.decoders.hasOwnProperty(t)||(this.decoders[t]=this._createNamed(i[t])),this.decoders[t];},a.prototype.decode=function(t,e,r){return this._getDecoder(e).decode(t,r);},a.prototype._getEncoder=function(t){return t=t||"der",this.encoders.hasOwnProperty(t)||(this.encoders[t]=this._createNamed(n[t])),this.encoders[t];},a.prototype.encode=function(t,e,r){return this._getEncoder(e).encode(t,r);};},{11:11,14:14,468:468}],4:[function(t,e,r){"use strict";var n=t(468),i=t(7).Reporter,o=t(516).Buffer;function a(t,e){i.call(this,e),o.isBuffer(t)?(this.base=t,this.offset=0,this.length=t.length):this.error("Input not Buffer");}function s(t,e){if(Array.isArray(t))this.length=0,this.value=t.map(function(t){return s.isEncoderBuffer(t)||(t=new s(t,e)),this.length+=t.length,t;},this);else if("number"==typeof t){if(!(0<=t&&t<=255))return e.error("non-byte EncoderBuffer value");this.value=t,this.length=1;}else if("string"==typeof t)this.value=t,this.length=o.byteLength(t);else{if(!o.isBuffer(t))return e.error("Unsupported type: "+_typeof(t));this.value=t,this.length=t.length;}}n(a,i),r.DecoderBuffer=a,a.isDecoderBuffer=function(t){if(t instanceof a)return!0;return"object"==_typeof(t)&&o.isBuffer(t.base)&&"DecoderBuffer"===t.constructor.name&&"number"==typeof t.offset&&"number"==typeof t.length&&"function"==typeof t.save&&"function"==typeof t.restore&&"function"==typeof t.isEmpty&&"function"==typeof t.readUInt8&&"function"==typeof t.skip&&"function"==typeof t.raw;},a.prototype.save=function(){return{offset:this.offset,reporter:i.prototype.save.call(this)};},a.prototype.restore=function(t){var e=new a(this.base);return e.offset=t.offset,e.length=this.offset,this.offset=t.offset,i.prototype.restore.call(this,t.reporter),e;},a.prototype.isEmpty=function(){return this.offset===this.length;},a.prototype.readUInt8=function(t){return this.offset+1<=this.length?this.base.readUInt8(this.offset++,!0):this.error(t||"DecoderBuffer overrun");},a.prototype.skip=function(t,e){if(!(this.offset+t<=this.length))return this.error(e||"DecoderBuffer overrun");var r=new a(this.base);return r._reporterState=this._reporterState,r.offset=this.offset,r.length=this.offset+t,this.offset+=t,r;},a.prototype.raw=function(t){return this.base.slice(t?t.offset:this.offset,this.length);},r.EncoderBuffer=s,s.isEncoderBuffer=function(t){if(t instanceof s)return!0;return"object"==_typeof(t)&&"EncoderBuffer"===t.constructor.name&&"number"==typeof t.length&&"function"==typeof t.join;},s.prototype.join=function(t,e){return t||(t=o.alloc(this.length)),e||(e=0),0===this.length||(Array.isArray(this.value)?this.value.forEach(function(r){r.join(t,e),e+=r.length;}):("number"==typeof this.value?t[e]=this.value:"string"==typeof this.value?t.write(this.value,e):o.isBuffer(this.value)&&this.value.copy(t,e),e+=this.length)),t;};},{468:468,516:516,7:7}],5:[function(t,e,r){"use strict";var n=r;n.Reporter=t(7).Reporter,n.DecoderBuffer=t(4).DecoderBuffer,n.EncoderBuffer=t(4).EncoderBuffer,n.Node=t(6);},{4:4,6:6,7:7}],6:[function(t,e,r){"use strict";var n=t(7).Reporter,i=t(4).EncoderBuffer,o=t(4).DecoderBuffer,a=t(474),s=["seq","seqof","set","setof","objid","bool","gentime","utctime","null_","enum","int","objDesc","bitstr","bmpstr","charstr","genstr","graphstr","ia5str","iso646str","numstr","octstr","printstr","t61str","unistr","utf8str","videostr"],f=["key","obj","use","optional","explicit","implicit","def","choice","any","contains"].concat(s);function u(t,e,r){var n={};this._baseState=n,n.name=r,n.enc=t,n.parent=e||null,n.children=null,n.tag=null,n.args=null,n.reverseArgs=null,n.choice=null,n.optional=!1,n.any=!1,n.obj=!1,n.use=null,n.useDecoder=null,n.key=null,n["default"]=null,n.explicit=null,n.implicit=null,n.contains=null,n.parent||(n.children=[],this._wrap());}e.exports=u;var c=["enc","parent","children","tag","args","reverseArgs","choice","optional","any","obj","use","alteredUse","key","default","explicit","implicit","contains"];u.prototype.clone=function(){var t=this._baseState,e={};c.forEach(function(r){e[r]=t[r];});var r=new this.constructor(e.parent);return r._baseState=e,r;},u.prototype._wrap=function(){var t=this._baseState;f.forEach(function(e){this[e]=function(){var r=new this.constructor(this);return t.children.push(r),r[e].apply(r,arguments);};},this);},u.prototype._init=function(t){var e=this._baseState;a(null===e.parent),t.call(this),e.children=e.children.filter(function(t){return t._baseState.parent===this;},this),a.equal(e.children.length,1,"Root node can have only one child");},u.prototype._useArgs=function(t){var e=this._baseState,r=t.filter(function(t){return t instanceof this.constructor;},this);t=t.filter(function(t){return!(t instanceof this.constructor);},this),0!==r.length&&(a(null===e.children),e.children=r,r.forEach(function(t){t._baseState.parent=this;},this)),0!==t.length&&(a(null===e.args),e.args=t,e.reverseArgs=t.map(function(t){if("object"!=_typeof(t)||t.constructor!==Object)return t;var e={};return Object.keys(t).forEach(function(r){r==(0|r)&&(r|=0);var n=t[r];e[n]=r;}),e;}));},["_peekTag","_decodeTag","_use","_decodeStr","_decodeObjid","_decodeTime","_decodeNull","_decodeInt","_decodeBool","_decodeList","_encodeComposite","_encodeStr","_encodeObjid","_encodeTime","_encodeNull","_encodeInt","_encodeBool"].forEach(function(t){u.prototype[t]=function(){var e=this._baseState;throw new Error(t+" not implemented for encoding: "+e.enc);};}),s.forEach(function(t){u.prototype[t]=function(){var e=this._baseState,r=Array.prototype.slice.call(arguments);return a(null===e.tag),e.tag=t,this._useArgs(r),this;};}),u.prototype.use=function(t){a(t);var e=this._baseState;return a(null===e.use),e.use=t,this;},u.prototype.optional=function(){return this._baseState.optional=!0,this;},u.prototype.def=function(t){var e=this._baseState;return a(null===e["default"]),e["default"]=t,e.optional=!0,this;},u.prototype.explicit=function(t){var e=this._baseState;return a(null===e.explicit&&null===e.implicit),e.explicit=t,this;},u.prototype.implicit=function(t){var e=this._baseState;return a(null===e.explicit&&null===e.implicit),e.implicit=t,this;},u.prototype.obj=function(){var t=this._baseState,e=Array.prototype.slice.call(arguments);return t.obj=!0,0!==e.length&&this._useArgs(e),this;},u.prototype.key=function(t){var e=this._baseState;return a(null===e.key),e.key=t,this;},u.prototype.any=function(){return this._baseState.any=!0,this;},u.prototype.choice=function(t){var e=this._baseState;return a(null===e.choice),e.choice=t,this._useArgs(Object.keys(t).map(function(e){return t[e];})),this;},u.prototype.contains=function(t){var e=this._baseState;return a(null===e.use),e.contains=t,this;},u.prototype._decode=function(t,e){var r=this._baseState;if(null===r.parent)return t.wrapResult(r.children[0]._decode(t,e));var n,i=r["default"],a=!0,s=null;if(null!==r.key&&(s=t.enterKey(r.key)),r.optional){var _n=null;if(null!==r.explicit?_n=r.explicit:null!==r.implicit?_n=r.implicit:null!==r.tag&&(_n=r.tag),null!==_n||r.any){if(a=this._peekTag(t,_n,r.any),t.isError(a))return a;}else{var _n2=t.save();try{null===r.choice?this._decodeGeneric(r.tag,t,e):this._decodeChoice(t,e),a=!0;}catch(t){a=!1;}t.restore(_n2);}}if(r.obj&&a&&(n=t.enterObject()),a){if(null!==r.explicit){var _e=this._decodeTag(t,r.explicit);if(t.isError(_e))return _e;t=_e;}var _n3=t.offset;if(null===r.use&&null===r.choice){var _e2;r.any&&(_e2=t.save());var _n4=this._decodeTag(t,null!==r.implicit?r.implicit:r.tag,r.any);if(t.isError(_n4))return _n4;r.any?i=t.raw(_e2):t=_n4;}if(e&&e.track&&null!==r.tag&&e.track(t.path(),_n3,t.length,"tagged"),e&&e.track&&null!==r.tag&&e.track(t.path(),t.offset,t.length,"content"),r.any||(i=null===r.choice?this._decodeGeneric(r.tag,t,e):this._decodeChoice(t,e)),t.isError(i))return i;if(r.any||null!==r.choice||null===r.children||r.children.forEach(function(r){r._decode(t,e);}),r.contains&&("octstr"===r.tag||"bitstr"===r.tag)){var _n5=new o(i);i=this._getUse(r.contains,t._reporterState.obj)._decode(_n5,e);}}return r.obj&&a&&(i=t.leaveObject(n)),null===r.key||null===i&&!0!==a?null!==s&&t.exitKey(s):t.leaveKey(s,r.key,i),i;},u.prototype._decodeGeneric=function(t,e,r){var n=this._baseState;return"seq"===t||"set"===t?null:"seqof"===t||"setof"===t?this._decodeList(e,t,n.args[0],r):/str$/.test(t)?this._decodeStr(e,t,r):"objid"===t&&n.args?this._decodeObjid(e,n.args[0],n.args[1],r):"objid"===t?this._decodeObjid(e,null,null,r):"gentime"===t||"utctime"===t?this._decodeTime(e,t,r):"null_"===t?this._decodeNull(e,r):"bool"===t?this._decodeBool(e,r):"objDesc"===t?this._decodeStr(e,t,r):"int"===t||"enum"===t?this._decodeInt(e,n.args&&n.args[0],r):null!==n.use?this._getUse(n.use,e._reporterState.obj)._decode(e,r):e.error("unknown tag: "+t);},u.prototype._getUse=function(t,e){var r=this._baseState;return r.useDecoder=this._use(t,e),a(null===r.useDecoder._baseState.parent),r.useDecoder=r.useDecoder._baseState.children[0],r.implicit!==r.useDecoder._baseState.implicit&&(r.useDecoder=r.useDecoder.clone(),r.useDecoder._baseState.implicit=r.implicit),r.useDecoder;},u.prototype._decodeChoice=function(t,e){var r=this._baseState;var n=null,i=!1;return Object.keys(r.choice).some(function(o){var a=t.save(),s=r.choice[o];try{var _r=s._decode(t,e);if(t.isError(_r))return!1;n={type:o,value:_r},i=!0;}catch(e){return t.restore(a),!1;}return!0;},this),i?n:t.error("Choice not matched");},u.prototype._createEncoderBuffer=function(t){return new i(t,this.reporter);},u.prototype._encode=function(t,e,r){var n=this._baseState;if(null!==n["default"]&&n["default"]===t)return;var i=this._encodeValue(t,e,r);return void 0===i||this._skipDefault(i,e,r)?void 0:i;},u.prototype._encodeValue=function(t,e,r){var i=this._baseState;if(null===i.parent)return i.children[0]._encode(t,e||new n());var o=null;if(this.reporter=e,i.optional&&void 0===t){if(null===i["default"])return;t=i["default"];}var a=null,s=!1;if(i.any)o=this._createEncoderBuffer(t);else if(i.choice)o=this._encodeChoice(t,e);else if(i.contains)a=this._getUse(i.contains,r)._encode(t,e),s=!0;else if(i.children)a=i.children.map(function(r){if("null_"===r._baseState.tag)return r._encode(null,e,t);if(null===r._baseState.key)return e.error("Child should have a key");var n=e.enterKey(r._baseState.key);if("object"!=_typeof(t))return e.error("Child expected, but input is not object");var i=r._encode(t[r._baseState.key],e,t);return e.leaveKey(n),i;},this).filter(function(t){return t;}),a=this._createEncoderBuffer(a);else if("seqof"===i.tag||"setof"===i.tag){if(!i.args||1!==i.args.length)return e.error("Too many args for : "+i.tag);if(!Array.isArray(t))return e.error("seqof/setof, but data is not Array");var _r2=this.clone();_r2._baseState.implicit=null,a=this._createEncoderBuffer(t.map(function(r){var n=this._baseState;return this._getUse(n.args[0],t)._encode(r,e);},_r2));}else null!==i.use?o=this._getUse(i.use,r)._encode(t,e):(a=this._encodePrimitive(i.tag,t),s=!0);if(!i.any&&null===i.choice){var _t2=null!==i.implicit?i.implicit:i.tag,_r3=null===i.implicit?"universal":"context";null===_t2?null===i.use&&e.error("Tag could be omitted only for .use()"):null===i.use&&(o=this._encodeComposite(_t2,s,_r3,a));}return null!==i.explicit&&(o=this._encodeComposite(i.explicit,!1,"context",o)),o;},u.prototype._encodeChoice=function(t,e){var r=this._baseState,n=r.choice[t.type];return n||a(!1,t.type+" not found in "+JSON.stringify(Object.keys(r.choice))),n._encode(t.value,e);},u.prototype._encodePrimitive=function(t,e){var r=this._baseState;if(/str$/.test(t))return this._encodeStr(e,t);if("objid"===t&&r.args)return this._encodeObjid(e,r.reverseArgs[0],r.args[1]);if("objid"===t)return this._encodeObjid(e,null,null);if("gentime"===t||"utctime"===t)return this._encodeTime(e,t);if("null_"===t)return this._encodeNull();if("int"===t||"enum"===t)return this._encodeInt(e,r.args&&r.reverseArgs[0]);if("bool"===t)return this._encodeBool(e);if("objDesc"===t)return this._encodeStr(e,t);throw new Error("Unsupported tag: "+t);},u.prototype._isNumstr=function(t){return /^[0-9 ]*$/.test(t);},u.prototype._isPrintstr=function(t){return /^[A-Za-z0-9 '()+,-./:=?]*$/.test(t);};},{4:4,474:474,7:7}],7:[function(t,e,r){"use strict";var n=t(468);function i(t){this._reporterState={obj:null,path:[],options:t||{},errors:[]};}function o(t,e){this.path=t,this.rethrow(e);}r.Reporter=i,i.prototype.isError=function(t){return t instanceof o;},i.prototype.save=function(){var t=this._reporterState;return{obj:t.obj,pathLen:t.path.length};},i.prototype.restore=function(t){var e=this._reporterState;e.obj=t.obj,e.path=e.path.slice(0,t.pathLen);},i.prototype.enterKey=function(t){return this._reporterState.path.push(t);},i.prototype.exitKey=function(t){var e=this._reporterState;e.path=e.path.slice(0,t-1);},i.prototype.leaveKey=function(t,e,r){var n=this._reporterState;this.exitKey(t),null!==n.obj&&(n.obj[e]=r);},i.prototype.path=function(){return this._reporterState.path.join("/");},i.prototype.enterObject=function(){var t=this._reporterState,e=t.obj;return t.obj={},e;},i.prototype.leaveObject=function(t){var e=this._reporterState,r=e.obj;return e.obj=t,r;},i.prototype.error=function(t){var e;var r=this._reporterState,n=t instanceof o;if(e=n?t:new o(r.path.map(function(t){return"["+JSON.stringify(t)+"]";}).join(""),t.message||t,t.stack),!r.options.partial)throw e;return n||r.errors.push(e),e;},i.prototype.wrapResult=function(t){var e=this._reporterState;return e.options.partial?{result:this.isError(t)?null:t,errors:e.errors}:t;},n(o,Error),o.prototype.rethrow=function(t){if(this.message=t+" at: "+(this.path||"(shallow)"),Error.captureStackTrace&&Error.captureStackTrace(this,o),!this.stack)try{throw new Error(this.message);}catch(t){this.stack=t.stack;}return this;};},{468:468}],8:[function(t,e,r){"use strict";function n(t){var e={};return Object.keys(t).forEach(function(r){(0|r)==r&&(r|=0);var n=t[r];e[n]=r;}),e;}r.tagClass={0:"universal",1:"application",2:"context",3:"private"},r.tagClassByName=n(r.tagClass),r.tag={0:"end",1:"bool",2:"int",3:"bitstr",4:"octstr",5:"null_",6:"objid",7:"objDesc",8:"external",9:"real",10:"enum",11:"embed",12:"utf8str",13:"relativeOid",16:"seq",17:"set",18:"numstr",19:"printstr",20:"t61str",21:"videostr",22:"ia5str",23:"utctime",24:"gentime",25:"graphstr",26:"iso646str",27:"genstr",28:"unistr",29:"charstr",30:"bmpstr"},r.tagByName=n(r.tag);},{}],9:[function(t,e,r){"use strict";var n=r;n._reverse=function(t){var e={};return Object.keys(t).forEach(function(r){(0|r)==r&&(r|=0);var n=t[r];e[n]=r;}),e;},n.der=t(8);},{8:8}],10:[function(t,e,r){"use strict";var n=t(468),i=t(16),o=t(4).DecoderBuffer,a=t(6),s=t(8);function f(t){this.enc="der",this.name=t.name,this.entity=t,this.tree=new u(),this.tree._init(t.body);}function u(t){a.call(this,"der",t);}function c(t,e){var r=t.readUInt8(e);if(t.isError(r))return r;var n=s.tagClass[r>>6],i=0==(32&r);if(31==(31&r)){var _n6=r;for(r=0;128==(128&_n6);){if(_n6=t.readUInt8(e),t.isError(_n6))return _n6;r<<=7,r|=127&_n6;}}else r&=31;return{cls:n,primitive:i,tag:r,tagStr:s.tag[r]};}function h(t,e,r){var n=t.readUInt8(r);if(t.isError(n))return n;if(!e&&128===n)return null;if(0==(128&n))return n;var i=127&n;if(i>4)return t.error("length octect is too long");n=0;for(var _e3=0;_e3<i;_e3++){n<<=8;var _e4=t.readUInt8(r);if(t.isError(_e4))return _e4;n|=_e4;}return n;}e.exports=f,f.prototype.decode=function(t,e){return o.isDecoderBuffer(t)||(t=new o(t,e)),this.tree._decode(t,e);},n(u,a),u.prototype._peekTag=function(t,e,r){if(t.isEmpty())return!1;var n=t.save(),i=c(t,'Failed to peek tag: "'+e+'"');return t.isError(i)?i:(t.restore(n),i.tag===e||i.tagStr===e||i.tagStr+"of"===e||r);},u.prototype._decodeTag=function(t,e,r){var n=c(t,'Failed to decode tag of "'+e+'"');if(t.isError(n))return n;var i=h(t,n.primitive,'Failed to get length of "'+e+'"');if(t.isError(i))return i;if(!r&&n.tag!==e&&n.tagStr!==e&&n.tagStr+"of"!==e)return t.error('Failed to match tag: "'+e+'"');if(n.primitive||null!==i)return t.skip(i,'Failed to match body of: "'+e+'"');var o=t.save(),a=this._skipUntilEnd(t,'Failed to skip indefinite length body: "'+this.tag+'"');return t.isError(a)?a:(i=t.offset-o.offset,t.restore(o),t.skip(i,'Failed to match body of: "'+e+'"'));},u.prototype._skipUntilEnd=function(t,e){for(;;){var _r4=c(t,e);if(t.isError(_r4))return _r4;var _n7=h(t,_r4.primitive,e);if(t.isError(_n7))return _n7;var _i=void 0;if(_i=_r4.primitive||null!==_n7?t.skip(_n7):this._skipUntilEnd(t,e),t.isError(_i))return _i;if("end"===_r4.tagStr)break;}},u.prototype._decodeList=function(t,e,r,n){var i=[];for(;!t.isEmpty();){var _e5=this._peekTag(t,"end");if(t.isError(_e5))return _e5;var _o=r.decode(t,"der",n);if(t.isError(_o)&&_e5)break;i.push(_o);}return i;},u.prototype._decodeStr=function(t,e){if("bitstr"===e){var _e6=t.readUInt8();return t.isError(_e6)?_e6:{unused:_e6,data:t.raw()};}if("bmpstr"===e){var _e7=t.raw();if(_e7.length%2==1)return t.error("Decoding of string type: bmpstr length mismatch");var _r5="";for(var _t3=0;_t3<_e7.length/2;_t3++){_r5+=String.fromCharCode(_e7.readUInt16BE(2*_t3));}return _r5;}if("numstr"===e){var _e8=t.raw().toString("ascii");return this._isNumstr(_e8)?_e8:t.error("Decoding of string type: numstr unsupported characters");}if("octstr"===e)return t.raw();if("objDesc"===e)return t.raw();if("printstr"===e){var _e9=t.raw().toString("ascii");return this._isPrintstr(_e9)?_e9:t.error("Decoding of string type: printstr unsupported characters");}return /str$/.test(e)?t.raw().toString():t.error("Decoding of string type: "+e+" unsupported");},u.prototype._decodeObjid=function(t,e,r){var n;var i=[];var o=0,a=0;for(;!t.isEmpty();){a=t.readUInt8(),o<<=7,o|=127&a,0==(128&a)&&(i.push(o),o=0);}128&a&&i.push(o);var s=i[0]/40|0,f=i[0]%40;if(n=r?i:[s,f].concat(i.slice(1)),e){var _t4=e[n.join(" ")];void 0===_t4&&(_t4=e[n.join(".")]),void 0!==_t4&&(n=_t4);}return n;},u.prototype._decodeTime=function(t,e){var r=t.raw().toString();var n,i,o,a,s,f;if("gentime"===e)n=0|r.slice(0,4),i=0|r.slice(4,6),o=0|r.slice(6,8),a=0|r.slice(8,10),s=0|r.slice(10,12),f=0|r.slice(12,14);else{if("utctime"!==e)return t.error("Decoding "+e+" time is not supported yet");n=0|r.slice(0,2),i=0|r.slice(2,4),o=0|r.slice(4,6),a=0|r.slice(6,8),s=0|r.slice(8,10),f=0|r.slice(10,12),n=n<70?2e3+n:1900+n;}return Date.UTC(n,i-1,o,a,s,f,0);},u.prototype._decodeNull=function(){return null;},u.prototype._decodeBool=function(t){var e=t.readUInt8();return t.isError(e)?e:0!==e;},u.prototype._decodeInt=function(t,e){var r=t.raw();var n=new i(r);return e&&(n=e[n.toString(10)]||n),n;},u.prototype._use=function(t,e){return"function"==typeof t&&(t=t(e)),t._getDecoder("der").tree;};},{16:16,4:4,468:468,6:6,8:8}],11:[function(t,e,r){"use strict";var n=r;n.der=t(10),n.pem=t(12);},{10:10,12:12}],12:[function(t,e,r){"use strict";var n=t(468),i=t(516).Buffer,o=t(10);function a(t){o.call(this,t),this.enc="pem";}n(a,o),e.exports=a,a.prototype.decode=function(t,e){var r=t.toString().split(/[\r\n]+/g),n=e.label.toUpperCase(),a=/^-----(BEGIN|END) ([^-]+)-----$/;var s=-1,f=-1;for(var _t5=0;_t5<r.length;_t5++){var _e10=r[_t5].match(a);if(null!==_e10&&_e10[2]===n){if(-1!==s){if("END"!==_e10[1])break;f=_t5;break;}if("BEGIN"!==_e10[1])break;s=_t5;}}if(-1===s||-1===f)throw new Error("PEM section not found for: "+n);var u=r.slice(s+1,f).join("");u.replace(/[^a-z0-9+/=]+/gi,"");var c=i.from(u,"base64");return o.prototype.decode.call(this,c,e);};},{10:10,468:468,516:516}],13:[function(t,e,r){"use strict";var n=t(468),i=t(516).Buffer,o=t(6),a=t(8);function s(t){this.enc="der",this.name=t.name,this.entity=t,this.tree=new f(),this.tree._init(t.body);}function f(t){o.call(this,"der",t);}function u(t){return t<10?"0"+t:t;}e.exports=s,s.prototype.encode=function(t,e){return this.tree._encode(t,e).join();},n(f,o),f.prototype._encodeComposite=function(t,e,r,n){var o=function(t,e,r,n){var i;"seqof"===t?t="seq":"setof"===t&&(t="set");if(a.tagByName.hasOwnProperty(t))i=a.tagByName[t];else{if("number"!=typeof t||(0|t)!==t)return n.error("Unknown tag: "+t);i=t;}if(i>=31)return n.error("Multi-octet tag encoding unsupported");e||(i|=32);return i|=a.tagClassByName[r||"universal"]<<6,i;}(t,e,r,this.reporter);if(n.length<128){var _t6=i.alloc(2);return _t6[0]=o,_t6[1]=n.length,this._createEncoderBuffer([_t6,n]);}var s=1;for(var _t7=n.length;_t7>=256;_t7>>=8){s++;}var f=i.alloc(2+s);f[0]=o,f[1]=128|s;for(var _t8=1+s,_e11=n.length;_e11>0;_t8--,_e11>>=8){f[_t8]=255&_e11;}return this._createEncoderBuffer([f,n]);},f.prototype._encodeStr=function(t,e){if("bitstr"===e)return this._createEncoderBuffer([0|t.unused,t.data]);if("bmpstr"===e){var _e12=i.alloc(2*t.length);for(var _r6=0;_r6<t.length;_r6++){_e12.writeUInt16BE(t.charCodeAt(_r6),2*_r6);}return this._createEncoderBuffer(_e12);}return"numstr"===e?this._isNumstr(t)?this._createEncoderBuffer(t):this.reporter.error("Encoding of string type: numstr supports only digits and space"):"printstr"===e?this._isPrintstr(t)?this._createEncoderBuffer(t):this.reporter.error("Encoding of string type: printstr supports only latin upper and lower case letters, digits, space, apostrophe, left and rigth parenthesis, plus sign, comma, hyphen, dot, slash, colon, equal sign, question mark"):/str$/.test(e)||"objDesc"===e?this._createEncoderBuffer(t):this.reporter.error("Encoding of string type: "+e+" unsupported");},f.prototype._encodeObjid=function(t,e,r){if("string"==typeof t){if(!e)return this.reporter.error("string objid given, but no values map found");if(!e.hasOwnProperty(t))return this.reporter.error("objid not found in values map");t=e[t].split(/[\s.]+/g);for(var _e13=0;_e13<t.length;_e13++){t[_e13]|=0;}}else if(Array.isArray(t)){t=t.slice();for(var _e14=0;_e14<t.length;_e14++){t[_e14]|=0;}}if(!Array.isArray(t))return this.reporter.error("objid() should be either array or string, got: "+JSON.stringify(t));if(!r){if(t[1]>=40)return this.reporter.error("Second objid identifier OOB");t.splice(0,2,40*t[0]+t[1]);}var n=0;for(var _e15=0;_e15<t.length;_e15++){var _r7=t[_e15];for(n++;_r7>=128;_r7>>=7){n++;}}var o=i.alloc(n);var a=o.length-1;for(var _e16=t.length-1;_e16>=0;_e16--){var _r8=t[_e16];for(o[a--]=127&_r8;(_r8>>=7)>0;){o[a--]=128|127&_r8;}}return this._createEncoderBuffer(o);},f.prototype._encodeTime=function(t,e){var r;var n=new Date(t);return"gentime"===e?r=[u(n.getUTCFullYear()),u(n.getUTCMonth()+1),u(n.getUTCDate()),u(n.getUTCHours()),u(n.getUTCMinutes()),u(n.getUTCSeconds()),"Z"].join(""):"utctime"===e?r=[u(n.getUTCFullYear()%100),u(n.getUTCMonth()+1),u(n.getUTCDate()),u(n.getUTCHours()),u(n.getUTCMinutes()),u(n.getUTCSeconds()),"Z"].join(""):this.reporter.error("Encoding "+e+" time is not supported yet"),this._encodeStr(r,"octstr");},f.prototype._encodeNull=function(){return this._createEncoderBuffer("");},f.prototype._encodeInt=function(t,e){if("string"==typeof t){if(!e)return this.reporter.error("String int or enum given, but no values map");if(!e.hasOwnProperty(t))return this.reporter.error("Values map doesn't contain: "+JSON.stringify(t));t=e[t];}if("number"!=typeof t&&!i.isBuffer(t)){var _e17=t.toArray();!t.sign&&128&_e17[0]&&_e17.unshift(0),t=i.from(_e17);}if(i.isBuffer(t)){var _e18=t.length;0===t.length&&_e18++;var _r9=i.alloc(_e18);return t.copy(_r9),0===t.length&&(_r9[0]=0),this._createEncoderBuffer(_r9);}if(t<128)return this._createEncoderBuffer(t);if(t<256)return this._createEncoderBuffer([0,t]);var r=1;for(var _e19=t;_e19>=256;_e19>>=8){r++;}var n=new Array(r);for(var _e20=n.length-1;_e20>=0;_e20--){n[_e20]=255&t,t>>=8;}return 128&n[0]&&n.unshift(0),this._createEncoderBuffer(i.from(n));},f.prototype._encodeBool=function(t){return this._createEncoderBuffer(t?255:0);},f.prototype._use=function(t,e){return"function"==typeof t&&(t=t(e)),t._getEncoder("der").tree;},f.prototype._skipDefault=function(t,e,r){var n=this._baseState;var i;if(null===n["default"])return!1;var o=t.join();if(void 0===n.defaultBuffer&&(n.defaultBuffer=this._encodeValue(n["default"],e,r).join()),o.length!==n.defaultBuffer.length)return!1;for(i=0;i<o.length;i++){if(o[i]!==n.defaultBuffer[i])return!1;}return!0;};},{468:468,516:516,6:6,8:8}],14:[function(t,e,r){"use strict";var n=r;n.der=t(13),n.pem=t(15);},{13:13,15:15}],15:[function(t,e,r){"use strict";var n=t(468),i=t(13);function o(t){i.call(this,t),this.enc="pem";}n(o,i),e.exports=o,o.prototype.encode=function(t,e){var r=i.prototype.encode.call(this,t).toString("base64"),n=["-----BEGIN "+e.label+"-----"];for(var _t9=0;_t9<r.length;_t9+=64){n.push(r.slice(_t9,_t9+64));}return n.push("-----END "+e.label+"-----"),n.join("\n");};},{13:13,468:468}],16:[function(t,e,r){!function(e,r){"use strict";function n(t,e){if(!t)throw new Error(e||"Assertion failed");}function i(t,e){t.super_=e;var r=function r(){};r.prototype=e.prototype,t.prototype=new r(),t.prototype.constructor=t;}function o(t,e,r){if(o.isBN(t))return t;this.negative=0,this.words=null,this.length=0,this.red=null,null!==t&&("le"!==e&&"be"!==e||(r=e,e=10),this._init(t||0,e||10,r||"be"));}var a;"object"==_typeof(e)?e.exports=o:r.BN=o,o.BN=o,o.wordSize=26;try{a=t(21).Buffer;}catch(t){}function s(t,e,r){for(var n=0,i=Math.min(t.length,r),o=e;o<i;o++){var a=t.charCodeAt(o)-48;n<<=4,n|=a>=49&&a<=54?a-49+10:a>=17&&a<=22?a-17+10:15&a;}return n;}function f(t,e,r,n){for(var i=0,o=Math.min(t.length,r),a=e;a<o;a++){var s=t.charCodeAt(a)-48;i*=n,i+=s>=49?s-49+10:s>=17?s-17+10:s;}return i;}o.isBN=function(t){return t instanceof o||null!==t&&"object"==_typeof(t)&&t.constructor.wordSize===o.wordSize&&Array.isArray(t.words);},o.max=function(t,e){return t.cmp(e)>0?t:e;},o.min=function(t,e){return t.cmp(e)<0?t:e;},o.prototype._init=function(t,e,r){if("number"==typeof t)return this._initNumber(t,e,r);if("object"==_typeof(t))return this._initArray(t,e,r);"hex"===e&&(e=16),n(e===(0|e)&&e>=2&&e<=36);var i=0;"-"===(t=t.toString().replace(/\s+/g,""))[0]&&i++,16===e?this._parseHex(t,i):this._parseBase(t,e,i),"-"===t[0]&&(this.negative=1),this.strip(),"le"===r&&this._initArray(this.toArray(),e,r);},o.prototype._initNumber=function(t,e,r){t<0&&(this.negative=1,t=-t),t<67108864?(this.words=[67108863&t],this.length=1):t<4503599627370496?(this.words=[67108863&t,t/67108864&67108863],this.length=2):(n(t<9007199254740992),this.words=[67108863&t,t/67108864&67108863,1],this.length=3),"le"===r&&this._initArray(this.toArray(),e,r);},o.prototype._initArray=function(t,e,r){if(n("number"==typeof t.length),t.length<=0)return this.words=[0],this.length=1,this;this.length=Math.ceil(t.length/3),this.words=new Array(this.length);for(var i=0;i<this.length;i++){this.words[i]=0;}var o,a,s=0;if("be"===r)for(i=t.length-1,o=0;i>=0;i-=3){a=t[i]|t[i-1]<<8|t[i-2]<<16,this.words[o]|=a<<s&67108863,this.words[o+1]=a>>>26-s&67108863,(s+=24)>=26&&(s-=26,o++);}else if("le"===r)for(i=0,o=0;i<t.length;i+=3){a=t[i]|t[i+1]<<8|t[i+2]<<16,this.words[o]|=a<<s&67108863,this.words[o+1]=a>>>26-s&67108863,(s+=24)>=26&&(s-=26,o++);}return this.strip();},o.prototype._parseHex=function(t,e){this.length=Math.ceil((t.length-e)/6),this.words=new Array(this.length);for(var r=0;r<this.length;r++){this.words[r]=0;}var n,i,o=0;for(r=t.length-6,n=0;r>=e;r-=6){i=s(t,r,r+6),this.words[n]|=i<<o&67108863,this.words[n+1]|=i>>>26-o&4194303,(o+=24)>=26&&(o-=26,n++);}r+6!==e&&(i=s(t,e,r+6),this.words[n]|=i<<o&67108863,this.words[n+1]|=i>>>26-o&4194303),this.strip();},o.prototype._parseBase=function(t,e,r){this.words=[0],this.length=1;for(var n=0,i=1;i<=67108863;i*=e){n++;}n--,i=i/e|0;for(var o=t.length-r,a=o%n,s=Math.min(o,o-a)+r,u=0,c=r;c<s;c+=n){u=f(t,c,c+n,e),this.imuln(i),this.words[0]+u<67108864?this.words[0]+=u:this._iaddn(u);}if(0!==a){var h=1;for(u=f(t,c,t.length,e),c=0;c<a;c++){h*=e;}this.imuln(h),this.words[0]+u<67108864?this.words[0]+=u:this._iaddn(u);}},o.prototype.copy=function(t){t.words=new Array(this.length);for(var e=0;e<this.length;e++){t.words[e]=this.words[e];}t.length=this.length,t.negative=this.negative,t.red=this.red;},o.prototype.clone=function(){var t=new o(null);return this.copy(t),t;},o.prototype._expand=function(t){for(;this.length<t;){this.words[this.length++]=0;}return this;},o.prototype.strip=function(){for(;this.length>1&&0===this.words[this.length-1];){this.length--;}return this._normSign();},o.prototype._normSign=function(){return 1===this.length&&0===this.words[0]&&(this.negative=0),this;},o.prototype.inspect=function(){return(this.red?"<BN-R: ":"<BN: ")+this.toString(16)+">";};var u=["","0","00","000","0000","00000","000000","0000000","00000000","000000000","0000000000","00000000000","000000000000","0000000000000","00000000000000","000000000000000","0000000000000000","00000000000000000","000000000000000000","0000000000000000000","00000000000000000000","000000000000000000000","0000000000000000000000","00000000000000000000000","000000000000000000000000","0000000000000000000000000"],c=[0,0,25,16,12,11,10,9,8,8,7,7,7,7,6,6,6,6,6,6,6,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],h=[0,0,33554432,43046721,16777216,48828125,60466176,40353607,16777216,43046721,1e7,19487171,35831808,62748517,7529536,11390625,16777216,24137569,34012224,47045881,64e6,4084101,5153632,6436343,7962624,9765625,11881376,14348907,17210368,20511149,243e5,28629151,33554432,39135393,45435424,52521875,60466176];function d(t,e,r){r.negative=e.negative^t.negative;var n=t.length+e.length|0;r.length=n,n=n-1|0;var i=0|t.words[0],o=0|e.words[0],a=i*o,s=67108863&a,f=a/67108864|0;r.words[0]=s;for(var u=1;u<n;u++){for(var c=f>>>26,h=67108863&f,d=Math.min(u,e.length-1),l=Math.max(0,u-t.length+1);l<=d;l++){var p=u-l|0;c+=(a=(i=0|t.words[p])*(o=0|e.words[l])+h)/67108864|0,h=67108863&a;}r.words[u]=0|h,f=0|c;}return 0!==f?r.words[u]=0|f:r.length--,r.strip();}o.prototype.toString=function(t,e){var r;if(e=0|e||1,16===(t=t||10)||"hex"===t){r="";for(var i=0,o=0,a=0;a<this.length;a++){var s=this.words[a],f=(16777215&(s<<i|o)).toString(16);r=0!==(o=s>>>24-i&16777215)||a!==this.length-1?u[6-f.length]+f+r:f+r,(i+=2)>=26&&(i-=26,a--);}for(0!==o&&(r=o.toString(16)+r);r.length%e!=0;){r="0"+r;}return 0!==this.negative&&(r="-"+r),r;}if(t===(0|t)&&t>=2&&t<=36){var d=c[t],l=h[t];r="";var p=this.clone();for(p.negative=0;!p.isZero();){var b=p.modn(l).toString(t);r=(p=p.idivn(l)).isZero()?b+r:u[d-b.length]+b+r;}for(this.isZero()&&(r="0"+r);r.length%e!=0;){r="0"+r;}return 0!==this.negative&&(r="-"+r),r;}n(!1,"Base should be between 2 and 36");},o.prototype.toNumber=function(){var t=this.words[0];return 2===this.length?t+=67108864*this.words[1]:3===this.length&&1===this.words[2]?t+=4503599627370496+67108864*this.words[1]:this.length>2&&n(!1,"Number can only safely store up to 53 bits"),0!==this.negative?-t:t;},o.prototype.toJSON=function(){return this.toString(16);},o.prototype.toBuffer=function(t,e){return n(void 0!==a),this.toArrayLike(a,t,e);},o.prototype.toArray=function(t,e){return this.toArrayLike(Array,t,e);},o.prototype.toArrayLike=function(t,e,r){var i=this.byteLength(),o=r||Math.max(1,i);n(i<=o,"byte array longer than desired length"),n(o>0,"Requested array length <= 0"),this.strip();var a,s,f="le"===e,u=new t(o),c=this.clone();if(f){for(s=0;!c.isZero();s++){a=c.andln(255),c.iushrn(8),u[s]=a;}for(;s<o;s++){u[s]=0;}}else{for(s=0;s<o-i;s++){u[s]=0;}for(s=0;!c.isZero();s++){a=c.andln(255),c.iushrn(8),u[o-s-1]=a;}}return u;},Math.clz32?o.prototype._countBits=function(t){return 32-Math.clz32(t);}:o.prototype._countBits=function(t){var e=t,r=0;return e>=4096&&(r+=13,e>>>=13),e>=64&&(r+=7,e>>>=7),e>=8&&(r+=4,e>>>=4),e>=2&&(r+=2,e>>>=2),r+e;},o.prototype._zeroBits=function(t){if(0===t)return 26;var e=t,r=0;return 0==(8191&e)&&(r+=13,e>>>=13),0==(127&e)&&(r+=7,e>>>=7),0==(15&e)&&(r+=4,e>>>=4),0==(3&e)&&(r+=2,e>>>=2),0==(1&e)&&r++,r;},o.prototype.bitLength=function(){var t=this.words[this.length-1],e=this._countBits(t);return 26*(this.length-1)+e;},o.prototype.zeroBits=function(){if(this.isZero())return 0;for(var t=0,e=0;e<this.length;e++){var r=this._zeroBits(this.words[e]);if(t+=r,26!==r)break;}return t;},o.prototype.byteLength=function(){return Math.ceil(this.bitLength()/8);},o.prototype.toTwos=function(t){return 0!==this.negative?this.abs().inotn(t).iaddn(1):this.clone();},o.prototype.fromTwos=function(t){return this.testn(t-1)?this.notn(t).iaddn(1).ineg():this.clone();},o.prototype.isNeg=function(){return 0!==this.negative;},o.prototype.neg=function(){return this.clone().ineg();},o.prototype.ineg=function(){return this.isZero()||(this.negative^=1),this;},o.prototype.iuor=function(t){for(;this.length<t.length;){this.words[this.length++]=0;}for(var e=0;e<t.length;e++){this.words[e]=this.words[e]|t.words[e];}return this.strip();},o.prototype.ior=function(t){return n(0==(this.negative|t.negative)),this.iuor(t);},o.prototype.or=function(t){return this.length>t.length?this.clone().ior(t):t.clone().ior(this);},o.prototype.uor=function(t){return this.length>t.length?this.clone().iuor(t):t.clone().iuor(this);},o.prototype.iuand=function(t){var e;e=this.length>t.length?t:this;for(var r=0;r<e.length;r++){this.words[r]=this.words[r]&t.words[r];}return this.length=e.length,this.strip();},o.prototype.iand=function(t){return n(0==(this.negative|t.negative)),this.iuand(t);},o.prototype.and=function(t){return this.length>t.length?this.clone().iand(t):t.clone().iand(this);},o.prototype.uand=function(t){return this.length>t.length?this.clone().iuand(t):t.clone().iuand(this);},o.prototype.iuxor=function(t){var e,r;this.length>t.length?(e=this,r=t):(e=t,r=this);for(var n=0;n<r.length;n++){this.words[n]=e.words[n]^r.words[n];}if(this!==e)for(;n<e.length;n++){this.words[n]=e.words[n];}return this.length=e.length,this.strip();},o.prototype.ixor=function(t){return n(0==(this.negative|t.negative)),this.iuxor(t);},o.prototype.xor=function(t){return this.length>t.length?this.clone().ixor(t):t.clone().ixor(this);},o.prototype.uxor=function(t){return this.length>t.length?this.clone().iuxor(t):t.clone().iuxor(this);},o.prototype.inotn=function(t){n("number"==typeof t&&t>=0);var e=0|Math.ceil(t/26),r=t%26;this._expand(e),r>0&&e--;for(var i=0;i<e;i++){this.words[i]=67108863&~this.words[i];}return r>0&&(this.words[i]=~this.words[i]&67108863>>26-r),this.strip();},o.prototype.notn=function(t){return this.clone().inotn(t);},o.prototype.setn=function(t,e){n("number"==typeof t&&t>=0);var r=t/26|0,i=t%26;return this._expand(r+1),this.words[r]=e?this.words[r]|1<<i:this.words[r]&~(1<<i),this.strip();},o.prototype.iadd=function(t){var e,r,n;if(0!==this.negative&&0===t.negative)return this.negative=0,e=this.isub(t),this.negative^=1,this._normSign();if(0===this.negative&&0!==t.negative)return t.negative=0,e=this.isub(t),t.negative=1,e._normSign();this.length>t.length?(r=this,n=t):(r=t,n=this);for(var i=0,o=0;o<n.length;o++){e=(0|r.words[o])+(0|n.words[o])+i,this.words[o]=67108863&e,i=e>>>26;}for(;0!==i&&o<r.length;o++){e=(0|r.words[o])+i,this.words[o]=67108863&e,i=e>>>26;}if(this.length=r.length,0!==i)this.words[this.length]=i,this.length++;else if(r!==this)for(;o<r.length;o++){this.words[o]=r.words[o];}return this;},o.prototype.add=function(t){var e;return 0!==t.negative&&0===this.negative?(t.negative=0,e=this.sub(t),t.negative^=1,e):0===t.negative&&0!==this.negative?(this.negative=0,e=t.sub(this),this.negative=1,e):this.length>t.length?this.clone().iadd(t):t.clone().iadd(this);},o.prototype.isub=function(t){if(0!==t.negative){t.negative=0;var e=this.iadd(t);return t.negative=1,e._normSign();}if(0!==this.negative)return this.negative=0,this.iadd(t),this.negative=1,this._normSign();var r,n,i=this.cmp(t);if(0===i)return this.negative=0,this.length=1,this.words[0]=0,this;i>0?(r=this,n=t):(r=t,n=this);for(var o=0,a=0;a<n.length;a++){o=(e=(0|r.words[a])-(0|n.words[a])+o)>>26,this.words[a]=67108863&e;}for(;0!==o&&a<r.length;a++){o=(e=(0|r.words[a])+o)>>26,this.words[a]=67108863&e;}if(0===o&&a<r.length&&r!==this)for(;a<r.length;a++){this.words[a]=r.words[a];}return this.length=Math.max(this.length,a),r!==this&&(this.negative=1),this.strip();},o.prototype.sub=function(t){return this.clone().isub(t);};var l=function l(t,e,r){var n,i,o,a=t.words,s=e.words,f=r.words,u=0,c=0|a[0],h=8191&c,d=c>>>13,l=0|a[1],p=8191&l,b=l>>>13,v=0|a[2],g=8191&v,y=v>>>13,m=0|a[3],w=8191&m,_=m>>>13,S=0|a[4],M=8191&S,E=S>>>13,k=0|a[5],x=8191&k,A=k>>>13,R=0|a[6],T=8191&R,I=R>>>13,B=0|a[7],P=8191&B,O=B>>>13,C=0|a[8],L=8191&C,j=C>>>13,N=0|a[9],D=8191&N,U=N>>>13,F=0|s[0],q=8191&F,z=F>>>13,W=0|s[1],V=8191&W,H=W>>>13,G=0|s[2],K=8191&G,X=G>>>13,Z=0|s[3],Y=8191&Z,J=Z>>>13,$=0|s[4],Q=8191&$,tt=$>>>13,et=0|s[5],rt=8191&et,nt=et>>>13,it=0|s[6],ot=8191&it,at=it>>>13,st=0|s[7],ft=8191&st,ut=st>>>13,ct=0|s[8],ht=8191&ct,dt=ct>>>13,lt=0|s[9],pt=8191&lt,bt=lt>>>13;r.negative=t.negative^e.negative,r.length=19;var vt=(u+(n=Math.imul(h,q))|0)+((8191&(i=(i=Math.imul(h,z))+Math.imul(d,q)|0))<<13)|0;u=((o=Math.imul(d,z))+(i>>>13)|0)+(vt>>>26)|0,vt&=67108863,n=Math.imul(p,q),i=(i=Math.imul(p,z))+Math.imul(b,q)|0,o=Math.imul(b,z);var gt=(u+(n=n+Math.imul(h,V)|0)|0)+((8191&(i=(i=i+Math.imul(h,H)|0)+Math.imul(d,V)|0))<<13)|0;u=((o=o+Math.imul(d,H)|0)+(i>>>13)|0)+(gt>>>26)|0,gt&=67108863,n=Math.imul(g,q),i=(i=Math.imul(g,z))+Math.imul(y,q)|0,o=Math.imul(y,z),n=n+Math.imul(p,V)|0,i=(i=i+Math.imul(p,H)|0)+Math.imul(b,V)|0,o=o+Math.imul(b,H)|0;var yt=(u+(n=n+Math.imul(h,K)|0)|0)+((8191&(i=(i=i+Math.imul(h,X)|0)+Math.imul(d,K)|0))<<13)|0;u=((o=o+Math.imul(d,X)|0)+(i>>>13)|0)+(yt>>>26)|0,yt&=67108863,n=Math.imul(w,q),i=(i=Math.imul(w,z))+Math.imul(_,q)|0,o=Math.imul(_,z),n=n+Math.imul(g,V)|0,i=(i=i+Math.imul(g,H)|0)+Math.imul(y,V)|0,o=o+Math.imul(y,H)|0,n=n+Math.imul(p,K)|0,i=(i=i+Math.imul(p,X)|0)+Math.imul(b,K)|0,o=o+Math.imul(b,X)|0;var mt=(u+(n=n+Math.imul(h,Y)|0)|0)+((8191&(i=(i=i+Math.imul(h,J)|0)+Math.imul(d,Y)|0))<<13)|0;u=((o=o+Math.imul(d,J)|0)+(i>>>13)|0)+(mt>>>26)|0,mt&=67108863,n=Math.imul(M,q),i=(i=Math.imul(M,z))+Math.imul(E,q)|0,o=Math.imul(E,z),n=n+Math.imul(w,V)|0,i=(i=i+Math.imul(w,H)|0)+Math.imul(_,V)|0,o=o+Math.imul(_,H)|0,n=n+Math.imul(g,K)|0,i=(i=i+Math.imul(g,X)|0)+Math.imul(y,K)|0,o=o+Math.imul(y,X)|0,n=n+Math.imul(p,Y)|0,i=(i=i+Math.imul(p,J)|0)+Math.imul(b,Y)|0,o=o+Math.imul(b,J)|0;var wt=(u+(n=n+Math.imul(h,Q)|0)|0)+((8191&(i=(i=i+Math.imul(h,tt)|0)+Math.imul(d,Q)|0))<<13)|0;u=((o=o+Math.imul(d,tt)|0)+(i>>>13)|0)+(wt>>>26)|0,wt&=67108863,n=Math.imul(x,q),i=(i=Math.imul(x,z))+Math.imul(A,q)|0,o=Math.imul(A,z),n=n+Math.imul(M,V)|0,i=(i=i+Math.imul(M,H)|0)+Math.imul(E,V)|0,o=o+Math.imul(E,H)|0,n=n+Math.imul(w,K)|0,i=(i=i+Math.imul(w,X)|0)+Math.imul(_,K)|0,o=o+Math.imul(_,X)|0,n=n+Math.imul(g,Y)|0,i=(i=i+Math.imul(g,J)|0)+Math.imul(y,Y)|0,o=o+Math.imul(y,J)|0,n=n+Math.imul(p,Q)|0,i=(i=i+Math.imul(p,tt)|0)+Math.imul(b,Q)|0,o=o+Math.imul(b,tt)|0;var _t=(u+(n=n+Math.imul(h,rt)|0)|0)+((8191&(i=(i=i+Math.imul(h,nt)|0)+Math.imul(d,rt)|0))<<13)|0;u=((o=o+Math.imul(d,nt)|0)+(i>>>13)|0)+(_t>>>26)|0,_t&=67108863,n=Math.imul(T,q),i=(i=Math.imul(T,z))+Math.imul(I,q)|0,o=Math.imul(I,z),n=n+Math.imul(x,V)|0,i=(i=i+Math.imul(x,H)|0)+Math.imul(A,V)|0,o=o+Math.imul(A,H)|0,n=n+Math.imul(M,K)|0,i=(i=i+Math.imul(M,X)|0)+Math.imul(E,K)|0,o=o+Math.imul(E,X)|0,n=n+Math.imul(w,Y)|0,i=(i=i+Math.imul(w,J)|0)+Math.imul(_,Y)|0,o=o+Math.imul(_,J)|0,n=n+Math.imul(g,Q)|0,i=(i=i+Math.imul(g,tt)|0)+Math.imul(y,Q)|0,o=o+Math.imul(y,tt)|0,n=n+Math.imul(p,rt)|0,i=(i=i+Math.imul(p,nt)|0)+Math.imul(b,rt)|0,o=o+Math.imul(b,nt)|0;var St=(u+(n=n+Math.imul(h,ot)|0)|0)+((8191&(i=(i=i+Math.imul(h,at)|0)+Math.imul(d,ot)|0))<<13)|0;u=((o=o+Math.imul(d,at)|0)+(i>>>13)|0)+(St>>>26)|0,St&=67108863,n=Math.imul(P,q),i=(i=Math.imul(P,z))+Math.imul(O,q)|0,o=Math.imul(O,z),n=n+Math.imul(T,V)|0,i=(i=i+Math.imul(T,H)|0)+Math.imul(I,V)|0,o=o+Math.imul(I,H)|0,n=n+Math.imul(x,K)|0,i=(i=i+Math.imul(x,X)|0)+Math.imul(A,K)|0,o=o+Math.imul(A,X)|0,n=n+Math.imul(M,Y)|0,i=(i=i+Math.imul(M,J)|0)+Math.imul(E,Y)|0,o=o+Math.imul(E,J)|0,n=n+Math.imul(w,Q)|0,i=(i=i+Math.imul(w,tt)|0)+Math.imul(_,Q)|0,o=o+Math.imul(_,tt)|0,n=n+Math.imul(g,rt)|0,i=(i=i+Math.imul(g,nt)|0)+Math.imul(y,rt)|0,o=o+Math.imul(y,nt)|0,n=n+Math.imul(p,ot)|0,i=(i=i+Math.imul(p,at)|0)+Math.imul(b,ot)|0,o=o+Math.imul(b,at)|0;var Mt=(u+(n=n+Math.imul(h,ft)|0)|0)+((8191&(i=(i=i+Math.imul(h,ut)|0)+Math.imul(d,ft)|0))<<13)|0;u=((o=o+Math.imul(d,ut)|0)+(i>>>13)|0)+(Mt>>>26)|0,Mt&=67108863,n=Math.imul(L,q),i=(i=Math.imul(L,z))+Math.imul(j,q)|0,o=Math.imul(j,z),n=n+Math.imul(P,V)|0,i=(i=i+Math.imul(P,H)|0)+Math.imul(O,V)|0,o=o+Math.imul(O,H)|0,n=n+Math.imul(T,K)|0,i=(i=i+Math.imul(T,X)|0)+Math.imul(I,K)|0,o=o+Math.imul(I,X)|0,n=n+Math.imul(x,Y)|0,i=(i=i+Math.imul(x,J)|0)+Math.imul(A,Y)|0,o=o+Math.imul(A,J)|0,n=n+Math.imul(M,Q)|0,i=(i=i+Math.imul(M,tt)|0)+Math.imul(E,Q)|0,o=o+Math.imul(E,tt)|0,n=n+Math.imul(w,rt)|0,i=(i=i+Math.imul(w,nt)|0)+Math.imul(_,rt)|0,o=o+Math.imul(_,nt)|0,n=n+Math.imul(g,ot)|0,i=(i=i+Math.imul(g,at)|0)+Math.imul(y,ot)|0,o=o+Math.imul(y,at)|0,n=n+Math.imul(p,ft)|0,i=(i=i+Math.imul(p,ut)|0)+Math.imul(b,ft)|0,o=o+Math.imul(b,ut)|0;var Et=(u+(n=n+Math.imul(h,ht)|0)|0)+((8191&(i=(i=i+Math.imul(h,dt)|0)+Math.imul(d,ht)|0))<<13)|0;u=((o=o+Math.imul(d,dt)|0)+(i>>>13)|0)+(Et>>>26)|0,Et&=67108863,n=Math.imul(D,q),i=(i=Math.imul(D,z))+Math.imul(U,q)|0,o=Math.imul(U,z),n=n+Math.imul(L,V)|0,i=(i=i+Math.imul(L,H)|0)+Math.imul(j,V)|0,o=o+Math.imul(j,H)|0,n=n+Math.imul(P,K)|0,i=(i=i+Math.imul(P,X)|0)+Math.imul(O,K)|0,o=o+Math.imul(O,X)|0,n=n+Math.imul(T,Y)|0,i=(i=i+Math.imul(T,J)|0)+Math.imul(I,Y)|0,o=o+Math.imul(I,J)|0,n=n+Math.imul(x,Q)|0,i=(i=i+Math.imul(x,tt)|0)+Math.imul(A,Q)|0,o=o+Math.imul(A,tt)|0,n=n+Math.imul(M,rt)|0,i=(i=i+Math.imul(M,nt)|0)+Math.imul(E,rt)|0,o=o+Math.imul(E,nt)|0,n=n+Math.imul(w,ot)|0,i=(i=i+Math.imul(w,at)|0)+Math.imul(_,ot)|0,o=o+Math.imul(_,at)|0,n=n+Math.imul(g,ft)|0,i=(i=i+Math.imul(g,ut)|0)+Math.imul(y,ft)|0,o=o+Math.imul(y,ut)|0,n=n+Math.imul(p,ht)|0,i=(i=i+Math.imul(p,dt)|0)+Math.imul(b,ht)|0,o=o+Math.imul(b,dt)|0;var kt=(u+(n=n+Math.imul(h,pt)|0)|0)+((8191&(i=(i=i+Math.imul(h,bt)|0)+Math.imul(d,pt)|0))<<13)|0;u=((o=o+Math.imul(d,bt)|0)+(i>>>13)|0)+(kt>>>26)|0,kt&=67108863,n=Math.imul(D,V),i=(i=Math.imul(D,H))+Math.imul(U,V)|0,o=Math.imul(U,H),n=n+Math.imul(L,K)|0,i=(i=i+Math.imul(L,X)|0)+Math.imul(j,K)|0,o=o+Math.imul(j,X)|0,n=n+Math.imul(P,Y)|0,i=(i=i+Math.imul(P,J)|0)+Math.imul(O,Y)|0,o=o+Math.imul(O,J)|0,n=n+Math.imul(T,Q)|0,i=(i=i+Math.imul(T,tt)|0)+Math.imul(I,Q)|0,o=o+Math.imul(I,tt)|0,n=n+Math.imul(x,rt)|0,i=(i=i+Math.imul(x,nt)|0)+Math.imul(A,rt)|0,o=o+Math.imul(A,nt)|0,n=n+Math.imul(M,ot)|0,i=(i=i+Math.imul(M,at)|0)+Math.imul(E,ot)|0,o=o+Math.imul(E,at)|0,n=n+Math.imul(w,ft)|0,i=(i=i+Math.imul(w,ut)|0)+Math.imul(_,ft)|0,o=o+Math.imul(_,ut)|0,n=n+Math.imul(g,ht)|0,i=(i=i+Math.imul(g,dt)|0)+Math.imul(y,ht)|0,o=o+Math.imul(y,dt)|0;var xt=(u+(n=n+Math.imul(p,pt)|0)|0)+((8191&(i=(i=i+Math.imul(p,bt)|0)+Math.imul(b,pt)|0))<<13)|0;u=((o=o+Math.imul(b,bt)|0)+(i>>>13)|0)+(xt>>>26)|0,xt&=67108863,n=Math.imul(D,K),i=(i=Math.imul(D,X))+Math.imul(U,K)|0,o=Math.imul(U,X),n=n+Math.imul(L,Y)|0,i=(i=i+Math.imul(L,J)|0)+Math.imul(j,Y)|0,o=o+Math.imul(j,J)|0,n=n+Math.imul(P,Q)|0,i=(i=i+Math.imul(P,tt)|0)+Math.imul(O,Q)|0,o=o+Math.imul(O,tt)|0,n=n+Math.imul(T,rt)|0,i=(i=i+Math.imul(T,nt)|0)+Math.imul(I,rt)|0,o=o+Math.imul(I,nt)|0,n=n+Math.imul(x,ot)|0,i=(i=i+Math.imul(x,at)|0)+Math.imul(A,ot)|0,o=o+Math.imul(A,at)|0,n=n+Math.imul(M,ft)|0,i=(i=i+Math.imul(M,ut)|0)+Math.imul(E,ft)|0,o=o+Math.imul(E,ut)|0,n=n+Math.imul(w,ht)|0,i=(i=i+Math.imul(w,dt)|0)+Math.imul(_,ht)|0,o=o+Math.imul(_,dt)|0;var At=(u+(n=n+Math.imul(g,pt)|0)|0)+((8191&(i=(i=i+Math.imul(g,bt)|0)+Math.imul(y,pt)|0))<<13)|0;u=((o=o+Math.imul(y,bt)|0)+(i>>>13)|0)+(At>>>26)|0,At&=67108863,n=Math.imul(D,Y),i=(i=Math.imul(D,J))+Math.imul(U,Y)|0,o=Math.imul(U,J),n=n+Math.imul(L,Q)|0,i=(i=i+Math.imul(L,tt)|0)+Math.imul(j,Q)|0,o=o+Math.imul(j,tt)|0,n=n+Math.imul(P,rt)|0,i=(i=i+Math.imul(P,nt)|0)+Math.imul(O,rt)|0,o=o+Math.imul(O,nt)|0,n=n+Math.imul(T,ot)|0,i=(i=i+Math.imul(T,at)|0)+Math.imul(I,ot)|0,o=o+Math.imul(I,at)|0,n=n+Math.imul(x,ft)|0,i=(i=i+Math.imul(x,ut)|0)+Math.imul(A,ft)|0,o=o+Math.imul(A,ut)|0,n=n+Math.imul(M,ht)|0,i=(i=i+Math.imul(M,dt)|0)+Math.imul(E,ht)|0,o=o+Math.imul(E,dt)|0;var Rt=(u+(n=n+Math.imul(w,pt)|0)|0)+((8191&(i=(i=i+Math.imul(w,bt)|0)+Math.imul(_,pt)|0))<<13)|0;u=((o=o+Math.imul(_,bt)|0)+(i>>>13)|0)+(Rt>>>26)|0,Rt&=67108863,n=Math.imul(D,Q),i=(i=Math.imul(D,tt))+Math.imul(U,Q)|0,o=Math.imul(U,tt),n=n+Math.imul(L,rt)|0,i=(i=i+Math.imul(L,nt)|0)+Math.imul(j,rt)|0,o=o+Math.imul(j,nt)|0,n=n+Math.imul(P,ot)|0,i=(i=i+Math.imul(P,at)|0)+Math.imul(O,ot)|0,o=o+Math.imul(O,at)|0,n=n+Math.imul(T,ft)|0,i=(i=i+Math.imul(T,ut)|0)+Math.imul(I,ft)|0,o=o+Math.imul(I,ut)|0,n=n+Math.imul(x,ht)|0,i=(i=i+Math.imul(x,dt)|0)+Math.imul(A,ht)|0,o=o+Math.imul(A,dt)|0;var Tt=(u+(n=n+Math.imul(M,pt)|0)|0)+((8191&(i=(i=i+Math.imul(M,bt)|0)+Math.imul(E,pt)|0))<<13)|0;u=((o=o+Math.imul(E,bt)|0)+(i>>>13)|0)+(Tt>>>26)|0,Tt&=67108863,n=Math.imul(D,rt),i=(i=Math.imul(D,nt))+Math.imul(U,rt)|0,o=Math.imul(U,nt),n=n+Math.imul(L,ot)|0,i=(i=i+Math.imul(L,at)|0)+Math.imul(j,ot)|0,o=o+Math.imul(j,at)|0,n=n+Math.imul(P,ft)|0,i=(i=i+Math.imul(P,ut)|0)+Math.imul(O,ft)|0,o=o+Math.imul(O,ut)|0,n=n+Math.imul(T,ht)|0,i=(i=i+Math.imul(T,dt)|0)+Math.imul(I,ht)|0,o=o+Math.imul(I,dt)|0;var It=(u+(n=n+Math.imul(x,pt)|0)|0)+((8191&(i=(i=i+Math.imul(x,bt)|0)+Math.imul(A,pt)|0))<<13)|0;u=((o=o+Math.imul(A,bt)|0)+(i>>>13)|0)+(It>>>26)|0,It&=67108863,n=Math.imul(D,ot),i=(i=Math.imul(D,at))+Math.imul(U,ot)|0,o=Math.imul(U,at),n=n+Math.imul(L,ft)|0,i=(i=i+Math.imul(L,ut)|0)+Math.imul(j,ft)|0,o=o+Math.imul(j,ut)|0,n=n+Math.imul(P,ht)|0,i=(i=i+Math.imul(P,dt)|0)+Math.imul(O,ht)|0,o=o+Math.imul(O,dt)|0;var Bt=(u+(n=n+Math.imul(T,pt)|0)|0)+((8191&(i=(i=i+Math.imul(T,bt)|0)+Math.imul(I,pt)|0))<<13)|0;u=((o=o+Math.imul(I,bt)|0)+(i>>>13)|0)+(Bt>>>26)|0,Bt&=67108863,n=Math.imul(D,ft),i=(i=Math.imul(D,ut))+Math.imul(U,ft)|0,o=Math.imul(U,ut),n=n+Math.imul(L,ht)|0,i=(i=i+Math.imul(L,dt)|0)+Math.imul(j,ht)|0,o=o+Math.imul(j,dt)|0;var Pt=(u+(n=n+Math.imul(P,pt)|0)|0)+((8191&(i=(i=i+Math.imul(P,bt)|0)+Math.imul(O,pt)|0))<<13)|0;u=((o=o+Math.imul(O,bt)|0)+(i>>>13)|0)+(Pt>>>26)|0,Pt&=67108863,n=Math.imul(D,ht),i=(i=Math.imul(D,dt))+Math.imul(U,ht)|0,o=Math.imul(U,dt);var Ot=(u+(n=n+Math.imul(L,pt)|0)|0)+((8191&(i=(i=i+Math.imul(L,bt)|0)+Math.imul(j,pt)|0))<<13)|0;u=((o=o+Math.imul(j,bt)|0)+(i>>>13)|0)+(Ot>>>26)|0,Ot&=67108863;var Ct=(u+(n=Math.imul(D,pt))|0)+((8191&(i=(i=Math.imul(D,bt))+Math.imul(U,pt)|0))<<13)|0;return u=((o=Math.imul(U,bt))+(i>>>13)|0)+(Ct>>>26)|0,Ct&=67108863,f[0]=vt,f[1]=gt,f[2]=yt,f[3]=mt,f[4]=wt,f[5]=_t,f[6]=St,f[7]=Mt,f[8]=Et,f[9]=kt,f[10]=xt,f[11]=At,f[12]=Rt,f[13]=Tt,f[14]=It,f[15]=Bt,f[16]=Pt,f[17]=Ot,f[18]=Ct,0!==u&&(f[19]=u,r.length++),r;};function p(t,e,r){return new b().mulp(t,e,r);}function b(t,e){this.x=t,this.y=e;}Math.imul||(l=d),o.prototype.mulTo=function(t,e){var r=this.length+t.length;return 10===this.length&&10===t.length?l(this,t,e):r<63?d(this,t,e):r<1024?function(t,e,r){r.negative=e.negative^t.negative,r.length=t.length+e.length;for(var n=0,i=0,o=0;o<r.length-1;o++){var a=i;i=0;for(var s=67108863&n,f=Math.min(o,e.length-1),u=Math.max(0,o-t.length+1);u<=f;u++){var c=o-u,h=(0|t.words[c])*(0|e.words[u]),d=67108863&h;s=67108863&(d=d+s|0),i+=(a=(a=a+(h/67108864|0)|0)+(d>>>26)|0)>>>26,a&=67108863;}r.words[o]=s,n=a,a=i;}return 0!==n?r.words[o]=n:r.length--,r.strip();}(this,t,e):p(this,t,e);},b.prototype.makeRBT=function(t){for(var e=new Array(t),r=o.prototype._countBits(t)-1,n=0;n<t;n++){e[n]=this.revBin(n,r,t);}return e;},b.prototype.revBin=function(t,e,r){if(0===t||t===r-1)return t;for(var n=0,i=0;i<e;i++){n|=(1&t)<<e-i-1,t>>=1;}return n;},b.prototype.permute=function(t,e,r,n,i,o){for(var a=0;a<o;a++){n[a]=e[t[a]],i[a]=r[t[a]];}},b.prototype.transform=function(t,e,r,n,i,o){this.permute(o,t,e,r,n,i);for(var a=1;a<i;a<<=1){for(var s=a<<1,f=Math.cos(2*Math.PI/s),u=Math.sin(2*Math.PI/s),c=0;c<i;c+=s){for(var h=f,d=u,l=0;l<a;l++){var p=r[c+l],b=n[c+l],v=r[c+l+a],g=n[c+l+a],y=h*v-d*g;g=h*g+d*v,v=y,r[c+l]=p+v,n[c+l]=b+g,r[c+l+a]=p-v,n[c+l+a]=b-g,l!==s&&(y=f*h-u*d,d=f*d+u*h,h=y);}}}},b.prototype.guessLen13b=function(t,e){var r=1|Math.max(e,t),n=1&r,i=0;for(r=r/2|0;r;r>>>=1){i++;}return 1<<i+1+n;},b.prototype.conjugate=function(t,e,r){if(!(r<=1))for(var n=0;n<r/2;n++){var i=t[n];t[n]=t[r-n-1],t[r-n-1]=i,i=e[n],e[n]=-e[r-n-1],e[r-n-1]=-i;}},b.prototype.normalize13b=function(t,e){for(var r=0,n=0;n<e/2;n++){var i=8192*Math.round(t[2*n+1]/e)+Math.round(t[2*n]/e)+r;t[n]=67108863&i,r=i<67108864?0:i/67108864|0;}return t;},b.prototype.convert13b=function(t,e,r,i){for(var o=0,a=0;a<e;a++){o+=0|t[a],r[2*a]=8191&o,o>>>=13,r[2*a+1]=8191&o,o>>>=13;}for(a=2*e;a<i;++a){r[a]=0;}n(0===o),n(0==(-8192&o));},b.prototype.stub=function(t){for(var e=new Array(t),r=0;r<t;r++){e[r]=0;}return e;},b.prototype.mulp=function(t,e,r){var n=2*this.guessLen13b(t.length,e.length),i=this.makeRBT(n),o=this.stub(n),a=new Array(n),s=new Array(n),f=new Array(n),u=new Array(n),c=new Array(n),h=new Array(n),d=r.words;d.length=n,this.convert13b(t.words,t.length,a,n),this.convert13b(e.words,e.length,u,n),this.transform(a,o,s,f,n,i),this.transform(u,o,c,h,n,i);for(var l=0;l<n;l++){var p=s[l]*c[l]-f[l]*h[l];f[l]=s[l]*h[l]+f[l]*c[l],s[l]=p;}return this.conjugate(s,f,n),this.transform(s,f,d,o,n,i),this.conjugate(d,o,n),this.normalize13b(d,n),r.negative=t.negative^e.negative,r.length=t.length+e.length,r.strip();},o.prototype.mul=function(t){var e=new o(null);return e.words=new Array(this.length+t.length),this.mulTo(t,e);},o.prototype.mulf=function(t){var e=new o(null);return e.words=new Array(this.length+t.length),p(this,t,e);},o.prototype.imul=function(t){return this.clone().mulTo(t,this);},o.prototype.imuln=function(t){n("number"==typeof t),n(t<67108864);for(var e=0,r=0;r<this.length;r++){var i=(0|this.words[r])*t,o=(67108863&i)+(67108863&e);e>>=26,e+=i/67108864|0,e+=o>>>26,this.words[r]=67108863&o;}return 0!==e&&(this.words[r]=e,this.length++),this;},o.prototype.muln=function(t){return this.clone().imuln(t);},o.prototype.sqr=function(){return this.mul(this);},o.prototype.isqr=function(){return this.imul(this.clone());},o.prototype.pow=function(t){var e=function(t){for(var e=new Array(t.bitLength()),r=0;r<e.length;r++){var n=r/26|0,i=r%26;e[r]=(t.words[n]&1<<i)>>>i;}return e;}(t);if(0===e.length)return new o(1);for(var r=this,n=0;n<e.length&&0===e[n];n++,r=r.sqr()){;}if(++n<e.length)for(var i=r.sqr();n<e.length;n++,i=i.sqr()){0!==e[n]&&(r=r.mul(i));}return r;},o.prototype.iushln=function(t){n("number"==typeof t&&t>=0);var e,r=t%26,i=(t-r)/26,o=67108863>>>26-r<<26-r;if(0!==r){var a=0;for(e=0;e<this.length;e++){var s=this.words[e]&o,f=(0|this.words[e])-s<<r;this.words[e]=f|a,a=s>>>26-r;}a&&(this.words[e]=a,this.length++);}if(0!==i){for(e=this.length-1;e>=0;e--){this.words[e+i]=this.words[e];}for(e=0;e<i;e++){this.words[e]=0;}this.length+=i;}return this.strip();},o.prototype.ishln=function(t){return n(0===this.negative),this.iushln(t);},o.prototype.iushrn=function(t,e,r){var i;n("number"==typeof t&&t>=0),i=e?(e-e%26)/26:0;var o=t%26,a=Math.min((t-o)/26,this.length),s=67108863^67108863>>>o<<o,f=r;if(i-=a,i=Math.max(0,i),f){for(var u=0;u<a;u++){f.words[u]=this.words[u];}f.length=a;}if(0===a);else if(this.length>a)for(this.length-=a,u=0;u<this.length;u++){this.words[u]=this.words[u+a];}else this.words[0]=0,this.length=1;var c=0;for(u=this.length-1;u>=0&&(0!==c||u>=i);u--){var h=0|this.words[u];this.words[u]=c<<26-o|h>>>o,c=h&s;}return f&&0!==c&&(f.words[f.length++]=c),0===this.length&&(this.words[0]=0,this.length=1),this.strip();},o.prototype.ishrn=function(t,e,r){return n(0===this.negative),this.iushrn(t,e,r);},o.prototype.shln=function(t){return this.clone().ishln(t);},o.prototype.ushln=function(t){return this.clone().iushln(t);},o.prototype.shrn=function(t){return this.clone().ishrn(t);},o.prototype.ushrn=function(t){return this.clone().iushrn(t);},o.prototype.testn=function(t){n("number"==typeof t&&t>=0);var e=t%26,r=(t-e)/26,i=1<<e;return!(this.length<=r)&&!!(this.words[r]&i);},o.prototype.imaskn=function(t){n("number"==typeof t&&t>=0);var e=t%26,r=(t-e)/26;if(n(0===this.negative,"imaskn works only with positive numbers"),this.length<=r)return this;if(0!==e&&r++,this.length=Math.min(r,this.length),0!==e){var i=67108863^67108863>>>e<<e;this.words[this.length-1]&=i;}return this.strip();},o.prototype.maskn=function(t){return this.clone().imaskn(t);},o.prototype.iaddn=function(t){return n("number"==typeof t),n(t<67108864),t<0?this.isubn(-t):0!==this.negative?1===this.length&&(0|this.words[0])<t?(this.words[0]=t-(0|this.words[0]),this.negative=0,this):(this.negative=0,this.isubn(t),this.negative=1,this):this._iaddn(t);},o.prototype._iaddn=function(t){this.words[0]+=t;for(var e=0;e<this.length&&this.words[e]>=67108864;e++){this.words[e]-=67108864,e===this.length-1?this.words[e+1]=1:this.words[e+1]++;}return this.length=Math.max(this.length,e+1),this;},o.prototype.isubn=function(t){if(n("number"==typeof t),n(t<67108864),t<0)return this.iaddn(-t);if(0!==this.negative)return this.negative=0,this.iaddn(t),this.negative=1,this;if(this.words[0]-=t,1===this.length&&this.words[0]<0)this.words[0]=-this.words[0],this.negative=1;else for(var e=0;e<this.length&&this.words[e]<0;e++){this.words[e]+=67108864,this.words[e+1]-=1;}return this.strip();},o.prototype.addn=function(t){return this.clone().iaddn(t);},o.prototype.subn=function(t){return this.clone().isubn(t);},o.prototype.iabs=function(){return this.negative=0,this;},o.prototype.abs=function(){return this.clone().iabs();},o.prototype._ishlnsubmul=function(t,e,r){var i,o,a=t.length+r;this._expand(a);var s=0;for(i=0;i<t.length;i++){o=(0|this.words[i+r])+s;var f=(0|t.words[i])*e;s=((o-=67108863&f)>>26)-(f/67108864|0),this.words[i+r]=67108863&o;}for(;i<this.length-r;i++){s=(o=(0|this.words[i+r])+s)>>26,this.words[i+r]=67108863&o;}if(0===s)return this.strip();for(n(-1===s),s=0,i=0;i<this.length;i++){s=(o=-(0|this.words[i])+s)>>26,this.words[i]=67108863&o;}return this.negative=1,this.strip();},o.prototype._wordDiv=function(t,e){var r=(this.length,t.length),n=this.clone(),i=t,a=0|i.words[i.length-1];0!==(r=26-this._countBits(a))&&(i=i.ushln(r),n.iushln(r),a=0|i.words[i.length-1]);var s,f=n.length-i.length;if("mod"!==e){(s=new o(null)).length=f+1,s.words=new Array(s.length);for(var u=0;u<s.length;u++){s.words[u]=0;}}var c=n.clone()._ishlnsubmul(i,1,f);0===c.negative&&(n=c,s&&(s.words[f]=1));for(var h=f-1;h>=0;h--){var d=67108864*(0|n.words[i.length+h])+(0|n.words[i.length+h-1]);for(d=Math.min(d/a|0,67108863),n._ishlnsubmul(i,d,h);0!==n.negative;){d--,n.negative=0,n._ishlnsubmul(i,1,h),n.isZero()||(n.negative^=1);}s&&(s.words[h]=d);}return s&&s.strip(),n.strip(),"div"!==e&&0!==r&&n.iushrn(r),{div:s||null,mod:n};},o.prototype.divmod=function(t,e,r){return n(!t.isZero()),this.isZero()?{div:new o(0),mod:new o(0)}:0!==this.negative&&0===t.negative?(s=this.neg().divmod(t,e),"mod"!==e&&(i=s.div.neg()),"div"!==e&&(a=s.mod.neg(),r&&0!==a.negative&&a.iadd(t)),{div:i,mod:a}):0===this.negative&&0!==t.negative?(s=this.divmod(t.neg(),e),"mod"!==e&&(i=s.div.neg()),{div:i,mod:s.mod}):0!=(this.negative&t.negative)?(s=this.neg().divmod(t.neg(),e),"div"!==e&&(a=s.mod.neg(),r&&0!==a.negative&&a.isub(t)),{div:s.div,mod:a}):t.length>this.length||this.cmp(t)<0?{div:new o(0),mod:this}:1===t.length?"div"===e?{div:this.divn(t.words[0]),mod:null}:"mod"===e?{div:null,mod:new o(this.modn(t.words[0]))}:{div:this.divn(t.words[0]),mod:new o(this.modn(t.words[0]))}:this._wordDiv(t,e);var i,a,s;},o.prototype.div=function(t){return this.divmod(t,"div",!1).div;},o.prototype.mod=function(t){return this.divmod(t,"mod",!1).mod;},o.prototype.umod=function(t){return this.divmod(t,"mod",!0).mod;},o.prototype.divRound=function(t){var e=this.divmod(t);if(e.mod.isZero())return e.div;var r=0!==e.div.negative?e.mod.isub(t):e.mod,n=t.ushrn(1),i=t.andln(1),o=r.cmp(n);return o<0||1===i&&0===o?e.div:0!==e.div.negative?e.div.isubn(1):e.div.iaddn(1);},o.prototype.modn=function(t){n(t<=67108863);for(var e=(1<<26)%t,r=0,i=this.length-1;i>=0;i--){r=(e*r+(0|this.words[i]))%t;}return r;},o.prototype.idivn=function(t){n(t<=67108863);for(var e=0,r=this.length-1;r>=0;r--){var i=(0|this.words[r])+67108864*e;this.words[r]=i/t|0,e=i%t;}return this.strip();},o.prototype.divn=function(t){return this.clone().idivn(t);},o.prototype.egcd=function(t){n(0===t.negative),n(!t.isZero());var e=this,r=t.clone();e=0!==e.negative?e.umod(t):e.clone();for(var i=new o(1),a=new o(0),s=new o(0),f=new o(1),u=0;e.isEven()&&r.isEven();){e.iushrn(1),r.iushrn(1),++u;}for(var c=r.clone(),h=e.clone();!e.isZero();){for(var d=0,l=1;0==(e.words[0]&l)&&d<26;++d,l<<=1){;}if(d>0)for(e.iushrn(d);d-->0;){(i.isOdd()||a.isOdd())&&(i.iadd(c),a.isub(h)),i.iushrn(1),a.iushrn(1);}for(var p=0,b=1;0==(r.words[0]&b)&&p<26;++p,b<<=1){;}if(p>0)for(r.iushrn(p);p-->0;){(s.isOdd()||f.isOdd())&&(s.iadd(c),f.isub(h)),s.iushrn(1),f.iushrn(1);}e.cmp(r)>=0?(e.isub(r),i.isub(s),a.isub(f)):(r.isub(e),s.isub(i),f.isub(a));}return{a:s,b:f,gcd:r.iushln(u)};},o.prototype._invmp=function(t){n(0===t.negative),n(!t.isZero());var e=this,r=t.clone();e=0!==e.negative?e.umod(t):e.clone();for(var i,a=new o(1),s=new o(0),f=r.clone();e.cmpn(1)>0&&r.cmpn(1)>0;){for(var u=0,c=1;0==(e.words[0]&c)&&u<26;++u,c<<=1){;}if(u>0)for(e.iushrn(u);u-->0;){a.isOdd()&&a.iadd(f),a.iushrn(1);}for(var h=0,d=1;0==(r.words[0]&d)&&h<26;++h,d<<=1){;}if(h>0)for(r.iushrn(h);h-->0;){s.isOdd()&&s.iadd(f),s.iushrn(1);}e.cmp(r)>=0?(e.isub(r),a.isub(s)):(r.isub(e),s.isub(a));}return(i=0===e.cmpn(1)?a:s).cmpn(0)<0&&i.iadd(t),i;},o.prototype.gcd=function(t){if(this.isZero())return t.abs();if(t.isZero())return this.abs();var e=this.clone(),r=t.clone();e.negative=0,r.negative=0;for(var n=0;e.isEven()&&r.isEven();n++){e.iushrn(1),r.iushrn(1);}for(;;){for(;e.isEven();){e.iushrn(1);}for(;r.isEven();){r.iushrn(1);}var i=e.cmp(r);if(i<0){var o=e;e=r,r=o;}else if(0===i||0===r.cmpn(1))break;e.isub(r);}return r.iushln(n);},o.prototype.invm=function(t){return this.egcd(t).a.umod(t);},o.prototype.isEven=function(){return 0==(1&this.words[0]);},o.prototype.isOdd=function(){return 1==(1&this.words[0]);},o.prototype.andln=function(t){return this.words[0]&t;},o.prototype.bincn=function(t){n("number"==typeof t);var e=t%26,r=(t-e)/26,i=1<<e;if(this.length<=r)return this._expand(r+1),this.words[r]|=i,this;for(var o=i,a=r;0!==o&&a<this.length;a++){var s=0|this.words[a];o=(s+=o)>>>26,s&=67108863,this.words[a]=s;}return 0!==o&&(this.words[a]=o,this.length++),this;},o.prototype.isZero=function(){return 1===this.length&&0===this.words[0];},o.prototype.cmpn=function(t){var e,r=t<0;if(0!==this.negative&&!r)return-1;if(0===this.negative&&r)return 1;if(this.strip(),this.length>1)e=1;else{r&&(t=-t),n(t<=67108863,"Number is too big");var i=0|this.words[0];e=i===t?0:i<t?-1:1;}return 0!==this.negative?0|-e:e;},o.prototype.cmp=function(t){if(0!==this.negative&&0===t.negative)return-1;if(0===this.negative&&0!==t.negative)return 1;var e=this.ucmp(t);return 0!==this.negative?0|-e:e;},o.prototype.ucmp=function(t){if(this.length>t.length)return 1;if(this.length<t.length)return-1;for(var e=0,r=this.length-1;r>=0;r--){var n=0|this.words[r],i=0|t.words[r];if(n!==i){n<i?e=-1:n>i&&(e=1);break;}}return e;},o.prototype.gtn=function(t){return 1===this.cmpn(t);},o.prototype.gt=function(t){return 1===this.cmp(t);},o.prototype.gten=function(t){return this.cmpn(t)>=0;},o.prototype.gte=function(t){return this.cmp(t)>=0;},o.prototype.ltn=function(t){return-1===this.cmpn(t);},o.prototype.lt=function(t){return-1===this.cmp(t);},o.prototype.lten=function(t){return this.cmpn(t)<=0;},o.prototype.lte=function(t){return this.cmp(t)<=0;},o.prototype.eqn=function(t){return 0===this.cmpn(t);},o.prototype.eq=function(t){return 0===this.cmp(t);},o.red=function(t){return new S(t);},o.prototype.toRed=function(t){return n(!this.red,"Already a number in reduction context"),n(0===this.negative,"red works only with positives"),t.convertTo(this)._forceRed(t);},o.prototype.fromRed=function(){return n(this.red,"fromRed works only with numbers in reduction context"),this.red.convertFrom(this);},o.prototype._forceRed=function(t){return this.red=t,this;},o.prototype.forceRed=function(t){return n(!this.red,"Already a number in reduction context"),this._forceRed(t);},o.prototype.redAdd=function(t){return n(this.red,"redAdd works only with red numbers"),this.red.add(this,t);},o.prototype.redIAdd=function(t){return n(this.red,"redIAdd works only with red numbers"),this.red.iadd(this,t);},o.prototype.redSub=function(t){return n(this.red,"redSub works only with red numbers"),this.red.sub(this,t);},o.prototype.redISub=function(t){return n(this.red,"redISub works only with red numbers"),this.red.isub(this,t);},o.prototype.redShl=function(t){return n(this.red,"redShl works only with red numbers"),this.red.shl(this,t);},o.prototype.redMul=function(t){return n(this.red,"redMul works only with red numbers"),this.red._verify2(this,t),this.red.mul(this,t);},o.prototype.redIMul=function(t){return n(this.red,"redMul works only with red numbers"),this.red._verify2(this,t),this.red.imul(this,t);},o.prototype.redSqr=function(){return n(this.red,"redSqr works only with red numbers"),this.red._verify1(this),this.red.sqr(this);},o.prototype.redISqr=function(){return n(this.red,"redISqr works only with red numbers"),this.red._verify1(this),this.red.isqr(this);},o.prototype.redSqrt=function(){return n(this.red,"redSqrt works only with red numbers"),this.red._verify1(this),this.red.sqrt(this);},o.prototype.redInvm=function(){return n(this.red,"redInvm works only with red numbers"),this.red._verify1(this),this.red.invm(this);},o.prototype.redNeg=function(){return n(this.red,"redNeg works only with red numbers"),this.red._verify1(this),this.red.neg(this);},o.prototype.redPow=function(t){return n(this.red&&!t.red,"redPow(normalNum)"),this.red._verify1(this),this.red.pow(this,t);};var v={k256:null,p224:null,p192:null,p25519:null};function g(t,e){this.name=t,this.p=new o(e,16),this.n=this.p.bitLength(),this.k=new o(1).iushln(this.n).isub(this.p),this.tmp=this._tmp();}function y(){g.call(this,"k256","ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f");}function m(){g.call(this,"p224","ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001");}function w(){g.call(this,"p192","ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff");}function _(){g.call(this,"25519","7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed");}function S(t){if("string"==typeof t){var e=o._prime(t);this.m=e.p,this.prime=e;}else n(t.gtn(1),"modulus must be greater than 1"),this.m=t,this.prime=null;}function M(t){S.call(this,t),this.shift=this.m.bitLength(),this.shift%26!=0&&(this.shift+=26-this.shift%26),this.r=new o(1).iushln(this.shift),this.r2=this.imod(this.r.sqr()),this.rinv=this.r._invmp(this.m),this.minv=this.rinv.mul(this.r).isubn(1).div(this.m),this.minv=this.minv.umod(this.r),this.minv=this.r.sub(this.minv);}g.prototype._tmp=function(){var t=new o(null);return t.words=new Array(Math.ceil(this.n/13)),t;},g.prototype.ireduce=function(t){var e,r=t;do{this.split(r,this.tmp),e=(r=(r=this.imulK(r)).iadd(this.tmp)).bitLength();}while(e>this.n);var n=e<this.n?-1:r.ucmp(this.p);return 0===n?(r.words[0]=0,r.length=1):n>0?r.isub(this.p):void 0!==r.strip?r.strip():r._strip(),r;},g.prototype.split=function(t,e){t.iushrn(this.n,0,e);},g.prototype.imulK=function(t){return t.imul(this.k);},i(y,g),y.prototype.split=function(t,e){for(var r=4194303,n=Math.min(t.length,9),i=0;i<n;i++){e.words[i]=t.words[i];}if(e.length=n,t.length<=9)return t.words[0]=0,void(t.length=1);var o=t.words[9];for(e.words[e.length++]=o&r,i=10;i<t.length;i++){var a=0|t.words[i];t.words[i-10]=(a&r)<<4|o>>>22,o=a;}o>>>=22,t.words[i-10]=o,0===o&&t.length>10?t.length-=10:t.length-=9;},y.prototype.imulK=function(t){t.words[t.length]=0,t.words[t.length+1]=0,t.length+=2;for(var e=0,r=0;r<t.length;r++){var n=0|t.words[r];e+=977*n,t.words[r]=67108863&e,e=64*n+(e/67108864|0);}return 0===t.words[t.length-1]&&(t.length--,0===t.words[t.length-1]&&t.length--),t;},i(m,g),i(w,g),i(_,g),_.prototype.imulK=function(t){for(var e=0,r=0;r<t.length;r++){var n=19*(0|t.words[r])+e,i=67108863&n;n>>>=26,t.words[r]=i,e=n;}return 0!==e&&(t.words[t.length++]=e),t;},o._prime=function(t){if(v[t])return v[t];var e;if("k256"===t)e=new y();else if("p224"===t)e=new m();else if("p192"===t)e=new w();else{if("p25519"!==t)throw new Error("Unknown prime "+t);e=new _();}return v[t]=e,e;},S.prototype._verify1=function(t){n(0===t.negative,"red works only with positives"),n(t.red,"red works only with red numbers");},S.prototype._verify2=function(t,e){n(0==(t.negative|e.negative),"red works only with positives"),n(t.red&&t.red===e.red,"red works only with red numbers");},S.prototype.imod=function(t){return this.prime?this.prime.ireduce(t)._forceRed(this):t.umod(this.m)._forceRed(this);},S.prototype.neg=function(t){return t.isZero()?t.clone():this.m.sub(t)._forceRed(this);},S.prototype.add=function(t,e){this._verify2(t,e);var r=t.add(e);return r.cmp(this.m)>=0&&r.isub(this.m),r._forceRed(this);},S.prototype.iadd=function(t,e){this._verify2(t,e);var r=t.iadd(e);return r.cmp(this.m)>=0&&r.isub(this.m),r;},S.prototype.sub=function(t,e){this._verify2(t,e);var r=t.sub(e);return r.cmpn(0)<0&&r.iadd(this.m),r._forceRed(this);},S.prototype.isub=function(t,e){this._verify2(t,e);var r=t.isub(e);return r.cmpn(0)<0&&r.iadd(this.m),r;},S.prototype.shl=function(t,e){return this._verify1(t),this.imod(t.ushln(e));},S.prototype.imul=function(t,e){return this._verify2(t,e),this.imod(t.imul(e));},S.prototype.mul=function(t,e){return this._verify2(t,e),this.imod(t.mul(e));},S.prototype.isqr=function(t){return this.imul(t,t.clone());},S.prototype.sqr=function(t){return this.mul(t,t);},S.prototype.sqrt=function(t){if(t.isZero())return t.clone();var e=this.m.andln(3);if(n(e%2==1),3===e){var r=this.m.add(new o(1)).iushrn(2);return this.pow(t,r);}for(var i=this.m.subn(1),a=0;!i.isZero()&&0===i.andln(1);){a++,i.iushrn(1);}n(!i.isZero());var s=new o(1).toRed(this),f=s.redNeg(),u=this.m.subn(1).iushrn(1),c=this.m.bitLength();for(c=new o(2*c*c).toRed(this);0!==this.pow(c,u).cmp(f);){c.redIAdd(f);}for(var h=this.pow(c,i),d=this.pow(t,i.addn(1).iushrn(1)),l=this.pow(t,i),p=a;0!==l.cmp(s);){for(var b=l,v=0;0!==b.cmp(s);v++){b=b.redSqr();}n(v<p);var g=this.pow(h,new o(1).iushln(p-v-1));d=d.redMul(g),h=g.redSqr(),l=l.redMul(h),p=v;}return d;},S.prototype.invm=function(t){var e=t._invmp(this.m);return 0!==e.negative?(e.negative=0,this.imod(e).redNeg()):this.imod(e);},S.prototype.pow=function(t,e){if(e.isZero())return new o(1).toRed(this);if(0===e.cmpn(1))return t.clone();var r=new Array(16);r[0]=new o(1).toRed(this),r[1]=t;for(var n=2;n<r.length;n++){r[n]=this.mul(r[n-1],t);}var i=r[0],a=0,s=0,f=e.bitLength()%26;for(0===f&&(f=26),n=e.length-1;n>=0;n--){for(var u=e.words[n],c=f-1;c>=0;c--){var h=u>>c&1;i!==r[0]&&(i=this.sqr(i)),0!==h||0!==a?(a<<=1,a|=h,(4===++s||0===n&&0===c)&&(i=this.mul(i,r[a]),s=0,a=0)):s=0;}f=26;}return i;},S.prototype.convertTo=function(t){var e=t.umod(this.m);return e===t?e.clone():e;},S.prototype.convertFrom=function(t){var e=t.clone();return e.red=null,e;},o.mont=function(t){return new M(t);},i(M,S),M.prototype.convertTo=function(t){return this.imod(t.ushln(this.shift));},M.prototype.convertFrom=function(t){var e=this.imod(t.mul(this.rinv));return e.red=null,e;},M.prototype.imul=function(t,e){if(t.isZero()||e.isZero())return t.words[0]=0,t.length=1,t;var r=t.imul(e),n=r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),i=r.isub(n).iushrn(this.shift),o=i;return i.cmp(this.m)>=0?o=i.isub(this.m):i.cmpn(0)<0&&(o=i.iadd(this.m)),o._forceRed(this);},M.prototype.mul=function(t,e){if(t.isZero()||e.isZero())return new o(0)._forceRed(this);var r=t.mul(e),n=r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),i=r.isub(n).iushrn(this.shift),a=i;return i.cmp(this.m)>=0?a=i.isub(this.m):i.cmpn(0)<0&&(a=i.iadd(this.m)),a._forceRed(this);},M.prototype.invm=function(t){return this.imod(t._invmp(this.m).mul(this.r2))._forceRed(this);};}(void 0===e||e,this);},{21:21}],17:[function(t,e,r){(function(e){(function(){"use strict";if(t(398),t(513),t(70),e._babelPolyfill)throw new Error("only one instance of babel-polyfill is allowed");e._babelPolyfill=!0;function r(t,e,r){t[e]||Object.defineProperty(t,e,{writable:!0,configurable:!0,value:r});}r(String.prototype,"padLeft","".padStart),r(String.prototype,"padRight","".padEnd),"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function(t){[][t]&&r(Array,t,Function.call.bind([][t]));});}).call(this);}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});},{398:398,513:513,70:70}],18:[function(t,e,r){"use strict";r.byteLength=function(t){var e=u(t),r=e[0],n=e[1];return 3*(r+n)/4-n;},r.toByteArray=function(t){var e,r,n=u(t),a=n[0],s=n[1],f=new o(function(t,e,r){return 3*(e+r)/4-r;}(0,a,s)),c=0,h=s>0?a-4:a;for(r=0;r<h;r+=4){e=i[t.charCodeAt(r)]<<18|i[t.charCodeAt(r+1)]<<12|i[t.charCodeAt(r+2)]<<6|i[t.charCodeAt(r+3)],f[c++]=e>>16&255,f[c++]=e>>8&255,f[c++]=255&e;}2===s&&(e=i[t.charCodeAt(r)]<<2|i[t.charCodeAt(r+1)]>>4,f[c++]=255&e);1===s&&(e=i[t.charCodeAt(r)]<<10|i[t.charCodeAt(r+1)]<<4|i[t.charCodeAt(r+2)]>>2,f[c++]=e>>8&255,f[c++]=255&e);return f;},r.fromByteArray=function(t){for(var e,r=t.length,i=r%3,o=[],a=16383,s=0,f=r-i;s<f;s+=a){o.push(c(t,s,s+a>f?f:s+a));}1===i?(e=t[r-1],o.push(n[e>>2]+n[e<<4&63]+"==")):2===i&&(e=(t[r-2]<<8)+t[r-1],o.push(n[e>>10]+n[e>>4&63]+n[e<<2&63]+"="));return o.join("");};for(var n=[],i=[],o="undefined"!=typeof Uint8Array?Uint8Array:Array,a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",s=0,f=a.length;s<f;++s){n[s]=a[s],i[a.charCodeAt(s)]=s;}function u(t){var e=t.length;if(e%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var r=t.indexOf("=");return-1===r&&(r=e),[r,r===e?0:4-r%4];}function c(t,e,r){for(var i,o,a=[],s=e;s<r;s+=3){i=(t[s]<<16&16711680)+(t[s+1]<<8&65280)+(255&t[s+2]),a.push(n[(o=i)>>18&63]+n[o>>12&63]+n[o>>6&63]+n[63&o]);}return a.join("");}i["-".charCodeAt(0)]=62,i["_".charCodeAt(0)]=63;},{}],19:[function(t,e,r){!function(e,r){"use strict";function n(t,e){if(!t)throw new Error(e||"Assertion failed");}function i(t,e){t.super_=e;var r=function r(){};r.prototype=e.prototype,t.prototype=new r(),t.prototype.constructor=t;}function o(t,e,r){if(o.isBN(t))return t;this.negative=0,this.words=null,this.length=0,this.red=null,null!==t&&("le"!==e&&"be"!==e||(r=e,e=10),this._init(t||0,e||10,r||"be"));}var a;"object"==_typeof(e)?e.exports=o:r.BN=o,o.BN=o,o.wordSize=26;try{a=t(21).Buffer;}catch(t){}function s(t,e,r){for(var i=0,o=Math.min(t.length,r),a=0,s=e;s<o;s++){var f,u=t.charCodeAt(s)-48;i<<=4,i|=f=u>=49&&u<=54?u-49+10:u>=17&&u<=22?u-17+10:u,a|=f;}return n(!(240&a),"Invalid character in "+t),i;}function f(t,e,r,i){for(var o=0,a=0,s=Math.min(t.length,r),f=e;f<s;f++){var u=t.charCodeAt(f)-48;o*=i,a=u>=49?u-49+10:u>=17?u-17+10:u,n(u>=0&&a<i,"Invalid character"),o+=a;}return o;}function u(t,e){t.words=e.words,t.length=e.length,t.negative=e.negative,t.red=e.red;}if(o.isBN=function(t){return t instanceof o||null!==t&&"object"==_typeof(t)&&t.constructor.wordSize===o.wordSize&&Array.isArray(t.words);},o.max=function(t,e){return t.cmp(e)>0?t:e;},o.min=function(t,e){return t.cmp(e)<0?t:e;},o.prototype._init=function(t,e,r){if("number"==typeof t)return this._initNumber(t,e,r);if("object"==_typeof(t))return this._initArray(t,e,r);"hex"===e&&(e=16),n(e===(0|e)&&e>=2&&e<=36);var i=0;"-"===(t=t.toString().replace(/\s+/g,""))[0]&&i++,16===e?this._parseHex(t,i):this._parseBase(t,e,i),"-"===t[0]&&(this.negative=1),this._strip(),"le"===r&&this._initArray(this.toArray(),e,r);},o.prototype._initNumber=function(t,e,r){t<0&&(this.negative=1,t=-t),t<67108864?(this.words=[67108863&t],this.length=1):t<4503599627370496?(this.words=[67108863&t,t/67108864&67108863],this.length=2):(n(t<9007199254740992),this.words=[67108863&t,t/67108864&67108863,1],this.length=3),"le"===r&&this._initArray(this.toArray(),e,r);},o.prototype._initArray=function(t,e,r){if(n("number"==typeof t.length),t.length<=0)return this.words=[0],this.length=1,this;this.length=Math.ceil(t.length/3),this.words=new Array(this.length);for(var i=0;i<this.length;i++){this.words[i]=0;}var o,a,s=0;if("be"===r)for(i=t.length-1,o=0;i>=0;i-=3){a=t[i]|t[i-1]<<8|t[i-2]<<16,this.words[o]|=a<<s&67108863,this.words[o+1]=a>>>26-s&67108863,(s+=24)>=26&&(s-=26,o++);}else if("le"===r)for(i=0,o=0;i<t.length;i+=3){a=t[i]|t[i+1]<<8|t[i+2]<<16,this.words[o]|=a<<s&67108863,this.words[o+1]=a>>>26-s&67108863,(s+=24)>=26&&(s-=26,o++);}return this._strip();},o.prototype._parseHex=function(t,e){this.length=Math.ceil((t.length-e)/6),this.words=new Array(this.length);for(var r=0;r<this.length;r++){this.words[r]=0;}var n,i,o=0;for(r=t.length-6,n=0;r>=e;r-=6){i=s(t,r,r+6),this.words[n]|=i<<o&67108863,this.words[n+1]|=i>>>26-o&4194303,(o+=24)>=26&&(o-=26,n++);}r+6!==e&&(i=s(t,e,r+6),this.words[n]|=i<<o&67108863,this.words[n+1]|=i>>>26-o&4194303),this._strip();},o.prototype._parseBase=function(t,e,r){this.words=[0],this.length=1;for(var n=0,i=1;i<=67108863;i*=e){n++;}n--,i=i/e|0;for(var o=t.length-r,a=o%n,s=Math.min(o,o-a)+r,u=0,c=r;c<s;c+=n){u=f(t,c,c+n,e),this.imuln(i),this.words[0]+u<67108864?this.words[0]+=u:this._iaddn(u);}if(0!==a){var h=1;for(u=f(t,c,t.length,e),c=0;c<a;c++){h*=e;}this.imuln(h),this.words[0]+u<67108864?this.words[0]+=u:this._iaddn(u);}},o.prototype.copy=function(t){t.words=new Array(this.length);for(var e=0;e<this.length;e++){t.words[e]=this.words[e];}t.length=this.length,t.negative=this.negative,t.red=this.red;},o.prototype._move=function(t){u(t,this);},o.prototype.clone=function(){var t=new o(null);return this.copy(t),t;},o.prototype._expand=function(t){for(;this.length<t;){this.words[this.length++]=0;}return this;},o.prototype._strip=function(){for(;this.length>1&&0===this.words[this.length-1];){this.length--;}return this._normSign();},o.prototype._normSign=function(){return 1===this.length&&0===this.words[0]&&(this.negative=0),this;},"undefined"!=typeof Symbol&&"function"==typeof Symbol["for"])try{o.prototype[Symbol["for"]("nodejs.util.inspect.custom")]=c;}catch(t){o.prototype.inspect=c;}else o.prototype.inspect=c;function c(){return(this.red?"<BN-R: ":"<BN: ")+this.toString(16)+">";}var h=["","0","00","000","0000","00000","000000","0000000","00000000","000000000","0000000000","00000000000","000000000000","0000000000000","00000000000000","000000000000000","0000000000000000","00000000000000000","000000000000000000","0000000000000000000","00000000000000000000","000000000000000000000","0000000000000000000000","00000000000000000000000","000000000000000000000000","0000000000000000000000000"],d=[0,0,25,16,12,11,10,9,8,8,7,7,7,7,6,6,6,6,6,6,6,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],l=[0,0,33554432,43046721,16777216,48828125,60466176,40353607,16777216,43046721,1e7,19487171,35831808,62748517,7529536,11390625,16777216,24137569,34012224,47045881,64e6,4084101,5153632,6436343,7962624,9765625,11881376,14348907,17210368,20511149,243e5,28629151,33554432,39135393,45435424,52521875,60466176];o.prototype.toString=function(t,e){var r;if(e=0|e||1,16===(t=t||10)||"hex"===t){r="";for(var i=0,o=0,a=0;a<this.length;a++){var s=this.words[a],f=(16777215&(s<<i|o)).toString(16);r=0!==(o=s>>>24-i&16777215)||a!==this.length-1?h[6-f.length]+f+r:f+r,(i+=2)>=26&&(i-=26,a--);}for(0!==o&&(r=o.toString(16)+r);r.length%e!=0;){r="0"+r;}return 0!==this.negative&&(r="-"+r),r;}if(t===(0|t)&&t>=2&&t<=36){var u=d[t],c=l[t];r="";var p=this.clone();for(p.negative=0;!p.isZero();){var b=p.modrn(c).toString(t);r=(p=p.idivn(c)).isZero()?b+r:h[u-b.length]+b+r;}for(this.isZero()&&(r="0"+r);r.length%e!=0;){r="0"+r;}return 0!==this.negative&&(r="-"+r),r;}n(!1,"Base should be between 2 and 36");},o.prototype.toNumber=function(){var t=this.words[0];return 2===this.length?t+=67108864*this.words[1]:3===this.length&&1===this.words[2]?t+=4503599627370496+67108864*this.words[1]:this.length>2&&n(!1,"Number can only safely store up to 53 bits"),0!==this.negative?-t:t;},o.prototype.toJSON=function(){return this.toString(16,2);},a&&(o.prototype.toBuffer=function(t,e){return this.toArrayLike(a,t,e);}),o.prototype.toArray=function(t,e){return this.toArrayLike(Array,t,e);};function p(t,e,r){r.negative=e.negative^t.negative;var n=t.length+e.length|0;r.length=n,n=n-1|0;var i=0|t.words[0],o=0|e.words[0],a=i*o,s=67108863&a,f=a/67108864|0;r.words[0]=s;for(var u=1;u<n;u++){for(var c=f>>>26,h=67108863&f,d=Math.min(u,e.length-1),l=Math.max(0,u-t.length+1);l<=d;l++){var p=u-l|0;c+=(a=(i=0|t.words[p])*(o=0|e.words[l])+h)/67108864|0,h=67108863&a;}r.words[u]=0|h,f=0|c;}return 0!==f?r.words[u]=0|f:r.length--,r._strip();}o.prototype.toArrayLike=function(t,e,r){this._strip();var i=this.byteLength(),o=r||Math.max(1,i);n(i<=o,"byte array longer than desired length"),n(o>0,"Requested array length <= 0");var a=function(t,e){return t.allocUnsafe?t.allocUnsafe(e):new t(e);}(t,o);return this["_toArrayLike"+("le"===e?"LE":"BE")](a,i),a;},o.prototype._toArrayLikeLE=function(t,e){for(var r=0,n=0,i=0,o=0;i<this.length;i++){var a=this.words[i]<<o|n;t[r++]=255&a,r<t.length&&(t[r++]=a>>8&255),r<t.length&&(t[r++]=a>>16&255),6===o?(r<t.length&&(t[r++]=a>>24&255),n=0,o=0):(n=a>>>24,o+=2);}if(r<t.length)for(t[r++]=n;r<t.length;){t[r++]=0;}},o.prototype._toArrayLikeBE=function(t,e){for(var r=t.length-1,n=0,i=0,o=0;i<this.length;i++){var a=this.words[i]<<o|n;t[r--]=255&a,r>=0&&(t[r--]=a>>8&255),r>=0&&(t[r--]=a>>16&255),6===o?(r>=0&&(t[r--]=a>>24&255),n=0,o=0):(n=a>>>24,o+=2);}if(r>=0)for(t[r--]=n;r>=0;){t[r--]=0;}},Math.clz32?o.prototype._countBits=function(t){return 32-Math.clz32(t);}:o.prototype._countBits=function(t){var e=t,r=0;return e>=4096&&(r+=13,e>>>=13),e>=64&&(r+=7,e>>>=7),e>=8&&(r+=4,e>>>=4),e>=2&&(r+=2,e>>>=2),r+e;},o.prototype._zeroBits=function(t){if(0===t)return 26;var e=t,r=0;return 0==(8191&e)&&(r+=13,e>>>=13),0==(127&e)&&(r+=7,e>>>=7),0==(15&e)&&(r+=4,e>>>=4),0==(3&e)&&(r+=2,e>>>=2),0==(1&e)&&r++,r;},o.prototype.bitLength=function(){var t=this.words[this.length-1],e=this._countBits(t);return 26*(this.length-1)+e;},o.prototype.zeroBits=function(){if(this.isZero())return 0;for(var t=0,e=0;e<this.length;e++){var r=this._zeroBits(this.words[e]);if(t+=r,26!==r)break;}return t;},o.prototype.byteLength=function(){return Math.ceil(this.bitLength()/8);},o.prototype.toTwos=function(t){return 0!==this.negative?this.abs().inotn(t).iaddn(1):this.clone();},o.prototype.fromTwos=function(t){return this.testn(t-1)?this.notn(t).iaddn(1).ineg():this.clone();},o.prototype.isNeg=function(){return 0!==this.negative;},o.prototype.neg=function(){return this.clone().ineg();},o.prototype.ineg=function(){return this.isZero()||(this.negative^=1),this;},o.prototype.iuor=function(t){for(;this.length<t.length;){this.words[this.length++]=0;}for(var e=0;e<t.length;e++){this.words[e]=this.words[e]|t.words[e];}return this._strip();},o.prototype.ior=function(t){return n(0==(this.negative|t.negative)),this.iuor(t);},o.prototype.or=function(t){return this.length>t.length?this.clone().ior(t):t.clone().ior(this);},o.prototype.uor=function(t){return this.length>t.length?this.clone().iuor(t):t.clone().iuor(this);},o.prototype.iuand=function(t){var e;e=this.length>t.length?t:this;for(var r=0;r<e.length;r++){this.words[r]=this.words[r]&t.words[r];}return this.length=e.length,this._strip();},o.prototype.iand=function(t){return n(0==(this.negative|t.negative)),this.iuand(t);},o.prototype.and=function(t){return this.length>t.length?this.clone().iand(t):t.clone().iand(this);},o.prototype.uand=function(t){return this.length>t.length?this.clone().iuand(t):t.clone().iuand(this);},o.prototype.iuxor=function(t){var e,r;this.length>t.length?(e=this,r=t):(e=t,r=this);for(var n=0;n<r.length;n++){this.words[n]=e.words[n]^r.words[n];}if(this!==e)for(;n<e.length;n++){this.words[n]=e.words[n];}return this.length=e.length,this._strip();},o.prototype.ixor=function(t){return n(0==(this.negative|t.negative)),this.iuxor(t);},o.prototype.xor=function(t){return this.length>t.length?this.clone().ixor(t):t.clone().ixor(this);},o.prototype.uxor=function(t){return this.length>t.length?this.clone().iuxor(t):t.clone().iuxor(this);},o.prototype.inotn=function(t){n("number"==typeof t&&t>=0);var e=0|Math.ceil(t/26),r=t%26;this._expand(e),r>0&&e--;for(var i=0;i<e;i++){this.words[i]=67108863&~this.words[i];}return r>0&&(this.words[i]=~this.words[i]&67108863>>26-r),this._strip();},o.prototype.notn=function(t){return this.clone().inotn(t);},o.prototype.setn=function(t,e){n("number"==typeof t&&t>=0);var r=t/26|0,i=t%26;return this._expand(r+1),this.words[r]=e?this.words[r]|1<<i:this.words[r]&~(1<<i),this._strip();},o.prototype.iadd=function(t){var e,r,n;if(0!==this.negative&&0===t.negative)return this.negative=0,e=this.isub(t),this.negative^=1,this._normSign();if(0===this.negative&&0!==t.negative)return t.negative=0,e=this.isub(t),t.negative=1,e._normSign();this.length>t.length?(r=this,n=t):(r=t,n=this);for(var i=0,o=0;o<n.length;o++){e=(0|r.words[o])+(0|n.words[o])+i,this.words[o]=67108863&e,i=e>>>26;}for(;0!==i&&o<r.length;o++){e=(0|r.words[o])+i,this.words[o]=67108863&e,i=e>>>26;}if(this.length=r.length,0!==i)this.words[this.length]=i,this.length++;else if(r!==this)for(;o<r.length;o++){this.words[o]=r.words[o];}return this;},o.prototype.add=function(t){var e;return 0!==t.negative&&0===this.negative?(t.negative=0,e=this.sub(t),t.negative^=1,e):0===t.negative&&0!==this.negative?(this.negative=0,e=t.sub(this),this.negative=1,e):this.length>t.length?this.clone().iadd(t):t.clone().iadd(this);},o.prototype.isub=function(t){if(0!==t.negative){t.negative=0;var e=this.iadd(t);return t.negative=1,e._normSign();}if(0!==this.negative)return this.negative=0,this.iadd(t),this.negative=1,this._normSign();var r,n,i=this.cmp(t);if(0===i)return this.negative=0,this.length=1,this.words[0]=0,this;i>0?(r=this,n=t):(r=t,n=this);for(var o=0,a=0;a<n.length;a++){o=(e=(0|r.words[a])-(0|n.words[a])+o)>>26,this.words[a]=67108863&e;}for(;0!==o&&a<r.length;a++){o=(e=(0|r.words[a])+o)>>26,this.words[a]=67108863&e;}if(0===o&&a<r.length&&r!==this)for(;a<r.length;a++){this.words[a]=r.words[a];}return this.length=Math.max(this.length,a),r!==this&&(this.negative=1),this._strip();},o.prototype.sub=function(t){return this.clone().isub(t);};var b=function b(t,e,r){var n,i,o,a=t.words,s=e.words,f=r.words,u=0,c=0|a[0],h=8191&c,d=c>>>13,l=0|a[1],p=8191&l,b=l>>>13,v=0|a[2],g=8191&v,y=v>>>13,m=0|a[3],w=8191&m,_=m>>>13,S=0|a[4],M=8191&S,E=S>>>13,k=0|a[5],x=8191&k,A=k>>>13,R=0|a[6],T=8191&R,I=R>>>13,B=0|a[7],P=8191&B,O=B>>>13,C=0|a[8],L=8191&C,j=C>>>13,N=0|a[9],D=8191&N,U=N>>>13,F=0|s[0],q=8191&F,z=F>>>13,W=0|s[1],V=8191&W,H=W>>>13,G=0|s[2],K=8191&G,X=G>>>13,Z=0|s[3],Y=8191&Z,J=Z>>>13,$=0|s[4],Q=8191&$,tt=$>>>13,et=0|s[5],rt=8191&et,nt=et>>>13,it=0|s[6],ot=8191&it,at=it>>>13,st=0|s[7],ft=8191&st,ut=st>>>13,ct=0|s[8],ht=8191&ct,dt=ct>>>13,lt=0|s[9],pt=8191&lt,bt=lt>>>13;r.negative=t.negative^e.negative,r.length=19;var vt=(u+(n=Math.imul(h,q))|0)+((8191&(i=(i=Math.imul(h,z))+Math.imul(d,q)|0))<<13)|0;u=((o=Math.imul(d,z))+(i>>>13)|0)+(vt>>>26)|0,vt&=67108863,n=Math.imul(p,q),i=(i=Math.imul(p,z))+Math.imul(b,q)|0,o=Math.imul(b,z);var gt=(u+(n=n+Math.imul(h,V)|0)|0)+((8191&(i=(i=i+Math.imul(h,H)|0)+Math.imul(d,V)|0))<<13)|0;u=((o=o+Math.imul(d,H)|0)+(i>>>13)|0)+(gt>>>26)|0,gt&=67108863,n=Math.imul(g,q),i=(i=Math.imul(g,z))+Math.imul(y,q)|0,o=Math.imul(y,z),n=n+Math.imul(p,V)|0,i=(i=i+Math.imul(p,H)|0)+Math.imul(b,V)|0,o=o+Math.imul(b,H)|0;var yt=(u+(n=n+Math.imul(h,K)|0)|0)+((8191&(i=(i=i+Math.imul(h,X)|0)+Math.imul(d,K)|0))<<13)|0;u=((o=o+Math.imul(d,X)|0)+(i>>>13)|0)+(yt>>>26)|0,yt&=67108863,n=Math.imul(w,q),i=(i=Math.imul(w,z))+Math.imul(_,q)|0,o=Math.imul(_,z),n=n+Math.imul(g,V)|0,i=(i=i+Math.imul(g,H)|0)+Math.imul(y,V)|0,o=o+Math.imul(y,H)|0,n=n+Math.imul(p,K)|0,i=(i=i+Math.imul(p,X)|0)+Math.imul(b,K)|0,o=o+Math.imul(b,X)|0;var mt=(u+(n=n+Math.imul(h,Y)|0)|0)+((8191&(i=(i=i+Math.imul(h,J)|0)+Math.imul(d,Y)|0))<<13)|0;u=((o=o+Math.imul(d,J)|0)+(i>>>13)|0)+(mt>>>26)|0,mt&=67108863,n=Math.imul(M,q),i=(i=Math.imul(M,z))+Math.imul(E,q)|0,o=Math.imul(E,z),n=n+Math.imul(w,V)|0,i=(i=i+Math.imul(w,H)|0)+Math.imul(_,V)|0,o=o+Math.imul(_,H)|0,n=n+Math.imul(g,K)|0,i=(i=i+Math.imul(g,X)|0)+Math.imul(y,K)|0,o=o+Math.imul(y,X)|0,n=n+Math.imul(p,Y)|0,i=(i=i+Math.imul(p,J)|0)+Math.imul(b,Y)|0,o=o+Math.imul(b,J)|0;var wt=(u+(n=n+Math.imul(h,Q)|0)|0)+((8191&(i=(i=i+Math.imul(h,tt)|0)+Math.imul(d,Q)|0))<<13)|0;u=((o=o+Math.imul(d,tt)|0)+(i>>>13)|0)+(wt>>>26)|0,wt&=67108863,n=Math.imul(x,q),i=(i=Math.imul(x,z))+Math.imul(A,q)|0,o=Math.imul(A,z),n=n+Math.imul(M,V)|0,i=(i=i+Math.imul(M,H)|0)+Math.imul(E,V)|0,o=o+Math.imul(E,H)|0,n=n+Math.imul(w,K)|0,i=(i=i+Math.imul(w,X)|0)+Math.imul(_,K)|0,o=o+Math.imul(_,X)|0,n=n+Math.imul(g,Y)|0,i=(i=i+Math.imul(g,J)|0)+Math.imul(y,Y)|0,o=o+Math.imul(y,J)|0,n=n+Math.imul(p,Q)|0,i=(i=i+Math.imul(p,tt)|0)+Math.imul(b,Q)|0,o=o+Math.imul(b,tt)|0;var _t=(u+(n=n+Math.imul(h,rt)|0)|0)+((8191&(i=(i=i+Math.imul(h,nt)|0)+Math.imul(d,rt)|0))<<13)|0;u=((o=o+Math.imul(d,nt)|0)+(i>>>13)|0)+(_t>>>26)|0,_t&=67108863,n=Math.imul(T,q),i=(i=Math.imul(T,z))+Math.imul(I,q)|0,o=Math.imul(I,z),n=n+Math.imul(x,V)|0,i=(i=i+Math.imul(x,H)|0)+Math.imul(A,V)|0,o=o+Math.imul(A,H)|0,n=n+Math.imul(M,K)|0,i=(i=i+Math.imul(M,X)|0)+Math.imul(E,K)|0,o=o+Math.imul(E,X)|0,n=n+Math.imul(w,Y)|0,i=(i=i+Math.imul(w,J)|0)+Math.imul(_,Y)|0,o=o+Math.imul(_,J)|0,n=n+Math.imul(g,Q)|0,i=(i=i+Math.imul(g,tt)|0)+Math.imul(y,Q)|0,o=o+Math.imul(y,tt)|0,n=n+Math.imul(p,rt)|0,i=(i=i+Math.imul(p,nt)|0)+Math.imul(b,rt)|0,o=o+Math.imul(b,nt)|0;var St=(u+(n=n+Math.imul(h,ot)|0)|0)+((8191&(i=(i=i+Math.imul(h,at)|0)+Math.imul(d,ot)|0))<<13)|0;u=((o=o+Math.imul(d,at)|0)+(i>>>13)|0)+(St>>>26)|0,St&=67108863,n=Math.imul(P,q),i=(i=Math.imul(P,z))+Math.imul(O,q)|0,o=Math.imul(O,z),n=n+Math.imul(T,V)|0,i=(i=i+Math.imul(T,H)|0)+Math.imul(I,V)|0,o=o+Math.imul(I,H)|0,n=n+Math.imul(x,K)|0,i=(i=i+Math.imul(x,X)|0)+Math.imul(A,K)|0,o=o+Math.imul(A,X)|0,n=n+Math.imul(M,Y)|0,i=(i=i+Math.imul(M,J)|0)+Math.imul(E,Y)|0,o=o+Math.imul(E,J)|0,n=n+Math.imul(w,Q)|0,i=(i=i+Math.imul(w,tt)|0)+Math.imul(_,Q)|0,o=o+Math.imul(_,tt)|0,n=n+Math.imul(g,rt)|0,i=(i=i+Math.imul(g,nt)|0)+Math.imul(y,rt)|0,o=o+Math.imul(y,nt)|0,n=n+Math.imul(p,ot)|0,i=(i=i+Math.imul(p,at)|0)+Math.imul(b,ot)|0,o=o+Math.imul(b,at)|0;var Mt=(u+(n=n+Math.imul(h,ft)|0)|0)+((8191&(i=(i=i+Math.imul(h,ut)|0)+Math.imul(d,ft)|0))<<13)|0;u=((o=o+Math.imul(d,ut)|0)+(i>>>13)|0)+(Mt>>>26)|0,Mt&=67108863,n=Math.imul(L,q),i=(i=Math.imul(L,z))+Math.imul(j,q)|0,o=Math.imul(j,z),n=n+Math.imul(P,V)|0,i=(i=i+Math.imul(P,H)|0)+Math.imul(O,V)|0,o=o+Math.imul(O,H)|0,n=n+Math.imul(T,K)|0,i=(i=i+Math.imul(T,X)|0)+Math.imul(I,K)|0,o=o+Math.imul(I,X)|0,n=n+Math.imul(x,Y)|0,i=(i=i+Math.imul(x,J)|0)+Math.imul(A,Y)|0,o=o+Math.imul(A,J)|0,n=n+Math.imul(M,Q)|0,i=(i=i+Math.imul(M,tt)|0)+Math.imul(E,Q)|0,o=o+Math.imul(E,tt)|0,n=n+Math.imul(w,rt)|0,i=(i=i+Math.imul(w,nt)|0)+Math.imul(_,rt)|0,o=o+Math.imul(_,nt)|0,n=n+Math.imul(g,ot)|0,i=(i=i+Math.imul(g,at)|0)+Math.imul(y,ot)|0,o=o+Math.imul(y,at)|0,n=n+Math.imul(p,ft)|0,i=(i=i+Math.imul(p,ut)|0)+Math.imul(b,ft)|0,o=o+Math.imul(b,ut)|0;var Et=(u+(n=n+Math.imul(h,ht)|0)|0)+((8191&(i=(i=i+Math.imul(h,dt)|0)+Math.imul(d,ht)|0))<<13)|0;u=((o=o+Math.imul(d,dt)|0)+(i>>>13)|0)+(Et>>>26)|0,Et&=67108863,n=Math.imul(D,q),i=(i=Math.imul(D,z))+Math.imul(U,q)|0,o=Math.imul(U,z),n=n+Math.imul(L,V)|0,i=(i=i+Math.imul(L,H)|0)+Math.imul(j,V)|0,o=o+Math.imul(j,H)|0,n=n+Math.imul(P,K)|0,i=(i=i+Math.imul(P,X)|0)+Math.imul(O,K)|0,o=o+Math.imul(O,X)|0,n=n+Math.imul(T,Y)|0,i=(i=i+Math.imul(T,J)|0)+Math.imul(I,Y)|0,o=o+Math.imul(I,J)|0,n=n+Math.imul(x,Q)|0,i=(i=i+Math.imul(x,tt)|0)+Math.imul(A,Q)|0,o=o+Math.imul(A,tt)|0,n=n+Math.imul(M,rt)|0,i=(i=i+Math.imul(M,nt)|0)+Math.imul(E,rt)|0,o=o+Math.imul(E,nt)|0,n=n+Math.imul(w,ot)|0,i=(i=i+Math.imul(w,at)|0)+Math.imul(_,ot)|0,o=o+Math.imul(_,at)|0,n=n+Math.imul(g,ft)|0,i=(i=i+Math.imul(g,ut)|0)+Math.imul(y,ft)|0,o=o+Math.imul(y,ut)|0,n=n+Math.imul(p,ht)|0,i=(i=i+Math.imul(p,dt)|0)+Math.imul(b,ht)|0,o=o+Math.imul(b,dt)|0;var kt=(u+(n=n+Math.imul(h,pt)|0)|0)+((8191&(i=(i=i+Math.imul(h,bt)|0)+Math.imul(d,pt)|0))<<13)|0;u=((o=o+Math.imul(d,bt)|0)+(i>>>13)|0)+(kt>>>26)|0,kt&=67108863,n=Math.imul(D,V),i=(i=Math.imul(D,H))+Math.imul(U,V)|0,o=Math.imul(U,H),n=n+Math.imul(L,K)|0,i=(i=i+Math.imul(L,X)|0)+Math.imul(j,K)|0,o=o+Math.imul(j,X)|0,n=n+Math.imul(P,Y)|0,i=(i=i+Math.imul(P,J)|0)+Math.imul(O,Y)|0,o=o+Math.imul(O,J)|0,n=n+Math.imul(T,Q)|0,i=(i=i+Math.imul(T,tt)|0)+Math.imul(I,Q)|0,o=o+Math.imul(I,tt)|0,n=n+Math.imul(x,rt)|0,i=(i=i+Math.imul(x,nt)|0)+Math.imul(A,rt)|0,o=o+Math.imul(A,nt)|0,n=n+Math.imul(M,ot)|0,i=(i=i+Math.imul(M,at)|0)+Math.imul(E,ot)|0,o=o+Math.imul(E,at)|0,n=n+Math.imul(w,ft)|0,i=(i=i+Math.imul(w,ut)|0)+Math.imul(_,ft)|0,o=o+Math.imul(_,ut)|0,n=n+Math.imul(g,ht)|0,i=(i=i+Math.imul(g,dt)|0)+Math.imul(y,ht)|0,o=o+Math.imul(y,dt)|0;var xt=(u+(n=n+Math.imul(p,pt)|0)|0)+((8191&(i=(i=i+Math.imul(p,bt)|0)+Math.imul(b,pt)|0))<<13)|0;u=((o=o+Math.imul(b,bt)|0)+(i>>>13)|0)+(xt>>>26)|0,xt&=67108863,n=Math.imul(D,K),i=(i=Math.imul(D,X))+Math.imul(U,K)|0,o=Math.imul(U,X),n=n+Math.imul(L,Y)|0,i=(i=i+Math.imul(L,J)|0)+Math.imul(j,Y)|0,o=o+Math.imul(j,J)|0,n=n+Math.imul(P,Q)|0,i=(i=i+Math.imul(P,tt)|0)+Math.imul(O,Q)|0,o=o+Math.imul(O,tt)|0,n=n+Math.imul(T,rt)|0,i=(i=i+Math.imul(T,nt)|0)+Math.imul(I,rt)|0,o=o+Math.imul(I,nt)|0,n=n+Math.imul(x,ot)|0,i=(i=i+Math.imul(x,at)|0)+Math.imul(A,ot)|0,o=o+Math.imul(A,at)|0,n=n+Math.imul(M,ft)|0,i=(i=i+Math.imul(M,ut)|0)+Math.imul(E,ft)|0,o=o+Math.imul(E,ut)|0,n=n+Math.imul(w,ht)|0,i=(i=i+Math.imul(w,dt)|0)+Math.imul(_,ht)|0,o=o+Math.imul(_,dt)|0;var At=(u+(n=n+Math.imul(g,pt)|0)|0)+((8191&(i=(i=i+Math.imul(g,bt)|0)+Math.imul(y,pt)|0))<<13)|0;u=((o=o+Math.imul(y,bt)|0)+(i>>>13)|0)+(At>>>26)|0,At&=67108863,n=Math.imul(D,Y),i=(i=Math.imul(D,J))+Math.imul(U,Y)|0,o=Math.imul(U,J),n=n+Math.imul(L,Q)|0,i=(i=i+Math.imul(L,tt)|0)+Math.imul(j,Q)|0,o=o+Math.imul(j,tt)|0,n=n+Math.imul(P,rt)|0,i=(i=i+Math.imul(P,nt)|0)+Math.imul(O,rt)|0,o=o+Math.imul(O,nt)|0,n=n+Math.imul(T,ot)|0,i=(i=i+Math.imul(T,at)|0)+Math.imul(I,ot)|0,o=o+Math.imul(I,at)|0,n=n+Math.imul(x,ft)|0,i=(i=i+Math.imul(x,ut)|0)+Math.imul(A,ft)|0,o=o+Math.imul(A,ut)|0,n=n+Math.imul(M,ht)|0,i=(i=i+Math.imul(M,dt)|0)+Math.imul(E,ht)|0,o=o+Math.imul(E,dt)|0;var Rt=(u+(n=n+Math.imul(w,pt)|0)|0)+((8191&(i=(i=i+Math.imul(w,bt)|0)+Math.imul(_,pt)|0))<<13)|0;u=((o=o+Math.imul(_,bt)|0)+(i>>>13)|0)+(Rt>>>26)|0,Rt&=67108863,n=Math.imul(D,Q),i=(i=Math.imul(D,tt))+Math.imul(U,Q)|0,o=Math.imul(U,tt),n=n+Math.imul(L,rt)|0,i=(i=i+Math.imul(L,nt)|0)+Math.imul(j,rt)|0,o=o+Math.imul(j,nt)|0,n=n+Math.imul(P,ot)|0,i=(i=i+Math.imul(P,at)|0)+Math.imul(O,ot)|0,o=o+Math.imul(O,at)|0,n=n+Math.imul(T,ft)|0,i=(i=i+Math.imul(T,ut)|0)+Math.imul(I,ft)|0,o=o+Math.imul(I,ut)|0,n=n+Math.imul(x,ht)|0,i=(i=i+Math.imul(x,dt)|0)+Math.imul(A,ht)|0,o=o+Math.imul(A,dt)|0;var Tt=(u+(n=n+Math.imul(M,pt)|0)|0)+((8191&(i=(i=i+Math.imul(M,bt)|0)+Math.imul(E,pt)|0))<<13)|0;u=((o=o+Math.imul(E,bt)|0)+(i>>>13)|0)+(Tt>>>26)|0,Tt&=67108863,n=Math.imul(D,rt),i=(i=Math.imul(D,nt))+Math.imul(U,rt)|0,o=Math.imul(U,nt),n=n+Math.imul(L,ot)|0,i=(i=i+Math.imul(L,at)|0)+Math.imul(j,ot)|0,o=o+Math.imul(j,at)|0,n=n+Math.imul(P,ft)|0,i=(i=i+Math.imul(P,ut)|0)+Math.imul(O,ft)|0,o=o+Math.imul(O,ut)|0,n=n+Math.imul(T,ht)|0,i=(i=i+Math.imul(T,dt)|0)+Math.imul(I,ht)|0,o=o+Math.imul(I,dt)|0;var It=(u+(n=n+Math.imul(x,pt)|0)|0)+((8191&(i=(i=i+Math.imul(x,bt)|0)+Math.imul(A,pt)|0))<<13)|0;u=((o=o+Math.imul(A,bt)|0)+(i>>>13)|0)+(It>>>26)|0,It&=67108863,n=Math.imul(D,ot),i=(i=Math.imul(D,at))+Math.imul(U,ot)|0,o=Math.imul(U,at),n=n+Math.imul(L,ft)|0,i=(i=i+Math.imul(L,ut)|0)+Math.imul(j,ft)|0,o=o+Math.imul(j,ut)|0,n=n+Math.imul(P,ht)|0,i=(i=i+Math.imul(P,dt)|0)+Math.imul(O,ht)|0,o=o+Math.imul(O,dt)|0;var Bt=(u+(n=n+Math.imul(T,pt)|0)|0)+((8191&(i=(i=i+Math.imul(T,bt)|0)+Math.imul(I,pt)|0))<<13)|0;u=((o=o+Math.imul(I,bt)|0)+(i>>>13)|0)+(Bt>>>26)|0,Bt&=67108863,n=Math.imul(D,ft),i=(i=Math.imul(D,ut))+Math.imul(U,ft)|0,o=Math.imul(U,ut),n=n+Math.imul(L,ht)|0,i=(i=i+Math.imul(L,dt)|0)+Math.imul(j,ht)|0,o=o+Math.imul(j,dt)|0;var Pt=(u+(n=n+Math.imul(P,pt)|0)|0)+((8191&(i=(i=i+Math.imul(P,bt)|0)+Math.imul(O,pt)|0))<<13)|0;u=((o=o+Math.imul(O,bt)|0)+(i>>>13)|0)+(Pt>>>26)|0,Pt&=67108863,n=Math.imul(D,ht),i=(i=Math.imul(D,dt))+Math.imul(U,ht)|0,o=Math.imul(U,dt);var Ot=(u+(n=n+Math.imul(L,pt)|0)|0)+((8191&(i=(i=i+Math.imul(L,bt)|0)+Math.imul(j,pt)|0))<<13)|0;u=((o=o+Math.imul(j,bt)|0)+(i>>>13)|0)+(Ot>>>26)|0,Ot&=67108863;var Ct=(u+(n=Math.imul(D,pt))|0)+((8191&(i=(i=Math.imul(D,bt))+Math.imul(U,pt)|0))<<13)|0;return u=((o=Math.imul(U,bt))+(i>>>13)|0)+(Ct>>>26)|0,Ct&=67108863,f[0]=vt,f[1]=gt,f[2]=yt,f[3]=mt,f[4]=wt,f[5]=_t,f[6]=St,f[7]=Mt,f[8]=Et,f[9]=kt,f[10]=xt,f[11]=At,f[12]=Rt,f[13]=Tt,f[14]=It,f[15]=Bt,f[16]=Pt,f[17]=Ot,f[18]=Ct,0!==u&&(f[19]=u,r.length++),r;};function v(t,e,r){r.negative=e.negative^t.negative,r.length=t.length+e.length;for(var n=0,i=0,o=0;o<r.length-1;o++){var a=i;i=0;for(var s=67108863&n,f=Math.min(o,e.length-1),u=Math.max(0,o-t.length+1);u<=f;u++){var c=o-u,h=(0|t.words[c])*(0|e.words[u]),d=67108863&h;s=67108863&(d=d+s|0),i+=(a=(a=a+(h/67108864|0)|0)+(d>>>26)|0)>>>26,a&=67108863;}r.words[o]=s,n=a,a=i;}return 0!==n?r.words[o]=n:r.length--,r._strip();}function g(t,e,r){return v(t,e,r);}function y(t,e){this.x=t,this.y=e;}Math.imul||(b=p),o.prototype.mulTo=function(t,e){var r=this.length+t.length;return 10===this.length&&10===t.length?b(this,t,e):r<63?p(this,t,e):r<1024?v(this,t,e):g(this,t,e);},y.prototype.makeRBT=function(t){for(var e=new Array(t),r=o.prototype._countBits(t)-1,n=0;n<t;n++){e[n]=this.revBin(n,r,t);}return e;},y.prototype.revBin=function(t,e,r){if(0===t||t===r-1)return t;for(var n=0,i=0;i<e;i++){n|=(1&t)<<e-i-1,t>>=1;}return n;},y.prototype.permute=function(t,e,r,n,i,o){for(var a=0;a<o;a++){n[a]=e[t[a]],i[a]=r[t[a]];}},y.prototype.transform=function(t,e,r,n,i,o){this.permute(o,t,e,r,n,i);for(var a=1;a<i;a<<=1){for(var s=a<<1,f=Math.cos(2*Math.PI/s),u=Math.sin(2*Math.PI/s),c=0;c<i;c+=s){for(var h=f,d=u,l=0;l<a;l++){var p=r[c+l],b=n[c+l],v=r[c+l+a],g=n[c+l+a],y=h*v-d*g;g=h*g+d*v,v=y,r[c+l]=p+v,n[c+l]=b+g,r[c+l+a]=p-v,n[c+l+a]=b-g,l!==s&&(y=f*h-u*d,d=f*d+u*h,h=y);}}}},y.prototype.guessLen13b=function(t,e){var r=1|Math.max(e,t),n=1&r,i=0;for(r=r/2|0;r;r>>>=1){i++;}return 1<<i+1+n;},y.prototype.conjugate=function(t,e,r){if(!(r<=1))for(var n=0;n<r/2;n++){var i=t[n];t[n]=t[r-n-1],t[r-n-1]=i,i=e[n],e[n]=-e[r-n-1],e[r-n-1]=-i;}},y.prototype.normalize13b=function(t,e){for(var r=0,n=0;n<e/2;n++){var i=8192*Math.round(t[2*n+1]/e)+Math.round(t[2*n]/e)+r;t[n]=67108863&i,r=i<67108864?0:i/67108864|0;}return t;},y.prototype.convert13b=function(t,e,r,i){for(var o=0,a=0;a<e;a++){o+=0|t[a],r[2*a]=8191&o,o>>>=13,r[2*a+1]=8191&o,o>>>=13;}for(a=2*e;a<i;++a){r[a]=0;}n(0===o),n(0==(-8192&o));},y.prototype.stub=function(t){for(var e=new Array(t),r=0;r<t;r++){e[r]=0;}return e;},y.prototype.mulp=function(t,e,r){var n=2*this.guessLen13b(t.length,e.length),i=this.makeRBT(n),o=this.stub(n),a=new Array(n),s=new Array(n),f=new Array(n),u=new Array(n),c=new Array(n),h=new Array(n),d=r.words;d.length=n,this.convert13b(t.words,t.length,a,n),this.convert13b(e.words,e.length,u,n),this.transform(a,o,s,f,n,i),this.transform(u,o,c,h,n,i);for(var l=0;l<n;l++){var p=s[l]*c[l]-f[l]*h[l];f[l]=s[l]*h[l]+f[l]*c[l],s[l]=p;}return this.conjugate(s,f,n),this.transform(s,f,d,o,n,i),this.conjugate(d,o,n),this.normalize13b(d,n),r.negative=t.negative^e.negative,r.length=t.length+e.length,r._strip();},o.prototype.mul=function(t){var e=new o(null);return e.words=new Array(this.length+t.length),this.mulTo(t,e);},o.prototype.mulf=function(t){var e=new o(null);return e.words=new Array(this.length+t.length),g(this,t,e);},o.prototype.imul=function(t){return this.clone().mulTo(t,this);},o.prototype.imuln=function(t){var e=t<0;e&&(t=-t),n("number"==typeof t),n(t<67108864);for(var r=0,i=0;i<this.length;i++){var o=(0|this.words[i])*t,a=(67108863&o)+(67108863&r);r>>=26,r+=o/67108864|0,r+=a>>>26,this.words[i]=67108863&a;}return 0!==r&&(this.words[i]=r,this.length++),e?this.ineg():this;},o.prototype.muln=function(t){return this.clone().imuln(t);},o.prototype.sqr=function(){return this.mul(this);},o.prototype.isqr=function(){return this.imul(this.clone());},o.prototype.pow=function(t){var e=function(t){for(var e=new Array(t.bitLength()),r=0;r<e.length;r++){var n=r/26|0,i=r%26;e[r]=t.words[n]>>>i&1;}return e;}(t);if(0===e.length)return new o(1);for(var r=this,n=0;n<e.length&&0===e[n];n++,r=r.sqr()){;}if(++n<e.length)for(var i=r.sqr();n<e.length;n++,i=i.sqr()){0!==e[n]&&(r=r.mul(i));}return r;},o.prototype.iushln=function(t){n("number"==typeof t&&t>=0);var e,r=t%26,i=(t-r)/26,o=67108863>>>26-r<<26-r;if(0!==r){var a=0;for(e=0;e<this.length;e++){var s=this.words[e]&o,f=(0|this.words[e])-s<<r;this.words[e]=f|a,a=s>>>26-r;}a&&(this.words[e]=a,this.length++);}if(0!==i){for(e=this.length-1;e>=0;e--){this.words[e+i]=this.words[e];}for(e=0;e<i;e++){this.words[e]=0;}this.length+=i;}return this._strip();},o.prototype.ishln=function(t){return n(0===this.negative),this.iushln(t);},o.prototype.iushrn=function(t,e,r){var i;n("number"==typeof t&&t>=0),i=e?(e-e%26)/26:0;var o=t%26,a=Math.min((t-o)/26,this.length),s=67108863^67108863>>>o<<o,f=r;if(i-=a,i=Math.max(0,i),f){for(var u=0;u<a;u++){f.words[u]=this.words[u];}f.length=a;}if(0===a);else if(this.length>a)for(this.length-=a,u=0;u<this.length;u++){this.words[u]=this.words[u+a];}else this.words[0]=0,this.length=1;var c=0;for(u=this.length-1;u>=0&&(0!==c||u>=i);u--){var h=0|this.words[u];this.words[u]=c<<26-o|h>>>o,c=h&s;}return f&&0!==c&&(f.words[f.length++]=c),0===this.length&&(this.words[0]=0,this.length=1),this._strip();},o.prototype.ishrn=function(t,e,r){return n(0===this.negative),this.iushrn(t,e,r);},o.prototype.shln=function(t){return this.clone().ishln(t);},o.prototype.ushln=function(t){return this.clone().iushln(t);},o.prototype.shrn=function(t){return this.clone().ishrn(t);},o.prototype.ushrn=function(t){return this.clone().iushrn(t);},o.prototype.testn=function(t){n("number"==typeof t&&t>=0);var e=t%26,r=(t-e)/26,i=1<<e;return!(this.length<=r)&&!!(this.words[r]&i);},o.prototype.imaskn=function(t){n("number"==typeof t&&t>=0);var e=t%26,r=(t-e)/26;if(n(0===this.negative,"imaskn works only with positive numbers"),this.length<=r)return this;if(0!==e&&r++,this.length=Math.min(r,this.length),0!==e){var i=67108863^67108863>>>e<<e;this.words[this.length-1]&=i;}return this._strip();},o.prototype.maskn=function(t){return this.clone().imaskn(t);},o.prototype.iaddn=function(t){return n("number"==typeof t),n(t<67108864),t<0?this.isubn(-t):0!==this.negative?1===this.length&&(0|this.words[0])<=t?(this.words[0]=t-(0|this.words[0]),this.negative=0,this):(this.negative=0,this.isubn(t),this.negative=1,this):this._iaddn(t);},o.prototype._iaddn=function(t){this.words[0]+=t;for(var e=0;e<this.length&&this.words[e]>=67108864;e++){this.words[e]-=67108864,e===this.length-1?this.words[e+1]=1:this.words[e+1]++;}return this.length=Math.max(this.length,e+1),this;},o.prototype.isubn=function(t){if(n("number"==typeof t),n(t<67108864),t<0)return this.iaddn(-t);if(0!==this.negative)return this.negative=0,this.iaddn(t),this.negative=1,this;if(this.words[0]-=t,1===this.length&&this.words[0]<0)this.words[0]=-this.words[0],this.negative=1;else for(var e=0;e<this.length&&this.words[e]<0;e++){this.words[e]+=67108864,this.words[e+1]-=1;}return this._strip();},o.prototype.addn=function(t){return this.clone().iaddn(t);},o.prototype.subn=function(t){return this.clone().isubn(t);},o.prototype.iabs=function(){return this.negative=0,this;},o.prototype.abs=function(){return this.clone().iabs();},o.prototype._ishlnsubmul=function(t,e,r){var i,o,a=t.length+r;this._expand(a);var s=0;for(i=0;i<t.length;i++){o=(0|this.words[i+r])+s;var f=(0|t.words[i])*e;s=((o-=67108863&f)>>26)-(f/67108864|0),this.words[i+r]=67108863&o;}for(;i<this.length-r;i++){s=(o=(0|this.words[i+r])+s)>>26,this.words[i+r]=67108863&o;}if(0===s)return this._strip();for(n(-1===s),s=0,i=0;i<this.length;i++){s=(o=-(0|this.words[i])+s)>>26,this.words[i]=67108863&o;}return this.negative=1,this._strip();},o.prototype._wordDiv=function(t,e){var r=(this.length,t.length),n=this.clone(),i=t,a=0|i.words[i.length-1];0!==(r=26-this._countBits(a))&&(i=i.ushln(r),n.iushln(r),a=0|i.words[i.length-1]);var s,f=n.length-i.length;if("mod"!==e){(s=new o(null)).length=f+1,s.words=new Array(s.length);for(var u=0;u<s.length;u++){s.words[u]=0;}}var c=n.clone()._ishlnsubmul(i,1,f);0===c.negative&&(n=c,s&&(s.words[f]=1));for(var h=f-1;h>=0;h--){var d=67108864*(0|n.words[i.length+h])+(0|n.words[i.length+h-1]);for(d=Math.min(d/a|0,67108863),n._ishlnsubmul(i,d,h);0!==n.negative;){d--,n.negative=0,n._ishlnsubmul(i,1,h),n.isZero()||(n.negative^=1);}s&&(s.words[h]=d);}return s&&s._strip(),n._strip(),"div"!==e&&0!==r&&n.iushrn(r),{div:s||null,mod:n};},o.prototype.divmod=function(t,e,r){return n(!t.isZero()),this.isZero()?{div:new o(0),mod:new o(0)}:0!==this.negative&&0===t.negative?(s=this.neg().divmod(t,e),"mod"!==e&&(i=s.div.neg()),"div"!==e&&(a=s.mod.neg(),r&&0!==a.negative&&a.iadd(t)),{div:i,mod:a}):0===this.negative&&0!==t.negative?(s=this.divmod(t.neg(),e),"mod"!==e&&(i=s.div.neg()),{div:i,mod:s.mod}):0!=(this.negative&t.negative)?(s=this.neg().divmod(t.neg(),e),"div"!==e&&(a=s.mod.neg(),r&&0!==a.negative&&a.isub(t)),{div:s.div,mod:a}):t.length>this.length||this.cmp(t)<0?{div:new o(0),mod:this}:1===t.length?"div"===e?{div:this.divn(t.words[0]),mod:null}:"mod"===e?{div:null,mod:new o(this.modrn(t.words[0]))}:{div:this.divn(t.words[0]),mod:new o(this.modrn(t.words[0]))}:this._wordDiv(t,e);var i,a,s;},o.prototype.div=function(t){return this.divmod(t,"div",!1).div;},o.prototype.mod=function(t){return this.divmod(t,"mod",!1).mod;},o.prototype.umod=function(t){return this.divmod(t,"mod",!0).mod;},o.prototype.divRound=function(t){var e=this.divmod(t);if(e.mod.isZero())return e.div;var r=0!==e.div.negative?e.mod.isub(t):e.mod,n=t.ushrn(1),i=t.andln(1),o=r.cmp(n);return o<0||1===i&&0===o?e.div:0!==e.div.negative?e.div.isubn(1):e.div.iaddn(1);},o.prototype.modrn=function(t){var e=t<0;e&&(t=-t),n(t<=67108863);for(var r=(1<<26)%t,i=0,o=this.length-1;o>=0;o--){i=(r*i+(0|this.words[o]))%t;}return e?-i:i;},o.prototype.modn=function(t){return this.modrn(t);},o.prototype.idivn=function(t){var e=t<0;e&&(t=-t),n(t<=67108863);for(var r=0,i=this.length-1;i>=0;i--){var o=(0|this.words[i])+67108864*r;this.words[i]=o/t|0,r=o%t;}return this._strip(),e?this.ineg():this;},o.prototype.divn=function(t){return this.clone().idivn(t);},o.prototype.egcd=function(t){n(0===t.negative),n(!t.isZero());var e=this,r=t.clone();e=0!==e.negative?e.umod(t):e.clone();for(var i=new o(1),a=new o(0),s=new o(0),f=new o(1),u=0;e.isEven()&&r.isEven();){e.iushrn(1),r.iushrn(1),++u;}for(var c=r.clone(),h=e.clone();!e.isZero();){for(var d=0,l=1;0==(e.words[0]&l)&&d<26;++d,l<<=1){;}if(d>0)for(e.iushrn(d);d-->0;){(i.isOdd()||a.isOdd())&&(i.iadd(c),a.isub(h)),i.iushrn(1),a.iushrn(1);}for(var p=0,b=1;0==(r.words[0]&b)&&p<26;++p,b<<=1){;}if(p>0)for(r.iushrn(p);p-->0;){(s.isOdd()||f.isOdd())&&(s.iadd(c),f.isub(h)),s.iushrn(1),f.iushrn(1);}e.cmp(r)>=0?(e.isub(r),i.isub(s),a.isub(f)):(r.isub(e),s.isub(i),f.isub(a));}return{a:s,b:f,gcd:r.iushln(u)};},o.prototype._invmp=function(t){n(0===t.negative),n(!t.isZero());var e=this,r=t.clone();e=0!==e.negative?e.umod(t):e.clone();for(var i,a=new o(1),s=new o(0),f=r.clone();e.cmpn(1)>0&&r.cmpn(1)>0;){for(var u=0,c=1;0==(e.words[0]&c)&&u<26;++u,c<<=1){;}if(u>0)for(e.iushrn(u);u-->0;){a.isOdd()&&a.iadd(f),a.iushrn(1);}for(var h=0,d=1;0==(r.words[0]&d)&&h<26;++h,d<<=1){;}if(h>0)for(r.iushrn(h);h-->0;){s.isOdd()&&s.iadd(f),s.iushrn(1);}e.cmp(r)>=0?(e.isub(r),a.isub(s)):(r.isub(e),s.isub(a));}return(i=0===e.cmpn(1)?a:s).cmpn(0)<0&&i.iadd(t),i;},o.prototype.gcd=function(t){if(this.isZero())return t.abs();if(t.isZero())return this.abs();var e=this.clone(),r=t.clone();e.negative=0,r.negative=0;for(var n=0;e.isEven()&&r.isEven();n++){e.iushrn(1),r.iushrn(1);}for(;;){for(;e.isEven();){e.iushrn(1);}for(;r.isEven();){r.iushrn(1);}var i=e.cmp(r);if(i<0){var o=e;e=r,r=o;}else if(0===i||0===r.cmpn(1))break;e.isub(r);}return r.iushln(n);},o.prototype.invm=function(t){return this.egcd(t).a.umod(t);},o.prototype.isEven=function(){return 0==(1&this.words[0]);},o.prototype.isOdd=function(){return 1==(1&this.words[0]);},o.prototype.andln=function(t){return this.words[0]&t;},o.prototype.bincn=function(t){n("number"==typeof t);var e=t%26,r=(t-e)/26,i=1<<e;if(this.length<=r)return this._expand(r+1),this.words[r]|=i,this;for(var o=i,a=r;0!==o&&a<this.length;a++){var s=0|this.words[a];o=(s+=o)>>>26,s&=67108863,this.words[a]=s;}return 0!==o&&(this.words[a]=o,this.length++),this;},o.prototype.isZero=function(){return 1===this.length&&0===this.words[0];},o.prototype.cmpn=function(t){var e,r=t<0;if(0!==this.negative&&!r)return-1;if(0===this.negative&&r)return 1;if(this._strip(),this.length>1)e=1;else{r&&(t=-t),n(t<=67108863,"Number is too big");var i=0|this.words[0];e=i===t?0:i<t?-1:1;}return 0!==this.negative?0|-e:e;},o.prototype.cmp=function(t){if(0!==this.negative&&0===t.negative)return-1;if(0===this.negative&&0!==t.negative)return 1;var e=this.ucmp(t);return 0!==this.negative?0|-e:e;},o.prototype.ucmp=function(t){if(this.length>t.length)return 1;if(this.length<t.length)return-1;for(var e=0,r=this.length-1;r>=0;r--){var n=0|this.words[r],i=0|t.words[r];if(n!==i){n<i?e=-1:n>i&&(e=1);break;}}return e;},o.prototype.gtn=function(t){return 1===this.cmpn(t);},o.prototype.gt=function(t){return 1===this.cmp(t);},o.prototype.gten=function(t){return this.cmpn(t)>=0;},o.prototype.gte=function(t){return this.cmp(t)>=0;},o.prototype.ltn=function(t){return-1===this.cmpn(t);},o.prototype.lt=function(t){return-1===this.cmp(t);},o.prototype.lten=function(t){return this.cmpn(t)<=0;},o.prototype.lte=function(t){return this.cmp(t)<=0;},o.prototype.eqn=function(t){return 0===this.cmpn(t);},o.prototype.eq=function(t){return 0===this.cmp(t);},o.red=function(t){return new k(t);},o.prototype.toRed=function(t){return n(!this.red,"Already a number in reduction context"),n(0===this.negative,"red works only with positives"),t.convertTo(this)._forceRed(t);},o.prototype.fromRed=function(){return n(this.red,"fromRed works only with numbers in reduction context"),this.red.convertFrom(this);},o.prototype._forceRed=function(t){return this.red=t,this;},o.prototype.forceRed=function(t){return n(!this.red,"Already a number in reduction context"),this._forceRed(t);},o.prototype.redAdd=function(t){return n(this.red,"redAdd works only with red numbers"),this.red.add(this,t);},o.prototype.redIAdd=function(t){return n(this.red,"redIAdd works only with red numbers"),this.red.iadd(this,t);},o.prototype.redSub=function(t){return n(this.red,"redSub works only with red numbers"),this.red.sub(this,t);},o.prototype.redISub=function(t){return n(this.red,"redISub works only with red numbers"),this.red.isub(this,t);},o.prototype.redShl=function(t){return n(this.red,"redShl works only with red numbers"),this.red.shl(this,t);},o.prototype.redMul=function(t){return n(this.red,"redMul works only with red numbers"),this.red._verify2(this,t),this.red.mul(this,t);},o.prototype.redIMul=function(t){return n(this.red,"redMul works only with red numbers"),this.red._verify2(this,t),this.red.imul(this,t);},o.prototype.redSqr=function(){return n(this.red,"redSqr works only with red numbers"),this.red._verify1(this),this.red.sqr(this);},o.prototype.redISqr=function(){return n(this.red,"redISqr works only with red numbers"),this.red._verify1(this),this.red.isqr(this);},o.prototype.redSqrt=function(){return n(this.red,"redSqrt works only with red numbers"),this.red._verify1(this),this.red.sqrt(this);},o.prototype.redInvm=function(){return n(this.red,"redInvm works only with red numbers"),this.red._verify1(this),this.red.invm(this);},o.prototype.redNeg=function(){return n(this.red,"redNeg works only with red numbers"),this.red._verify1(this),this.red.neg(this);},o.prototype.redPow=function(t){return n(this.red&&!t.red,"redPow(normalNum)"),this.red._verify1(this),this.red.pow(this,t);};var m={k256:null,p224:null,p192:null,p25519:null};function w(t,e){this.name=t,this.p=new o(e,16),this.n=this.p.bitLength(),this.k=new o(1).iushln(this.n).isub(this.p),this.tmp=this._tmp();}function _(){w.call(this,"k256","ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f");}function S(){w.call(this,"p224","ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001");}function M(){w.call(this,"p192","ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff");}function E(){w.call(this,"25519","7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed");}function k(t){if("string"==typeof t){var e=o._prime(t);this.m=e.p,this.prime=e;}else n(t.gtn(1),"modulus must be greater than 1"),this.m=t,this.prime=null;}function x(t){k.call(this,t),this.shift=this.m.bitLength(),this.shift%26!=0&&(this.shift+=26-this.shift%26),this.r=new o(1).iushln(this.shift),this.r2=this.imod(this.r.sqr()),this.rinv=this.r._invmp(this.m),this.minv=this.rinv.mul(this.r).isubn(1).div(this.m),this.minv=this.minv.umod(this.r),this.minv=this.r.sub(this.minv);}w.prototype._tmp=function(){var t=new o(null);return t.words=new Array(Math.ceil(this.n/13)),t;},w.prototype.ireduce=function(t){var e,r=t;do{this.split(r,this.tmp),e=(r=(r=this.imulK(r)).iadd(this.tmp)).bitLength();}while(e>this.n);var n=e<this.n?-1:r.ucmp(this.p);return 0===n?(r.words[0]=0,r.length=1):n>0?r.isub(this.p):void 0!==r.strip?r.strip():r._strip(),r;},w.prototype.split=function(t,e){t.iushrn(this.n,0,e);},w.prototype.imulK=function(t){return t.imul(this.k);},i(_,w),_.prototype.split=function(t,e){for(var r=4194303,n=Math.min(t.length,9),i=0;i<n;i++){e.words[i]=t.words[i];}if(e.length=n,t.length<=9)return t.words[0]=0,void(t.length=1);var o=t.words[9];for(e.words[e.length++]=o&r,i=10;i<t.length;i++){var a=0|t.words[i];t.words[i-10]=(a&r)<<4|o>>>22,o=a;}o>>>=22,t.words[i-10]=o,0===o&&t.length>10?t.length-=10:t.length-=9;},_.prototype.imulK=function(t){t.words[t.length]=0,t.words[t.length+1]=0,t.length+=2;for(var e=0,r=0;r<t.length;r++){var n=0|t.words[r];e+=977*n,t.words[r]=67108863&e,e=64*n+(e/67108864|0);}return 0===t.words[t.length-1]&&(t.length--,0===t.words[t.length-1]&&t.length--),t;},i(S,w),i(M,w),i(E,w),E.prototype.imulK=function(t){for(var e=0,r=0;r<t.length;r++){var n=19*(0|t.words[r])+e,i=67108863&n;n>>>=26,t.words[r]=i,e=n;}return 0!==e&&(t.words[t.length++]=e),t;},o._prime=function(t){if(m[t])return m[t];var e;if("k256"===t)e=new _();else if("p224"===t)e=new S();else if("p192"===t)e=new M();else{if("p25519"!==t)throw new Error("Unknown prime "+t);e=new E();}return m[t]=e,e;},k.prototype._verify1=function(t){n(0===t.negative,"red works only with positives"),n(t.red,"red works only with red numbers");},k.prototype._verify2=function(t,e){n(0==(t.negative|e.negative),"red works only with positives"),n(t.red&&t.red===e.red,"red works only with red numbers");},k.prototype.imod=function(t){return this.prime?this.prime.ireduce(t)._forceRed(this):(u(t,t.umod(this.m)._forceRed(this)),t);},k.prototype.neg=function(t){return t.isZero()?t.clone():this.m.sub(t)._forceRed(this);},k.prototype.add=function(t,e){this._verify2(t,e);var r=t.add(e);return r.cmp(this.m)>=0&&r.isub(this.m),r._forceRed(this);},k.prototype.iadd=function(t,e){this._verify2(t,e);var r=t.iadd(e);return r.cmp(this.m)>=0&&r.isub(this.m),r;},k.prototype.sub=function(t,e){this._verify2(t,e);var r=t.sub(e);return r.cmpn(0)<0&&r.iadd(this.m),r._forceRed(this);},k.prototype.isub=function(t,e){this._verify2(t,e);var r=t.isub(e);return r.cmpn(0)<0&&r.iadd(this.m),r;},k.prototype.shl=function(t,e){return this._verify1(t),this.imod(t.ushln(e));},k.prototype.imul=function(t,e){return this._verify2(t,e),this.imod(t.imul(e));},k.prototype.mul=function(t,e){return this._verify2(t,e),this.imod(t.mul(e));},k.prototype.isqr=function(t){return this.imul(t,t.clone());},k.prototype.sqr=function(t){return this.mul(t,t);},k.prototype.sqrt=function(t){if(t.isZero())return t.clone();var e=this.m.andln(3);if(n(e%2==1),3===e){var r=this.m.add(new o(1)).iushrn(2);return this.pow(t,r);}for(var i=this.m.subn(1),a=0;!i.isZero()&&0===i.andln(1);){a++,i.iushrn(1);}n(!i.isZero());var s=new o(1).toRed(this),f=s.redNeg(),u=this.m.subn(1).iushrn(1),c=this.m.bitLength();for(c=new o(2*c*c).toRed(this);0!==this.pow(c,u).cmp(f);){c.redIAdd(f);}for(var h=this.pow(c,i),d=this.pow(t,i.addn(1).iushrn(1)),l=this.pow(t,i),p=a;0!==l.cmp(s);){for(var b=l,v=0;0!==b.cmp(s);v++){b=b.redSqr();}n(v<p);var g=this.pow(h,new o(1).iushln(p-v-1));d=d.redMul(g),h=g.redSqr(),l=l.redMul(h),p=v;}return d;},k.prototype.invm=function(t){var e=t._invmp(this.m);return 0!==e.negative?(e.negative=0,this.imod(e).redNeg()):this.imod(e);},k.prototype.pow=function(t,e){if(e.isZero())return new o(1).toRed(this);if(0===e.cmpn(1))return t.clone();var r=new Array(16);r[0]=new o(1).toRed(this),r[1]=t;for(var n=2;n<r.length;n++){r[n]=this.mul(r[n-1],t);}var i=r[0],a=0,s=0,f=e.bitLength()%26;for(0===f&&(f=26),n=e.length-1;n>=0;n--){for(var u=e.words[n],c=f-1;c>=0;c--){var h=u>>c&1;i!==r[0]&&(i=this.sqr(i)),0!==h||0!==a?(a<<=1,a|=h,(4===++s||0===n&&0===c)&&(i=this.mul(i,r[a]),s=0,a=0)):s=0;}f=26;}return i;},k.prototype.convertTo=function(t){var e=t.umod(this.m);return e===t?e.clone():e;},k.prototype.convertFrom=function(t){var e=t.clone();return e.red=null,e;},o.mont=function(t){return new x(t);},i(x,k),x.prototype.convertTo=function(t){return this.imod(t.ushln(this.shift));},x.prototype.convertFrom=function(t){var e=this.imod(t.mul(this.rinv));return e.red=null,e;},x.prototype.imul=function(t,e){if(t.isZero()||e.isZero())return t.words[0]=0,t.length=1,t;var r=t.imul(e),n=r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),i=r.isub(n).iushrn(this.shift),o=i;return i.cmp(this.m)>=0?o=i.isub(this.m):i.cmpn(0)<0&&(o=i.iadd(this.m)),o._forceRed(this);},x.prototype.mul=function(t,e){if(t.isZero()||e.isZero())return new o(0)._forceRed(this);var r=t.mul(e),n=r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),i=r.isub(n).iushrn(this.shift),a=i;return i.cmp(this.m)>=0?a=i.isub(this.m):i.cmpn(0)<0&&(a=i.iadd(this.m)),a._forceRed(this);},x.prototype.invm=function(t){return this.imod(t._invmp(this.m).mul(this.r2))._forceRed(this);};}(void 0===e||e,this);},{21:21}],20:[function(t,e,r){var n;function i(t){this.rand=t;}if(e.exports=function(t){return n||(n=new i(null)),n.generate(t);},e.exports.Rand=i,i.prototype.generate=function(t){return this._rand(t);},i.prototype._rand=function(t){if(this.rand.getBytes)return this.rand.getBytes(t);for(var e=new Uint8Array(t),r=0;r<e.length;r++){e[r]=this.rand.getByte();}return e;},"object"==(typeof self==="undefined"?"undefined":_typeof(self)))self.crypto&&self.crypto.getRandomValues?i.prototype._rand=function(t){var e=new Uint8Array(t);return self.crypto.getRandomValues(e),e;}:self.msCrypto&&self.msCrypto.getRandomValues?i.prototype._rand=function(t){var e=new Uint8Array(t);return self.msCrypto.getRandomValues(e),e;}:"object"==(typeof window==="undefined"?"undefined":_typeof(window))&&(i.prototype._rand=function(){throw new Error("Not implemented yet");});else try{var o=t(21);if("function"!=typeof o.randomBytes)throw new Error("Not supported");i.prototype._rand=function(t){return o.randomBytes(t);};}catch(t){}},{21:21}],21:[function(t,e,r){},{}],22:[function(t,e,r){var n=t(515).Buffer;function i(t){n.isBuffer(t)||(t=n.from(t));for(var e=t.length/4|0,r=new Array(e),i=0;i<e;i++){r[i]=t.readUInt32BE(4*i);}return r;}function o(t){for(;0<t.length;t++){t[0]=0;}}function a(t,e,r,n,i){for(var o,a,s,f,u=r[0],c=r[1],h=r[2],d=r[3],l=t[0]^e[0],p=t[1]^e[1],b=t[2]^e[2],v=t[3]^e[3],g=4,y=1;y<i;y++){o=u[l>>>24]^c[p>>>16&255]^h[b>>>8&255]^d[255&v]^e[g++],a=u[p>>>24]^c[b>>>16&255]^h[v>>>8&255]^d[255&l]^e[g++],s=u[b>>>24]^c[v>>>16&255]^h[l>>>8&255]^d[255&p]^e[g++],f=u[v>>>24]^c[l>>>16&255]^h[p>>>8&255]^d[255&b]^e[g++],l=o,p=a,b=s,v=f;}return o=(n[l>>>24]<<24|n[p>>>16&255]<<16|n[b>>>8&255]<<8|n[255&v])^e[g++],a=(n[p>>>24]<<24|n[b>>>16&255]<<16|n[v>>>8&255]<<8|n[255&l])^e[g++],s=(n[b>>>24]<<24|n[v>>>16&255]<<16|n[l>>>8&255]<<8|n[255&p])^e[g++],f=(n[v>>>24]<<24|n[l>>>16&255]<<16|n[p>>>8&255]<<8|n[255&b])^e[g++],[o>>>=0,a>>>=0,s>>>=0,f>>>=0];}var s=[0,1,2,4,8,16,32,64,128,27,54],f=function(){for(var t=new Array(256),e=0;e<256;e++){t[e]=e<128?e<<1:e<<1^283;}for(var r=[],n=[],i=[[],[],[],[]],o=[[],[],[],[]],a=0,s=0,f=0;f<256;++f){var u=s^s<<1^s<<2^s<<3^s<<4;u=u>>>8^255&u^99,r[a]=u,n[u]=a;var c=t[a],h=t[c],d=t[h],l=257*t[u]^16843008*u;i[0][a]=l<<24|l>>>8,i[1][a]=l<<16|l>>>16,i[2][a]=l<<8|l>>>24,i[3][a]=l,l=16843009*d^65537*h^257*c^16843008*a,o[0][u]=l<<24|l>>>8,o[1][u]=l<<16|l>>>16,o[2][u]=l<<8|l>>>24,o[3][u]=l,0===a?a=s=1:(a=c^t[t[t[d^c]]],s^=t[t[s]]);}return{SBOX:r,INV_SBOX:n,SUB_MIX:i,INV_SUB_MIX:o};}();function u(t){this._key=i(t),this._reset();}u.blockSize=16,u.keySize=32,u.prototype.blockSize=u.blockSize,u.prototype.keySize=u.keySize,u.prototype._reset=function(){for(var t=this._key,e=t.length,r=e+6,n=4*(r+1),i=[],o=0;o<e;o++){i[o]=t[o];}for(o=e;o<n;o++){var a=i[o-1];o%e==0?(a=a<<8|a>>>24,a=f.SBOX[a>>>24]<<24|f.SBOX[a>>>16&255]<<16|f.SBOX[a>>>8&255]<<8|f.SBOX[255&a],a^=s[o/e|0]<<24):e>6&&o%e==4&&(a=f.SBOX[a>>>24]<<24|f.SBOX[a>>>16&255]<<16|f.SBOX[a>>>8&255]<<8|f.SBOX[255&a]),i[o]=i[o-e]^a;}for(var u=[],c=0;c<n;c++){var h=n-c,d=i[h-(c%4?0:4)];u[c]=c<4||h<=4?d:f.INV_SUB_MIX[0][f.SBOX[d>>>24]]^f.INV_SUB_MIX[1][f.SBOX[d>>>16&255]]^f.INV_SUB_MIX[2][f.SBOX[d>>>8&255]]^f.INV_SUB_MIX[3][f.SBOX[255&d]];}this._nRounds=r,this._keySchedule=i,this._invKeySchedule=u;},u.prototype.encryptBlockRaw=function(t){return a(t=i(t),this._keySchedule,f.SUB_MIX,f.SBOX,this._nRounds);},u.prototype.encryptBlock=function(t){var e=this.encryptBlockRaw(t),r=n.allocUnsafe(16);return r.writeUInt32BE(e[0],0),r.writeUInt32BE(e[1],4),r.writeUInt32BE(e[2],8),r.writeUInt32BE(e[3],12),r;},u.prototype.decryptBlock=function(t){var e=(t=i(t))[1];t[1]=t[3],t[3]=e;var r=a(t,this._invKeySchedule,f.INV_SUB_MIX,f.INV_SBOX,this._nRounds),o=n.allocUnsafe(16);return o.writeUInt32BE(r[0],0),o.writeUInt32BE(r[3],4),o.writeUInt32BE(r[2],8),o.writeUInt32BE(r[1],12),o;},u.prototype.scrub=function(){o(this._keySchedule),o(this._invKeySchedule),o(this._key);},e.exports.AES=u;},{515:515}],23:[function(t,e,r){var n=t(22),i=t(515).Buffer,o=t(69),a=t(468),s=t(27),f=t(67),u=t(28);function c(t,e,r,a){o.call(this);var f=i.alloc(4,0);this._cipher=new n.AES(e);var c=this._cipher.encryptBlock(f);this._ghash=new s(c),r=function(t,e,r){if(12===e.length)return t._finID=i.concat([e,i.from([0,0,0,1])]),i.concat([e,i.from([0,0,0,2])]);var n=new s(r),o=e.length,a=o%16;n.update(e),a&&(a=16-a,n.update(i.alloc(a,0))),n.update(i.alloc(8,0));var f=8*o,c=i.alloc(8);c.writeUIntBE(f,0,8),n.update(c),t._finID=n.state;var h=i.from(t._finID);return u(h),h;}(this,r,c),this._prev=i.from(r),this._cache=i.allocUnsafe(0),this._secCache=i.allocUnsafe(0),this._decrypt=a,this._alen=0,this._len=0,this._mode=t,this._authTag=null,this._called=!1;}a(c,o),c.prototype._update=function(t){if(!this._called&&this._alen){var e=16-this._alen%16;e<16&&(e=i.alloc(e,0),this._ghash.update(e));}this._called=!0;var r=this._mode.encrypt(this,t);return this._decrypt?this._ghash.update(t):this._ghash.update(r),this._len+=t.length,r;},c.prototype._final=function(){if(this._decrypt&&!this._authTag)throw new Error("Unsupported state or unable to authenticate data");var t=f(this._ghash["final"](8*this._alen,8*this._len),this._cipher.encryptBlock(this._finID));if(this._decrypt&&function(t,e){var r=0;t.length!==e.length&&r++;for(var n=Math.min(t.length,e.length),i=0;i<n;++i){r+=t[i]^e[i];}return r;}(t,this._authTag))throw new Error("Unsupported state or unable to authenticate data");this._authTag=t,this._cipher.scrub();},c.prototype.getAuthTag=function(){if(this._decrypt||!i.isBuffer(this._authTag))throw new Error("Attempting to get auth tag in unsupported state");return this._authTag;},c.prototype.setAuthTag=function(t){if(!this._decrypt)throw new Error("Attempting to set auth tag in unsupported state");this._authTag=t;},c.prototype.setAAD=function(t){if(this._called)throw new Error("Attempting to set AAD in unsupported state");this._ghash.update(t),this._alen+=t.length;},e.exports=c;},{22:22,27:27,28:28,468:468,515:515,67:67,69:69}],24:[function(t,e,r){var n=t(26),i=t(25),o=t(36);r.createCipher=r.Cipher=n.createCipher,r.createCipheriv=r.Cipheriv=n.createCipheriv,r.createDecipher=r.Decipher=i.createDecipher,r.createDecipheriv=r.Decipheriv=i.createDecipheriv,r.listCiphers=r.getCiphers=function(){return Object.keys(o);};},{25:25,26:26,36:36}],25:[function(t,e,r){var n=t(23),i=t(515).Buffer,o=t(35),a=t(38),s=t(69),f=t(22),u=t(436);function c(t,e,r){s.call(this),this._cache=new h(),this._last=void 0,this._cipher=new f.AES(e),this._prev=i.from(r),this._mode=t,this._autopadding=!0;}function h(){this.cache=i.allocUnsafe(0);}function d(t,e,r){var s=o[t.toLowerCase()];if(!s)throw new TypeError("invalid suite type");if("string"==typeof r&&(r=i.from(r)),"GCM"!==s.mode&&r.length!==s.iv)throw new TypeError("invalid iv length "+r.length);if("string"==typeof e&&(e=i.from(e)),e.length!==s.key/8)throw new TypeError("invalid key length "+e.length);return"stream"===s.type?new a(s.module,e,r,!0):"auth"===s.type?new n(s.module,e,r,!0):new c(s.module,e,r);}t(468)(c,s),c.prototype._update=function(t){var e,r;this._cache.add(t);for(var n=[];e=this._cache.get(this._autopadding);){r=this._mode.decrypt(this,e),n.push(r);}return i.concat(n);},c.prototype._final=function(){var t=this._cache.flush();if(this._autopadding)return function(t){var e=t[15];if(e<1||e>16)throw new Error("unable to decrypt data");var r=-1;for(;++r<e;){if(t[r+(16-e)]!==e)throw new Error("unable to decrypt data");}if(16===e)return;return t.slice(0,16-e);}(this._mode.decrypt(this,t));if(t)throw new Error("data not multiple of block length");},c.prototype.setAutoPadding=function(t){return this._autopadding=!!t,this;},h.prototype.add=function(t){this.cache=i.concat([this.cache,t]);},h.prototype.get=function(t){var e;if(t){if(this.cache.length>16)return e=this.cache.slice(0,16),this.cache=this.cache.slice(16),e;}else if(this.cache.length>=16)return e=this.cache.slice(0,16),this.cache=this.cache.slice(16),e;return null;},h.prototype.flush=function(){if(this.cache.length)return this.cache;},r.createDecipher=function(t,e){var r=o[t.toLowerCase()];if(!r)throw new TypeError("invalid suite type");var n=u(e,!1,r.key,r.iv);return d(t,n.key,n.iv);},r.createDecipheriv=d;},{22:22,23:23,35:35,38:38,436:436,468:468,515:515,69:69}],26:[function(t,e,r){var n=t(35),i=t(23),o=t(515).Buffer,a=t(38),s=t(69),f=t(22),u=t(436);function c(t,e,r){s.call(this),this._cache=new d(),this._cipher=new f.AES(e),this._prev=o.from(r),this._mode=t,this._autopadding=!0;}t(468)(c,s),c.prototype._update=function(t){var e,r;this._cache.add(t);for(var n=[];e=this._cache.get();){r=this._mode.encrypt(this,e),n.push(r);}return o.concat(n);};var h=o.alloc(16,16);function d(){this.cache=o.allocUnsafe(0);}function l(t,e,r){var s=n[t.toLowerCase()];if(!s)throw new TypeError("invalid suite type");if("string"==typeof e&&(e=o.from(e)),e.length!==s.key/8)throw new TypeError("invalid key length "+e.length);if("string"==typeof r&&(r=o.from(r)),"GCM"!==s.mode&&r.length!==s.iv)throw new TypeError("invalid iv length "+r.length);return"stream"===s.type?new a(s.module,e,r):"auth"===s.type?new i(s.module,e,r):new c(s.module,e,r);}c.prototype._final=function(){var t=this._cache.flush();if(this._autopadding)return t=this._mode.encrypt(this,t),this._cipher.scrub(),t;if(!t.equals(h))throw this._cipher.scrub(),new Error("data not multiple of block length");},c.prototype.setAutoPadding=function(t){return this._autopadding=!!t,this;},d.prototype.add=function(t){this.cache=o.concat([this.cache,t]);},d.prototype.get=function(){if(this.cache.length>15){var t=this.cache.slice(0,16);return this.cache=this.cache.slice(16),t;}return null;},d.prototype.flush=function(){for(var t=16-this.cache.length,e=o.allocUnsafe(t),r=-1;++r<t;){e.writeUInt8(t,r);}return o.concat([this.cache,e]);},r.createCipheriv=l,r.createCipher=function(t,e){var r=n[t.toLowerCase()];if(!r)throw new TypeError("invalid suite type");var i=u(e,!1,r.key,r.iv);return l(t,i.key,i.iv);};},{22:22,23:23,35:35,38:38,436:436,468:468,515:515,69:69}],27:[function(t,e,r){var n=t(515).Buffer,i=n.alloc(16,0);function o(t){var e=n.allocUnsafe(16);return e.writeUInt32BE(t[0]>>>0,0),e.writeUInt32BE(t[1]>>>0,4),e.writeUInt32BE(t[2]>>>0,8),e.writeUInt32BE(t[3]>>>0,12),e;}function a(t){this.h=t,this.state=n.alloc(16,0),this.cache=n.allocUnsafe(0);}a.prototype.ghash=function(t){for(var e=-1;++e<t.length;){this.state[e]^=t[e];}this._multiply();},a.prototype._multiply=function(){for(var t,e,r,n=[(t=this.h).readUInt32BE(0),t.readUInt32BE(4),t.readUInt32BE(8),t.readUInt32BE(12)],i=[0,0,0,0],a=-1;++a<128;){for(0!=(this.state[~~(a/8)]&1<<7-a%8)&&(i[0]^=n[0],i[1]^=n[1],i[2]^=n[2],i[3]^=n[3]),r=0!=(1&n[3]),e=3;e>0;e--){n[e]=n[e]>>>1|(1&n[e-1])<<31;}n[0]=n[0]>>>1,r&&(n[0]=n[0]^225<<24);}this.state=o(i);},a.prototype.update=function(t){var e;for(this.cache=n.concat([this.cache,t]);this.cache.length>=16;){e=this.cache.slice(0,16),this.cache=this.cache.slice(16),this.ghash(e);}},a.prototype["final"]=function(t,e){return this.cache.length&&this.ghash(n.concat([this.cache,i],16)),this.ghash(o([0,t,0,e])),this.state;},e.exports=a;},{515:515}],28:[function(t,e,r){e.exports=function(t){for(var e,r=t.length;r--;){if(255!==(e=t.readUInt8(r))){e++,t.writeUInt8(e,r);break;}t.writeUInt8(0,r);}};},{}],29:[function(t,e,r){var n=t(67);r.encrypt=function(t,e){var r=n(e,t._prev);return t._prev=t._cipher.encryptBlock(r),t._prev;},r.decrypt=function(t,e){var r=t._prev;t._prev=e;var i=t._cipher.decryptBlock(e);return n(i,r);};},{67:67}],30:[function(t,e,r){var n=t(515).Buffer,i=t(67);function o(t,e,r){var o=e.length,a=i(e,t._cache);return t._cache=t._cache.slice(o),t._prev=n.concat([t._prev,r?e:a]),a;}r.encrypt=function(t,e,r){for(var i,a=n.allocUnsafe(0);e.length;){if(0===t._cache.length&&(t._cache=t._cipher.encryptBlock(t._prev),t._prev=n.allocUnsafe(0)),!(t._cache.length<=e.length)){a=n.concat([a,o(t,e,r)]);break;}i=t._cache.length,a=n.concat([a,o(t,e.slice(0,i),r)]),e=e.slice(i);}return a;};},{515:515,67:67}],31:[function(t,e,r){var n=t(515).Buffer;function i(t,e,r){for(var n,i,a=-1,s=0;++a<8;){n=e&1<<7-a?128:0,s+=(128&(i=t._cipher.encryptBlock(t._prev)[0]^n))>>a%8,t._prev=o(t._prev,r?n:i);}return s;}function o(t,e){var r=t.length,i=-1,o=n.allocUnsafe(t.length);for(t=n.concat([t,n.from([e])]);++i<r;){o[i]=t[i]<<1|t[i+1]>>7;}return o;}r.encrypt=function(t,e,r){for(var o=e.length,a=n.allocUnsafe(o),s=-1;++s<o;){a[s]=i(t,e[s],r);}return a;};},{515:515}],32:[function(t,e,r){var n=t(515).Buffer;function i(t,e,r){var i=t._cipher.encryptBlock(t._prev)[0]^e;return t._prev=n.concat([t._prev.slice(1),n.from([r?e:i])]),i;}r.encrypt=function(t,e,r){for(var o=e.length,a=n.allocUnsafe(o),s=-1;++s<o;){a[s]=i(t,e[s],r);}return a;};},{515:515}],33:[function(t,e,r){var n=t(67),i=t(515).Buffer,o=t(28);function a(t){var e=t._cipher.encryptBlockRaw(t._prev);return o(t._prev),e;}r.encrypt=function(t,e){var r=Math.ceil(e.length/16),o=t._cache.length;t._cache=i.concat([t._cache,i.allocUnsafe(16*r)]);for(var s=0;s<r;s++){var f=a(t),u=o+16*s;t._cache.writeUInt32BE(f[0],u+0),t._cache.writeUInt32BE(f[1],u+4),t._cache.writeUInt32BE(f[2],u+8),t._cache.writeUInt32BE(f[3],u+12);}var c=t._cache.slice(0,e.length);return t._cache=t._cache.slice(e.length),n(e,c);};},{28:28,515:515,67:67}],34:[function(t,e,r){r.encrypt=function(t,e){return t._cipher.encryptBlock(e);},r.decrypt=function(t,e){return t._cipher.decryptBlock(e);};},{}],35:[function(t,e,r){var n={ECB:t(34),CBC:t(29),CFB:t(30),CFB8:t(32),CFB1:t(31),OFB:t(37),CTR:t(33),GCM:t(33)},i=t(36);for(var o in i){i[o].module=n[i[o].mode];}e.exports=i;},{29:29,30:30,31:31,32:32,33:33,34:34,36:36,37:37}],36:[function(t,e,r){e.exports={"aes-128-ecb":{cipher:"AES",key:128,iv:0,mode:"ECB",type:"block"},"aes-192-ecb":{cipher:"AES",key:192,iv:0,mode:"ECB",type:"block"},"aes-256-ecb":{cipher:"AES",key:256,iv:0,mode:"ECB",type:"block"},"aes-128-cbc":{cipher:"AES",key:128,iv:16,mode:"CBC",type:"block"},"aes-192-cbc":{cipher:"AES",key:192,iv:16,mode:"CBC",type:"block"},"aes-256-cbc":{cipher:"AES",key:256,iv:16,mode:"CBC",type:"block"},aes128:{cipher:"AES",key:128,iv:16,mode:"CBC",type:"block"},aes192:{cipher:"AES",key:192,iv:16,mode:"CBC",type:"block"},aes256:{cipher:"AES",key:256,iv:16,mode:"CBC",type:"block"},"aes-128-cfb":{cipher:"AES",key:128,iv:16,mode:"CFB",type:"stream"},"aes-192-cfb":{cipher:"AES",key:192,iv:16,mode:"CFB",type:"stream"},"aes-256-cfb":{cipher:"AES",key:256,iv:16,mode:"CFB",type:"stream"},"aes-128-cfb8":{cipher:"AES",key:128,iv:16,mode:"CFB8",type:"stream"},"aes-192-cfb8":{cipher:"AES",key:192,iv:16,mode:"CFB8",type:"stream"},"aes-256-cfb8":{cipher:"AES",key:256,iv:16,mode:"CFB8",type:"stream"},"aes-128-cfb1":{cipher:"AES",key:128,iv:16,mode:"CFB1",type:"stream"},"aes-192-cfb1":{cipher:"AES",key:192,iv:16,mode:"CFB1",type:"stream"},"aes-256-cfb1":{cipher:"AES",key:256,iv:16,mode:"CFB1",type:"stream"},"aes-128-ofb":{cipher:"AES",key:128,iv:16,mode:"OFB",type:"stream"},"aes-192-ofb":{cipher:"AES",key:192,iv:16,mode:"OFB",type:"stream"},"aes-256-ofb":{cipher:"AES",key:256,iv:16,mode:"OFB",type:"stream"},"aes-128-ctr":{cipher:"AES",key:128,iv:16,mode:"CTR",type:"stream"},"aes-192-ctr":{cipher:"AES",key:192,iv:16,mode:"CTR",type:"stream"},"aes-256-ctr":{cipher:"AES",key:256,iv:16,mode:"CTR",type:"stream"},"aes-128-gcm":{cipher:"AES",key:128,iv:12,mode:"GCM",type:"auth"},"aes-192-gcm":{cipher:"AES",key:192,iv:12,mode:"GCM",type:"auth"},"aes-256-gcm":{cipher:"AES",key:256,iv:12,mode:"GCM",type:"auth"}};},{}],37:[function(t,e,r){(function(e){(function(){var n=t(67);function i(t){return t._prev=t._cipher.encryptBlock(t._prev),t._prev;}r.encrypt=function(t,r){for(;t._cache.length<r.length;){t._cache=e.concat([t._cache,i(t)]);}var o=t._cache.slice(0,r.length);return t._cache=t._cache.slice(r.length),n(r,o);};}).call(this);}).call(this,t(68).Buffer);},{67:67,68:68}],38:[function(t,e,r){var n=t(22),i=t(515).Buffer,o=t(69);function a(t,e,r,a){o.call(this),this._cipher=new n.AES(e),this._prev=i.from(r),this._cache=i.allocUnsafe(0),this._secCache=i.allocUnsafe(0),this._decrypt=a,this._mode=t;}t(468)(a,o),a.prototype._update=function(t){return this._mode.encrypt(this,t,this._decrypt);},a.prototype._final=function(){this._cipher.scrub();},e.exports=a;},{22:22,468:468,515:515,69:69}],39:[function(t,e,r){var n=t(40),i=t(24),o=t(35),a=t(41),s=t(436);function f(t,e,r){if(t=t.toLowerCase(),o[t])return i.createCipheriv(t,e,r);if(a[t])return new n({key:e,iv:r,mode:t});throw new TypeError("invalid suite type");}function u(t,e,r){if(t=t.toLowerCase(),o[t])return i.createDecipheriv(t,e,r);if(a[t])return new n({key:e,iv:r,mode:t,decrypt:!0});throw new TypeError("invalid suite type");}r.createCipher=r.Cipher=function(t,e){var r,n;if(t=t.toLowerCase(),o[t])r=o[t].key,n=o[t].iv;else{if(!a[t])throw new TypeError("invalid suite type");r=8*a[t].key,n=a[t].iv;}var i=s(e,!1,r,n);return f(t,i.key,i.iv);},r.createCipheriv=r.Cipheriv=f,r.createDecipher=r.Decipher=function(t,e){var r,n;if(t=t.toLowerCase(),o[t])r=o[t].key,n=o[t].iv;else{if(!a[t])throw new TypeError("invalid suite type");r=8*a[t].key,n=a[t].iv;}var i=s(e,!1,r,n);return u(t,i.key,i.iv);},r.createDecipheriv=r.Decipheriv=u,r.listCiphers=r.getCiphers=function(){return Object.keys(a).concat(i.getCiphers());};},{24:24,35:35,40:40,41:41,436:436}],40:[function(t,e,r){var n=t(69),i=t(407),o=t(468),a=t(515).Buffer,s={"des-ede3-cbc":i.CBC.instantiate(i.EDE),"des-ede3":i.EDE,"des-ede-cbc":i.CBC.instantiate(i.EDE),"des-ede":i.EDE,"des-cbc":i.CBC.instantiate(i.DES),"des-ecb":i.DES};function f(t){n.call(this);var e,r=t.mode.toLowerCase(),i=s[r];e=t.decrypt?"decrypt":"encrypt";var o=t.key;a.isBuffer(o)||(o=a.from(o)),"des-ede"!==r&&"des-ede-cbc"!==r||(o=a.concat([o,o.slice(0,8)]));var f=t.iv;a.isBuffer(f)||(f=a.from(f)),this._des=i.create({key:o,iv:f,type:e});}s.des=s["des-cbc"],s.des3=s["des-ede3-cbc"],e.exports=f,o(f,n),f.prototype._update=function(t){return a.from(this._des.update(t));},f.prototype._final=function(){return a.from(this._des["final"]());};},{407:407,468:468,515:515,69:69}],41:[function(t,e,r){r["des-ecb"]={key:8,iv:0},r["des-cbc"]=r.des={key:8,iv:8},r["des-ede3-cbc"]=r.des3={key:24,iv:8},r["des-ede3"]={key:24,iv:0},r["des-ede-cbc"]={key:16,iv:8},r["des-ede"]={key:16,iv:0};},{}],42:[function(t,e,r){(function(r){(function(){var n=t(43),i=t(498);function o(t,e){var i=function(t){var e=a(t);return{blinder:e.toRed(n.mont(t.modulus)).redPow(new n(t.publicExponent)).fromRed(),unblinder:e.invm(t.modulus)};}(e),o=e.modulus.byteLength(),s=(n.mont(e.modulus),new n(t).mul(i.blinder).umod(e.modulus)),f=s.toRed(n.mont(e.prime1)),u=s.toRed(n.mont(e.prime2)),c=e.coefficient,h=e.prime1,d=e.prime2,l=f.redPow(e.exponent1),p=u.redPow(e.exponent2);l=l.fromRed(),p=p.fromRed();var b=l.isub(p).imul(c).umod(h);return b.imul(d),p.iadd(b),new r(p.imul(i.unblinder).umod(e.modulus).toArray(!1,o));}function a(t){for(var e=t.modulus.byteLength(),r=new n(i(e));r.cmp(t.modulus)>=0||!r.umod(t.prime1)||!r.umod(t.prime2);){r=new n(i(e));}return r;}e.exports=o,o.getr=a;}).call(this);}).call(this,t(68).Buffer);},{43:43,498:498,68:68}],43:[function(t,e,r){arguments[4][16][0].apply(r,arguments);},{16:16,21:21}],44:[function(t,e,r){e.exports=t(45);},{45:45}],45:[function(t,e,r){e.exports={sha224WithRSAEncryption:{sign:"rsa",hash:"sha224",id:"302d300d06096086480165030402040500041c"},"RSA-SHA224":{sign:"ecdsa/rsa",hash:"sha224",id:"302d300d06096086480165030402040500041c"},sha256WithRSAEncryption:{sign:"rsa",hash:"sha256",id:"3031300d060960864801650304020105000420"},"RSA-SHA256":{sign:"ecdsa/rsa",hash:"sha256",id:"3031300d060960864801650304020105000420"},sha384WithRSAEncryption:{sign:"rsa",hash:"sha384",id:"3041300d060960864801650304020205000430"},"RSA-SHA384":{sign:"ecdsa/rsa",hash:"sha384",id:"3041300d060960864801650304020205000430"},sha512WithRSAEncryption:{sign:"rsa",hash:"sha512",id:"3051300d060960864801650304020305000440"},"RSA-SHA512":{sign:"ecdsa/rsa",hash:"sha512",id:"3051300d060960864801650304020305000440"},"RSA-SHA1":{sign:"rsa",hash:"sha1",id:"3021300906052b0e03021a05000414"},"ecdsa-with-SHA1":{sign:"ecdsa",hash:"sha1",id:""},sha256:{sign:"ecdsa",hash:"sha256",id:""},sha224:{sign:"ecdsa",hash:"sha224",id:""},sha384:{sign:"ecdsa",hash:"sha384",id:""},sha512:{sign:"ecdsa",hash:"sha512",id:""},"DSA-SHA":{sign:"dsa",hash:"sha1",id:""},"DSA-SHA1":{sign:"dsa",hash:"sha1",id:""},DSA:{sign:"dsa",hash:"sha1",id:""},"DSA-WITH-SHA224":{sign:"dsa",hash:"sha224",id:""},"DSA-SHA224":{sign:"dsa",hash:"sha224",id:""},"DSA-WITH-SHA256":{sign:"dsa",hash:"sha256",id:""},"DSA-SHA256":{sign:"dsa",hash:"sha256",id:""},"DSA-WITH-SHA384":{sign:"dsa",hash:"sha384",id:""},"DSA-SHA384":{sign:"dsa",hash:"sha384",id:""},"DSA-WITH-SHA512":{sign:"dsa",hash:"sha512",id:""},"DSA-SHA512":{sign:"dsa",hash:"sha512",id:""},"DSA-RIPEMD160":{sign:"dsa",hash:"rmd160",id:""},ripemd160WithRSA:{sign:"rsa",hash:"rmd160",id:"3021300906052b2403020105000414"},"RSA-RIPEMD160":{sign:"rsa",hash:"rmd160",id:"3021300906052b2403020105000414"},md5WithRSAEncryption:{sign:"rsa",hash:"md5",id:"3020300c06082a864886f70d020505000410"},"RSA-MD5":{sign:"rsa",hash:"md5",id:"3020300c06082a864886f70d020505000410"}};},{}],46:[function(t,e,r){e.exports={"1.3.132.0.10":"secp256k1","1.3.132.0.33":"p224","1.2.840.10045.3.1.1":"p192","1.2.840.10045.3.1.7":"p256","1.3.132.0.34":"p384","1.3.132.0.35":"p521"};},{}],47:[function(t,e,r){var n=t(65).Buffer,i=t(402),o=t(64),a=t(468),s=t(48),f=t(49),u=t(45);function c(t){o.Writable.call(this);var e=u[t];if(!e)throw new Error("Unknown message digest");this._hashType=e.hash,this._hash=i(e.hash),this._tag=e.id,this._signType=e.sign;}function h(t){o.Writable.call(this);var e=u[t];if(!e)throw new Error("Unknown message digest");this._hash=i(e.hash),this._tag=e.id,this._signType=e.sign;}function d(t){return new c(t);}function l(t){return new h(t);}Object.keys(u).forEach(function(t){u[t].id=n.from(u[t].id,"hex"),u[t.toLowerCase()]=u[t];}),a(c,o.Writable),c.prototype._write=function(t,e,r){this._hash.update(t),r();},c.prototype.update=function(t,e){return"string"==typeof t&&(t=n.from(t,e)),this._hash.update(t),this;},c.prototype.sign=function(t,e){this.end();var r=this._hash.digest(),n=s(r,t,this._hashType,this._signType,this._tag);return e?n.toString(e):n;},a(h,o.Writable),h.prototype._write=function(t,e,r){this._hash.update(t),r();},h.prototype.update=function(t,e){return"string"==typeof t&&(t=n.from(t,e)),this._hash.update(t),this;},h.prototype.verify=function(t,e,r){"string"==typeof e&&(e=n.from(e,r)),this.end();var i=this._hash.digest();return f(e,i,t,this._signType,this._tag);},e.exports={Sign:d,Verify:l,createSign:d,createVerify:l};},{402:402,45:45,468:468,48:48,49:49,64:64,65:65}],48:[function(t,e,r){var n=t(65).Buffer,i=t(404),o=t(42),a=t(418).ec,s=t(19),f=t(481),u=t(46);function c(t,e,r,o){if((t=n.from(t.toArray())).length<e.byteLength()){var a=n.alloc(e.byteLength()-t.length);t=n.concat([a,t]);}var s=r.length,f=function(t,e){t=(t=h(t,e)).mod(e);var r=n.from(t.toArray());if(r.length<e.byteLength()){var i=n.alloc(e.byteLength()-r.length);r=n.concat([i,r]);}return r;}(r,e),u=n.alloc(s);u.fill(1);var c=n.alloc(s);return c=i(o,c).update(u).update(n.from([0])).update(t).update(f).digest(),u=i(o,c).update(u).digest(),{k:c=i(o,c).update(u).update(n.from([1])).update(t).update(f).digest(),v:u=i(o,c).update(u).digest()};}function h(t,e){var r=new s(t),n=(t.length<<3)-e.bitLength();return n>0&&r.ishrn(n),r;}function d(t,e,r){var o,a;do{for(o=n.alloc(0);8*o.length<t.bitLength();){e.v=i(r,e.k).update(e.v).digest(),o=n.concat([o,e.v]);}a=h(o,t),e.k=i(r,e.k).update(e.v).update(n.from([0])).digest(),e.v=i(r,e.k).update(e.v).digest();}while(-1!==a.cmp(t));return a;}function l(t,e,r,n){return t.toRed(s.mont(r)).redPow(e).fromRed().mod(n);}e.exports=function(t,e,r,i,p){var b=f(e);if(b.curve){if("ecdsa"!==i&&"ecdsa/rsa"!==i)throw new Error("wrong private key type");return function(t,e){var r=u[e.curve.join(".")];if(!r)throw new Error("unknown curve "+e.curve.join("."));var i=new a(r).keyFromPrivate(e.privateKey).sign(t);return n.from(i.toDER());}(t,b);}if("dsa"===b.type){if("dsa"!==i)throw new Error("wrong private key type");return function(t,e,r){var i,o=e.params.priv_key,a=e.params.p,f=e.params.q,u=e.params.g,p=new s(0),b=h(t,f).mod(f),v=!1,g=c(o,f,t,r);for(;!1===v;){p=l(u,i=d(f,g,r),a,f),0===(v=i.invm(f).imul(b.add(o.mul(p))).mod(f)).cmpn(0)&&(v=!1,p=new s(0));}return function(t,e){t=t.toArray(),e=e.toArray(),128&t[0]&&(t=[0].concat(t));128&e[0]&&(e=[0].concat(e));var r=[48,t.length+e.length+4,2,t.length];return r=r.concat(t,[2,e.length],e),n.from(r);}(p,v);}(t,b,r);}if("rsa"!==i&&"ecdsa/rsa"!==i)throw new Error("wrong private key type");t=n.concat([p,t]);for(var v=b.modulus.byteLength(),g=[0,1];t.length+g.length+1<v;){g.push(255);}g.push(0);for(var y=-1;++y<t.length;){g.push(t[y]);}return o(g,b);},e.exports.getKey=c,e.exports.makeKey=d;},{19:19,404:404,418:418,42:42,46:46,481:481,65:65}],49:[function(t,e,r){var n=t(65).Buffer,i=t(19),o=t(418).ec,a=t(481),s=t(46);function f(t,e){if(t.cmpn(0)<=0)throw new Error("invalid sig");if(t.cmp(e)>=e)throw new Error("invalid sig");}e.exports=function(t,e,r,u,c){var h=a(r);if("ec"===h.type){if("ecdsa"!==u&&"ecdsa/rsa"!==u)throw new Error("wrong public key type");return function(t,e,r){var n=s[r.data.algorithm.curve.join(".")];if(!n)throw new Error("unknown curve "+r.data.algorithm.curve.join("."));var i=new o(n),a=r.data.subjectPrivateKey.data;return i.verify(e,t,a);}(t,e,h);}if("dsa"===h.type){if("dsa"!==u)throw new Error("wrong public key type");return function(t,e,r){var n=r.data.p,o=r.data.q,s=r.data.g,u=r.data.pub_key,c=a.signature.decode(t,"der"),h=c.s,d=c.r;f(h,o),f(d,o);var l=i.mont(n),p=h.invm(o);return 0===s.toRed(l).redPow(new i(e).mul(p).mod(o)).fromRed().mul(u.toRed(l).redPow(d.mul(p).mod(o)).fromRed()).mod(n).mod(o).cmp(d);}(t,e,h);}if("rsa"!==u&&"ecdsa/rsa"!==u)throw new Error("wrong public key type");e=n.concat([c,e]);for(var d=h.modulus.byteLength(),l=[1],p=0;e.length+l.length+2<d;){l.push(255),p++;}l.push(0);for(var b=-1;++b<e.length;){l.push(e[b]);}l=n.from(l);var v=i.mont(h.modulus);t=(t=new i(t).toRed(v)).redPow(new i(h.publicExponent)),t=n.from(t.fromRed().toArray());var g=p<8?1:0;for(d=Math.min(t.length,l.length),t.length!==l.length&&(g=1),b=-1;++b<d;){g|=t[b]^l[b];}return 0===g;};},{19:19,418:418,46:46,481:481,65:65}],50:[function(t,e,r){"use strict";var n={};function i(t,e,r){r||(r=Error);var i=function(t){var r,n;function i(r,n,i){return t.call(this,function(t,r,n){return"string"==typeof e?e:e(t,r,n);}(r,n,i))||this;}return n=t,(r=i).prototype=Object.create(n.prototype),r.prototype.constructor=r,r.__proto__=n,i;}(r);i.prototype.name=r.name,i.prototype.code=t,n[t]=i;}function o(t,e){if(Array.isArray(t)){var r=t.length;return t=t.map(function(t){return String(t);}),r>2?"one of ".concat(e," ").concat(t.slice(0,r-1).join(", "),", or ")+t[r-1]:2===r?"one of ".concat(e," ").concat(t[0]," or ").concat(t[1]):"of ".concat(e," ").concat(t[0]);}return"of ".concat(e," ").concat(String(t));}i("ERR_INVALID_OPT_VALUE",function(t,e){return'The value "'+e+'" is invalid for option "'+t+'"';},TypeError),i("ERR_INVALID_ARG_TYPE",function(t,e,r){var n,i,a,s;if("string"==typeof e&&(i="not ",e.substr(!a||a<0?0:+a,i.length)===i)?(n="must not be",e=e.replace(/^not /,"")):n="must be",function(t,e,r){return(void 0===r||r>t.length)&&(r=t.length),t.substring(r-e.length,r)===e;}(t," argument"))s="The ".concat(t," ").concat(n," ").concat(o(e,"type"));else{var f=function(t,e,r){return"number"!=typeof r&&(r=0),!(r+e.length>t.length)&&-1!==t.indexOf(e,r);}(t,".")?"property":"argument";s='The "'.concat(t,'" ').concat(f," ").concat(n," ").concat(o(e,"type"));}return s+=". Received type ".concat(_typeof(r));},TypeError),i("ERR_STREAM_PUSH_AFTER_EOF","stream.push() after EOF"),i("ERR_METHOD_NOT_IMPLEMENTED",function(t){return"The "+t+" method is not implemented";}),i("ERR_STREAM_PREMATURE_CLOSE","Premature close"),i("ERR_STREAM_DESTROYED",function(t){return"Cannot call "+t+" after a stream was destroyed";}),i("ERR_MULTIPLE_CALLBACK","Callback called multiple times"),i("ERR_STREAM_CANNOT_PIPE","Cannot pipe, not readable"),i("ERR_STREAM_WRITE_AFTER_END","write after end"),i("ERR_STREAM_NULL_VALUES","May not write null values to stream",TypeError),i("ERR_UNKNOWN_ENCODING",function(t){return"Unknown encoding: "+t;},TypeError),i("ERR_STREAM_UNSHIFT_AFTER_END_EVENT","stream.unshift() after end event"),e.exports.codes=n;},{}],51:[function(t,e,r){(function(r){(function(){"use strict";var n=Object.keys||function(t){var e=[];for(var r in t){e.push(r);}return e;};e.exports=u;var i=t(53),o=t(55);t(468)(u,i);for(var a=n(o.prototype),s=0;s<a.length;s++){var f=a[s];u.prototype[f]||(u.prototype[f]=o.prototype[f]);}function u(t){if(!(this instanceof u))return new u(t);i.call(this,t),o.call(this,t),this.allowHalfOpen=!0,t&&(!1===t.readable&&(this.readable=!1),!1===t.writable&&(this.writable=!1),!1===t.allowHalfOpen&&(this.allowHalfOpen=!1,this.once("end",c)));}function c(){this._writableState.ended||r.nextTick(h,this);}function h(t){t.end();}Object.defineProperty(u.prototype,"writableHighWaterMark",{enumerable:!1,get:function get(){return this._writableState.highWaterMark;}}),Object.defineProperty(u.prototype,"writableBuffer",{enumerable:!1,get:function get(){return this._writableState&&this._writableState.getBuffer();}}),Object.defineProperty(u.prototype,"writableLength",{enumerable:!1,get:function get(){return this._writableState.length;}}),Object.defineProperty(u.prototype,"destroyed",{enumerable:!1,get:function get(){return void 0!==this._readableState&&void 0!==this._writableState&&this._readableState.destroyed&&this._writableState.destroyed;},set:function set(t){void 0!==this._readableState&&void 0!==this._writableState&&(this._readableState.destroyed=t,this._writableState.destroyed=t);}});}).call(this);}).call(this,t(489));},{468:468,489:489,53:53,55:55}],52:[function(t,e,r){"use strict";e.exports=i;var n=t(54);function i(t){if(!(this instanceof i))return new i(t);n.call(this,t);}t(468)(i,n),i.prototype._transform=function(t,e,r){r(null,t);};},{468:468,54:54}],53:[function(t,e,r){(function(r,n){(function(){"use strict";var i;e.exports=k,k.ReadableState=E;t(435).EventEmitter;var o=function o(t,e){return t.listeners(e).length;},a=t(63),s=t(68).Buffer,f=n.Uint8Array||function(){};var u,c=t(21);u=c&&c.debuglog?c.debuglog("stream"):function(){};var h,d,l,p=t(57),b=t(58),v=t(62).getHighWaterMark,g=t(50).codes,y=g.ERR_INVALID_ARG_TYPE,m=g.ERR_STREAM_PUSH_AFTER_EOF,w=g.ERR_METHOD_NOT_IMPLEMENTED,_=g.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;t(468)(k,a);var S=b.errorOrDestroy,M=["error","close","destroy","pause","resume"];function E(e,r,n){i=i||t(51),e=e||{},"boolean"!=typeof n&&(n=r instanceof i),this.objectMode=!!e.objectMode,n&&(this.objectMode=this.objectMode||!!e.readableObjectMode),this.highWaterMark=v(this,e,"readableHighWaterMark",n),this.buffer=new p(),this.length=0,this.pipes=null,this.pipesCount=0,this.flowing=null,this.ended=!1,this.endEmitted=!1,this.reading=!1,this.sync=!0,this.needReadable=!1,this.emittedReadable=!1,this.readableListening=!1,this.resumeScheduled=!1,this.paused=!0,this.emitClose=!1!==e.emitClose,this.autoDestroy=!!e.autoDestroy,this.destroyed=!1,this.defaultEncoding=e.defaultEncoding||"utf8",this.awaitDrain=0,this.readingMore=!1,this.decoder=null,this.encoding=null,e.encoding&&(h||(h=t(527).StringDecoder),this.decoder=new h(e.encoding),this.encoding=e.encoding);}function k(e){if(i=i||t(51),!(this instanceof k))return new k(e);var r=this instanceof i;this._readableState=new E(e,this,r),this.readable=!0,e&&("function"==typeof e.read&&(this._read=e.read),"function"==typeof e.destroy&&(this._destroy=e.destroy)),a.call(this);}function x(t,e,r,n,i){u("readableAddChunk",e);var o,a=t._readableState;if(null===e)a.reading=!1,function(t,e){if(u("onEofChunk"),e.ended)return;if(e.decoder){var r=e.decoder.end();r&&r.length&&(e.buffer.push(r),e.length+=e.objectMode?1:r.length);}e.ended=!0,e.sync?I(t):(e.needReadable=!1,e.emittedReadable||(e.emittedReadable=!0,B(t)));}(t,a);else if(i||(o=function(t,e){var r;n=e,s.isBuffer(n)||n instanceof f||"string"==typeof e||void 0===e||t.objectMode||(r=new y("chunk",["string","Buffer","Uint8Array"],e));var n;return r;}(a,e)),o)S(t,o);else if(a.objectMode||e&&e.length>0){if("string"==typeof e||a.objectMode||Object.getPrototypeOf(e)===s.prototype||(e=function(t){return s.from(t);}(e)),n)a.endEmitted?S(t,new _()):A(t,a,e,!0);else if(a.ended)S(t,new m());else{if(a.destroyed)return!1;a.reading=!1,a.decoder&&!r?(e=a.decoder.write(e),a.objectMode||0!==e.length?A(t,a,e,!1):P(t,a)):A(t,a,e,!1);}}else n||(a.reading=!1,P(t,a));return!a.ended&&(a.length<a.highWaterMark||0===a.length);}function A(t,e,r,n){e.flowing&&0===e.length&&!e.sync?(e.awaitDrain=0,t.emit("data",r)):(e.length+=e.objectMode?1:r.length,n?e.buffer.unshift(r):e.buffer.push(r),e.needReadable&&I(t)),P(t,e);}Object.defineProperty(k.prototype,"destroyed",{enumerable:!1,get:function get(){return void 0!==this._readableState&&this._readableState.destroyed;},set:function set(t){this._readableState&&(this._readableState.destroyed=t);}}),k.prototype.destroy=b.destroy,k.prototype._undestroy=b.undestroy,k.prototype._destroy=function(t,e){e(t);},k.prototype.push=function(t,e){var r,n=this._readableState;return n.objectMode?r=!0:"string"==typeof t&&((e=e||n.defaultEncoding)!==n.encoding&&(t=s.from(t,e),e=""),r=!0),x(this,t,e,!1,r);},k.prototype.unshift=function(t){return x(this,t,null,!0,!1);},k.prototype.isPaused=function(){return!1===this._readableState.flowing;},k.prototype.setEncoding=function(e){h||(h=t(527).StringDecoder);var r=new h(e);this._readableState.decoder=r,this._readableState.encoding=this._readableState.decoder.encoding;for(var n=this._readableState.buffer.head,i="";null!==n;){i+=r.write(n.data),n=n.next;}return this._readableState.buffer.clear(),""!==i&&this._readableState.buffer.push(i),this._readableState.length=i.length,this;};var R=1073741824;function T(t,e){return t<=0||0===e.length&&e.ended?0:e.objectMode?1:t!=t?e.flowing&&e.length?e.buffer.head.data.length:e.length:(t>e.highWaterMark&&(e.highWaterMark=function(t){return t>=R?t=R:(t--,t|=t>>>1,t|=t>>>2,t|=t>>>4,t|=t>>>8,t|=t>>>16,t++),t;}(t)),t<=e.length?t:e.ended?e.length:(e.needReadable=!0,0));}function I(t){var e=t._readableState;u("emitReadable",e.needReadable,e.emittedReadable),e.needReadable=!1,e.emittedReadable||(u("emitReadable",e.flowing),e.emittedReadable=!0,r.nextTick(B,t));}function B(t){var e=t._readableState;u("emitReadable_",e.destroyed,e.length,e.ended),e.destroyed||!e.length&&!e.ended||(t.emit("readable"),e.emittedReadable=!1),e.needReadable=!e.flowing&&!e.ended&&e.length<=e.highWaterMark,N(t);}function P(t,e){e.readingMore||(e.readingMore=!0,r.nextTick(O,t,e));}function O(t,e){for(;!e.reading&&!e.ended&&(e.length<e.highWaterMark||e.flowing&&0===e.length);){var r=e.length;if(u("maybeReadMore read 0"),t.read(0),r===e.length)break;}e.readingMore=!1;}function C(t){var e=t._readableState;e.readableListening=t.listenerCount("readable")>0,e.resumeScheduled&&!e.paused?e.flowing=!0:t.listenerCount("data")>0&&t.resume();}function L(t){u("readable nexttick read 0"),t.read(0);}function j(t,e){u("resume",e.reading),e.reading||t.read(0),e.resumeScheduled=!1,t.emit("resume"),N(t),e.flowing&&!e.reading&&t.read(0);}function N(t){var e=t._readableState;for(u("flow",e.flowing);e.flowing&&null!==t.read();){;}}function D(t,e){return 0===e.length?null:(e.objectMode?r=e.buffer.shift():!t||t>=e.length?(r=e.decoder?e.buffer.join(""):1===e.buffer.length?e.buffer.first():e.buffer.concat(e.length),e.buffer.clear()):r=e.buffer.consume(t,e.decoder),r);var r;}function U(t){var e=t._readableState;u("endReadable",e.endEmitted),e.endEmitted||(e.ended=!0,r.nextTick(F,e,t));}function F(t,e){if(u("endReadableNT",t.endEmitted,t.length),!t.endEmitted&&0===t.length&&(t.endEmitted=!0,e.readable=!1,e.emit("end"),t.autoDestroy)){var r=e._writableState;(!r||r.autoDestroy&&r.finished)&&e.destroy();}}function q(t,e){for(var r=0,n=t.length;r<n;r++){if(t[r]===e)return r;}return-1;}k.prototype.read=function(t){u("read",t),t=parseInt(t,10);var e=this._readableState,r=t;if(0!==t&&(e.emittedReadable=!1),0===t&&e.needReadable&&((0!==e.highWaterMark?e.length>=e.highWaterMark:e.length>0)||e.ended))return u("read: emitReadable",e.length,e.ended),0===e.length&&e.ended?U(this):I(this),null;if(0===(t=T(t,e))&&e.ended)return 0===e.length&&U(this),null;var n,i=e.needReadable;return u("need readable",i),(0===e.length||e.length-t<e.highWaterMark)&&u("length less than watermark",i=!0),e.ended||e.reading?u("reading or ended",i=!1):i&&(u("do read"),e.reading=!0,e.sync=!0,0===e.length&&(e.needReadable=!0),this._read(e.highWaterMark),e.sync=!1,e.reading||(t=T(r,e))),null===(n=t>0?D(t,e):null)?(e.needReadable=e.length<=e.highWaterMark,t=0):(e.length-=t,e.awaitDrain=0),0===e.length&&(e.ended||(e.needReadable=!0),r!==t&&e.ended&&U(this)),null!==n&&this.emit("data",n),n;},k.prototype._read=function(t){S(this,new w("_read()"));},k.prototype.pipe=function(t,e){var n=this,i=this._readableState;switch(i.pipesCount){case 0:i.pipes=t;break;case 1:i.pipes=[i.pipes,t];break;default:i.pipes.push(t);}i.pipesCount+=1,u("pipe count=%d opts=%j",i.pipesCount,e);var a=(!e||!1!==e.end)&&t!==r.stdout&&t!==r.stderr?f:v;function s(e,r){u("onunpipe"),e===n&&r&&!1===r.hasUnpiped&&(r.hasUnpiped=!0,u("cleanup"),t.removeListener("close",p),t.removeListener("finish",b),t.removeListener("drain",c),t.removeListener("error",l),t.removeListener("unpipe",s),n.removeListener("end",f),n.removeListener("end",v),n.removeListener("data",d),h=!0,!i.awaitDrain||t._writableState&&!t._writableState.needDrain||c());}function f(){u("onend"),t.end();}i.endEmitted?r.nextTick(a):n.once("end",a),t.on("unpipe",s);var c=function(t){return function(){var e=t._readableState;u("pipeOnDrain",e.awaitDrain),e.awaitDrain&&e.awaitDrain--,0===e.awaitDrain&&o(t,"data")&&(e.flowing=!0,N(t));};}(n);t.on("drain",c);var h=!1;function d(e){u("ondata");var r=t.write(e);u("dest.write",r),!1===r&&((1===i.pipesCount&&i.pipes===t||i.pipesCount>1&&-1!==q(i.pipes,t))&&!h&&(u("false write response, pause",i.awaitDrain),i.awaitDrain++),n.pause());}function l(e){u("onerror",e),v(),t.removeListener("error",l),0===o(t,"error")&&S(t,e);}function p(){t.removeListener("finish",b),v();}function b(){u("onfinish"),t.removeListener("close",p),v();}function v(){u("unpipe"),n.unpipe(t);}return n.on("data",d),function(t,e,r){if("function"==typeof t.prependListener)return t.prependListener(e,r);t._events&&t._events[e]?Array.isArray(t._events[e])?t._events[e].unshift(r):t._events[e]=[r,t._events[e]]:t.on(e,r);}(t,"error",l),t.once("close",p),t.once("finish",b),t.emit("pipe",n),i.flowing||(u("pipe resume"),n.resume()),t;},k.prototype.unpipe=function(t){var e=this._readableState,r={hasUnpiped:!1};if(0===e.pipesCount)return this;if(1===e.pipesCount)return t&&t!==e.pipes||(t||(t=e.pipes),e.pipes=null,e.pipesCount=0,e.flowing=!1,t&&t.emit("unpipe",this,r)),this;if(!t){var n=e.pipes,i=e.pipesCount;e.pipes=null,e.pipesCount=0,e.flowing=!1;for(var o=0;o<i;o++){n[o].emit("unpipe",this,{hasUnpiped:!1});}return this;}var a=q(e.pipes,t);return-1===a||(e.pipes.splice(a,1),e.pipesCount-=1,1===e.pipesCount&&(e.pipes=e.pipes[0]),t.emit("unpipe",this,r)),this;},k.prototype.on=function(t,e){var n=a.prototype.on.call(this,t,e),i=this._readableState;return"data"===t?(i.readableListening=this.listenerCount("readable")>0,!1!==i.flowing&&this.resume()):"readable"===t&&(i.endEmitted||i.readableListening||(i.readableListening=i.needReadable=!0,i.flowing=!1,i.emittedReadable=!1,u("on readable",i.length,i.reading),i.length?I(this):i.reading||r.nextTick(L,this))),n;},k.prototype.addListener=k.prototype.on,k.prototype.removeListener=function(t,e){var n=a.prototype.removeListener.call(this,t,e);return"readable"===t&&r.nextTick(C,this),n;},k.prototype.removeAllListeners=function(t){var e=a.prototype.removeAllListeners.apply(this,arguments);return"readable"!==t&&void 0!==t||r.nextTick(C,this),e;},k.prototype.resume=function(){var t=this._readableState;return t.flowing||(u("resume"),t.flowing=!t.readableListening,function(t,e){e.resumeScheduled||(e.resumeScheduled=!0,r.nextTick(j,t,e));}(this,t)),t.paused=!1,this;},k.prototype.pause=function(){return u("call pause flowing=%j",this._readableState.flowing),!1!==this._readableState.flowing&&(u("pause"),this._readableState.flowing=!1,this.emit("pause")),this._readableState.paused=!0,this;},k.prototype.wrap=function(t){var e=this,r=this._readableState,n=!1;for(var i in t.on("end",function(){if(u("wrapped end"),r.decoder&&!r.ended){var t=r.decoder.end();t&&t.length&&e.push(t);}e.push(null);}),t.on("data",function(i){(u("wrapped data"),r.decoder&&(i=r.decoder.write(i)),r.objectMode&&null==i)||(r.objectMode||i&&i.length)&&(e.push(i)||(n=!0,t.pause()));}),t){void 0===this[i]&&"function"==typeof t[i]&&(this[i]=function(e){return function(){return t[e].apply(t,arguments);};}(i));}for(var o=0;o<M.length;o++){t.on(M[o],this.emit.bind(this,M[o]));}return this._read=function(e){u("wrapped _read",e),n&&(n=!1,t.resume());},this;},"function"==typeof Symbol&&(k.prototype[Symbol.asyncIterator]=function(){return void 0===d&&(d=t(56)),d(this);}),Object.defineProperty(k.prototype,"readableHighWaterMark",{enumerable:!1,get:function get(){return this._readableState.highWaterMark;}}),Object.defineProperty(k.prototype,"readableBuffer",{enumerable:!1,get:function get(){return this._readableState&&this._readableState.buffer;}}),Object.defineProperty(k.prototype,"readableFlowing",{enumerable:!1,get:function get(){return this._readableState.flowing;},set:function set(t){this._readableState&&(this._readableState.flowing=t);}}),k._fromList=D,Object.defineProperty(k.prototype,"readableLength",{enumerable:!1,get:function get(){return this._readableState.length;}}),"function"==typeof Symbol&&(k.from=function(e,r){return void 0===l&&(l=t(60)),l(k,e,r);});}).call(this);}).call(this,t(489),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});},{21:21,435:435,468:468,489:489,50:50,51:51,527:527,56:56,57:57,58:58,60:60,62:62,63:63,68:68}],54:[function(t,e,r){"use strict";e.exports=c;var n=t(50).codes,i=n.ERR_METHOD_NOT_IMPLEMENTED,o=n.ERR_MULTIPLE_CALLBACK,a=n.ERR_TRANSFORM_ALREADY_TRANSFORMING,s=n.ERR_TRANSFORM_WITH_LENGTH_0,f=t(51);function u(t,e){var r=this._transformState;r.transforming=!1;var n=r.writecb;if(null===n)return this.emit("error",new o());r.writechunk=null,r.writecb=null,null!=e&&this.push(e),n(t);var i=this._readableState;i.reading=!1,(i.needReadable||i.length<i.highWaterMark)&&this._read(i.highWaterMark);}function c(t){if(!(this instanceof c))return new c(t);f.call(this,t),this._transformState={afterTransform:u.bind(this),needTransform:!1,transforming:!1,writecb:null,writechunk:null,writeencoding:null},this._readableState.needReadable=!0,this._readableState.sync=!1,t&&("function"==typeof t.transform&&(this._transform=t.transform),"function"==typeof t.flush&&(this._flush=t.flush)),this.on("prefinish",h);}function h(){var t=this;"function"!=typeof this._flush||this._readableState.destroyed?d(this,null,null):this._flush(function(e,r){d(t,e,r);});}function d(t,e,r){if(e)return t.emit("error",e);if(null!=r&&t.push(r),t._writableState.length)throw new s();if(t._transformState.transforming)throw new a();return t.push(null);}t(468)(c,f),c.prototype.push=function(t,e){return this._transformState.needTransform=!1,f.prototype.push.call(this,t,e);},c.prototype._transform=function(t,e,r){r(new i("_transform()"));},c.prototype._write=function(t,e,r){var n=this._transformState;if(n.writecb=r,n.writechunk=t,n.writeencoding=e,!n.transforming){var i=this._readableState;(n.needTransform||i.needReadable||i.length<i.highWaterMark)&&this._read(i.highWaterMark);}},c.prototype._read=function(t){var e=this._transformState;null===e.writechunk||e.transforming?e.needTransform=!0:(e.transforming=!0,this._transform(e.writechunk,e.writeencoding,e.afterTransform));},c.prototype._destroy=function(t,e){f.prototype._destroy.call(this,t,function(t){e(t);});};},{468:468,50:50,51:51}],55:[function(t,e,r){(function(r,n){(function(){"use strict";function i(t){var e=this;this.next=null,this.entry=null,this.finish=function(){!function(t,e,r){var n=t.entry;t.entry=null;for(;n;){var i=n.callback;e.pendingcb--,i(r),n=n.next;}e.corkedRequestsFree.next=t;}(e,t);};}var o;e.exports=k,k.WritableState=E;var a={deprecate:t(529)},s=t(63),f=t(68).Buffer,u=n.Uint8Array||function(){};var c,h=t(58),d=t(62).getHighWaterMark,l=t(50).codes,p=l.ERR_INVALID_ARG_TYPE,b=l.ERR_METHOD_NOT_IMPLEMENTED,v=l.ERR_MULTIPLE_CALLBACK,g=l.ERR_STREAM_CANNOT_PIPE,y=l.ERR_STREAM_DESTROYED,m=l.ERR_STREAM_NULL_VALUES,w=l.ERR_STREAM_WRITE_AFTER_END,_=l.ERR_UNKNOWN_ENCODING,S=h.errorOrDestroy;function M(){}function E(e,n,a){o=o||t(51),e=e||{},"boolean"!=typeof a&&(a=n instanceof o),this.objectMode=!!e.objectMode,a&&(this.objectMode=this.objectMode||!!e.writableObjectMode),this.highWaterMark=d(this,e,"writableHighWaterMark",a),this.finalCalled=!1,this.needDrain=!1,this.ending=!1,this.ended=!1,this.finished=!1,this.destroyed=!1;var s=!1===e.decodeStrings;this.decodeStrings=!s,this.defaultEncoding=e.defaultEncoding||"utf8",this.length=0,this.writing=!1,this.corked=0,this.sync=!0,this.bufferProcessing=!1,this.onwrite=function(t){!function(t,e){var n=t._writableState,i=n.sync,o=n.writecb;if("function"!=typeof o)throw new v();if(function(t){t.writing=!1,t.writecb=null,t.length-=t.writelen,t.writelen=0;}(n),e)!function(t,e,n,i,o){--e.pendingcb,n?(r.nextTick(o,i),r.nextTick(B,t,e),t._writableState.errorEmitted=!0,S(t,i)):(o(i),t._writableState.errorEmitted=!0,S(t,i),B(t,e));}(t,n,i,e,o);else{var a=T(n)||t.destroyed;a||n.corked||n.bufferProcessing||!n.bufferedRequest||R(t,n),i?r.nextTick(A,t,n,a,o):A(t,n,a,o);}}(n,t);},this.writecb=null,this.writelen=0,this.bufferedRequest=null,this.lastBufferedRequest=null,this.pendingcb=0,this.prefinished=!1,this.errorEmitted=!1,this.emitClose=!1!==e.emitClose,this.autoDestroy=!!e.autoDestroy,this.bufferedRequestCount=0,this.corkedRequestsFree=new i(this);}function k(e){var r=this instanceof(o=o||t(51));if(!r&&!c.call(k,this))return new k(e);this._writableState=new E(e,this,r),this.writable=!0,e&&("function"==typeof e.write&&(this._write=e.write),"function"==typeof e.writev&&(this._writev=e.writev),"function"==typeof e.destroy&&(this._destroy=e.destroy),"function"==typeof e["final"]&&(this._final=e["final"])),s.call(this);}function x(t,e,r,n,i,o,a){e.writelen=n,e.writecb=a,e.writing=!0,e.sync=!0,e.destroyed?e.onwrite(new y("write")):r?t._writev(i,e.onwrite):t._write(i,o,e.onwrite),e.sync=!1;}function A(t,e,r,n){r||function(t,e){0===e.length&&e.needDrain&&(e.needDrain=!1,t.emit("drain"));}(t,e),e.pendingcb--,n(),B(t,e);}function R(t,e){e.bufferProcessing=!0;var r=e.bufferedRequest;if(t._writev&&r&&r.next){var n=e.bufferedRequestCount,o=new Array(n),a=e.corkedRequestsFree;a.entry=r;for(var s=0,f=!0;r;){o[s]=r,r.isBuf||(f=!1),r=r.next,s+=1;}o.allBuffers=f,x(t,e,!0,e.length,o,"",a.finish),e.pendingcb++,e.lastBufferedRequest=null,a.next?(e.corkedRequestsFree=a.next,a.next=null):e.corkedRequestsFree=new i(e),e.bufferedRequestCount=0;}else{for(;r;){var u=r.chunk,c=r.encoding,h=r.callback;if(x(t,e,!1,e.objectMode?1:u.length,u,c,h),r=r.next,e.bufferedRequestCount--,e.writing)break;}null===r&&(e.lastBufferedRequest=null);}e.bufferedRequest=r,e.bufferProcessing=!1;}function T(t){return t.ending&&0===t.length&&null===t.bufferedRequest&&!t.finished&&!t.writing;}function I(t,e){t._final(function(r){e.pendingcb--,r&&S(t,r),e.prefinished=!0,t.emit("prefinish"),B(t,e);});}function B(t,e){var n=T(e);if(n&&(function(t,e){e.prefinished||e.finalCalled||("function"!=typeof t._final||e.destroyed?(e.prefinished=!0,t.emit("prefinish")):(e.pendingcb++,e.finalCalled=!0,r.nextTick(I,t,e)));}(t,e),0===e.pendingcb&&(e.finished=!0,t.emit("finish"),e.autoDestroy))){var i=t._readableState;(!i||i.autoDestroy&&i.endEmitted)&&t.destroy();}return n;}t(468)(k,s),E.prototype.getBuffer=function(){for(var t=this.bufferedRequest,e=[];t;){e.push(t),t=t.next;}return e;},function(){try{Object.defineProperty(E.prototype,"buffer",{get:a.deprecate(function(){return this.getBuffer();},"_writableState.buffer is deprecated. Use _writableState.getBuffer instead.","DEP0003")});}catch(t){}}(),"function"==typeof Symbol&&Symbol.hasInstance&&"function"==typeof Function.prototype[Symbol.hasInstance]?(c=Function.prototype[Symbol.hasInstance],Object.defineProperty(k,Symbol.hasInstance,{value:function value(t){return!!c.call(this,t)||this===k&&t&&t._writableState instanceof E;}})):c=function c(t){return t instanceof this;},k.prototype.pipe=function(){S(this,new g());},k.prototype.write=function(t,e,n){var i,o=this._writableState,a=!1,s=!o.objectMode&&(i=t,f.isBuffer(i)||i instanceof u);return s&&!f.isBuffer(t)&&(t=function(t){return f.from(t);}(t)),"function"==typeof e&&(n=e,e=null),s?e="buffer":e||(e=o.defaultEncoding),"function"!=typeof n&&(n=M),o.ending?function(t,e){var n=new w();S(t,n),r.nextTick(e,n);}(this,n):(s||function(t,e,n,i){var o;return null===n?o=new m():"string"==typeof n||e.objectMode||(o=new p("chunk",["string","Buffer"],n)),!o||(S(t,o),r.nextTick(i,o),!1);}(this,o,t,n))&&(o.pendingcb++,a=function(t,e,r,n,i,o){if(!r){var a=function(t,e,r){t.objectMode||!1===t.decodeStrings||"string"!=typeof e||(e=f.from(e,r));return e;}(e,n,i);n!==a&&(r=!0,i="buffer",n=a);}var s=e.objectMode?1:n.length;e.length+=s;var u=e.length<e.highWaterMark;u||(e.needDrain=!0);if(e.writing||e.corked){var c=e.lastBufferedRequest;e.lastBufferedRequest={chunk:n,encoding:i,isBuf:r,callback:o,next:null},c?c.next=e.lastBufferedRequest:e.bufferedRequest=e.lastBufferedRequest,e.bufferedRequestCount+=1;}else x(t,e,!1,s,n,i,o);return u;}(this,o,s,t,e,n)),a;},k.prototype.cork=function(){this._writableState.corked++;},k.prototype.uncork=function(){var t=this._writableState;t.corked&&(t.corked--,t.writing||t.corked||t.bufferProcessing||!t.bufferedRequest||R(this,t));},k.prototype.setDefaultEncoding=function(t){if("string"==typeof t&&(t=t.toLowerCase()),!(["hex","utf8","utf-8","ascii","binary","base64","ucs2","ucs-2","utf16le","utf-16le","raw"].indexOf((t+"").toLowerCase())>-1))throw new _(t);return this._writableState.defaultEncoding=t,this;},Object.defineProperty(k.prototype,"writableBuffer",{enumerable:!1,get:function get(){return this._writableState&&this._writableState.getBuffer();}}),Object.defineProperty(k.prototype,"writableHighWaterMark",{enumerable:!1,get:function get(){return this._writableState.highWaterMark;}}),k.prototype._write=function(t,e,r){r(new b("_write()"));},k.prototype._writev=null,k.prototype.end=function(t,e,n){var i=this._writableState;return"function"==typeof t?(n=t,t=null,e=null):"function"==typeof e&&(n=e,e=null),null!=t&&this.write(t,e),i.corked&&(i.corked=1,this.uncork()),i.ending||function(t,e,n){e.ending=!0,B(t,e),n&&(e.finished?r.nextTick(n):t.once("finish",n));e.ended=!0,t.writable=!1;}(this,i,n),this;},Object.defineProperty(k.prototype,"writableLength",{enumerable:!1,get:function get(){return this._writableState.length;}}),Object.defineProperty(k.prototype,"destroyed",{enumerable:!1,get:function get(){return void 0!==this._writableState&&this._writableState.destroyed;},set:function set(t){this._writableState&&(this._writableState.destroyed=t);}}),k.prototype.destroy=h.destroy,k.prototype._undestroy=h.undestroy,k.prototype._destroy=function(t,e){e(t);};}).call(this);}).call(this,t(489),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});},{468:468,489:489,50:50,51:51,529:529,58:58,62:62,63:63,68:68}],56:[function(t,e,r){(function(r){(function(){"use strict";var n;function i(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t;}var o=t(59),a=Symbol("lastResolve"),s=Symbol("lastReject"),f=Symbol("error"),u=Symbol("ended"),c=Symbol("lastPromise"),h=Symbol("handlePromise"),d=Symbol("stream");function l(t,e){return{value:t,done:e};}function p(t){var e=t[a];if(null!==e){var r=t[d].read();null!==r&&(t[c]=null,t[a]=null,t[s]=null,e(l(r,!1)));}}function b(t){r.nextTick(p,t);}var v=Object.getPrototypeOf(function(){}),g=Object.setPrototypeOf((i(n={get stream(){return this[d];},next:function next(){var t=this,e=this[f];if(null!==e)return Promise.reject(e);if(this[u])return Promise.resolve(l(void 0,!0));if(this[d].destroyed)return new Promise(function(e,n){r.nextTick(function(){t[f]?n(t[f]):e(l(void 0,!0));});});var n,i=this[c];if(i)n=new Promise(function(t,e){return function(r,n){t.then(function(){e[u]?r(l(void 0,!0)):e[h](r,n);},n);};}(i,this));else{var o=this[d].read();if(null!==o)return Promise.resolve(l(o,!1));n=new Promise(this[h]);}return this[c]=n,n;}},Symbol.asyncIterator,function(){return this;}),i(n,"return",function(){var t=this;return new Promise(function(e,r){t[d].destroy(null,function(t){t?r(t):e(l(void 0,!0));});});}),n),v);e.exports=function(t){var e,r=Object.create(g,(i(e={},d,{value:t,writable:!0}),i(e,a,{value:null,writable:!0}),i(e,s,{value:null,writable:!0}),i(e,f,{value:null,writable:!0}),i(e,u,{value:t._readableState.endEmitted,writable:!0}),i(e,h,{value:function value(t,e){var n=r[d].read();n?(r[c]=null,r[a]=null,r[s]=null,t(l(n,!1))):(r[a]=t,r[s]=e);},writable:!0}),e));return r[c]=null,o(t,function(t){if(t&&"ERR_STREAM_PREMATURE_CLOSE"!==t.code){var e=r[s];return null!==e&&(r[c]=null,r[a]=null,r[s]=null,e(t)),void(r[f]=t);}var n=r[a];null!==n&&(r[c]=null,r[a]=null,r[s]=null,n(l(void 0,!0))),r[u]=!0;}),t.on("readable",b.bind(null,r)),r;};}).call(this);}).call(this,t(489));},{489:489,59:59}],57:[function(t,e,r){"use strict";function n(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable;})),r.push.apply(r,n);}return r;}function i(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t;}function o(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n);}}var a=t(68).Buffer,s=t(21).inspect,f=s&&s.custom||"inspect";e.exports=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function");}(this,t),this.head=null,this.tail=null,this.length=0;}var e,r,u;return e=t,(r=[{key:"push",value:function value(t){var e={data:t,next:null};this.length>0?this.tail.next=e:this.head=e,this.tail=e,++this.length;}},{key:"unshift",value:function value(t){var e={data:t,next:this.head};0===this.length&&(this.tail=e),this.head=e,++this.length;}},{key:"shift",value:function value(){if(0!==this.length){var t=this.head.data;return 1===this.length?this.head=this.tail=null:this.head=this.head.next,--this.length,t;}}},{key:"clear",value:function value(){this.head=this.tail=null,this.length=0;}},{key:"join",value:function value(t){if(0===this.length)return"";for(var e=this.head,r=""+e.data;e=e.next;){r+=t+e.data;}return r;}},{key:"concat",value:function value(t){if(0===this.length)return a.alloc(0);for(var e,r,n,i=a.allocUnsafe(t>>>0),o=this.head,s=0;o;){e=o.data,r=i,n=s,a.prototype.copy.call(e,r,n),s+=o.data.length,o=o.next;}return i;}},{key:"consume",value:function value(t,e){var r;return t<this.head.data.length?(r=this.head.data.slice(0,t),this.head.data=this.head.data.slice(t)):r=t===this.head.data.length?this.shift():e?this._getString(t):this._getBuffer(t),r;}},{key:"first",value:function value(){return this.head.data;}},{key:"_getString",value:function value(t){var e=this.head,r=1,n=e.data;for(t-=n.length;e=e.next;){var i=e.data,o=t>i.length?i.length:t;if(o===i.length?n+=i:n+=i.slice(0,t),0==(t-=o)){o===i.length?(++r,e.next?this.head=e.next:this.head=this.tail=null):(this.head=e,e.data=i.slice(o));break;}++r;}return this.length-=r,n;}},{key:"_getBuffer",value:function value(t){var e=a.allocUnsafe(t),r=this.head,n=1;for(r.data.copy(e),t-=r.data.length;r=r.next;){var i=r.data,o=t>i.length?i.length:t;if(i.copy(e,e.length-t,0,o),0==(t-=o)){o===i.length?(++n,r.next?this.head=r.next:this.head=this.tail=null):(this.head=r,r.data=i.slice(o));break;}++n;}return this.length-=n,e;}},{key:f,value:function value(t,e){return s(this,function(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?n(Object(r),!0).forEach(function(e){i(t,e,r[e]);}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e));});}return t;}({},e,{depth:0,customInspect:!1}));}}])&&o(e.prototype,r),u&&o(e,u),t;}();},{21:21,68:68}],58:[function(t,e,r){(function(t){(function(){"use strict";function r(t,e){i(t,e),n(t);}function n(t){t._writableState&&!t._writableState.emitClose||t._readableState&&!t._readableState.emitClose||t.emit("close");}function i(t,e){t.emit("error",e);}e.exports={destroy:function destroy(e,o){var a=this,s=this._readableState&&this._readableState.destroyed,f=this._writableState&&this._writableState.destroyed;return s||f?(o?o(e):e&&(this._writableState?this._writableState.errorEmitted||(this._writableState.errorEmitted=!0,t.nextTick(i,this,e)):t.nextTick(i,this,e)),this):(this._readableState&&(this._readableState.destroyed=!0),this._writableState&&(this._writableState.destroyed=!0),this._destroy(e||null,function(e){!o&&e?a._writableState?a._writableState.errorEmitted?t.nextTick(n,a):(a._writableState.errorEmitted=!0,t.nextTick(r,a,e)):t.nextTick(r,a,e):o?(t.nextTick(n,a),o(e)):t.nextTick(n,a);}),this);},undestroy:function undestroy(){this._readableState&&(this._readableState.destroyed=!1,this._readableState.reading=!1,this._readableState.ended=!1,this._readableState.endEmitted=!1),this._writableState&&(this._writableState.destroyed=!1,this._writableState.ended=!1,this._writableState.ending=!1,this._writableState.finalCalled=!1,this._writableState.prefinished=!1,this._writableState.finished=!1,this._writableState.errorEmitted=!1);},errorOrDestroy:function errorOrDestroy(t,e){var r=t._readableState,n=t._writableState;r&&r.autoDestroy||n&&n.autoDestroy?t.destroy(e):t.emit("error",e);}};}).call(this);}).call(this,t(489));},{489:489}],59:[function(t,e,r){"use strict";var n=t(50).codes.ERR_STREAM_PREMATURE_CLOSE;function i(){}e.exports=function t(e,r,o){if("function"==typeof r)return t(e,null,r);r||(r={}),o=function(t){var e=!1;return function(){if(!e){e=!0;for(var r=arguments.length,n=new Array(r),i=0;i<r;i++){n[i]=arguments[i];}t.apply(this,n);}};}(o||i);var a=r.readable||!1!==r.readable&&e.readable,s=r.writable||!1!==r.writable&&e.writable,f=function f(){e.writable||c();},u=e._writableState&&e._writableState.finished,c=function c(){s=!1,u=!0,a||o.call(e);},h=e._readableState&&e._readableState.endEmitted,d=function d(){a=!1,h=!0,s||o.call(e);},l=function l(t){o.call(e,t);},p=function p(){var t;return a&&!h?(e._readableState&&e._readableState.ended||(t=new n()),o.call(e,t)):s&&!u?(e._writableState&&e._writableState.ended||(t=new n()),o.call(e,t)):void 0;},b=function b(){e.req.on("finish",c);};return!function(t){return t.setHeader&&"function"==typeof t.abort;}(e)?s&&!e._writableState&&(e.on("end",f),e.on("close",f)):(e.on("complete",c),e.on("abort",p),e.req?b():e.on("request",b)),e.on("end",d),e.on("finish",c),!1!==r.error&&e.on("error",l),e.on("close",p),function(){e.removeListener("complete",c),e.removeListener("abort",p),e.removeListener("request",b),e.req&&e.req.removeListener("finish",c),e.removeListener("end",f),e.removeListener("close",f),e.removeListener("finish",c),e.removeListener("end",d),e.removeListener("error",l),e.removeListener("close",p);};};},{50:50}],60:[function(t,e,r){e.exports=function(){throw new Error("Readable.from is not available in the browser");};},{}],61:[function(t,e,r){"use strict";var n;var i=t(50).codes,o=i.ERR_MISSING_ARGS,a=i.ERR_STREAM_DESTROYED;function s(t){if(t)throw t;}function f(e,r,i,o){o=function(t){var e=!1;return function(){e||(e=!0,t.apply(void 0,arguments));};}(o);var s=!1;e.on("close",function(){s=!0;}),void 0===n&&(n=t(59)),n(e,{readable:r,writable:i},function(t){if(t)return o(t);s=!0,o();});var f=!1;return function(t){if(!s&&!f)return f=!0,function(t){return t.setHeader&&"function"==typeof t.abort;}(e)?e.abort():"function"==typeof e.destroy?e.destroy():void o(t||new a("pipe"));};}function u(t){t();}function c(t,e){return t.pipe(e);}function h(t){return t.length?"function"!=typeof t[t.length-1]?s:t.pop():s;}e.exports=function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++){e[r]=arguments[r];}var n,i=h(e);if(Array.isArray(e[0])&&(e=e[0]),e.length<2)throw new o("streams");var a=e.map(function(t,r){var o=r<e.length-1;return f(t,o,r>0,function(t){n||(n=t),t&&a.forEach(u),o||(a.forEach(u),i(n));});});return e.reduce(c);};},{50:50,59:59}],62:[function(t,e,r){"use strict";var n=t(50).codes.ERR_INVALID_OPT_VALUE;e.exports={getHighWaterMark:function getHighWaterMark(t,e,r,i){var o=function(t,e,r){return null!=t.highWaterMark?t.highWaterMark:e?t[r]:null;}(e,i,r);if(null!=o){if(!isFinite(o)||Math.floor(o)!==o||o<0)throw new n(i?r:"highWaterMark",o);return Math.floor(o);}return t.objectMode?16:16384;}};},{50:50}],63:[function(t,e,r){e.exports=t(435).EventEmitter;},{435:435}],64:[function(t,e,r){(r=e.exports=t(53)).Stream=r,r.Readable=r,r.Writable=t(55),r.Duplex=t(51),r.Transform=t(54),r.PassThrough=t(52),r.finished=t(59),r.pipeline=t(61);},{51:51,52:52,53:53,54:54,55:55,59:59,61:61}],65:[function(t,e,r){/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */var n=t(68),i=n.Buffer;function o(t,e){for(var r in t){e[r]=t[r];}}function a(t,e,r){return i(t,e,r);}i.from&&i.alloc&&i.allocUnsafe&&i.allocUnsafeSlow?e.exports=n:(o(n,r),r.Buffer=a),a.prototype=Object.create(i.prototype),o(i,a),a.from=function(t,e,r){if("number"==typeof t)throw new TypeError("Argument must not be a number");return i(t,e,r);},a.alloc=function(t,e,r){if("number"!=typeof t)throw new TypeError("Argument must be a number");var n=i(t);return void 0!==e?"string"==typeof r?n.fill(e,r):n.fill(e):n.fill(0),n;},a.allocUnsafe=function(t){if("number"!=typeof t)throw new TypeError("Argument must be a number");return i(t);},a.allocUnsafeSlow=function(t){if("number"!=typeof t)throw new TypeError("Argument must be a number");return n.SlowBuffer(t);};},{68:68}],66:[function(t,e,r){"use strict";var n=t(515).Buffer,i=n.isEncoding||function(t){switch((t=""+t)&&t.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return!0;default:return!1;}};function o(t){var e;switch(this.encoding=function(t){var e=function(t){if(!t)return"utf8";for(var e;;){switch(t){case"utf8":case"utf-8":return"utf8";case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return"utf16le";case"latin1":case"binary":return"latin1";case"base64":case"ascii":case"hex":return t;default:if(e)return;t=(""+t).toLowerCase(),e=!0;}}}(t);if("string"!=typeof e&&(n.isEncoding===i||!i(t)))throw new Error("Unknown encoding: "+t);return e||t;}(t),this.encoding){case"utf16le":this.text=f,this.end=u,e=4;break;case"utf8":this.fillLast=s,e=4;break;case"base64":this.text=c,this.end=h,e=3;break;default:return this.write=d,void(this.end=l);}this.lastNeed=0,this.lastTotal=0,this.lastChar=n.allocUnsafe(e);}function a(t){return t<=127?0:t>>5==6?2:t>>4==14?3:t>>3==30?4:-1;}function s(t){var e=this.lastTotal-this.lastNeed,r=function(t,e,r){if(128!=(192&e[0]))return t.lastNeed=0,"�".repeat(r);if(t.lastNeed>1&&e.length>1){if(128!=(192&e[1]))return t.lastNeed=1,"�".repeat(r+1);if(t.lastNeed>2&&e.length>2&&128!=(192&e[2]))return t.lastNeed=2,"�".repeat(r+2);}}(this,t,e);return void 0!==r?r:this.lastNeed<=t.length?(t.copy(this.lastChar,e,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal)):(t.copy(this.lastChar,e,0,t.length),void(this.lastNeed-=t.length));}function f(t,e){if((t.length-e)%2==0){var r=t.toString("utf16le",e);if(r){var n=r.charCodeAt(r.length-1);if(n>=55296&&n<=56319)return this.lastNeed=2,this.lastTotal=4,this.lastChar[0]=t[t.length-2],this.lastChar[1]=t[t.length-1],r.slice(0,-1);}return r;}return this.lastNeed=1,this.lastTotal=2,this.lastChar[0]=t[t.length-1],t.toString("utf16le",e,t.length-1);}function u(t){var e=t&&t.length?this.write(t):"";if(this.lastNeed){var r=this.lastTotal-this.lastNeed;return e+this.lastChar.toString("utf16le",0,r);}return e;}function c(t,e){var r=(t.length-e)%3;return 0===r?t.toString("base64",e):(this.lastNeed=3-r,this.lastTotal=3,1===r?this.lastChar[0]=t[t.length-1]:(this.lastChar[0]=t[t.length-2],this.lastChar[1]=t[t.length-1]),t.toString("base64",e,t.length-r));}function h(t){var e=t&&t.length?this.write(t):"";return this.lastNeed?e+this.lastChar.toString("base64",0,3-this.lastNeed):e;}function d(t){return t.toString(this.encoding);}function l(t){return t&&t.length?this.write(t):"";}r.StringDecoder=o,o.prototype.write=function(t){if(0===t.length)return"";var e,r;if(this.lastNeed){if(void 0===(e=this.fillLast(t)))return"";r=this.lastNeed,this.lastNeed=0;}else r=0;return r<t.length?e?e+this.text(t,r):this.text(t,r):e||"";},o.prototype.end=function(t){var e=t&&t.length?this.write(t):"";return this.lastNeed?e+"�".repeat(this.lastTotal-this.lastNeed):e;},o.prototype.text=function(t,e){var r=function(t,e,r){var n=e.length-1;if(n<r)return 0;var i=a(e[n]);if(i>=0)return i>0&&(t.lastNeed=i-1),i;if(--n<r)return 0;if((i=a(e[n]))>=0)return i>0&&(t.lastNeed=i-2),i;if(--n<r)return 0;if((i=a(e[n]))>=0)return i>0&&(2===i?i=0:t.lastNeed=i-3),i;return 0;}(this,t,e);if(!this.lastNeed)return t.toString("utf8",e);this.lastTotal=r;var n=t.length-(r-this.lastNeed);return t.copy(this.lastChar,0,n),t.toString("utf8",e,n);},o.prototype.fillLast=function(t){if(this.lastNeed<=t.length)return t.copy(this.lastChar,this.lastTotal-this.lastNeed,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal);t.copy(this.lastChar,this.lastTotal-this.lastNeed,0,t.length),this.lastNeed-=t.length;};},{515:515}],67:[function(t,e,r){(function(t){(function(){e.exports=function(e,r){for(var n=Math.min(e.length,r.length),i=new t(n),o=0;o<n;++o){i[o]=e[o]^r[o];}return i;};}).call(this);}).call(this,t(68).Buffer);},{68:68}],68:[function(t,e,r){(function(e){(function(){/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */e.exports=function(t){return null!=t&&(n(t)||function(t){return"function"==typeof t.readFloatLE&&"function"==typeof t.slice&&n(t.slice(0,0));}(t)||!!t._isBuffer);};},{}],470:[function(t,e,r){var n={}.toString;e.exports=Array.isArray||function(t){return"[object Array]"==n.call(t);};},{}],471:[function(t,e,r){"use strict";var n=t(468),i=t(437),o=t(515).Buffer,a=new Array(16);function s(){i.call(this,64),this._a=1732584193,this._b=4023233417,this._c=2562383102,this._d=271733878;}function f(t,e){return t<<e|t>>>32-e;}function u(t,e,r,n,i,o,a){return f(t+(e&r|~e&n)+i+o|0,a)+e|0;}function c(t,e,r,n,i,o,a){return f(t+(e&n|r&~n)+i+o|0,a)+e|0;}function h(t,e,r,n,i,o,a){return f(t+(e^r^n)+i+o|0,a)+e|0;}function d(t,e,r,n,i,o,a){return f(t+(r^(e|~n))+i+o|0,a)+e|0;}n(s,i),s.prototype._update=function(){for(var t=a,e=0;e<16;++e){t[e]=this._block.readInt32LE(4*e);}var r=this._a,n=this._b,i=this._c,o=this._d;r=u(r,n,i,o,t[0],3614090360,7),o=u(o,r,n,i,t[1],3905402710,12),i=u(i,o,r,n,t[2],606105819,17),n=u(n,i,o,r,t[3],3250441966,22),r=u(r,n,i,o,t[4],4118548399,7),o=u(o,r,n,i,t[5],1200080426,12),i=u(i,o,r,n,t[6],2821735955,17),n=u(n,i,o,r,t[7],4249261313,22),r=u(r,n,i,o,t[8],1770035416,7),o=u(o,r,n,i,t[9],2336552879,12),i=u(i,o,r,n,t[10],4294925233,17),n=u(n,i,o,r,t[11],2304563134,22),r=u(r,n,i,o,t[12],1804603682,7),o=u(o,r,n,i,t[13],4254626195,12),i=u(i,o,r,n,t[14],2792965006,17),r=c(r,n=u(n,i,o,r,t[15],1236535329,22),i,o,t[1],4129170786,5),o=c(o,r,n,i,t[6],3225465664,9),i=c(i,o,r,n,t[11],643717713,14),n=c(n,i,o,r,t[0],3921069994,20),r=c(r,n,i,o,t[5],3593408605,5),o=c(o,r,n,i,t[10],38016083,9),i=c(i,o,r,n,t[15],3634488961,14),n=c(n,i,o,r,t[4],3889429448,20),r=c(r,n,i,o,t[9],568446438,5),o=c(o,r,n,i,t[14],3275163606,9),i=c(i,o,r,n,t[3],4107603335,14),n=c(n,i,o,r,t[8],1163531501,20),r=c(r,n,i,o,t[13],2850285829,5),o=c(o,r,n,i,t[2],4243563512,9),i=c(i,o,r,n,t[7],1735328473,14),r=h(r,n=c(n,i,o,r,t[12],2368359562,20),i,o,t[5],4294588738,4),o=h(o,r,n,i,t[8],2272392833,11),i=h(i,o,r,n,t[11],1839030562,16),n=h(n,i,o,r,t[14],4259657740,23),r=h(r,n,i,o,t[1],2763975236,4),o=h(o,r,n,i,t[4],1272893353,11),i=h(i,o,r,n,t[7],4139469664,16),n=h(n,i,o,r,t[10],3200236656,23),r=h(r,n,i,o,t[13],681279174,4),o=h(o,r,n,i,t[0],3936430074,11),i=h(i,o,r,n,t[3],3572445317,16),n=h(n,i,o,r,t[6],76029189,23),r=h(r,n,i,o,t[9],3654602809,4),o=h(o,r,n,i,t[12],3873151461,11),i=h(i,o,r,n,t[15],530742520,16),r=d(r,n=h(n,i,o,r,t[2],3299628645,23),i,o,t[0],4096336452,6),o=d(o,r,n,i,t[7],1126891415,10),i=d(i,o,r,n,t[14],2878612391,15),n=d(n,i,o,r,t[5],4237533241,21),r=d(r,n,i,o,t[12],1700485571,6),o=d(o,r,n,i,t[3],2399980690,10),i=d(i,o,r,n,t[10],4293915773,15),n=d(n,i,o,r,t[1],2240044497,21),r=d(r,n,i,o,t[8],1873313359,6),o=d(o,r,n,i,t[15],4264355552,10),i=d(i,o,r,n,t[6],2734768916,15),n=d(n,i,o,r,t[13],1309151649,21),r=d(r,n,i,o,t[4],4149444226,6),o=d(o,r,n,i,t[11],3174756917,10),i=d(i,o,r,n,t[2],718787259,15),n=d(n,i,o,r,t[9],3951481745,21),this._a=this._a+r|0,this._b=this._b+n|0,this._c=this._c+i|0,this._d=this._d+o|0;},s.prototype._digest=function(){this._block[this._blockOffset++]=128,this._blockOffset>56&&(this._block.fill(0,this._blockOffset,64),this._update(),this._blockOffset=0),this._block.fill(0,this._blockOffset,56),this._block.writeUInt32LE(this._length[0],56),this._block.writeUInt32LE(this._length[1],60),this._update();var t=o.allocUnsafe(16);return t.writeInt32LE(this._a,0),t.writeInt32LE(this._b,4),t.writeInt32LE(this._c,8),t.writeInt32LE(this._d,12),t;},e.exports=s;},{437:437,468:468,515:515}],472:[function(t,e,r){var n=t(473),i=t(20);function o(t){this.rand=t||new i.Rand();}e.exports=o,o.create=function(t){return new o(t);},o.prototype._randbelow=function(t){var e=t.bitLength(),r=Math.ceil(e/8);do{var i=new n(this.rand.generate(r));}while(i.cmp(t)>=0);return i;},o.prototype._randrange=function(t,e){var r=e.sub(t);return t.add(this._randbelow(r));},o.prototype.test=function(t,e,r){var i=t.bitLength(),o=n.mont(t),a=new n(1).toRed(o);e||(e=Math.max(1,i/48|0));for(var s=t.subn(1),f=0;!s.testn(f);f++){;}for(var u=t.shrn(f),c=s.toRed(o);e>0;e--){var h=this._randrange(new n(2),s);r&&r(h);var d=h.toRed(o).redPow(u);if(0!==d.cmp(a)&&0!==d.cmp(c)){for(var l=1;l<f;l++){if(0===(d=d.redSqr()).cmp(a))return!1;if(0===d.cmp(c))break;}if(l===f)return!1;}}return!0;},o.prototype.getDivisor=function(t,e){var r=t.bitLength(),i=n.mont(t),o=new n(1).toRed(i);e||(e=Math.max(1,r/48|0));for(var a=t.subn(1),s=0;!a.testn(s);s++){;}for(var f=t.shrn(s),u=a.toRed(i);e>0;e--){var c=this._randrange(new n(2),a),h=t.gcd(c);if(0!==h.cmpn(1))return h;var d=c.toRed(i).redPow(f);if(0!==d.cmp(o)&&0!==d.cmp(u)){for(var l=1;l<s;l++){if(0===(d=d.redSqr()).cmp(o))return d.fromRed().subn(1).gcd(t);if(0===d.cmp(u))break;}if(l===s)return(d=d.redSqr()).fromRed().subn(1).gcd(t);}}return!1;};},{20:20,473:473}],473:[function(t,e,r){arguments[4][16][0].apply(r,arguments);},{16:16,21:21}],474:[function(t,e,r){function n(t,e){if(!t)throw new Error(e||"Assertion failed");}e.exports=n,n.equal=function(t,e,r){if(t!=e)throw new Error(r||"Assertion failed: "+t+" != "+e);};},{}],475:[function(t,e,r){"use strict";var n=r;function i(t){return 1===t.length?"0"+t:t;}function o(t){for(var e="",r=0;r<t.length;r++){e+=i(t[r].toString(16));}return e;}n.toArray=function(t,e){if(Array.isArray(t))return t.slice();if(!t)return[];var r=[];if("string"!=typeof t){for(var n=0;n<t.length;n++){r[n]=0|t[n];}return r;}if("hex"===e){(t=t.replace(/[^a-z0-9]+/gi,"")).length%2!=0&&(t="0"+t);for(n=0;n<t.length;n+=2){r.push(parseInt(t[n]+t[n+1],16));}}else for(n=0;n<t.length;n++){var i=t.charCodeAt(n),o=i>>8,a=255&i;o?r.push(o,a):r.push(a);}return r;},n.zero2=i,n.toHex=o,n.encode=function(t,e){return"hex"===e?o(t):t;};},{}],476:[function(t,e,r){(function(r){(function(){!function(n){"use strict";var i,o,a,s,f;n?function(){var t=n.crypto||n.msCrypto;if(!i&&t&&t.getRandomValues)try{var e=new Uint8Array(16);s=i=function i(){return t.getRandomValues(e),e;},i();}catch(t){}if(!i){var r=new Array(16);o=i=function i(){for(var t,e=0;e<16;e++){0==(3&e)&&(t=4294967296*Math.random()),r[e]=t>>>((3&e)<<3)&255;}return r;},"undefined"!=typeof console&&console.warn;}}():function(){if("function"==typeof t)try{var e=t(406).randomBytes;a=i=e&&function(){return e(16);},i();}catch(t){}}();for(var u="function"==typeof r?r:Array,c=[],h={},d=0;d<256;d++){c[d]=(d+256).toString(16).substr(1),h[c[d]]=d;}function l(t,e){var r=e||0,n=c;return n[t[r++]]+n[t[r++]]+n[t[r++]]+n[t[r++]]+"-"+n[t[r++]]+n[t[r++]]+"-"+n[t[r++]]+n[t[r++]]+"-"+n[t[r++]]+n[t[r++]]+"-"+n[t[r++]]+n[t[r++]]+n[t[r++]]+n[t[r++]]+n[t[r++]]+n[t[r++]];}var p=i(),b=[1|p[0],p[1],p[2],p[3],p[4],p[5]],v=16383&(p[6]<<8|p[7]),g=0,y=0;function m(t,e,r){var n=e&&r||0;"string"==typeof t&&(e="binary"===t?new u(16):null,t=null);var o=(t=t||{}).random||(t.rng||i)();if(o[6]=15&o[6]|64,o[8]=63&o[8]|128,e)for(var a=0;a<16;a++){e[n+a]=o[a];}return e||l(o);}var w=m;w.v1=function(t,e,r){var n=e&&r||0,i=e||[],o=null!=(t=t||{}).clockseq?t.clockseq:v,a=null!=t.msecs?t.msecs:new Date().getTime(),s=null!=t.nsecs?t.nsecs:y+1,f=a-g+(s-y)/1e4;if(f<0&&null==t.clockseq&&(o=o+1&16383),(f<0||a>g)&&null==t.nsecs&&(s=0),s>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");g=a,y=s,v=o;var u=(1e4*(268435455&(a+=122192928e5))+s)%4294967296;i[n++]=u>>>24&255,i[n++]=u>>>16&255,i[n++]=u>>>8&255,i[n++]=255&u;var c=a/4294967296*1e4&268435455;i[n++]=c>>>8&255,i[n++]=255&c,i[n++]=c>>>24&15|16,i[n++]=c>>>16&255,i[n++]=o>>>8|128,i[n++]=255&o;for(var h=t.node||b,d=0;d<6;d++){i[n+d]=h[d];}return e||l(i);},w.v4=m,w.parse=function(t,e,r){var n=e&&r||0,i=0;for(e=e||[],t.toLowerCase().replace(/[0-9a-f]{2}/g,function(t){i<16&&(e[n+i++]=h[t]);});i<16;){e[n+i++]=0;}return e;},w.unparse=l,w.BufferClass=u,w._rng=i,w._mathRNG=o,w._nodeRNG=a,w._whatwgRNG=s,void 0!==e&&e.exports?e.exports=w:(f=n.uuid,w.noConflict=function(){return n.uuid=f,w;},n.uuid=w);}("undefined"!=typeof window?window:null);}).call(this);}).call(this,t(68).Buffer);},{406:406,68:68}],477:[function(t,e,r){e.exports={"2.16.840.1.101.3.4.1.1":"aes-128-ecb","2.16.840.1.101.3.4.1.2":"aes-128-cbc","2.16.840.1.101.3.4.1.3":"aes-128-ofb","2.16.840.1.101.3.4.1.4":"aes-128-cfb","2.16.840.1.101.3.4.1.21":"aes-192-ecb","2.16.840.1.101.3.4.1.22":"aes-192-cbc","2.16.840.1.101.3.4.1.23":"aes-192-ofb","2.16.840.1.101.3.4.1.24":"aes-192-cfb","2.16.840.1.101.3.4.1.41":"aes-256-ecb","2.16.840.1.101.3.4.1.42":"aes-256-cbc","2.16.840.1.101.3.4.1.43":"aes-256-ofb","2.16.840.1.101.3.4.1.44":"aes-256-cfb"};},{}],478:[function(t,e,r){"use strict";var n=t(2);r.certificate=t(479);var i=n.define("RSAPrivateKey",function(){this.seq().obj(this.key("version")["int"](),this.key("modulus")["int"](),this.key("publicExponent")["int"](),this.key("privateExponent")["int"](),this.key("prime1")["int"](),this.key("prime2")["int"](),this.key("exponent1")["int"](),this.key("exponent2")["int"](),this.key("coefficient")["int"]());});r.RSAPrivateKey=i;var o=n.define("RSAPublicKey",function(){this.seq().obj(this.key("modulus")["int"](),this.key("publicExponent")["int"]());});r.RSAPublicKey=o;var a=n.define("SubjectPublicKeyInfo",function(){this.seq().obj(this.key("algorithm").use(s),this.key("subjectPublicKey").bitstr());});r.PublicKey=a;var s=n.define("AlgorithmIdentifier",function(){this.seq().obj(this.key("algorithm").objid(),this.key("none").null_().optional(),this.key("curve").objid().optional(),this.key("params").seq().obj(this.key("p")["int"](),this.key("q")["int"](),this.key("g")["int"]()).optional());}),f=n.define("PrivateKeyInfo",function(){this.seq().obj(this.key("version")["int"](),this.key("algorithm").use(s),this.key("subjectPrivateKey").octstr());});r.PrivateKey=f;var u=n.define("EncryptedPrivateKeyInfo",function(){this.seq().obj(this.key("algorithm").seq().obj(this.key("id").objid(),this.key("decrypt").seq().obj(this.key("kde").seq().obj(this.key("id").objid(),this.key("kdeparams").seq().obj(this.key("salt").octstr(),this.key("iters")["int"]())),this.key("cipher").seq().obj(this.key("algo").objid(),this.key("iv").octstr()))),this.key("subjectPrivateKey").octstr());});r.EncryptedPrivateKey=u;var c=n.define("DSAPrivateKey",function(){this.seq().obj(this.key("version")["int"](),this.key("p")["int"](),this.key("q")["int"](),this.key("g")["int"](),this.key("pub_key")["int"](),this.key("priv_key")["int"]());});r.DSAPrivateKey=c,r.DSAparam=n.define("DSAparam",function(){this["int"]();});var h=n.define("ECPrivateKey",function(){this.seq().obj(this.key("version")["int"](),this.key("privateKey").octstr(),this.key("parameters").optional().explicit(0).use(d),this.key("publicKey").optional().explicit(1).bitstr());});r.ECPrivateKey=h;var d=n.define("ECParameters",function(){this.choice({namedCurve:this.objid()});});r.signature=n.define("signature",function(){this.seq().obj(this.key("r")["int"](),this.key("s")["int"]());});},{2:2,479:479}],479:[function(t,e,r){"use strict";var n=t(2),i=n.define("Time",function(){this.choice({utcTime:this.utctime(),generalTime:this.gentime()});}),o=n.define("AttributeTypeValue",function(){this.seq().obj(this.key("type").objid(),this.key("value").any());}),a=n.define("AlgorithmIdentifier",function(){this.seq().obj(this.key("algorithm").objid(),this.key("parameters").optional(),this.key("curve").objid().optional());}),s=n.define("SubjectPublicKeyInfo",function(){this.seq().obj(this.key("algorithm").use(a),this.key("subjectPublicKey").bitstr());}),f=n.define("RelativeDistinguishedName",function(){this.setof(o);}),u=n.define("RDNSequence",function(){this.seqof(f);}),c=n.define("Name",function(){this.choice({rdnSequence:this.use(u)});}),h=n.define("Validity",function(){this.seq().obj(this.key("notBefore").use(i),this.key("notAfter").use(i));}),d=n.define("Extension",function(){this.seq().obj(this.key("extnID").objid(),this.key("critical").bool().def(!1),this.key("extnValue").octstr());}),l=n.define("TBSCertificate",function(){this.seq().obj(this.key("version").explicit(0)["int"]().optional(),this.key("serialNumber")["int"](),this.key("signature").use(a),this.key("issuer").use(c),this.key("validity").use(h),this.key("subject").use(c),this.key("subjectPublicKeyInfo").use(s),this.key("issuerUniqueID").implicit(1).bitstr().optional(),this.key("subjectUniqueID").implicit(2).bitstr().optional(),this.key("extensions").explicit(3).seqof(d).optional());}),p=n.define("X509Certificate",function(){this.seq().obj(this.key("tbsCertificate").use(l),this.key("signatureAlgorithm").use(a),this.key("signatureValue").bitstr());});e.exports=p;},{2:2}],480:[function(t,e,r){var n=/Proc-Type: 4,ENCRYPTED[\n\r]+DEK-Info: AES-((?:128)|(?:192)|(?:256))-CBC,([0-9A-H]+)[\n\r]+([0-9A-z\n\r+/=]+)[\n\r]+/m,i=/^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----/m,o=/^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----([0-9A-z\n\r+/=]+)-----END \1-----$/m,a=t(436),s=t(24),f=t(515).Buffer;e.exports=function(t,e){var r,u=t.toString(),c=u.match(n);if(c){var h="aes"+c[1],d=f.from(c[2],"hex"),l=f.from(c[3].replace(/[\r\n]/g,""),"base64"),p=a(e,d.slice(0,8),parseInt(c[1],10)).key,b=[],v=s.createDecipheriv(h,p,d);b.push(v.update(l)),b.push(v["final"]()),r=f.concat(b);}else{var g=u.match(o);r=f.from(g[2].replace(/[\r\n]/g,""),"base64");}return{tag:u.match(i)[1],data:r};};},{24:24,436:436,515:515}],481:[function(t,e,r){var n=t(478),i=t(477),o=t(480),a=t(24),s=t(482),f=t(515).Buffer;function u(t){var e;"object"!=_typeof(t)||f.isBuffer(t)||(e=t.passphrase,t=t.key),"string"==typeof t&&(t=f.from(t));var r,u,c=o(t,e),h=c.tag,d=c.data;switch(h){case"CERTIFICATE":u=n.certificate.decode(d,"der").tbsCertificate.subjectPublicKeyInfo;case"PUBLIC KEY":switch(u||(u=n.PublicKey.decode(d,"der")),r=u.algorithm.algorithm.join(".")){case"1.2.840.113549.1.1.1":return n.RSAPublicKey.decode(u.subjectPublicKey.data,"der");case"1.2.840.10045.2.1":return u.subjectPrivateKey=u.subjectPublicKey,{type:"ec",data:u};case"1.2.840.10040.4.1":return u.algorithm.params.pub_key=n.DSAparam.decode(u.subjectPublicKey.data,"der"),{type:"dsa",data:u.algorithm.params};default:throw new Error("unknown key id "+r);}case"ENCRYPTED PRIVATE KEY":d=function(t,e){var r=t.algorithm.decrypt.kde.kdeparams.salt,n=parseInt(t.algorithm.decrypt.kde.kdeparams.iters.toString(),10),o=i[t.algorithm.decrypt.cipher.algo.join(".")],u=t.algorithm.decrypt.cipher.iv,c=t.subjectPrivateKey,h=parseInt(o.split("-")[1],10)/8,d=s.pbkdf2Sync(e,r,n,h,"sha1"),l=a.createDecipheriv(o,d,u),p=[];return p.push(l.update(c)),p.push(l["final"]()),f.concat(p);}(d=n.EncryptedPrivateKey.decode(d,"der"),e);case"PRIVATE KEY":switch(r=(u=n.PrivateKey.decode(d,"der")).algorithm.algorithm.join(".")){case"1.2.840.113549.1.1.1":return n.RSAPrivateKey.decode(u.subjectPrivateKey,"der");case"1.2.840.10045.2.1":return{curve:u.algorithm.curve,privateKey:n.ECPrivateKey.decode(u.subjectPrivateKey,"der").privateKey};case"1.2.840.10040.4.1":return u.algorithm.params.priv_key=n.DSAparam.decode(u.subjectPrivateKey,"der"),{type:"dsa",params:u.algorithm.params};default:throw new Error("unknown key id "+r);}case"RSA PUBLIC KEY":return n.RSAPublicKey.decode(d,"der");case"RSA PRIVATE KEY":return n.RSAPrivateKey.decode(d,"der");case"DSA PRIVATE KEY":return{type:"dsa",params:n.DSAPrivateKey.decode(d,"der")};case"EC PRIVATE KEY":return{curve:(d=n.ECPrivateKey.decode(d,"der")).parameters.value,privateKey:d.privateKey};default:throw new Error("unknown key type "+h);}}e.exports=u,u.signature=n.signature;},{24:24,477:477,478:478,480:480,482:482,515:515}],482:[function(t,e,r){r.pbkdf2=t(483),r.pbkdf2Sync=t(486);},{483:483,486:486}],483:[function(t,e,r){(function(r,n){(function(){var i,o=t(515).Buffer,a=t(485),s=t(484),f=t(486),u=t(487),c=n.crypto&&n.crypto.subtle,h={sha:"SHA-1","sha-1":"SHA-1",sha1:"SHA-1",sha256:"SHA-256","sha-256":"SHA-256",sha384:"SHA-384","sha-384":"SHA-384","sha-512":"SHA-512",sha512:"SHA-512"},d=[];function l(t,e,r,n,i){return c.importKey("raw",t,{name:"PBKDF2"},!1,["deriveBits"]).then(function(t){return c.deriveBits({name:"PBKDF2",salt:e,iterations:r,hash:{name:i}},t,n<<3);}).then(function(t){return o.from(t);});}e.exports=function(t,e,p,b,v,g){"function"==typeof v&&(g=v,v=void 0);var y=h[(v=v||"sha1").toLowerCase()];if(!y||"function"!=typeof n.Promise)return r.nextTick(function(){var r;try{r=f(t,e,p,b,v);}catch(t){return g(t);}g(null,r);});if(a(p,b),t=u(t,s,"Password"),e=u(e,s,"Salt"),"function"!=typeof g)throw new Error("No callback provided to pbkdf2");!function(t,e){t.then(function(t){r.nextTick(function(){e(null,t);});},function(t){r.nextTick(function(){e(t);});});}(function(t){if(n.process&&!n.process.browser)return Promise.resolve(!1);if(!c||!c.importKey||!c.deriveBits)return Promise.resolve(!1);if(void 0!==d[t])return d[t];var e=l(i=i||o.alloc(8),i,10,128,t).then(function(){return!0;})["catch"](function(){return!1;});return d[t]=e,e;}(y).then(function(r){return r?l(t,e,p,b,y):f(t,e,p,b,v);}),g);};}).call(this);}).call(this,t(489),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});},{484:484,485:485,486:486,487:487,489:489,515:515}],484:[function(t,e,r){(function(t){(function(){var r;if(t.browser)r="utf-8";else if(t.version){r=parseInt(t.version.split(".")[0].slice(1),10)>=6?"utf-8":"binary";}else r="utf-8";e.exports=r;}).call(this);}).call(this,t(489));},{489:489}],485:[function(t,e,r){var n=Math.pow(2,30)-1;e.exports=function(t,e){if("number"!=typeof t)throw new TypeError("Iterations not a number");if(t<0)throw new TypeError("Bad iterations");if("number"!=typeof e)throw new TypeError("Key length not a number");if(e<0||e>n||e!=e)throw new TypeError("Bad key length");};},{}],486:[function(t,e,r){var n=t(403),i=t(514),o=t(519),a=t(515).Buffer,s=t(485),f=t(484),u=t(487),c=a.alloc(128),h={md5:16,sha1:20,sha224:28,sha256:32,sha384:48,sha512:64,rmd160:20,ripemd160:20};function d(t,e,r){var s=function(t){function e(e){return o(t).update(e).digest();}function r(t){return new i().update(t).digest();}return"rmd160"===t||"ripemd160"===t?r:"md5"===t?n:e;}(t),f="sha512"===t||"sha384"===t?128:64;e.length>f?e=s(e):e.length<f&&(e=a.concat([e,c],f));for(var u=a.allocUnsafe(f+h[t]),d=a.allocUnsafe(f+h[t]),l=0;l<f;l++){u[l]=54^e[l],d[l]=92^e[l];}var p=a.allocUnsafe(f+r+4);u.copy(p,0,0,f),this.ipad1=p,this.ipad2=u,this.opad=d,this.alg=t,this.blocksize=f,this.hash=s,this.size=h[t];}d.prototype.run=function(t,e){return t.copy(e,this.blocksize),this.hash(e).copy(this.opad,this.blocksize),this.hash(this.opad);},e.exports=function(t,e,r,n,i){s(r,n);var o=new d(i=i||"sha1",t=u(t,f,"Password"),(e=u(e,f,"Salt")).length),c=a.allocUnsafe(n),l=a.allocUnsafe(e.length+4);e.copy(l,0,0,e.length);for(var p=0,b=h[i],v=Math.ceil(n/b),g=1;g<=v;g++){l.writeUInt32BE(g,e.length);for(var y=o.run(l,o.ipad1),m=y,w=1;w<r;w++){m=o.run(m,o.ipad2);for(var _=0;_<b;_++){y[_]^=m[_];}}y.copy(c,p),p+=b;}return c;};},{403:403,484:484,485:485,487:487,514:514,515:515,519:519}],487:[function(t,e,r){var n=t(515).Buffer;e.exports=function(t,e,r){if(n.isBuffer(t))return t;if("string"==typeof t)return n.from(t,e);if(ArrayBuffer.isView(t))return n.from(t.buffer);throw new TypeError(r+" must be a string, a Buffer, a typed array or a DataView");};},{515:515}],488:[function(t,e,r){(function(t){(function(){"use strict";void 0===t||!t.version||0===t.version.indexOf("v0.")||0===t.version.indexOf("v1.")&&0!==t.version.indexOf("v1.8.")?e.exports={nextTick:function nextTick(e,r,n,i){if("function"!=typeof e)throw new TypeError('"callback" argument must be a function');var o,a,s=arguments.length;switch(s){case 0:case 1:return t.nextTick(e);case 2:return t.nextTick(function(){e.call(null,r);});case 3:return t.nextTick(function(){e.call(null,r,n);});case 4:return t.nextTick(function(){e.call(null,r,n,i);});default:for(o=new Array(s-1),a=0;a<o.length;){o[a++]=arguments[a];}return t.nextTick(function(){e.apply(null,o);});}}}:e.exports=t;}).call(this);}).call(this,t(489));},{489:489}],489:[function(t,e,r){var n,i,o=e.exports={};function a(){throw new Error("setTimeout has not been defined");}function s(){throw new Error("clearTimeout has not been defined");}function f(t){if(n===setTimeout)return setTimeout(t,0);if((n===a||!n)&&setTimeout)return n=setTimeout,setTimeout(t,0);try{return n(t,0);}catch(e){try{return n.call(null,t,0);}catch(e){return n.call(this,t,0);}}}!function(){try{n="function"==typeof setTimeout?setTimeout:a;}catch(t){n=a;}try{i="function"==typeof clearTimeout?clearTimeout:s;}catch(t){i=s;}}();var u,c=[],h=!1,d=-1;function l(){h&&u&&(h=!1,u.length?c=u.concat(c):d=-1,c.length&&p());}function p(){if(!h){var t=f(l);h=!0;for(var e=c.length;e;){for(u=c,c=[];++d<e;){u&&u[d].run();}d=-1,e=c.length;}u=null,h=!1,function(t){if(i===clearTimeout)return clearTimeout(t);if((i===s||!i)&&clearTimeout)return i=clearTimeout,clearTimeout(t);try{i(t);}catch(e){try{return i.call(null,t);}catch(e){return i.call(this,t);}}}(t);}}function b(t,e){this.fun=t,this.array=e;}function v(){}o.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++){e[r-1]=arguments[r];}c.push(new b(t,e)),1!==c.length||h||f(p);},b.prototype.run=function(){this.fun.apply(null,this.array);},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=v,o.addListener=v,o.once=v,o.off=v,o.removeListener=v,o.removeAllListeners=v,o.emit=v,o.prependListener=v,o.prependOnceListener=v,o.listeners=function(t){return[];},o.binding=function(t){throw new Error("process.binding is not supported");},o.cwd=function(){return"/";},o.chdir=function(t){throw new Error("process.chdir is not supported");},o.umask=function(){return 0;};},{}],490:[function(t,e,r){(function(t){(function(){!function(r){var n=setTimeout;function i(){}function o(t){if(!(this instanceof o))throw new TypeError("Promises must be constructed via new");if("function"!=typeof t)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],h(t,this);}function a(t,e){for(;3===t._state;){t=t._value;}0!==t._state?(t._handled=!0,o._immediateFn(function(){var r=1===t._state?e.onFulfilled:e.onRejected;if(null!==r){var n;try{n=r(t._value);}catch(t){return void f(e.promise,t);}s(e.promise,n);}else(1===t._state?s:f)(e.promise,t._value);})):t._deferreds.push(e);}function s(t,e){try{if(e===t)throw new TypeError("A promise cannot be resolved with itself.");if(e&&("object"==_typeof(e)||"function"==typeof e)){var r=e.then;if(e instanceof o)return t._state=3,t._value=e,void u(t);if("function"==typeof r)return void h((n=r,i=e,function(){n.apply(i,arguments);}),t);}t._state=1,t._value=e,u(t);}catch(e){f(t,e);}var n,i;}function f(t,e){t._state=2,t._value=e,u(t);}function u(t){2===t._state&&0===t._deferreds.length&&o._immediateFn(function(){t._handled||o._unhandledRejectionFn(t._value);});for(var e=0,r=t._deferreds.length;e<r;e++){a(t,t._deferreds[e]);}t._deferreds=null;}function c(t,e,r){this.onFulfilled="function"==typeof t?t:null,this.onRejected="function"==typeof e?e:null,this.promise=r;}function h(t,e){var r=!1;try{t(function(t){r||(r=!0,s(e,t));},function(t){r||(r=!0,f(e,t));});}catch(t){if(r)return;r=!0,f(e,t);}}o.prototype["catch"]=function(t){return this.then(null,t);},o.prototype.then=function(t,e){var r=new this.constructor(i);return a(this,new c(t,e,r)),r;},o.all=function(t){return new o(function(e,r){if(!t||void 0===t.length)throw new TypeError("Promise.all accepts an array");var n=Array.prototype.slice.call(t);if(0===n.length)return e([]);var i=n.length;function o(t,a){try{if(a&&("object"==_typeof(a)||"function"==typeof a)){var s=a.then;if("function"==typeof s)return void s.call(a,function(e){o(t,e);},r);}n[t]=a,0==--i&&e(n);}catch(t){r(t);}}for(var a=0;a<n.length;a++){o(a,n[a]);}});},o.resolve=function(t){return t&&"object"==_typeof(t)&&t.constructor===o?t:new o(function(e){e(t);});},o.reject=function(t){return new o(function(e,r){r(t);});},o.race=function(t){return new o(function(e,r){for(var n=0,i=t.length;n<i;n++){t[n].then(e,r);}});},o._immediateFn="function"==typeof t&&function(e){t(e);}||function(t){n(t,0);},o._unhandledRejectionFn=function(t){"undefined"!=typeof console&&console;},o._setImmediateFn=function(t){o._immediateFn=t;},o._setUnhandledRejectionFn=function(t){o._unhandledRejectionFn=t;},void 0!==e&&e.exports?e.exports=o:r.Promise||(r.Promise=o);}(this);}).call(this);}).call(this,t(528).setImmediate);},{528:528}],491:[function(t,e,r){r.publicEncrypt=t(495),r.privateDecrypt=t(494),r.privateEncrypt=function(t,e){return r.publicEncrypt(t,e,!0);},r.publicDecrypt=function(t,e){return r.privateDecrypt(t,e,!0);};},{494:494,495:495}],492:[function(t,e,r){var n=t(402),i=t(515).Buffer;function o(t){var e=i.allocUnsafe(4);return e.writeUInt32BE(t,0),e;}e.exports=function(t,e){for(var r,a=i.alloc(0),s=0;a.length<e;){r=o(s++),a=i.concat([a,n("sha1").update(t).update(r).digest()]);}return a.slice(0,e);};},{402:402,515:515}],493:[function(t,e,r){arguments[4][16][0].apply(r,arguments);},{16:16,21:21}],494:[function(t,e,r){var n=t(481),i=t(492),o=t(497),a=t(493),s=t(42),f=t(402),u=t(496),c=t(515).Buffer;e.exports=function(t,e,r){var h;h=t.padding?t.padding:r?1:4;var d,l=n(t),p=l.modulus.byteLength();if(e.length>p||new a(e).cmp(l.modulus)>=0)throw new Error("decryption error");d=r?u(new a(e),l):s(e,l);var b=c.alloc(p-d.length);if(d=c.concat([b,d],p),4===h)return function(t,e){var r=t.modulus.byteLength(),n=f("sha1").update(c.alloc(0)).digest(),a=n.length;if(0!==e[0])throw new Error("decryption error");var s=e.slice(1,a+1),u=e.slice(a+1),h=o(s,i(u,a)),d=o(u,i(h,r-a-1));if(function(t,e){t=c.from(t),e=c.from(e);var r=0,n=t.length;t.length!==e.length&&(r++,n=Math.min(t.length,e.length));var i=-1;for(;++i<n;){r+=t[i]^e[i];}return r;}(n,d.slice(0,a)))throw new Error("decryption error");var l=a;for(;0===d[l];){l++;}if(1!==d[l++])throw new Error("decryption error");return d.slice(l);}(l,d);if(1===h)return function(t,e,r){var n=e.slice(0,2),i=2,o=0;for(;0!==e[i++];){if(i>=e.length){o++;break;}}var a=e.slice(2,i-1);("0002"!==n.toString("hex")&&!r||"0001"!==n.toString("hex")&&r)&&o++;a.length<8&&o++;if(o)throw new Error("decryption error");return e.slice(i);}(0,d,r);if(3===h)return d;throw new Error("unknown padding");};},{402:402,42:42,481:481,492:492,493:493,496:496,497:497,515:515}],495:[function(t,e,r){var n=t(481),i=t(498),o=t(402),a=t(492),s=t(497),f=t(493),u=t(496),c=t(42),h=t(515).Buffer;e.exports=function(t,e,r){var d;d=t.padding?t.padding:r?1:4;var l,p=n(t);if(4===d)l=function(t,e){var r=t.modulus.byteLength(),n=e.length,u=o("sha1").update(h.alloc(0)).digest(),c=u.length,d=2*c;if(n>r-d-2)throw new Error("message too long");var l=h.alloc(r-n-d-2),p=r-c-1,b=i(c),v=s(h.concat([u,l,h.alloc(1,1),e],p),a(b,p)),g=s(b,a(v,c));return new f(h.concat([h.alloc(1),g,v],r));}(p,e);else if(1===d)l=function(t,e,r){var n,o=e.length,a=t.modulus.byteLength();if(o>a-11)throw new Error("message too long");n=r?h.alloc(a-o-3,255):function(t){var e,r=h.allocUnsafe(t),n=0,o=i(2*t),a=0;for(;n<t;){a===o.length&&(o=i(2*t),a=0),(e=o[a++])&&(r[n++]=e);}return r;}(a-o-3);return new f(h.concat([h.from([0,r?1:2]),n,h.alloc(1),e],a));}(p,e,r);else{if(3!==d)throw new Error("unknown padding");if((l=new f(e)).cmp(p.modulus)>=0)throw new Error("data too long for modulus");}return r?c(l,p):u(l,p);};},{402:402,42:42,481:481,492:492,493:493,496:496,497:497,498:498,515:515}],496:[function(t,e,r){var n=t(493),i=t(515).Buffer;e.exports=function(t,e){return i.from(t.toRed(n.mont(e.modulus)).redPow(new n(e.publicExponent)).fromRed().toArray());};},{493:493,515:515}],497:[function(t,e,r){e.exports=function(t,e){for(var r=t.length,n=-1;++n<r;){t[n]^=e[n];}return t;};},{}],498:[function(t,e,r){(function(r,n){(function(){"use strict";var i=65536,o=4294967295;var a=t(515).Buffer,s=n.crypto||n.msCrypto;s&&s.getRandomValues?e.exports=function(t,e){if(t>o)throw new RangeError("requested too many random bytes");var n=a.allocUnsafe(t);if(t>0)if(t>i)for(var f=0;f<t;f+=i){s.getRandomValues(n.slice(f,f+i));}else s.getRandomValues(n);if("function"==typeof e)return r.nextTick(function(){e(null,n);});return n;}:e.exports=function(){throw new Error("Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11");};}).call(this);}).call(this,t(489),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});},{489:489,515:515}],499:[function(t,e,r){(function(e,n){(function(){"use strict";function i(){throw new Error("secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11");}var o=t(515),a=t(498),s=o.Buffer,f=o.kMaxLength,u=n.crypto||n.msCrypto,c=Math.pow(2,32)-1;function h(t,e){if("number"!=typeof t||t!=t)throw new TypeError("offset must be a number");if(t>c||t<0)throw new TypeError("offset must be a uint32");if(t>f||t>e)throw new RangeError("offset out of range");}function d(t,e,r){if("number"!=typeof t||t!=t)throw new TypeError("size must be a number");if(t>c||t<0)throw new TypeError("size must be a uint32");if(t+e>r||t>f)throw new RangeError("buffer too small");}function l(t,r,n,i){if(e.browser){var o=t.buffer,s=new Uint8Array(o,r,n);return u.getRandomValues(s),i?void e.nextTick(function(){i(null,t);}):t;}if(!i)return a(n).copy(t,r),t;a(n,function(e,n){if(e)return i(e);n.copy(t,r),i(null,t);});}u&&u.getRandomValues||!e.browser?(r.randomFill=function(t,e,r,i){if(!(s.isBuffer(t)||t instanceof n.Uint8Array))throw new TypeError('"buf" argument must be a Buffer or Uint8Array');if("function"==typeof e)i=e,e=0,r=t.length;else if("function"==typeof r)i=r,r=t.length-e;else if("function"!=typeof i)throw new TypeError('"cb" argument must be a function');return h(e,t.length),d(r,e,t.length),l(t,e,r,i);},r.randomFillSync=function(t,e,r){void 0===e&&(e=0);if(!(s.isBuffer(t)||t instanceof n.Uint8Array))throw new TypeError('"buf" argument must be a Buffer or Uint8Array');h(e,t.length),void 0===r&&(r=t.length-e);return d(r,e,t.length),l(t,e,r);}):(r.randomFill=i,r.randomFillSync=i);}).call(this);}).call(this,t(489),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});},{489:489,498:498,515:515}],500:[function(t,e,r){e.exports=t(501);},{501:501}],501:[function(t,e,r){"use strict";var n=t(488),i=Object.keys||function(t){var e=[];for(var r in t){e.push(r);}return e;};e.exports=h;var o=Object.create(t(399));o.inherits=t(468);var a=t(503),s=t(505);o.inherits(h,a);for(var f=i(s.prototype),u=0;u<f.length;u++){var c=f[u];h.prototype[c]||(h.prototype[c]=s.prototype[c]);}function h(t){if(!(this instanceof h))return new h(t);a.call(this,t),s.call(this,t),t&&!1===t.readable&&(this.readable=!1),t&&!1===t.writable&&(this.writable=!1),this.allowHalfOpen=!0,t&&!1===t.allowHalfOpen&&(this.allowHalfOpen=!1),this.once("end",d);}function d(){this.allowHalfOpen||this._writableState.ended||n.nextTick(l,this);}function l(t){t.end();}Object.defineProperty(h.prototype,"writableHighWaterMark",{enumerable:!1,get:function get(){return this._writableState.highWaterMark;}}),Object.defineProperty(h.prototype,"destroyed",{get:function get(){return void 0!==this._readableState&&void 0!==this._writableState&&this._readableState.destroyed&&this._writableState.destroyed;},set:function set(t){void 0!==this._readableState&&void 0!==this._writableState&&(this._readableState.destroyed=t,this._writableState.destroyed=t);}}),h.prototype._destroy=function(t,e){this.push(null),this.end(),n.nextTick(e,t);};},{399:399,468:468,488:488,503:503,505:505}],502:[function(t,e,r){"use strict";e.exports=o;var n=t(504),i=Object.create(t(399));function o(t){if(!(this instanceof o))return new o(t);n.call(this,t);}i.inherits=t(468),i.inherits(o,n),o.prototype._transform=function(t,e,r){r(null,t);};},{399:399,468:468,504:504}],503:[function(t,e,r){(function(r,n){(function(){"use strict";var i=t(488);e.exports=m;var o,a=t(470);m.ReadableState=y;t(435).EventEmitter;var s=function s(t,e){return t.listeners(e).length;},f=t(508),u=t(515).Buffer,c=n.Uint8Array||function(){};var h=Object.create(t(399));h.inherits=t(468);var d=t(21),l=void 0;l=d&&d.debuglog?d.debuglog("stream"):function(){};var p,b=t(506),v=t(507);h.inherits(m,f);var g=["error","close","destroy","pause","resume"];function y(e,r){e=e||{};var n=r instanceof(o=o||t(501));this.objectMode=!!e.objectMode,n&&(this.objectMode=this.objectMode||!!e.readableObjectMode);var i=e.highWaterMark,a=e.readableHighWaterMark,s=this.objectMode?16:16384;this.highWaterMark=i||0===i?i:n&&(a||0===a)?a:s,this.highWaterMark=Math.floor(this.highWaterMark),this.buffer=new b(),this.length=0,this.pipes=null,this.pipesCount=0,this.flowing=null,this.ended=!1,this.endEmitted=!1,this.reading=!1,this.sync=!0,this.needReadable=!1,this.emittedReadable=!1,this.readableListening=!1,this.resumeScheduled=!1,this.destroyed=!1,this.defaultEncoding=e.defaultEncoding||"utf8",this.awaitDrain=0,this.readingMore=!1,this.decoder=null,this.encoding=null,e.encoding&&(p||(p=t(527).StringDecoder),this.decoder=new p(e.encoding),this.encoding=e.encoding);}function m(e){if(o=o||t(501),!(this instanceof m))return new m(e);this._readableState=new y(e,this),this.readable=!0,e&&("function"==typeof e.read&&(this._read=e.read),"function"==typeof e.destroy&&(this._destroy=e.destroy)),f.call(this);}function w(t,e,r,n,i){var o,a=t._readableState;null===e?(a.reading=!1,function(t,e){if(e.ended)return;if(e.decoder){var r=e.decoder.end();r&&r.length&&(e.buffer.push(r),e.length+=e.objectMode?1:r.length);}e.ended=!0,E(t);}(t,a)):(i||(o=function(t,e){var r;n=e,u.isBuffer(n)||n instanceof c||"string"==typeof e||void 0===e||t.objectMode||(r=new TypeError("Invalid non-string/buffer chunk"));var n;return r;}(a,e)),o?t.emit("error",o):a.objectMode||e&&e.length>0?("string"==typeof e||a.objectMode||Object.getPrototypeOf(e)===u.prototype||(e=function(t){return u.from(t);}(e)),n?a.endEmitted?t.emit("error",new Error("stream.unshift() after end event")):_(t,a,e,!0):a.ended?t.emit("error",new Error("stream.push() after EOF")):(a.reading=!1,a.decoder&&!r?(e=a.decoder.write(e),a.objectMode||0!==e.length?_(t,a,e,!1):x(t,a)):_(t,a,e,!1))):n||(a.reading=!1));return function(t){return!t.ended&&(t.needReadable||t.length<t.highWaterMark||0===t.length);}(a);}function _(t,e,r,n){e.flowing&&0===e.length&&!e.sync?(t.emit("data",r),t.read(0)):(e.length+=e.objectMode?1:r.length,n?e.buffer.unshift(r):e.buffer.push(r),e.needReadable&&E(t)),x(t,e);}Object.defineProperty(m.prototype,"destroyed",{get:function get(){return void 0!==this._readableState&&this._readableState.destroyed;},set:function set(t){this._readableState&&(this._readableState.destroyed=t);}}),m.prototype.destroy=v.destroy,m.prototype._undestroy=v.undestroy,m.prototype._destroy=function(t,e){this.push(null),e(t);},m.prototype.push=function(t,e){var r,n=this._readableState;return n.objectMode?r=!0:"string"==typeof t&&((e=e||n.defaultEncoding)!==n.encoding&&(t=u.from(t,e),e=""),r=!0),w(this,t,e,!1,r);},m.prototype.unshift=function(t){return w(this,t,null,!0,!1);},m.prototype.isPaused=function(){return!1===this._readableState.flowing;},m.prototype.setEncoding=function(e){return p||(p=t(527).StringDecoder),this._readableState.decoder=new p(e),this._readableState.encoding=e,this;};var S=8388608;function M(t,e){return t<=0||0===e.length&&e.ended?0:e.objectMode?1:t!=t?e.flowing&&e.length?e.buffer.head.data.length:e.length:(t>e.highWaterMark&&(e.highWaterMark=function(t){return t>=S?t=S:(t--,t|=t>>>1,t|=t>>>2,t|=t>>>4,t|=t>>>8,t|=t>>>16,t++),t;}(t)),t<=e.length?t:e.ended?e.length:(e.needReadable=!0,0));}function E(t){var e=t._readableState;e.needReadable=!1,e.emittedReadable||(l("emitReadable",e.flowing),e.emittedReadable=!0,e.sync?i.nextTick(k,t):k(t));}function k(t){l("emit readable"),t.emit("readable"),I(t);}function x(t,e){e.readingMore||(e.readingMore=!0,i.nextTick(A,t,e));}function A(t,e){for(var r=e.length;!e.reading&&!e.flowing&&!e.ended&&e.length<e.highWaterMark&&(l("maybeReadMore read 0"),t.read(0),r!==e.length);){r=e.length;}e.readingMore=!1;}function R(t){l("readable nexttick read 0"),t.read(0);}function T(t,e){e.reading||(l("resume read 0"),t.read(0)),e.resumeScheduled=!1,e.awaitDrain=0,t.emit("resume"),I(t),e.flowing&&!e.reading&&t.read(0);}function I(t){var e=t._readableState;for(l("flow",e.flowing);e.flowing&&null!==t.read();){;}}function B(t,e){return 0===e.length?null:(e.objectMode?r=e.buffer.shift():!t||t>=e.length?(r=e.decoder?e.buffer.join(""):1===e.buffer.length?e.buffer.head.data:e.buffer.concat(e.length),e.buffer.clear()):r=function(t,e,r){var n;t<e.head.data.length?(n=e.head.data.slice(0,t),e.head.data=e.head.data.slice(t)):n=t===e.head.data.length?e.shift():r?function(t,e){var r=e.head,n=1,i=r.data;t-=i.length;for(;r=r.next;){var o=r.data,a=t>o.length?o.length:t;if(a===o.length?i+=o:i+=o.slice(0,t),0===(t-=a)){a===o.length?(++n,r.next?e.head=r.next:e.head=e.tail=null):(e.head=r,r.data=o.slice(a));break;}++n;}return e.length-=n,i;}(t,e):function(t,e){var r=u.allocUnsafe(t),n=e.head,i=1;n.data.copy(r),t-=n.data.length;for(;n=n.next;){var o=n.data,a=t>o.length?o.length:t;if(o.copy(r,r.length-t,0,a),0===(t-=a)){a===o.length?(++i,n.next?e.head=n.next:e.head=e.tail=null):(e.head=n,n.data=o.slice(a));break;}++i;}return e.length-=i,r;}(t,e);return n;}(t,e.buffer,e.decoder),r);var r;}function P(t){var e=t._readableState;if(e.length>0)throw new Error('"endReadable()" called on non-empty stream');e.endEmitted||(e.ended=!0,i.nextTick(O,e,t));}function O(t,e){t.endEmitted||0!==t.length||(t.endEmitted=!0,e.readable=!1,e.emit("end"));}function C(t,e){for(var r=0,n=t.length;r<n;r++){if(t[r]===e)return r;}return-1;}m.prototype.read=function(t){l("read",t),t=parseInt(t,10);var e=this._readableState,r=t;if(0!==t&&(e.emittedReadable=!1),0===t&&e.needReadable&&(e.length>=e.highWaterMark||e.ended))return l("read: emitReadable",e.length,e.ended),0===e.length&&e.ended?P(this):E(this),null;if(0===(t=M(t,e))&&e.ended)return 0===e.length&&P(this),null;var n,i=e.needReadable;return l("need readable",i),(0===e.length||e.length-t<e.highWaterMark)&&l("length less than watermark",i=!0),e.ended||e.reading?l("reading or ended",i=!1):i&&(l("do read"),e.reading=!0,e.sync=!0,0===e.length&&(e.needReadable=!0),this._read(e.highWaterMark),e.sync=!1,e.reading||(t=M(r,e))),null===(n=t>0?B(t,e):null)?(e.needReadable=!0,t=0):e.length-=t,0===e.length&&(e.ended||(e.needReadable=!0),r!==t&&e.ended&&P(this)),null!==n&&this.emit("data",n),n;},m.prototype._read=function(t){this.emit("error",new Error("_read() is not implemented"));},m.prototype.pipe=function(t,e){var n=this,o=this._readableState;switch(o.pipesCount){case 0:o.pipes=t;break;case 1:o.pipes=[o.pipes,t];break;default:o.pipes.push(t);}o.pipesCount+=1,l("pipe count=%d opts=%j",o.pipesCount,e);var f=(!e||!1!==e.end)&&t!==r.stdout&&t!==r.stderr?c:m;function u(e,r){l("onunpipe"),e===n&&r&&!1===r.hasUnpiped&&(r.hasUnpiped=!0,l("cleanup"),t.removeListener("close",g),t.removeListener("finish",y),t.removeListener("drain",h),t.removeListener("error",v),t.removeListener("unpipe",u),n.removeListener("end",c),n.removeListener("end",m),n.removeListener("data",b),d=!0,!o.awaitDrain||t._writableState&&!t._writableState.needDrain||h());}function c(){l("onend"),t.end();}o.endEmitted?i.nextTick(f):n.once("end",f),t.on("unpipe",u);var h=function(t){return function(){var e=t._readableState;l("pipeOnDrain",e.awaitDrain),e.awaitDrain&&e.awaitDrain--,0===e.awaitDrain&&s(t,"data")&&(e.flowing=!0,I(t));};}(n);t.on("drain",h);var d=!1;var p=!1;function b(e){l("ondata"),p=!1,!1!==t.write(e)||p||((1===o.pipesCount&&o.pipes===t||o.pipesCount>1&&-1!==C(o.pipes,t))&&!d&&(l("false write response, pause",n._readableState.awaitDrain),n._readableState.awaitDrain++,p=!0),n.pause());}function v(e){l("onerror",e),m(),t.removeListener("error",v),0===s(t,"error")&&t.emit("error",e);}function g(){t.removeListener("finish",y),m();}function y(){l("onfinish"),t.removeListener("close",g),m();}function m(){l("unpipe"),n.unpipe(t);}return n.on("data",b),function(t,e,r){if("function"==typeof t.prependListener)return t.prependListener(e,r);t._events&&t._events[e]?a(t._events[e])?t._events[e].unshift(r):t._events[e]=[r,t._events[e]]:t.on(e,r);}(t,"error",v),t.once("close",g),t.once("finish",y),t.emit("pipe",n),o.flowing||(l("pipe resume"),n.resume()),t;},m.prototype.unpipe=function(t){var e=this._readableState,r={hasUnpiped:!1};if(0===e.pipesCount)return this;if(1===e.pipesCount)return t&&t!==e.pipes||(t||(t=e.pipes),e.pipes=null,e.pipesCount=0,e.flowing=!1,t&&t.emit("unpipe",this,r)),this;if(!t){var n=e.pipes,i=e.pipesCount;e.pipes=null,e.pipesCount=0,e.flowing=!1;for(var o=0;o<i;o++){n[o].emit("unpipe",this,r);}return this;}var a=C(e.pipes,t);return-1===a||(e.pipes.splice(a,1),e.pipesCount-=1,1===e.pipesCount&&(e.pipes=e.pipes[0]),t.emit("unpipe",this,r)),this;},m.prototype.on=function(t,e){var r=f.prototype.on.call(this,t,e);if("data"===t)!1!==this._readableState.flowing&&this.resume();else if("readable"===t){var n=this._readableState;n.endEmitted||n.readableListening||(n.readableListening=n.needReadable=!0,n.emittedReadable=!1,n.reading?n.length&&E(this):i.nextTick(R,this));}return r;},m.prototype.addListener=m.prototype.on,m.prototype.resume=function(){var t=this._readableState;return t.flowing||(l("resume"),t.flowing=!0,function(t,e){e.resumeScheduled||(e.resumeScheduled=!0,i.nextTick(T,t,e));}(this,t)),this;},m.prototype.pause=function(){return l("call pause flowing=%j",this._readableState.flowing),!1!==this._readableState.flowing&&(l("pause"),this._readableState.flowing=!1,this.emit("pause")),this;},m.prototype.wrap=function(t){var e=this,r=this._readableState,n=!1;for(var i in t.on("end",function(){if(l("wrapped end"),r.decoder&&!r.ended){var t=r.decoder.end();t&&t.length&&e.push(t);}e.push(null);}),t.on("data",function(i){(l("wrapped data"),r.decoder&&(i=r.decoder.write(i)),r.objectMode&&null==i)||(r.objectMode||i&&i.length)&&(e.push(i)||(n=!0,t.pause()));}),t){void 0===this[i]&&"function"==typeof t[i]&&(this[i]=function(e){return function(){return t[e].apply(t,arguments);};}(i));}for(var o=0;o<g.length;o++){t.on(g[o],this.emit.bind(this,g[o]));}return this._read=function(e){l("wrapped _read",e),n&&(n=!1,t.resume());},this;},Object.defineProperty(m.prototype,"readableHighWaterMark",{enumerable:!1,get:function get(){return this._readableState.highWaterMark;}}),m._fromList=B;}).call(this);}).call(this,t(489),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});},{21:21,399:399,435:435,468:468,470:470,488:488,489:489,501:501,506:506,507:507,508:508,515:515,527:527}],504:[function(t,e,r){"use strict";e.exports=a;var n=t(501),i=Object.create(t(399));function o(t,e){var r=this._transformState;r.transforming=!1;var n=r.writecb;if(!n)return this.emit("error",new Error("write callback called multiple times"));r.writechunk=null,r.writecb=null,null!=e&&this.push(e),n(t);var i=this._readableState;i.reading=!1,(i.needReadable||i.length<i.highWaterMark)&&this._read(i.highWaterMark);}function a(t){if(!(this instanceof a))return new a(t);n.call(this,t),this._transformState={afterTransform:o.bind(this),needTransform:!1,transforming:!1,writecb:null,writechunk:null,writeencoding:null},this._readableState.needReadable=!0,this._readableState.sync=!1,t&&("function"==typeof t.transform&&(this._transform=t.transform),"function"==typeof t.flush&&(this._flush=t.flush)),this.on("prefinish",s);}function s(){var t=this;"function"==typeof this._flush?this._flush(function(e,r){f(t,e,r);}):f(this,null,null);}function f(t,e,r){if(e)return t.emit("error",e);if(null!=r&&t.push(r),t._writableState.length)throw new Error("Calling transform done when ws.length != 0");if(t._transformState.transforming)throw new Error("Calling transform done when still transforming");return t.push(null);}i.inherits=t(468),i.inherits(a,n),a.prototype.push=function(t,e){return this._transformState.needTransform=!1,n.prototype.push.call(this,t,e);},a.prototype._transform=function(t,e,r){throw new Error("_transform() is not implemented");},a.prototype._write=function(t,e,r){var n=this._transformState;if(n.writecb=r,n.writechunk=t,n.writeencoding=e,!n.transforming){var i=this._readableState;(n.needTransform||i.needReadable||i.length<i.highWaterMark)&&this._read(i.highWaterMark);}},a.prototype._read=function(t){var e=this._transformState;null!==e.writechunk&&e.writecb&&!e.transforming?(e.transforming=!0,this._transform(e.writechunk,e.writeencoding,e.afterTransform)):e.needTransform=!0;},a.prototype._destroy=function(t,e){var r=this;n.prototype._destroy.call(this,t,function(t){e(t),r.emit("close");});};},{399:399,468:468,501:501}],505:[function(t,e,r){(function(r,n,i){(function(){"use strict";var o=t(488);function a(t){var e=this;this.next=null,this.entry=null,this.finish=function(){!function(t,e,r){var n=t.entry;t.entry=null;for(;n;){var i=n.callback;e.pendingcb--,i(r),n=n.next;}e.corkedRequestsFree?e.corkedRequestsFree.next=t:e.corkedRequestsFree=t;}(e,t);};}e.exports=y;var s,f=!r.browser&&["v0.10","v0.9."].indexOf(r.version.slice(0,5))>-1?i:o.nextTick;y.WritableState=g;var u=Object.create(t(399));u.inherits=t(468);var c={deprecate:t(529)},h=t(508),d=t(515).Buffer,l=n.Uint8Array||function(){};var p,b=t(507);function v(){}function g(e,r){s=s||t(501),e=e||{};var n=r instanceof s;this.objectMode=!!e.objectMode,n&&(this.objectMode=this.objectMode||!!e.writableObjectMode);var i=e.highWaterMark,u=e.writableHighWaterMark,c=this.objectMode?16:16384;this.highWaterMark=i||0===i?i:n&&(u||0===u)?u:c,this.highWaterMark=Math.floor(this.highWaterMark),this.finalCalled=!1,this.needDrain=!1,this.ending=!1,this.ended=!1,this.finished=!1,this.destroyed=!1;var h=!1===e.decodeStrings;this.decodeStrings=!h,this.defaultEncoding=e.defaultEncoding||"utf8",this.length=0,this.writing=!1,this.corked=0,this.sync=!0,this.bufferProcessing=!1,this.onwrite=function(t){!function(t,e){var r=t._writableState,n=r.sync,i=r.writecb;if(function(t){t.writing=!1,t.writecb=null,t.length-=t.writelen,t.writelen=0;}(r),e)!function(t,e,r,n,i){--e.pendingcb,r?(o.nextTick(i,n),o.nextTick(E,t,e),t._writableState.errorEmitted=!0,t.emit("error",n)):(i(n),t._writableState.errorEmitted=!0,t.emit("error",n),E(t,e));}(t,r,n,e,i);else{var a=S(r);a||r.corked||r.bufferProcessing||!r.bufferedRequest||_(t,r),n?f(w,t,r,a,i):w(t,r,a,i);}}(r,t);},this.writecb=null,this.writelen=0,this.bufferedRequest=null,this.lastBufferedRequest=null,this.pendingcb=0,this.prefinished=!1,this.errorEmitted=!1,this.bufferedRequestCount=0,this.corkedRequestsFree=new a(this);}function y(e){if(s=s||t(501),!(p.call(y,this)||this instanceof s))return new y(e);this._writableState=new g(e,this),this.writable=!0,e&&("function"==typeof e.write&&(this._write=e.write),"function"==typeof e.writev&&(this._writev=e.writev),"function"==typeof e.destroy&&(this._destroy=e.destroy),"function"==typeof e["final"]&&(this._final=e["final"])),h.call(this);}function m(t,e,r,n,i,o,a){e.writelen=n,e.writecb=a,e.writing=!0,e.sync=!0,r?t._writev(i,e.onwrite):t._write(i,o,e.onwrite),e.sync=!1;}function w(t,e,r,n){r||function(t,e){0===e.length&&e.needDrain&&(e.needDrain=!1,t.emit("drain"));}(t,e),e.pendingcb--,n(),E(t,e);}function _(t,e){e.bufferProcessing=!0;var r=e.bufferedRequest;if(t._writev&&r&&r.next){var n=e.bufferedRequestCount,i=new Array(n),o=e.corkedRequestsFree;o.entry=r;for(var s=0,f=!0;r;){i[s]=r,r.isBuf||(f=!1),r=r.next,s+=1;}i.allBuffers=f,m(t,e,!0,e.length,i,"",o.finish),e.pendingcb++,e.lastBufferedRequest=null,o.next?(e.corkedRequestsFree=o.next,o.next=null):e.corkedRequestsFree=new a(e),e.bufferedRequestCount=0;}else{for(;r;){var u=r.chunk,c=r.encoding,h=r.callback;if(m(t,e,!1,e.objectMode?1:u.length,u,c,h),r=r.next,e.bufferedRequestCount--,e.writing)break;}null===r&&(e.lastBufferedRequest=null);}e.bufferedRequest=r,e.bufferProcessing=!1;}function S(t){return t.ending&&0===t.length&&null===t.bufferedRequest&&!t.finished&&!t.writing;}function M(t,e){t._final(function(r){e.pendingcb--,r&&t.emit("error",r),e.prefinished=!0,t.emit("prefinish"),E(t,e);});}function E(t,e){var r=S(e);return r&&(!function(t,e){e.prefinished||e.finalCalled||("function"==typeof t._final?(e.pendingcb++,e.finalCalled=!0,o.nextTick(M,t,e)):(e.prefinished=!0,t.emit("prefinish")));}(t,e),0===e.pendingcb&&(e.finished=!0,t.emit("finish"))),r;}u.inherits(y,h),g.prototype.getBuffer=function(){for(var t=this.bufferedRequest,e=[];t;){e.push(t),t=t.next;}return e;},function(){try{Object.defineProperty(g.prototype,"buffer",{get:c.deprecate(function(){return this.getBuffer();},"_writableState.buffer is deprecated. Use _writableState.getBuffer instead.","DEP0003")});}catch(t){}}(),"function"==typeof Symbol&&Symbol.hasInstance&&"function"==typeof Function.prototype[Symbol.hasInstance]?(p=Function.prototype[Symbol.hasInstance],Object.defineProperty(y,Symbol.hasInstance,{value:function value(t){return!!p.call(this,t)||this===y&&t&&t._writableState instanceof g;}})):p=function p(t){return t instanceof this;},y.prototype.pipe=function(){this.emit("error",new Error("Cannot pipe, not readable"));},y.prototype.write=function(t,e,r){var n,i=this._writableState,a=!1,s=!i.objectMode&&(n=t,d.isBuffer(n)||n instanceof l);return s&&!d.isBuffer(t)&&(t=function(t){return d.from(t);}(t)),"function"==typeof e&&(r=e,e=null),s?e="buffer":e||(e=i.defaultEncoding),"function"!=typeof r&&(r=v),i.ended?function(t,e){var r=new Error("write after end");t.emit("error",r),o.nextTick(e,r);}(this,r):(s||function(t,e,r,n){var i=!0,a=!1;return null===r?a=new TypeError("May not write null values to stream"):"string"==typeof r||void 0===r||e.objectMode||(a=new TypeError("Invalid non-string/buffer chunk")),a&&(t.emit("error",a),o.nextTick(n,a),i=!1),i;}(this,i,t,r))&&(i.pendingcb++,a=function(t,e,r,n,i,o){if(!r){var a=function(t,e,r){t.objectMode||!1===t.decodeStrings||"string"!=typeof e||(e=d.from(e,r));return e;}(e,n,i);n!==a&&(r=!0,i="buffer",n=a);}var s=e.objectMode?1:n.length;e.length+=s;var f=e.length<e.highWaterMark;f||(e.needDrain=!0);if(e.writing||e.corked){var u=e.lastBufferedRequest;e.lastBufferedRequest={chunk:n,encoding:i,isBuf:r,callback:o,next:null},u?u.next=e.lastBufferedRequest:e.bufferedRequest=e.lastBufferedRequest,e.bufferedRequestCount+=1;}else m(t,e,!1,s,n,i,o);return f;}(this,i,s,t,e,r)),a;},y.prototype.cork=function(){this._writableState.corked++;},y.prototype.uncork=function(){var t=this._writableState;t.corked&&(t.corked--,t.writing||t.corked||t.finished||t.bufferProcessing||!t.bufferedRequest||_(this,t));},y.prototype.setDefaultEncoding=function(t){if("string"==typeof t&&(t=t.toLowerCase()),!(["hex","utf8","utf-8","ascii","binary","base64","ucs2","ucs-2","utf16le","utf-16le","raw"].indexOf((t+"").toLowerCase())>-1))throw new TypeError("Unknown encoding: "+t);return this._writableState.defaultEncoding=t,this;},Object.defineProperty(y.prototype,"writableHighWaterMark",{enumerable:!1,get:function get(){return this._writableState.highWaterMark;}}),y.prototype._write=function(t,e,r){r(new Error("_write() is not implemented"));},y.prototype._writev=null,y.prototype.end=function(t,e,r){var n=this._writableState;"function"==typeof t?(r=t,t=null,e=null):"function"==typeof e&&(r=e,e=null),null!=t&&this.write(t,e),n.corked&&(n.corked=1,this.uncork()),n.ending||n.finished||function(t,e,r){e.ending=!0,E(t,e),r&&(e.finished?o.nextTick(r):t.once("finish",r));e.ended=!0,t.writable=!1;}(this,n,r);},Object.defineProperty(y.prototype,"destroyed",{get:function get(){return void 0!==this._writableState&&this._writableState.destroyed;},set:function set(t){this._writableState&&(this._writableState.destroyed=t);}}),y.prototype.destroy=b.destroy,y.prototype._undestroy=b.undestroy,y.prototype._destroy=function(t,e){this.end(),e(t);};}).call(this);}).call(this,t(489),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},t(528).setImmediate);},{399:399,468:468,488:488,489:489,501:501,507:507,508:508,515:515,528:528,529:529}],506:[function(t,e,r){"use strict";var n=t(515).Buffer,i=t(21);e.exports=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function");}(this,t),this.head=null,this.tail=null,this.length=0;}return t.prototype.push=function(t){var e={data:t,next:null};this.length>0?this.tail.next=e:this.head=e,this.tail=e,++this.length;},t.prototype.unshift=function(t){var e={data:t,next:this.head};0===this.length&&(this.tail=e),this.head=e,++this.length;},t.prototype.shift=function(){if(0!==this.length){var t=this.head.data;return 1===this.length?this.head=this.tail=null:this.head=this.head.next,--this.length,t;}},t.prototype.clear=function(){this.head=this.tail=null,this.length=0;},t.prototype.join=function(t){if(0===this.length)return"";for(var e=this.head,r=""+e.data;e=e.next;){r+=t+e.data;}return r;},t.prototype.concat=function(t){if(0===this.length)return n.alloc(0);if(1===this.length)return this.head.data;for(var e,r,i,o=n.allocUnsafe(t>>>0),a=this.head,s=0;a;){e=a.data,r=o,i=s,e.copy(r,i),s+=a.data.length,a=a.next;}return o;},t;}(),i&&i.inspect&&i.inspect.custom&&(e.exports.prototype[i.inspect.custom]=function(){var t=i.inspect({length:this.length});return this.constructor.name+" "+t;});},{21:21,515:515}],507:[function(t,e,r){"use strict";var n=t(488);function i(t,e){t.emit("error",e);}e.exports={destroy:function destroy(t,e){var r=this,o=this._readableState&&this._readableState.destroyed,a=this._writableState&&this._writableState.destroyed;return o||a?(e?e(t):!t||this._writableState&&this._writableState.errorEmitted||n.nextTick(i,this,t),this):(this._readableState&&(this._readableState.destroyed=!0),this._writableState&&(this._writableState.destroyed=!0),this._destroy(t||null,function(t){!e&&t?(n.nextTick(i,r,t),r._writableState&&(r._writableState.errorEmitted=!0)):e&&e(t);}),this);},undestroy:function undestroy(){this._readableState&&(this._readableState.destroyed=!1,this._readableState.reading=!1,this._readableState.ended=!1,this._readableState.endEmitted=!1),this._writableState&&(this._writableState.destroyed=!1,this._writableState.ended=!1,this._writableState.ending=!1,this._writableState.finished=!1,this._writableState.errorEmitted=!1);}};},{488:488}],508:[function(t,e,r){arguments[4][63][0].apply(r,arguments);},{435:435,63:63}],509:[function(t,e,r){e.exports=t(510).PassThrough;},{510:510}],510:[function(t,e,r){(r=e.exports=t(503)).Stream=r,r.Readable=r,r.Writable=t(505),r.Duplex=t(501),r.Transform=t(504),r.PassThrough=t(502);},{501:501,502:502,503:503,504:504,505:505}],511:[function(t,e,r){e.exports=t(510).Transform;},{510:510}],512:[function(t,e,r){e.exports=t(505);},{505:505}],513:[function(t,e,r){(function(t){(function(){!function(t){"use strict";var r,n=Object.prototype,i=n.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},a=o.iterator||"@@iterator",s=o.asyncIterator||"@@asyncIterator",f=o.toStringTag||"@@toStringTag",u="object"==_typeof(e),c=t.regeneratorRuntime;if(c)u&&(e.exports=c);else{(c=t.regeneratorRuntime=u?e.exports:{}).wrap=w;var h="suspendedStart",d="suspendedYield",l="executing",p="completed",b={},v={};v[a]=function(){return this;};var g=Object.getPrototypeOf,y=g&&g(g(B([])));y&&y!==n&&i.call(y,a)&&(v=y);var m=E.prototype=S.prototype=Object.create(v);M.prototype=m.constructor=E,E.constructor=M,E[f]=M.displayName="GeneratorFunction",c.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===M||"GeneratorFunction"===(e.displayName||e.name));},c.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,E):(t.__proto__=E,f in t||(t[f]="GeneratorFunction")),t.prototype=Object.create(m),t;},c.awrap=function(t){return{__await:t};},k(x.prototype),x.prototype[s]=function(){return this;},c.AsyncIterator=x,c.async=function(t,e,r,n){var i=new x(w(t,e,r,n));return c.isGeneratorFunction(e)?i:i.next().then(function(t){return t.done?t.value:i.next();});},k(m),m[f]="Generator",m[a]=function(){return this;},m.toString=function(){return"[object Generator]";},c.keys=function(t){var e=[];for(var r in t){e.push(r);}return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r;}return r.done=!0,r;};},c.values=B,I.prototype={constructor:I,reset:function reset(t){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(T),!t)for(var e in this){"t"===e.charAt(0)&&i.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=r);}},stop:function stop(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval;},dispatchException:function dispatchException(t){if(this.done)throw t;var e=this;function n(n,i){return s.type="throw",s.arg=t,e.next=n,i&&(e.method="next",e.arg=r),!!i;}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],s=a.completion;if("root"===a.tryLoc)return n("end");if(a.tryLoc<=this.prev){var f=i.call(a,"catchLoc"),u=i.call(a,"finallyLoc");if(f&&u){if(this.prev<a.catchLoc)return n(a.catchLoc,!0);if(this.prev<a.finallyLoc)return n(a.finallyLoc);}else if(f){if(this.prev<a.catchLoc)return n(a.catchLoc,!0);}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return n(a.finallyLoc);}}}},abrupt:function abrupt(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&i.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break;}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=e,o?(this.method="next",this.next=o.finallyLoc,b):this.complete(a);},complete:function complete(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),b;},finish:function finish(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),T(r),b;}},"catch":function _catch(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var i=n.arg;T(r);}return i;}}throw new Error("illegal catch attempt");},delegateYield:function delegateYield(t,e,n){return this.delegate={iterator:B(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=r),b;}};}function w(t,e,r,n){var i=e&&e.prototype instanceof S?e:S,o=Object.create(i.prototype),a=new I(n||[]);return o._invoke=function(t,e,r){var n=h;return function(i,o){if(n===l)throw new Error("Generator is already running");if(n===p){if("throw"===i)throw o;return P();}for(r.method=i,r.arg=o;;){var a=r.delegate;if(a){var s=A(a,r);if(s){if(s===b)continue;return s;}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===h)throw n=p,r.arg;r.dispatchException(r.arg);}else"return"===r.method&&r.abrupt("return",r.arg);n=l;var f=_(t,e,r);if("normal"===f.type){if(n=r.done?p:d,f.arg===b)continue;return{value:f.arg,done:r.done};}"throw"===f.type&&(n=p,r.method="throw",r.arg=f.arg);}};}(t,r,a),o;}function _(t,e,r){try{return{type:"normal",arg:t.call(e,r)};}catch(t){return{type:"throw",arg:t};}}function S(){}function M(){}function E(){}function k(t){["next","throw","return"].forEach(function(e){t[e]=function(t){return this._invoke(e,t);};});}function x(e){function r(t,n,o,a){var s=_(e[t],e,n);if("throw"!==s.type){var f=s.arg,u=f.value;return u&&"object"==_typeof(u)&&i.call(u,"__await")?Promise.resolve(u.__await).then(function(t){r("next",t,o,a);},function(t){r("throw",t,o,a);}):Promise.resolve(u).then(function(t){f.value=t,o(f);},a);}a(s.arg);}var n;"object"==_typeof(t.process)&&t.process.domain&&(r=t.process.domain.bind(r)),this._invoke=function(t,e){function i(){return new Promise(function(n,i){r(t,e,n,i);});}return n=n?n.then(i,i):i();};}function A(t,e){var n=t.iterator[e.method];if(n===r){if(e.delegate=null,"throw"===e.method){if(t.iterator["return"]&&(e.method="return",e.arg=r,A(t,e),"throw"===e.method))return b;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method");}return b;}var i=_(n,t.iterator,e.arg);if("throw"===i.type)return e.method="throw",e.arg=i.arg,e.delegate=null,b;var o=i.arg;return o?o.done?(e[t.resultName]=o.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=r),e.delegate=null,b):o:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,b);}function R(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e);}function T(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e;}function I(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(R,this),this.reset(!0);}function B(t){if(t){var e=t[a];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,o=function e(){for(;++n<t.length;){if(i.call(t,n))return e.value=t[n],e.done=!1,e;}return e.value=r,e.done=!0,e;};return o.next=o;}}return{next:P};}function P(){return{value:r,done:!0};}}("object"==_typeof(t)?t:"object"==(typeof window==="undefined"?"undefined":_typeof(window))?window:"object"==(typeof self==="undefined"?"undefined":_typeof(self))?self:this);}).call(this);}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});},{}],514:[function(t,e,r){"use strict";var n=t(68).Buffer,i=t(468),o=t(437),a=new Array(16),s=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13],f=[5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11],u=[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6],c=[8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11],h=[0,1518500249,1859775393,2400959708,2840853838],d=[1352829926,1548603684,1836072691,2053994217,0];function l(){o.call(this,64),this._a=1732584193,this._b=4023233417,this._c=2562383102,this._d=271733878,this._e=3285377520;}function p(t,e){return t<<e|t>>>32-e;}function b(t,e,r,n,i,o,a,s){return p(t+(e^r^n)+o+a|0,s)+i|0;}function v(t,e,r,n,i,o,a,s){return p(t+(e&r|~e&n)+o+a|0,s)+i|0;}function g(t,e,r,n,i,o,a,s){return p(t+((e|~r)^n)+o+a|0,s)+i|0;}function y(t,e,r,n,i,o,a,s){return p(t+(e&n|r&~n)+o+a|0,s)+i|0;}function m(t,e,r,n,i,o,a,s){return p(t+(e^(r|~n))+o+a|0,s)+i|0;}i(l,o),l.prototype._update=function(){for(var t=a,e=0;e<16;++e){t[e]=this._block.readInt32LE(4*e);}for(var r=0|this._a,n=0|this._b,i=0|this._c,o=0|this._d,l=0|this._e,w=0|this._a,_=0|this._b,S=0|this._c,M=0|this._d,E=0|this._e,k=0;k<80;k+=1){var x,A;k<16?(x=b(r,n,i,o,l,t[s[k]],h[0],u[k]),A=m(w,_,S,M,E,t[f[k]],d[0],c[k])):k<32?(x=v(r,n,i,o,l,t[s[k]],h[1],u[k]),A=y(w,_,S,M,E,t[f[k]],d[1],c[k])):k<48?(x=g(r,n,i,o,l,t[s[k]],h[2],u[k]),A=g(w,_,S,M,E,t[f[k]],d[2],c[k])):k<64?(x=y(r,n,i,o,l,t[s[k]],h[3],u[k]),A=v(w,_,S,M,E,t[f[k]],d[3],c[k])):(x=m(r,n,i,o,l,t[s[k]],h[4],u[k]),A=b(w,_,S,M,E,t[f[k]],d[4],c[k])),r=l,l=o,o=p(i,10),i=n,n=x,w=E,E=M,M=p(S,10),S=_,_=A;}var R=this._b+i+M|0;this._b=this._c+o+E|0,this._c=this._d+l+w|0,this._d=this._e+r+_|0,this._e=this._a+n+S|0,this._a=R;},l.prototype._digest=function(){this._block[this._blockOffset++]=128,this._blockOffset>56&&(this._block.fill(0,this._blockOffset,64),this._update(),this._blockOffset=0),this._block.fill(0,this._blockOffset,56),this._block.writeUInt32LE(this._length[0],56),this._block.writeUInt32LE(this._length[1],60),this._update();var t=n.alloc?n.alloc(20):new n(20);return t.writeInt32LE(this._a,0),t.writeInt32LE(this._b,4),t.writeInt32LE(this._c,8),t.writeInt32LE(this._d,12),t.writeInt32LE(this._e,16),t;},e.exports=l;},{437:437,468:468,68:68}],515:[function(t,e,r){var n=t(68),i=n.Buffer;function o(t,e){for(var r in t){e[r]=t[r];}}function a(t,e,r){return i(t,e,r);}i.from&&i.alloc&&i.allocUnsafe&&i.allocUnsafeSlow?e.exports=n:(o(n,r),r.Buffer=a),o(i,a),a.from=function(t,e,r){if("number"==typeof t)throw new TypeError("Argument must not be a number");return i(t,e,r);},a.alloc=function(t,e,r){if("number"!=typeof t)throw new TypeError("Argument must be a number");var n=i(t);return void 0!==e?"string"==typeof r?n.fill(e,r):n.fill(e):n.fill(0),n;},a.allocUnsafe=function(t){if("number"!=typeof t)throw new TypeError("Argument must be a number");return i(t);},a.allocUnsafeSlow=function(t){if("number"!=typeof t)throw new TypeError("Argument must be a number");return n.SlowBuffer(t);};},{68:68}],516:[function(t,e,r){(function(r){(function(){"use strict";var n,i=t(68),o=i.Buffer,a={};for(n in i){i.hasOwnProperty(n)&&"SlowBuffer"!==n&&"Buffer"!==n&&(a[n]=i[n]);}var s=a.Buffer={};for(n in o){o.hasOwnProperty(n)&&"allocUnsafe"!==n&&"allocUnsafeSlow"!==n&&(s[n]=o[n]);}if(a.Buffer.prototype=o.prototype,s.from&&s.from!==Uint8Array.from||(s.from=function(t,e,r){if("number"==typeof t)throw new TypeError('The "value" argument must not be of type number. Received type '+_typeof(t));if(t&&void 0===t.length)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+_typeof(t));return o(t,e,r);}),s.alloc||(s.alloc=function(t,e,r){if("number"!=typeof t)throw new TypeError('The "size" argument must be of type number. Received type '+_typeof(t));if(t<0||t>=2*(1<<30))throw new RangeError('The value "'+t+'" is invalid for option "size"');var n=o(t);return e&&0!==e.length?"string"==typeof r?n.fill(e,r):n.fill(e):n.fill(0),n;}),!a.kStringMaxLength)try{a.kStringMaxLength=r.binding("buffer").kStringMaxLength;}catch(t){}a.constants||(a.constants={MAX_LENGTH:a.kMaxLength},a.kStringMaxLength&&(a.constants.MAX_STRING_LENGTH=a.kStringMaxLength)),e.exports=a;}).call(this);}).call(this,t(489));},{489:489,68:68}],517:[function(t,e,r){"use strict";var n={generateIdentifier:function generateIdentifier(){return Math.random().toString(36).substr(2,10);}};n.localCName=n.generateIdentifier(),n.splitLines=function(t){return t.trim().split("\n").map(function(t){return t.trim();});},n.splitSections=function(t){return t.split("\nm=").map(function(t,e){return(e>0?"m="+t:t).trim()+"\r\n";});},n.getDescription=function(t){var e=n.splitSections(t);return e&&e[0];},n.getMediaSections=function(t){var e=n.splitSections(t);return e.shift(),e;},n.matchPrefix=function(t,e){return n.splitLines(t).filter(function(t){return 0===t.indexOf(e);});},n.parseCandidate=function(t){for(var e,r={foundation:(e=0===t.indexOf("a=candidate:")?t.substring(12).split(" "):t.substring(10).split(" "))[0],component:parseInt(e[1],10),protocol:e[2].toLowerCase(),priority:parseInt(e[3],10),ip:e[4],address:e[4],port:parseInt(e[5],10),type:e[7]},n=8;n<e.length;n+=2){switch(e[n]){case"raddr":r.relatedAddress=e[n+1];break;case"rport":r.relatedPort=parseInt(e[n+1],10);break;case"tcptype":r.tcpType=e[n+1];break;case"ufrag":r.ufrag=e[n+1],r.usernameFragment=e[n+1];break;default:r[e[n]]=e[n+1];}}return r;},n.writeCandidate=function(t){var e=[];e.push(t.foundation),e.push(t.component),e.push(t.protocol.toUpperCase()),e.push(t.priority),e.push(t.address||t.ip),e.push(t.port);var r=t.type;return e.push("typ"),e.push(r),"host"!==r&&t.relatedAddress&&t.relatedPort&&(e.push("raddr"),e.push(t.relatedAddress),e.push("rport"),e.push(t.relatedPort)),t.tcpType&&"tcp"===t.protocol.toLowerCase()&&(e.push("tcptype"),e.push(t.tcpType)),(t.usernameFragment||t.ufrag)&&(e.push("ufrag"),e.push(t.usernameFragment||t.ufrag)),"candidate:"+e.join(" ");},n.parseIceOptions=function(t){return t.substr(14).split(" ");},n.parseRtpMap=function(t){var e=t.substr(9).split(" "),r={payloadType:parseInt(e.shift(),10)};return e=e[0].split("/"),r.name=e[0],r.clockRate=parseInt(e[1],10),r.channels=3===e.length?parseInt(e[2],10):1,r.numChannels=r.channels,r;},n.writeRtpMap=function(t){var e=t.payloadType;void 0!==t.preferredPayloadType&&(e=t.preferredPayloadType);var r=t.channels||t.numChannels||1;return"a=rtpmap:"+e+" "+t.name+"/"+t.clockRate+(1!==r?"/"+r:"")+"\r\n";},n.parseExtmap=function(t){var e=t.substr(9).split(" ");return{id:parseInt(e[0],10),direction:e[0].indexOf("/")>0?e[0].split("/")[1]:"sendrecv",uri:e[1]};},n.writeExtmap=function(t){return"a=extmap:"+(t.id||t.preferredId)+(t.direction&&"sendrecv"!==t.direction?"/"+t.direction:"")+" "+t.uri+"\r\n";},n.parseFmtp=function(t){for(var e,r={},n=t.substr(t.indexOf(" ")+1).split(";"),i=0;i<n.length;i++){r[(e=n[i].trim().split("="))[0].trim()]=e[1];}return r;},n.writeFmtp=function(t){var e="",r=t.payloadType;if(void 0!==t.preferredPayloadType&&(r=t.preferredPayloadType),t.parameters&&Object.keys(t.parameters).length){var n=[];Object.keys(t.parameters).forEach(function(e){t.parameters[e]?n.push(e+"="+t.parameters[e]):n.push(e);}),e+="a=fmtp:"+r+" "+n.join(";")+"\r\n";}return e;},n.parseRtcpFb=function(t){var e=t.substr(t.indexOf(" ")+1).split(" ");return{type:e.shift(),parameter:e.join(" ")};},n.writeRtcpFb=function(t){var e="",r=t.payloadType;return void 0!==t.preferredPayloadType&&(r=t.preferredPayloadType),t.rtcpFeedback&&t.rtcpFeedback.length&&t.rtcpFeedback.forEach(function(t){e+="a=rtcp-fb:"+r+" "+t.type+(t.parameter&&t.parameter.length?" "+t.parameter:"")+"\r\n";}),e;},n.parseSsrcMedia=function(t){var e=t.indexOf(" "),r={ssrc:parseInt(t.substr(7,e-7),10)},n=t.indexOf(":",e);return n>-1?(r.attribute=t.substr(e+1,n-e-1),r.value=t.substr(n+1)):r.attribute=t.substr(e+1),r;},n.parseSsrcGroup=function(t){var e=t.substr(13).split(" ");return{semantics:e.shift(),ssrcs:e.map(function(t){return parseInt(t,10);})};},n.getMid=function(t){var e=n.matchPrefix(t,"a=mid:")[0];if(e)return e.substr(6);},n.parseFingerprint=function(t){var e=t.substr(14).split(" ");return{algorithm:e[0].toLowerCase(),value:e[1]};},n.getDtlsParameters=function(t,e){return{role:"auto",fingerprints:n.matchPrefix(t+e,"a=fingerprint:").map(n.parseFingerprint)};},n.writeDtlsParameters=function(t,e){var r="a=setup:"+e+"\r\n";return t.fingerprints.forEach(function(t){r+="a=fingerprint:"+t.algorithm+" "+t.value+"\r\n";}),r;},n.parseCryptoLine=function(t){var e=t.substr(9).split(" ");return{tag:parseInt(e[0],10),cryptoSuite:e[1],keyParams:e[2],sessionParams:e.slice(3)};},n.writeCryptoLine=function(t){return"a=crypto:"+t.tag+" "+t.cryptoSuite+" "+("object"==_typeof(t.keyParams)?n.writeCryptoKeyParams(t.keyParams):t.keyParams)+(t.sessionParams?" "+t.sessionParams.join(" "):"")+"\r\n";},n.parseCryptoKeyParams=function(t){if(0!==t.indexOf("inline:"))return null;var e=t.substr(7).split("|");return{keyMethod:"inline",keySalt:e[0],lifeTime:e[1],mkiValue:e[2]?e[2].split(":")[0]:void 0,mkiLength:e[2]?e[2].split(":")[1]:void 0};},n.writeCryptoKeyParams=function(t){return t.keyMethod+":"+t.keySalt+(t.lifeTime?"|"+t.lifeTime:"")+(t.mkiValue&&t.mkiLength?"|"+t.mkiValue+":"+t.mkiLength:"");},n.getCryptoParameters=function(t,e){return n.matchPrefix(t+e,"a=crypto:").map(n.parseCryptoLine);},n.getIceParameters=function(t,e){var r=n.matchPrefix(t+e,"a=ice-ufrag:")[0],i=n.matchPrefix(t+e,"a=ice-pwd:")[0];return r&&i?{usernameFragment:r.substr(12),password:i.substr(10)}:null;},n.writeIceParameters=function(t){return"a=ice-ufrag:"+t.usernameFragment+"\r\na=ice-pwd:"+t.password+"\r\n";},n.parseRtpParameters=function(t){for(var e={codecs:[],headerExtensions:[],fecMechanisms:[],rtcp:[]},r=n.splitLines(t)[0].split(" "),i=3;i<r.length;i++){var o=r[i],a=n.matchPrefix(t,"a=rtpmap:"+o+" ")[0];if(a){var s=n.parseRtpMap(a),f=n.matchPrefix(t,"a=fmtp:"+o+" ");switch(s.parameters=f.length?n.parseFmtp(f[0]):{},s.rtcpFeedback=n.matchPrefix(t,"a=rtcp-fb:"+o+" ").map(n.parseRtcpFb),e.codecs.push(s),s.name.toUpperCase()){case"RED":case"ULPFEC":e.fecMechanisms.push(s.name.toUpperCase());}}}return n.matchPrefix(t,"a=extmap:").forEach(function(t){e.headerExtensions.push(n.parseExtmap(t));}),e;},n.writeRtpDescription=function(t,e){var r="";r+="m="+t+" ",r+=e.codecs.length>0?"9":"0",r+=" UDP/TLS/RTP/SAVPF ",r+=e.codecs.map(function(t){return void 0!==t.preferredPayloadType?t.preferredPayloadType:t.payloadType;}).join(" ")+"\r\n",r+="c=IN IP4 0.0.0.0\r\n",r+="a=rtcp:9 IN IP4 0.0.0.0\r\n",e.codecs.forEach(function(t){r+=n.writeRtpMap(t),r+=n.writeFmtp(t),r+=n.writeRtcpFb(t);});var i=0;return e.codecs.forEach(function(t){t.maxptime>i&&(i=t.maxptime);}),i>0&&(r+="a=maxptime:"+i+"\r\n"),r+="a=rtcp-mux\r\n",e.headerExtensions&&e.headerExtensions.forEach(function(t){r+=n.writeExtmap(t);}),r;},n.parseRtpEncodingParameters=function(t){var e,r=[],i=n.parseRtpParameters(t),o=-1!==i.fecMechanisms.indexOf("RED"),a=-1!==i.fecMechanisms.indexOf("ULPFEC"),s=n.matchPrefix(t,"a=ssrc:").map(function(t){return n.parseSsrcMedia(t);}).filter(function(t){return"cname"===t.attribute;}),f=s.length>0&&s[0].ssrc,u=n.matchPrefix(t,"a=ssrc-group:FID").map(function(t){return t.substr(17).split(" ").map(function(t){return parseInt(t,10);});});u.length>0&&u[0].length>1&&u[0][0]===f&&(e=u[0][1]),i.codecs.forEach(function(t){if("RTX"===t.name.toUpperCase()&&t.parameters.apt){var n={ssrc:f,codecPayloadType:parseInt(t.parameters.apt,10)};f&&e&&(n.rtx={ssrc:e}),r.push(n),o&&((n=JSON.parse(JSON.stringify(n))).fec={ssrc:f,mechanism:a?"red+ulpfec":"red"},r.push(n));}}),0===r.length&&f&&r.push({ssrc:f});var c=n.matchPrefix(t,"b=");return c.length&&(c=0===c[0].indexOf("b=TIAS:")?parseInt(c[0].substr(7),10):0===c[0].indexOf("b=AS:")?1e3*parseInt(c[0].substr(5),10)*.95-16e3:void 0,r.forEach(function(t){t.maxBitrate=c;})),r;},n.parseRtcpParameters=function(t){var e={},r=n.matchPrefix(t,"a=ssrc:").map(function(t){return n.parseSsrcMedia(t);}).filter(function(t){return"cname"===t.attribute;})[0];r&&(e.cname=r.value,e.ssrc=r.ssrc);var i=n.matchPrefix(t,"a=rtcp-rsize");e.reducedSize=i.length>0,e.compound=0===i.length;var o=n.matchPrefix(t,"a=rtcp-mux");return e.mux=o.length>0,e;},n.parseMsid=function(t){var e,r=n.matchPrefix(t,"a=msid:");if(1===r.length)return{stream:(e=r[0].substr(7).split(" "))[0],track:e[1]};var i=n.matchPrefix(t,"a=ssrc:").map(function(t){return n.parseSsrcMedia(t);}).filter(function(t){return"msid"===t.attribute;});return i.length>0?{stream:(e=i[0].value.split(" "))[0],track:e[1]}:void 0;},n.parseSctpDescription=function(t){var e,r=n.parseMLine(t),i=n.matchPrefix(t,"a=max-message-size:");i.length>0&&(e=parseInt(i[0].substr(19),10)),isNaN(e)&&(e=65536);var o=n.matchPrefix(t,"a=sctp-port:");if(o.length>0)return{port:parseInt(o[0].substr(12),10),protocol:r.fmt,maxMessageSize:e};if(n.matchPrefix(t,"a=sctpmap:").length>0){var a=n.matchPrefix(t,"a=sctpmap:")[0].substr(10).split(" ");return{port:parseInt(a[0],10),protocol:a[1],maxMessageSize:e};}},n.writeSctpDescription=function(t,e){var r=[];return r="DTLS/SCTP"!==t.protocol?["m="+t.kind+" 9 "+t.protocol+" "+e.protocol+"\r\n","c=IN IP4 0.0.0.0\r\n","a=sctp-port:"+e.port+"\r\n"]:["m="+t.kind+" 9 "+t.protocol+" "+e.port+"\r\n","c=IN IP4 0.0.0.0\r\n","a=sctpmap:"+e.port+" "+e.protocol+" 65535\r\n"],void 0!==e.maxMessageSize&&r.push("a=max-message-size:"+e.maxMessageSize+"\r\n"),r.join("");},n.generateSessionId=function(){return Math.random().toString().substr(2,21);},n.writeSessionBoilerplate=function(t,e,r){var i=void 0!==e?e:2;return"v=0\r\no="+(r||"thisisadapterortc")+" "+(t||n.generateSessionId())+" "+i+" IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n";},n.writeMediaSection=function(t,e,r,i){var o=n.writeRtpDescription(t.kind,e);if(o+=n.writeIceParameters(t.iceGatherer.getLocalParameters()),o+=n.writeDtlsParameters(t.dtlsTransport.getLocalParameters(),"offer"===r?"actpass":"active"),o+="a=mid:"+t.mid+"\r\n",t.direction?o+="a="+t.direction+"\r\n":t.rtpSender&&t.rtpReceiver?o+="a=sendrecv\r\n":t.rtpSender?o+="a=sendonly\r\n":t.rtpReceiver?o+="a=recvonly\r\n":o+="a=inactive\r\n",t.rtpSender){var a="msid:"+i.id+" "+t.rtpSender.track.id+"\r\n";o+="a="+a,o+="a=ssrc:"+t.sendEncodingParameters[0].ssrc+" "+a,t.sendEncodingParameters[0].rtx&&(o+="a=ssrc:"+t.sendEncodingParameters[0].rtx.ssrc+" "+a,o+="a=ssrc-group:FID "+t.sendEncodingParameters[0].ssrc+" "+t.sendEncodingParameters[0].rtx.ssrc+"\r\n");}return o+="a=ssrc:"+t.sendEncodingParameters[0].ssrc+" cname:"+n.localCName+"\r\n",t.rtpSender&&t.sendEncodingParameters[0].rtx&&(o+="a=ssrc:"+t.sendEncodingParameters[0].rtx.ssrc+" cname:"+n.localCName+"\r\n"),o;},n.getDirection=function(t,e){for(var r=n.splitLines(t),i=0;i<r.length;i++){switch(r[i]){case"a=sendrecv":case"a=sendonly":case"a=recvonly":case"a=inactive":return r[i].substr(2);}}return e?n.getDirection(e):"sendrecv";},n.getKind=function(t){return n.splitLines(t)[0].split(" ")[0].substr(2);},n.isRejected=function(t){return"0"===t.split(" ",2)[1];},n.parseMLine=function(t){var e=n.splitLines(t)[0].substr(2).split(" ");return{kind:e[0],port:parseInt(e[1],10),protocol:e[2],fmt:e.slice(3).join(" ")};},n.parseOLine=function(t){var e=n.matchPrefix(t,"o=")[0].substr(2).split(" ");return{username:e[0],sessionId:e[1],sessionVersion:parseInt(e[2],10),netType:e[3],addressType:e[4],address:e[5]};},n.isValidSDP=function(t){if("string"!=typeof t||0===t.length)return!1;for(var e=n.splitLines(t),r=0;r<e.length;r++){if(e[r].length<2||"="!==e[r].charAt(1))return!1;}return!0;},"object"==_typeof(e)&&(e.exports=n);},{}],518:[function(t,e,r){var n=t(515).Buffer;function i(t,e){this._block=n.alloc(t),this._finalSize=e,this._blockSize=t,this._len=0;}i.prototype.update=function(t,e){"string"==typeof t&&(e=e||"utf8",t=n.from(t,e));for(var r=this._block,i=this._blockSize,o=t.length,a=this._len,s=0;s<o;){for(var f=a%i,u=Math.min(o-s,i-f),c=0;c<u;c++){r[f+c]=t[s+c];}s+=u,(a+=u)%i==0&&this._update(r);}return this._len+=o,this;},i.prototype.digest=function(t){var e=this._len%this._blockSize;this._block[e]=128,this._block.fill(0,e+1),e>=this._finalSize&&(this._update(this._block),this._block.fill(0));var r=8*this._len;if(r<=4294967295)this._block.writeUInt32BE(r,this._blockSize-4);else{var n=(4294967295&r)>>>0,i=(r-n)/4294967296;this._block.writeUInt32BE(i,this._blockSize-8),this._block.writeUInt32BE(n,this._blockSize-4);}this._update(this._block);var o=this._hash();return t?o.toString(t):o;},i.prototype._update=function(){throw new Error("_update must be implemented by subclass");},e.exports=i;},{515:515}],519:[function(t,e,r){(r=e.exports=function(t){t=t.toLowerCase();var e=r[t];if(!e)throw new Error(t+" is not supported (we accept pull requests)");return new e();}).sha=t(520),r.sha1=t(521),r.sha224=t(522),r.sha256=t(523),r.sha384=t(524),r.sha512=t(525);},{520:520,521:521,522:522,523:523,524:524,525:525}],520:[function(t,e,r){var n=t(468),i=t(518),o=t(515).Buffer,a=[1518500249,1859775393,-1894007588,-899497514],s=new Array(80);function f(){this.init(),this._w=s,i.call(this,64,56);}function u(t){return t<<30|t>>>2;}function c(t,e,r,n){return 0===t?e&r|~e&n:2===t?e&r|e&n|r&n:e^r^n;}n(f,i),f.prototype.init=function(){return this._a=1732584193,this._b=4023233417,this._c=2562383102,this._d=271733878,this._e=3285377520,this;},f.prototype._update=function(t){for(var e,r=this._w,n=0|this._a,i=0|this._b,o=0|this._c,s=0|this._d,f=0|this._e,h=0;h<16;++h){r[h]=t.readInt32BE(4*h);}for(;h<80;++h){r[h]=r[h-3]^r[h-8]^r[h-14]^r[h-16];}for(var d=0;d<80;++d){var l=~~(d/20),p=0|((e=n)<<5|e>>>27)+c(l,i,o,s)+f+r[d]+a[l];f=s,s=o,o=u(i),i=n,n=p;}this._a=n+this._a|0,this._b=i+this._b|0,this._c=o+this._c|0,this._d=s+this._d|0,this._e=f+this._e|0;},f.prototype._hash=function(){var t=o.allocUnsafe(20);return t.writeInt32BE(0|this._a,0),t.writeInt32BE(0|this._b,4),t.writeInt32BE(0|this._c,8),t.writeInt32BE(0|this._d,12),t.writeInt32BE(0|this._e,16),t;},e.exports=f;},{468:468,515:515,518:518}],521:[function(t,e,r){var n=t(468),i=t(518),o=t(515).Buffer,a=[1518500249,1859775393,-1894007588,-899497514],s=new Array(80);function f(){this.init(),this._w=s,i.call(this,64,56);}function u(t){return t<<5|t>>>27;}function c(t){return t<<30|t>>>2;}function h(t,e,r,n){return 0===t?e&r|~e&n:2===t?e&r|e&n|r&n:e^r^n;}n(f,i),f.prototype.init=function(){return this._a=1732584193,this._b=4023233417,this._c=2562383102,this._d=271733878,this._e=3285377520,this;},f.prototype._update=function(t){for(var e,r=this._w,n=0|this._a,i=0|this._b,o=0|this._c,s=0|this._d,f=0|this._e,d=0;d<16;++d){r[d]=t.readInt32BE(4*d);}for(;d<80;++d){r[d]=(e=r[d-3]^r[d-8]^r[d-14]^r[d-16])<<1|e>>>31;}for(var l=0;l<80;++l){var p=~~(l/20),b=u(n)+h(p,i,o,s)+f+r[l]+a[p]|0;f=s,s=o,o=c(i),i=n,n=b;}this._a=n+this._a|0,this._b=i+this._b|0,this._c=o+this._c|0,this._d=s+this._d|0,this._e=f+this._e|0;},f.prototype._hash=function(){var t=o.allocUnsafe(20);return t.writeInt32BE(0|this._a,0),t.writeInt32BE(0|this._b,4),t.writeInt32BE(0|this._c,8),t.writeInt32BE(0|this._d,12),t.writeInt32BE(0|this._e,16),t;},e.exports=f;},{468:468,515:515,518:518}],522:[function(t,e,r){var n=t(468),i=t(523),o=t(518),a=t(515).Buffer,s=new Array(64);function f(){this.init(),this._w=s,o.call(this,64,56);}n(f,i),f.prototype.init=function(){return this._a=3238371032,this._b=914150663,this._c=812702999,this._d=4144912697,this._e=4290775857,this._f=1750603025,this._g=1694076839,this._h=3204075428,this;},f.prototype._hash=function(){var t=a.allocUnsafe(28);return t.writeInt32BE(this._a,0),t.writeInt32BE(this._b,4),t.writeInt32BE(this._c,8),t.writeInt32BE(this._d,12),t.writeInt32BE(this._e,16),t.writeInt32BE(this._f,20),t.writeInt32BE(this._g,24),t;},e.exports=f;},{468:468,515:515,518:518,523:523}],523:[function(t,e,r){var n=t(468),i=t(518),o=t(515).Buffer,a=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],s=new Array(64);function f(){this.init(),this._w=s,i.call(this,64,56);}function u(t,e,r){return r^t&(e^r);}function c(t,e,r){return t&e|r&(t|e);}function h(t){return(t>>>2|t<<30)^(t>>>13|t<<19)^(t>>>22|t<<10);}function d(t){return(t>>>6|t<<26)^(t>>>11|t<<21)^(t>>>25|t<<7);}function l(t){return(t>>>7|t<<25)^(t>>>18|t<<14)^t>>>3;}n(f,i),f.prototype.init=function(){return this._a=1779033703,this._b=3144134277,this._c=1013904242,this._d=2773480762,this._e=1359893119,this._f=2600822924,this._g=528734635,this._h=1541459225,this;},f.prototype._update=function(t){for(var e,r=this._w,n=0|this._a,i=0|this._b,o=0|this._c,s=0|this._d,f=0|this._e,p=0|this._f,b=0|this._g,v=0|this._h,g=0;g<16;++g){r[g]=t.readInt32BE(4*g);}for(;g<64;++g){r[g]=0|(((e=r[g-2])>>>17|e<<15)^(e>>>19|e<<13)^e>>>10)+r[g-7]+l(r[g-15])+r[g-16];}for(var y=0;y<64;++y){var m=v+d(f)+u(f,p,b)+a[y]+r[y]|0,w=h(n)+c(n,i,o)|0;v=b,b=p,p=f,f=s+m|0,s=o,o=i,i=n,n=m+w|0;}this._a=n+this._a|0,this._b=i+this._b|0,this._c=o+this._c|0,this._d=s+this._d|0,this._e=f+this._e|0,this._f=p+this._f|0,this._g=b+this._g|0,this._h=v+this._h|0;},f.prototype._hash=function(){var t=o.allocUnsafe(32);return t.writeInt32BE(this._a,0),t.writeInt32BE(this._b,4),t.writeInt32BE(this._c,8),t.writeInt32BE(this._d,12),t.writeInt32BE(this._e,16),t.writeInt32BE(this._f,20),t.writeInt32BE(this._g,24),t.writeInt32BE(this._h,28),t;},e.exports=f;},{468:468,515:515,518:518}],524:[function(t,e,r){var n=t(468),i=t(525),o=t(518),a=t(515).Buffer,s=new Array(160);function f(){this.init(),this._w=s,o.call(this,128,112);}n(f,i),f.prototype.init=function(){return this._ah=3418070365,this._bh=1654270250,this._ch=2438529370,this._dh=355462360,this._eh=1731405415,this._fh=2394180231,this._gh=3675008525,this._hh=1203062813,this._al=3238371032,this._bl=914150663,this._cl=812702999,this._dl=4144912697,this._el=4290775857,this._fl=1750603025,this._gl=1694076839,this._hl=3204075428,this;},f.prototype._hash=function(){var t=a.allocUnsafe(48);function e(e,r,n){t.writeInt32BE(e,n),t.writeInt32BE(r,n+4);}return e(this._ah,this._al,0),e(this._bh,this._bl,8),e(this._ch,this._cl,16),e(this._dh,this._dl,24),e(this._eh,this._el,32),e(this._fh,this._fl,40),t;},e.exports=f;},{468:468,515:515,518:518,525:525}],525:[function(t,e,r){var n=t(468),i=t(518),o=t(515).Buffer,a=[1116352408,3609767458,1899447441,602891725,3049323471,3964484399,3921009573,2173295548,961987163,4081628472,1508970993,3053834265,2453635748,2937671579,2870763221,3664609560,3624381080,2734883394,310598401,1164996542,607225278,1323610764,1426881987,3590304994,1925078388,4068182383,2162078206,991336113,2614888103,633803317,3248222580,3479774868,3835390401,2666613458,4022224774,944711139,264347078,2341262773,604807628,2007800933,770255983,1495990901,1249150122,1856431235,1555081692,3175218132,1996064986,2198950837,2554220882,3999719339,2821834349,766784016,2952996808,2566594879,3210313671,3203337956,3336571891,1034457026,3584528711,2466948901,113926993,3758326383,338241895,168717936,666307205,1188179964,773529912,1546045734,1294757372,1522805485,1396182291,2643833823,1695183700,2343527390,1986661051,1014477480,2177026350,1206759142,2456956037,344077627,2730485921,1290863460,2820302411,3158454273,3259730800,3505952657,3345764771,106217008,3516065817,3606008344,3600352804,1432725776,4094571909,1467031594,275423344,851169720,430227734,3100823752,506948616,1363258195,659060556,3750685593,883997877,3785050280,958139571,3318307427,1322822218,3812723403,1537002063,2003034995,1747873779,3602036899,1955562222,1575990012,2024104815,1125592928,2227730452,2716904306,2361852424,442776044,2428436474,593698344,2756734187,3733110249,3204031479,2999351573,3329325298,3815920427,3391569614,3928383900,3515267271,566280711,3940187606,3454069534,4118630271,4000239992,116418474,1914138554,174292421,2731055270,289380356,3203993006,460393269,320620315,685471733,587496836,852142971,1086792851,1017036298,365543100,1126000580,2618297676,1288033470,3409855158,1501505948,4234509866,1607167915,987167468,1816402316,1246189591],s=new Array(160);function f(){this.init(),this._w=s,i.call(this,128,112);}function u(t,e,r){return r^t&(e^r);}function c(t,e,r){return t&e|r&(t|e);}function h(t,e){return(t>>>28|e<<4)^(e>>>2|t<<30)^(e>>>7|t<<25);}function d(t,e){return(t>>>14|e<<18)^(t>>>18|e<<14)^(e>>>9|t<<23);}function l(t,e){return(t>>>1|e<<31)^(t>>>8|e<<24)^t>>>7;}function p(t,e){return(t>>>1|e<<31)^(t>>>8|e<<24)^(t>>>7|e<<25);}function b(t,e){return(t>>>19|e<<13)^(e>>>29|t<<3)^t>>>6;}function v(t,e){return(t>>>19|e<<13)^(e>>>29|t<<3)^(t>>>6|e<<26);}function g(t,e){return t>>>0<e>>>0?1:0;}n(f,i),f.prototype.init=function(){return this._ah=1779033703,this._bh=3144134277,this._ch=1013904242,this._dh=2773480762,this._eh=1359893119,this._fh=2600822924,this._gh=528734635,this._hh=1541459225,this._al=4089235720,this._bl=2227873595,this._cl=4271175723,this._dl=1595750129,this._el=2917565137,this._fl=725511199,this._gl=4215389547,this._hl=327033209,this;},f.prototype._update=function(t){for(var e=this._w,r=0|this._ah,n=0|this._bh,i=0|this._ch,o=0|this._dh,s=0|this._eh,f=0|this._fh,y=0|this._gh,m=0|this._hh,w=0|this._al,_=0|this._bl,S=0|this._cl,M=0|this._dl,E=0|this._el,k=0|this._fl,x=0|this._gl,A=0|this._hl,R=0;R<32;R+=2){e[R]=t.readInt32BE(4*R),e[R+1]=t.readInt32BE(4*R+4);}for(;R<160;R+=2){var T=e[R-30],I=e[R-30+1],B=l(T,I),P=p(I,T),O=b(T=e[R-4],I=e[R-4+1]),C=v(I,T),L=e[R-14],j=e[R-14+1],N=e[R-32],D=e[R-32+1],U=P+j|0,F=B+L+g(U,P)|0;F=(F=F+O+g(U=U+C|0,C)|0)+N+g(U=U+D|0,D)|0,e[R]=F,e[R+1]=U;}for(var q=0;q<160;q+=2){F=e[q],U=e[q+1];var z=c(r,n,i),W=c(w,_,S),V=h(r,w),H=h(w,r),G=d(s,E),K=d(E,s),X=a[q],Z=a[q+1],Y=u(s,f,y),J=u(E,k,x),$=A+K|0,Q=m+G+g($,A)|0;Q=(Q=(Q=Q+Y+g($=$+J|0,J)|0)+X+g($=$+Z|0,Z)|0)+F+g($=$+U|0,U)|0;var tt=H+W|0,et=V+z+g(tt,H)|0;m=y,A=x,y=f,x=k,f=s,k=E,s=o+Q+g(E=M+$|0,M)|0,o=i,M=S,i=n,S=_,n=r,_=w,r=Q+et+g(w=$+tt|0,$)|0;}this._al=this._al+w|0,this._bl=this._bl+_|0,this._cl=this._cl+S|0,this._dl=this._dl+M|0,this._el=this._el+E|0,this._fl=this._fl+k|0,this._gl=this._gl+x|0,this._hl=this._hl+A|0,this._ah=this._ah+r+g(this._al,w)|0,this._bh=this._bh+n+g(this._bl,_)|0,this._ch=this._ch+i+g(this._cl,S)|0,this._dh=this._dh+o+g(this._dl,M)|0,this._eh=this._eh+s+g(this._el,E)|0,this._fh=this._fh+f+g(this._fl,k)|0,this._gh=this._gh+y+g(this._gl,x)|0,this._hh=this._hh+m+g(this._hl,A)|0;},f.prototype._hash=function(){var t=o.allocUnsafe(64);function e(e,r,n){t.writeInt32BE(e,n),t.writeInt32BE(r,n+4);}return e(this._ah,this._al,0),e(this._bh,this._bl,8),e(this._ch,this._cl,16),e(this._dh,this._dl,24),e(this._eh,this._el,32),e(this._fh,this._fl,40),e(this._gh,this._gl,48),e(this._hh,this._hl,56),t;},e.exports=f;},{468:468,515:515,518:518}],526:[function(t,e,r){e.exports=i;var n=t(435).EventEmitter;function i(){n.call(this);}t(468)(i,n),i.Readable=t(510),i.Writable=t(512),i.Duplex=t(500),i.Transform=t(511),i.PassThrough=t(509),i.Stream=i,i.prototype.pipe=function(t,e){var r=this;function i(e){t.writable&&!1===t.write(e)&&r.pause&&r.pause();}function o(){r.readable&&r.resume&&r.resume();}r.on("data",i),t.on("drain",o),t._isStdio||e&&!1===e.end||(r.on("end",s),r.on("close",f));var a=!1;function s(){a||(a=!0,t.end());}function f(){a||(a=!0,"function"==typeof t.destroy&&t.destroy());}function u(t){if(c(),0===n.listenerCount(this,"error"))throw t;}function c(){r.removeListener("data",i),t.removeListener("drain",o),r.removeListener("end",s),r.removeListener("close",f),r.removeListener("error",u),t.removeListener("error",u),r.removeListener("end",c),r.removeListener("close",c),t.removeListener("close",c);}return r.on("error",u),t.on("error",u),r.on("end",c),r.on("close",c),t.on("close",c),t.emit("pipe",r),t;};},{435:435,468:468,500:500,509:509,510:510,511:511,512:512}],527:[function(t,e,r){"use strict";var n=t(515).Buffer,i=n.isEncoding||function(t){switch((t=""+t)&&t.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return!0;default:return!1;}};function o(t){var e;switch(this.encoding=function(t){var e=function(t){if(!t)return"utf8";for(var e;;){switch(t){case"utf8":case"utf-8":return"utf8";case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return"utf16le";case"latin1":case"binary":return"latin1";case"base64":case"ascii":case"hex":return t;default:if(e)return;t=(""+t).toLowerCase(),e=!0;}}}(t);if("string"!=typeof e&&(n.isEncoding===i||!i(t)))throw new Error("Unknown encoding: "+t);return e||t;}(t),this.encoding){case"utf16le":this.text=f,this.end=u,e=4;break;case"utf8":this.fillLast=s,e=4;break;case"base64":this.text=c,this.end=h,e=3;break;default:return this.write=d,void(this.end=l);}this.lastNeed=0,this.lastTotal=0,this.lastChar=n.allocUnsafe(e);}function a(t){return t<=127?0:t>>5==6?2:t>>4==14?3:t>>3==30?4:t>>6==2?-1:-2;}function s(t){var e=this.lastTotal-this.lastNeed,r=function(t,e,r){if(128!=(192&e[0]))return t.lastNeed=0,"�";if(t.lastNeed>1&&e.length>1){if(128!=(192&e[1]))return t.lastNeed=1,"�";if(t.lastNeed>2&&e.length>2&&128!=(192&e[2]))return t.lastNeed=2,"�";}}(this,t);return void 0!==r?r:this.lastNeed<=t.length?(t.copy(this.lastChar,e,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal)):(t.copy(this.lastChar,e,0,t.length),void(this.lastNeed-=t.length));}function f(t,e){if((t.length-e)%2==0){var r=t.toString("utf16le",e);if(r){var n=r.charCodeAt(r.length-1);if(n>=55296&&n<=56319)return this.lastNeed=2,this.lastTotal=4,this.lastChar[0]=t[t.length-2],this.lastChar[1]=t[t.length-1],r.slice(0,-1);}return r;}return this.lastNeed=1,this.lastTotal=2,this.lastChar[0]=t[t.length-1],t.toString("utf16le",e,t.length-1);}function u(t){var e=t&&t.length?this.write(t):"";if(this.lastNeed){var r=this.lastTotal-this.lastNeed;return e+this.lastChar.toString("utf16le",0,r);}return e;}function c(t,e){var r=(t.length-e)%3;return 0===r?t.toString("base64",e):(this.lastNeed=3-r,this.lastTotal=3,1===r?this.lastChar[0]=t[t.length-1]:(this.lastChar[0]=t[t.length-2],this.lastChar[1]=t[t.length-1]),t.toString("base64",e,t.length-r));}function h(t){var e=t&&t.length?this.write(t):"";return this.lastNeed?e+this.lastChar.toString("base64",0,3-this.lastNeed):e;}function d(t){return t.toString(this.encoding);}function l(t){return t&&t.length?this.write(t):"";}r.StringDecoder=o,o.prototype.write=function(t){if(0===t.length)return"";var e,r;if(this.lastNeed){if(void 0===(e=this.fillLast(t)))return"";r=this.lastNeed,this.lastNeed=0;}else r=0;return r<t.length?e?e+this.text(t,r):this.text(t,r):e||"";},o.prototype.end=function(t){var e=t&&t.length?this.write(t):"";return this.lastNeed?e+"�":e;},o.prototype.text=function(t,e){var r=function(t,e,r){var n=e.length-1;if(n<r)return 0;var i=a(e[n]);if(i>=0)return i>0&&(t.lastNeed=i-1),i;if(--n<r||-2===i)return 0;if((i=a(e[n]))>=0)return i>0&&(t.lastNeed=i-2),i;if(--n<r||-2===i)return 0;if((i=a(e[n]))>=0)return i>0&&(2===i?i=0:t.lastNeed=i-3),i;return 0;}(this,t,e);if(!this.lastNeed)return t.toString("utf8",e);this.lastTotal=r;var n=t.length-(r-this.lastNeed);return t.copy(this.lastChar,0,n),t.toString("utf8",e,n);},o.prototype.fillLast=function(t){if(this.lastNeed<=t.length)return t.copy(this.lastChar,this.lastTotal-this.lastNeed,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal);t.copy(this.lastChar,this.lastTotal-this.lastNeed,0,t.length),this.lastNeed-=t.length;};},{515:515}],528:[function(t,e,r){(function(e,n){(function(){var i=t(489).nextTick,o=Function.prototype.apply,a=Array.prototype.slice,s={},f=0;function u(t,e){this._id=t,this._clearFn=e;}r.setTimeout=function(){return new u(o.call(setTimeout,window,arguments),clearTimeout);},r.setInterval=function(){return new u(o.call(setInterval,window,arguments),clearInterval);},r.clearTimeout=r.clearInterval=function(t){t.close();},u.prototype.unref=u.prototype.ref=function(){},u.prototype.close=function(){this._clearFn.call(window,this._id);},r.enroll=function(t,e){clearTimeout(t._idleTimeoutId),t._idleTimeout=e;},r.unenroll=function(t){clearTimeout(t._idleTimeoutId),t._idleTimeout=-1;},r._unrefActive=r.active=function(t){clearTimeout(t._idleTimeoutId);var e=t._idleTimeout;e>=0&&(t._idleTimeoutId=setTimeout(function(){t._onTimeout&&t._onTimeout();},e));},r.setImmediate="function"==typeof e?e:function(t){var e=f++,n=!(arguments.length<2)&&a.call(arguments,1);return s[e]=!0,i(function(){s[e]&&(n?t.apply(null,n):t.call(null),r.clearImmediate(e));}),e;},r.clearImmediate="function"==typeof n?n:function(t){delete s[t];};}).call(this);}).call(this,t(528).setImmediate,t(528).clearImmediate);},{489:489,528:528}],529:[function(t,e,r){(function(t){(function(){function r(e){try{if(!t.localStorage)return!1;}catch(t){return!1;}var r=t.localStorage[e];return null!=r&&"true"===String(r).toLowerCase();}e.exports=function(t,e){if(r("noDeprecation"))return t;var n=!1;return function(){if(!n){if(r("throwDeprecation"))throw new Error(e);r("traceDeprecation"),n=!0;}return t.apply(this,arguments);};};}).call(this);}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});},{}],530:[function(t,e,r){var n=arguments[3],i=arguments[4],o=arguments[5],a=JSON.stringify;e.exports=function(t,e){for(var r,s=Object.keys(o),f=0,u=s.length;f<u;f++){var c=s[f],h=o[c].exports;if(h===t||h&&h["default"]===t){r=c;break;}}if(!r){r=Math.floor(Math.pow(16,8)*Math.random()).toString(16);var d={};for(f=0,u=s.length;f<u;f++){d[c=s[f]]=c;}i[r]=["function(require,module,exports){"+t+"(self); }",d];}var l=Math.floor(Math.pow(16,8)*Math.random()).toString(16),p={};p[r]=r,i[l]=["function(require,module,exports){var f = require("+a(r)+");(f.default ? f.default : f)(self);}",p];var b={};!function t(e){for(var r in b[e]=!0,i[e][1]){var n=i[e][1][r];b[n]||t(n);}}(l);var v="("+n+")({"+Object.keys(b).map(function(t){return a(t)+":["+i[t][0]+","+a(i[t][1])+"]";}).join(",")+"},{},["+a(l)+"])",g=window.URL||window.webkitURL||window.mozURL||window.msURL,y=new Blob([v],{type:"text/javascript"});if(e&&e.bare)return y;var m=g.createObjectURL(y),w=new Worker(m);return w.objectURL=m,w;};},{}],531:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});r.ErrorTypes={NETWORK_ERROR:"networkError",MEDIA_ERROR:"mediaError",MUX_ERROR:"muxError",BUFFER_ERROR:"bufferError",OTHER_ERROR:"otherError"},r.ErrorDetails={FRAG_PARSING_ERROR:"fragParsingError",REMUX_ALLOC_ERROR:"remuxAllocError",BUFFER_ADD_CODEC_ERROR:"bufferAddCodecError",BUFFER_APPEND_ERROR:"bufferAppendError",BUFFER_APPENDING_ERROR:"bufferAppendingError",INTERNAL_EXCEPTION:"internalException"};},{}],532:[function(t,e,r){"use strict";e.exports={TRANSPORT_CONNECTED:"transportConnected",TRANSPORT_DISCONNECTED:"transportDisconnected",FRAG_LOADED:"fragLoaded",FRAG_PARSING_INIT_SEGMENT:"fragParsingInitSegment",FRAG_PARSING_DATA:"fragParsingData",INIT_PTS_FOUND:"initPtsFound",FRAG_PARSED:"fragParsed",TS_RESET:"tsReset",ERROR:"providerError"};},{}],533:[function(t,e,r){"use strict";e.exports=t(543)["default"];},{543:543}],534:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n);}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e;};}();var i=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function");}(this,t);}return n(t,null,[{key:"getSilentFrame",value:function value(t,e){switch(t){case"mp4a.40.2":if(1===e)return new Uint8Array([0,200,0,128,35,128]);if(2===e)return new Uint8Array([33,0,73,144,2,25,0,35,128]);if(3===e)return new Uint8Array([0,200,0,128,32,132,1,38,64,8,100,0,142]);if(4===e)return new Uint8Array([0,200,0,128,32,132,1,38,64,8,100,0,128,44,128,8,2,56]);if(5===e)return new Uint8Array([0,200,0,128,32,132,1,38,64,8,100,0,130,48,4,153,0,33,144,2,56]);if(6===e)return new Uint8Array([0,200,0,128,32,132,1,38,64,8,100,0,130,48,4,153,0,33,144,2,0,178,0,32,8,224]);break;default:if(1===e)return new Uint8Array([1,64,34,128,163,78,230,128,186,8,0,0,0,28,6,241,193,10,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,94]);if(2===e)return new Uint8Array([1,64,34,128,163,94,230,128,186,8,0,0,0,0,149,0,6,241,161,10,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,94]);if(3===e)return new Uint8Array([1,64,34,128,163,94,230,128,186,8,0,0,0,0,149,0,6,241,161,10,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,94]);}return null;}}]),t;}();r["default"]=i;},{}],535:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.AACParser=void 0;var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n);}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e;};}(),i=t(546);r.AACParser=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function");}(this,t);}return n(t,null,[{key:"parseAudioSpecificConfig",value:function value(e){var r=void 0,n=(r=e.byteLength?new i.BitArray(e):e).bitpos+8*(r.src.byteOffset+r.bytepos),o=r.readBits(5);this.codec="mp4a.40."+o;var a=r.readBits(4);15==a&&r.skipBits(24);var s=r.readBits(4);return{config:(0,i.bitSlice)(new Uint8Array(r.src.buffer),n,n+16),codec:"mp4a.40."+o,samplerate:t.SampleRates[a],channels:s};}},{key:"parseStreamMuxConfig",value:function value(e){var r=new i.BitArray(e);if(!r.readBits(1))return r.skipBits(14),t.parseAudioSpecificConfig(r);}},{key:"SampleRates",get:function get(){return[96e3,88200,64e3,48e3,44100,32e3,24e3,22050,16e3,12e3,11025,8e3,7350];}}]),t;}();},{546:546}],536:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n);}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e;};}(),i=h(t(547)),o=h(t(548)),a=h(t(541)),s=h(t(537)),f=t(535),u=t(549),c=h(t(532));function h(t){return t&&t.__esModule?t:{"default":t};}function d(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function");}var l=t(1),p=function(){function t(e,r){d(this,t),this.observer=e,this.remuxer=new a["default"](e,{}),this.audioConfig=t.defaultAACConfig(),this.sps=[],this.pps=[],this.lengthHeaderSize=4,this.hasAudio=!0,this.hasVideo=!0,this.videoTs=0,this.avBuffer=null,this.config=r,this.tracks={audio:{samples:[],container:"video/mp2t",dropped:0,sequenceNumber:0,id:0,inputTimeScale:1e3,len:0,type:"audio"},video:{samples:[],container:"video/mp2t",dropped:0,sequenceNumber:0,id:0,inputTimeScale:1e3,type:"video"},id3:{samples:[]},text:{samples:[]}};}return n(t,[{key:"setAvailableMedia",value:function value(t,e){u.logger.log("Set available media, audio "+t+" video "+e),this.hasAudio=t,this.hasVideo=e;}},{key:"onData",value:function value(t){null==this.avBuffer&&(this.avBuffer=new v({hasAudio:this.hasAudio,hasVideo:this.hasVideo,fragmentLengthMs:this.config.fragmentLengthMs,cutByIFrameOnly:this.config.cutByIFrameOnly}));for(var e=new i["default"](t);e.readableBytes()>0;){var r,n=e.readByte(),o=e.readInt(),a=e.readInt();9==n?(r=this.onVideo(e,a,o))&&this.avBuffer.pushVideo(r):8==n&&(r=this.onAudio(e,a,o))&&this.avBuffer.pushAudio(r),this.flush();}}},{key:"onVideo",value:function value(e,r,n){var i=e.readByte();switch(0==this.videoTs&&(this.videoTs=n),Math.abs(n-this.videoTs)>5e3?(u.logger.log("Video ts drop "+(n-this.videoTs)),this.avBuffer.flush(),this.remuxer.resetInitSegment(),this.videoTs=0,this.observer.trigger(c["default"].TS_RESET)):n<this.videoTs&&u.logger.warn("Non monotonic video ts "+this.videoTs+" -> "+n),this.videoTs=n,i){case 23:var a=e.readByte();if(0==a){e.skipBytes(3);e.readByte();var s=e.sliceAsUint8Array(e.readerIndex(),3);s[0],s[1],s[2];this.tracks.video.codec="avc1."+o["default"].hexDump(s).toUpperCase(),this.lengthHeaderSize=1+(3&e.readByte());for(var f=31&e.readByte(),h=[],d=0;d<f;d++){h.push(t.readNalFromAVCCFormat(e,2));}for(var l=31&e.readByte(),p=[],v=0;v<l;v++){p.push(t.readNalFromAVCCFormat(e,2));}this.onVideoConfig(h,p,n);}else if(1==a){e.skipBytes(3);var g=t.readNalus(e,this.lengthHeaderSize,r-5);if(g)return new b(g,!0,n,n);}else u.logger.warn("Unknown inner type "+a);break;case 39:e.skipBytes(4);var y=t.readNalus(e,this.lengthHeaderSize,r-5);if(y)return new b(y,!1,n,n);break;default:u.logger.warn("Unknown AVC type "+i);}}},{key:"onAudio",value:function value(t,e,r){if(0!=t.readByte())return{unit:t.sliceAsUint8Array(t.readerIndex(),e-1),pts:r,dts:r};for(var n=t.sliceAsUint8Array(t.readerIndex(),e-1),i=f.AACParser.parseAudioSpecificConfig(n),o=[],a=0;a<i.config.byteLength;a++){o[a]=i.config[a];}i.config=o,this.onAudioConfig(i);}},{key:"onAudioConfig",value:function value(t){this.audioConfig=t,this.tracks.audio.codec=t.codec,this.tracks.audio.channelCount=t.channels,this.tracks.audio.config=t.config,this.tracks.audio.channelCount=t.channels,this.tracks.audio.timescale=t.samplerate,this.tracks.audio.samplerate=t.samplerate,this.tracks.audio.isAAC=!0;}},{key:"onVideoConfig",value:function value(t,e,r){this.avBuffer.onVideoConfig({sps:t,pps:e},r);}},{key:"flush",value:function value(){for(var t=this.avBuffer.getFragments();t.length>0;){var e=t.shift();if(e.configChanged){var r=new s["default"](e.config.video.sps[0]).readSPS();this.tracks.video.width==r.width&&this.tracks.video.height==r.height||(u.logger.log("Video resolution changed "+this.tracks.video.width+"x"+this.tracks.video.height+" => "+r.width+"x"+r.height),this.remuxer.resetInitSegment());}if(e.audio.length>0){for(var n=this.tracks.audio,i=e.audio,o=this.audioConfig,a=0,f=0;f<i.length;f++){a+=i[f].unit.byteLength;}n.samples=i,n.duration=(i[i.length-1].pts-i[0].pts)/1e3,n.codec=o.codec,n.config=o.config,n.channelCount=o.channels,n.samplerate=o.samplerate,n.isAAC=!0,n.len=a,n.sequenceNumber++,u.logger.log("audio: duration "+this.tracks.audio.duration+", startPts "+this.tracks.audio.samples[0].pts+" endPts "+this.tracks.audio.samples[this.tracks.audio.samples.length-1].pts);}if(e.video.length>0){if(!e.config.video)continue;var c=this.tracks.video,h=e.video,d=new s["default"](e.config.video.sps[0]).readSPS();c.samples=h,c.duration=(h[h.length-1].pts-h[0].pts)/1e3,c.width=d.width,c.height=d.height,c.pixelRatio=d.pixelRatio,c.pps=e.config.video.pps,c.sps=e.config.video.sps,c.sequenceNumber++,u.logger.log("video: duration "+this.tracks.video.duration+", startPts "+this.tracks.video.samples[0].pts+" endPts "+this.tracks.video.samples[this.tracks.video.samples.length-1].pts+" samples "+h.length);}e.audio.length>0&&e.video.length>0?this.tracks.video.duration=this.tracks.audio.duration:e.video.length>0&&0==e.audio.length&&(this.tracks.audio.duration=this.tracks.video.duration),this.remuxer.remux(this.tracks.audio,this.tracks.video,this.tracks.id3,this.tracks.text,0);}}}],[{key:"buffered",value:function value(t){if(t.length>1){var e=t[0];return t[t.length-1].pts-e.pts;}return 0;}},{key:"readNalFromAVCCFormat",value:function value(t,e){if(t.readableBytes()>e){var r=0;switch(e){case 2:r=t.readShort();break;case 4:r=t.readInt();}return t.readableBytes()<r?void u.logger.error("Length bigger then buffer "+t.readableBytes()+" "+r):t.sliceAsUint8Array(t.readerIndex(),r);}}},{key:"readNalus",value:function value(e,r,n){for(var i=[],o=e.readableBytes()-n;e.readableBytes()>o;){var a=t.readNalFromAVCCFormat(e,r);if(void 0!==a)i.push({data:a,type:31&a[0]});else if(e.readableBytes()>o)return void u.logger.warn("Failed to read nal");}if(i.length>0)return i;}},{key:"defaultAACConfig",value:function value(){var t=new Uint8Array(new ArrayBuffer(4));t[0]=17,t[1]=144,t[2]=86,t[3]=229,t[4]=0;for(var e=f.AACParser.parseAudioSpecificConfig(t),r=[],n=0;n<e.config.byteLength;n++){r[n]=e.config[n];}return e.config=r,e;}}]),t;}();r["default"]=p;var b=function t(e,r,n,i){d(this,t),this.pts=n,this.dts=i,this.units=e,this.key=r,this.frame=!0,this.id=0,this.length=0;var o=!0,a=!1,s=void 0;try{for(var f,u=e[Symbol.iterator]();!(o=(f=u.next()).done);o=!0){var c=f.value;this.length+=c.data.length;}}catch(t){a=!0,s=t;}finally{try{!o&&u["return"]&&u["return"]();}finally{if(a)throw s;}}},v=function(){function t(e){d(this,t),this.hasAudio=e.hasAudio,this.hasVideo=e.hasVideo,this.fragmentLengthMs=e.fragmentLengthMs,this.mediaConfig={audio:null,video:null},this.video=[],this.audio=[],this.aligned=!1,this.cutByIFrameOnly=e.cutByIFrameOnly;}return n(t,[{key:"pushAudio",value:function value(t){this.audio.push(t);}},{key:"pushVideo",value:function value(t){if(this.video.length>0){var e=this.video[this.video.length-1];e.duration=t.pts-e.pts;}this.video.push(t);}},{key:"onAudioConfig",value:function value(t){this.mediaConfig.audio=t;}},{key:"onVideoConfig",value:function value(t,e){var r={key:"config",pts:e,config:t,duration:-1};this.pushVideo(r);}},{key:"flush",value:function value(){return this.aligned=!1,{audio:this.flushAudio(),video:this.flushVideo()};}},{key:"flushAudio",value:function value(){if(this.hasAudio)return this.cut(this.audio.length,-1);}},{key:"flushVideo",value:function value(){if(this.hasVideo)return this.cut(-1,this.video.length);}},{key:"getFragments",value:function value(){for(var t=[];this.bufferedEnough();){if(this.hasAudio&&!this.hasVideo)t.push(this.cut(this.audio.length,-1));else if(!this.hasAudio&&this.hasVideo){var e=void 0,r=this.fragmentByIFrame();if(void 0!==r)e=this.cut(-1,r.index-1);else{if(this.cutByIFrameOnly)break;e=this.cut(-1,this.video.length);}t.push(e);}else{if(!this.aligned){if(!this.isAlignable())return t;var n=this.alignBufferBeforeStartup();n&&t.push(n);break;}var i=this.fragmentByIFrame();if(void 0!==i){var o=i.index-1,a=(this.video[o].pts,this.findIndex(this.audio,i.pts-20,1/0));if(!((a>-1?this.audio[a].pts:-1)>-1)){u.logger.log("Failed to fragment at: v "+o+" a "+a);break;}t.push(this.cut(a,o)),u.logger.log("Fragment by iframe");}else{if(this.cutByIFrameOnly)break;var s=this.findSyncPoint(this.video.length);if(!s)break;t.push(s);}}}return t;}},{key:"isAlignable",value:function value(){var t=this.findIFrame(0);if(t<0)return!1;var e=this.video[t].pts,r=this.findIndex(this.audio,e,e+50);if(null==r){if(!(this.audio.length>0&&this.audio[this.audio.length-1].pts>e))return!1;r=0;}var n=this.audio[r].pts,i=e-n;if(i<-100){if(null==this.findIndex(this.video,n-20,n))return!1;}else if(i>100){if(null==this.findIndex(this.audio,e,e+50))return!1;}return!0;}},{key:"alignBufferBeforeStartup",value:function value(){if(!this.aligned){var t=this.findIFrame(0);if(t<0)return void u.logger.warn("IFrame missing on startup");var e=this.video[t].pts,r=this.findIndex(this.audio,e,e+50);if(null==r){if(!(this.audio.length>0&&this.audio[this.audio.length-1].pts>e))return void u.logger.log("not enough audio");r=0;}else u.logger.log("aindex "+r);var n=this.audio[r].pts,i=e-n;if(i<-100){u.logger.log("align buffer missing audio "+-i);var o=this.findIndex(this.video,n-20,n);return this.aligned=!0,this.cut(-1,o);}i>100?(u.logger.log("align buffer missing video "+i),this.cut(r,-1),u.logger.log("Buffer aligned, dropped a:"+r+" v:"+t+"apts "+this.audio[r].pts+" vpts "+e)):(u.logger.log("audio pts / video pts "+this.audio[r].pts+"/"+e),this.cut(r-1,t-1),u.logger.log("stream aligned")),this.aligned=!0;}}},{key:"findSyncPoint",value:function value(t){for(var e=this.findIndex(this.video,this.video[0].pts+this.fragmentLengthMs,1/0),r=1,n=void 0;e<t;e++){if(!(e<3)){for(var i=this.video[e].pts;r<this.audio.length;){if(!(this.audio[r].pts<i)){this.audio[r]-i>i-this.audio[r-1]&&r--;break;}r++;}if(!this.audio[r])break;var o=this.audio[r].pts;if(e>=this.video.length-2)r--;else if(!(this.video[e].duration>2*this.video[e-1].duration||this.video[e].duration>2*this.video[e+1].duration)){if(Math.abs(i-o)<100){n=this.cut(r,e);break;}r--;}}}return n;}},{key:"cut",value:function value(t,e){t>-1&&t++,e>-1&&e++;var r=this.audio.splice(0,t),n=this.video.splice(0,e),i=!1;if(n[0]&&"config"==n[0].key){var o=n.shift();if(this.mediaConfig.video){var a=this.mediaConfig.video.sps[0],s=o.config.sps[0];l(a.buffer,s.buffer)||(i=!0,this.mediaConfig.video=o.config);}else this.mediaConfig.video=o.config;}return this.cutByIFrameOnly&&r[0]&&n[0]&&(n[n.length-1].pts=r[r.length-1].pts),{audio:r,video:n,config:this.mediaConfig,configChanged:i};}},{key:"fragmentByIFrame",value:function value(){var t=this.findIFrame(1);if(t>0)return{index:t,pts:this.video[t].pts};}},{key:"findIFrame",value:function value(t){for(var e=t;e<this.video.length;e++){if("config"==this.video[e].key)return e;}return-1;}},{key:"findIndex",value:function value(t,e,r){for(var n=0;n<t.length;n++){var i=t[n].pts;if(i>=e&&i<=r)return n;if(i>r)break;}}},{key:"bufferedEnough",value:function value(){var t=!this.hasAudio||this.buffered(this.audio)>=this.fragmentLengthMs,e=!this.hasVideo||this.buffered(this.video)>=this.fragmentLengthMs&&this.video.length>2;return t&&e;}},{key:"buffered",value:function value(t){if(t.length>1){var e=t[0];return t[t.length-1].pts-e.pts;}return 0;}}]),t;}();},{1:1,532:532,535:535,537:537,541:541,547:547,548:548,549:549}],537:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n);}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e;};}(),i=t(549);var o=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function");}(this,t),this.data=e,this.bytesAvailable=e.byteLength,this.word=0,this.bitsAvailable=0;}return n(t,[{key:"loadWord",value:function value(){var t=this.data,e=this.bytesAvailable,r=t.byteLength-e,n=new Uint8Array(4),i=Math.min(4,e);if(0===i)throw new Error("no bytes available");n.set(t.subarray(r,r+i)),this.word=new DataView(n.buffer).getUint32(0),this.bitsAvailable=8*i,this.bytesAvailable-=i;}},{key:"skipBits",value:function value(t){var e;this.bitsAvailable>t?(this.word<<=t,this.bitsAvailable-=t):(t-=this.bitsAvailable,t-=(e=t>>3)>>3,this.bytesAvailable-=e,this.loadWord(),this.word<<=t,this.bitsAvailable-=t);}},{key:"readBits",value:function value(t){var e=Math.min(this.bitsAvailable,t),r=this.word>>>32-e;return t>32&&i.logger.error("Cannot read more than 32 bits at a time"),this.bitsAvailable-=e,this.bitsAvailable>0?this.word<<=e:this.bytesAvailable>0&&this.loadWord(),(e=t-e)>0&&this.bitsAvailable?r<<e|this.readBits(e):r;}},{key:"skipLZ",value:function value(){var t;for(t=0;t<this.bitsAvailable;++t){if(0!=(this.word&2147483648>>>t))return this.word<<=t,this.bitsAvailable-=t,t;}return this.loadWord(),t+this.skipLZ();}},{key:"skipUEG",value:function value(){this.skipBits(1+this.skipLZ());}},{key:"skipEG",value:function value(){this.skipBits(1+this.skipLZ());}},{key:"readUEG",value:function value(){var t=this.skipLZ();return this.readBits(t+1)-1;}},{key:"readEG",value:function value(){var t=this.readUEG();return 1&t?1+t>>>1:-1*(t>>>1);}},{key:"readBoolean",value:function value(){return 1===this.readBits(1);}},{key:"readUByte",value:function value(){return this.readBits(8);}},{key:"readUShort",value:function value(){return this.readBits(16);}},{key:"readUInt",value:function value(){return this.readBits(32);}},{key:"skipScalingList",value:function value(t){var e,r=8,n=8;for(e=0;e<t;e++){0!==n&&(n=(r+this.readEG()+256)%256),r=0===n?r:n;}}},{key:"readSPS",value:function value(){var t,e,r,n,i,o,a,s=0,f=0,u=0,c=0,h=this.readUByte.bind(this),d=this.readBits.bind(this),l=this.readUEG.bind(this),p=this.readBoolean.bind(this),b=this.skipBits.bind(this),v=this.skipEG.bind(this),g=this.skipUEG.bind(this),y=this.skipScalingList.bind(this);if(h(),t=h(),d(5),b(3),h(),g(),100===t||110===t||122===t||244===t||44===t||83===t||86===t||118===t||128===t){var m=l();if(3===m&&b(1),g(),g(),b(1),p())for(o=3!==m?8:12,a=0;a<o;a++){p()&&y(a<6?16:64);}}g();var w=l();if(0===w)l();else if(1===w)for(b(1),v(),v(),e=l(),a=0;a<e;a++){v();}g(),b(1),r=l(),n=l(),0===(i=d(1))&&b(1),b(1),p()&&(s=l(),f=l(),u=l(),c=l());var _=[1,1];if(p()&&p())switch(h()){case 1:_=[1,1];break;case 2:_=[12,11];break;case 3:_=[10,11];break;case 4:_=[16,11];break;case 5:_=[40,33];break;case 6:_=[24,11];break;case 7:_=[20,11];break;case 8:_=[32,11];break;case 9:_=[80,33];break;case 10:_=[18,11];break;case 11:_=[15,11];break;case 12:_=[64,33];break;case 13:_=[160,99];break;case 14:_=[4,3];break;case 15:_=[3,2];break;case 16:_=[2,1];break;case 255:_=[h()<<8|h(),h()<<8|h()];}return{width:Math.ceil(16*(r+1)-2*s-2*f),height:(2-i)*(n+1)*16-(i?2:4)*(u+c),pixelRatio:_};}},{key:"readSliceType",value:function value(){return this.readUByte(),this.readUEG(),this.readUEG();}}]),t;}();r["default"]=o;},{549:549}],538:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n);}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e;};}(),i=l(t(539)),o=l(t(536)),a=l(t(542)),s=l(t(545)),f=t(544),u=l(t(532)),c=l(t(435)),h=t(549),d=l(t(543));function l(t){return t&&t.__esModule?t:{"default":t};}var p=t(490),b=t(476),v="-LOCAL_CACHED_VIDEO",g="-REMOTE_CACHED_VIDEO",y=function(){function e(r){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function");}(this,e);var n=this.observer=new c["default"]();n.trigger=function(t){for(var e=arguments.length,r=Array(e>1?e-1:0),i=1;i<e;i++){r[i-1]=arguments[i];}n.emit.apply(n,[t].concat(r));},n.off=function(t){for(var e=arguments.length,r=Array(e>1?e-1:0),i=1;i<e;i++){r[i-1]=arguments[i];}n.removeListener.apply(n,[t].concat(r));},this.on=n.on.bind(n),this.off=n.off.bind(n),this.trigger=n.trigger.bind(n);try{(0,h.enableLogs)(!0===r.debug);}catch(t){}if(r.enableWorker&&"undefined"!=typeof Worker){h.logger.log("using webworker");var d=void 0;try{var l=t(530);d=this.w=l(i["default"]),this.onwmsg=this.onWorkerMessage.bind(this),d.addEventListener("message",this.onwmsg),d.onerror=function(t){this.trigger(u["default"].ERROR,{type:"worker",info:t.message+" ("+t.filename+":"+t.lineno+")"});},d.postMessage({cmd:"init",config:JSON.stringify(r)});}catch(t){h.logger.error("error while initializing DemuxerWorker, fallback on DemuxerInline"),d&&URL.revokeObjectURL(d.objectURL);}}else this.demuxer=new o["default"](this,r.connectionConstraints),r.useFileLoader?this.transport=new f.MediaFileReader(this,r,this.demuxer):this.transport=new s["default"](this,r,this.demuxer);this.id=r.id,this.display=r.display,this.video=e.getCacheInstance(this.display),this.video||(this.video=document.createElement("video"),this.display.appendChild(this.video)),this.video.id=this.id,this.mse=new a["default"](this,this.video),this.on(u["default"].TS_RESET,function(t){h.logger.warn("TS_RESET"),this.mse.release(),this.mse=new a["default"](this,this.video);}.bind(this)),this.on(u["default"].ERROR,function(t){h.logger.error("Error "+t.type+" info "+t.info),this.close();}.bind(this));}return n(e,[{key:"createOffer",value:function value(t){return p.resolve({sdp:"v=0\r\no=- 1988962254 1988962254 IN IP4 0.0.0.0\r\nc=IN IP4 0.0.0.0\r\nt=0 0\r\na=sdplang:en\r\nm=video 0 RTP/AVP 112\r\na=rtpmap:112 H264/90000\r\na=fmtp:112 packetization-mode=1; profile-level-id=420020\r\na=recvonly\r\nm=audio 0 RTP/AVP 108 96 97 98 99 100 102 103 104\r\na=rtpmap:108 mpeg4-generic/48000/1\r\na=rtpmap:96 mpeg4-generic/8000/1\r\na=rtpmap:97 mpeg4-generic/11025/1\r\na=rtpmap:98 mpeg4-generic/12000/1\r\na=rtpmap:99 mpeg4-generic/16000/1\r\na=rtpmap:100 mpeg4-generic/22050/1\r\na=rtpmap:104 mpeg4-generic/24000/1\r\na=rtpmap:102 mpeg4-generic/32000/1\r\na=rtpmap:103 mpeg4-generic/44100/1\r\na=recvonly\r\n"});}},{key:"setRemoteSdp",value:function value(e){for(var r=t(517),n=!0,i=!0,o=r.splitSections(e),a=0;a<o.length;a++){if(r.isRejected(o[a]))switch(r.getKind(o[a])){case"audio":n=!1;break;case"video":i=!1;}}return this.w?this.w.postMessage({cmd:"connect",config:JSON.stringify({audio:n,video:i})}):(this.demuxer.setAvailableMedia(n,i),this.transport.connect()),p.resolve();}},{key:"close",value:function value(){this.w&&(this.w.postMessage({cmd:"close"}),this.w.removeEventListener("message",this.onwmsg),this.w.terminate(),this.w=null),this.transport&&this.transport.disconnect(),this.mse.release(),this.video.id=this.video.id+g;}},{key:"setVolume",value:function value(t){this.video&&(this.video.volume=t/100);}},{key:"unmuteRemoteAudio",value:function value(){this.video&&(this.video.muted=!1);}},{key:"muteRemoteAudio",value:function value(){this.video&&(this.video.muted=!0);}},{key:"isRemoteAudioMuted",value:function value(){return!this.video||this.video.muted;}},{key:"getVolume",value:function value(){return this.video?100*this.video.volume:-1;}},{key:"fullScreen",value:function value(){var t=this.video;t&&(document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement||document.msFullscreenElement?document.exitFullscreen?document.exitFullscreen():document.msExitFullscreen?document.msExitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitExitFullscreen&&document.webkitExitFullscreen():t.requestFullscreen?t.requestFullscreen():t.msRequestFullscreen?t.msRequestFullscreen():t.mozRequestFullScreen?t.mozRequestFullScreen():t.webkitRequestFullscreen&&t.webkitRequestFullscreen());}},{key:"onWorkerMessage",value:function value(t){var e=t.data;switch(e.event){case"init":URL.revokeObjectURL(this.w.objectURL);break;case u["default"].FRAG_PARSING_DATA:e.data.data1=new Uint8Array(e.data1),e.data2&&(e.data.data2=new Uint8Array(e.data2));default:e.data=e.data||{},e.data.frag=this.frag,e.data.id=this.id,this.trigger(e.event,e.data);}}}],[{key:"getCacheInstance",value:function value(t){var e=void 0;for(e=0;e<t.children.length;e++){if(t.children[e]&&(-1!=t.children[e].id.indexOf(v)||-1!=t.children[e].id.indexOf(g)))return t.children[e];}}},{key:"playFirstVideo",value:function value(t,e,r){var n=this;return new p(function(i,o){if(!n.getCacheInstance(t)){var a=document.createElement("video");if(a.setAttribute("playsinline",""),a.setAttribute("webkit-playsinline",""),t.appendChild(a),a.id=b.v1()+(e?v:g),r)return a.src=r,void a.play().then(function(){i();})["catch"](function(t){"chrome"!=d["default"].getConfig().browserDetails&&h.logger.error(t),o();});}i();});}}]),e;}();r["default"]=y;},{435:435,476:476,490:490,517:517,530:530,532:532,536:536,539:539,542:542,543:543,544:544,545:545,549:549}],539:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),t(17);var n=f(t(536)),i=f(t(545)),o=f(t(532)),a=f(t(435)),s=t(549);function f(t){return t&&t.__esModule?t:{"default":t};}r["default"]=function(t){var e=new a["default"]();e.trigger=function(t){for(var r=arguments.length,n=Array(r>1?r-1:0),i=1;i<r;i++){n[i-1]=arguments[i];}e.emit.apply(e,[t,t].concat(n));},e.off=function(t){for(var r=arguments.length,n=Array(r>1?r-1:0),i=1;i<r;i++){n[i-1]=arguments[i];}e.removeListener.apply(e,[t].concat(n));};var r=function r(e,_r10){t.postMessage({event:e,data:_r10});};t.addEventListener("message",function(o){var a=o.data;switch(a.cmd){case"init":var f=JSON.parse(a.config);t.demuxer=new n["default"](e,f.connectionConstraints),t.transport=new i["default"](e,f,t.demuxer);try{(0,s.enableLogs)(!0===f.debug);}catch(t){}r("init",null);break;case"connect":var u=JSON.parse(a.config);t.demuxer.setAvailableMedia(u.audio,u.video),t.transport.connect();break;case"close":t.transport.disconnect();}}),e.on(o["default"].FRAG_PARSING_INIT_SEGMENT,r),e.on(o["default"].FRAG_PARSED,r),e.on(o["default"].ERROR,r),e.on(o["default"].INIT_PTS_FOUND,r),e.on(o["default"].TS_RESET,r),e.on(o["default"].FRAG_PARSING_DATA,function(e,r){var n=[],i={event:e,data:r};r.data1&&(i.data1=r.data1.buffer,n.push(r.data1.buffer),delete r.data1),r.data2&&(i.data2=r.data2.buffer,n.push(r.data2.buffer),delete r.data2),t.postMessage(i,n);});};},{17:17,435:435,532:532,536:536,545:545,549:549}],540:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n);}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e;};}();var i=Math.pow(2,32)-1,o=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function");}(this,t);}return n(t,null,[{key:"init",value:function value(){var e;for(e in t.types={avc1:[],avcC:[],btrt:[],dinf:[],dref:[],esds:[],ftyp:[],hdlr:[],mdat:[],mdhd:[],mdia:[],mfhd:[],minf:[],moof:[],moov:[],mp4a:[],".mp3":[],mvex:[],mvhd:[],pasp:[],sdtp:[],stbl:[],stco:[],stsc:[],stsd:[],stsz:[],stts:[],tfdt:[],tfhd:[],traf:[],trak:[],trun:[],trex:[],tkhd:[],vmhd:[],smhd:[]},t.types){t.types.hasOwnProperty(e)&&(t.types[e]=[e.charCodeAt(0),e.charCodeAt(1),e.charCodeAt(2),e.charCodeAt(3)]);}var r=new Uint8Array([0,0,0,0,0,0,0,0,118,105,100,101,0,0,0,0,0,0,0,0,0,0,0,0,86,105,100,101,111,72,97,110,100,108,101,114,0]),n=new Uint8Array([0,0,0,0,0,0,0,0,115,111,117,110,0,0,0,0,0,0,0,0,0,0,0,0,83,111,117,110,100,72,97,110,100,108,101,114,0]);t.HDLR_TYPES={video:r,audio:n};var i=new Uint8Array([0,0,0,0,0,0,0,1,0,0,0,12,117,114,108,32,0,0,0,1]),o=new Uint8Array([0,0,0,0,0,0,0,0]);t.STTS=t.STSC=t.STCO=o,t.STSZ=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0]),t.VMHD=new Uint8Array([0,0,0,1,0,0,0,0,0,0,0,0]),t.SMHD=new Uint8Array([0,0,0,0,0,0,0,0]),t.STSD=new Uint8Array([0,0,0,0,0,0,0,1]);var a=new Uint8Array([105,115,111,109]),s=new Uint8Array([97,118,99,49]),f=new Uint8Array([0,0,0,1]);t.FTYP=t.box(t.types.ftyp,a,f,a,s),t.DINF=t.box(t.types.dinf,t.box(t.types.dref,i));}},{key:"box",value:function value(t){for(var e,r=Array.prototype.slice.call(arguments,1),n=8,i=r.length,o=i;i--;){n+=r[i].byteLength;}for((e=new Uint8Array(n))[0]=n>>24&255,e[1]=n>>16&255,e[2]=n>>8&255,e[3]=255&n,e.set(t,4),i=0,n=8;i<o;i++){e.set(r[i],n),n+=r[i].byteLength;}return e;}},{key:"hdlr",value:function value(e){return t.box(t.types.hdlr,t.HDLR_TYPES[e]);}},{key:"mdat",value:function value(e){return t.box(t.types.mdat,e);}},{key:"mdhd",value:function value(e,r){r*=e;var n=Math.floor(r/(i+1)),o=Math.floor(r%(i+1));return t.box(t.types.mdhd,new Uint8Array([1,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,3,e>>24&255,e>>16&255,e>>8&255,255&e,n>>24,n>>16&255,n>>8&255,255&n,o>>24,o>>16&255,o>>8&255,255&o,85,196,0,0]));}},{key:"mdia",value:function value(e){return t.box(t.types.mdia,t.mdhd(e.timescale,e.duration),t.hdlr(e.type),t.minf(e));}},{key:"mfhd",value:function value(e){return t.box(t.types.mfhd,new Uint8Array([0,0,0,0,e>>24,e>>16&255,e>>8&255,255&e]));}},{key:"minf",value:function value(e){return"audio"===e.type?t.box(t.types.minf,t.box(t.types.smhd,t.SMHD),t.DINF,t.stbl(e)):t.box(t.types.minf,t.box(t.types.vmhd,t.VMHD),t.DINF,t.stbl(e));}},{key:"moof",value:function value(e,r,n){return t.box(t.types.moof,t.mfhd(e),t.traf(n,r));}},{key:"moov",value:function value(e){for(var r=e.length,n=[];r--;){n[r]=t.trak(e[r]);}return t.box.apply(null,[t.types.moov,t.mvhd(e[0].timescale,e[0].duration)].concat(n).concat(t.mvex(e)));}},{key:"mvex",value:function value(e){for(var r=e.length,n=[];r--;){n[r]=t.trex(e[r]);}return t.box.apply(null,[t.types.mvex].concat(n));}},{key:"mvhd",value:function value(e,r){r*=e;var n=Math.floor(r/(i+1)),o=Math.floor(r%(i+1)),a=new Uint8Array([1,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,3,e>>24&255,e>>16&255,e>>8&255,255&e,n>>24,n>>16&255,n>>8&255,255&n,o>>24,o>>16&255,o>>8&255,255&o,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,255,255,255]);return t.box(t.types.mvhd,a);}},{key:"sdtp",value:function value(e){var r,n,i=e.samples||[],o=new Uint8Array(4+i.length);for(n=0;n<i.length;n++){r=i[n].flags,o[n+4]=r.dependsOn<<4|r.isDependedOn<<2|r.hasRedundancy;}return t.box(t.types.sdtp,o);}},{key:"stbl",value:function value(e){return t.box(t.types.stbl,t.stsd(e),t.box(t.types.stts,t.STTS),t.box(t.types.stsc,t.STSC),t.box(t.types.stsz,t.STSZ),t.box(t.types.stco,t.STCO));}},{key:"avc1",value:function value(e){var r,n,i,o=[],a=[];for(r=0;r<e.sps.length;r++){i=(n=e.sps[r]).byteLength,o.push(i>>>8&255),o.push(255&i),o=o.concat(Array.prototype.slice.call(n));}for(r=0;r<e.pps.length;r++){i=(n=e.pps[r]).byteLength,a.push(i>>>8&255),a.push(255&i),a=a.concat(Array.prototype.slice.call(n));}var s=t.box(t.types.avcC,new Uint8Array([1,o[3],o[4],o[5],255,224|e.sps.length].concat(o).concat([e.pps.length]).concat(a))),f=e.width,u=e.height,c=e.pixelRatio[0],h=e.pixelRatio[1];return t.box(t.types.avc1,new Uint8Array([0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,f>>8&255,255&f,u>>8&255,255&u,0,72,0,0,0,72,0,0,0,0,0,0,0,1,18,100,97,105,108,121,109,111,116,105,111,110,47,104,108,115,46,106,115,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24,17,17]),s,t.box(t.types.btrt,new Uint8Array([0,28,156,128,0,45,198,192,0,45,198,192])),t.box(t.types.pasp,new Uint8Array([c>>24,c>>16&255,c>>8&255,255&c,h>>24,h>>16&255,h>>8&255,255&h])));}},{key:"esds",value:function value(t){var e=t.config.length;return new Uint8Array([0,0,0,0,3,23+e,0,1,0,4,15+e,64,21,0,0,0,0,0,0,0,0,0,0,0,5].concat([e]).concat(t.config).concat([6,1,2]));}},{key:"mp4a",value:function value(e){var r=e.samplerate;return t.box(t.types.mp4a,new Uint8Array([0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,e.channelCount,0,16,0,0,0,0,r>>8&255,255&r,0,0]),t.box(t.types.esds,t.esds(e)));}},{key:"mp3",value:function value(e){var r=e.samplerate;return t.box(t.types[".mp3"],new Uint8Array([0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,e.channelCount,0,16,0,0,0,0,r>>8&255,255&r,0,0]));}},{key:"stsd",value:function value(e){return"audio"===e.type?e.isAAC||"mp3"!==e.codec?t.box(t.types.stsd,t.STSD,t.mp4a(e)):t.box(t.types.stsd,t.STSD,t.mp3(e)):t.box(t.types.stsd,t.STSD,t.avc1(e));}},{key:"tkhd",value:function value(e){var r=e.id,n=e.duration*e.timescale,o=e.width,a=e.height,s=Math.floor(n/(i+1)),f=Math.floor(n%(i+1));return t.box(t.types.tkhd,new Uint8Array([1,0,0,7,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,3,r>>24&255,r>>16&255,r>>8&255,255&r,0,0,0,0,s>>24,s>>16&255,s>>8&255,255&s,f>>24,f>>16&255,f>>8&255,255&f,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,0,0,0,o>>8&255,255&o,0,0,a>>8&255,255&a,0,0]));}},{key:"traf",value:function value(e,r){var n=t.sdtp(e),o=e.id,a=Math.floor(r/(i+1)),s=Math.floor(r%(i+1));return t.box(t.types.traf,t.box(t.types.tfhd,new Uint8Array([0,0,0,0,o>>24,o>>16&255,o>>8&255,255&o])),t.box(t.types.tfdt,new Uint8Array([1,0,0,0,a>>24,a>>16&255,a>>8&255,255&a,s>>24,s>>16&255,s>>8&255,255&s])),t.trun(e,n.length+16+20+8+16+8+8),n);}},{key:"trak",value:function value(e){return e.duration=e.duration||4294967295,t.box(t.types.trak,t.tkhd(e),t.mdia(e));}},{key:"trex",value:function value(e){var r=e.id;return t.box(t.types.trex,new Uint8Array([0,0,0,0,r>>24,r>>16&255,r>>8&255,255&r,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1]));}},{key:"trun",value:function value(e,r){var n,i,o,a,s,f,u=e.samples||[],c=u.length,h=12+16*c,d=new Uint8Array(h);for(r+=8+h,d.set([0,0,15,1,c>>>24&255,c>>>16&255,c>>>8&255,255&c,r>>>24&255,r>>>16&255,r>>>8&255,255&r],0),n=0;n<c;n++){o=(i=u[n]).duration,a=i.size,s=i.flags,f=i.cts,d.set([o>>>24&255,o>>>16&255,o>>>8&255,255&o,a>>>24&255,a>>>16&255,a>>>8&255,255&a,s.isLeading<<2|s.dependsOn,s.isDependedOn<<6|s.hasRedundancy<<4|s.paddingValue<<1|s.isNonSync,61440&s.degradPrio,15&s.degradPrio,f>>>24&255,f>>>16&255,f>>>8&255,255&f],12+16*n);}return t.box(t.types.trun,d);}},{key:"initSegment",value:function value(e){t.types||t.init();var r,n=t.moov(e);return(r=new Uint8Array(t.FTYP.byteLength+n.byteLength)).set(t.FTYP),r.set(n,t.FTYP.byteLength),r;}}]),t;}();r["default"]=o;},{}],541:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n);}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e;};}(),i=u(t(534)),o=t(549),a=u(t(540)),s=t(531),f=u(t(532));function u(t){return t&&t.__esModule?t:{"default":t};}var c=function(){function t(e,r,n,i){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function");}(this,t),this.observer=e,this.config=r,this.typeSupported=n;var o=navigator.userAgent;this.isSafari=i&&i.indexOf("Apple")>-1&&o&&!o.match("CriOS"),this.ISGenerated=!1;}return n(t,[{key:"destroy",value:function value(){}},{key:"resetTimeStamp",value:function value(t){this._initPTS=this._initDTS=t;}},{key:"resetInitSegment",value:function value(){this.ISGenerated=!1;}},{key:"remux",value:function value(t,e,r,n,i,a,s){if(this.ISGenerated||this.generateIS(t,e,i),this.ISGenerated)if(t.samples.length){t.timescale||(o.logger.warn("regenerate InitSegment as audio detected"),this.generateIS(t,e,i));var u=this.remuxAudio(t,i,a,s);if(e.samples.length){var c=void 0;u&&(c=u.endPTS-u.startPTS),e.timescale||(o.logger.warn("regenerate InitSegment as video detected"),this.generateIS(t,e,i)),this.remuxVideo(e,i,a,c);}}else{var h=void 0;e.samples.length&&(h=this.remuxVideo(e,i,a)),h&&t.codec&&(o.logger.log("Remux empty audio"),this.remuxEmptyAudio(t,i,a,h));}r.samples.length&&this.remuxID3(r,i),n.samples.length&&this.remuxText(n,i),this.observer.trigger(f["default"].FRAG_PARSED);}},{key:"generateIS",value:function value(t,e,r){var n,i,u=this.observer,c=t.samples,h=e.samples,d=this.typeSupported,l="audio/mp4",p={},b={tracks:p},v=void 0===this._initPTS;if(v&&(n=i=1/0),t.config&&(t.timescale=t.samplerate,o.logger.log("audio sampling rate : "+t.samplerate),t.isAAC||(d.mpeg?(l="audio/mpeg",t.codec=""):d.mp3&&(t.codec="mp3")),p.audio={container:l,codec:t.codec,initSegment:!t.isAAC&&d.mpeg?new Uint8Array():a["default"].initSegment([t]),metadata:{channelCount:t.channelCount}},v&&c[0]&&(n=i=c[0].pts-t.inputTimeScale*r)),e.sps&&e.pps&&h.length){var g=e.inputTimeScale;e.timescale=g,p.video={container:"video/mp4",codec:e.codec,initSegment:a["default"].initSegment([e]),metadata:{width:e.width,height:e.height}},v&&(n=Math.min(n,h[0].pts-g*r),i=Math.min(i,h[0].dts-g*r),this.observer.trigger(f["default"].INIT_PTS_FOUND,{initPTS:n}));}Object.keys(p).length?(u.trigger(f["default"].FRAG_PARSING_INIT_SEGMENT,b),this.ISGenerated=!0,v&&(this._initPTS=n,this._initDTS=i)):u.trigger(f["default"].ERROR,{type:s.ErrorTypes.MEDIA_ERROR,details:s.ErrorDetails.FRAG_PARSING_ERROR,fatal:!1,reason:"no audio/video samples found"});}},{key:"remuxVideo",value:function value(t,e,r,n){var i,u,c,h,d,l,p,b=8,v=t.timescale,g=t.samples,y=[],m=g.length,w=this._PTSNormalize,_=this._initDTS;g.sort(function(t,e){var r=t.dts-e.dts,n=t.pts-e.pts;return r||n||t.id-e.id;});var S=g.reduce(function(t,e){return Math.max(Math.min(t,e.pts-e.dts),-18e3);},0);if(S<0){o.logger.warn("PTS < DTS detected in video samples, shifting DTS by "+Math.round(S/90)+" ms to overcome this issue");for(var M=0;M<g.length;M++){g[M].dts+=S;}}var E=void 0;E=r?this.nextAvcDts:e*v;var k=g[0];d=Math.max(w(k.dts-_,E),0),h=Math.max(w(k.pts-_,E),0);var x=Math.round((d-E)/90);r&&x&&(x>1?o.logger.log("AVC:"+x+" ms hole between fragments detected,filling it"):x<-1&&o.logger.log("AVC:"+-x+" ms overlapping between fragments detected"),d=E,g[0].dts=d+_,h=Math.max(h-x,E),g[0].pts=h+_,o.logger.log("Video/PTS/DTS adjusted: "+Math.round(h/90)+"/"+Math.round(d/90)+",delta:"+x+" ms")),k=g[g.length-1],p=Math.max(w(k.dts-_,E),0),l=Math.max(w(k.pts-_,E),0),l=Math.max(l,p);var A=this.isSafari;A&&(i=Math.round((p-d)/(g.length-1)));for(var R=0,T=0,I=0;I<m;I++){for(var B=g[I],P=B.units,O=P.length,C=0,L=0;L<O;L++){C+=P[L].data.length;}T+=C,R+=O,B.length=C,B.dts=A?d+I*i:Math.max(w(B.dts-_,E),d),B.pts=Math.max(w(B.pts-_,E),B.dts);}var j=T+4*R+8;try{u=new Uint8Array(j);}catch(t){return void this.observer.trigger(f["default"].ERROR,{type:s.ErrorTypes.MUX_ERROR,details:s.ErrorDetails.REMUX_ALLOC_ERROR,fatal:!1,bytes:j,reason:"fail allocating video mdat "+j});}var N=new DataView(u.buffer);N.setUint32(0,j),u.set(a["default"].types.mdat,4);for(var D=0;D<m;D++){for(var U=g[D],F=U.units,q=0,z=void 0,W=0,V=F.length;W<V;W++){var H=F[W],G=H.data,K=H.data.byteLength;N.setUint32(b,K),b+=4,u.set(G,b),b+=K,q+=4+K;}if(A)z=Math.max(0,i*Math.round((U.pts-U.dts)/i));else{if(D<m-1)i=g[D+1].dts-U.dts;else{var X=this.config,Z=U.dts-g[D>0?D-1:D].dts;if(X.stretchShortVideoTrack){var Y=X.maxBufferHole,J=X.maxSeekHole,$=Math.floor(Math.min(Y,J)*v),Q=(n?h+n*v:this.nextAudioPts)-U.pts;Q>$?((i=Q-Z)<0&&(i=Z),o.logger.log("It is approximately "+Q/90+" ms to the next segment; using duration "+i/90+" ms for the last video frame.")):i=Z;}else i=Z;}z=Math.round(U.pts-U.dts);}y.push({size:q,duration:i,cts:z,flags:{isLeading:0,isDependedOn:0,hasRedundancy:0,degradPrio:0,dependsOn:U.key?2:1,isNonSync:U.key?0:1}});}this.nextAvcDts=p+i;var tt=t.dropped;if(t.len=0,t.nbNalu=0,t.dropped=0,y.length&&navigator.userAgent.toLowerCase().indexOf("chrome")>-1){var et=y[0].flags;et.dependsOn=2,et.isNonSync=0;}t.samples=y,c=a["default"].moof(t.sequenceNumber++,d,t),t.samples=[];var rt={data1:c,data2:u,startPTS:h/v,endPTS:(l+i)/v,startDTS:d/v,endDTS:this.nextAvcDts/v,type:"video",nb:y.length,dropped:tt};return this.observer.trigger(f["default"].FRAG_PARSING_DATA,rt),rt;}},{key:"remuxAudio",value:function value(t,e,r,n){var u,c,h,d,l,p,b,v,g,y,m,w,_,S,M,E=t.inputTimeScale,k=E/t.timescale,x=(t.isAAC?1024:1152)*k,A=this._PTSNormalize,R=this._initDTS,T=!t.isAAC&&this.typeSupported.mpeg,I=T?0:8,B=[],P=[];if(t.samples.sort(function(t,e){return t.pts-e.pts;}),P=t.samples,M=this.nextAudioPts,(r|=P.length&&M&&(n&&Math.abs(e-M/E)<.1||Math.abs(P[0].pts-M-R)<20*x))||(M=e*E),n&&t.isAAC)for(var O=0,C=M;O<P.length;){var L=P[O],j=A(L.pts-R,M)-C,N=Math.abs(1e3*j/E);if(j<=-x)o.logger.warn("Dropping 1 audio frame @ "+(C/E).toFixed(3)+"s due to "+N+" ms overlap."),P.splice(O,1),t.len-=L.unit.length;else if(j>=x&&N<1e4&&C){var D=Math.round(j/x);o.logger.warn("Injecting "+D+" audio frame @ "+(C/E).toFixed(3)+"s due to "+Math.round(1e3*j/E)+" ms gap.");for(var U=0;U<D;U++){S=C+R,S=Math.max(S,R),(_=i["default"].getSilentFrame(t.manifestCodec||t.codec,t.channelCount))||(o.logger.log("Unable to get silent frame for given audio codec; duplicating last frame instead."),_=L.unit.subarray()),P.splice(O,0,{unit:_,pts:S,dts:S}),t.len+=_.length,C+=x,O+=1;}L.pts=L.dts=C+R,C+=x,O+=1;}else Math.abs(j),C+=x,L.pts=L.dts=0===O?R+M:P[O-1].pts+x,O+=1;}for(var F=0,q=P.length;F<q;F++){if(h=(u=P[F]).unit,g=u.pts-R,y=u.dts-R,void 0!==v)m=A(g,v),w=A(y,v),c.duration=Math.round((w-v)/k);else{m=A(g,M),w=A(y,M);var z=Math.round(1e3*(m-M)/E),W=0;if(r&&t.isAAC&&z){if(z>0&&z<1e4)W=Math.round((m-M)/x),o.logger.log(z+" ms hole between AAC samples detected,filling it"),W>0&&((_=i["default"].getSilentFrame(t.manifestCodec||t.codec,t.channelCount))||(_=h.subarray()),t.len+=W*_.length);else if(z<-12){o.logger.log("drop overlapping AAC sample, expected/parsed/delta:"+(M/E).toFixed(3)+"s/"+(m/E).toFixed(3)+"s/"+-z+"ms"),t.len-=h.byteLength;continue;}m=w=M;}if(p=Math.max(0,m),b=Math.max(0,w),!(t.len>0))return void o.logger.log("no audio samples");var V=T?t.len:t.len+8;try{d=new Uint8Array(V);}catch(t){return o.logger.error("got error "+t),void this.observer.trigger(f["default"].ERROR,{type:s.ErrorTypes.MUX_ERROR,details:s.ErrorDetails.REMUX_ALLOC_ERROR,fatal:!1,bytes:V,reason:"fail allocating audio mdat "+V});}T||(new DataView(d.buffer).setUint32(0,V),d.set(a["default"].types.mdat,4));for(var H=0;H<W;H++){S=m-(W-H)*x,(_=i["default"].getSilentFrame(t.manifestCodec||t.codec,t.channelCount))||(o.logger.log("Unable to get silent frame for given audio codec; duplicating this frame instead."),_=h.subarray()),d.set(_,I),I+=_.byteLength,c={size:_.byteLength,cts:0,duration:1024,flags:{isLeading:0,isDependedOn:0,hasRedundancy:0,degradPrio:0,dependsOn:1}},B.push(c);}}d.set(h,I);var G=h.byteLength;I+=G,c={size:G,cts:0,duration:0,flags:{isLeading:0,isDependedOn:0,hasRedundancy:0,degradPrio:0,dependsOn:1}},B.push(c),v=w;}var K=0,X=B.length;if(X>=2&&(K=B[X-2].duration,c.duration=K),X){this.nextAudioPts=m+k*K,t.len=0,t.samples=B,l=T?new Uint8Array():a["default"].moof(t.sequenceNumber++,b/k,t),t.samples=[];var Z={data1:l,data2:d,startPTS:p/E,endPTS:this.nextAudioPts/E,startDTS:b/E,endDTS:(w+k*K)/E,type:"audio",nb:X};return this.observer.trigger(f["default"].FRAG_PARSING_DATA,Z),Z;}return null;}},{key:"remuxEmptyAudio",value:function value(t,e,r,n){var a=t.inputTimeScale,s=a/(t.samplerate?t.samplerate:a),f=this.nextAudioPts,u=(void 0!==f?f:n.startDTS*a)+this._initDTS,c=n.endDTS*a+this._initDTS,h=1024*s,d=Math.ceil((c-u)/h),l=i["default"].getSilentFrame(t.manifestCodec||t.codec,t.channelCount);if(o.logger.warn("remux empty Audio"),l){for(var p=[],b=0;b<d;b++){var v=u+b*h;p.push({unit:l,pts:v,dts:v}),t.len+=l.length;}t.samples=p,this.remuxAudio(t,e,r);}else o.logger.warn("Unable to remuxEmptyAudio since we were unable to get a silent frame for given audio codec!");}},{key:"remuxID3",value:function value(t,e){var r,n=t.samples.length,i=t.inputTimeScale,o=this._initPTS,a=this._initDTS;if(n){for(var s=0;s<n;s++){(r=t.samples[s]).pts=(r.pts-o)/i,r.dts=(r.dts-a)/i;}this.observer.trigger(f["default"].FRAG_PARSING_METADATA,{samples:t.samples});}t.samples=[],e=e;}},{key:"remuxText",value:function value(t,e){t.samples.sort(function(t,e){return t.pts-e.pts;});var r,n=t.samples.length,i=t.inputTimeScale,o=this._initPTS;if(n){for(var a=0;a<n;a++){(r=t.samples[a]).pts=(r.pts-o)/i;}this.observer.trigger(f["default"].FRAG_PARSING_USERDATA,{samples:t.samples});}t.samples=[],e=e;}},{key:"_PTSNormalize",value:function value(t,e){var r;if(void 0===e)return t;for(r=e<t?-8589934592:8589934592;Math.abs(t-e)>4294967296;){t+=r;}return t;}}]),t;}();r["default"]=c;},{531:531,532:532,534:534,540:540,549:549}],542:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n);}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e;};}(),i=t(549),o=f(t(532)),a=t(531),s=f(t(543));function f(t){return t&&t.__esModule?t:{"default":t};}function u(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function");}var c=function(){function t(e,r,n,i){u(this,t),this.observer=e,this.video=r,(this.mediaSource=new MediaSource()).addEventListener("sourceopen",this.onSourceOpen.bind(this)),this.video.src=URL.createObjectURL(this.mediaSource),this.sourceBuffer=[],e.on(o["default"].FRAG_PARSING_INIT_SEGMENT,function(t){this.onBufferCodecs(t.tracks),t.tracks.video&&this.append({startPTS:0,endPTS:0,data1:t.tracks.video.initSegment,type:"video"}),t.tracks.audio&&this.append({startPTS:0,endPTS:0,data1:t.tracks.audio.initSegment,type:"audio"});}.bind(this)),e.on(o["default"].FRAG_PARSING_DATA,function(t){if(this.video.currentTime>0&&this.video.readyState<4){var e=!1,r=!1,n=1/0;if(this.sourceBuffer.audio){var i=this.sourceBuffer.audio.buffered;if(i.length>0){var o=i.start(i.length-1),a=i.end(i.length-1);a-o>1&&(e=!0,n=a);}}else e=!0;if(this.sourceBuffer.video){var s=this.sourceBuffer.video.buffered;if(s.length>0){var f=s.start(s.length-1),u=s.end(s.length-1);u-f>1&&(u<n&&(n=u),r=!0);}}else r=!0;if(e&&r)if(n-this.video.currentTime>3){var c=n-1;this.video.currentTime=c;}}this.append(t,t.type);}.bind(this)),this.audioBuffer=new h("audio"),this.videoBuffer=new h("video"),this.updating=!1,this.pendingTracks={},this.tracks={},this.removed=[];}return n(t,[{key:"createBuffers",value:function value(t){var e='video/mp4; codecs="'+codec+'"';MediaSource.isTypeSupported(e)?(this.mediaSource=new MediaSource(),this.mime=e,this.video.src=URL.createObjectURL(this.mediaSource),this.mediaSource.addEventListener("sourceopen",this.onSourceOpen.bind(this))):this.observer.trigger(o["default"].ERROR,{type:a.ErrorTypes.BUFFER_ERROR,info:"Failed to create buffer, codec is not supported "+codec});}},{key:"createSourceBuffers",value:function value(t){var e=this.sourceBuffer,r=this.mediaSource;for(var n in t){if(!e[n]){var s=t[n],f=s.codec,u=s.container+";codecs="+f;i.logger.log("creating sourceBuffer("+u+")");try{var c=e[n]=r.addSourceBuffer(u);c.addEventListener("updateend",this.onSourceUpdateEnd.bind(this)),c.addEventListener("error",this.onSourceError.bind(this)),this.tracks[n]={codec:f,container:s.container},s.buffer=c;}catch(t){i.logger.error("error while trying to add sourceBuffer:"+t.message),this.observer.trigger(o["default"].ERROR,{type:a.ErrorTypes.MEDIA_ERROR,details:a.ErrorDetails.BUFFER_ADD_CODEC_ERROR,fatal:!1,err:t,mimeType:u});}}}}},{key:"onBufferCodecs",value:function value(t){if(0===Object.keys(this.sourceBuffer).length){for(var e in t){this.pendingTracks[e]=t[e];}var r=this.mediaSource;r&&"open"===r.readyState&&this.checkPendingTracks();}}},{key:"append",value:function value(t,e){"audio"==t.type?this.audioBuffer.append(t):"video"==t.type&&this.videoBuffer.append(t),this.doAppending();}},{key:"doAppending",value:function value(){this.audioBuffer.ready()&&(this.audioBuffer.flushed?this.appendTo("audio",this.audioBuffer.next())&&this.audioBuffer.poll():this.audioBuffer.buffered()>2&&(!this.sourceBuffer.video||this.videoBuffer.flushed||this.videoBuffer.buffered()>2)&&this.appendTo("audio",this.audioBuffer.next())&&(this.audioBuffer.poll(),this.audioBuffer.flushed=!0)),this.videoBuffer.ready()&&(this.videoBuffer.flushed?this.appendTo("video",this.videoBuffer.next())&&this.videoBuffer.poll():this.videoBuffer.buffered()>2&&(!this.sourceBuffer.audio||this.audioBuffer.flushed||this.audioBuffer.buffered()>2)&&this.appendTo("video",this.videoBuffer.next())&&(this.videoBuffer.poll(),this.videoBuffer.flushed=!0));}},{key:"appendTo",value:function value(t,e){if(e){if(this.sourceBuffer[t]&&!this.sourceBuffer[t].updating)try{return e.data1?(this.sourceBuffer[t].appendBuffer(e.data1),e.data1=null,null==e.data2):(e.data2&&this.sourceBuffer[t].appendBuffer(e.data2),!0);}catch(e){22==e.code?(i.logger.error("Failed to append data to buffer "+t+" error "+e),this.cleanBuffer(t)):i.logger.error(e);}return!1;}}},{key:"cleanBuffer",value:function value(t){if(!this.sourceBuffer[t].updating){var e=this.video.currentTime,r=this.sourceBuffer[t].buffered;if(r.length>0){var n=r.end(0),o=e>n+300?0:n-e+300,a=e>n?0:60,s=r.start(0);if(s<this.removed[t])return;if(n-o<=s||n-o-s<a)return;this.removed[t]=n-o,i.logger.log("Removing buffered "+t+" start "+s+" end "+(n-o)+" currentTime "+e),this.sourceBuffer[t].remove(s,n-o);}}}},{key:"onSourceOpen",value:function value(t){var e=this;i.logger.log("media source opened");var r=this.mediaSource;r&&(r.removeEventListener("sourceopen",this.onSourceOpen),this.video.play()["catch"](function(t){"chrome"==s["default"].getConfig().browserDetails?(i.logger.info("Autoplay detected! Trying to play a video with a muted sound..."),e.video.muted=!0,e.video.play()):i.logger.error(t);})),this.checkPendingTracks();}},{key:"checkPendingTracks",value:function value(){var t=this.pendingTracks;Object.keys(t).length&&(this.createSourceBuffers(t),this.pendingTracks={},this.doAppending());}},{key:"onSourceUpdateEnd",value:function value(t){this.sourceBuffer.audio&&this.cleanBuffer("audio"),this.sourceBuffer.video&&this.cleanBuffer("video"),this.doAppending();}},{key:"onSourceError",value:function value(t){this.observer.trigger(o["default"].ERROR,{type:a.ErrorTypes.BUFFER_ERROR,info:t});}},{key:"release",value:function value(){this.video&&(this.sourceBuffer={},URL.revokeObjectURL(this.video.src),this.video.removeAttribute("src"),this.video.load(),this.video=null);}}]),t;}();r["default"]=c;var h=function(){function t(e){u(this,t),this.samples=[],this.start=-1,this.end=0,this.flushed=!1,this.type=e;}return n(t,[{key:"buffered",value:function value(){return this.end-this.start;}},{key:"append",value:function value(t){this.samples.push(t),-1==this.start&&(this.start=t.startPTS),this.end=t.endPTS;}},{key:"next",value:function value(){return this.samples[0];}},{key:"poll",value:function value(){var t=this.samples.shift();return 0==this.samples.length?(this.start=-1,this.end=0):(this.start=this.samples[0].startPTS,this.end=this.samples[this.samples.length-1].endPTS),t;}},{key:"ready",value:function value(){return this.buffered()>0;}}]),t;}();},{531:531,532:532,543:543,549:549}],543:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n);}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e;};}();t(17);var i,o=t(538),a=(i=o)&&i.__esModule?i:{"default":i};var s,f=t(490),u=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function");}(this,t);}return n(t,null,[{key:"createConnection",value:function value(t){void 0===t.enableWorker&&(t.enableWorker=!0),void 0===t.connectionConstraints?t.connectionConstraints={fragmentLengthMs:100,cutByIFrameOnly:!1}:(void 0===t.connectionConstraints.fragmentLengthMs&&(t.connectionConstraints.fragmentLengthMs=100),void 0===t.connectionConstraints.cutByIFrameOnly&&(t.connectionConstraints.cutByIFrameOnly=!1));var e=new a["default"](t);return f.resolve(e);}},{key:"getMediaAccess",value:function value(){return new f(function(t,e){e(new Error("This provider doesn't support getMediaAccess"));});}},{key:"releaseMedia",value:function value(){return!1;}},{key:"available",value:function value(){return"MediaSource"in window;}},{key:"listDevices",value:function value(){return new f(function(t,e){e(new Error("This provider doesn't support listDevices"));});}},{key:"configure",value:function value(t){s=t;}},{key:"getConfig",value:function value(){return s;}},{key:"playFirstSound",value:function value(){}},{key:"playFirstVideo",value:function value(t,e){return a["default"].playFirstVideo(t,e);}}]),t;}();r["default"]=u;},{17:17,490:490,538:538}],544:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n);}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e;};}();r.MediaFileReader=function(){function t(e,r,n){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function");}(this,t),this.observer=e,this.elementId=r.mainUrl,this.buffer=r.buffer,this.demuxer=n,this.buffer?this.feedDemuxer(this.buffer):document.getElementById(this.elementId).addEventListener("change",this.handleFileSelect.bind(this),!1);}return n(t,[{key:"handleFileSelect",value:function value(t){var e=t.target.files[0],r=new FileReader(),n=this;r.onload=function(t){n.feedDemuxer(t.target.result);},r.readAsArrayBuffer(e);}},{key:"feedDemuxer",value:function value(t){for(var e=this.demuxer,r=new DataView(t),n=0;n<t.byteLength;){var i=r.getInt32(n+5),o=t.slice(n,n+i+9);n+=9,n+=i,e.onData(o);}}},{key:"disconnect",value:function value(){}}]),t;}();},{}],545:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n,i=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n);}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e;};}(),o=t(532),a=((n=o)&&n.__esModule,t(531));var s=function(){function t(e,r,n){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function");}(this,t),this.mediaConnection=e,this.url=r.mainUrl,this.token=r.authToken,this.state="NEW",this.socket=null,this.demuxer=n;}return i(t,[{key:"connect",value:function value(){var t=this;this.state="CONNECTING",this.socket=new WebSocket(this.url),this.socket.binaryType="arraybuffer",this.socket.onopen=this.onConnected.bind(this),this.socket.onmessage=function(e){if(e.data instanceof ArrayBuffer)t.demuxer.onData(e.data);else switch(JSON.parse(e.data).message){case"ping":var r={message:"pong"};t.socket.send(JSON.stringify(r));}},this.socket.onerror=function(e){t.state="ERROR",t.mediaConnection.trigger(Event.ERROR,{type:a.ErrorTypes.NETWORK_ERROR,info:e});},this.socket.onclose=this.onDisconnected.bind(this);}},{key:"disconnect",value:function value(){"CONNECTING"!=this.state&&"CONNECTED"!=this.state||this.socket.close();}},{key:"onConnected",value:function value(){var t={message:"connectMediaTransport"};t.data=[{authToken:this.token}],this.socket.send(JSON.stringify(t)),this.state="CONNECTED",this.mediaConnection.trigger(Event.TRANSPORT_CONNECTED,{});}},{key:"onDisconnected",value:function value(){this.state="CLOSED",this.mediaConnection.trigger(Event.TRANSPORT_DISCONNECTED,{});}}]),t;}();r["default"]=s;},{531:531,532:532}],546:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n);}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e;};}();r.appendByteArray=function(t,e){var r=new Uint8Array((0|t.byteLength)+(0|e.byteLength));return r.set(t,0),r.set(e,0|t.byteLength),r;},r.appendByteArrayAsync=function(t,e){return new Promise(function(r,n){var i=new Blob([t,e]),o=new FileReader();o.addEventListener("loadend",function(){r();}),o.readAsArrayBuffer(i);});},r.base64ToArrayBuffer=function(t){for(var e=window.atob(t),r=e.length,n=new Uint8Array(r),i=0;i<r;i++){n[i]=e.charCodeAt(i);}return n.buffer;},r.hexToByteArray=function(t){for(var e=t.length>>1,r=new Uint8Array(e),n=0;n<e;n++){r[n]=parseInt(t.substr(n<<1,2),16);}return r;},r.concatenate=function(t){for(var e=0,r=arguments.length,n=Array(r>1?r-1:0),i=1;i<r;i++){n[i-1]=arguments[i];}var o=!0,a=!1,s=void 0;try{for(var f,u=n[Symbol.iterator]();!(o=(f=u.next()).done);o=!0){var c=f.value;e+=c.length;}}catch(t){a=!0,s=t;}finally{try{!o&&u["return"]&&u["return"]();}finally{if(a)throw s;}}var h=new t(e),d=0,l=!0,p=!1,b=void 0;try{for(var v,g=n[Symbol.iterator]();!(l=(v=g.next()).done);l=!0){var y=v.value;h.set(y,d),d+=y.length;}}catch(t){p=!0,b=t;}finally{try{!l&&g["return"]&&g["return"]();}finally{if(p)throw b;}}return h;},r.bitSlice=function(t){for(var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:8*t.byteLength,n=Math.ceil((r-e)/8),i=new Uint8Array(n),o=e>>>3,a=(r>>>3)-1,s=7&e,f=8-s,u=8-r&7,c=0;c<n;++c){var h=0;c<a&&(h=t[o+c+1]>>f,c==a-1&&u<8&&(h>>=u,h<<=u)),i[c]=t[o+c]<<s|h;}return i;};r.BitArray=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function");}(this,t),this.src=new DataView(e.buffer,e.byteOffset,e.byteLength),this.bitpos=0,this["byte"]=this.src.getUint8(0),this.bytepos=0;}return n(t,[{key:"readBits",value:function value(t){if(32<(0|t)||0==(0|t))throw new Error("too big");for(var e=0,r=t;r>0;--r){e=(0|e)<<1|(0|this["byte"])>>8-++this.bitpos&1,(0|this.bitpos)>=8&&(this["byte"]=this.src.getUint8(++this.bytepos),this.bitpos&=7);}return e;}},{key:"skipBits",value:function value(t){return this.bitpos+=7&(0|t),this.bytepos+=(0|t)>>>3,this.bitpos>7&&(this.bitpos&=7,++this.bytepos),this.finished()?this.bytepos-this.src.byteLength-this.src.bitpos:(this["byte"]=this.src.getUint8(this.bytepos),0);}},{key:"finished",value:function value(){return this.bytepos>=this.src.byteLength;}}]),t;}();},{}],547:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n);}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e;};}();function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function");}var o=function(){function t(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;i(this,t),this.array=e,this.view=new DataView(e),this.i=r,this.length=e.byteLength-r;}return n(t,[{key:"readByte",value:function value(){if(!(this.length-this.i<1)){var t=this.view.getInt8(this.i);return this.i++,t;}logger.error("Buffer end reached");}},{key:"readInt",value:function value(){if(!(this.length-this.i<4)){var t=this.view.getInt32(this.i);return this.i+=4,t;}logger.error("Buffer end reached");}},{key:"readShort",value:function value(){if(!(this.length-this.i<2)){var t=this.view.getInt16(this.i);return this.i+=2,t;}logger.error("Buffer end reached");}},{key:"skipBytes",value:function value(t){this.i+=t;}},{key:"readableBytes",value:function value(){return this.length-this.i;}},{key:"sliceAsUint8Array",value:function value(t,e){var r=this.array.slice(t,t+e);return this.i+=e,new Uint8Array(r);}},{key:"readerIndex",value:function value(){return this.i;}},{key:"resetReaderIndex",value:function value(){this.i=this.array.byteLength-this.length;}}]),t;}();r["default"]=o;},{}],548:[function(t,e,r){"use strict";e.exports={hexDump:function hexDump(t){var e,r="";for(e=0;e<t.length;e++){var n=t[e].toString(16);n.length<2&&(n="0"+n),r+=n;}return r;}};},{}],549:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n="function"==typeof Symbol&&"symbol"==_typeof(Symbol.iterator)?function(t){return _typeof(t);}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":_typeof(t);};function i(){}var o={trace:i,debug:i,log:i,warn:i,info:i,error:i},a=o;function s(t,e){return e="["+t+"] > "+e;}function f(t){var e=self.console[t];return e?function(){for(var r=arguments.length,n=Array(r),i=0;i<r;i++){n[i]=arguments[i];}n[0]&&(n[0]=s(t,n[0])),e.apply(self.console,n);}:i;}r.enableLogs=function(t){if(!0===t||"object"===(void 0===t?"undefined":n(t))){!function(t){for(var e=arguments.length,r=Array(e>1?e-1:0),n=1;n<e;n++){r[n-1]=arguments[n];}r.forEach(function(e){a[e]=t[e]?t[e].bind(t):f(e);});}(t,"debug","log","info","warn","error");try{a.log();}catch(t){a=o;}}else a=o;},r.logger=a;},{}]},{},[533])(533);});

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],33:[function(require,module,exports){
'use strict';

var SESSION_STATUS = require('./constants').SESSION_STATUS;

var STREAM_STATUS = require('./constants').STREAM_STATUS;

var Promise = require('promise-polyfill');

var util = require('./util');

var uuid_v1 = require('uuid/v1');

var ROOM_REST_APP = "roomApp";
/**
 * Room api based on core api
 *
 * @namespace roomApi
 */

/**
 * Initialize connection
 *
 * @param {Object} options session options
 * @param {String} options.urlServer Server address in form of [ws,wss]://host.domain:port
 * @param {String} options.username Username to login with
 * @returns {roomApi.Session}
 * @memberof roomApi
 * @method connect
 */

var appSession = function appSession(options) {
  /**
   * Represents connection to room api app
   *
   * @namespace roomApi.Session
   */
  var callbacks = {};
  var rooms = {};
  var username_ = options.username;
  var exports;
  var roomHandlers = {};
  var session = Flashphoner.createSession({
    urlServer: options.urlServer,
    mediaOptions: options.mediaOptions,
    appKey: options.appKey && options.appKey.length != 0 ? options.appKey : ROOM_REST_APP,
    custom: {
      login: options.username,
      token: options.token
    }
  }).on(SESSION_STATUS.ESTABLISHED, function (session) {
    if (callbacks[session.status()]) {
      callbacks[session.status()](exports);
    }
  }).on(SESSION_STATUS.APP_DATA, function (data) {
    if (roomHandlers[data.payload.roomName]) {
      roomHandlers[data.payload.roomName](data.payload);
    } else {
      console.warn("Failed to find room");
    }
  }).on(SESSION_STATUS.DISCONNECTED, sessionDied).on(SESSION_STATUS.FAILED, sessionDied); //teardown helper

  function sessionDied(session) {
    if (callbacks[session.status()]) {
      callbacks[session.status()](exports);
    }
  }
  /**
   * Disconnect session
   *
   * @memberof roomApi.Session
   * @inner
   */


  var disconnect = function disconnect() {
    session.disconnect();
  };
  /**
   * Get session status
   *
   * @returns {string} One of {@link Flashphoner.constants.SESSION_STATUS}
   * @memberof roomApi.Session
   * @inner
   */


  var status = function status() {
    return session.status();
  };
  /**
   * Get session id
   *
   * @returns {string} session id
   * @memberof roomApi.Session
   * @inner
   */


  var id = function id() {
    return session.id();
  };
  /**
   * Get server address
   *
   * @returns {string} Server url
   * @memberof roomApi.Session
   * @inner
   */


  var getServerUrl = function getServerUrl() {
    return session.getServerUrl();
  };
  /**
   * Get session username
   *
   * @returns {string} username
   * @memberof roomApi.Session
   * @inner
   */


  var username = function username() {
    return username_;
  };
  /**
   * Get rooms
   *
   * @returns {roomApi.Room[]}
   * @memberof roomApi.Session
   * @inner
   */


  var getRooms = function getRooms() {
    return util.copyObjectToArray(rooms);
  };
  /**
   * Add session event callback.
   *
   * @param {string} event One of {@link Flashphoner.constants.SESSION_STATUS} events
   * @param {Session~eventCallback} callback Callback function
   * @returns {roomApi.Session} Session
   * @throws {TypeError} Error if event is not specified
   * @throws {Error} Error if callback is not a valid function
   * @memberof roomApi.Session
   * @inner
   */


  var on = function on(event, callback) {
    if (!event) {
      throw new Error("Event can't be null", "TypeError");
    }

    if (!callback || typeof callback !== 'function') {
      throw new Error("Callback needs to be a valid function");
    }

    callbacks[event] = callback;
    return exports;
  };
  /**
   * Join room
   *
   * @param {Object} options Room options
   * @param {String} options.name Room name
   * @returns {roomApi.Room}
   * @memberof roomApi.Session
   * @inner
   */


  var join = function join(options) {
    /**
     * Room
     *
     * @namespace roomApi.Room
     */
    var room = {};
    var name_ = options.name;
    var participants = {};
    var callbacks = {};
    var stateStreams = {};

    roomHandlers[name_] = function (data) {
      /**
       * Room participant
       *
       * @namespace roomApi.Room.Participant
       */
      var participant;

      if (data.name == "STATE") {
        if (data.info) {
          for (var i = 0; i < data.info.length; i++) {
            participantFromState(data.info[i]);
          }

          stateStreams = {};
        }

        if (callbacks["STATE"]) {
          callbacks["STATE"](room);
        }
      } else if (data.name == "JOINED") {
        participants[data.info] = {
          streams: {},
          name: function name() {
            return data.info;
          },
          sendMessage: attachSendMessage(data.info),
          getStreams: function getStreams() {
            return util.copyObjectToArray(this.streams);
          }
        };

        if (callbacks["JOINED"]) {
          callbacks["JOINED"](participants[data.info]);
        }
      } else if (data.name == "LEFT") {
        participant = participants[data.info];
        delete participants[data.info];

        if (callbacks["LEFT"]) {
          callbacks["LEFT"](participant);
        }
      } else if (data.name == "PUBLISHED") {
        participant = participants[data.info.login];
        participant.streams[data.info.name] = {
          play: play(data.info.name),
          stop: stop(data.info.name),
          id: id(data.info.name),
          streamName: function streamName() {
            return data.info.name;
          }
        };

        if (callbacks["PUBLISHED"]) {
          callbacks["PUBLISHED"](participant);
        }
      } else if (data.name == "FAILED" || data.name == "UNPUBLISHED") {
        participant = participants[data.info.login];
        if (participant != null) delete participant.streams[data.info.name];
      } else if (data.name == "MESSAGE") {
        if (callbacks["MESSAGE"]) {
          callbacks["MESSAGE"]({
            from: participants[data.info.from],
            text: data.info.text
          });
        }
      }
    }; //participant creation helper


    function participantFromState(state) {
      var participant = {};

      if (state.hasOwnProperty("login")) {
        var login = state.login;
        var _streamName = state.name;
        stateStreams[_streamName] = {
          /**
           * Play participant stream
           *
           * @param {HTMLElement} display Div element stream should be displayed in
           * @returns {Stream} Local stream object
           * @memberof roomApi.Room.Participant.Stream
           * @inner
           */
          play: play(_streamName),

          /**
           * Stop participant stream
           *
           * @memberof roomApi.Room.Participant.Stream
           * @inner
           */
          stop: stop(_streamName),

          /**
           * Get participant stream id
           *
           * @returns {String} Stream id
           * @memberof roomApi.Room.Participant.Stream
           * @inner
           */
          id: id(_streamName),

          /**
           * Get participant stream name
           *
           * @returns {String} Stream name
           * @memberof roomApi.Room.Participant.Stream
           * @inner
           */
          streamName: function streamName() {
            return _streamName;
          }
        };

        if (participants[login] != null) {
          participant = participants[login];
        } else {
          participant = {
            streams: {},

            /**
             * Get participant name
             *
             * @returns {String} Participant name
             * @memberof roomApi.Room.Participant
             * @inner
             */
            name: function name() {
              return login;
            },

            /**
             * Send message to participant
             *
             * @param {String} message Message to send
             * @param {Function} error Error callback
             * @memberof roomApi.Room.Participant
             * @inner
             */
            sendMessage: attachSendMessage(login),

            /**
             * Get participant streams
             *
             * @returns {Array<roomApi.Room.Participant.Stream>} Streams
             * @memberof roomApi.Room.Participant
             * @inner
             */
            getStreams: function getStreams() {
              return util.copyObjectToArray(this.streams);
            }
          };
          participants[participant.name()] = participant;
        }
        /**
         * Room participant
         *
         * @namespace roomApi.Room.Participant.Stream
         */

      } else {
        participant = {
          streams: {},
          name: function name() {
            return state;
          },
          sendMessage: attachSendMessage(state),
          getStreams: function getStreams() {
            return util.copyObjectToArray(this.streams);
          }
        };
      }

      if (Object.keys(stateStreams).length != 0) {
        for (var k in stateStreams) {
          if (stateStreams.hasOwnProperty(k)) {
            participant.streams[k] = stateStreams[k];
            delete stateStreams[k];
          }
        }
      }

      participants[participant.name()] = participant;
      return participant;
    }
    /**
     * Get room name
     *
     * @returns {String} Room name
     * @memberof roomApi.Room
     * @inner
     */


    var name = function name() {
      return name_;
    };
    /**
     * Leave room
     *
     * @returns {Promise<room>}
     * @memberof roomApi.Room
     * @inner
     */


    var leave = function leave() {
      return new Promise(function (resolve, reject) {
        sendAppCommand("leave", {
          name: name_
        }).then(function () {
          cleanUp();
          resolve(room);
        }, function () {
          cleanUp();
          reject(room);
        });

        function cleanUp() {
          //clear streams
          var streams = session.getStreams();

          for (var i = 0; i < streams.length; i++) {
            if (streams[i].name().indexOf(name_ + "-" + username_) !== -1 && streams[i].status() != STREAM_STATUS.UNPUBLISHED) {
              streams[i].stop();
            } else if (streams[i].name().indexOf(name_) !== -1 && streams[i].status() != STREAM_STATUS.STOPPED) {
              streams[i].stop();
            }
          }

          delete roomHandlers[name_];
          delete rooms[name_];
        }
      });
    };
    /**
     * Publish stream inside room
     *
     * @param {Object} options Stream options
     * @param {string=} options.name Stream name
     * @param {Object=} options.constraints Stream constraints
     * @param {Boolean=} options.record Enable stream recording
     * @param {Boolean=} options.cacheLocalResources Display will contain local video after stream release
     * @param {HTMLElement} options.display Div element stream should be displayed in
     * @returns {Stream}
     * @memberof roomApi.Room
     * @inner
     */


    var publish = function publish(options) {
      options.name = options.name ? name_ + "-" + username_ + "-" + uuid_v1().substr(0, 4) + "-" + options.name : name_ + "-" + username_ + "-" + uuid_v1().substr(0, 4);
      options.cacheLocalResources = typeof options.cacheLocalResources === "boolean" ? options.cacheLocalResources : true;
      options.custom = {
        name: name_
      };
      var stream = session.createStream(options);
      stream.publish();
      return stream;
    };
    /**
     * Add room event callback.
     *
     * @param {string} event One of {@link roomApi.events} events
     * @param {roomApi.Room~eventCallback} callback Callback function
     * @returns {roomApi.Room} room
     * @throws {TypeError} Error if event is not specified
     * @throws {Error} Error if callback is not a valid function
     * @memberof roomApi.Room
     * @inner
     */


    var on = function on(event, callback) {
      if (!event) {
        throw new Error("Event can't be null", "TypeError");
      }

      if (!callback || typeof callback !== 'function') {
        throw new Error("Callback needs to be a valid function");
      }

      callbacks[event] = callback;
      return room;
    };
    /**
     * Get participants
     *
     * @returns {roomApi.Room.Participant}
     * @memberof roomApi.Room
     * @inner
     */


    var getParticipants = function getParticipants() {
      return util.copyObjectToArray(participants);
    }; //participant helpers


    function play(streamName) {
      return function (display) {
        var stream = session.createStream({
          name: streamName,
          display: display,
          custom: {
            name: name_
          }
        });
        stream.play();
        return stream;
      };
    }

    function stop(streamName) {
      return function () {
        var streams = session.getStreams();

        for (var i = 0; i < streams.length; i++) {
          if (streams[i].name() == streamName && streams[i].status() != STREAM_STATUS.UNPUBLISHED) {
            streams[i].stop();
          }
        }
      };
    }

    function id(streamName) {
      return function () {
        var streams = session.getStreams();

        for (var i = 0; i < streams.length; i++) {
          if (streams[i].name() == streamName) return streams[i].id();
        }
      };
    }

    function attachSendMessage(recipientName) {
      return function (text, error) {
        var message = {
          roomConfig: {
            name: name_
          },
          to: recipientName,
          text: text
        };
        sendAppCommand("sendMessage", message).then(function () {}, function () {
          if (error) {
            error();
          }
        });
      };
    } //sendData helper


    function sendAppCommand(commandName, data) {
      var command = {
        command: commandName,
        options: data
      };
      return session.sendData(command);
    }

    sendAppCommand("join", {
      name: name_
    }).then(function () {}, function (info) {
      if (callbacks["FAILED"]) {
        callbacks["FAILED"](room, info.info);
      }
    });
    room.name = name;
    room.leave = leave;
    room.publish = publish;
    room.getParticipants = getParticipants;
    room.on = on;
    rooms[name_] = room;
    return room;
  };

  exports = {
    disconnect: disconnect,
    id: id,
    getServerUrl: getServerUrl,
    username: username,
    status: status,
    getRooms: getRooms,
    join: join,
    on: on
  };
  return exports;
};

var events = {
  STATE: "STATE",
  JOINED: "JOINED",
  LEFT: "LEFT",
  PUBLISHED: "PUBLISHED",
  MESSAGE: "MESSAGE",
  FAILED: "FAILED"
};
module.exports = {
  connect: appSession,
  events: events
};

},{"./constants":29,"./util":35,"promise-polyfill":5,"uuid/v1":12}],34:[function(require,module,exports){
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var webrtcAdapter = require('webrtc-adapter');

var uuid = require('uuid/v1');

var util = require('./util');

var connections = {};
var CACHED_INSTANCE_POSTFIX = "-CACHED_WEBRTC_INSTANCE";
var extensionId;
var defaultConstraints;
var logger;
var LOG_PREFIX = "webrtc";

var Promise = require('es6-promise').Promise;

var createConnection = function createConnection(options) {
  return new Promise(function (resolve, reject) {
    var id = options.id;
    var connectionConfig = options.connectionConfig || {
      "iceServers": []
    };
    var connection = new RTCPeerConnection(connectionConfig, {
      "optional": [{
        "DtlsSrtpKeyAgreement": true
      }]
    }); //unidirectional display

    var display = options.display; //bidirectional local

    var localDisplay = options.localDisplay; //bidirectional remote

    var remoteDisplay = options.remoteDisplay;
    var bidirectional = options.bidirectional;
    var localVideo;
    var remoteVideo;

    if (bidirectional) {
      localVideo = getCacheInstance(localDisplay);
      remoteVideo = document.createElement('video');
      localVideo.id = id + "-local";
      remoteVideo.id = id + "-remote";
      remoteDisplay.appendChild(remoteVideo);
      connection.addStream(localVideo.srcObject);
    } else {
      localVideo = getCacheInstance(display);

      if (localVideo) {
        localVideo.id = id;
        connection.addStream(localVideo.srcObject);
      } else {
        remoteVideo = document.createElement('video');
        remoteVideo.id = id;
        display.appendChild(remoteVideo);
      }
    }

    connection.ontrack = function (event) {
      if (remoteVideo) {
        remoteVideo.srcObject = event.streams[0];

        remoteVideo.onloadedmetadata = function (e) {
          if (remoteVideo) {
            remoteVideo.play();
          }
        };
      }
    };

    connection.onaddstream = function (event) {
      if (remoteVideo) {
        remoteVideo.onloadedmetadata = function (e) {
          if (remoteVideo) {
            remoteVideo.play();
          }
        };

        remoteVideo.addEventListener('loadedmetadata', function () {
          if (remoteVideo) {
            remoteVideo.play();
          }
        });
        remoteVideo = attachMediaStream(remoteVideo, event.stream);
        remoteVideo.srcObject = event.stream;
      }
    };

    ;

    connection.onremovestream = function (event) {
      if (remoteVideo) {
        remoteVideo.pause();
      }
    };

    connection.onsignalingstatechange = function (event) {};

    connection.oniceconnectionstatechange = function (event) {};

    var state = function state() {
      return connection.signalingState;
    };

    var close = function close(cacheCamera) {
      if (remoteVideo) {
        removeVideoElement(remoteVideo);
        remoteVideo = null;
      }

      if (localVideo && !getCacheInstance(localDisplay || display) && cacheCamera) {
        localVideo.id = localVideo.id + CACHED_INSTANCE_POSTFIX;
        unmuteAudio();
        unmuteVideo();
        localVideo = null;
      } else if (localVideo) {
        removeVideoElement(localVideo);
        localVideo = null;
      }

      if (connection.signalingState !== "closed") {
        connection.close();
      }

      delete connections[id];
    };

    var createOffer = function createOffer(options) {
      return new Promise(function (resolve, reject) {
        var hasAudio = true;
        var hasVideo = true;

        if (localVideo) {
          if (!localVideo.srcObject.getAudioTracks()[0]) {
            hasAudio = false;
          }

          if (!localVideo.srcObject.getVideoTracks()[0]) {
            hasVideo = false;
            options.receiveVideo = false;
          }
        }

        var constraints = {
          offerToReceiveAudio: options.receiveAudio ? 1 : 0,
          offerToReceiveVideo: options.receiveVideo ? 1 : 0
        }; //create offer and set local sdp

        connection.createOffer(function (offer) {
          connection.setLocalDescription(offer, function () {
            var o = {};
            o.sdp = util.stripCodecs(offer.sdp, options.stripCodecs);
            o.hasAudio = hasAudio;
            o.hasVideo = hasVideo;
            resolve(o);
          }, function (error) {
            console.log(error);
          });
        }, function (error) {
          console.log(error);
        }, constraints);
      });
    };

    var createAnswer = function createAnswer(options) {
      return new Promise(function (resolve, reject) {
        //create offer and set local sdp
        connection.createAnswer(function (answer) {
          connection.setLocalDescription(answer, function () {
            resolve(util.stripCodecs(answer.sdp, options.stripCodecs));
          }, function (error) {
            console.log(error);
          });
        }, function (error) {
          console.log(error);
        }, {});
      });
    };

    var changeAudioCodec = function changeAudioCodec(codec) {
      return false;
    };

    var setRemoteSdp = function setRemoteSdp(sdp) {
      logger.debug(LOG_PREFIX, "setRemoteSDP:");
      logger.debug(LOG_PREFIX, sdp);
      return new Promise(function (resolve, reject) {
        var sdpType;

        if (connection.signalingState == 'have-local-offer') {
          sdpType = 'answer';
        } else {
          sdpType = 'offer';
        }

        var rtcSdp = new RTCSessionDescription({
          type: sdpType,
          sdp: sdp
        });
        connection.setRemoteDescription(rtcSdp, function () {
          resolve();
        }, function (error) {
          reject(error);
        });
      });
    };

    var getVolume = function getVolume() {
      if (remoteVideo && remoteVideo.srcObject && remoteVideo.srcObject.getAudioTracks().length > 0) {
        //return remoteVideo.srcObject.getAudioTracks()[0].volume * 100;
        if (remoteVideo.tagName == "OBJECT" || remoteVideo.tagName == "object") {
          console.log("Volume change does not support for Temasys");
        } else {
          return remoteVideo.volume * 100;
        }
      }

      return -1;
    };

    var setVolume = function setVolume(volume) {
      if (remoteVideo && remoteVideo.srcObject && remoteVideo.srcObject.getAudioTracks().length > 0) {
        if (remoteVideo.tagName == "OBJECT" || remoteVideo.tagName == "object") {
          console.log("Volume change does not support for Temasys");
        } else {
          remoteVideo.volume = volume / 100;
        }
      }
    };

    var muteAudio = function muteAudio() {
      if (localVideo && localVideo.srcObject && localVideo.srcObject.getAudioTracks().length > 0) {
        localVideo.srcObject.getAudioTracks()[0].enabled = false;
      }
    };

    var unmuteAudio = function unmuteAudio() {
      if (localVideo && localVideo.srcObject && localVideo.srcObject.getAudioTracks().length > 0) {
        localVideo.srcObject.getAudioTracks()[0].enabled = true;
      }
    };

    var isAudioMuted = function isAudioMuted() {
      if (localVideo && localVideo.srcObject && localVideo.srcObject.getAudioTracks().length > 0) {
        return !localVideo.srcObject.getAudioTracks()[0].enabled;
      }

      return true;
    };

    var muteVideo = function muteVideo() {
      if (localVideo && localVideo.srcObject && localVideo.srcObject.getVideoTracks().length > 0) {
        localVideo.srcObject.getVideoTracks()[0].enabled = false;
      }
    };

    var unmuteVideo = function unmuteVideo() {
      if (localVideo && localVideo.srcObject && localVideo.srcObject.getVideoTracks().length > 0) {
        localVideo.srcObject.getVideoTracks()[0].enabled = true;
      }
    };

    var isVideoMuted = function isVideoMuted() {
      if (localVideo && localVideo.srcObject && localVideo.srcObject.getVideoTracks().length > 0) {
        return !localVideo.srcObject.getVideoTracks()[0].enabled;
      }

      return true;
    };

    var getStats = function getStats(callbackFn) {
      if (connection) {
        if (webrtcAdapter.browserDetails.browser == "chrome") {
          connection.getStats(null).then(function (rawStats) {
            var results = rawStats;
            var result = {
              type: "chrome",
              outgoingStreams: {},
              incomingStreams: {}
            };

            for (var i = 0; i < results.length; ++i) {
              var resultPart = util.processRtcStatsReport(webrtcAdapter.browserDetails.browser, results[i]);

              if (resultPart != null) {
                if (resultPart.type == "googCandidatePair") {
                  result.activeCandidate = resultPart;
                } else if (resultPart.type == "ssrc") {
                  if (resultPart.transportId.indexOf("audio") > -1) {
                    if (resultPart.id.indexOf("send") > -1) {
                      result.outgoingStreams.audio = resultPart;
                    } else {
                      result.incomingStreams.audio = resultPart;
                    }
                  } else {
                    if (resultPart.id.indexOf("send") > -1) {
                      result.outgoingStreams.video = resultPart;
                    } else {
                      result.incomingStreams.video = resultPart;
                    }
                  }
                }
              }
            }

            callbackFn(result);
          })["catch"](function (error) {
            callbackFn(error);
          });
        } else if (webrtcAdapter.browserDetails.browser == "firefox") {
          connection.getStats(null).then(function (rawStats) {
            var result = {
              type: "firefox",
              outgoingStreams: {},
              incomingStreams: {}
            };

            for (var k in rawStats) {
              if (rawStats.hasOwnProperty(k)) {
                var resultPart = util.processRtcStatsReport(webrtcAdapter.browserDetails.browser, rawStats[k]);

                if (resultPart != null) {
                  if (resultPart.type == "outboundrtp") {
                    if (resultPart.id.indexOf("audio") > -1) {
                      result.outgoingStreams.audio = resultPart;
                    } else {
                      result.outgoingStreams.video = resultPart;
                    }
                  } else if (resultPart.type == "inboundrtp") {
                    if (resultPart.id.indexOf("audio") > -1) {
                      result.incomingStreams.audio = resultPart;
                    } else {
                      result.incomingStreams.video = resultPart;
                    }
                  }
                }
              }
            }

            callbackFn(result);
          })["catch"](function (error) {
            callbackFn(error);
          });
        }
      }
    };

    var exports = {};
    exports.state = state;
    exports.createOffer = createOffer;
    exports.createAnswer = createAnswer;
    exports.setRemoteSdp = setRemoteSdp;
    exports.changeAudioCodec = changeAudioCodec;
    exports.close = close;
    exports.setVolume = setVolume;
    exports.getVolume = getVolume;
    exports.muteAudio = muteAudio;
    exports.unmuteAudio = unmuteAudio;
    exports.isAudioMuted = isAudioMuted;
    exports.muteVideo = muteVideo;
    exports.unmuteVideo = unmuteVideo;
    exports.isVideoMuted = isVideoMuted;
    exports.getStats = getStats;
    connections[id] = exports;
    resolve(exports);
  });
};

var getMediaAccess = function getMediaAccess(constraints, display) {
  return new Promise(function (resolve, reject) {
    if (!constraints) {
      constraints = defaultConstraints;

      if (getCacheInstance(display)) {
        resolve(display);
        return;
      }
    } else {
      constraints = normalizeConstraints(constraints);
      releaseMedia(display);
    } //check if this is screen sharing


    if (constraints.video && constraints.video.type && constraints.video.type == "screen") {
      delete constraints.video.type;
      getScreenDeviceId(constraints).then(function (screenSharingConstraints) {
        //copy constraints
        for (var prop in screenSharingConstraints) {
          if (screenSharingConstraints.hasOwnProperty(prop)) {
            constraints.video[prop] = screenSharingConstraints[prop];
          }
        }

        if (webrtcAdapter.browserDetails.browser == "chrome") {
          delete constraints.video.frameRate;
          delete constraints.video.height;
          delete constraints.video.width;
        }

        getAccess(constraints);
      }, reject);
    } else {
      getAccess(constraints);
    }

    function getAccess(constraints) {
      logger.info(LOG_PREFIX, constraints);
      navigator.getUserMedia(constraints, function (stream) {
        var video = document.createElement('video');
        display.appendChild(video);
        video.id = uuid_v1() + CACHED_INSTANCE_POSTFIX; //mute audio

        video.muted = true;

        video.onloadedmetadata = function (e) {
          video.play();
        };

        video.addEventListener('loadedmetadata', function () {
          video.play();
        });
        video = attachMediaStream(video, stream);
        video.srcObject = stream;
        resolve(display);
      }, reject);
    }
  });
};

var getScreenDeviceId = function getScreenDeviceId(constraints) {
  return new Promise(function (resolve, reject) {
    var o = {};

    if (window.chrome) {
      chrome.runtime.sendMessage(extensionId, {
        type: "isInstalled"
      }, function (response) {
        if (response) {
          o.maxWidth = constraints.video.width;
          o.maxHeight = constraints.video.height;
          o.maxFrameRate = constraints.video.frameRate.max;
          o.chromeMediaSource = "desktop";
          chrome.runtime.sendMessage(extensionId, {
            type: "getSourceId"
          }, function (response) {
            if (response.error) {
              reject(new Error("Screen access denied"));
            } else {
              o.chromeMediaSourceId = response.sourceId;
              resolve({
                mandatory: o
              });
            }
          });
        } else {
          reject(new Error("Screen sharing extension is not available"));
        }
      });
    } else {
      //firefox case
      o.mediaSource = "window";
      o.width = {
        min: constraints.video.width,
        max: constraints.video.width
      };
      o.height = {
        min: constraints.video.height,
        max: constraints.video.height
      };
      o.frameRate = {
        min: constraints.video.frameRate.max,
        max: constraints.video.frameRate.max
      };
      resolve(o);
    }
  });
};

var releaseMedia = function releaseMedia(display) {
  var video = getCacheInstance(display);

  if (video) {
    removeVideoElement(video);
    return true;
  }

  return false;
};

function getCacheInstance(display) {
  var i;

  for (i = 0; i < display.children.length; i++) {
    if (display.children[i] && display.children[i].id.indexOf(CACHED_INSTANCE_POSTFIX) != -1) {
      logger.info(LOG_PREFIX, "FOUND WEBRTC CACHED INSTANCE, id " + display.children[i].id);
      return display.children[i];
    }
  }
}

function removeVideoElement(video) {
  if (video.srcObject) {
    //pause
    video.pause(); //stop media tracks

    var tracks = video.srcObject.getTracks();

    for (var i = 0; i < tracks.length; i++) {
      tracks[i].stop();
    }
  }

  if (video.parentNode) {
    video.parentNode.removeChild(video);
  }
}
/**
 * Check WebRTC available
 *
 * @returns {boolean} webrtc available
 */


var available = function available() {
  return webrtcAdapter.browserDetails.browser != "edge" ? navigator.getUserMedia && RTCPeerConnection : false;
};

var listDevices = function listDevices(labels) {
  return new Promise(function (resolve, reject) {
    var list = {
      audio: [],
      video: []
    };

    if (labels) {
      var display = document.createElement("div");
      getMediaAccess({
        audio: true,
        video: {}
      }, display).then(function () {
        releaseMedia(display);
        populateList();
      }, reject);
    } else {
      populateList();
    }

    function populateList() {
      navigator.mediaDevices.enumerateDevices().then(function (devices) {
        for (var i = 0; i < devices.length; i++) {
          var device = devices[i];
          var ret = {
            id: device.deviceId,
            label: device.label
          };

          if (device.kind == "audioinput") {
            ret.type = "mic";
            list.audio.push(ret);
          } else if (device.kind == "videoinput") {
            ret.type = "camera";
            list.video.push(ret);
          } else {
            logger.info(LOG_PREFIX, "unknown device " + device.kind + " id " + device.deviceId);
          }
        }

        resolve(list);
      }, reject);
    }
  });
};

function normalizeConstraints(constraints) {
  if (constraints.video) {
    if (Flashphoner.isUsingTemasys()) {
      delete constraints.video.deviceId;
    }

    if (constraints.video.hasOwnProperty('frameRate') && _typeof(constraints.video.frameRate) !== 'object') {
      // Set default FPS value
      var frameRate = constraints.video.frameRate == 0 ? 30 : constraints.video.frameRate;
      constraints.video.frameRate = {
        min: frameRate,
        max: frameRate
      };
    }

    if (constraints.video.hasOwnProperty('width')) {
      var width = constraints.video.width;

      if (isNaN(width) || width == 0) {
        logger.warn(LOG_PREFIX, "Width or height property has zero/NaN value, set default resolution 320x240");
        constraints.video.width = 320;
        constraints.video.height = 240;
      }
    }

    if (constraints.video.hasOwnProperty('height')) {
      var height = constraints.video.height;

      if (isNaN(height) || height == 0) {
        logger.warn(LOG_PREFIX, "Width or height property has zero/NaN value, set default resolution 320x240");
        constraints.video.width = 320;
        constraints.video.height = 240;
      }
    }
  }

  if (constraints.audio) {
    if (Flashphoner.isUsingTemasys()) {
      delete constraints.audio.deviceId;
    } // The WebRTC AEC implementation doesn't work well on stereophonic sound and makes mono on output


    if (constraints.audio.stereo) {
      constraints.audio.echoCancellation = false;
      constraints.audio.googEchoCancellation = false;
    }
  }

  return constraints;
} // TODO implement


var playFirstSound = function playFirstSound() {
  return true;
};

var playFirstVideo = function playFirstVideo() {
  return new Promise(function (resolve, reject) {
    resolve();
  });
};

module.exports = {
  createConnection: createConnection,
  getMediaAccess: getMediaAccess,
  releaseMedia: releaseMedia,
  listDevices: listDevices,
  playFirstSound: playFirstSound,
  playFirstVideo: playFirstVideo,
  available: available,
  configure: function configure(configuration) {
    extensionId = configuration.extensionId;
    defaultConstraints = configuration.constraints;
    logger = configuration.logger;
    logger.info(LOG_PREFIX, "Initialized");
  }
};

},{"./util":35,"es6-promise":2,"uuid/v1":12,"webrtc-adapter":13}],35:[function(require,module,exports){
'use strict';

module.exports = {
  isEmptyObject: function isEmptyObject(obj) {
    for (var name in obj) {
      return false;
    }

    return true;
  },

  /**
   * Copy values of object own properties to array.
   *
   * @param obj
   * @returns {Array}
   */
  copyObjectToArray: function copyObjectToArray(obj) {
    var ret = [];

    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        ret.push(obj[prop]);
      }
    }

    return ret;
  },

  /**
   * Copy src properties to dst object.
   * Will overwrite dst prop with src prop in case of dst prop exist.
   */
  copyObjectPropsToAnotherObject: function copyObjectPropsToAnotherObject(src, dst) {
    for (var prop in src) {
      if (src.hasOwnProperty(prop)) {
        dst[prop] = src[prop];
      }
    }
  },
  browser: function browser() {
    var browser;
    var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;
    if (isAndroid) browser = "Android";
    var isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isiOS) browser = "iOS"; // Opera 8.0+

    var isOpera = !!window.opr && !!opr.addons || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    if (isOpera) browser = "Opera"; // Firefox 1.0+

    var isFirefox = typeof InstallTrigger !== 'undefined';
    if (isFirefox) browser = "Firefox"; // At least Safari 3+: "[object HTMLElementConstructor]"

    var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    if (isSafari) browser = "Safari"; // Internet Explorer 6-11

    var isIE =
    /*@cc_on!@*/
    false || !!document.documentMode;
    if (isIE) browser = "IE"; // Edge 20+

    var isEdge = !isIE && !!window.StyleMedia;
    if (isEdge) browser = "Edge"; // Chrome 1+

    var isChrome = !!window.chrome && /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) && !/OPR/.test(navigator.userAgent);
    if (isChrome) browser = "Chrome";
    return browser;
  },
  processRtcStatsReport: function processRtcStatsReport(browser, report) {
    var result = {};

    if (browser == "chrome") {
      /**
       * Report types: googComponent, googCandidatePair, googCertificate, googLibjingleSession, googTrack, ssrc
       */
      var gotResult = false;

      if (report.type && report.type == "googCandidatePair") {
        //check if this is active pair
        if (report.googActiveConnection == "true") {
          gotResult = true;
        }
      }

      if (report.type && report.type == "ssrc") {
        gotResult = true;
      }

      if (gotResult) {
        for (var k in report) {
          if (report.hasOwnProperty(k)) {
            result[k] = report[k];
          }
        }
      }

      return result;
    } else if (browser == "firefox") {
      /**
       * RTCStatsReport http://mxr.mozilla.org/mozilla-central/source/dom/webidl/RTCStatsReport.webidl
       */
      if (report.type && (report.type == "outboundrtp" || report.type == "inboundrtp") && report.id.indexOf("rtcp") == -1) {
        result = {};

        for (var k in report) {
          if (report.hasOwnProperty(k)) {
            result[k] = report[k];
          }
        }
      }

      return result;
    } else {
      return result;
    }

    ;
  },
  Browser: {
    isIE: function isIE() {
      return (
        /*@cc_on!@*/
        false || !!document.documentMode
      );
    },
    isFirefox: function isFirefox() {
      return typeof InstallTrigger !== 'undefined';
    },
    isChrome: function isChrome() {
      return !!window.chrome && /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) && !/OPR/.test(navigator.userAgent);
    },
    isEdge: function isEdge() {
      return !isIE && !!window.StyleMedia;
    },
    isOpera: function isOpera() {
      return !!window.opr && !!opr.addons || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    },
    isiOS: function isiOS() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    },
    isSafari: function isSafari() {
      return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    },
    isAndroid: function isAndroid() {
      return navigator.userAgent.toLowerCase().indexOf("android") > -1;
    },
    isSafariWebRTC: function isSafariWebRTC() {
      return navigator.mediaDevices && Browser.isSafari();
    }
  },
  SDP: {
    matchPrefix: function matchPrefix(sdp, prefix) {
      var parts = sdp.trim().split('\n').map(function (line) {
        return line.trim();
      });
      return parts.filter(function (line) {
        return line.indexOf(prefix) === 0;
      });
    },
    writeFmtp: function writeFmtp(sdp, param, codec) {
      var sdpArray = sdp.split("\n");
      var i;

      for (i = 0; i < sdpArray.length; i++) {
        if (sdpArray[i].search(codec) != -1 && sdpArray[i].indexOf("a=rtpmap") == 0) {
          sdpArray[i] += "\na=fmtp:" + sdpArray[i].match(/[0-9]+/)[0] + " " + param + "\r";
        }
      } //normalize sdp after modifications


      var result = "";

      for (i = 0; i < sdpArray.length; i++) {
        if (sdpArray[i] != "") {
          result += sdpArray[i] + "\n";
        }
      }

      return result;
    }
  },
  logger: {
    init: function init(verbosity, enablePushLogs, customLogger, enableLogs) {
      switch (verbosity.toUpperCase()) {
        case "DEBUG":
          this.verbosity = 3;
          break;

        case "INFO":
          this.verbosity = 2;
          break;

        case "ERROR":
          this.verbosity = 0;
          break;

        case "WARN":
          this.verbosity = 1;
          break;

        case "TRACE":
          this.verbosity = 4;
          break;

        default:
          this.verbosity = 2;
      }

      ;

      this.date = function () {
        return new Date().toTimeString().split(" ")[0];
      };

      this.enablePushLogs = enablePushLogs;
      var delayedLogs = [];
      this.customLogger = customLogger;
      this.enableLogs = enableLogs;

      this.pushLogs = function (log) {
        if (this.wsConnection && this.enablePushLogs) {
          if (delayedLogs.length) {
            for (var i = 0; i < delayedLogs.length; i++) {
              this.wsConnection.send(JSON.stringify({
                message: "pushLogs",
                data: [{
                  logs: delayedLogs[i]
                }]
              }));
            }
          }

          delayedLogs = [];
          this.wsConnection.send(JSON.stringify({
            message: "pushLogs",
            data: [{
              logs: log
            }]
          }));
        } else {
          // Save logs to send it later
          delayedLogs.push(log);
        }
      };
    },
    info: function info(src, text) {
      if (!this.enableLogs) {
        return;
      }

      var prefix = this.date() + " INFO " + src + " - ";
      this.pushLogs(prefix + JSON.stringify(text) + '\n');

      if (this.verbosity >= 2) {
        if (this.customLogger != null) {
          this.customLogger.info(text);
        } else {
          console.log(prefix, text);
        }
      }
    },
    debug: function debug(src, text) {
      if (!this.enableLogs) {
        return;
      }

      var prefix = this.date() + " DEBUG " + src + " - ";
      this.pushLogs(prefix + JSON.stringify(text) + '\n');

      if (this.verbosity >= 3) {
        if (this.customLogger != null) {
          this.customLogger.debug(text);
        } else {
          console.log(prefix, text);
        }
      }
    },
    trace: function trace(src, text) {
      if (!this.enableLogs) {
        return;
      }

      var prefix = this.date() + " TRACE " + src + " - ";
      this.pushLogs(prefix + JSON.stringify(text) + '\n');

      if (this.verbosity >= 4) {
        if (this.customLogger != null) {
          this.customLogger.trace(text);
        } else {
          console.log(prefix, text);
        }
      }
    },
    warn: function warn(src, text) {
      if (!this.enableLogs) {
        return;
      }

      var prefix = this.date() + " WARN " + src + " - ";
      this.pushLogs(prefix + JSON.stringify(text) + '\n');

      if (this.verbosity >= 1) {
        if (this.customLogger != null) {
          this.customLogger.warn(text);
        } else {
          console.warn(prefix, text);
        }
      }
    },
    error: function error(src, text) {
      if (!this.enableLogs) {
        return;
      }

      var prefix = this.date() + " ERROR " + src + " - ";
      this.pushLogs(prefix + JSON.stringify(text) + '\n');

      if (this.verbosity >= 0) {
        if (this.customLogger != null) {
          this.customLogger.error(text);
        } else {
          console.error(prefix, text);
        }
      }
    },
    setEnableLogs: function setEnableLogs(enableLogs) {
      this.enableLogs = enableLogs;
    },
    setCustomLogger: function setCustomLogger(customLogger) {
      this.customLogger = customLogger;
    },
    setConnection: function setConnection(connection) {
      this.wsConnection = connection;
    },
    setPushLogs: function setPushLogs(pushLogs) {
      this.enablePushLogs = pushLogs;
    },
    setLevel: function setLevel(level) {
      switch (level.toUpperCase()) {
        case "DEBUG":
          this.verbosity = 3;
          break;

        case "INFO":
          this.verbosity = 2;
          break;

        case "ERROR":
          this.verbosity = 0;
          break;

        case "WARN":
          this.verbosity = 1;
          break;

        case "TRACE":
          this.verbosity = 4;
          break;

        default:
          this.verbosity = 2;
      }

      ;
    }
  },
  stripCodecs: function stripCodecs(sdp, codecs) {
    if (!codecs.length) return sdp;
    var sdpArray = sdp.split("\n");
    var codecsArray = codecs.split(","); //search and delete codecs line

    var pt = [];
    var i;

    for (var p = 0; p < codecsArray.length; p++) {
      console.log("Searching for codec " + codecsArray[p]);

      for (i = 0; i < sdpArray.length; i++) {
        if (sdpArray[i].search(new RegExp(codecsArray[p], 'i')) != -1 && sdpArray[i].indexOf("a=rtpmap") == 0) {
          console.log(codecsArray[p] + " detected");
          pt.push(sdpArray[i].match(/[0-9]+/)[0]);
          sdpArray[i] = "";
        }
      }
    }

    if (pt.length) {
      //searching for fmtp
      for (p = 0; p < pt.length; p++) {
        for (i = 0; i < sdpArray.length; i++) {
          if (sdpArray[i].search("a=fmtp:" + pt[p]) != -1 || sdpArray[i].search("a=rtcp-fb:" + pt[p]) != -1) {
            sdpArray[i] = "";
          }
        }
      } //delete entries from m= line


      for (i = 0; i < sdpArray.length; i++) {
        if (sdpArray[i].search("m=audio") != -1 || sdpArray[i].search("m=video") != -1) {
          var mLineSplitted = sdpArray[i].split(" ");
          var newMLine = "";

          for (var m = 0; m < mLineSplitted.length; m++) {
            if (pt.indexOf(mLineSplitted[m].trim()) == -1 || m <= 2) {
              newMLine += mLineSplitted[m];

              if (m < mLineSplitted.length - 1) {
                newMLine = newMLine + " ";
              }
            }
          }

          sdpArray[i] = newMLine;
        }
      }
    } //normalize sdp after modifications


    var result = "";

    for (i = 0; i < sdpArray.length; i++) {
      if (sdpArray[i] != "") {
        result += sdpArray[i] + "\n";
      }
    }

    return result;
  },
  getCurrentCodecAndSampleRate: function getCurrentCodecAndSampleRate(sdp, mediaType) {
    var rows = sdp.split("\n");
    var codecPt;

    for (var i = 0; i < rows.length; i++) {
      if (codecPt && rows[i].indexOf("a=rtpmap:" + codecPt) != -1) {
        var ret = {};
        ret.name = rows[i].split(" ")[1].split("/")[0];
        ret.sampleRate = rows[i].split(" ")[1].split("/")[1];
        return ret;
      } //WCS-2136. WebRTC statistics doesn't work for VP8


      if (rows[i].indexOf("m=" + mediaType) != -1) {
        codecPt = rows[i].split(" ")[3].trim();
      }
    }
  }
};

},{}],36:[function(require,module,exports){
'use strict';

var WSPlayer = require('./WSPlayer').WSPlayer;

var util = require('./util');

var WSPlayer_ = new WSPlayer();
var connections = {};
var receiverLocation = "./WSReceiver2.js";
var decoderLocation = "./video-worker2.js";
var DEFAULT_SDP = "v=0\r\n" + "o=- 1988962254 1988962254 IN IP4 0.0.0.0\r\n" + "c=IN IP4 0.0.0.0\r\n" + "t=0 0\r\n" + "a=sdplang:en\r\n" + "m=video 0 RTP/AVP 32\r\n" + "a=rtpmap:32 MPV/90000\r\n" + "a=recvonly\r\n" + "m=audio 0 RTP/AVP 0\r\n" + "a=rtpmap:0 PCMU/8000\r\n" + "a=recvonly\r\n";
var logger;
var LOG_PREFIX = "websocket";
var audioContext;

var createConnection = function createConnection(options, handlers) {
  return new Promise(function (resolve, reject) {
    var id = options.id;
    var display = options.display;
    var canvas = document.createElement("canvas");
    display.appendChild(canvas);
    canvas.id = id;

    var createOffer = function createOffer(options) {
      return new Promise(function (resolve, reject) {
        var o = {};
        o.sdp = DEFAULT_SDP;
        o.player = WSPlayer_;
        resolve(o);
      });
    };

    var setRemoteSdp = function setRemoteSdp(sdp) {
      return new Promise(function (resolve, reject) {
        resolve();
      });
    };

    var close = function close() {
      WSPlayer_.stop();

      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }

      delete connections[id];
    };

    var unmuteRemoteAudio = function unmuteRemoteAudio() {
      audioContext.resume();
    };

    var muteRemoteAudio = function muteRemoteAudio() {
      audioContext.suspend();
    };

    var isRemoteAudioMuted = function isRemoteAudioMuted() {
      if (audioContext.state == 'suspended') {
        return true;
      }

      return false;
    };

    var setVolume = function setVolume(volume) {
      WSPlayer_.setVolume(volume);
    };

    var getVolume = function getVolume() {
      if (WSPlayer_) {
        return WSPlayer_.getVolume();
      }

      return -1;
    };

    var fullScreen = function fullScreen() {
      if (canvas) {
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
          if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
          } else if (canvas.msRequestFullscreen) {
            canvas.msRequestFullscreen();
          } else if (canvas.mozRequestFullScreen) {
            canvas.mozRequestFullScreen();
          } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
        }
      }
    };

    try {
      var config = {};
      config.urlWsServer = options.mainUrl;
      config.token = options.authToken;
      config.receiverPath = receiverLocation;
      config.decoderPath = decoderLocation;
      config.streamId = id;
      config.api = handlers;
      config.canvas = canvas;
      config.videoWidth = 320;
      config.videoHeight = 240;
      config.startWithVideoOnly = false;
      config.keepLastFrame = false;
      var reinit = false;

      if (WSPlayer_.initialized) {
        reinit = true;
      }

      WSPlayer_.initLogger(0);
      WSPlayer_.init(config, audioContext, reinit);
    } catch (e) {
      reject(new Error('Failed to init stream receiver ' + e));
    }

    var exports = {};
    exports.createOffer = createOffer;
    exports.setRemoteSdp = setRemoteSdp;
    exports.close = close;
    exports.unmuteRemoteAudio = unmuteRemoteAudio;
    exports.muteRemoteAudio = muteRemoteAudio;
    exports.isRemoteAudioMuted = isRemoteAudioMuted;
    exports.setVolume = setVolume;
    exports.getVolume = getVolume;
    exports.fullScreen = fullScreen;
    connections[id] = exports;
    resolve(connections[id]);
  });
}; // return Promise(reject)


var getMediaAccess = function getMediaAccess() {
  return new Promise(function (resolve, reject) {
    reject(new Error("This provider doesn't support getMediaAccess"));
  });
};

var listDevices = function listDevices() {
  return new Promise(function (resolve, reject) {
    reject(new Error("This provider doesn't support listDevices"));
  });
}; // always false


var releaseMedia = function releaseMedia() {
  return false;
};

var playFirstSound = function playFirstSound(noise) {
  var audioBuffer = audioContext.createBuffer(1, 441, 44100);
  var output = audioBuffer.getChannelData(0);

  for (var i = 0; i < output.length; i++) {
    if (noise) {
      output[i] = Math.random() * 2 - 1;
    } else {
      output[i] = 0;
    }
  }

  var src = audioContext.createBufferSource();
  src.buffer = audioBuffer;
  src.connect(audioContext.destination);
  src.start(0);
};

var playFirstVideo = function playFirstVideo() {
  return new Promise(function (resolve, reject) {
    resolve();
  });
};
/**
 * Check WebSocket available
 *
 * @returns {boolean} WSPlayer available
 */


var available = function available(audioContext) {
  return audioContext ? true : false;
};

module.exports = {
  createConnection: createConnection,
  getMediaAccess: getMediaAccess,
  releaseMedia: releaseMedia,
  available: available,
  listDevices: listDevices,
  playFirstSound: playFirstSound,
  playFirstVideo: playFirstVideo,
  configure: function configure(configuration) {
    audioContext = configuration.audioContext;
    receiverLocation = configuration.receiverLocation || receiverLocation;
    decoderLocation = configuration.decoderLocation || decoderLocation;
    logger = configuration.logger;
    logger.info(LOG_PREFIX, "Initialized");
  }
};

},{"./WSPlayer":28,"./util":35}]},{},[31])(31)
});