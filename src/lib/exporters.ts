import * as XLSX from 'xlsx';

/**
 * Exports an array of objects to an Excel file.
 * @param data The array of data to export.
 * @param fileName The name of the file to be created (e.g., "report.xlsx").
 */
export function exportToExcel(data: any[], fileName: string) {
  if (!data || data.length === 0) {
    console.error("No data available to export.");
    return;
  }

  // Create a worksheet from the data
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  
  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
  // Write the workbook and trigger the download
  XLSX.writeFile(workbook, fileName);
}
