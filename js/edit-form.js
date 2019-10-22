'use strict';

(function () {
  var PIN_LEFT_EXTREME_POSITION = 0;
  var PIN_RIGHT_EXTREME_POSITION = 453;
  var PIN_POSITION_COEFFICIENT = 4.53;
  var CSS_FILTER_COEFFICIENT = 33.3;
  var SCALE_STEP = 25;

  //  Загрузка изображения, показ окна редактирования
  var uploadFile = document.querySelector('#upload-file');
  var editForm = document.querySelector('.img-upload__overlay');
  var editFormCloseButton = editForm.querySelector('#upload-cancel');

  var effectLevelSlider = document.querySelector('.effect-level');
  var effectLevelValue = document.querySelector('.effect-level__value');
  var effectLevelPin = document.querySelector('.effect-level__pin');
  var effectLelvelDepth = document.querySelector('.effect-level__depth');
  var effects = document.querySelector('.effects');
  var currentEffect = document.querySelector('#effect-none');

  var scaleControlSmaller = document.querySelector('.scale__control--smaller');
  var scaleControlBigger = document.querySelector('.scale__control--bigger');
  var scaleControlValue = document.querySelector('.scale__control--value');
  var previewImage = document.querySelector('.img-upload__preview img');

  var onEditFormEscPress = function (evt) {
    if (evt.keyCode === window.utils.ESC_KEYCODE) {
      if (evt.target.classList.contains('text__hashtags') || evt.target.classList.contains('text__description')) {
        return;
      }
      closeEditForm();
    }
  };

  var hideEffectLevelSlider = function () {
    effectLevelSlider.classList.add('visually-hidden');
  };

  var showEffectLevelSlider = function () {
    effectLevelSlider.classList.remove('visually-hidden');
  };

  //  сбрасываем масштаб
  var resetScale = function () {
    scaleControlValue.value = '100%';
    setScaleToPreviewImage();
  };

  //  сбрасываем уровень интенсивности эффекта
  var resetEffectLevel = function () {
    effectLevelValue.value = 100;
    effectLevelPin.style.left = '100%';
    effectLelvelDepth.style.width = '100%';
  };

  //  сбросить текущий эффект
  var resetCurrentEffect = function () {
    currentEffect = document.querySelector('#effect-none');
    setCurrentFilterToPreviewImage();
  };

  //  сбрасываем класс превью-картинке
  var resetClassToPreviewImage = function () {
    previewImage.className = '';
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
    uploadFile.value = '';
  };

  var showEditForm = function () {
    editForm.classList.remove('hidden');
    document.addEventListener('keydown', onEditFormEscPress);
    resetScale();
    resetEffectLevel();
    resetCurrentEffect();
    resetClassToPreviewImage();
    hideEffectLevelSlider();
  };

  var closeEditForm = function () {
    editForm.classList.add('hidden');
    document.removeEventListener('keydown', onEditFormEscPress);
    clearUploadFile();
  };

  uploadFile.addEventListener('change', showEditForm);

  editFormCloseButton.addEventListener('click', closeEditForm);

  //  получить интенсивность в зависимости от положения ползунка
  var getEffectIntensity = function () {
    return parseInt(effectLevelPin.style.left, 10) / PIN_POSITION_COEFFICIENT;
  };

  //  увеличить масштаб
  var scaleUp = function () {
    if (parseInt(scaleControlValue.value, 10) < 100) {
      scaleControlValue.value = parseInt(scaleControlValue.value, 10) + SCALE_STEP + '%';
    }
  };

  //  уменьшить масштаб
  var scaleDown = function () {
    if (parseInt(scaleControlValue.value, 10) > 25) {
      scaleControlValue.value = parseInt(scaleControlValue.value, 10) - SCALE_STEP + '%';
    }
  };

  //  применить масштаб к превью-картинке
  var setScaleToPreviewImage = function () {
    previewImage.style.transform = 'scale(' + parseInt(scaleControlValue.value, 10) / 100 + ')';
  };

  scaleControlSmaller.addEventListener('click', function () {
    scaleDown();
    setScaleToPreviewImage();
  });

  scaleControlBigger.addEventListener('click', function () {
    scaleUp();
    setScaleToPreviewImage();
  });

  //  меняем класс картинки в зависимости от выбранного эффекта
  var changeClassToPreviewImage = function (evt) {
    previewImage.className = 'effects__preview--' + evt.target.value;
  };

  //  в зависимости от выбранного эффекта определяем используемый css-фильтр
  var getCurrentCssFilter = function () {
    var currentCss = 'none';

    switch (currentEffect.value) {
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
    previewImage.style.filter = getCurrentCssFilter();
  };

  //  обработка изменения положения ползунка интенсивности эффекта
  var startX = 0;

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shiftX = startX - moveEvt.clientX;
    startX = moveEvt.clientX;

    var pinNewPosition = effectLevelPin.offsetLeft - shiftX;

    if (pinNewPosition > PIN_LEFT_EXTREME_POSITION && pinNewPosition < PIN_RIGHT_EXTREME_POSITION) {
      effectLevelPin.style.left = pinNewPosition + 'px';
    } else {
      return;
    }

    setCurrentFilterToPreviewImage();
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mousemove', onMouseUp);
  };

  effectLevelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    startX = evt.clientX;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  //  делегирование
  effects.addEventListener('change', function (evt) {
    resetCurrentEffect();
    currentEffect = document.querySelector('#effect-' + evt.target.value);
    toggleEffectLevelSlider(evt);
    changeClassToPreviewImage(evt);
    resetEffectLevel();
  });
})();
