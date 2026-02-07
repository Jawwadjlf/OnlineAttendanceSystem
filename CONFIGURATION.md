# Configuration Reference

## 🔑 Your Configuration Variables

Fill in these values and keep them safe:

```
═══════════════════════════════════════════════════════════════
GOOGLE SHEET
═══════════════════════════════════════════════════════════════
Sheet ID:          _________________________________
Sheet Name:        CUOnline Attendance Database
Roster Sheet:      Roster
Attendance Sheet:  Attendance

═══════════════════════════════════════════════════════════════
GOOGLE APPS SCRIPT - ADMIN BACKEND
═══════════════════════════════════════════════════════════════
Project Name:      CUOnline Admin Backend
Script ID:         _________________________________
Deployment ID:     _________________________________
Web App URL:       https://script.google.com/macros/s/
                   _________________________________/userweb

Admin Email:       _________________________________

═══════════════════════════════════════════════════════════════
GOOGLE APPS SCRIPT - CR PANEL
═══════════════════════════════════════════════════════════════
Project Name:      CUOnline CR Panel
Script ID:         _________________________________
Deployment ID:     _________________________________
Web App URL:       https://script.google.com/macros/s/
                   _________________________________/userweb

═══════════════════════════════════════════════════════════════
GITHUB
═══════════════════════════════════════════════════════════════
Repository:        cuonline-attendance
GitHub URL:        https://github.com/
                   _________________________________/cuonline-attendance
Branch:            main

═══════════════════════════════════════════════════════════════
DEPLOYMENT URLS (Share these with users)
═══════════════════════════════════════════════════════════════
Admin Panel:       https://script.google.com/macros/s/
                   _________________________________
                   /userweb?action=admin

CR Panel:          https://script.google.com/macros/s/
                   _________________________________
                   /userweb?action=cr
```

---

## 📝 How to Get Each ID

### Sheet ID
1. Open your Google Sheet
2. Look at URL: `https://docs.google.com/spreadsheets/d/`**`1A2B3C...`**`/edit`
3. Copy the part between `/d/` and `/edit` → That's your Sheet ID

### Script ID (Google Apps Script)
1. Open your GAS project
2. Click ⚙️ (gear icon) → Project Settings
3. Copy "Script ID" → That's your Script ID

### Deployment ID
1. In GAS project, click "Deploy" dropdown
2. Find the deployment → Copy its ID
3. Or generate new deployment if needed

---

## 🔧 Code Configuration Locations

### In Code.gs (Google Apps Script)
```javascript
const CONFIG = {
  SPREADSHEET_ID: 'PASTE_SHEET_ID_HERE',
  ROSTER_SHEET: 'Roster',
  ATTENDANCE_SHEET: 'Attendance',
  ADMIN_EMAIL: 'admin@comsats.edu.pk'
};
```

### In AdminPanel.html
```javascript
const GAS_BACKEND_URL = 'https://script.google.com/macros/s/ADMIN_SCRIPT_ID/userweb';
```

### In CRPanel.html
```javascript
const BACKEND_URL = 'https://script.google.com/macros/s/ADMIN_SCRIPT_ID/userweb';
```

---

## ✅ Deployment Checklist

- [ ] Google Sheet created with IDs noted
- [ ] Admin GAS project created with ID noted
- [ ] CR GAS project created with ID noted
- [ ] Both deployed as web apps
- [ ] Config.gs updated with Sheet ID
- [ ] AdminPanel.html has correct GAS URL
- [ ] CRPanel.html has correct GAS URL
- [ ] GitHub repo created and pushed
- [ ] All files uploaded
- [ ] Tested roster upload
- [ ] Tested QR generation
- [ ] Tested attendance submission
- [ ] Ready for production

**Last Updated**: February 2026
**System Version**: 1.0
