'use strict';

/* global ArrayBuffer:false Uint8Array:false saveAs:false */

(function () {

  function FileSaver() {

    return {
      saveWorkBookAs: (wb, name) => {
        return saveAs(new Blob([s2ab(wb)], {type: 'application/octet-stream'}), name);
      }
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
