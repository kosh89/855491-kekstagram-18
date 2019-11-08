'use strict';

(function () {
  var PIN_LEFT_EXTREME_POSITION = 0;
  var PIN_RIGHT_EXTREME_POSITION = 453;
  var PIN_POSITION_COEFFICIENT = 4.53;
  var CSS_FILTER_COEFFICIENT = 33.3;
  var SCALE_STEP = 25;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  //  Загрузка изображения, показ окна редактирования
  var uploadFileElement = document.querySelector('#upload-file');
  var editFormElement = document.querySelector('.img-upload__overlay');
  var editFormCloseButtonElement = editFormElement.querySelector('#upload-cancel');
  var imgUploadFormElement = document.querySelector('.img-upload__form');
  var succesTemplateElement = document.querySelector('#success').content.querySelector('.success');

  var effectLevelSliderElement = document.querySelector('.effect-level');
  var effectLevelValueElement = document.querySelector('.effect-level__value');
  var effectLevelPinElement = document.querySelector('.effect-level__pin');
  var effectLelvelDepthElement = document.querySelector('.effect-level__depth');
  var effectsElement = document.querySelector('.effects');
  var currentEffectElement = document.querySelector('#effect-none');

  var scaleControlSmallerElement = document.querySelector('.scale__control--smaller');
  var scaleControlBiggerElement = document.querySelector('.scale__control--bigger');
  var scaleControlValueElement = document.querySelector('.scale__control--value');
  var previewImageElement = document.querySelector('.img-upload__preview img');

  var onEditFormEscPress = function (evt) {
    if (evt.keyCode === window.utils.ESC_KEYCODE) {
      if (evt.target.classList.contains('text__hashtags') || evt.target.classList.contains('text__description')) {
        return;
      }
      onEditFormClose();
    }
  };

  var hideEffectLevelSlider = function () {
    effectLevelSliderElement.classList.add('visually-hidden');
  };

  var showEffectLevelSlider = function () {
    effectLevelSliderElement.classList.remove('visually-hidden');
  };

  //  сбрасываем масштаб
  var resetScale = function () {
    scaleControlValueElement.value = '100%';
    setScaleToPreviewImage();
  };

  //  сбрасываем уровень интенсивности эффекта
  var resetEffectLevel = function () {
    effectLevelValueElement.value = 100;
    effectLevelPinElement.style.left = '100%';
    effectLelvelDepthElement.style.width = '100%';
  };

  //  сбросить текущий эффект
  var resetCurrentEffect = function () {
    currentEffectElement = document.querySelector('#effect-none');
    setCurrentFilterToPreviewImage();
  };

  //  сбрасываем класс превью-картинке
  var resetClassToPreviewImage = function () {
    previewImageElement.className = '';
  };

  //  скрываем/показываем слайдер интенсивности эффекта в зависимости от выбранного эффекта
  var toggleEffectLevelSlider = function (evt) {
    if (evt.target.value === 'none') {
      hideEffectLevelSlider();
    } else {
      showEffectLevelSlider();
    }
  };

  //  очищаем value загруженного файла
  var clearUploadFile = function () {
    uploadFileElement.value = '';
  };

  //  загрузка новой фотографии
  uploadFileElement.addEventListener('change', function () {
    var file = uploadFileElement.files[0];
    var fileName = file.name.toLowerCase();

    if (file) {
      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          previewImageElement.src = reader.result;
        });

        reader.readAsDataURL(file);
      }
    }
  });

  var onEditFormShow = function () {
    editFormElement.classList.remove('hidden');
    document.addEventListener('keydown', onEditFormEscPress);
    resetScale();
    resetEffectLevel();
    resetCurrentEffect();
    resetClassToPreviewImage();
    hideEffectLevelSlider();
  };

  var onEditFormClose = function () {
    editFormElement.classList.add('hidden');
    document.removeEventListener('keydown', onEditFormEscPress);
    clearUploadFile();
  };

  uploadFileElement.addEventListener('change', onEditFormShow);

  editFormCloseButtonElement.addEventListener('click', onEditFormClose);

  //  получить интенсивность в зависимости от положения ползунка
  var getEffectIntensity = function () {
    return parseInt(effectLevelPinElement.style.left, 10) / PIN_POSITION_COEFFICIENT;
  };

  //  увеличить масштаб
  var scaleUp = function () {
    if (parseInt(scaleControlValueElement.value, 10) < 100) {
      scaleControlValueElement.value = parseInt(scaleControlValueElement.value, 10) + SCALE_STEP + '%';
    }
  };

  //  уменьшить масштаб
  var scaleDown = function () {
    if (parseInt(scaleControlValueElement.value, 10) > 25) {
      scaleControlValueElement.value = parseInt(scaleControlValueElement.value, 10) - SCALE_STEP + '%';
    }
  };

  //  применить масштаб к превью-картинке
  var setScaleToPreviewImage = function () {
    previewImageElement.style.transform = 'scale(' + parseInt(scaleControlValueElement.value, 10) / 100 + ')';
  };

  scaleControlSmallerElement.addEventListener('click', function () {
    scaleDown();
    setScaleToPreviewImage();
  });

  scaleControlBiggerElement.addEventListener('click', function () {
    scaleUp();
    setScaleToPreviewImage();
  });

  //  меняем класс картинки в зависимости от выбранного эффекта
  var changeClassToPreviewImage = function (evt) {
    previewImageElement.className = 'effects__preview--' + evt.target.value;
  };

  //  в зависимости от выбранного эффекта определяем используемый css-фильтр
  var getCurrentCssFilter = function () {
    var currentCss = 'none';

    switch (currentEffectElement.value) {
      case ('chrome'):
        currentCss = 'grayscale(' + getEffectIntensity() / 100 + ')';
        break;
      case ('sepia'):
        currentCss = 'sepia(' + getEffectIntensity() / 100 + ')';
        break;
      case ('marvin'):
        currentCss = 'invert(' + getEffectIntensity() + '%)';
        break;
      case ('phobos'):
        currentCss = 'blur(' + getEffectIntensity() / CSS_FILTER_COEFFICIENT + 'px)';
        break;
      case ('heat'):
        currentCss = 'brightness(' + getEffectIntensity() / CSS_FILTER_COEFFICIENT + ')';
        break;
      default:
        currentCss = '';
        break;
    }

    return currentCss;
  };

  //  применяем css-фильтр к превью-картинке
  var setCurrentFilterToPreviewImage = function () {
    previewImageElement.style.filter = getCurrentCssFilter();
  };

  //  обработка изменения положения ползунка интенсивности эффекта
  var startX = 0;

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shiftX = startX - moveEvt.clientX;
    startX = moveEvt.clientX;

    var pinNewPosition = effectLevelPinElement.offsetLeft - shiftX;

    if (pinNewPosition < PIN_LEFT_EXTREME_POSITION || pinNewPosition > PIN_RIGHT_EXTREME_POSITION) {
      return;
    } else {
      effectLevelPinElement.style.left = pinNewPosition + 'px';
    }

    setCurrentFilterToPreviewImage();
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mousemove', onMouseUp);
  };

  effectLevelPinElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    startX = evt.clientX;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  //  делегирование
  effectsElement.addEventListener('change', function (evt) {
    resetCurrentEffect();
    currentEffectElement = document.querySelector('#effect-' + evt.target.value);
    toggleEffectLevelSlider(evt);
    changeClassToPreviewImage(evt);
    resetEffectLevel();
  });

  //  работа с окном успешной отправки данных на сервер
  var successItem = succesTemplateElement.cloneNode(true);
  successItem.style.display = 'none';
  document.querySelector('main').insertAdjacentElement('afterbegin', successItem);

  var successButtonElement = successItem.querySelector('.success__button');

  var onSuccessMessageClose = function () {
    successItem.style.display = 'none';
    document.removeEventListener('keydown', onSuccessMessageEscPress);
  };

  var onSuccessMessageEscPress = function (evt) {
    if (evt.keyCode === window.utils.ESC_KEYCODE) {
      onSuccessMessageClose();
    }
  };

  successButtonElement.addEventListener('click', onSuccessMessageClose);
  successItem.addEventListener('click', onSuccessMessageClose);

  var onUploadSuccess = function () {
    onEditFormClose();

    successItem.style.display = 'flex';

    document.addEventListener('keydown', onSuccessMessageEscPress);
  };

  //  отправка данных на сервер
  imgUploadFormElement.addEventListener('submit', function (evt) {
    evt.preventDefault();

    window.backend.save(new FormData(imgUploadFormElement), onUploadSuccess, window.backend.onServerRequestError);
  });
})();
