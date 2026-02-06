# CR Attendance System — Deployment Checklist

## 🚀 Quick Start (10 minutes)

### Phase 1: Frontend Deployment (GitHub Pages)

- [ ] **Step 1**: Verify files are in `cr-app/` folder
  ```
  cr-app/
  ├── index.html
  ├── app.js
  ├── sw.js
  ├── manifest.json
  └── README.md (create this)
  ```

- [ ] **Step 2**: Push to GitHub
  ```bash
  git add cr-app/
  git commit -m "Deploy CR PWA frontend"
  git push origin main
  ```

- [ ] **Step 3**: Enable GitHub Pages
  - Go to: `https://github.com/Jawwadjlf/OnlineAttendanceSystem/settings/pages`
  - Select: **Main** branch, `/cr-app` folder
  - Click: **Save**
  - Wait ~2 min for deployment
  - Your app URL: `https://jawwadjlf.github.io/OnlineAttendanceSystem/cr-app/`

- [ ] **Step 4**: Test PWA Installation
  - Open URL in Chrome on Android
  - Tap "Install" button
  - Verify app installs and opens offline

### Phase 2: Backend Deployment (Google Apps Script)

- [ ] **Step 1**: Create new Apps Script project
  - Go to: `https://script.google.com`
  - Click: **New project**
  - Name: `CR Attendance Admin`

- [ ] **Step 2**: Create `Code.gs` file
  ```javascript
  // Backend logic from documentation
  function doGet(e) {
    const action = e.parameter.action;
    if (action === 'getRoster') {
      const courseId = e.parameter.courseId;
      const section = e.parameter.section;
      // ... implementation
    }
  }
  
  function doPost(e) {
    const action = e.parameter.action;
    if (action === 'submitAttendance') {
      // ... store and email implementation
    }
  }
  ```

- [ ] **Step 3**: Create admin HTML interface
  - File → **New** → **HTML file**
  - Name: `Admin`
  - Paste admin roster push interface HTML

- [ ] **Step 4**: Deploy as Web App
  - Click: **Deploy** → **New deployment**
  - Type: **Web app**
  - Execute as: Your email
  - Who has access: **Anyone**
  - Click: **Deploy**
  - Copy the deployment URL (e.g., `https://script.google.com/macros/d/ABC123/usercontent`)

- [ ] **Step 5**: Set Google Drive folder permissions
  - Create folder: `CR-Attendance` in Google Drive
  - Share: **Anyone with link** (Viewer access)
  - Copy folder ID from URL

### Phase 3: Integration

- [ ] **Step 1**: Update CR app configuration
  - Edit: `cr-app/app.js`
  - Find: `ROSTER_URL`
  - Replace: Use your Apps Script deployment URL
  ```javascript
  ROSTER_URL: 'https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercontent?action=getRoster',
  ```

- [ ] **Step 2**: Update Apps Script settings
  - In `Code.gs`, set your email:
  ```javascript
  const FACULTY_EMAIL = 'muhammadJawad@comsats.edu.pk';
  const DRIVE_FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID';
  ```

- [ ] **Step 3**: Commit and push updates
  ```bash
  git add .
  git commit -m "Integrate Apps Script endpoints"
  git push origin main
  ```

### Phase 4: Testing

- [ ] **CR App Test**
  - [ ] App loads without errors (check browser console)
  - [ ] Status shows: "🟢 Online"
  - [ ] Course & section display correctly
  - [ ] Student roster loads
  - [ ] Can mark students P/A
  - [ ] Submit & Lock button works
  - [ ] Form becomes read-only after lock
  - [ ] Can close/reopen without data loss

- [ ] **Offline Test**
  - [ ] Disconnect internet (Dev Tools → Offline)
  - [ ] App continues to work
  - [ ] Status shows: "🟠 Offline"
  - [ ] Can mark attendance offline
  - [ ] Submit queues locally
  - [ ] Status shows: "Using cached roster"

- [ ] **Roster Sync Test**
  - [ ] Admin pushes roster via Apps Script
  - [ ] File created in Google Drive
  - [ ] CR app fetches and displays roster
  - [ ] Student list is correct

- [ ] **Attendance Submit Test**
  - [ ] Mark attendance for students
  - [ ] Click "Submit & Lock"
  - [ ] Confirmation dialog appears
  - [ ] Submit → JSON stored in IndexedDB
  - [ ] Email received by faculty
  - [ ] JSON file in Google Drive
  - [ ] Form is now locked

### Phase 5: Production Release

- [ ] **Security Checklist**
  - [ ] No API keys in frontend code
  - [ ] No passwords in manifest
  - [ ] Apps Script scopes are minimal
  - [ ] Google Drive folder has appropriate sharing
  - [ ] Email address is correct

- [ ] **Documentation**
  - [ ] README.md in cr-app/ folder
  - [ ] SYSTEM_ARCHITECTURE.md complete
  - [ ] This checklist in repository
  - [ ] API endpoints documented

- [ ] **Backups**
  - [ ] GitHub repository is public/private (as desired)
  - [ ] Apps Script code backed up
  - [ ] Google Drive folder accessible
  - [ ] Email forwarding set up for notifications

- [ ] **Communication**
  - [ ] Share PWA URL with CR
  - [ ] Provide installation instructions
  - [ ] Set up email for attendance notifications
  - [ ] Brief CR on using the app

---

## 📋 Environment Variables

Create a file `.env` (or note these for reference):

```
# Frontend
VITE_ROSTER_URL=https://script.google.com/macros/d/YOUR_ID/usercontent?action=getRoster
VITE_SUBMIT_URL=https://script.google.com/macros/d/YOUR_ID/usercontent?action=submitAttendance

# Backend (Google Apps Script)
FACULTY_EMAIL=muhammadJawad@comsats.edu.pk
DRIVE_FOLDER_ID=your_drive_folder_id
COURSE_ID=30000
COURSE_NAME=CSC462 – Artificial Intelligence
SECTION=A
```

---

## 🧪 Test Credentials

### Sample Course Data
```json
{
  "courseId": 30000,
  "course": "CSC462 – Artificial Intelligence",
  "section": "A",
  "students": [
    { "reg": "CIIT/FA22-BCS-008/VHR", "displayReg": "FA22-BCS-008", "name": "AQSA HANIF" },
    { "reg": "CIIT/FA22-BCS-078/VHR", "displayReg": "FA22-BCS-078", "name": "MUHAMMAD SALMAN" },
    { "reg": "CIIT/SP23-BCS-006/VHR", "displayReg": "SP23-BCS-006", "name": "ABEERA EJAZ" }
  ]
}
```

---

## 🐛 Troubleshooting

### Issue: "App says offline but internet is connected"
**Solution**: 
- Check browser console for errors
- Service Worker may be cached: Hard refresh (Ctrl+Shift+R)
- Uninstall app and reinstall

### Issue: "Roster not loading"
**Solution**:
- Verify Apps Script deployment URL is correct
- Check roster JSON exists in Google Drive
- Look for CORS errors in console
- Try pushing roster again from admin interface

### Issue: "Submit button not working"
**Solution**:
- Check console for JavaScript errors
- Verify attendance is marked (present/absent count > 0)
- Ensure form is not already locked
- Try clearing cache: `localStorage.clear()`

### Issue: "Attendance JSON not received by faculty"
**Solution**:
- Check Google Drive for attendance file
- Verify email address in Apps Script is correct
- Check spam/promotions folder in Gmail
- Look for Apps Script execution errors in logs

### Issue: "PWA won't install on Android"
**Solution**:
- Use Chrome (not Safari/Firefox)
- Make sure manifest.json is valid
- Check that app is served over HTTPS
- Try in incognito mode first

---

## 📱 User Quick Start (for CR)

### Installation
1. **Android**: Open Chrome → `https://your-url/cr-app/` → Tap "Install"
2. **iOS**: Open Safari → Share → "Add to Home Screen"

### First Time
1. App opens with today's date pre-filled
2. **Course & Section**: Read-only (set by faculty)
3. **Student List**: Syncs from cloud automatically

### Marking Attendance
1. **Search**: Find student by name or reg number
2. **Mark**: Tap P (Present) or A (Absent)
3. **Edit**: Change date/time/type if needed
4. **Notes**: Add lecture notes (optional)

### Submitting
1. **Review**: Check the counts (present/absent/unmarked)
2. **Submit**: Tap "Submit & Lock" button
3. **Confirm**: Tap "Submit & Lock" again
4. **Locked**: Form becomes read-only

### Offline Use
1. App works without internet
2. All data saved locally
3. When online again: Auto-syncs
4. Status shows: 🟢 Online / 🟠 Offline

---

## 📞 Support

**For Faculty Issues**:
- Check SYSTEM_ARCHITECTURE.md for technical details
- Review Google Apps Script logs for errors
- Verify Google Drive permissions

**For CR Issues**:
- Clear cache: Settings → Clear browsing data
- Reinstall app: Uninstall → Reinstall
- Check internet connection
- Look for error messages in app

---

## ✅ Final Verification

Before going live, verify:

- [ ] Frontend deployed on GitHub Pages
- [ ] Backend deployed on Google Apps Script
- [ ] Endpoints updated in frontend code
- [ ] Roster can be pushed and fetched
- [ ] Attendance can be marked and submitted
- [ ] Lock mechanism prevents re-editing
- [ ] Offline mode works
- [ ] Email notifications working
- [ ] All data stored in Google Drive
- [ ] CR can install app on Android

---

**Deployment Date**: [Add date when deployed]
**Deployed By**: Muhammad Jawad Rafeeq
**Status**: ✅ Ready / 🔄 In Progress / ❌ Not Started

**Notes**:
```
[Add any deployment notes here]
```
