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

    function NavbarController(Cart, $scope, $mdMedia, Auth, $window, $state, AuthHelper) {
      Cart.bindAll({}, $scope, 'vm.cart');
      Cart.findAll();

      var vm = this;

      function setUser() {
        Auth.getCurrentUser(null)
          .then(function (user) {
            vm.user = user;

            var isAdmin = AuthHelper.isAdmin();

            if (isAdmin) {
              vm.navs.push ({
                sref: 'baguettes',
                label: 'Багет'
              })
            }

          });
      }

      $scope.$on('logged-in', setUser);
      $scope.$on('logged-off', function () {
        $window.location.href = '';
      });

      _.assign(vm, {

        goToUserInfo: function () {
          $state.go('userInfo');
        },

        login: function () {
          $state.go('login');
        },

        navs: [
          {
            sref: 'home',
            label: 'Главная'
          }, {
            sref: 'catalogue',
            label: 'Рамки'
          }
        ]


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
  }

})();
