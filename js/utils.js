'use strict';

(function () {
  window.utils = {
    ESC_KEYCODE: 27,

    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    cloneArray: function (array) {
      return JSON.parse(JSON.stringify(array));
    },

    debounce: function (cb, time) {
      var lastTimeout = null;

      return function () {
        var parameters = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          cb.apply(null, parameters);
        }, time);
      };
    }
  };
})();
