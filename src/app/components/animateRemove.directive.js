(function () {

  angular.module('vseramki')
    .directive('vrAnimateRemove', vrAnimateRemove);

  function vrAnimateRemove($animate, $timeout, $parse) {

    return {
      restrict: 'A',
      replace: true,
      link: link
    };

    function link(scope, elem, attr) {
      var cls = attr.animateClass;
      scope.$watch(attr.arWatch, function (nv, ov) {
        if (nv === 0 && ov !== 0) {
          $animate.addClass(elem, cls).then(function () {
            $timeout(function () {
              $animate.removeClass(elem, cls);

              if (attr.onAnimateEnd) {
                console.log(attr);
                var a = $parse(attr.onAnimateEnd);
                console.log (a);
              }

            });
          });
        }
      });
    }

  }

})();
