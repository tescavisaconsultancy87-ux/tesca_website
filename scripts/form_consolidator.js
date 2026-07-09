/**
 * Google Apps Script: Multi-Form Responses Router & Consolidator
 * 
 * DESIGN:
 * This script runs on a single main sheet (e.g. "Sheet1") where all raw form submissions
 * are dumped. It automatically scans the raw rows, classifies each submission based on its
 * fields and source, and routes it to both:
 *   1. Its dedicated target tab ("Counselling", "Inquiry", "Eligibility", "Partnership")
 *   2. The master consolidated tab ("Master Responses")
 * 
 * Instructions:
 * 1. Open your Google Spreadsheet (named "website leads / inquiry").
 * 2. Go to Extensions > Apps Script.
 * 3. Delete any boilerplate code and paste this entire script.
 * 4. Save and click "Run" (authorizing permissions when prompted).
 * 5. Set up an installable trigger for "syncAllData" to run "On change" from the spreadsheet.
 */

const CONFIG = {
  // Name of the raw sheet where all data initially lands
  RAW_SHEET_NAME: "Sheet1",
  
  // Name of the master sheet combining all standardized data
  MASTER_SHEET_NAME: "Master Responses",
  
  // Names of the 4 dedicated target sheets
  TARGET_SHEETS: {
    COUNSELLING: "Counselling",
    INQUIRY: "Inquiry",
    ELIGIBILITY: "Eligibility",
    PARTNERSHIP: "Partnership"
  },
  
  // Standardized headers for the Master Responses sheet
  MASTER_HEADERS: [
    "Timestamp",
    "Form Source",
    "Full Name",
    "Email",
    "Phone Number",
    "Counselling Mode",
    "Preferred Countries",
    "Message/Proposal"
  ],
  
  // Clean headers for each dedicated sheet
  TARGET_HEADERS: {
    "Counselling": ["Timestamp", "Full Name", "Email", "Phone Number", "Counselling Mode", "Preferred Countries", "Message"],
    "Inquiry": ["Timestamp", "Full Name", "Email", "Phone Number", "Message"],
    "Eligibility": ["Timestamp", "Full Name", "Email", "Phone Number", "Counselling Mode", "Preferred Countries"],
    "Partnership": ["Timestamp", "Full Name", "Email", "Phone Number", "Message"]
  },
  
  // Raw header mapping aliases to clean fields (case-insensitive)
  FIELD_MAPPING: {
    "Timestamp": ["timestamp", "date", "time"],
    "Full Name": ["full name", "name", "your name", "what is your name?", "client name", "student name"],
    "Email": ["email", "email address", "your email", "e-mail", "contact email"],
    "Phone Number": ["mobile number", "phone number", "phone", "contact number", "mobile", "phone no", "tel"],
    "Counselling Mode": ["counselling mode", "mode of counselling", "mode"],
    "Preferred Countries": ["preferred countries", "preferred country", "country preference", "country", "target country"],
    "Message": ["message", "comments", "questions", "tell us more", "details", "description", "partnership proposal", "proposal"]
  }
};

/**
 * Creates a custom menu in the Google Sheets UI when the spreadsheet is opened.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Form Manager")
    .addItem("🔄 Sync & Sort Data Now", "syncAllData")
    .addToUi();
}

/**
 * Main function: Reads raw data from Sheet1, classifies/cleans, and writes to target tabs.
 */
function syncAllData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rawSheet = ss.getSheetByName(CONFIG.RAW_SHEET_NAME);
  
  if (!rawSheet) {
    throw new Error(`Raw source sheet "${CONFIG.RAW_SHEET_NAME}" not found. Please rename your raw tab to match.`);
  }
  
  const lastRow = rawSheet.getLastRow();
  const lastCol = rawSheet.getLastColumn();
  
  // Ensure we have data to process
  if (lastRow <= 1) {
    console.log("No data in raw source sheet to process.");
    return;
  }
  
  // 1. Fetch all raw data from Sheet1
  const rawValues = rawSheet.getRange(1, 1, lastRow, lastCol).getValues();
  const rawHeaders = rawValues[0].map(h => String(h).trim().toLowerCase());
  
  // Map raw headers to their column indices in Sheet1
  const headersMap = {};
  rawHeaders.forEach((header, index) => {
    headersMap[header] = index;
  });
  
  // 2. Prepare buckets for sorted data
  const sortedData = {
    [CONFIG.TARGET_SHEETS.COUNSELLING]: [],
    [CONFIG.TARGET_SHEETS.INQUIRY]: [],
    [CONFIG.TARGET_SHEETS.ELIGIBILITY]: [],
    [CONFIG.TARGET_SHEETS.PARTNERSHIP]: []
  };
  const masterRows = [];
  
  // 3. Process each raw row (skip the header row)
  for (let r = 1; r < rawValues.length; r++) {
    const row = rawValues[r];
    
    // Check if the row is entirely empty
    const hasData = row.some(val => val !== "" && val !== null && val !== undefined);
    if (!hasData) continue;
    
    // Map raw columns to standardized values
    const dataMap = extractStandardValues(row, headersMap);
    
    // Classify this row into one of the 4 sheets
    const category = classifyRow(dataMap);
    
    // Construct the clean row for its dedicated target sheet
    if (sortedData[category]) {
      const targetHeaders = CONFIG.TARGET_HEADERS[category];
      const targetRow = targetHeaders.map(h => {
        // Map target header to the extracted value
        if (h === "Message") return dataMap["Message"] || "";
        return dataMap[h] || "";
      });
      sortedData[category].push(targetRow);
    }
    
    // Construct the row for the Master Responses sheet
    const masterRow = CONFIG.MASTER_HEADERS.map(h => {
      if (h === "Form Source") return category; // Set the category sheet name
      if (h === "Message/Proposal") return dataMap["Message"] || "";
      return dataMap[h] || "";
    });
    masterRows.push(masterRow);
  }
  
  // 4. Write data to the 4 target sheets
  for (const [sheetName, rows] of Object.entries(sortedData)) {
    writeToSheet(ss, sheetName, CONFIG.TARGET_HEADERS[sheetName], rows);
  }
  
  // 5. Write data to the Master Responses sheet
  writeToSheet(ss, CONFIG.MASTER_SHEET_NAME, CONFIG.MASTER_HEADERS, masterRows);
  
  console.log("Data sync completed successfully.");
}

/**
 * Extracts and maps raw values to standard headers based on aliases
 */
function extractStandardValues(row, headersMap) {
  const dataMap = {};
  
  for (const [stdField, aliases] of Object.entries(CONFIG.FIELD_MAPPING)) {
    let valueFound = "";
    
    // Look through all possible aliases
    for (const alias of aliases) {
      const idx = headersMap[alias];
      if (idx !== undefined && row[idx] !== undefined && row[idx] !== "") {
        valueFound = row[idx];
        break;
      }
    }
    
    // Special check: Case-insensitive fallback if alias mapping fails
    if (valueFound === "") {
      for (const [rawHeader, idx] of Object.entries(headersMap)) {
        if (rawHeader === stdField.toLowerCase().trim()) {
          valueFound = row[idx];
          break;
        }
      }
    }
    
    dataMap[stdField] = valueFound;
  }
  
  // Add source column if present
  const sourceIdx = headersMap["source"];
  dataMap["source"] = (sourceIdx !== undefined) ? String(row[sourceIdx]).trim() : "";
  
  return dataMap;
}

/**
 * Smart classifier function to assign each row to Counselling, Eligibility, Partnership, or Inquiry.
 * Resilient to shifted or misplaced columns.
 */
function classifyRow(dataMap) {
  const source = String(dataMap["source"] || "").toLowerCase().trim();
  const mode = String(dataMap["Counselling Mode"] || "").toLowerCase().trim();
  const country = String(dataMap["Preferred Countries"] || "").toLowerCase().trim();
  
  // 1. Explicit Source check
  if (source.includes("counselling")) return CONFIG.TARGET_SHEETS.COUNSELLING;
  if (source.includes("eligibility")) return CONFIG.TARGET_SHEETS.ELIGIBILITY;
  if (source.includes("partnership") || source.includes("partner")) return CONFIG.TARGET_SHEETS.PARTNERSHIP;
  if (source.includes("inquiry")) return CONFIG.TARGET_SHEETS.INQUIRY;
  
  // 2. Counselling Mode content checks
  if (mode.includes("phone call") || mode.includes("person meeting") || mode.includes("video call")) {
    return CONFIG.TARGET_SHEETS.COUNSELLING;
  }
  if (mode.includes("eligibility")) {
    return CONFIG.TARGET_SHEETS.ELIGIBILITY;
  }
  
  // 3. Shifted data check: in case "Phone Call" or "In Person Meeting" is shifted into Preferred Countries
  if (country.includes("phone call") || country.includes("person meeting") || country.includes("video call")) {
    return CONFIG.TARGET_SHEETS.COUNSELLING;
  }
  
  // 4. Content checks for Eligibility Finder
  if (country.includes("eligibility")) {
    return CONFIG.TARGET_SHEETS.ELIGIBILITY;
  }
  
  // 5. Default fallback: route to Inquiry
  return CONFIG.TARGET_SHEETS.INQUIRY;
}

/**
 * Safely writes data to a specific tab. Creates and styles the tab if it doesn't exist.
 */
function writeToSheet(ss, sheetName, headers, rows) {
  let sheet = ss.getSheetByName(sheetName);
  
  // Create sheet if it does not exist
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  
  // Clear any existing content
  sheet.clearContents();
  
  // Set headers
  sheet.getRange(1, 1, 1, headers.length)
       .setValues([headers])
       .setFontWeight("bold")
       .setBackground("#F3F4F6"); // Modern grey style
       
  // Set data rows if we have any
  if (rows.length > 0) {
    // Sort rows by Timestamp (newest last) if Timestamp is in column 1
    if (headers[0] === "Timestamp") {
      rows.sort((a, b) => {
        const dateA = a[0] ? new Date(a[0]) : new Date(0);
        const dateB = b[0] ? new Date(b[0]) : new Date(0);
        return dateA - dateB;
      });
    }
    
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    
    // Auto-fit column widths for a clean look
    for (let col = 1; col <= headers.length; col++) {
      sheet.autoResizeColumn(col);
    }
  }
}
