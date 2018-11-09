'use strict';

(function () {

  function ExportExcel(moment, XLSX, FileSaver) {


    function getDataToWrite() {

      const table = document.getElementsByTagName('table');
      const out = [];
      const rows = table[0].querySelectorAll('tr');
      const ranges = [];


      for (let R = 0; R < rows.length; ++R) {
        const outRow = [];
        const row = rows[R];
        let columns;

        if (row.querySelectorAll('td').length) {
          columns = row.querySelectorAll('td');
        } else {
          columns = row.querySelectorAll('th')
        }

        for (let C = 0; C < columns.length; ++C) {
          const cell = columns[C];
          let colspan = cell.getAttribute('colspan');
          let rowspan = cell.getAttribute('rowspan');
          let cellValue = cell.innerText || getUrl(cell);

          if (cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;

          //Skip ranges
          ranges.forEach(function (range) {
            if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
              for (let i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
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
          if (colspan) for (let k = 0; k < colspan - 1; ++k) outRow.push(null);
        }
        out.push(outRow);
      }
      return [out, ranges];
    }

    function getUrl(cell) {

      const imgElem = cell.getElementsByTagName('img')[0];

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

      const oo = getDataToWrite();
      const ranges = oo[1];

      /* original data */
      const data = oo[0];
      const ws_name = "Список багетов";

      const wb = new Workbook(), ws = sheetFromArrayOfArrays(data);

      function sheetFromArrayOfArrays(data) {
        const ws = {};
        const range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}};
        for (let R = 0; R != data.length; ++R) {
          for (let C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            const cell = {v: data[R][C]};
            if (R===0) {
              cell.s = {font: {bold: true}, alignment: {horizontal: 'center'}};
            }
            if (cell.v == null) continue;
            const cell_ref = XLSX.utils.encode_cell({c: C, r: R});
            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else if (cell.v instanceof Date) {
              cell.t = 'n';
              cell.z = XLSX.SSF._table[14];
              cell.v = datenum(cell.v);
            }
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

      const wbOut = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary'});
      const fileName = moment().format('l') + '.xlsx';

      FileSaver.saveWorkBookAs(wbOut, fileName);
    }

    function setCell(ws, cell, ref) {
      ws[XLSX.utils.encode_cell(ref)] = cell;
    }

    function datenum(v, date1904) {
      if (date1904) v += 1462;
      const epoch = Date.parse(v);
      return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
    }

    function worksheetFromArrayWithConfig(data, config) {
      const ws = {};

      const wsCols = [];

      _.each(config, (col, idx) => {

        const cell = {
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

        let maxLength = col.title.length;

        _.each(data, (row, rowIdx) => {

          const val = _.get(row, col.property);

          if (val === null || _.isUndefined(val)) return;

          const cell = {
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

      const range = {e: {c: config.length - 1, r: data.length}, s: {c: 0, r: 0}};

      ws['!cols'] = wsCols;
      ws['!ref'] = XLSX.utils.encode_range(range);

      return ws;

    }

    function exportArrayWithConfig(data, config, name) {

      const wb = new Workbook();

      name = name || 'Таблица';

      wb.SheetNames.push(name);
      wb.Sheets[name] = worksheetFromArrayWithConfig(data, config);

      const wbOut = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary'});
      const fileName = name + '.xlsx';

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
