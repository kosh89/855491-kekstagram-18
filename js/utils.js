'use strict';

(function () {
  window.utils = {
    ESC_KEYCODE: 27,
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  };
})();
