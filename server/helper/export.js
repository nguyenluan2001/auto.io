const {Readable} = require('stream')
const fastcsv = require('fast-csv')
const ExcelJS = require('exceljs');


const exportJSON = (data) => {
        const stream = new Readable()
        stream.push(data)
        stream._read = () => {};                       /* 2 */
        stream.push(null)
        return stream
}
const exportCSV = (data) => fastcsv.write(data, {headers:true})
const exportExcel = ({columns, data}) => {
     const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet 1');
      worksheet.columns = columns;

      // Add data rows
      data.forEach((row) => {
        worksheet.addRow(row);
      });
    // Set headers for the download

    // Send the Excel file as response
    return workbook.xlsx
}

const exportData = async ({type, table, res}) => {
    if(type==='JSON'){
        res.set({
        'Content-Disposition': `attachment; filename='data.json'`,
        'Content-Type': 'application/json',
        });
       return exportJSON(JSON.stringify(table?.rows)).pipe(res) 
    }
   if(type==='CSV'){
        res.set({
        'Content-Disposition': `attachment; filename='data.csv'`,
        'Content-Type': 'application/csv',
        });
        return exportCSV(table?.rows).pipe(res)
    }
    if(type==='EXCEL'){
        res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=data.xlsx`
        );
        const {columns, rows} = table
        return await exportExcel({columns, data:rows}).write(res)

    }
}
module.exports={exportData}