#!/usr/bin/env bash
set -e

# ==========================
# CONFIGURATION
# ==========================
GITHUB_USER="Jawwadjlf"
REPO_NAME="OnlineAttendanceSystem"
REPO_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

LOCAL_ATTENDANCE_FILE="attendance.html"
LOCAL_SW_FILE="service-worker.js"
LOCAL_MANIFEST_FILE="manifest.json"

PLACEHOLDER='const APPSCRIPT_URL = "YOUR_DEPLOYMENT_URL_HERE"'

echo "======================================="
echo " CR Attendance PWA - GitHub Deployer"
echo " Repo: ${REPO_URL}"
echo "======================================="
echo

# ==========================
# CHECK REQUIRED FILES
# ==========================
for f in "$LOCAL_ATTENDANCE_FILE" "$LOCAL_SW_FILE" "$LOCAL_MANIFEST_FILE"; do
  if [ ! -f "$f" ]; then
    echo "❌ Required file not found in current folder: $f"
    echo "   Please place $f next to deploy.sh and run again."
    exit 1
  fi
done

# ==========================
# ASK FOR APPS SCRIPT URL
# ==========================
read -rp "Enter your Google Apps Script deployment URL: " APPSCRIPT_URL

if [ -z "$APPSCRIPT_URL" ]; then
  echo "❌ Apps Script URL is required. Exiting."
  exit 1
fi

echo
echo "Using Apps Script URL:"
echo "  $APPSCRIPT_URL"
echo

# ==========================
# CLONE OR UPDATE REPO
# ==========================
if [ ! -d "$REPO_NAME" ]; then
  echo "📥 Cloning repository ${REPO_URL} ..."
  git clone "$REPO_URL"
else
  echo "📂 Repository folder already exists: ${REPO_NAME}"
fi

cd "$REPO_NAME"

echo
echo "📡 Fetching latest changes from GitHub..."
git pull --rebase || true

# ==========================
# COPY FILES INTO REPO
# ==========================
echo
echo "📄 Copying files into repository..."

# Go back one level to read local files, then return
SCRIPT_DIR="$(cd .. && pwd)"

cp "${SCRIPT_DIR}/${LOCAL_ATTENDANCE_FILE}" ./index.html
cp "${SCRIPT_DIR}/${LOCAL_SW_FILE}" ./service-worker.js
cp "${SCRIPT_DIR}/${LOCAL_MANIFEST_FILE}" ./manifest.json

echo "✅ Copied:"
echo "  - ${LOCAL_ATTENDANCE_FILE} → index.html"
echo "  - ${LOCAL_SW_FILE} → service-worker.js"
echo "  - ${LOCAL_MANIFEST_FILE} → manifest.json"

# ==========================
# INJECT APPS SCRIPT URL
# ==========================
echo
echo "🛠  Updating APPSCRIPT_URL in index.html ..."

if grep -q "$PLACEHOLDER" index.html; then
  # Detect GNU sed vs BSD sed (macOS)
  if sed --version >/dev/null 2>&1; then
    # GNU sed
    sed -i "s|${PLACEHOLDER}|const APPSCRIPT_URL = \"${APPSCRIPT_URL}\"|g" index.html
  else
    # BSD sed (macOS)
    sed -i '' "s|${PLACEHOLDER}|const APPSCRIPT_URL = \"${APPSCRIPT_URL}\"|g" index.html
  fi
  echo "✅ APPSCRIPT_URL replaced successfully."
else
  echo "⚠️  Placeholder line not found in index.html:"
  echo "    ${PLACEHOLDER}"
  echo "    Please open index.html in GitHub and set APPSCRIPT_URL manually if needed."
fi

# ==========================
# GIT COMMIT & PUSH
# ==========================
echo
echo "📌 Staging files..."
git add index.html service-worker.js manifest.json || true

echo "📝 Committing..."
git commit -m "Deploy CR Attendance PWA (index.html + PWA files)" || echo "ℹ️ Nothing to commit (files unchanged)."

echo "⬆️ Pushing to GitHub..."
# Try main, then master
git push origin main 2>/dev/null || git push origin master

echo
echo "✅ Deployment push complete."

# ==========================
# FINAL INSTRUCTIONS
# ==========================
cat <<'EOF'

==========================================
 NEXT STEP: ENABLE GITHUB PAGES (ONE TIME)
==========================================

1. Open your repository in browser:
   https://github.com/Jawwadjlf/OnlineAttendanceSystem

2. Go to:
   Settings → "Pages" (left sidebar)

3. Under "Source":
   - Branch: select "main" (or "master" if that's your default)
   - Folder: select "/ (root)"

4. Click "Save"

5. Wait 1–2 minutes, then open:
   https://jawwadjlf.github.io/OnlineAttendanceSystem/

You should see your CR Attendance app live.
If it shows 404, wait a bit and refresh.

EOF
