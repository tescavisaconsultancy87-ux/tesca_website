# Google Sheets responses Router & Consolidator Setup Guide

This guide describes how to deploy, configure, and maintain the Google Apps Script responses router located at [form_consolidator.js](file:///c:/Users/dhame/Desktop/tesca_website/scripts/form_consolidator.js).

## 📊 How It Works
Instead of managing multiple forms and sheets, all your web leads and inquiries land on a single sheet named **`Sheet1`**. Because the data is mixed and sometimes shifted (e.g. columns might be in different orders or values are shifted), this script automatically:
1. **Scans** all raw records inside **`Sheet1`**.
2. **Standardizes & Maps** fields like variations of names, emails, and phone numbers.
3. **Classifies** each record based on fields like `source`, `Counselling Mode`, or keywords (like "Phone Call", "Eligibility Finder", etc.).
4. **Appends** clean, structured data into **4 dedicated sheets**:
   * 📁 **`Counselling`** (counselling bookings)
   * 📁 **`Inquiry`** (general inquiries)
   * 📁 **`Eligibility`** (eligibility checks)
   * 📁 **`Partnership`** (partnership proposals)
5. **Combines** everything into **`Master Responses`** (1 unified sheet for all leads).

---

## 🛠️ Step-by-Step Installation

### Step 1: Open Your Spreadsheet
1. Open your Google Spreadsheet (named `website leads / inquiry`).
2. Make sure the main sheet containing the raw data is named exactly: **`Sheet1`**.

### Step 2: Install the Apps Script
1. In the top menu bar, click on **Extensions** > **Apps Script**.
2. If there is any default code (like `function myFunction()`), delete it.
3. Copy the entire script from [form_consolidator.js](file:///c:/Users/dhame/Desktop/tesca_website/scripts/form_consolidator.js) and paste it into the editor.
4. Click the **Save** (floppy disk) icon at the top of the editor.

### Step 3: Run the Initial Routing & Sync
1. In the toolbar dropdown at the top, select the function **`syncAllData`** (not `onOpen`).
2. Click **Run**.
3. Google will prompt you to authorize permissions.
   * Click **Review Permissions**.
   * Select your Google account.
   * Click **Advanced** (at the bottom of the prompt).
   * Click **Go to Untitled project (unsafe)**.
   * Click **Allow**.
4. The script will execute, scan your raw sheet (`Sheet1`), and instantly create/populate the following sheets in your spreadsheet:
   * **`Master Responses`**
   * **`Counselling`**
   * **`Inquiry`**
   * **`Eligibility`**
   * **`Partnership`**
5. Refresh the Google Sheet page in your browser. You will see a new **`Form Manager`** menu in the top toolbar. You can click **Form Manager** > **Sync & Sort Data Now** to run this sync manually anytime!

### Step 4: Configure Automatic Synchronization (Trigger)
To make this run completely automatically whenever new data lands in `Sheet1`:
1. In the Apps Script sidebar on the left, click the clock icon (**Triggers**).
2. Click **+ Add Trigger** (bottom right).
3. Set the configuration as follows:
   * **Choose which function to run**: `syncAllData`
   * **Choose which deployment should run**: `Head`
   * **Select event source**: `From spreadsheet`
   * **Select event type**: `On change`
4. Click **Save**.
5. *(Highly Recommended)* Click **+ Add Trigger** again and create a second trigger:
   * **Choose which function to run**: `syncAllData`
   * **Select event source**: `Time-driven`
   * **Select type of time based trigger**: `Hour timer`
   * **Select hour interval**: `Every hour`
   This acts as a backup mechanism to guarantee absolute synchronization.

---

## 🔧 Maintenance Guide

### How the Classification Logic Works
The script classifies rows using the `classifyRow` function based on these rules:
1. **Source Column**: Checks the `source` column for terms like "counselling", "eligibility", "partnership", or "inquiry".
2. **Counselling Mode**: If it contains "Phone Call", "Video Call", or "In Person Meeting" -> routes to `Counselling`. If it contains "Eligibility Finder" -> routes to `Eligibility`.
3. **Data Shifts (Shifted columns)**: If fields get shifted (for example, in your screenshot where "Phone Call" appeared under the `Preferred Countries` column), the script automatically detects this and routes it to `Counselling` anyway.
4. **Fallback**: Any lead that doesn't fit the above criteria is routed to the `Inquiry` sheet.

You can modify these rules easily by editing the `classifyRow` function in the Apps Script editor.
