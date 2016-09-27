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
  function NavbarController(Cart, $scope, $mdMedia, $window, $state, AuthHelper, ToastHelper) {

    Cart.bindAll({}, $scope, 'vm.cart');
    Cart.findAll();

    var vm = this;

    setButtons();

    function setUser(q) {


      if (!q || vm.settingUser) {
        return;
      }

      vm.settingUser = true;

      return q.then(function (user) {
        vm.loggedIn = !!user;
        vm.settingUser = false;
        setButtons(AuthHelper.isAdmin(), vm.loggedIn);
        showToast(user);
      });

    }

    function showToast(user) {
      if (user) {
        ToastHelper.showToast(`Добро пожаловать, ${user.name}!`, true);
      }
    }

    function setButtons(isAdmin, isLoggedIn) {

      vm.navs = [
        {
          sref: 'home',
          label: 'Главная'
        },
        {
          sref: 'catalogue',
          label: 'Рамки'
        }
      ];

      if (isAdmin) {
        vm.navs.push({
          sref: 'baguettes',
          label: 'Багет'
        });
      }

      vm.navs.push({
        sref: isLoggedIn ? 'profile' : 'login',
        fabOnly: true,
        label: isLoggedIn ? 'Профиль' : 'Вход'
      });

      vm.buttons = _.filter(vm.navs, nav => !nav.fabOnly);

    }

    setUser(AuthHelper.hasUser()) || $scope.$on('logging-in', (e, q) => {
      setUser(q.then(AuthHelper.hasUser));
    });

    $scope.$on('logged-off', function () {
      $window.location.href = '';
    });

    _.assign(vm, {

      loginBtnClick: function () {
        vm.loggedIn ? $state.go('profile') : $state.go('login');
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
