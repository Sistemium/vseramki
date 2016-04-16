(function() {
  'use strict';

  angular
    .module('sistemium')
    .directive('wanMaterialPaging', WanMaterialPagingDirective);

  /**
   * @ngInject
   */
  function WanMaterialPagingDirective() {
    return {
      restrict: 'EA',
      scope: {
        wmpTotal: '=',
        layout: '@',
        position: '@',
        gotoPage: '&',
        step: '=',
        currentPage: '='
      },
      controller: Controller,
      controllerAs: 'vm',
      template: [
        '<div layout="{{ layout }}" class="wan-material-paging" layout-align="{{ position }}">',
        '<md-button class="md-primary wmp-button" ng-click="vm.gotoFirst()" ng-show="vm.index > 0">{{ vm.first }}</md-button>',
        '<md-button class="md-primary wmp-button" ng-click="vm.getoPre()" ng-show="vm.index - 1 >= 0">...</md-button>',
        '<md-button class="md-primary wmp-button" ng-repeat="i in vm.stepInfo"',
        ' ng-click="vm.goto(vm.index + i)" ng-show="vm.page[vm.index + i]" ',
        ' ng-class="{true: \'md-raised\', false: \'\'}[vm.page[vm.index + i] === currentPage]">',
        ' {{ vm.page[vm.index + i] }}',
        '</md-button>',
        '<md-button class="md-primary wmp-button" ng-click="vm.getoNext()" ng-show="vm.index + vm.step < wmpTotal">...</md-button>',
        '<md-button class="md-primary wmp-button" ng-click="vm.gotoLast()" ng-show="vm.index + vm.step < wmpTotal">{{ vm.last }}</md-button>',
        '</div>'
      ].join('')
    };
  }

  /**
   * @ngInject
   */
  function Controller($scope) {
    var vm = this;

    vm.first = '1';
    vm.index = 0;
    vm.step = $scope.step;

    vm.goto = function(index) {
      $scope.currentPage = vm.page[index];
    };

    vm.getoPre = function(){
      $scope.currentPage = vm.index;
      vm.index -= vm.step;
    };

    vm.getoNext = function(){
      vm.index += vm.step;
      $scope.currentPage = vm.index + 1;
    };

    vm.gotoFirst = function(){
      vm.index = 0;
      $scope.currentPage = 1;
    };

    vm.gotoLast = function(){
      vm.index = parseInt($scope.wmpTotal / vm.step) * vm.step;
      vm.index === $scope.wmpTotal ? vm.index = vm.index - vm.step : '';
      $scope.currentPage = $scope.wmpTotal;
    };

    $scope.$watch('currentPage', function() {
      $scope.gotoPage();
    });

    $scope.$watch('wmpTotal', function() {
      vm.init();
    });

    vm.init = function() {
      vm.stepInfo = (function() {
        var i, result = [];
        for (i = 0; i < vm.step; i++) {
          result.push(i)
        }
        return result;
      })();

      vm.page = (function() {
        var i, result = [];
        for (i = 1; i <= $scope.wmpTotal; i++) {
          result.push(i);
        }

        vm.last = $scope.wmpTotal;
        return result;

      })();

    };
  }

})();
