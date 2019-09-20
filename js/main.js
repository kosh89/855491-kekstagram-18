'use strict';

var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var picturesList = document.querySelector('.pictures');

var getRandomInt = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var generatePictures = function () {
  var arr = [];
  var names = ['Олег', 'Сергей', 'Ольга', 'Катя', 'Денис', 'Андрей'];
  var commentsTemplates = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  for (var i = 1; i <= 25; i++) {
    var tempObject = {};

    tempObject.url = 'photos/' + i + '.jpg';
    tempObject.description = '';
    tempObject.likes = getRandomInt(15, 200);
    tempObject.comments = [];

    for (var k = 0; k < getRandomInt(1, 3); k++) {
      var tempCommentObject = {};
      tempCommentObject.avatar = 'img/avatar-' + getRandomInt(1, 6) + '.svg';
      tempCommentObject.message = commentsTemplates[getRandomInt(0, commentsTemplates.length - 1)];
      tempCommentObject.name = names[getRandomInt(0, names.length - 1)];

      tempObject.comments.push(tempCommentObject);
    }

    arr.push(tempObject);
  }

  return arr;
};

var pictures = generatePictures();

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

createPictureNodes(fragment, pictures);

picturesList.appendChild(fragment);
