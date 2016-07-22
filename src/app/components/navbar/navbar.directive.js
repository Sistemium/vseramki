(function () {
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

    function NavbarController(Cart, $scope, $mdMedia) {
      Cart.bindAll({}, $scope, 'vm.cart');
      Cart.findAll();

      var vm = this;
      $scope.$watch(

        function () {
          return $mdMedia('max-width: 800px');
        },

        function (value) {
          vm.breakpoint = value;
        }
      );
    }
  }

})();
