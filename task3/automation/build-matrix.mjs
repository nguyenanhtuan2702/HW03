import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { Workbook, SpreadsheetFile } = await import(pathToFileURL(require.resolve('@oai/artifact-tool')).href);
const { entries, environment, platforms, statuses, counts, runMetadata } = require('./summarize.cjs');
const task = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const book = Workbook.create();
const summary = book.worksheets.add('Tổng hợp');
const matrix = book.worksheets.add('Ma trận');
const logs = book.worksheets.add('Thực thi');
const labels = { 'chrome-windows': 'Chrome / Windows', 'firefox-windows': 'Firefox / Windows', 'safari-apple': 'Safari / Apple' };
const palette = { Passed: '#D9F2E5', Failed: '#FDE1E1', Blocked: '#FFE9C7', 'Not Run': '#E8EBF1', 'N/A': '#EBE6F6' };

function setTable(sheet, headers, data, widths, rowHeight) {
  const last = String.fromCharCode(64 + headers.length);
  const end = data.length + 1;
  const content = sheet.getRange(`A1:${last}${end}`);
  content.values = [headers, ...data];
  content.format.font = { name: 'Calibri', size: 11, color: '#203047' };
  content.format.wrapText = true;
  content.format.verticalAlignment = 'center';
  sheet.getRange(`A2:${last}${end}`).format.rowHeight = rowHeight;
  const header = sheet.getRange(`A1:${last}1`);
  header.format.fill = '#14263D';
  header.format.font = { name: 'Calibri', size: 11, color: '#FFFFFF', bold: true };
  header.format.rowHeight = 32;
  for (const [index, width] of widths.entries()) {
    const col = String.fromCharCode(65 + index);
    sheet.getRange(`${col}1:${col}${end}`).format.columnWidth = width;
  }
  sheet.freezePanes.freezeRows(1);
}

setTable(matrix,
  ['ID', 'IA', 'Màn hình', 'Ca kiểm', 'Expected Result', 'Task 1', 'Chrome', 'Firefox', 'Safari', 'Phân loại', 'Khác biệt / ghi chú', 'Ảnh Chrome', 'Ảnh Firefox', 'Ảnh Safari', 'GitHub Issue'],
  entries.map((entry) => {
    const observations = platforms.map((key) => entry.outcomes[key]);
    const differences = observations.flatMap((outcome, index) => {
      if (entry.classification === 'Khác biệt cần xác minh') return [`${labels[platforms[index]]}: ${outcome.status} · ${outcome.actual || outcome.notes || ''}`];
      if (outcome.status === 'Not Run' || outcome.status === 'Passed' || !outcome.notes) return [];
      return [`${labels[platforms[index]]}: ${outcome.notes}`];
    }).join('\n');
    return [entry.id, entry.ia, entry.screen, entry.item, entry.expected, entry.task1, ...observations.map((item) => item.status), entry.classification, differences,
      ...observations.map((item) => item.evidence || ''), entry.issue];
  }), [10, 11, 17, 32, 48, 13, 13, 13, 13, 29, 48, 41, 41, 40, 43], 78);

setTable(logs,
  ['ID', 'IA', 'Màn hình', 'Nền tảng', 'Kết quả', 'Thời điểm UTC+7', 'Tiền điều kiện', 'Dữ liệu', 'Các bước đã thực hiện', 'Quan sát', 'Lỗi mạng / console / dialog', 'Ảnh', 'Log thực thi', 'Trình duyệt / phiên bản', 'Hệ điều hành', 'Thiết bị', 'Sauce job ID'],
  entries.flatMap((entry) => platforms.map((platform) => {
    const result = entry.outcomes[platform];
    const metadata = runMetadata[result.log];
    const diagnostics = [...(result.diagnostics ?? []).map((item) => Object.values(item).filter(Boolean).join(' ')),
      ...(result.dialogs ?? []).map(({type,message}) => `dialog ${type}: ${message}`)];
    return [entry.id, entry.ia, entry.screen, labels[platform], result.status, result.timestamp || '', entry.preconditions, entry.testData,
      result.steps?.join('\n') || '', result.actual || result.notes || '', diagnostics.slice(0, 6).join('\n'), result.evidence || '', result.log || '',
      result.browser || metadata?.browser || '', result.os || metadata?.os || '', metadata?.device || '', result.jobId || metadata?.jobId || ''];
  })), [9, 10, 15, 24, 13, 25, 34, 38, 52, 53, 48, 41, 44, 30, 31, 25, 36], 94);

setTable(summary,
  ['Môi trường', 'Tổng', 'Có lượt thử', ...statuses, 'Browser đo được', 'Log chính', 'Ảnh cửa sổ'],
  platforms.map((key) => [labels[key], entries.length, entries.length - counts[key]['Not Run'] - counts[key]['N/A'], ...statuses.map((s) => counts[key][s]),
    environment[key].primary?.metadata.browser || 'Chưa chạy', environment[key].primary ? `automation/${environment[key].primary.name}` : '', environment[key].proof?.metadata.platformEvidence || '']),
  [25, 11, 15, 12, 12, 12, 12, 10, 30, 46, 46], 43);

for (let i = 0; i < entries.length; i++) {
  const entry = entries[i];
  const row = i + 2;
  for (const [index, status] of [entry.task1, ...platforms.map((key) => entry.outcomes[key].status)].entries()) {
    const col = String.fromCharCode(70 + index);
    matrix.getRange(`${col}${row}`).format.fill = palette[status];
  }
  for (const [index, key] of platforms.entries()) {
    logs.getRange(`E${i * platforms.length + index + 2}`).format.fill = palette[entry.outcomes[key].status];
  }
}
summary.getRange('A6:I6').merge();
summary.getRange('A6').values = [['So sánh chỉ dựa trên kết quả đã quan sát. Ca không đủ điều kiện giữ trạng thái Blocked hoặc Not Run.']];
summary.getRange('A6:I6').format.fill = '#E8EFF7';
summary.getRange('A6:I6').format.rowHeight = 30;
book.recalculate();
const preview = await book.render({ sheetName: 'Tổng hợp', range: 'A1:I6', scale: 1, format: 'png' });
if (process.env.HW03_MATRIX_PREVIEW) await fs.writeFile(process.env.HW03_MATRIX_PREVIEW, new Uint8Array(await preview.arrayBuffer()));
await (await SpreadsheetFile.exportXlsx(book)).save(path.join(task, 'cross_browser_matrix.xlsx'));
