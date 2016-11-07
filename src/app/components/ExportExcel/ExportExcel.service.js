'use strict';

(function () {

  function ExportExcel(moment, XLSX, FileSaver) {


    function getDataToWrite() {

      var table = document.getElementsByTagName('table');
      var out = [];
      var rows = table[0].querySelectorAll('tr');
      var ranges = [];


      for (var R = 0; R < rows.length; ++R) {
        var outRow = [];
        var row = rows[R];
        var columns;

        if (row.querySelectorAll('td').length) {
          columns = row.querySelectorAll('td');
        } else {
          columns = row.querySelectorAll('th')
        }

        for (var C = 0; C < columns.length; ++C) {
          var cell = columns[C];
          var colspan = cell.getAttribute('colspan');
          var rowspan = cell.getAttribute('rowspan');
          var cellValue = cell.innerText || getUrl(cell);

          if (cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;

          //Skip ranges
          ranges.forEach(function (range) {
            if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
              for (var i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
            }
          });

          //Handle Row Span
          if (rowspan || colspan) {
            rowspan = rowspan || 1;
            colspan = colspan || 1;
            ranges.push({s: {r: R, c: outRow.length}, e: {r: R + rowspan - 1, c: outRow.length + colspan - 1}});
          }

          //Handle Value
          outRow.push(cellValue !== "" ? cellValue : null);

          //Handle Colspan
          if (colspan) for (var k = 0; k < colspan - 1; ++k) outRow.push(null);
        }
        out.push(outRow);
      }
      return [out, ranges];
    }

    function getUrl(cell) {

      var imgElem = cell.getElementsByTagName('img')[0];

      if (imgElem) {
        return imgElem.getAttribute('src');
      }

    }

    function Workbook() {
      if (!(this instanceof Workbook)) return new Workbook();
      this.SheetNames = [];
      this.Sheets = {};
    }

    function exportTableToExcel() {

      var oo = getDataToWrite();
      var ranges = oo[1];

      /* original data */
      var data = oo[0];
      var ws_name = "Список багетов";

      var wb = new Workbook(), ws = sheetFromArrayOfArrays(data);

      function sheetFromArrayOfArrays(data) {
        var ws = {};
        var range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}};
        for (var R = 0; R != data.length; ++R) {
          for (var C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            var cell = {v: data[R][C]};
            if (R===0) {
              cell.s = {font: {bold: true}, alignment: {horizontal: 'center'}};
            }
            if (cell.v == null) continue;
            var cell_ref = XLSX.utils.encode_cell({c: C, r: R});
            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            // else if (cell.v instanceof Date) {
            //   cell.t = 'n';
            //   cell.z = XLSX.SSF._table[14];
            //   cell.v = datenum(cell.v);
            // }
            else cell.t = 's';
            ws[cell_ref] = cell;
          }
        }

        if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
        return ws;
      }


      /* add ranges to worksheet */
      ws['!merges'] = ranges;

      /* add worksheet to workbook */
      wb.SheetNames.push(ws_name);
      wb.Sheets[ws_name] = ws;

      var wbOut = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary'});
      var fileName = moment().format('l') + '.xlsx';

      FileSaver.saveWorkBookAs(wbOut, fileName);
    }

    function setCell(ws, cell, ref) {
      ws[XLSX.utils.encode_cell(ref)] = cell;
    }

    function worksheetFromArrayWithConfig(data, config) {
      var ws = {};

      var wsCols = [];

      _.each(config, (col, idx) => {

        var cell = {
          v: col.title,
          t: 's',
          s: {
            font: {bold: true},
            alignment: {horizontal: 'center'}
          }
        };

        setCell(ws, cell, {c: idx, r: 0});

      });

      _.each(config, (col, colIdx) => {

        var maxLength = col.title.length;

        _.each(data, (row, rowIdx) => {

          var val = _.get(row, col.property);

          if (val === null || _.isUndefined(val)) return;

          var cell = {
            v: val,
            t: _.isNumber(val) ? 'n' : 's'
          };

          maxLength = _.max([maxLength, val.toString().length]);

          setCell(ws, cell, {c: colIdx, r: rowIdx + 1});

        });

        wsCols.push({
          wch: maxLength + 2
        });

      });

      var range = {e: {c: config.length - 1, r: data.length}, s: {c: 0, r: 0}};

      ws['!cols'] = wsCols;
      ws['!ref'] = XLSX.utils.encode_range(range);

      return ws;

    }

    function exportArrayWithConfig(data, config, name) {

      var wb = new Workbook();

      name = name || 'Таблица';

      wb.SheetNames.push(name);
      wb.Sheets[name] = worksheetFromArrayWithConfig(data, config);

      var wbOut = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary'});
      var fileName = name + '.xlsx';

      FileSaver.saveWorkBookAs(wbOut, fileName);

    }


    return {
      exportTableToExcel,
      exportArrayWithConfig
    }

  }

  angular.module('vseramki')
    .service('ExportExcel', ExportExcel);

})();
