'use strict';

(function () {
  //  работа с окном полноэкранного просмотра
  var bigPictureElement = document.querySelector('.big-picture');
  var bigPictureCloseButtonElement = document.querySelector('#picture-cancel');

  var onBigPictureEscPress = function (evt) {
    if (evt.keyCode === window.utils.ESC_KEYCODE) {
      onPictureCloseButtonClick();
    }
  };

  window.showBigPicture = function () {
    bigPictureElement.classList.remove('hidden');
    document.addEventListener('keydown', onBigPictureEscPress);
  };

  var onPictureCloseButtonClick = function () {
    bigPictureElement.classList.add('hidden');
    document.removeEventListener('keydown', onBigPictureEscPress);
  };

  bigPictureCloseButtonElement.addEventListener('click', onPictureCloseButtonClick);
})();
