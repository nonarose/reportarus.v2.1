function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ message: "Foto API active" })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doOptions(e) {
  // Browser preflight request (CORS)
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const folderId = "1WA_0TD65Apdhvla9Bh7EK-1LEteS09on"; // ID folder Drive kamu
    const folder = DriveApp.getFolderById(folderId);

    const jsonData = JSON.parse(e.postData.contents);
    const fileData = jsonData.filedata;
    const mimeType = jsonData.mimetype || "image/jpeg";

    if (!fileData) throw new Error("Tidak ada filedata dikirim");

    const bytes = Utilities.base64Decode(fileData);
    const blob = Utilities.newBlob(
      bytes,
      mimeType,
      "Foto_" + new Date().toISOString() + ".jpg"
    );
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    const url = "https://drive.google.com/uc?id=" + file.getId();

    return ContentService.createTextOutput(
      JSON.stringify({ status: "ok", url })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
