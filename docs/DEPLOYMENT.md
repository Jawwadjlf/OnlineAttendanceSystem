# Deployment Guide

This guide walks you through deploying the CUOnline Attendance System in your institution.

---

## 🌟 Deployment Options

### Option 1: Raw GitHub (Fastest - 5 minutes)
**Best for**: Quick testing, temporary use

```
https://rawcdn.githack.com/Jawwadjlf/OnlineAttendanceSystem/main/index.html
```

✅ Pros: No setup needed, instant access
❌ Cons: Depends on GitHub availability, no custom domain

### Option 2: GitHub Pages (Recommended - 10 minutes)
**Best for**: Production, stable URL

#### Steps:
```bash
# 1. Fork this repository
https://github.com/Jawwadjlf/OnlineAttendanceSystem

# 2. Go to Settings → Pages
# 3. Select "main" branch as source
# 4. Save

# 5. Your site is now live at:
https://YOUR_USERNAME.github.io/OnlineAttendanceSystem/
```

✅ Pros: Free hosting, CDN, custom domain support
❌ Cons: Only static files, need GitHub account

### Option 3: Google Apps Script (Most Integrated - 15 minutes)
**Best for**: Single URL, centralized deployment

#### Steps:
```bash
# 1. In Google Apps Script project
# 2. Create new file: index.html
# 3. Copy content from this repo's index.html
# 4. Deploy as Web App (Execute as you)
# 5. Share the deployment URL
```

✅ Pros: Same project as backend, no CORS issues
❌ Cons: Limited customization, execution limits

### Option 4: Self-hosted (Full Control - 20 minutes)
**Best for**: Organizations with IT infrastructure

#### Setup on Server:
```bash
# 1. Clone repository
git clone https://github.com/Jawwadjlf/OnlineAttendanceSystem.git

# 2. Copy files to web root
cp -r OnlineAttendanceSystem/* /var/www/html/

# 3. Configure web server (nginx/Apache)
# Serve as static files

# 4. Update API URLs in index.html

# 5. Enable HTTPS
# Using Let's Encrypt: certbot certonly --standalone -d yourdomain.com
```

✅ Pros: Full control, no third-party dependencies
❌ Cons: Requires server, SSL certificate, maintenance

---

## 🔧 Complete Setup Checklist

### Phase 1: Google Infrastructure (15 min)

- [ ] Create Google Sheet named "CUOnline Attendance Database"
- [ ] Create 3 sheets: Roster, Attendance, History
- [ ] Copy Sheet ID: `https://docs.google.com/spreadsheets/d/[ID]/edit`
- [ ] Create Google Apps Script project: "CUOnline Admin Backend"
- [ ] Copy Code.gs from this repo into GAS
- [ ] Update Sheet ID in Code.gs
- [ ] Deploy as Web App (Execute as you)
- [ ] Copy deployment URL
- [ ] Test backend endpoint in browser

### Phase 2: Frontend Deployment (5-20 min)

**Choose ONE deployment option above**

- [ ] Deploy index.html to chosen platform
- [ ] Verify app loads in browser
- [ ] Test offline mode (DevTools → Offline)
- [ ] Test service worker registration

### Phase 3: Configuration (5 min)

- [ ] Update `APPSCRIPT_URL` in index.html
- [ ] Test "Submit & Lock" button
- [ ] Verify data appears in Google Sheet
- [ ] Test email integration

### Phase 4: User Onboarding (10 min)

- [ ] Create user documentation
- [ ] Share CR Panel URL with Class Representatives
- [ ] Share Admin Panel access instructions
- [ ] Conduct brief training session
- [ ] Test with real data

---

## 📝 Step-by-Step: GitHub Pages

### 1. Fork the Repository

```
1. Go to: https://github.com/Jawwadjlf/OnlineAttendanceSystem
2. Click "Fork" button (top right)
3. Choose your account
4. Wait for fork to complete
```

### 2. Enable GitHub Pages

```
1. In your forked repo, click "Settings"
2. Scroll to "Pages" section (left sidebar)
3. Under "Source", select "main" branch
4. Click "Save"
5. GitHub will generate URL: https://YOUR_USERNAME.github.io/OnlineAttendanceSystem/
6. Wait 1-2 minutes for deployment
```

### 3. Verify Deployment

```
1. Open: https://YOUR_USERNAME.github.io/OnlineAttendanceSystem/
2. Should see CR Panel interface
3. Click "Admin Panel" tab
4. Should see dashboard (demo data)
```

### 4. Configure Backend

```
1. Clone your fork:
   git clone https://github.com/YOUR_USERNAME/OnlineAttendanceSystem.git

2. Edit index.html (around line 200):
   const APPSCRIPT_URL = "https://script.google.com/macros/s/YOUR_ADMIN_SCRIPT_ID/exec";

3. Commit and push:
   git add index.html
   git commit -m "Update Google Apps Script URL"
   git push origin main

4. GitHub Pages auto-updates within 1 minute
```

### 5. Share the URL

```
✅ CR Panel: https://YOUR_USERNAME.github.io/OnlineAttendanceSystem/
✅ Admin Panel: Same URL → Click "Admin Panel" tab
```

---

## 📊 Google Apps Script Backend Setup

### 1. Create Script Project

```
1. Go to: https://script.google.com
2. Click "New Project"
3. Name it: "CUOnline Admin Backend"
4. Click "Create"
```

### 2. Add Code

```
1. Copy content from: scripts/Code.gs (from this repo)
2. Paste into editor
3. Click ⚙️ → Project Settings
4. Copy "Script ID"
5. Save it in CONFIGURATION.md
```

### 3. Update Configuration

```javascript
// In Code.gs, find CONFIG object:
const CONFIG = {
  SPREADSHEET_ID: 'YOUR_SHEET_ID_HERE',  // From step 1
  ROSTER_SHEET: 'Roster',
  ATTENDANCE_SHEET: 'Attendance',
  ADMIN_EMAIL: 'admin@yourschool.edu.pk'  // Your admin email
};
```

### 4. Deploy as Web App

```
1. Click "Deploy" → "New Deployment"
2. Select type: "Web app"
3. Execute as: Your email
4. Who has access: "Anyone"
5. Click "Deploy"
6. Copy the deployment URL
7. Update in index.html: APPSCRIPT_URL
```

### 5. Test the Endpoint

```
1. Open in browser:
   https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/userweb?action=test

2. Should return: {status: "ok", message: "Backend is operational"}
```

---

## 🧪 Testing Checklist

### Frontend Tests
- [ ] App loads without console errors
- [ ] CR Panel shows student list
- [ ] Can mark students P/A
- [ ] Summary updates in real-time
- [ ] Offline mode works (DevTools → Offline)
- [ ] Service worker registered
- [ ] IndexedDB stores data
- [ ] Admin Panel shows dashboard

### Backend Tests
- [ ] Backend endpoint responds
- [ ] Form submission works
- [ ] Data appears in Google Sheet
- [ ] Email is sent (check inbox)
- [ ] Status updates reflect correctly

### User Experience Tests
- [ ] First-time user can find CR Panel
- [ ] Instructions are clear
- [ ] Mobile view works
- [ ] Works on different browsers
- [ ] Works on different devices

---

## 🔐 Security Configuration

### 1. Protect Google Sheet

```
1. Open Google Sheet
2. Click "Share" (top right)
3. Change to "Restricted"
4. Add only admin emails
5. Set permissions: Viewer (not Editor)
```

### 2. Protect Google Apps Script

```
1. In GAS project → Settings
2. Note the Script ID (don't share)
3. Keep Deployment URLs private
4. Use Google OAuth for admin access
```

### 3. GitHub Configuration

```
1. Repository → Settings → Collaborators
2. Add only trusted team members
3. Use Branch Protection rules for main
4. Never commit API keys or IDs
```

---

## 🔄 Maintenance

### Daily
- Monitor Google Apps Script logs (View → Logs)
- Check for errors in browser console
- Verify submissions reaching Google Sheet

### Weekly
- Review admin actions in audit trail
- Check sync health percentage
- Validate data accuracy

### Monthly
- Backup Google Sheet (Download as CSV)
- Review attendance trends
- Update documentation if needed
- Check browser compatibility

### Quarterly
- Review security settings
- Update contact information
- Archive old attendance data
- Plan for next semester

---

## 🚨 Troubleshooting

### App Won't Load
```
1. Check internet connection
2. Clear cache: Ctrl+Shift+Delete
3. Check console (F12) for errors
4. Verify URL is correct
5. Try different browser
```

### Data Not Syncing
```
1. Check APPSCRIPT_URL in index.html
2. Verify Script ID is correct
3. Check GAS logs: View → Logs
4. Verify Google Sheet exists
5. Check Sheet ID in Code.gs
```

### Backend Not Responding
```
1. Check GAS deployment is active
2. Verify deployment URL is correct
3. Check GAS logs for errors
4. Try re-deploying from GAS
5. Check authentication settings
```

---

## 📞 Support

If you encounter issues:

1. Check [docs/TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Review [docs/API_REFERENCE.md](API_REFERENCE.md)
3. Check browser console (F12)
4. Check Google Apps Script logs
5. Create GitHub issue with:
   - Error message
   - Browser/device
   - Steps to reproduce
   - Screenshots

---

**Ready to go live?** Share the CR Panel URL with your Class Representatives!

📱 **CR Panel URL**: `https://YOUR_DEPLOYMENT_URL/index.html`
⚙️ **Admin Panel**: Same URL → Click "Admin Panel" tab
