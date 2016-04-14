(function () {
  'use strict';

  angular
    .module('vseramki')
    .service('Article',Article)
  ;

  /** @ngInject */
  function Article(Schema) {

    return Schema.register({

      name: 'Article'

    });

  }

}());
