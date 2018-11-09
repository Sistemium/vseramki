'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('ArticlePivotController', ArticlePivotController)
  ;

  function ArticlePivotController(Article, Schema, $q) {

    const vm = this;

    const FrameSize = Schema.model('FrameSize');
    const Brand = Schema.model('Brand');
    const Material = Schema.model('Material');
    const Colour = Schema.model('Colour');

    const props = [
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

    const promises = _.map(props, function (p) {
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

      const filter = {};
      let prop = vm.groups.name;

      filter[prop] = group.id;

      const articles = Article.filter(filter);

      if (!articles || !vm[name]) {
        return;
      }

      prop = vm[name].name;

      return _.map(_.groupBy(articles, prop), function (val, key) {
          return vm[name].model.get(key);
        }
      );

    }

    const dropdownValues = {};
    let valArr = [];
    let collisionIn;

    angular.extend(vm, {

      props: props,

      setFilterCriterias: function (obj, event, labelId) {

        if ((_.intersection(valArr, [labelId])).length) { // if duplication
          _(dropdownValues).forEach(function (val, key) { // checking which dropdown contains duplication
            if (val == labelId) {
              collisionIn = key;
            }
          });
          if (vm[event.srcElement.id]) { // if dropdown already has value
            const temp = vm[event.srcElement.id];
            const temp2 = dropdownValues[event.srcElement.id];
            vm[collisionIn] = temp;
            dropdownValues[collisionIn] = temp2;
            vm.assignValues(obj, labelId);
          } else {
            delete (vm[collisionIn]);
            dropdownValues[collisionIn] = false;
            vm.assignValues(obj, labelId);
          }
        } else {
          vm.assignValues(obj, labelId);
        }

      },

      assignValues: function (obj, labelId) {
        dropdownValues[event.srcElement.id] = labelId;
        vm[event.srcElement.id] = obj;
        valArr = _.values(dropdownValues);
      },

      columnsByGroup: function (group) {
        return propsByGroup('columns', group);
      },

      rowsByGroup: function (group) {
        return propsByGroup('rows', group);
      },

      cellByGroupRowColumn: function (group, row, column) {
        const filter = {};

        filter[vm.groups.name] = group.id;
        filter[vm.rows.name] = row.id;
        filter[vm.columns.name] = column.id;

        const articles = Article.filter(filter);

        return articles.length || '';
      },

      deleteFilters: function () {
        delete (vm.groups);
        delete (vm.rows);
        delete (vm.columns);
        //FilterCriteria.destroyAll();
      }

    });

  }

}());
