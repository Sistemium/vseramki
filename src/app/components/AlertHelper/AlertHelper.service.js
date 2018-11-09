'use strict';

(function () {

  function AlertHelper($mdDialog) {

    function showConfirm(ev, question) {

      const confirm = $mdDialog.confirm()
        .title(question || 'Действительно удалить эту запись?')
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
