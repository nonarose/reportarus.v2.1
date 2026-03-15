var sheetId = '1etVOgqrr1kFSzqw_1pLU2zgxso3yktsMO0SWAJTfYhQ';
var sheetName = 'Sheet1';

function doPost(e) {
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
  
  // Cek apakah sheet sudah ada header, kalau belum buat header dulu
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Petugas', 'Nama MCCB', 'Saved At', 'Arus R', 'Arus S', 'Arus T', 'Catatan']);
  }
  
  var data = JSON.parse(e.postData.contents);

  for (var mccbName in data) {
    var record = data[mccbName];

    sheet.appendRow([
      record.petugas || "",
      mccbName || "",
      record.savedAt || "",
      record.arus_r || "",
      record.arus_s || "",
      record.arus_t || "",
      record.catatan || ""
    ]);
  }

  return ContentService.createTextOutput("OK");
}
