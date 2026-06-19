import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// ── Colours (dark navy / emerald - matches LibriTVSH premium theme) ─────────
const CLR = {
  headerBg: "FF0D2137", // dark navy
  headerFg: "FFFFFFFF",
  titleBg:  "FF0A6640", // deep emerald
  titleFg:  "FFFFFFFF",
  labelFg:  "FF94A3B8", // soft grey
  valueFg:  "FFF1F5F9", // near-white
  rowAlt:   "FF111D2E", // surface-2
  rowEven:  "FF0D1520", // surface
  totBg:    "FF059669", // emerald
  totFg:    "FFFFFFFF",
  border:   "FF1E3A5F",
  tableHead:   "FF10B981", // emerald green
  tableHeadFg: "FF000000",
};

const COLS = ["A", "B", "C", "D", "E", "F"];

const border = (color = CLR.border) => ({
  top:    { style: "thin", color: { argb: color } },
  left:   { style: "thin", color: { argb: color } },
  bottom: { style: "thin", color: { argb: color } },
  right:  { style: "thin", color: { argb: color } },
});

const fill = (argb) => ({ type: "pattern", pattern: "solid", fgColor: { argb } });

const font = (bold = false, color = CLR.valueFg, size = 11) => ({
  bold, color: { argb: color }, size, name: "Calibri",
});

// Helper function to guarantee Kosovo date format (dd.mm.yyyy)
const formatKosovoDate = (dateVal, separator = ".") => {
  if (!dateVal) return "-";
  const d = new Date(dateVal);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}${separator}${month}${separator}${year}`;
};

/**
 * Exports the LibriTVSH invoice list as a beautifully styled ExcelJS workbook.
 *
 * @param {Array}  invoices         - The filtered+sorted invoice array from state
 * @param {Array}  furnitoriOptions - The furnitori label/value options array
 * @param {Object} totals           - { paTvsh, tvsh18, tvsh8, total }
 */
export async function exportInvoicesExcel(invoices, furnitoriOptions, totals) {
  const fmt = (v) => `${parseFloat(v || 0).toFixed(2)} €`;
  const dateStr = formatKosovoDate(new Date(), "-"); // e.g., 10-06-2026 for filename

  const wb = new ExcelJS.Workbook();
  wb.creator = "LibriTVSH";
  wb.created = new Date();

  const ws = wb.addWorksheet("Libri TVSH", {
    views: [{ state: "frozen", ySplit: 6 }],
    properties: { tabColor: { argb: CLR.tableHead } },
  });

  // ── Column widths ───────────────────────────────────────────────────────────
  ws.columns = [
    { width: 14 }, // A  Data
    { width: 28 }, // B  Furnitori
    { width: 20 }, // C  Nr. Faturës
    { width: 18 }, // D  VL. Pa TVSH €
    { width: 16 }, // E  TVSH 18% €
    { width: 16 }, // F  TVSH 8% €
  ];

  // ── ROW 1: Title ────────────────────────────────────────────────────────────
  const titleRow = ws.addRow(["Libri TVSH - Regjistri i Faturave", "", "", "", "", ""]);
  ws.mergeCells("A1:F1");
  titleRow.height = 34;
  const titleCell = titleRow.getCell("A");
  titleCell.font  = { bold: true, color: { argb: CLR.titleFg }, size: 16, name: "Calibri" };
  titleCell.fill  = fill(CLR.titleBg);
  titleCell.alignment = { vertical: "middle", horizontal: "center" };

  // ── ROW 2: Blank spacer ─────────────────────────────────────────────────────
  ws.addRow([]).height = 6;

  // ── INFO BLOCK: 2 rows × 2 label-value pairs ─────────────────────────────────
  const exportDate = formatKosovoDate(new Date(), "."); // dd.mm.yyyy for header
  const infoData = [
    ["Data e Eksportit:", exportDate,              "Totali Pa TVSH (€):", fmt(totals.paTvsh)],
    ["Nr. Faturave:",     String(invoices.length), "Totali Gjithsej (€):", fmt(totals.total)],
  ];

  infoData.forEach(([lA, vA, lC, vC]) => {
    const row = ws.addRow([lA, vA, lC, vC, "", ""]);
    row.height = 20;

    COLS.forEach(c => {
      row.getCell(c).fill = fill(CLR.headerBg);
    });

    ["A", "C"].forEach(c => {
      row.getCell(c).font      = font(true, CLR.labelFg, 9);
      row.getCell(c).alignment = { vertical: "middle", horizontal: "left" };
    });
    ["B", "D"].forEach(c => {
      row.getCell(c).font      = font(false, CLR.valueFg, 9);
      row.getCell(c).alignment = { vertical: "middle", horizontal: "left" };
    });
  });

  // ── ROW 5: Blank spacer ─────────────────────────────────────────────────────
  const blank = ws.addRow([]);
  blank.height = 6;
  COLS.forEach(c => blank.getCell(c).fill = fill(CLR.headerBg));

  // ── ROW 6: Table header ─────────────────────────────────────────────────────
  const tHead = ws.addRow([
    "Data", "Furnitori", "Nr. Faturës",
    "VL. Pa TVSH (€)", "TVSH 18% (€)", "TVSH 8% (€)",
  ]);
  tHead.height = 24;
  COLS.forEach((c) => {
    const cell = tHead.getCell(c);
    cell.fill  = fill(CLR.tableHead);
    cell.font  = font(true, CLR.tableHeadFg, 11);
    cell.border = border(CLR.border);
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  // ── Data rows ───────────────────────────────────────────────────────────────
  invoices.forEach((item, idx) => {
    const bgArgb = idx % 2 === 0 ? CLR.rowEven : CLR.rowAlt;
    const furnLabel = furnitoriOptions.find((opt) => opt.value === item.furnitori)?.label || item.furnitori || "-";

    const row = ws.addRow([
      formatKosovoDate(item.data), // dd.mm.yyyy
      furnLabel,
      item.nrFatures || "-",
      parseFloat(item.vlPaTvsh || 0), // pure number for Excel
      parseFloat(item.tvsh18   || 0), // pure number for Excel
      parseFloat(item.tvsh8    || 0), // pure number for Excel
    ]);
    row.height = 19;

    COLS.forEach((c) => {
      const cell = row.getCell(c);
      cell.fill   = fill(bgArgb);
      cell.font   = font(false, CLR.valueFg);
      cell.border = border();

      if (["D", "E", "F"].includes(c)) {
        cell.alignment = { horizontal: "right" };
        cell.numFmt = '#,##0.00'; // Formats number dynamically inside Excel
      } else {
        cell.alignment = { horizontal: "left" };
      }
    });
  });

  // ── Totals row ──────────────────────────────────────────────────────────────
  const totRow = ws.addRow([
    "TOTALI", "", "",
    totals.paTvsh,
    totals.tvsh18,
    totals.tvsh8,
  ]);
  totRow.height = 24;
  COLS.forEach((c) => {
    const cell = totRow.getCell(c);
    cell.fill   = fill(CLR.totBg);
    cell.font   = font(true, CLR.totFg, 11);
    cell.border = border("FF047857");

    if (["D", "E", "F"].includes(c)) {
      cell.alignment = { horizontal: "right" };
      cell.numFmt = '#,##0.00';
    }
  });

  // ── Branding ────────────────────────────────────────────────────────────────
  ws.addRow([]);
  const brandRow = ws.addRow([
    "© LibriTVSH by Rilind Kyçyku", "", "", "", "", "WWW.RILINDKYCYKU.DEV",
  ]);
  brandRow.height = 20;
  ws.mergeCells(brandRow.number, 1, brandRow.number, 4);
  ws.mergeCells(brandRow.number, 5, brandRow.number, 6);

  brandRow.getCell(1).font = { italic: true, size: 9, color: { argb: "FF94A3B8" }, name: "Calibri" };
  brandRow.getCell(1).alignment = { horizontal: "left", vertical: "middle" };

  brandRow.getCell(6).font = { bold: true, size: 9, color: { argb: "FF10B981" }, name: "Calibri" };
  brandRow.getCell(6).alignment = { horizontal: "right", vertical: "middle" };
  // Makes the website a clickable link inside Excel
  brandRow.getCell(6).value = {
    text: "WWW.RILINDKYCYKU.DEV",
    hyperlink: "https://www.rilindkycyku.dev",
    tooltip: "Visit Website",
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  const buffer = await wb.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    `LibriTVSH_${dateStr}.xlsx`
  );
}
