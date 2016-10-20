'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('UserInfoController', UserInfoController)
  ;

  function UserInfoController(AuthHelper, Auth, Schema, $q, ToastHelper, $state) {

    var vm = this;

    var User = Schema.model('User');
    var SaleOrder = Schema.model('SaleOrder');

    const validSymbols = '\\dA-z\\-\\._$';

    _.assign(vm, {
      emailPattern: new RegExp(`[${validSymbols}]+@[${validSymbols}]+\\.[A-z]{2,}`),
      logout: Auth.logout,
      save,
      hasChanges,
      cancelChanges,
      goTo,
      goToOrders
    });

    /*
     Init
     */

    setUser();

    /*
     Functions
     */


    function goTo(id) {
      console.log(id);
      $state.go('saleorder', {id: id});
    }

    function goToOrders() {
      $state.go('order')
    }

    function setUser() {
      var authUser = AuthHelper.getUser();
      vm.roles = AuthHelper.userRoles();

      User.find(authUser.id)
        .catch(err => {
          if (err.status == 404) {
            return User.create({
              id: authUser.id,
              name: authUser.name
              //TODO: try to get email and phone from saProviderAccount
            })
          }
          return $q.reject(err);
        })
        .then(user => {
          vm.user = user;
          vm.id = user.id;
          getOrder();
        })
        .catch(err => console.error(err));

    }

    function getOrder() {
      SaleOrder.findAll({xid: vm.user.id}).then(function (orders) {
        vm.orders = orders;
      });
    }

    function save() {

      _.assign(vm.user, {phone: vm.user.phone, email: vm.user.email});

      User.save(vm.user).then(() => {
        ToastHelper.success('Изменения сохранены');
      }).catch(()=> {
        ToastHelper.error('Ошибка');
      });

      //console.log(vm.userInfo);
    }

    function hasChanges() {
      return vm.user && User.hasChanges(vm.user.id);
    }

    function cancelChanges() {
      _.get(vm, 'user.id') && User.revert(vm.user.id);
      _.result(vm, 'attrsForm.$setPristine');
      _.result(vm, 'attrsForm.$setUntouched');
    }


  }

}());
