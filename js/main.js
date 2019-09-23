'use strict';

var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var picturesList = document.querySelector('.pictures');

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
