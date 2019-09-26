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

//  показываем первую картинку на весь экран

//  временно отключаем
/* bigPicture.classList.remove('hidden'); */

bigPictureImg.src = picturesContent[0].url;
likesCount.textContent = picturesContent[0].likes;
commentsCount.textContent = picturesContent[0].comments.length;

//  очищаем комментарии из разметки
socialComments.textContent = '';

for (var i = 0; i < picturesContent[0].comments.length; i++) {
  socialComments.innerHTML += '<li class="social__comment"><img class="social__picture" src=' + picturesContent[0].comments[i].avatar + ' alt=' + picturesContent[0].comments[i].name + ' width="35" height="35"> <p class="social__text">' + picturesContent[0].comments[i].message + '</p></li>';
}

socialCaption.textContent = picturesContent[0].description;
commentsCountBlock.classList.add('visually-hidden');
commentsLoader.classList.add('visually-hidden');

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

editFormCloseButton.addEventListener('click', function () {
  closeEditForm();
});

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
