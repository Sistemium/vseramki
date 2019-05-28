(function () {

  angular.module('vseramki').component('pictureList', {


    bindings: {
      pictures: '<',
    },

    controller: pictureListController,

    templateUrl: 'app/domain/pictures/list/pictureList.html',
    controllerAs: 'vm'

  });

  function pictureListController($scope, ControllerHelper) {

    ControllerHelper.setup(this, $scope);

  }

})();
