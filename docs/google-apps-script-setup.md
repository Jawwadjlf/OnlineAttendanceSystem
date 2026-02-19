# Google Apps Script Setup Guide

This guide explains how to manage your Google Apps Script (backend) code using `clasp` (Command Line Apps Script Projects) directly from this repository.

## Prerequisites

1.  **Node.js**: You need Node.js installed to use `clasp`.
    *   **Windows**: 
        *   Option 1: Download from [nodejs.org](https://nodejs.org/).
        *   Option 2: Run `winget install OpenJS.NodeJS` in PowerShell.
    *   **Verify installation**: Run `node -v` and `npm -v` in your terminal.

## Setup Instructions

### 1. Install Clasp
Open your terminal (Command Prompt or PowerShell) and run:
```bash
npm install -g @google/clasp
```

### 2. Login to Google
Allow `clasp` to access your Google Apps Script projects:
```bash
clasp login
```
This will open a browser window where you can log in with your Google account.

### 3. Enable Google Apps Script API
1.  Go to [script.google.com/home/usersettings](https://script.google.com/home/usersettings).
2.  Turn **ON** "Google Apps Script API".

### 4. Link to Your Script
### 4. Link & Push Your Script
The backend code (Google Apps Script) is located in the `scripts/` folder.

1.  **Navigate to the scripts folder**:
    ```bash
    cd scripts
    ```

2.  **Login to Clasp** (if not already logged in):
    ```bash
    clasp login
    ```

3.  **Create a New Script Project**:
    ```bash
    clasp create --title "CUOnline Admin Backend" --type webapp --rootDir ./
    ```
    *This will create a `.clasp.json` file in the `scripts/` folder, linking it to your new Google script.*

4.  **Push the Code**:
    ```bash
    clasp push
    ```
    *This uploads `Code.gs`, `Admin.html`, and `appsscript.json` to Google.*

5.  **Deploy the Web App**:
    -   Go to [script.google.com](https://script.google.com).
    -   Open your project "CUOnline Admin Backend".
    -   Click **Deploy** > **New Deployment**.
    -   Select type **Web App**.
    -   Description: "Initial Deploy".
    -   Execute as: **Me**.
    -   Who has access: **Anyone** (or as needed).
    -   Click **Deploy** and copy the **Web App URL**.

### 5. Managing Code

    *Use this after editing local files.*

*   **Pull changes from Google**:
    ```bash
    clasp pull
    ```
    *Use this if you made changes in the online editor.*

*   **Open script in browser**:
    ```bash
    clasp open
    ```

## Project Structure with Clasp
Ensure your scripts are in the root or a specific folder. If you cloned into the root, your structure might look like this:
```
/
├── .clasp.json        # Created by clasp login/clone
├── .claspignore       # Tells clasp what to ignore
├── Code.js            # Your Google Apps Script code (converted from .gs)
├── appsscript.json    # Manifest file
└── ... other project files
```

> **Note**: `clasp` automatically converts `.gs` files to `.js` locally, and back to `.gs` when pushing.
