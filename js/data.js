'use strict';

(function () {
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var picturesList = document.querySelector('.pictures');
  var bigPictureImg = document.querySelector('.big-picture__img img');
  var likesCount = document.querySelector('.likes-count');
  var commentsCountBlock = document.querySelector('.social__comment-count');
  var commentsCount = document.querySelector('.comments-count');
  var socialComments = document.querySelector('.social__comments');
  var socialCaption = document.querySelector('.social__caption');
  var commentsLoader = document.querySelector('.comments-loader');

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
  var loadSuccessHandler = function (picturesArray) {
    var fragment = document.createDocumentFragment();

    createPictureNodes(fragment, picturesArray);

    picturesList.appendChild(fragment);
  };

  //  обработчик ошибки при загрузке фотографий с сервера / на сервер
  var errorItem = errorTemplate.cloneNode(true);
  errorItem.style.display = 'none';
  document.querySelector('main').insertAdjacentElement('afterbegin', errorItem);

  var errorButtons = errorItem.querySelectorAll('.error__button');

  var errorMessageClose = function () {
    errorItem.style.display = 'none';
    document.removeEventListener('keydown', onErrorMessageEscPress);
  };

  var onErrorMessageEscPress = function (evt) {
    if (evt.keyCode === window.utils.ESC_KEYCODE) {
      errorMessageClose();
    }
  };

  errorButtons.forEach(function (elem) {
    elem.addEventListener('click', errorMessageClose);
  });

  errorItem.addEventListener('click', errorMessageClose);

  window.data = {
    serverRequestErrorHandler: function (errorMessage) {
      errorItem.querySelector('.error__title').textContent = errorMessage;
      errorItem.style.display = 'flex';

      document.addEventListener('keydown', onErrorMessageEscPress);
    }
  };

  window.load(loadSuccessHandler, window.data.serverRequestErrorHandler);
})();
