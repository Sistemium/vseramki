'use strict';

(function () {

  const acmeNavbar = {
    templateUrl: 'app/components/navbar/navbar.html',
    controller: NavbarController,
    controllerAs: 'vm'
  };

  /** @ngInject */
  function NavbarController(Cart, $scope, $window, $state, AuthHelper, ToastHelper) {

    const vm = this;

    _.assign(vm, {

      loginBtnClick: () => vm.loggedIn ? $state.go('profile') : $state.go('login')

    });

    Cart.findAll();

    setUser(AuthHelper.hasUser()) || $scope.$on('logging-in', (e, q) => {
      setUser(q.then(AuthHelper.hasUser));
    });

    setButtons();

    Cart.bindAll({}, $scope, 'vm.cart');

    $scope.$on('logged-off', function () {
      $window.location.href = '';
    });

    /*
    Functions
     */

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
        // {
        //   sref: 'home',
        //   label: 'Главная'
        // },
        {
          sref: 'catalogue',
          label: 'Рамки'
        }, {
          sref: 'baguettes',
          label: 'Багет'
        }, {
          sref: 'info',
          label: 'Контакты',
          cls: vm.loggedIn && 'hide-sm'
        }, {
          sref: 'delivery',
          label: 'Доставка'
        }
      ];

      if (vm.loggedIn) {
        vm.navs.push({
          sref: 'saleOrders',
          label: 'Заказы'
        });
      }

      if (isAdmin) {
        vm.navs.push({
          sref: 'pictures',
          label: 'Картинки',
          cls: 'hide-sm'
        }, {
          sref: 'dictionary',
          label: 'Словари'
        });
      }

      vm.navs.push({
        sref: isLoggedIn ? 'profile' : 'login',
        fabOnly: true,
        label: isLoggedIn ? 'Профиль' : 'Вход'
      });

      vm.buttons = _.filter(vm.navs, nav => !nav.fabOnly);
      vm.isAdmin = isAdmin;

    }

  }

  angular.module('vseramki')
    .component('acmeNavbar', acmeNavbar);


})();
