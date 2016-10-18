'use strict';

(function () {

  angular
    .module('vseramki')
    .run(User);

  function User(Schema) {

    return Schema.register({
      name: 'User'
    });

  }

}());
