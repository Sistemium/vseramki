'use strict';

(function () {

  function AlertHelper($mdDialog) {

    function showConfirm(ev, question) {

      var confirm = $mdDialog.confirm()
        .title(question || 'Подтвердить удаление элемента?')
        .textContent('')
        .ariaLabel('Confirm Modal')
        .targetEvent(ev)
        .ok('Да')
        .cancel('Нет');

      return $mdDialog.show(confirm);

    }

    return {
      showConfirm
    }

  }

  angular.module('vseramki')
    .service('AlertHelper', AlertHelper);

})();
