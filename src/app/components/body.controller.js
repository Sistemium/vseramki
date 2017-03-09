'use strict';

(function () {

  function BodyController (saUserAgent, appcache, $mdToast, $window, $timeout) {

    const vm = this;

    _.assign(vm, {

      os: saUserAgent.os,
      cls: saUserAgent.cls

    });

    vm.cacheStatus = function () {
      return appcache.textStatus;
    };

    function onUpdate() {
      // FIXME: this is because auth toast will remove this toast
      $timeout(2000)
        .then(showToast);
    }

    function showToast () {

      let parent = $window.document.getElementsByClassName('toolbar-fixed-top');
      let theme = 'warn-toast';

      $mdToast.show(
        $mdToast.simple()
          .textContent('Получено обновление')
          .hideDelay(false)
          .action('Применить')
          .highlightAction(true)
          .highlightClass('md-accent')
          .position('top right')
          .theme(theme)
          .parent(parent)
      ).then(()=>$window.location.reload (true));

    }

    $window.stmAppCacheUpdated = onUpdate;

    appcache.addEventListener('updateready', onUpdate, true);

  }

  angular.module('vseramki')
    .controller('BodyController', BodyController);

})();
