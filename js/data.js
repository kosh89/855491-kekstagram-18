'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;
  var COMMENTS_PER_PAGE = 5;

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

  var backupOfPictures = [];

  window.updatePictures = function (pictures) {
    removePictures();
    var fragment = document.createDocumentFragment();
    createPictureNodes(fragment, pictures);
    picturesListElement.appendChild(fragment);
  };

  //  удаление уже отрисованных фотографий
  var removePictures = function () {
    var currentPicturesElements = document.querySelectorAll('.picture');

    currentPicturesElements.forEach(function (picture) {
      picture.remove();
    });
  };

  //  экранирование спецсимволов
  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  var escapeHtml = function (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
      return entityMap[s];
    });
  };

  var renderPictures = function (pictureObject) {
    var pictureItem = pictureTemplateElement.cloneNode(true);

    pictureItem.querySelector('.picture__img').src = pictureObject.url;
    pictureItem.querySelector('.picture__likes').textContent = pictureObject.likes;
    pictureItem.querySelector('.picture__comments').textContent = pictureObject.comments.length;

    //  формируем строку с комментариями
    var getCommentsHTML = function (comments) {
      var commentsString = '';

      comments.forEach(function (item) {
        commentsString += '<li class="social__comment"><img class="social__picture" src=' + escapeHtml(item.avatar) + ' alt=' + escapeHtml(item.name) + ' width="35" height="35"> <p class="social__text">' + escapeHtml(item.message) + '</p></li>';
      });

      return commentsString;
    };

    //  заполняем картинку данными из объекта картинки
    var onPictureItemClick = function () {
      bigPictureImgElement.src = pictureObject.url;
      likesCountElement.textContent = pictureObject.likes;
      commentsCountElement.textContent = pictureObject.comments.length;
      socialCaptionElement.textContent = pictureObject.description;

      //  очищаем комментарий, который указан в разметке
      socialCommentsElement.textContent = '';

      //  заполняем своими комментариями
      socialCommentsElement.innerHTML = getCommentsHTML(pictureObject.comments);

      var socialCommentsElements = socialCommentsElement.querySelectorAll('.social__comment');

      //  сбрасываем счётчик показанных комментариев
      var commentsQuantity = 0;

      commentsQuantity = socialCommentsElements.length > COMMENTS_PER_PAGE ? COMMENTS_PER_PAGE : socialCommentsElements.length;

      commentsCountBlockElement.innerHTML = commentsQuantity + ' из <span class="comments-count">' + socialCommentsElements.length + '</span> комментариев</div>';

      //  если комментариев больше пяти, то остальные скрываем
      if (socialCommentsElements.length > COMMENTS_PER_PAGE) {
        for (var i = COMMENTS_PER_PAGE; i < socialCommentsElements.length; i++) {
          socialCommentsElements[i].classList.add('visually-hidden');
        }
      }

      var showNextFiveComments = function () {
        var showedComments = COMMENTS_PER_PAGE;

        return function () {
          if (showedComments > socialCommentsElements.length) {
            return;
          }

          var endOfCommentsArray = showedComments + COMMENTS_PER_PAGE;

          if (socialCommentsElements.length < endOfCommentsArray) {
            endOfCommentsArray = socialCommentsElements.length;
          }

          for (var k = showedComments; k < endOfCommentsArray; k++) {
            socialCommentsElements[k].classList.remove('visually-hidden');
          }

          commentsCountBlockElement.innerHTML = endOfCommentsArray + ' из <span class="comments-count">' + socialCommentsElements.length + '</span> комментариев</div>';

          showedComments += COMMENTS_PER_PAGE;
        };
      };

      var onCommentsLoaderElementClick = showNextFiveComments();

      commentsLoaderElement.addEventListener('click', onCommentsLoaderElementClick);

      window.showBigPicture();
    };

    //  при клике на картинку показываем её на весь экран и заполняем данными из объекта картинки
    pictureItem.addEventListener('click', onPictureItemClick);

    return pictureItem;
  };

  var createPictureNodes = function (block, pictures) {
    pictures.forEach(function (item) {
      block.appendChild(renderPictures(item));
    });
  };

  //  обработчик успешной загрузки фотографий с сервера
  var onLoadSuccess = function (pictures) {
    backupOfPictures = window.utils.cloneArray(pictures);

    window.updatePictures(pictures);

    imgFiltersElement.classList.remove('img-filters--inactive');

    popularButtonElement.addEventListener('click', window.utils.debounce(function () {
      window.filters.onPopularButtonClick(backupOfPictures, popularButtonElement);
    }, DEBOUNCE_INTERVAL));

    randomButtonElement.addEventListener('click', window.utils.debounce(function () {
      window.filters.onRandomButtonClick(pictures, randomButtonElement);
    }, DEBOUNCE_INTERVAL));

    discussedButtonElement.addEventListener('click', window.utils.debounce(function () {
      window.filters.onDiscussedButtonClick(pictures, discussedButtonElement);
    }, DEBOUNCE_INTERVAL));
  };

  window.backend.load(onLoadSuccess, window.backend.onServerRequestError);
})();
