'use strict';

(function () {

  function stateBarButton($compile, $templateRequest) {
    return {

      restrict: 'ACE',

      scope: {
        icon: '@',
        title: '@'
      },

      link: function (scope, element, attrs) {

        $templateRequest('app/components/stateBarButton/stateBarButton.html')
          .then(html => {
            var template = angular.element(html);
            template.addClass(attrs.class);
            element.replaceWith(template);
            $compile(template)(scope);
          });

      },

      controller: function ($scope) {

        var vm = this;

        _.assign(vm, {
          onClick: event => {
            $scope.$emit('stateBarButtonClick', event, true);
          }
        });

      },

      controllerAs: 'vm'

    };
  }

  angular.module('vseramki')
    .directive('stateBarButton', stateBarButton);

})();
