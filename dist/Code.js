// Ganti dengan ID Spreadsheet V2 kamu yang baru
var sheetId = '1FHIM7OPukJxn2Vp20p-Y6AjvEyE1WgKtMbI8Wsqr2r8'; 
var sheetName = 'REKAP_ALL'; // Pastikan nama sheet-nya sama

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000); // Pasang satpam antrean

  try {
    var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
    var data = JSON.parse(e.postData.contents);
    var submissionTime = new Date();

    // Susun data jadi 1 baris panjang (Pastikan urutannya sama persis dengan urutan kolom di Sheet V2)
    // Format: Timestamp | Tanggal | Shift | Petugas | Lokasi | MDB(R,S,T) | Pem(R,S,T) | Sar(R,S,T) | Catatan | Link Foto
    var rowData = [
      submissionTime,
      data.tanggal || "",
      data.shift || "",
      data.petugas || "",
      "Tx Gombel", 
      data.mdb_r || "", data.mdb_s || "", data.mdb_t || "",
      data.pem_r || "", data.pem_s || "", data.pem_t || "",
      data.sar_r || "", data.sar_s || "", data.sar_t || "",
      data.catatan || "",
      data.link_foto || ""
    ];

    // Tembakkan 1 baris itu ke spreadsheet
    sheet.appendRow(rowData);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Data 1 baris berhasil masuk!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Tambahan buat jaga-jaga kalau web ngecek koneksi
function doGet(e) {
  return ContentService.createTextOutput("Sistem V2 Aktif").setMimeType(ContentService.MimeType.TEXT);
}
function doOptions(e) {
  return ContentService.createTextOutput('');
}
