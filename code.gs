// Code.gs - PASTE THIS
const SHEET_ID = '16UFPhIzxiLhGlKQb4OQN-TM3FJfjGjo-awxpN0wwHT0';
const SHEET_NAME = 'Sheet1'; // Your sheet tab name
const MAX_PER_DAY = 20;

function doGet(e) {
  if (e.parameter.action === 'count') {
    return ContentService.createTextOutput(JSON.stringify(getCount(e.parameter.date))).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput('Invalid request');
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data.action === 'add') {
    return ContentService.createTextOutput(JSON.stringify(addBooking(data))).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput('Invalid request');
}

function getCount(date) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  let count = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i][3] == date) count++; // Column D = Date
  }
  return { count: count };
}

function addBooking(data) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const count = getCount(data.date).count + 1;
  
  if (count > MAX_PER_DAY) {
    return { success: false, message: 'Daily limit reached' };
  }
  
  sheet.appendRow([
    '', data.doctor, data.name, data.date, `Token ${count}`, data.phone, data.timestamp
  ]);
  
  return { success: true, tokenNumber: count };
}


// UPDATE Apps Script Code.gs - Add comment handling
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  
  if (data.action === 'comment') {
    return ContentService.createTextOutput(JSON.stringify(addComment(data))).setMimeType(ContentService.MimeType.JSON);
  }
  // ... existing booking code
}

function addComment(data) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  sheet.appendRow([
    '', data.type, data.name, data.email, data.phone, data.message, data.timestamp
  ]);
  return { success: true };
}
