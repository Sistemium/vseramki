'use strict';

(function () {

  function ImportController($q, ImportExcel, $timeout, Schema, $scope, ToastHelper, $state, ImportConfig, AlertHelper, $mdMedia) {

    var vm = this;

    var modelName = $state.params.model;
    var model = Schema.model(modelName);
    var importConfig = ImportConfig[modelName];
    var columns = importConfig[modelName + 'Columns'];

    var baguetteModel = Schema.model('Baguette');
    baguetteModel.findAll({limit: 4000});

    // TODO: media query?

    $scope.$mdMedia = $mdMedia;


    _.assign(vm, {

      title: `Загрузка ${model.labels.ofMany} из файла`,
      data: null,
      modifiedData: [],
      selected: [],
      recordData: {},
      files: [],
      newProperties: [],

      labels: {
        imported: 'Обновлено',
        ignored: 'Без изменений',
        hasErrors: 'С ошибками',
        ignoredNotValid: 'Валидация не пройдена'
      },

      loadDataClick,
      cancelLoadDataClick,
      doneClick,
      tableHeaderRemoveClick,
      tableRowRemoveClick,
      addPropertyClick,
      findNewProperties,
      addAllNewPropertiesClick

      // mimeTypeRe: 'application/vnd.ms-excel|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

    });

    /*
     Init
     */

    vm.busy = model.findAll();

    /*
     Listeners
     */

    $scope.$watch('vm.xlsxUploadForm.$valid', isValid => {

      if (isValid && vm.files.length === 1) {
        vm.busyMessage = 'Чтение файла ...';
        vm.busyReading = ImportExcel.readFile(_.first(vm.files), columns)
          .catch(err => {
            vm.filesApi.removeAll();
            ToastHelper.error('Ошибка. ' + err);
            return false;
          })
          .then(res => {

            if (res) {
              vm.readyToImport = !!res;
              vm.data = res;
              vm.columns = _.clone(columns);
            } else {
              vm.busyReading = false;
            }

          });
      }
    });

    $scope.$watch('vm.xlsxUploadForm.$error.filesize', error => {
      if (error) {
        ToastHelper.error('Файл слишком большой');
        vm.filesApi.removeAll();
      }
    });

    $scope.$watch('vm.columns.length', () => {
      vm.busyMessage = 'Проверка данных ...';
      $timeout().then(() => {
        if (vm.data) {
          setModifiedData();
        }
        vm.busyReading = false;
      })
    });

    /*
     Functions
     */

    function addPropertyClick(name, propertyValue, ev) {

      const property = _.get(_.get(vm.newPropertiesByName, name), propertyValue);

      if (!property) return;


      let title = `${property.label} "${propertyValue}"`;

      AlertHelper.showConfirm(ev, `Добавить ${title} ?`)
        .then(() => {
          model.create({name: propertyValue})
            .then(() => {
              ToastHelper.success(`Добавлено ${title}`);
              setModifiedData();
            })
            .catch(err => {
                ToastHelper.error(err.status == 500 ? 'Ошибка сервера' : 'Непредвиденная ошибка');
            })
        });

    }

    function checkValidFields(elem, propertiesToCheck) {

      var isValid = true;

      _.each(propertiesToCheck, function (property) {

        if (_.get(property, 'name') == _.get(property, 'id')) {
          isValid = !!elem[_.get(property, 'id')];
        } else {
          isValid = !!elem[_.get(property, 'id')] && (!!elem[_.get(property, 'name')] );
        }

        if (!isValid) {
          vm.recordData.invalidRecord++;
          return false;
        }

      });

      return isValid

    }


    function tableRowRemoveClick(row) {
      _.remove(vm.modifiedData, row);

      if (row.diff) {
        vm.recordData.modifiedRecord--;
      }
      else if (row.isValidProperties == false) {
        vm.recordData.invalidRecord--;
      }

      vm.recordData.ommitedRecord++;
    }

    function setModifiedData() {


      var validFields = _.map(vm.columns, column => {

        return {
          id: column.ref || column.name,
          name: column.name,
          replace: column.replace !== false,
          model: column.model,
          ref: column.ref,
          required: column.required
        }

      });

      var propertiesToCheck = _.filter(validFields, function (elem) {
        return elem.required;
      });
      const primaryKey = importConfig.primaryKey;
      const primaryKeyFilter = {};

      vm.modifiedData = [];
      vm.recordData = {
        newRecord: 0,
        modifiedRecord: 0,
        ommitedRecord: 0,
        invalidRecord: 0
      };

      _.each(vm.data, function (elem, index) {

        setModelRefs(elem, _.filter(validFields, 'ref'));
        primaryKeyFilter[primaryKey] = elem[primaryKey];

        let instance = elem[primaryKey] && _.first(model.filter(primaryKeyFilter));

        if (instance) {

          var diff = {};

          _.each(validFields, field => {
            if ((field.replace || !instance[field.id]) && instance[field.id] !== elem[field.id]) {
              diff[field.name] = _.get(instance, field.name) || '(пусто)';
            } else {
              elem[field.id] = instance[field.id];
            }
          });

          let isValid = checkValidFields(elem, propertiesToCheck);

          if (Object.keys(diff).length) {

            vm.recordData.modifiedRecord++;

            vm.modifiedData.push({
              isValidProperties: isValid,
              importData: elem,
              diff: diff,
              instance: instance,
              index
            });
          } else {
            if (!isValid) {
              vm.modifiedData.push({
                isValidProperties: isValid,
                importData: elem,
                notModified: true,
                instance: instance,
                index
              });
            }
          }

        } else {

          vm.recordData.newRecord++;

          let isValid = checkValidFields(elem, propertiesToCheck);

          instance = model.createInstance({
            isValid: false
          });

          vm.modifiedData.push({
            isValidProperties: isValid,
            importData: elem,
            instance: instance,
            index
          });

        }

        diff = {};

      });
      vm.recordData.notModified = vm.data.length - vm.recordData.modifiedRecord - vm.recordData.newRecord;
    }

    function addAllNewPropertiesClick(property, ev) {

      AlertHelper.showConfirm(ev, `Добавить все новые значения в "${property.label}" ?`)
        .then(() => {

          const model = property.model;

          let promises = _.map(property.items, name => {

            return model.create({name})
              .then(() => {
                return {success: name};
              })
              .catch(() => {
                return {error: name};
              });

          });

          $q.all(promises)
            .then(res => {

              let errors = _.filter(res, 'error');
              let successes = _.filter(res, 'success');

              if (errors.length) {
                ToastHelper.error(`Ошибка! Не добавлено: "${errors.join('", "')}"`);
              }

              if (successes.length) {
                ToastHelper.success(`Добавлены новые значения в "${property.label}" (${successes.length} шт.)`);
              }

              setModifiedData();

            });

        });
    }

    function findNewProperties(data) {

      let refColumns = _.filter(columns, 'ref');
      let properties= {};
      let refNames = _.map(refColumns, 'name');

      _.each(refColumns, column => {

        properties[column.name] = {
          items: [],
          model: Schema.model(column.model),
          label: column.label,
          ref: column.ref,
          name: column.name
        };

      });

      _.each(data, item => {

        _.each(_.pick(item.importData, refNames), (val, key) => {

          let property = properties[key];

          if (_.includes(property.items, val)) return;

          let isNotExistingValue = val && item.importData[property.ref] === null;

          if (isNotExistingValue) property.items.push(val);

        });

      });

      _.each(properties, property => {
          property.items.sort(property.model.sorter);
      });

      vm.newProperties = _.filter(properties, 'items.length');
      vm.newPropertiesByName = {};

      _.each(vm.newProperties, property => {
        let index = {};
        _.each(property.items, item => index[item] = property);
        vm.newPropertiesByName [property.name] = index;
      });

    }

    function setModelRefs(item, config) {

      _.each(config, function (val) {

        if (val.name != 'baguetteId') {

          var model = Schema.model(val.model);

          item[val.ref] = item[val.name] && _.get(_.first(model.filter({
              where: {
                name: {
                  likei: item[val.name]
                }
              }
            })), 'id') || null;
        }

      });

    }

    function doneClick() {
      $state.go(importConfig.doneSref);
    }

    function cancelLoadDataClick() {

      vm.modifiedData = false;
      vm.columns = false;

      vm.data = false;
      vm.readyToImport = false;
      vm.filesApi.removeAll();

      _.each(vm.recordData, function (val, key) {
        vm.recordData[key] = 0
      })

    }

    function tableHeaderRemoveClick(column) {
      _.remove(vm.columns, {name: column.name});
    }

    function loadDataClick() {

      var total = vm.modifiedData.length;
      var value = 0;

      vm.readyToImport = false;

      vm.progress = {
        value: 0
      };

      var errors = [];
      var results = {
        imported: 0,
        ignored: 0,
        ignoredNotValid: 0
      };

      var saveItem = saveModelItem;

      function importItem() {
        var item = vm.modifiedData.pop();

        if (!item) {
          vm.progress = false;
          vm.modifiedData = errors;
          results.hasErrors = errors.length;
          vm.doneImport = results;
          return;
        }

        if (item.isValidProperties) {
          return saveItem(item)
            .then(res => {
              if (res) {
                results.imported++;
              } else {
                results.ignored++;
              }
            })
            .catch(err => {
              errors.push(_.assign(item, {
                error: _.get(err, 'data.text') || err.data
              }));
            })
            .then(() => {
              vm.progress.value = Math.round(++value / total * 100);
              $timeout().then(importItem);
            });
        } else {
          results.ignoredNotValid++;
          vm.progress.value = Math.round(++value / total * 100);
          $timeout().then(importItem);
        }

      }

      importItem();

    }

    function saveModelItem(item) {

      _.each(columns, column => {
        var name = column.ref || column.name;
        item.instance[name] = item.importData[name];
      });

      return model.create(item.instance);
    }

  }

  angular.module('vseramki')
    .controller('ImportController', ImportController);

})();
