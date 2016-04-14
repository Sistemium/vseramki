(function () {
  'use strict';

  angular
    .module('vseramki')
    .config(function (DSHttpAdapterProvider) {
      //TODO url for vr pool in STAPI
      var basePath = window.localStorage.getItem('JSData.BasePath')
        || location.protocol === 'https:' && '/api/dev/'
        || 'https://api.sistemium.com/v4d/dev/';
      angular.extend(DSHttpAdapterProvider.defaults, {
        basePath: basePath
      });
    })

    .service('Models', function (Schema) {

      return Schema.models();

    })

    .service('Schema', function (saSchema) {
      return saSchema;
    })
  ;

}());
