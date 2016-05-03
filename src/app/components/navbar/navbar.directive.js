(function() {
  'use strict';

  angular
    .module('vseramki')
    .directive('acmeNavbar', acmeNavbar);

  function acmeNavbar() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/components/navbar/navbar.html',
      controller: NavbarController,
      controllerAs: 'vm'
    };

    return directive;

    function NavbarController(Cart,$scope) {
      Cart.bindAll({},$scope,'vm.cart');
      Cart.findAll();
    }
  }

})();
