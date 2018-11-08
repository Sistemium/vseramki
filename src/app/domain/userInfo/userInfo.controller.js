'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('UserInfoController', UserInfoController)
  ;

  function UserInfoController(AuthHelper, Auth, Schema, $q, ToastHelper, $state, TableHelper, $scope) {

    const vm = this;

    const User = Schema.model('User');
    const SaleOrder = Schema.model('SaleOrder');

    _.assign(vm, {
      emailPattern: User.meta.emailPattern,
      logout: Auth.logout,
      pagination: TableHelper.pagination(),
      onPaginate: TableHelper.setPagination,
      rootState: 'order',
      save,
      hasChanges,
      cancelChanges,
      goToOrder,
      goToOrders
    });


    /*
     Init
     */

    setUser();


    /*
     Functions
     */


    function goToOrder(id) {
      console.log(id);
      $state.go('.', {id: id});
    }

    function goToOrders() {
      $state.go('saleOrders')
    }

    function setUser() {
      const authUser = AuthHelper.getUser();
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
          getUserSaleOrders();
        })
        .catch(err => console.error(err));

    }

    function getUserSaleOrders() {
      SaleOrder.findAll({creatorId: vm.user.id}).then(()=> {
        SaleOrder.bindAll({}, $scope, 'vm.saleOrders', () => {
          const count = _.get(vm.saleOrders, 'length');
          vm.saleOrdersButton = count ? `${count} ${SaleOrder.labelOf(count)}` : null;
        });
      });
    }

    function save() {

      _.assign(vm.user, {phone: vm.user.phone, email: vm.user.email});

      User.save(vm.user).then(() => {
        ToastHelper.success('Изменения сохранены');
      }).catch(()=> {
        ToastHelper.error('Ошибка');
      });

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
