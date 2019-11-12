'use strict';

(function () {
  var RANDOM_ARRAY_LENGTH = 10;
  var ACTIVE_BUTTON_CLASS = 'img-filters__button--active';

  var currentButtonBacklight = function (newActiveButton) {
    var currentActiveButtonElement = document.querySelector('.' + ACTIVE_BUTTON_CLASS);
    currentActiveButtonElement.classList.toggle(ACTIVE_BUTTON_CLASS);

    newActiveButton.classList.add(ACTIVE_BUTTON_CLASS);
  };

  var showPopularPictures = function (picturesArray, button) {
    window.updatePictures(picturesArray);
    currentButtonBacklight(button);
  };

  var showRandomPictures = function (picturesArray, button) {
    var picturesArrayCopy = window.utils.cloneArray(picturesArray);
    var randomPictures = [];

    for (var i = 0; i < RANDOM_ARRAY_LENGTH; i++) {
      var index = window.utils.getRandomInt(0, picturesArrayCopy.length - 1);
      randomPictures.push(picturesArrayCopy.splice(index, 1)[0]);
    }

    window.updatePictures(randomPictures);
    currentButtonBacklight(button);
  };

  var showDiscussedPictures = function (picturesArray, button) {
    var arrayOfDiscussedPictures = picturesArray.sort(function (prevPic, nextPic) {
      return nextPic.comments.length - prevPic.comments.length;
    });

    window.updatePictures(arrayOfDiscussedPictures);
    currentButtonBacklight(button);
  };

  window.filters = {
    onPopularButtonClick: showPopularPictures,

    onRandomButtonClick: showRandomPictures,

    onDiscussedButtonClick: showDiscussedPictures
  };
})();
