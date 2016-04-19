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
      controllerAs: 'dm',
      template: [
        '<div layout="{{ layout }}" class="wan-material-paging" layout-align="{{ position }}">',
        '<md-button class="md-primary wmp-button" ng-click="dm.gotoFirst()" ng-show="dm.index > 0">{{ dm.first }}</md-button>',
        '<md-button class="md-primary wmp-button" ng-click="dm.getoPre()" ng-show="dm.index - 1 >= 0">...</md-button>',
        '<md-button class="md-primary wmp-button" ng-repeat="i in dm.stepInfo"',
        ' ng-click="dm.goto(dm.index + i)" ng-show="dm.page[dm.index + i]" ',
        ' ng-class="{true: \'md-raised\', false: \'\'}[dm.page[dm.index + i] === currentPage]">',
        ' {{ dm.page[dm.index + i] }}',
        '</md-button>',
        '<md-button class="md-primary wmp-button" ng-click="dm.getoNext()" ng-show="dm.index + dm.step < wmpTotal">...</md-button>',
        '<md-button class="md-primary wmp-button" ng-click="dm.gotoLast()" ng-show="dm.index + dm.step < wmpTotal">{{ dm.last }}</md-button>',
        '</div>'
      ].join('')
    };
  }

  /**
   * @ngInject
   */
  function Controller($scope) {
    var dm = this;

    dm.first = '1';
    dm.index = 0;
    dm.step = $scope.step;

    dm.goto = function(index) {
      $scope.currentPage = dm.page[index];
    };

    dm.getoPre = function(){
      $scope.currentPage = dm.index;
      dm.index -= dm.step;
    };

    dm.getoNext = function(){
      dm.index += dm.step;
      $scope.currentPage = dm.index + 1;
    };

    dm.gotoFirst = function(){
      dm.index = 0;
      $scope.currentPage = 1;
    };

    dm.gotoLast = function(){
      dm.index = parseInt($scope.wmpTotal / dm.step) * dm.step;
      dm.index === $scope.wmpTotal ? dm.index = dm.index - dm.step : '';
      $scope.currentPage = $scope.wmpTotal;
    };

    $scope.$watch('currentPage', function(currentPage) {
      $scope.gotoPage();
      if (currentPage > dm.index + dm.step) {
        dm.index = Math.floor (currentPage / dm.step) * dm.step;
        init();
      }
    });

    $scope.$watch('wmpTotal', function() {
      dm.init();
    });

    $scope.$watch('step', function(n,o) {
      if (n === o) {
        return;
      }
      dm.step = n;
      dm.init();
    });

    dm.init = init;

    function init () {
      dm.stepInfo = (function() {
        var i, result = [];
        for (i = 0; i < dm.step; i++) {
          result.push(i)
        }
        return result;
      })();

      dm.page = (function() {
        var i, result = [];
        for (i = 1; i <= $scope.wmpTotal; i++) {
          result.push(i);
        }

        dm.last = $scope.wmpTotal;
        return result;

      })();

    }
  }

})();
