import { logoBase64 } from './logo';

var reportLogo;

export function addHeadingRow(worksheet, data){
    return worksheet.addRow(data)
}

export function addBlankRow(worksheet, data){
   return  worksheet.addRow(data);
}

export function textSize(data){
    return data.font = {size: 16}
}

export function thinBorderForRow(manycolumn){
    return manycolumn.eachCell((cell, number) => {
        if (number == 1) return;
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });
}

export function textBold(data){
    return data.font = {bold: true }
}

export function textUnderline(data){
    return data.font = {underline: 'double'}
}

export function mergeCell(worksheet, data){
    return worksheet.mergeCells(data);
}

export function wrapText(manycolumn){
    return  manycolumn.eachCell((cell, number) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });
}

export function loadLogo(workbooke, worksheet){
    return  reportLogo =  workbooke.addImage({
        base64: logoBase64,
        extension: 'png',
    });
}

export function addImageOnTopOfExcel(worksheet){
    return  worksheet.addImage(reportLogo, {
        tl: { col: 2.5, row: 0 },
        br: { col: 3.5, row: 4.5 }
    });
}

export function generatedExcelFile(workbooke, excelFileName, fs){
    workbooke.xlsx.writeBuffer().then((dataa) => {
        const blob = new Blob([dataa], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, excelFileName);
    });
}

export function increaseColumnWidth(worksheet, rowLength){
    for(let index = 2; index <= rowLength.length; index++){
        worksheet.getColumn(index).width = 22;
    }
    // // worksheet.getRow(16).height = 30;
    // worksheet.getColumn(3).width = 25;
    // worksheet.getColumn(4).width = 25;
}



