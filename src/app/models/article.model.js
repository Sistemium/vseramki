'use strict';

(function () {

  angular
    .module('vseramki')
    .service('Article',Article)
  ;

  function Article(Schema) {

    return Schema.register({

      name: 'Article',
      relations: {
        hasMany: {
          Cart: {
            localField: 'inCart',
            foreignKey: 'articleId'
          }
        }
      }

    });

  }

}());
