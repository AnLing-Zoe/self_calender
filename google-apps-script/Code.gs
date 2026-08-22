const SHEET_NAME = '排程細項';
const HEADERS = ['日期', '時間起', '時間迄', '種類', '排程主旨', '對象', '地點', '內容備註', 'ID', '建立時間'];
const CATEGORY_SHEET_NAME = '種類維護';
const CATEGORY_HEADERS = ['種類', '色號'];

function doGet() {
  try {
    const sheet = getSheet();
    ensureHeaders(sheet);
    ensureIds(sheet);
    return json({
      ok: true,
      rows: sheet.getDataRange().getDisplayValues(),
      categories: getCategorySheet().getDataRange().getDisplayValues(),
    });
  } catch (error) {
    return json({ok: false, error: error.message});
  }
}

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents);
    const sheet = getSheet();
    ensureHeaders(sheet);
    ensureIds(sheet);

    if (payload.action === 'saveCategory') {
      const categorySheet = getCategorySheet();
      const category = payload.category;
      const previousName = String(payload.previousName || category.name).trim();
      const row = findCategoryRow(categorySheet, previousName);
      const values = [[String(category.name).trim(), String(category.color).trim()]];
      if (row) categorySheet.getRange(row, 1, 1, CATEGORY_HEADERS.length).setValues(values);
      else categorySheet.appendRow(values[0]);
      if (previousName && previousName !== category.name) renameScheduleCategory(sheet, previousName, category.name);
      return json({ok: true});
    }

    if (payload.action === 'deleteCategory') {
      const categorySheet = getCategorySheet();
      const row = findCategoryRow(categorySheet, payload.category.name);
      if (!row) throw new Error('找不到要刪除的種類');
      categorySheet.deleteRow(row);
      return json({ok: true});
    }

    if (payload.action === 'replaceCategories') {
      const categorySheet = getCategorySheet();
      if (categorySheet.getLastRow() > 1) {
        categorySheet.getRange(2, 1, categorySheet.getLastRow() - 1, CATEGORY_HEADERS.length).clearContent();
      }
      const categories = payload.categories || [];
      if (categories.length) {
        categorySheet.getRange(2, 1, categories.length, CATEGORY_HEADERS.length).setValues(
          categories.map(function(category) { return [category.name, category.color]; })
        );
      }
      return json({ok: true});
    }

    if (payload.action === 'delete') {
      const row = findRow(sheet, payload.schedule.id);
      if (!row) throw new Error('找不到要刪除的排程');
      sheet.deleteRow(row);
      return json({ok: true});
    }

    if (payload.action !== 'save') throw new Error('不支援的操作');
    const schedule = payload.schedule;
    const id = schedule.id || Utilities.getUuid();
    const values = [
      schedule.date.replaceAll('-', '/'),
      schedule.startTime,
      schedule.endTime,
      payload.categoryName,
      schedule.title,
      schedule.target,
      schedule.location,
      stripHtml(schedule.content),
      id,
      schedule.createdAt || Date.now(),
    ];
    const row = findRow(sheet, id);
    if (row) sheet.getRange(row, 1, 1, HEADERS.length).setValues([values]);
    else sheet.appendRow(values);

    return json({ok: true, schedule: Object.assign({}, schedule, {id: id})});
  } catch (error) {
    return json({ok: false, error: error.message});
  }
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.getSheets()[0];
}

function getCategorySheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(CATEGORY_SHEET_NAME);
  if (!sheet) throw new Error('找不到「' + CATEGORY_SHEET_NAME + '」工作表');
  ensureCategoryHeaders(sheet);
  return sheet;
}

function ensureCategoryHeaders(sheet) {
  CATEGORY_HEADERS.forEach(function(header, index) {
    if (!sheet.getRange(1, index + 1).getValue()) sheet.getRange(1, index + 1).setValue(header);
  });
}

function ensureHeaders(sheet) {
  const current = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), HEADERS.length)).getValues()[0];
  HEADERS.forEach(function(header, index) {
    if (!current[index]) sheet.getRange(1, index + 1).setValue(header);
  });
}

function ensureIds(sheet) {
  if (sheet.getLastRow() < 2) return;
  const range = sheet.getRange(2, 9, sheet.getLastRow() - 1, 2);
  const values = range.getValues();
  let changed = false;
  values.forEach(function(row) {
    if (!row[0]) {
      row[0] = Utilities.getUuid();
      changed = true;
    }
    if (!row[1]) {
      row[1] = Date.now();
      changed = true;
    }
  });
  if (changed) range.setValues(values);
}

function findRow(sheet, id) {
  if (!id || sheet.getLastRow() < 2) return 0;
  const ids = sheet.getRange(2, 9, sheet.getLastRow() - 1, 1).getValues().flat();
  const index = ids.indexOf(id);
  return index < 0 ? 0 : index + 2;
}

function findCategoryRow(sheet, name) {
  if (!name || sheet.getLastRow() < 2) return 0;
  const names = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getDisplayValues().flat();
  const index = names.indexOf(String(name).trim());
  return index < 0 ? 0 : index + 2;
}

function renameScheduleCategory(sheet, previousName, name) {
  if (sheet.getLastRow() < 2) return;
  const range = sheet.getRange(2, 4, sheet.getLastRow() - 1, 1);
  const values = range.getDisplayValues();
  let changed = false;
  values.forEach(function(row) {
    if (row[0].trim() === previousName) {
      row[0] = name;
      changed = true;
    }
  });
  if (changed) range.setValues(values);
}

function stripHtml(html) {
  return String(html || '')
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
