'use strict';

/* global ArrayBuffer:false Uint8Array:false */

(function () {

  function FileSaver($window) {

    return {
      saveAs: $window.saveAs,
      s2ab
    };

    function s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }

  }

  angular.module('sistemium.services')
    .service('FileSaver', FileSaver);

})();
