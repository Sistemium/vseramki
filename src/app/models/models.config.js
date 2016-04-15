(function () {
  'use strict';

  angular
    .module('vseramki')
    .config(function (DSHttpAdapterProvider) {
      //TODO url for vr pool in STAPI
      var basePath = window.localStorage.getItem('JSData.BasePath')
        || location.protocol === 'https:' && '/api/'
        || 'https://api.sistemium.com/v4d/vr/';
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
