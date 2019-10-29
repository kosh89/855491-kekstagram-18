'use strict';

(function () {
  //  валидация хэштегов
  var hashtagFieldElement = document.querySelector('.text__hashtags');

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

  hashtagFieldElement.addEventListener('invalid', function () {
    if (!hashtagFieldElement.validity.valid) {
      hashtagFieldElement.setCustomValidity(hashtagFieldElement.validationMessage);
    }
  });

  hashtagFieldElement.addEventListener('input', function () {
    var arrayOfHashtags = hashtagFieldElement.value.split(' ');
    deleteEmptyElements(arrayOfHashtags);

    for (var i = 0; i < arrayOfHashtags.length; i++) {
      if (!isHashSymbolFirst(arrayOfHashtags[i])) {
        hashtagFieldElement.setCustomValidity('Хэштег должен начинаться с #');
        return;
      } else if (isSingleHashSymbol(arrayOfHashtags[i])) {
        hashtagFieldElement.setCustomValidity('Хэштег не может состоять из одного симовла #');
        return;
      } else if (isSimilarHashtags(arrayOfHashtags)) {
        hashtagFieldElement.setCustomValidity('Хэштеги не должны повторяться');
        return;
      } else if (isMoreThanFive(arrayOfHashtags)) {
        hashtagFieldElement.setCustomValidity('Должно быть не более 5 хэштегов');
        return;
      } else if (isMoreThanTwentySymbols(arrayOfHashtags[i])) {
        hashtagFieldElement.setCustomValidity('Максимальная длина хэштега 20 символов');
        return;
      } else {
        hashtagFieldElement.setCustomValidity('');
      }
    }
  });
})();
