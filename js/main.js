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
bigPicture.classList.remove('hidden');

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
