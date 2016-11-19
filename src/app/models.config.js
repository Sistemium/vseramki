'use strict';

(function () {

  var basePath = window.localStorage.getItem('JSData.BasePath')
    || location.protocol === 'https:' && '/api/'
    || 'https://api.sistemium.com/v4d/vr2/';


  function Schema(saSchema, $http) {

    return saSchema({

      labelOf: function (count) {

        var labels = this.labels.count;

        if (_.inRange(count % 100, 9, 21)) {
          return labels['567890'];
        } else {
          var digit = count % 10;
          if (digit === 1) {
            return labels['1'];
          } else if (_.inRange(digit, 2, 5)) {
            return labels['234'];
          } else {
            return labels['567890'];
          }
        }

      },

      getCount: function (params) {
        return $http
          .get(
            basePath + this.endpoint,
            {
              params: angular.extend({
                'agg:': 'count'
              }, params || {})
            }
          )
          .then(function (res) {
            return parseInt(res.headers('x-aggregate-count'));
          });
      }
    });

  }

  angular.module('vseramki')

    .config(function (DSHttpAdapterProvider) {
      angular.extend(DSHttpAdapterProvider.defaults, {
        basePath: basePath
      });
    })

    .factory('Schema', Schema)

    .run(function (DS, $window) {
      var adapter = new $window.DSLocalStorageAdapter();
      DS.registerAdapter('localStorage', adapter);
    });

}());
