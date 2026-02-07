# 📱 CUOnline Attendance Management System

**A modern Progressive Web App (PWA) for efficient class attendance management with offline support, QR code scanning, and admin dashboard.**

![COMSATS Vehari Campus](https://img.shields.io/badge/COMSATS-Vehari%20Campus-blue?style=flat)
![Version](https://img.shields.io/badge/Version-1.0-green?style=flat)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat)

---

## 📋 Overview

CUOnline is a comprehensive attendance management system designed for university environments. It provides two main interfaces:

1. **CR Panel** - For Class Representatives to mark attendance
2. **Admin Panel** - For Faculty and Administrators to approve and manage submissions

The system is built as a **Progressive Web App** enabling offline functionality, QR code integration, and seamless synchronization with Google Apps Script backend.

---

## ✨ Key Features

### CR Panel (Class Representative)
- ✅ **Quick Attendance Marking** - Toggle students between Present/Absent
- 📝 **Lecture Notes** - Add course content (up to 2,999 characters)
- 🔍 **Student Search** - Quickly find students by registration number or name
- 📊 **Live Summary** - Real-time Present/Absent count
- 🔒 **Submit & Lock** - Finalize attendance with confirmation
- 📧 **Email Integration** - Send attendance directly to faculty
- 📱 **Offline Support** - Works without internet using IndexedDB
- 🔄 **Auto-Sync** - Automatically syncs when connection restored

### Admin Panel (Faculty/Administrator)
- 📊 **Dashboard KPIs** - Active classes, pending approvals, faculty status, sync health
- ✅ **Approval Queue** - Review and approve/reject submissions
- 📈 **Coverage Analytics** - Department attendance coverage by time slots
- 🔍 **Audit Trail** - Track all administrative actions with timestamps
- 📑 **Attendance Reports** - Export data for records

### System Features
- 🎨 **Modern UI** - Clean, responsive design (mobile-first)
- 📱 **PWA Support** - Install on home screen, works offline
- 🔐 **Secure** - Google Apps Script backend authentication
- 📊 **Chart.js Analytics** - Beautiful attendance visualizations
- 🌐 **Cloud Storage** - Google Sheets for data persistence
- ⚡ **Fast** - Lightweight, no heavy frameworks
- 🔄 **Real-time Sync** - Seamless data synchronization

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interfaces                          │
├─────────────────┬───────────────────────────────────────────┤
│   CR Panel      │       Admin Panel                         │
│  (index.html)   │    (index.html - Admin Tab)              │
└────────┬────────┴───────────────────┬──────────────────────┘
         │                            │
         └────────────┬───────────────┘
                      │
         ┌────────────▼──────────────┐
         │  Google Apps Script       │
         │  Backend API              │
         │  (Code.gs)                │
         └─────────┬──────────────────┘
                   │
         ┌─────────▼──────────────┐
         │   Google Sheets        │
         │  - Roster Sheet        │
         │  - Attendance Sheet    │
         │  - History Sheet       │
         └────────────────────────┘
```

### Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **Storage**: IndexedDB (browser local storage)
- **Libraries**: Chart.js, QRCode.js, jsQR
- **Deployment**: GitHub (frontend code)

---

## 🚀 Quick Start

### Prerequisites
- Google Account (for Sheets & Apps Script)
- GitHub Account (optional, for deployment)
- Modern Web Browser (Chrome, Firefox, Safari, Edge)

### 1. Set Up Google Sheet

```bash
1. Create a new Google Sheet
2. Rename it to "CUOnline Attendance Database"
3. Create three sheets:
   - Roster (for student data)
   - Attendance (for submissions)
   - History (for archive)
4. Copy the Sheet ID from URL:
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
```

### 2. Create Google Apps Script Backend

```bash
1. Go to script.google.com
2. Create New Project: "CUOnline Admin Backend"
3. Copy the provided Code.gs from this repository
4. Update CONFIG with your Sheet ID
5. Deploy as Web App ("Execute as you")
6. Copy the Deployment URL
```

### 3. Deploy Frontend

**Option A: Use from GitHub**
```
https://rawcdn.githack.com/Jawwadjlf/OnlineAttendanceSystem/main/index.html
```

**Option B: Deploy on Google Apps Script**
```bash
1. Create new GAS project: "CUOnline CR Panel"
2. Click Deploy → New Deployment
3. Select type: "Web app"
4. Upload index.html & manifest.json
5. Deploy
```

**Option C: Self-host**
```bash
1. Clone this repository
2. Update GAS URLs in index.html
3. Host on GitHub Pages or any web server
```

### 4. Configure URLs

Edit `index.html` and update:

```javascript
// Line ~200
const APPSCRIPT_URL = "https://script.google.com/macros/s/YOUR_ADMIN_SCRIPT_ID/exec";
```

### 5. Share with Users

**For CRs:**
```
https://rawcdn.githack.com/Jawwadjlf/OnlineAttendanceSystem/main/index.html
```

**For Admins:**
Click "Admin Panel" tab in the same interface.

---

## 📁 Project Structure

```
OnlineAttendanceSystem/
├── index.html                 # Main PWA interface (CR + Admin)
├── manifest.json              # PWA configuration
├── service-worker.js          # Service worker for offline support
├── CONFIGURATION.md           # Setup instructions with blank form
├── README.md                  # This file
├── LICENSE                    # MIT License
├── /scripts/
│   └── Code.gs               # Google Apps Script backend
├── /docs/
│   ├── DEPLOYMENT.md         # Deployment guide
│   ├── API_REFERENCE.md      # API endpoints documentation
│   └── TROUBLESHOOTING.md    # Common issues & solutions
└── /assets/
    └── icons/                # PWA app icons (192x192, 512x512)
```

---

## 🔐 Security

### Data Protection
- ✅ HTTPS only (when deployed on web)
- ✅ Google OAuth for admin access
- ✅ Sensitive data never logged
- ✅ Sheet IDs not in frontend code

### Best Practices
- ✅ Never commit Google Apps Script IDs
- ✅ Use GitHub Secrets for sensitive data
- ✅ Regularly backup Google Sheet
- ✅ Monitor access logs
- ✅ Limit sheet sharing permissions

---

## 📊 Data Model

### Roster Sheet
```
Reg No    | Name                    | Section | Course  | Status
----------|-------------------------|---------|---------|----------
FA22-BCS-008 | AQSA HANIF         | A       | CSC462  | active
FA22-BCS-078 | MUHAMMAD SALMAN    | B       | CSC462  | active
```

### Attendance Sheet
```
Date       | Course  | Section | CR Email      | Present | Absent | Status
-----------|---------|---------|---------------|---------|--------|----------
2026-02-06 | CSC462  | A       | cr@comsats.pk |  24     |  2     | approved
2026-02-06 | SE102   | B       | cr2@comsats.pk|  18     |  3     | pending
```

---

## 🔄 Sync Workflow

```
1️⃣ CR marks attendance
   └─→ Data saved locally (IndexedDB)
       └─→ When online: Sent to Google Apps Script
           └─→ Stored in Google Sheet

2️⃣ Admin reviews submission
   └─→ Approves or requests edits
       └─→ Status updated in Sheet
           └─→ CR sees update in history

3️⃣ Export & Archive
   └─→ Download as CSV/JSON
       └─→ Move to History sheet
           └─→ Keep for compliance & records
```

---

## 📱 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 60+     | ✅ Full support |
| Firefox | 55+     | ✅ Full support |
| Safari  | 11+     | ✅ Full support |
| Edge    | 79+     | ✅ Full support |
| iOS Safari | 11+ | ✅ Full support |
| Chrome Mobile | 60+ | ✅ Full support |

---

## 🐛 Troubleshooting

### App not loading
1. Clear browser cache (Ctrl+Shift+Delete)
2. Check browser console (F12) for errors
3. Verify APPSCRIPT_URL is correct

### Data not syncing
1. Check internet connection
2. Verify Google Apps Script is deployed
3. Check Google Apps Script logs
4. Ensure Google Sheet ID matches in Code.gs

### Offline mode not working
1. Check if IndexedDB is enabled
2. Clear browser storage and reload
3. Ensure service worker is registered

For more help, see [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/Jawwadjlf/OnlineAttendanceSystem/issues)
- **Email**: Your contact email
- **Institution**: COMSATS University Islamabad, Vehari Campus

---

## 📜 License

MIT License - feel free to use and modify

---

## 👥 Contributors

- **Developer**: Jawwad JLF
- **Institution**: COMSATS Vehari Campus
- **Year**: 2026

---

## 📝 Changelog

### Version 1.0 (February 2026)
- ✅ Initial release
- ✅ CR Panel with attendance marking
- ✅ Admin Panel with approval queue
- ✅ Offline support with IndexedDB
- ✅ Google Apps Script backend
- ✅ Email integration
- ✅ Analytics dashboard

---

## 🙏 Acknowledgments

- Chart.js for beautiful visualizations
- QRCode.js for QR generation
- Google Apps Script for serverless backend
- COMSATS University for institutional support

---

**🚀 Ready to deploy?** Start with [CONFIGURATION.md](CONFIGURATION.md)

**Need help?** Check [docs/](docs/) folder for detailed guides

**Want to contribute?** Fork this repo and submit a pull request!
