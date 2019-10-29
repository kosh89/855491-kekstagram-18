'use strict';

(function () {
  //  работа с окном полноэкранного просмотра
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureCloseButton = document.querySelector('#picture-cancel');

  var onBigPictureEscPress = function (evt) {
    if (evt.keyCode === window.utils.ESC_KEYCODE) {
      onBigPictureClose();
    }
  };

  window.showBigPicture = function () {
    bigPicture.classList.remove('hidden');
    document.addEventListener('keydown', onBigPictureEscPress);
  };

  var onBigPictureClose = function () {
    bigPicture.classList.add('hidden');
    document.removeEventListener('keydown', onBigPictureEscPress);
  };

  bigPictureCloseButton.addEventListener('click', onBigPictureClose);
})();
