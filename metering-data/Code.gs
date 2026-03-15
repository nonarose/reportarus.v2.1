function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ message: "Sistem Metering V2 Aktif" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doOptions(e) {
  return ContentService.createTextOutput('');
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const data = JSON.parse(e.postData.contents);
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("REKAP_ALL");
    if (!sheet) throw new Error("Sheet REKAP_ALL tidak ditemukan.");

    const lastCol = sheet.getLastColumn();
    if (lastCol === 0) throw new Error("Header tidak ditemukan.");

    // Mapping header agar tahan banting walau kolom digeser
    const header = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    const headerIndex = {};
    header.forEach((name, i) => {
      if (name) headerIndex[name.toString().trim().toLowerCase()] = i;
    });

    const rowValues = new Array(header.length).fill("");
    const submissionTime = new Date();

    // Pemetaan ke 16 Kolom
    if (headerIndex["timestamp"] !== undefined) rowValues[headerIndex["timestamp"]] = submissionTime;
    if (headerIndex["tanggal"] !== undefined) rowValues[headerIndex["tanggal"]] = data.tanggal || "";
    if (headerIndex["shift"] !== undefined) rowValues[headerIndex["shift"]] = data.shift || "";
    if (headerIndex["nama petugas"] !== undefined) rowValues[headerIndex["nama petugas"]] = data.petugas || "";
    if (headerIndex["lokasi / tx"] !== undefined) rowValues[headerIndex["lokasi / tx"]] = data.satuan_kerja || "Tx Gombel";

    // MDB
    if (headerIndex["mdb utama - r"] !== undefined) rowValues[headerIndex["mdb utama - r"]] = data.mdb_r || "";
    if (headerIndex["mdb utama - s"] !== undefined) rowValues[headerIndex["mdb utama - s"]] = data.mdb_s || "";
    if (headerIndex["mdb utama - t"] !== undefined) rowValues[headerIndex["mdb utama - t"]] = data.mdb_t || "";

    // PDB Pemancar
    if (headerIndex["pdb pemancar - r"] !== undefined) rowValues[headerIndex["pdb pemancar - r"]] = data.pem_r || "";
    if (headerIndex["pdb pemancar - s"] !== undefined) rowValues[headerIndex["pdb pemancar - s"]] = data.pem_s || "";
    if (headerIndex["pdb pemancar - t"] !== undefined) rowValues[headerIndex["pdb pemancar - t"]] = data.pem_t || "";

    // PDB Sarpras
    if (headerIndex["pdb sarpras - r"] !== undefined) rowValues[headerIndex["pdb sarpras - r"]] = data.sar_r || "";
    if (headerIndex["pdb sarpras - s"] !== undefined) rowValues[headerIndex["pdb sarpras - s"]] = data.sar_s || "";
    if (headerIndex["pdb sarpras - t"] !== undefined) rowValues[headerIndex["pdb sarpras - t"]] = data.sar_t || "";

    // Catatan & Link Foto
    if (headerIndex["catatan"] !== undefined) rowValues[headerIndex["catatan"]] = data.catatan || "";
    if (headerIndex["link foto"] !== undefined) rowValues[headerIndex["link foto"]] = data.link_foto || "";

    sheet.appendRow(rowValues);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Data Metering Berhasil Disimpan" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
