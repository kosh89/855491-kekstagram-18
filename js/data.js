'use strict';

(function () {
  var pictureTemplateElement = document.querySelector('#picture').content.querySelector('.picture');
  var picturesListElement = document.querySelector('.pictures');
  var bigPictureImgElement = document.querySelector('.big-picture__img img');
  var likesCountElement = document.querySelector('.likes-count');
  var commentsCountBlockElement = document.querySelector('.social__comment-count');
  var commentsCountElement = document.querySelector('.comments-count');
  var socialCommentsElement = document.querySelector('.social__comments');
  var socialCaptionElement = document.querySelector('.social__caption');
  var commentsLoaderElement = document.querySelector('.comments-loader');

  var imgFiltersElement = document.querySelector('.img-filters');
  var popularButtonElement = imgFiltersElement.querySelector('#filter-popular');
  var randomButtonElement = imgFiltersElement.querySelector('#filter-random');
  var discussedButtonElement = imgFiltersElement.querySelector('#filter-discussed');

  var initialArray = [];

  window.updatePictures = function (picturesArray) {
    removePictures();
    var fragment = document.createDocumentFragment();
    createPictureNodes(fragment, picturesArray);
    picturesListElement.appendChild(fragment);
  };

  var removePictures = function () {
    var currentPicturesNodes = document.querySelectorAll('.picture');

    currentPicturesNodes.forEach(function (picture) {
      picture.remove();
    });
  };

  var cloneArray = function (array) {
    var newArray = [];

    array.forEach(function (element) {
      newArray.push(element);
    });

    return newArray;
  };

  var renderPictures = function (pictureObject) {
    var pictureItem = pictureTemplateElement.cloneNode(true);

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
      bigPictureImgElement.src = pictureObject.url;
      likesCountElement.textContent = pictureObject.likes;
      commentsCountElement.textContent = pictureObject.comments.length;
      socialCaptionElement.textContent = pictureObject.description;

      //  очищаем комментарий, который указан в разметке
      socialCommentsElement.textContent = '';

      //  заполняем своими комментариями
      socialCommentsElement.innerHTML = getCommentsHTML(pictureObject.comments);

      commentsCountBlockElement.classList.add('visually-hidden');
      commentsLoaderElement.classList.add('visually-hidden');

      window.showBigPicture();
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

  //  обработчик успешной загрузки фотографий с сервера
  var onLoadSuccess = function (picturesArray) {
    initialArray = cloneArray(picturesArray);

    window.updatePictures(picturesArray);

    imgFiltersElement.classList.remove('img-filters--inactive');

    popularButtonElement.addEventListener('click', window.debounce(function () {
      window.filters.onPopularButtonClick(initialArray);
      window.filters.currentButtonBacklight(popularButtonElement);
    }));

    randomButtonElement.addEventListener('click', window.debounce(function () {
      window.filters.onRandomButtonClick(picturesArray);
      window.filters.currentButtonBacklight(randomButtonElement);
    }));

    discussedButtonElement.addEventListener('click', window.debounce(function () {
      window.filters.onDiscussedButtonClick(picturesArray);
      window.filters.currentButtonBacklight(discussedButtonElement);
    }));
  };

  window.backend.load(onLoadSuccess, window.backend.onServerRequestError);
})();
