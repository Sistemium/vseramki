'use strict';

(function () {

  angular.module('vseramki')
    .service('ModalHelper', ModalHelper);

  function ModalHelper($mdDialog) {

    return {
      showModal: function (resp) {
        return function show(ev, attr, model) {

          const confirm = $mdDialog.confirm()
            .title('Сохранить артибут ' + attr + '?')
            .ariaLabel('Save Attr')
            .targetEvent(ev)
            .ok('Да')
            .cancel('Отменить');
          $mdDialog.show(confirm).then(function () {
            const answer = true;
            resp(answer, attr, model);
          }, function () {
            const answer = false;
            resp(answer);
          });

        };
      }
    }
  }

})();
