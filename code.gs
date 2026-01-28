// ================= CONFIG =================
const SHEET_ID = '16UFPhIzxiLhGlKQb4OQN-TM3FJfjGjo-awxpN0wwHT0';
const SHEET_NAME = 'Sheet1';       // Booking sheet
const MAX_PER_DAY = 20;

// ================= ENTRY POINT =================
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.action === 'comment') {
      return jsonResponse(addComment(data));
    }

    // Default → booking
    return jsonResponse(addBooking(data));

  } catch (err) {
    return jsonResponse({ success: false, message: err.toString() });
  }
}

// ================= BOOKING LOGIC =================
function addBooking(data) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

  const doctor = data.doctor;
  const date = data.date;
  const name = data.patientName || data.name;
  const phone = data.phone;

  if (!doctor || !date || !name || !phone) {
    return { success: false, message: 'Missing fields' };
  }

  // ❌ Prevent past-date booking
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bookingDate = new Date(date);

  if (bookingDate < today) {
    return { success: false, message: 'Past date not allowed' };
  }

  // Doctor-wise daily token count
  const tokenNumber = getDoctorDateCount_(sheet, doctor, date) + 1;

  if (tokenNumber > MAX_PER_DAY) {
    return { success: false, message: 'Daily limit reached' };
  }

  sheet.appendRow([
    new Date(),     // Timestamp
    doctor,
    name,
    date,
    `Token ${tokenNumber}`,
    phone,
    'Website'
  ]);

  return {
    success: true,
    token: tokenNumber
  };
}

// ================= COUNT HELPERS =================
function getDoctorDateCount_(sheet, doctor, date) {
  const data = sheet.getDataRange().getValues();
  let count = 0;

  for (let i = 1; i < data.length; i++) {
    const rowDoctor = data[i][1]; // Column B
    const rowDate = data[i][3];   // Column D

    if (rowDoctor === doctor && rowDate === date) {
      count++;
    }
  }
  return count;
}

// ================= COMMENT HANDLING =================
function addComment(data) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

  sheet.appendRow([
    new Date(),                // Timestamp
    'COMMENT',
    data.name || '',
    data.email || '',
    data.phone || '',
    data.message || '',
    'Website'
  ]);

  return { success: true };
}

// ================= JSON RESPONSE =================
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}