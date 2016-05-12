'use strict';

(function () {

  angular
    .module('vseramki')
    .service('Brand', Brand)
    .run(function(Brand){
      Brand.findAll();
    })
  ;

  function Brand(Schema) {

    return Schema.register({

      name: 'Brand',

      relations: {
        hasMany: {
          Article: {
            localField: 'articles',
            foreignKey: 'brandId'
          }
        }
      }

    });

  }

}());
