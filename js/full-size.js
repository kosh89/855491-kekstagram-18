'use strict';

//  работа с окном полноэкранного просмотра
var bigPicture = document.querySelector('.big-picture');
var bigPictureCloseButton = document.querySelector('#picture-cancel');

var onBigPictureEscPress = function (evt) {
  if (evt.keyCode === window.utils.ESC_KEYCODE) {
    closeBigPicture();
  }
};

window.showBigPicture = function () {
  bigPicture.classList.remove('hidden');
  document.addEventListener('keydown', onBigPictureEscPress);
};

var closeBigPicture = function () {
  bigPicture.classList.add('hidden');
  document.removeEventListener('keydown', onBigPictureEscPress);
};

bigPictureCloseButton.addEventListener('click', closeBigPicture);
