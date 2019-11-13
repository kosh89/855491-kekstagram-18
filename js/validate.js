'use strict';

(function () {
  var MAX_HASHTAGS_COUNT = 5;
  var MAX_HASHTAG_LENGTH = 20;

  //  валидация хэштегов
  var hashtagFieldElement = document.querySelector('.text__hashtags');

  //  хэш-тег начинается с символа # (решётка)
  var isHashSymbolFirst = function (element) {
    return element[0] === '#';
  };

  //  хеш-тег не может состоять только из одной решётки;
  var isSingleHashSymbol = function (element) {
    return element === '#';
  };

  //  один и тот же хэш-тег не может быть использован дважды
  var isSimilarHashtags = function (array) {
    var tempArray = [];
    for (var i = 0; i < array.length; i++) {
      var arrayItem = array[i].toLowerCase();
      if (tempArray.indexOf(arrayItem) !== -1) {
        return true;
      }

      tempArray.push(arrayItem);
    }

    return false;
  };

  //  нельзя указать больше пяти хэш-тегов
  var isMoreThanMaxCount = function (array) {
    return array.length > MAX_HASHTAGS_COUNT;
  };

  //  максимальная длина одного хэш-тега 20 символов, включая решётку
  var isMoreThanMaxLength = function (element) {
    return element.length > MAX_HASHTAG_LENGTH;
  };

  hashtagFieldElement.addEventListener('invalid', function () {
    if (!hashtagFieldElement.validity.valid) {
      hashtagFieldElement.setCustomValidity(hashtagFieldElement.validationMessage);
    }
  });

  hashtagFieldElement.addEventListener('input', function () {
    var hashtags = hashtagFieldElement.value.split(' ');

    //  удаляем пустые элементы
    hashtags = hashtags.filter(function (item) {
      return !!item;
    });

    for (var i = 0; i < hashtags.length; i++) {
      if (!isHashSymbolFirst(hashtags[i])) {
        hashtagFieldElement.setCustomValidity('Хэштег должен начинаться с #');
        return;
      } else if (isSingleHashSymbol(hashtags[i])) {
        hashtagFieldElement.setCustomValidity('Хэштег не может состоять из одного симовла #');
        return;
      } else if (isSimilarHashtags(hashtags)) {
        hashtagFieldElement.setCustomValidity('Хэштеги не должны повторяться');
        return;
      } else if (isMoreThanMaxCount(hashtags)) {
        hashtagFieldElement.setCustomValidity('Должно быть не более 5 хэштегов');
        return;
      } else if (isMoreThanMaxLength(hashtags[i])) {
        hashtagFieldElement.setCustomValidity('Максимальная длина хэштега 20 символов');
        return;
      } else {
        hashtagFieldElement.setCustomValidity('');
      }
    }
  });
})();
