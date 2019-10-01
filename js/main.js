'use strict';

var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var picturesList = document.querySelector('.pictures');

var bigPicture = document.querySelector('.big-picture');
var bigPictureImg = document.querySelector('.big-picture__img img');
var likesCount = document.querySelector('.likes-count');
var commentsCountBlock = document.querySelector('.social__comment-count');
var commentsCount = document.querySelector('.comments-count');
var socialComments = document.querySelector('.social__comments');
var socialCaption = document.querySelector('.social__caption');
var commentsLoader = document.querySelector('.comments-loader');

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var generatePicturesContentArray = function () {
  var result = [];
  var ITEMS_QUANTITY = 25;
  var names = ['Олег', 'Сергей', 'Ольга', 'Катя', 'Денис', 'Андрей'];
  var commentsTemplates = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  for (var i = 1; i <= ITEMS_QUANTITY; i++) {
    var tempObject = {};

    tempObject.url = 'photos/' + i + '.jpg';
    tempObject.description = 'Описание фотографии';
    tempObject.likes = getRandomInt(15, 200);
    tempObject.comments = [];

    for (var k = 0; k < getRandomInt(1, 15); k++) {
      var tempCommentObject = {};
      tempCommentObject.avatar = 'img/avatar-' + getRandomInt(1, 6) + '.svg';
      tempCommentObject.message = commentsTemplates[getRandomInt(0, commentsTemplates.length - 1)];
      tempCommentObject.name = names[getRandomInt(0, names.length - 1)];

      tempObject.comments.push(tempCommentObject);
    }

    result.push(tempObject);
  }

  return result;
};

var picturesContent = generatePicturesContentArray();

var renderPictures = function (pictureObject) {
  var pictureItem = pictureTemplate.cloneNode(true);

  pictureItem.querySelector('.picture__img').src = pictureObject.url;
  pictureItem.querySelector('.picture__likes').textContent = pictureObject.likes;
  pictureItem.querySelector('.picture__comments').textContent = pictureObject.comments.length;

  //  формируем строку с комментариями
  var getCommentsHTML = function (comments) {
    var commentsString = '';

    for (var i = 0; i < comments.length; i++) {
      commentsString += '<li class="social__comment"><img class="social__picture" src=' + comments[i].avatar + ' alt=' + comments[i].name + ' width="35" height="35"> <p class="social__text">' + comments[i].message + '</p></li>';
    }

    return commentsString;
  };

  //  заполняем картинку данными из объекта картинки
  var fillPictureItemByData = function () {
    bigPictureImg.src = pictureObject.url;
    likesCount.textContent = pictureObject.likes;
    commentsCount.textContent = pictureObject.comments.length;
    socialCaption.textContent = pictureObject.description;

    //  очищаем комментарий, который указан в разметке
    socialComments.textContent = '';

    //  заполняем своими комментариями
    socialComments.innerHTML = getCommentsHTML(pictureObject.comments);

    commentsCountBlock.classList.add('visually-hidden');
    commentsLoader.classList.add('visually-hidden');

    showBigPicture();
  };

  //  при клике на картинку показываем её на весь экран и заполняем данными из объекта картинки
  pictureItem.addEventListener('click', fillPictureItemByData);

  return pictureItem;
};

var createPictureNodes = function (block, array) {
  for (var i = 0; i < array.length; i++) {
    block.appendChild(renderPictures(array[i]));
  }
};

var fragment = document.createDocumentFragment();

createPictureNodes(fragment, picturesContent);

picturesList.appendChild(fragment);

//  работа с окном полноэкранного просмотра
var bigPictureCloseButton = document.querySelector('#picture-cancel');

var onBigPictureEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeBigPicture();
  }
};

var showBigPicture = function () {
  bigPicture.classList.remove('hidden');
  document.addEventListener('keydown', onBigPictureEscPress);
};

var closeBigPicture = function () {
  bigPicture.classList.add('hidden');
  document.removeEventListener('keydown', onBigPictureEscPress);
};

bigPictureCloseButton.addEventListener('click', closeBigPicture);

//  Загрузка изображения, показ окна редактирования
var uploadFile = document.querySelector('#upload-file');
var editForm = document.querySelector('.img-upload__overlay');
var editFormCloseButton = editForm.querySelector('#upload-cancel');
var ESC_KEYCODE = 27;

var effectLevelSlider = document.querySelector('.effect-level');
var effectLevelValue = document.querySelector('.effect-level__value');
var effectLevelPin = document.querySelector('.effect-level__pin');
var effectLelvelDepth = document.querySelector('.effect-level__depth');
var effects = document.querySelector('.effects');
var CSS_FILTER_COEFFICIENT = 33.3;
var currentEffect = document.querySelector('#effect-none');

var scaleControlSmaller = document.querySelector('.scale__control--smaller');
var scaleControlBigger = document.querySelector('.scale__control--bigger');
var scaleControlValue = document.querySelector('.scale__control--value');
var SCALE_STEP = 25;
var previewImage = document.querySelector('.img-upload__preview img');

var onEditFormEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
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
  /* setCurrentFilterToPreviewImage(); */
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
  return parseInt(effectLevelPin.style.left, 10);
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
    case ('none'):
      currentCss = '';
      break;
  }

  return currentCss;
};

//  применяем css-фильтр к превью-картинке
var setCurrentFilterToPreviewImage = function () {
  previewImage.style.filter = getCurrentCssFilter();
};

effectLevelPin.addEventListener('mouseup', setCurrentFilterToPreviewImage);

//  делегирование
effects.addEventListener('change', function (evt) {
  resetCurrentEffect();
  currentEffect = document.querySelector('#effect-' + evt.target.value);
  toggleEffectLevelSlider(evt);
  changeClassToPreviewImage(evt);
  resetEffectLevel();
});

//  валидация хэштегов
var hashtagField = document.querySelector('.text__hashtags');
var textDescription = document.querySelector('.text__description');

//  удаление пустых элементов массива
var deleteEmptyElements = function (array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === '') {
      array.splice(i, 1);
      i--;
    }
  }
};

//  хэш-тег начинается с символа # (решётка)
var isHashSymbolFirst = function (element) {
  if (element[0] === '#') {
    return true;
  }

  return false;
};

//  хеш-тег не может состоять только из одной решётки;
var isSingleHashSymbol = function (element) {
  if (element === '#') {
    return true;
  }

  return false;
};

//  один и тот же хэш-тег не может быть использован дважды
var isSimilarHashtags = function (array) {
  var tempArray = [];
  for (var i = 0; i < array.length; i++) {
    var arrayImem = array[i].toLowerCase();
    if (tempArray.indexOf(arrayImem) !== -1) {
      return true;
    }

    tempArray.push(arrayImem);
  }

  return false;
};

//  нельзя указать больше пяти хэш-тегов
var isMoreThanFive = function (array) {
  if (array.length > 5) {
    return true;
  }

  return false;
};

//  максимальная длина одного хэш-тега 20 символов, включая решётку
var isMoreThanTwentySymbols = function (element) {
  if (element.length > 20) {
    return true;
  }

  return false;
};

//  когда поле ввода хэштега/комментария в фокусе, то ESC не закрывает форму
hashtagField.addEventListener('focus', function () {
  document.removeEventListener('keydown', onEditFormEscPress);
});

textDescription.addEventListener('focus', function () {
  document.removeEventListener('keydown', onEditFormEscPress);
});

//  Возвращаем обработчик нажатия ESC, когда поле ввода хэштега/комментария теряет фокус
hashtagField.addEventListener('blur', function () {
  document.addEventListener('keydown', onEditFormEscPress);
});

textDescription.addEventListener('blur', function () {
  document.addEventListener('keydown', onEditFormEscPress);
});

hashtagField.addEventListener('invalid', function () {
  if (!hashtagField.validity.valid) {
    hashtagField.setCustomValidity(hashtagField.validationMessage);
  }
});

hashtagField.addEventListener('input', function () {
  var arrayOfHashtags = hashtagField.value.split(' ');
  deleteEmptyElements(arrayOfHashtags);

  for (var i = 0; i < arrayOfHashtags.length; i++) {
    if (!isHashSymbolFirst(arrayOfHashtags[i])) {
      hashtagField.setCustomValidity('Хэштег должен начинаться с #');
      return;
    } else if (isSingleHashSymbol(arrayOfHashtags[i])) {
      hashtagField.setCustomValidity('Хэштег не может состоять из одного симовла #');
      return;
    } else if (isSimilarHashtags(arrayOfHashtags)) {
      hashtagField.setCustomValidity('Хэштеги не должны повторяться');
      return;
    } else if (isMoreThanFive(arrayOfHashtags)) {
      hashtagField.setCustomValidity('Должно быть не более 5 хэштегов');
      return;
    } else if (isMoreThanTwentySymbols(arrayOfHashtags[i])) {
      hashtagField.setCustomValidity('Максимальная длина хэштега 20 символов');
      return;
    } else {
      hashtagField.setCustomValidity('');
    }
  }
});
