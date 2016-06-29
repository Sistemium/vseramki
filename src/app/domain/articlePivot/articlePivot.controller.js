'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('ArticlePivotController', ArticlePivotController)
  ;

  function ArticlePivotController(Article, Schema, $q) {

    var vm = this;

    var FrameSize = Schema.model('FrameSize');
    var Brand = Schema.model('Brand');
    var Material = Schema.model('Material');
    var Colour = Schema.model('Colour');

    var props = [
      {
        label: 'Размер',
        model: FrameSize,
        name: 'frameSizeId'
      },
      {
        label: 'Бренд',
        model: Brand,
        name: 'brandId'
      },
      {
        label: 'Материал',
        model: Material,
        name: 'materialId'
      },
      {
        label: 'Цвет',
        model: Colour,
        name: 'colourId'
      }
    ];

    var promises = _.map(props, function (p) {
      return p.model.findAll()
        .then(function (data) {
          p.data = data;
        });
    });

    promises.push(Article.findAll());

    $q.all(promises)
      .then(function () {
        vm.ready = true;
      });

    function propsByGroup(name, group) {

      var filter = {};
      var prop = vm.groups.name;
      filter[prop] = group.id;

      var articles = Article.filter(filter);

      if (!articles || !vm[name]) {
        return;
      }

      prop = vm[name].name;

      return _.map(
        _.groupBy(articles, prop),
        function (val, key) {
          return vm[name].model.get(key);
        }
      );

    }

    angular.extend(vm, {

      props: props,

      setGroups: function (prop) {
        console.log(prop);
        if (vm.rows === prop) {
          vm.rows = vm.groups;
        } else if (vm.columns === prop) {
          vm.columns = vm.groups;
        }
        vm.groups = prop;
      },

      setRows: function (prop) {
        if (vm.groups === prop) {
          vm.groups = vm.rows;
        } else if (vm.columns === prop) {
          vm.columns = vm.rows;
        }
        vm.rows = prop;
      },

      setColumns: function (prop) {
        if (vm.groups === prop) {
          vm.groups = vm.columns;
        } else if (vm.rows === prop) {
          vm.rows = vm.columns;
        }
        vm.columns = prop;
      },

      columnsByGroup: function (group) {
        return propsByGroup('columns', group);
      },

      rowsByGroup: function (group) {
        return propsByGroup('rows', group);
      },

      cellByGroupRowColumn: function (group, row, column) {
        var filter = {};

        filter[vm.groups.name] = group.id;
        filter[vm.rows.name] = row.id;
        filter[vm.columns.name] = column.id;

        var articles = Article.filter(filter);

        return articles.length || '';
      }

    });


  }

}());
