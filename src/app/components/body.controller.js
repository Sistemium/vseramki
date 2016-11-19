'use strict';

(function () {

  function BodyController (saUserAgent) {
    var vm = this;
    _.assign(vm, {

      os: saUserAgent.os,
      cls: saUserAgent.cls

    });
  }

  angular.module('vseramki')
    .controller('BodyController', BodyController);

})();
