(function () {

  angular
    .module('vseramki')
    .service('Picturing', Picturing)
  ;

  /** @ngInject */

  function Picturing(Schema) {

    const {Picture} = Schema.models();

    return {

      findAllPictures() {
        return Picture.findAll({ limit: 10000 });
      }

    };

  }

})();
