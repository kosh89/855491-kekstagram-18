'use strict';

(function () {
  var RANDOM_ARRAY_LENGTH = 10;
  var ACTIVE_BUTTON_CLASS = 'img-filters__button--active';

  var currentButtonBacklight = function (newActiveButton) {
    var currentActiveButtonElement = document.querySelector('.' + ACTIVE_BUTTON_CLASS);
    currentActiveButtonElement.classList.toggle(ACTIVE_BUTTON_CLASS);

    newActiveButton.classList.add(ACTIVE_BUTTON_CLASS);
  };

  window.filters = {
    onPopularButtonClick: function (picturesArray, button) {
      window.updatePictures(picturesArray);
      currentButtonBacklight(button);
    },

    onRandomButtonClick: function (picturesArray, button) {
      var arrayOfRandomIndexes = [];
      var arrayOfRandomPictures = [];

      while (arrayOfRandomIndexes.length < RANDOM_ARRAY_LENGTH) {
        var currentIndex = window.utils.getRandomInt(0, picturesArray.length - 1);

        if (arrayOfRandomIndexes.indexOf(currentIndex) === -1) {
          arrayOfRandomIndexes.push(currentIndex);
        }
      }

      arrayOfRandomIndexes.forEach(function (element) {
        arrayOfRandomPictures.push(picturesArray[element]);
      });

      window.updatePictures(arrayOfRandomPictures);
      currentButtonBacklight(button);
    },

    onDiscussedButtonClick: function (picturesArray, button) {
      var arrayOfDiscussedPictures = picturesArray;
      arrayOfDiscussedPictures.sort(function (prevPic, nextPic) {
        return nextPic.comments.length - prevPic.comments.length;
      });

      window.updatePictures(arrayOfDiscussedPictures);
      currentButtonBacklight(button);
    }
  };
})();
