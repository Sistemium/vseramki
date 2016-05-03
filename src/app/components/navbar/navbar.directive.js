(function() {
  'use strict';

  angular
    .module('vseramki')
    .directive('acmeNavbar', acmeNavbar);

  /** @ngInject */
  function acmeNavbar() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/components/navbar/navbar.html',
      controller: NavbarController,
      controllerAs: 'vm'
    };

    return directive;

    /** @ngInject */
    function NavbarController() {
    }
  }

})();
