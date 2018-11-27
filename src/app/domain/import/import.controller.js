'use strict';

(function () {

  function ImportController($q, ImportExcel, $timeout, Schema, $scope, ToastHelper, $state, ImportConfig, AlertHelper, $mdMedia) {

    const vm = this;

    const modelName = $state.params.model;
    const model = Schema.model(modelName);
    const importConfig = ImportConfig[modelName];
    const columns = importConfig[modelName + 'Columns'];

    const baguetteModel = Schema.model('Baguette');
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
        ignoredNotValid: 'Некорректных'
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

      const model = property.model;

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

      let isValid = true;

      _.each(propertiesToCheck, function (property) {

        if (_.get(property, 'name') == _.get(property, 'id')) {
          isValid = !!elem[_.get(property, 'id')];
        } else {
          isValid = !!elem[_.get(property, 'id')] && (!!elem[_.get(property, 'name')]);
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

      vm.recordData.omittedRecord++;
    }

    function setModifiedData() {

      const validFields = _.map(vm.columns, column => {

        return {
          id: column.ref || column.name,
          name: column.name,
          replace: column.replace !== false,
          model: column.model,
          ref: column.ref,
          required: column.required,
          searchBy: _.first(column.name.match(/[^.]+$/))
        }

      });

      const requiredProperties = _.filter(validFields, 'required');
      const refFields = _.filter(validFields, 'ref');

      const primaryKey = importConfig.primaryKey;
      const primaryKeyFilter = {};

      vm.modifiedData = [];
      vm.recordData = {
        newRecord: 0,
        modifiedRecord: 0,
        omittedRecord: 0,
        invalidRecord: 0
      };

      _.each(vm.data, function (elem, index) {

        setModelRefs(elem, refFields);

        primaryKeyFilter[primaryKey] = elem[primaryKey];

        let instance = elem[primaryKey] && _.first(model.filter(primaryKeyFilter));

        if (instance) {

          let diff = {};

          _.each(validFields, field => {

            let currentValue = instance[field.id];
            let importValue = elem[field.id];

            if ((field.replace || !currentValue) && importValue && importValue !== currentValue) {
              diff[field.name] = _.get(instance, field.name) || '(пусто)';
            } else {
              elem[field.id] = currentValue;
              if (field.ref) {
                elem[field.name] = _.get(instance, field.name);
              }
            }

          });

          let isValid = checkValidFields(elem, requiredProperties);

          // if (isValid) {
          //   const name = instance.stringName();
          //   if (name !== instance.name) {
          //     diff.name = name;
          //     // instance.name = name;
          //   }
          // }

          let res = {
            isValidProperties: isValid,
            importData: elem,
            instance: instance,
            index
          };

          if (Object.keys(diff).length) {
            vm.recordData.modifiedRecord++;
            res.diff = diff;
          } else if (!isValid) {
            res.notModified = true;
          } else {
            return;
          }

          vm.modifiedData.push(res);

        } else {

          vm.recordData.newRecord++;

          instance = model.createInstance({
            isValid: false
          });

          _.each(instance, (value, key) => {
            let field = _.find(validFields, {id: key});
            if (!field || !value) return;
            elem[key] = value;
            if (field.ref) {
              elem[field.name] = _.get(instance, field.name);
            }
          });

          let isValid = checkValidFields(elem, requiredProperties);

          vm.modifiedData.push({
            isValidProperties: isValid,
            importData: elem,
            instance: instance,
            index
          });

        }

      });

      vm.recordData.notModified = vm.data.length - vm.recordData.modifiedRecord - vm.recordData.newRecord;

      findNewProperties(vm.modifiedData);

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
      let properties = {};
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

        const model = Schema.model(val.model);
        const searchBy = {};

        searchBy[val.searchBy] = {likei: item[val.name]};

        item[val.ref] = item[val.name] && _.get(_.first(model.filter({where: searchBy})), 'id') || null;

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

      const total = vm.modifiedData.length;
      let value = 0;

      vm.readyToImport = false;

      vm.progress = {
        value: 0,
        total: total
      };

      const errors = [];
      const results = {
        imported: 0,
        ignored: 0,
        ignoredNotValid: 0
      };

      const saveItem = saveModelItem;

      function importItem() {
        const item = vm.modifiedData.pop();

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

      const {instance} = item;
      _.each(columns, column => {
        const name = column.ref || column.name;
        instance[name] = item.importData[name];
      });

      // instance.name = instance.stringName();
      return model.create(instance);
    }

  }

  angular.module('vseramki')
    .controller('ImportController', ImportController);

})();
