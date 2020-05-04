/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./custom-sw.js":
/*!**********************!*\
  !*** ./custom-sw.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* eslint-disable no-restricted-globals */\nvar cacheName = 'MUSE_CACHE';\nself.addEventListener('install', function (event) {\n  event.waitUntil(caches.open(cacheName).then(function (cache) {\n    return cache.addAll(['/image/icon/badge.svg', '/image/icon/alarm.svg', '/image/icon/plus.svg', '/image/icon/palate.svg', '/image/icon/picture.svg', '/image/icon/archive.svg', '/image/icon/trash.svg', '/image/icon/options.svg', '/image/icon/undo.svg', '/image/icon/redo.svg', '/image/icon/pin.svg', '/image/icon/pin_fill.svg', '/image/icon/close.svg', '/image/icon/search.svg', '/image/icon/add_contact.svg', '/image/icon/refresh.svg', '/image/icon/settings.svg', '/image/icon/hamburger.svg', '/image/icon/bulb.svg', '/image/icon/bell.svg', '/image/icon/checkbox.svg', '/image/icon/checkbox_notchecked.svg', '/image/icon/profile.svg', '/image/icon/left_arrow.svg', '/image/icon/peeker.png', '/image/icon/repeat.svg', '/image/icon/caret_right.svg', '/image/icon/trash_white.svg', '/image/icon/left_arrow_white.svg', '/image/icon/note.svg']);\n  }));\n});\nself.addEventListener('fetch', function (event) {\n  event.respondWith(caches.match(event.request).then(function (response) {\n    if (response) {\n      return response;\n    } else {\n      var url = event.request.url;\n      var res = fetch(event.request);\n\n      if (url.includes('https://muses-api.herokuapp.com/graphql') || url.includes('https://graph.facebook.com/') || url.includes('https://lh3.googleusercontent.com/')) {\n        caches.open(cacheName).then(function (cache) {\n          return cache.add(url);\n        });\n      }\n\n      return res;\n    }\n  }));\n});\n\n//# sourceURL=webpack:///./custom-sw.js?");

/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./custom-sw.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./custom-sw.js */\"./custom-sw.js\");\n\n\n//# sourceURL=webpack:///multi_./custom-sw.js?");

/***/ })

/******/ });