import ExcelJS from 'exceljs';

async function checkColumns() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('/mnt/d/XL/timesheet/Polosan Oke Mantapp.xlsx');

  const ws = wb.getWorksheet("Timesheet");
  if (!ws) {
    console.log("No Timesheet found!");
    return;
  }

  // Let's check row 5 which is the 1st of the month
  const row5 = ws.getRow(5);

  console.log("Values on Row 5:");
  row5.eachCell((cell, colNumber) => {
    console.log(`Column ${colNumber} (${cell.address}): value=${cell.value}, formula=${cell.formula}, border=${JSON.stringify(cell.border)}, fill=${JSON.stringify(cell.fill)}`);
  });

  console.log("\nRow 35 (Day 31) check:");
  const row35 = ws.getRow(35);
  row35.eachCell((cell, colNumber) => {
    console.log(`Column ${colNumber} (${cell.address}): value=${cell.value}, formula=${cell.formula}`);
  });
}

checkColumns().catch(console.error);
