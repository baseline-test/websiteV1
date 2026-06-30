/* =================================================================
   BASELINE — GOOGLE APPS SCRIPT (the free "connector" to your Sheet)
   =================================================================
   This code lives inside your Google Sheet, not on the website.
   It catches form submissions and writes each one as a new row.
   See README.md for step-by-step setup. In short:
     1. Open your Sheet → Extensions → Apps Script
     2. Delete whatever's there, paste THIS in, Save
     3. Deploy → New deployment → type "Web app"
        - Execute as: Me
        - Who has access: Anyone
     4. Copy the Web app URL it gives you → paste into script.js
   ================================================================= */

const SHEET_NAME = "Waitlist"; // the tab data gets written to (created if missing)

function doPost(e) {
  try {
    const params = (e && e.parameter) ? e.parameter : {};

    // Honeypot guard: if the hidden "company" field came through filled, it's a bot.
    if (params.company && params.company.trim() !== "") {
      return jsonOut({ result: "ignored" });
    }

    const name  = (params.name  || "").toString().trim();
    const email = (params.email || "").toString().trim();

    if (!email) {
      return jsonOut({ result: "error", message: "Missing email" });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    // Add a header row the first time.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Email"]);
    }

    sheet.appendRow([new Date(), name, email]);
    return jsonOut({ result: "success" });

  } catch (err) {
    return jsonOut({ result: "error", message: err.message });
  }
}

// Lets you open the Web app URL in a browser to confirm it's live.
function doGet() {
  return jsonOut({ result: "ok", message: "Baseline waitlist endpoint is running." });
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
