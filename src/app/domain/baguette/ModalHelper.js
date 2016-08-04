'use strict';

(function () {

  angular.module('vseramki')
    .service('ModalHelper', ModalHelper);

  function ModalHelper($mdDialog) {

    return {
      showModal: function (resp) {
        return function show(ev, attr, model) {

          var confirm = $mdDialog.confirm()
            .title('Сохранить артибут ' + attr + '?')
            .ariaLabel('Save Attr')
            .targetEvent(ev)
            .ok('Да')
            .cancel('Отменить');
          $mdDialog.show(confirm).then(function () {
            var answer = true;
            resp(answer, attr, model);
          }, function () {
            var answer = false;
            resp(answer);
          });

        };
      }
    }
  }

})();
