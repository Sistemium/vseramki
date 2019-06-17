(function () {

  angular
    .module('vseramki')
    .service('Picturing', Picturing)
  ;

  /** @ngInject */

  function Picturing(Schema) {

    const {Picture, Baguette} = Schema.models();

    return {

      findAllPictures() {
        return Baguette.findAll({limit: 3000})
          .then(() => Picture.findAll({limit: 10000}));
      }

    };

  }

})();
