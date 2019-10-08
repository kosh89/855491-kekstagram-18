'use strict';

(function () {
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var picturesList = document.querySelector('.pictures');
  var bigPictureImg = document.querySelector('.big-picture__img img');
  var likesCount = document.querySelector('.likes-count');
  var commentsCountBlock = document.querySelector('.social__comment-count');
  var commentsCount = document.querySelector('.comments-count');
  var socialComments = document.querySelector('.social__comments');
  var socialCaption = document.querySelector('.social__caption');
  var commentsLoader = document.querySelector('.comments-loader');

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
      tempObject.likes = window.utils.getRandomInt(15, 200);
      tempObject.comments = [];

      for (var k = 0; k < window.utils.getRandomInt(1, 15); k++) {
        var tempCommentObject = {};
        tempCommentObject.avatar = 'img/avatar-' + window.utils.getRandomInt(1, 6) + '.svg';
        tempCommentObject.message = commentsTemplates[window.utils.getRandomInt(0, commentsTemplates.length - 1)];
        tempCommentObject.name = names[window.utils.getRandomInt(0, names.length - 1)];

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

  var fragment = document.createDocumentFragment();

  createPictureNodes(fragment, picturesContent);

  picturesList.appendChild(fragment);
})();
