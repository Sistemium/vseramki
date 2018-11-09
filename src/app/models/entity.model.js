'use strict';

(function () {

  angular
    .module('vseramki')
    .service('Entity', Entity);

  function Entity(Schema) {

    const model = Schema.register({

      name: 'Entity',

      getDefault: function (entityName) {
        return _.get(model.get(entityName), 'options.defaultId');
      },


      setDefault: function (item, id) {
        return model.create({
          id: item,
          options: {
            defaultId: id
          }
        });
      }

    });

    return model;
  }

}());
