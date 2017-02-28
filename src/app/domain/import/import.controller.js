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
        hasErrors: 'С ошибками'
      },

      loadDataClick,
      cancelLoadDataClick,
      doneClick,
      tableHeaderRemoveClick,
      tableRowRemoveClick,
      addPropertyClick,
      findNewProperties,
      addAllProps

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

              if (vm.data.length) {
                findNewProperties(vm.data);
              }

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


    function addPropertyClick(col, row, ev) {

      var modelName;
      var propertyLabel;


      if (typeof(row) == 'object') {
        modelName = col.model;
        propertyLabel = col.label.toLowerCase();
      } else {
        modelName = col[0];
        propertyLabel = col[1].toLowerCase();
        var noIsExistingPropertyCheck = true;
      }

      var propertyValue = _.get(row.importData, [col.name]) || row;
      var validFields = _.filter(vm.columns, 'ref');
      var isValidColumn = _.findKey(validFields, {'model': modelName});


      if (isValidColumn >= 0) {

        var model = Schema.model(modelName);

        if (!noIsExistingPropertyCheck) {
          var isExistingProperty = !!_.get(_.first(model.filter({
              where: {
                name: {
                  likei: propertyValue
                }
              }
            })), 'id') || false;
        }

        if (!isExistingProperty || noIsExistingPropertyCheck) {

          AlertHelper.showConfirm(ev, `Добавить ${propertyLabel} "${propertyValue}" ?`)
            .then(() => {
              model.create({name: propertyValue})
                .then((instance) => {
                  if (instance) {
                    ToastHelper.success('Добавлено');
                    setModifiedData();
                    var currentPropName = _.lowerFirst(modelName) + '.name';
                    _.pull(vm.newProperties[currentPropName]['items'], propertyValue);
                  }
                })
                .catch((err) => {
                  if (err.status == 500) {
                    ToastHelper.error('Ошибка сервера');
                  } else {
                    ToastHelper.error('Непредвиденная ошибка');
                  }
                })
            })

        }

      }

    }

    function tableRowRemoveClick(row) {
      _.remove(vm.modifiedData, row);
      vm.recordData.ommitedRecord++;
    }

    function setModifiedData() {


      var validFields = _.map(vm.columns, column => {

        return {
          id: column.ref || column.name,
          name: column.name,
          replace: column.replace !== false,
          model: column.model,
          ref: column.ref
        }

      });

      vm.modifiedData = [];
      vm.recordData = {
        newRecord: 0,
        modifiedRecord: 0,
        ommitedRecord: 0
      };

      _.each(vm.data, function (elem, index) {

        setModelRefs(elem, _.filter(validFields, 'ref'));

        var instance = elem.codeExternal && _.first(model.filter({
            codeExternal: elem.codeExternal
          }));

        if (instance) {

          var diff = {};

          _.each(validFields, field => {
            if ((field.replace || !instance[field.id]) && instance[field.id] !== elem[field.id]) {
              diff[field.name] = _.get(instance, field.name) || '(пусто)';
            } else {
              elem[field.id] = instance[field.id];
            }
          });

          if (Object.keys(diff).length) {

            vm.recordData.modifiedRecord++;

            vm.modifiedData.push({
              importData: elem,
              diff: diff,
              instance: instance,
              index
            });
          }

        } else {

          vm.recordData.newRecord++;

          instance = model.createInstance({
            name: elem.nameExternal,
            isValid: false
          });

          vm.modifiedData.push({
            importData: elem,
            instance: instance,
            index
          });

        }

        diff = {};

      });

      vm.recordData.notModified = vm.data.length - vm.recordData.modifiedRecord - vm.recordData.newRecord;

    }

    function addAllProps(props, modelName, ev) {

      AlertHelper.showConfirm(ev, `Добавить свойства?`)
        .then(() => {
          var model = Schema.model(modelName);
          var promises = _.map(props, function (elem) {

            return model.create({name: elem})
              .then((instance) => {
                if (instance) {
                  setModifiedData();
                  var currentPropName = _.lowerFirst(modelName) + '.name';
                  _.pull(vm.newProperties[currentPropName]['items'], elem);
                }
              })
              .catch(() => {
                return elem;
              });

          });

          $q.all(promises)
            .then(function (res) {
              var failedToWrite = _.compact(res);
              if (failedToWrite.length) {
                ToastHelper.error('Ошибка. Не добавлено: ' + failedToWrite.join(', '));
              } else {
                ToastHelper.success('Элементы добавлены');
              }
            });
        });
    }

    function findNewProperties(data) {

      var propsNamesRegexp = /^.+\.name$/im;
      var propertyName = [];
      var propertyData = {};


      _.each(columns, function (column) {

        if (propsNamesRegexp.test(column.name)) {
          propertyName.push(column.name);
          propertyData[column.name] = [];
          propertyData[column.name].items = [];
          propertyData[column.name].names = [column.model, column.label];
        }
      });

      _.each(data, function (object) {
        _.each(object, function (val, key) {
          var idx = _.indexOf(propertyName, key);
          if (idx >= 0 && val != null) {
            var dup = propertyData[key].items.includes(val);
            if (!dup) {
              var model = Schema.model(propertyData[key].names[0]);
              var isExistingValue = _.get(_.first(model.filter({
                  where: {
                    name: {
                      likei: val
                    }
                  }
                })), 'name') || false;
              if (!isExistingValue) {
                propertyData[key].items.push(val);
              }

            }
          }
        });
      });

      _.forIn(propertyData, function (val, key) {

        if (val.items.length == 0)
          return;

        if (key != 'frameSize.name') {
          propertyData[key].items.sort();
        } else {
          val.items.sort(function (a, b) {
            return a.split('x')[0] - b.split('x')[0] || a.split('x')[1] - b.split('x')[1]
          });
        }

      });


      vm.newProperties = propertyData;

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
        ignored: 0
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
      }

      importItem();

    }

    function saveModelItem(item) {

      // _.assign(item.instance, item.importData);

      _.each(columns, column => {
        var name = column.ref || column.name;
        item.instance[name] = item.importData[name];
      });

      return model.create(item.instance);

      //cancelLoadDataClick();
    }

  }

  angular.module('vseramki')
    .controller('ImportController', ImportController);

})();
