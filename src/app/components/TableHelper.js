'use strict';

(function () {

  angular.module('vseramki')
    .service('TableHelper', TableHelper);

  function TableHelper(localStorageService) {

    function pagination() {

      var config = {
        labels: {
          page: 'Страница:',
          rowsPerPage: 'Кол-во элементов: ',
          of: 'из'
        },
        query: {
          limit: localStorageService.get('pagination.limit') || 12,
          page: 1
        },
        limitOptions: [12, 24, 50, 100]
      };

      return config;
    }

    function setPagination (page, limit) {
      localStorageService.set('pagination.limit', limit);
    }

    return {
      pagination,
      setPagination
    };

  }

})();
