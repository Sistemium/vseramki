(function () {

  angular.module('vseramki').component('pictureList', {


    bindings: {
      pictures: '<',
    },

    controller: pictureListController,

    templateUrl: 'app/domain/pictures/list/pictureList.html',
    controllerAs: 'vm'

  });

  function pictureListController($scope, ControllerHelper, $mdDialog) {

    ControllerHelper.setup(this, $scope)
      .use({
        renameClick(event, picture) {
          event.stopPropagation();
          showEditDialog(picture, event);
        },
      });


    function showEditDialog(picture, targetEvent) {

      const {renamed, name} = picture;

      const confirm = $mdDialog.prompt()
        .title('Переименовать файл?')
        .textContent(renamed)
        .placeholder(name)
        // .ariaLabel('Dog name')
        .initialValue(renamed || name)
        .targetEvent(targetEvent)
        // .required(true)
        .ok('Переименовать')
        .cancel('Отмена');

      $mdDialog.show(confirm)
        .then(result => {
          picture.renamed = result === name ? null : result;
          return picture.DSCreate();
        }, _.noop);

    }

  }

})();
