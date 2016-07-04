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

    var dropdownValues = {};
    var valArr = [];
    var collisionIn;

    angular.extend(vm, {

      props: props,

      setFilterCriterias: function (obj, event, labelId) {
        console.log(obj);

        if ((_.intersection(valArr, [labelId])).length) { // if duplication
          _(dropdownValues).forEach(function (val, key) { // checking which dropdown contains duplication
            if (val == labelId) {
              collisionIn = key;
            }
          });
          if (vm[event.srcElement.id]) { // if dropdown has value
            var temp = vm[event.srcElement.id];
            var temp2 = dropdownValues[event.srcElement.id];
            vm[event.srcElement.id] = obj;
            vm[collisionIn] = temp;
            dropdownValues[event.srcElement.id] = labelId;
            dropdownValues[collisionIn] = temp2;
            valArr = _.values(dropdownValues);
          } else {
            delete (vm[collisionIn]);
            dropdownValues[event.srcElement.id] = labelId;
            dropdownValues[collisionIn] = false;
            vm[event.srcElement.id] = obj;
            valArr = _.values(dropdownValues);
          }
        } else {
          vm[event.srcElement.id] = obj;
          dropdownValues[event.srcElement.id] = labelId;
          valArr = _.values(dropdownValues);
        }
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
