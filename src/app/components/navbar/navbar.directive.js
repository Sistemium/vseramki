'use strict';

(function () {

  angular.module('vseramki')
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
  }

  /** @ngInject */
  function NavbarController(Cart, $scope, $mdMedia, $window, $state, AuthHelper) {

    Cart.bindAll({}, $scope, 'vm.cart');
    Cart.findAll();

    var vm = this;

    setButtons();

    function setUser() {
      AuthHelper.hasUser()
        .then(function (user) {
          var isAdmin;

          if (user) {
            vm.loggedIn = true;
            isAdmin = AuthHelper.isAdmin();
            setButtons(isAdmin, vm.loggedIn);
          }

        });
    }

    function setButtons(isAdmin, isLoggedIn) {

      if (isAdmin && isLoggedIn) {
        vm.navs = [
          {
            sref: 'home',
            label: 'Главная'
          },
          {
            sref: 'catalogue',
            label: 'Рамки'
          },
          {
            sref: 'baguettes',
            label: 'Багет'
          }

        ]
      } else {
        vm.navs = [
          {
            sref: 'home',
            label: 'Главная'
          },
          {
            sref: 'catalogue',
            label: 'Рамки'
          }
        ]
      }
    }

    $scope.$on('logged-in', setUser);
    $scope.$on('logged-off', function () {
      $window.location.href = '';
    });

    _.assign(vm, {

      changeState: function () {
        vm.loggedIn ? $state.go('userInfo') : $state.go('login');
      }

    });

    $scope.$watch(
      function () {
        return $mdMedia('max-width: 800px');
      },

      function (value) {
        vm.breakpoint = value;
      }
    );

  }

})();
