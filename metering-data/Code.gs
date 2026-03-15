function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ message: "GET request received" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById("1RINOJksDoj6QyNTVi31B50fhR-Nf_COe1HFOqnVHVpc");
    const sheet = ss.getSheetByName("REKAP_ALL");

    // Ambil header kolom
    const header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const headerIndex = {};
    header.forEach((name, i) => headerIndex[name.trim().toLowerCase()] = i);

    // Bentuk baris baru berdasarkan data yang dikirim
    function bentukBaris(row) {
      const values = new Array(header.length).fill("");
      const now = new Date();

      if (headerIndex["timestamp"] !== undefined) values[headerIndex["timestamp"]] = now;
      if (headerIndex["satuan kerja"] !== undefined) values[headerIndex["satuan kerja"]] = row.satuan_kerja || "";
      if (headerIndex["nama petugas"] !== undefined) values[headerIndex["nama petugas"]] = row.petugas || "";
      if (headerIndex["tanggal"] !== undefined) values[headerIndex["tanggal"]] = row.tanggal || "";
      if (headerIndex["shift"] !== undefined) values[headerIndex["shift"]] = row.shift || "";
      if (headerIndex["mcb/pdb"] !== undefined) values[headerIndex["mcb/pdb"]] = row.jenis || row.mcb || "";
      if (headerIndex["r"] !== undefined) values[headerIndex["r"]] = row.arus_r || "";
      if (headerIndex["s"] !== undefined) values[headerIndex["s"]] = row.arus_s || "";
      if (headerIndex["t"] !== undefined) values[headerIndex["t"]] = row.arus_t || "";
      if (headerIndex["catatan"] !== undefined) values[headerIndex["catatan"]] = row.catatan || "";
      if (headerIndex["foto"] !== undefined) values[headerIndex["foto"]] = row.foto || "";
      return values;
    }

    // === Proses tulis ke sheet ===
    const allValues = [];

    if (Array.isArray(data)) {
      data.forEach(row => allValues.push(bentukBaris(row)));
    } else {
      for (let key in data) {
        allValues.push(bentukBaris(data[key]));
      }
    }

    if (allValues.length > 0) {
      sheet.getRange(sheet.getLastRow() + 1, 1, allValues.length, allValues[0].length).setValues(allValues);
    }

    // === Respon sukses ===
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  }
}
