import ExcelJS from 'exceljs';

async function checkMerges() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('/mnt/d/XL/timesheet/Polosan Oke Mantapp.xlsx');

  const ws = wb.getWorksheet("Timesheet");
  if (!ws) {
    console.log("No Timesheet found!");
    return;
  }

  // Look for any merged cells that intersect row 34
  const merges = ws.model.merges || [];
  console.log("Merged cells that touch row 34:");
  for (const merge of merges) {
    if (merge.includes("34")) {
      console.log(merge);
    }
  }
}

checkMerges().catch(console.error);