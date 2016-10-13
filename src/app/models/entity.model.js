'use strict';

(function () {

  angular
    .module('vseramki')
    .service('Entity', Entity)
    .run(function (Entity) {
      Entity.findAll();
    })
  ;

  function Entity(Schema) {

<<<<<<< HEAD
    var model = Schema.register({

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

=======
    return Schema.register({

      name: 'Entity'

    });

>>>>>>> origin/frameview
  }

}());
