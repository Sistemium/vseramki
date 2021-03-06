'use strict';

(function () {

  function AddFrameController(Baguette, Schema, Article, $scope, $state, ToastHelper, $q) {

    const vm = this;
    const FrameSize = Schema.model('FrameSize');
    const BackMount = Schema.model('BackMount');
    const Screening = Schema.model('Screening');
    const ArticleFrameSize = Schema.model('ArticleFrameSize');

    let unique = true;

    _.assign(vm, {

      frame: Article.createInstance(),
      saved: false,
      articleFrameSizes: [],
      saveLabel: 'Сохранить новую рамку',

      multiTypes: [
        {id: 'passePartout', name: 'Мульти-паспарту'},
        {id: 'multiFrame', name: 'Мульти-багет'}
      ],

      save,
      checkAttrs,
      hasChanges,
      cancelChanges,
      addArticleFrameSize,
      articleFrameSizeDecrement,
      articleFrameSizeIncrement,
      frameSizeNameFormatter: FrameSize.nameFormatter,
      frameSizePattern: _.get(_.find(FrameSize.columns, {name: 'name'}), 'validators.ng-pattern')

    });

    let reverted = false;

    if ($state.params.id) {

      vm.id = $state.params.id;
      vm.editState = true;

      Article.find(vm.id)
        .then(function (frame) {
          vm.frame = frame;
          vm.copiedName = frame.nameExternal;
          initArticleFrameSizes();
        });

      vm.saveLabel = 'Сохранить';
    }

    Baguette.findAll({limit: 3000});
    Baguette.bindAll({}, $scope, 'vm.baguettes');

    //Article.findAll();
    Article.bindAll({}, $scope, 'vm.frames');

    FrameSize.findAll();
    FrameSize.bindAll({}, $scope, 'vm.frameSizes');

    BackMount.findAll();
    BackMount.bindAll({}, $scope, 'vm.backMounts');

    Screening.findAll();
    Screening.bindAll({}, $scope, 'vm.screenings');


    if (vm.id) {
      $scope.$on('$destroy', cancelChanges);
    }

    $scope.$watch('vm.extraFrameSizeId', addArticleFrameSize);
    $scope.$watchGroup(['vm.frame.frameSizeId', 'vm.frame.baguetteId'], function (nv, ov) {
      if ((nv != ov) && hasChanges() && !reverted) {
        vm.checkAttrs();
      } else {
        reverted = false;
      }

    });

    $scope.$watch('vm.frame', function () {
      checkParams();
      refreshName();
    }, true);

    function initArticleFrameSizes() {
      vm.articleFrameSizes = vm.frame.articleFrameSizes || [];
    }

    function checkParams() {
      vm.paramsCheck = vm.frame.frameSizeId &&
        vm.frame.name &&
        // vm.frame.packageRel &&
        unique &&
        // vm.frame.highPrice &&
        (!vm.frame.multiType || _.find(vm.articleFrameSizes, afs => afs.count))
      ;
    }

    function hasChanges() {
      checkParams();
      return !vm.id ? _.get(vm, 'attrsForm.$dirty') :
        Article.hasChanges(vm.id) ||
        _.find(vm.articleFrameSizes, afs => !afs.id || ArticleFrameSize.hasChanges(afs.id));
    }

    function cancelChanges() {
      if (vm.id && hasChanges()) {
        unique = reverted = true;
        vm.dupMessage = false;
        _.each(vm.frame.articleFrameSizes, afs => {
          if (afs.id) {
            ArticleFrameSize.revert(afs.id);
          }
        });
        initArticleFrameSizes();
        return Article.revert(vm.id);
      }
    }

    function refreshName() {
      // if (!vm.frame.baguette) {
      //   return;
      // }
      // vm.frame.name = vm.frame.stringName(vm.articleFrameSizes);
    }

    function articleFrameSizeDecrement(afs) {
      afs.count--;
      if (afs.count < 1 && !afs.id) {
        _.remove(vm.articleFrameSizes, afs);
      }
      refreshName();
    }

    function articleFrameSizeIncrement(afs) {
      afs.count++;
      refreshName();
    }

    function addArticleFrameSize() {
      if (vm.extraFrameSizeId) {

        const efs = {frameSizeId: vm.extraFrameSizeId};
        let afs = _.find(vm.articleFrameSizes, efs);

        if (afs) {
          afs.count++;
        } else {
          afs = ArticleFrameSize.createInstance({
            frameSizeId: vm.extraFrameSizeId,
            count: 1
          });
          vm.articleFrameSizes.push(afs);
        }

        vm.extraFrameSizeId = null;
        refreshName();

      }
    }

    function save() {

      Article.create(vm.frame)
        .then(article => {
          return $q.all(_.map(vm.articleFrameSizes, afs => {

            if (!vm.frame.multiType) {
              return afs.id ? ArticleFrameSize.destroy(afs.id) : $q.resolve();
            } else if (afs.id && !afs.count) {
              return ArticleFrameSize.destroy(afs.id);
            } else if (afs.count) {
              return (!afs.id || ArticleFrameSize.hasChanges(afs.id)) ?
                ArticleFrameSize.create(_.assign(afs, {articleId: article.id})) :
                $q.resolve(afs);
            }

            return $q.reject('Invalid articleFrameSizes');

          }));
        })
        .then(function () {
          ToastHelper.success('Рамка сохранена');
          if (!vm.id) {
            $state.go('^.item.edit', {id: vm.frame.id});
          } else {
            clearForm();
          }
        })
        .catch(() => ToastHelper.error('Ошибка. Рамка не сохранена'));
    }

    function checkAttrs() {
      const params = {};

      _.assign(params, {baguetteId: vm.frame.baguetteId}, {frameSizeId: vm.frame.frameSizeId});

      if (params.baguetteId && params.frameSizeId) {

        Article.findAll(params).then(function (data) {

          _.remove(data, {id: vm.id});

          if (data.length) {
            vm.dupMessage = 'Такая рамка уже существует';
            unique = false;
          } else {
            vm.dupMessage = false;
            unique = true;
          }

          checkParams();

        });
      } else {
        vm.attrsForm.$invalid = true;
        vm.dupMessage = false;
      }
    }

    function clearForm() {
      if (!vm.editState) {
        vm.frame = Article.createInstance();
      }
      vm.dupMessage = false;
      unique = true;
      initArticleFrameSizes();
      _.result(vm, 'attrsForm.$setUntouched');
      _.result(vm, 'attrsForm.$setPristine');
      checkParams();
    }

  }

  angular
    .module('vseramki')
    .controller('AddFrameController', AddFrameController)
  ;

}());
