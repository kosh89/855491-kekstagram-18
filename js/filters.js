'use strict';

(function () {
  var RANDOM_ARRAY_LENGTH = 10;
  var filtersButtonsElements = document.querySelectorAll('.img-filters__button');

  window.filters = {
    currentButtonBacklight: function (currentButton) {
      filtersButtonsElements.forEach(function (button) {
        button.classList.remove('img-filters__button--active');
      });
      currentButton.classList.add('img-filters__button--active');
    },

    onPopularButtonClick: function (picturesArray) {
      window.updatePictures(picturesArray);
    },

    onRandomButtonClick: function (picturesArray) {
      var arrayOfRandomIndexes = [];
      var arrayOfRandomPictures = [];

      while (arrayOfRandomIndexes.length < RANDOM_ARRAY_LENGTH) {
        var currentIndex = window.utils.getRandomInt(0, picturesArray.length - 1);

        if (arrayOfRandomIndexes.indexOf(currentIndex) === -1) {
          arrayOfRandomIndexes.push(currentIndex);
        } else {
          continue;
        }
      }

      for (var i = 0; i < arrayOfRandomIndexes.length; i++) {
        arrayOfRandomPictures.push(picturesArray[arrayOfRandomIndexes[i]]);
      }

      window.updatePictures(arrayOfRandomPictures);
    },

    onDiscussedButtonClick: function (picturesArray) {

      var arrayOfDiscussedPictures = picturesArray;
      arrayOfDiscussedPictures.sort(function (prevPic, nextPic) {
        return nextPic.comments.length - prevPic.comments.length;
      });

      window.updatePictures(arrayOfDiscussedPictures);
    }
  };
})();
