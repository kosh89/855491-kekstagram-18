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

  window.backend = {
    load: function (onSuccess, onError) {
      request(API_URL + 'data', GET_METHOD, null, onSuccess, onError);
    },

    save: function (data, onSuccess, onError) {
      request(API_URL, POST_METHOD, data, onSuccess, onError);
    }
  };
})();
