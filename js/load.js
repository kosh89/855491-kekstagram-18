'use strict';

(function () {
  var API_URL = 'https://js.dump.academy/kekstagram/';
  var GET_METHOD = 'GET';
  var POST_METHOD = 'POST';


  var request = function (url, method, data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      if (xhr.statusText !== 200) {
        onError('Произошла ошибка соединения');
      }
    });

    xhr.addEventListener('timeout', function () {
      if (xhr.statusText !== 200) {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      }
    });

    xhr.timeout = 5000;

    xhr.open(method, url);
    xhr.send(data);
  };

  //  работа с окном ошибки отправки данных на сервер
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var errorItem = errorTemplate.cloneNode(true);
  errorItem.style.display = 'none';
  document.querySelector('main').insertAdjacentElement('afterbegin', errorItem);

  var errorButtons = errorItem.querySelectorAll('.error__button');

  var onErrorMessageClose = function () {
    errorItem.style.display = 'none';
    document.removeEventListener('keydown', onErrorMessageEscPress);
  };

  var onErrorMessageEscPress = function (evt) {
    if (evt.keyCode === window.utils.ESC_KEYCODE) {
      onErrorMessageClose();
    }
  };

  errorButtons.forEach(function (elem) {
    elem.addEventListener('click', onErrorMessageClose);
  });

  errorItem.addEventListener('click', onErrorMessageClose);

  window.backend = {
    load: function (onSuccess, onError) {
      request(API_URL + 'data', GET_METHOD, null, onSuccess, onError);
    },

    save: function (data, onSuccess, onError) {
      request(API_URL, POST_METHOD, data, onSuccess, onError);
    },

    onServerRequestError: function (errorMessage) {
      errorItem.querySelector('.error__title').textContent = errorMessage;
      errorItem.style.display = 'flex';

      document.addEventListener('keydown', onErrorMessageEscPress);
    }
  };
})();
