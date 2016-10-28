'use strict';
/* global XLSX:false */

(function () {

  angular
    .module('vseramki', [
      'ui.router',
      'ngMaterial',
      'sistemium',
      'md.data.table',
      'lfNgMdFileInput',
      'ngFileUpload',
      'ngMessages',
      'sistemiumAngularAuth',
      'models',
      'ui.bootstrap.position',
      'yaMap',
      'ui.mask',
      'angularMoment'
    ])
    .constant('XLSX',XLSX);

})();
