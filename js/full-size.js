'use strict';

(function () {
  //  работа с окном полноэкранного просмотра
  var bigPictureElement = document.querySelector('.big-picture');
  var bigPictureCloseButtonElement = document.querySelector('#picture-cancel');

  var closeBigPicture = function () {
    bigPictureElement.classList.add('hidden');
    document.removeEventListener('keydown', onBigPictureEscPress);
  };

  var onBigPictureEscPress = function (evt) {
    if (evt.keyCode === window.utils.ESC_KEYCODE) {
      closeBigPicture();
    }
  };

  var onPictureCloseButtonClick = function () {
    closeBigPicture();
  };

  window.showBigPicture = function () {
    bigPictureElement.classList.remove('hidden');
    document.addEventListener('keydown', onBigPictureEscPress);
  };

  bigPictureCloseButtonElement.addEventListener('click', onPictureCloseButtonClick);
})();
