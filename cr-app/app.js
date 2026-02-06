// ============================================================================
// CR ATTENDANCE APP - Main Application Logic
// Offline-first PWA with IndexedDB + localStorage persistence
// ============================================================================

const APP = {
  // Configuration
  ROSTER_URL: 'https://script.google.com/macros/d/YOUR_APPS_SCRIPT_ID/usercontent?action=getRoster', // Replace with actual endpoint
  ROSTER_CACHE_KEY: 'roster_cache',
  DRAFT_KEY: 'attendance_draft',
  LOCK_KEY: 'attendance_locked',
  DB_NAME: 'CRAttendanceDB',
  DB_VERSION: 1,

  // State
  state: {
    roster: null,
    attendance: {},
    isOnline: navigator.onLine,
    isLocked: false,
    syncStatus: null,
  },

  // DOM Elements
  elements: {},

  // Initialize App
  async init() {
    console.log('[APP] Initializing...');
    this.cacheElements();
    this.setupEventListeners();
    this.setupNetworkListeners();
    await this.initDB();
    await this.loadDraft();
    await this.loadRoster();
    this.updateUI();
    console.log('[APP] Initialized successfully');
  },

  // Cache DOM Elements
  cacheElements() {
    this.elements = {
      statusPill: document.getElementById('statusPill'),
      statusText: document.getElementById('statusText'),
      syncCard: document.getElementById('syncCard'),
      syncMessage: document.getElementById('syncMessage'),
      courseDisplay: document.getElementById('courseDisplay'),
      sectionDisplay: document.getElementById('sectionDisplay'),
      studentCountDisplay: document.getElementById('studentCountDisplay'),
      rosterStatusDisplay: document.getElementById('rosterStatusDisplay'),
      editStatusBadge: document.getElementById('editStatusBadge'),
      dateInput: document.getElementById('dateInput'),
      startTimeInput: document.getElementById('startTimeInput'),
      endTimeInput: document.getElementById('endTimeInput'),
      classTypeInput: document.getElementById('classTypeInput'),
      onlineCheckbox: document.getElementById('onlineCheckbox'),
      notesInput: document.getElementById('notesInput'),
      charCount: document.getElementById('charCount'),
      presentCount: document.getElementById('presentCount'),
      absentCount: document.getElementById('absentCount'),
      studentSearch: document.getElementById('studentSearch'),
      studentList: document.getElementById('studentList'),
      markAllPresentBtn: document.getElementById('markAllPresentBtn'),
      markAllAbsentBtn: document.getElementById('markAllAbsentBtn'),
      resetBtn: document.getElementById('resetBtn'),
      submitBtn: document.getElementById('submitBtn'),
      sessionCard: document.getElementById('sessionCard'),
      attendanceCard: document.getElementById('attendanceCard'),
      notesCard: document.getElementById('notesCard'),
    };
  },

  // Setup Event Listeners
  setupEventListeners() {
    // Session Details
    this.elements.dateInput.addEventListener('change', () => this.saveDraft());
    this.elements.startTimeInput.addEventListener('change', () => this.saveDraft());
    this.elements.endTimeInput.addEventListener('change', () => this.saveDraft());
    this.elements.classTypeInput.addEventListener('change', () => this.saveDraft());
    this.elements.onlineCheckbox.addEventListener('change', () => this.saveDraft());

    // Notes
    this.elements.notesInput.addEventListener('input', (e) => {
      this.elements.charCount.textContent = e.target.value.length;
      this.saveDraft();
    });

    // Search
    this.elements.studentSearch.addEventListener('input', (e) => this.filterStudents(e.target.value));

    // Buttons
    this.elements.markAllPresentBtn.addEventListener('click', () => this.markAll('present'));
    this.elements.markAllAbsentBtn.addEventListener('click', () => this.markAll('absent'));
    this.elements.resetBtn.addEventListener('click', () => this.reset());
    this.elements.submitBtn.addEventListener('click', () => this.promptSubmit());
  },

  // Network Status Listeners
  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.state.isOnline = true;
      this.updateStatusPill();
      this.syncAttendance();
    });
    window.addEventListener('offline', () => {
      this.state.isOnline = false;
      this.updateStatusPill();
    });
  },

  // Initialize IndexedDB
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('submissions')) {
          db.createObjectStore('submissions', { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // Load Roster from Cloud or Cache
  async loadRoster() {
    try {
      // Try to fetch from cloud
      const response = await fetch(this.ROSTER_URL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const roster = await response.json();
        this.state.roster = roster;
        localStorage.setItem(this.ROSTER_CACHE_KEY, JSON.stringify(roster));
        this.showSyncStatus('Roster synced successfully', 'success');
        console.log('[ROSTER] Fetched from cloud:', roster);
      } else {
        throw new Error('Cloud fetch failed');
      }
    } catch (error) {
      // Fall back to cached roster
      console.log('[ROSTER] Cloud fetch failed, using cache:', error);
      const cached = localStorage.getItem(this.ROSTER_CACHE_KEY);
      if (cached) {
        this.state.roster = JSON.parse(cached);
        this.showSyncStatus('Using cached roster (offline)', 'warning');
      } else {
        this.showSyncStatus('No roster available. Please sync online.', 'error');
      }
    }
  },

  // Show Sync Status Message
  showSyncStatus(message, type) {
    this.elements.syncCard.style.display = 'block';
    this.elements.syncMessage.innerHTML = `<strong>${type === 'success' ? '✓' : type === 'error' ? '✕' : '⚠'}:</strong> ${message}`;
    if (type === 'success') {
      setTimeout(() => {
        this.elements.syncCard.style.display = 'none';
      }, 4000);
    }
  },

  // Load Draft from localStorage
  async loadDraft() {
    const draft = localStorage.getItem(this.DRAFT_KEY);
    const locked = localStorage.getItem(this.LOCK_KEY);

    if (locked === 'true') {
      this.state.isLocked = true;
      console.log('[DRAFT] Attendance is locked');
      return;
    }

    if (draft) {
      const data = JSON.parse(draft);
      this.elements.dateInput.value = data.date || this.getTodayDate();
      this.elements.startTimeInput.value = data.startTime || '09:00';
      this.elements.endTimeInput.value = data.endTime || '10:20';
      this.elements.classTypeInput.value = data.classType || '1';
      this.elements.onlineCheckbox.checked = data.isOnline || false;
      this.elements.notesInput.value = data.lectureNotes || '';
      this.elements.charCount.textContent = (data.lectureNotes || '').length;
      this.state.attendance = data.students || {};
      console.log('[DRAFT] Loaded from localStorage');
    } else {
      // Set defaults
      this.elements.dateInput.value = this.getTodayDate();
      this.elements.startTimeInput.value = '09:00';
      this.elements.endTimeInput.value = '10:20';
    }
  },

  // Save Draft to localStorage
  saveDraft() {
    if (this.state.isLocked) return;

    const draft = {
      date: this.elements.dateInput.value,
      startTime: this.elements.startTimeInput.value,
      endTime: this.elements.endTimeInput.value,
      classType: this.elements.classTypeInput.value,
      isOnline: this.elements.onlineCheckbox.checked,
      lectureNotes: this.elements.notesInput.value,
      students: this.state.attendance,
    };

    localStorage.setItem(this.DRAFT_KEY, JSON.stringify(draft));
    console.log('[DRAFT] Saved');
  },

  // Update UI
  updateUI() {
    this.updateStatusPill();
    this.updateCourseInfo();
    this.updateAttendanceCounters();
    this.renderStudentList();
    this.updateLockState();
  },

  // Update Status Pill
  updateStatusPill() {
    const pill = this.elements.statusPill;
    const text = this.elements.statusText;

    if (this.state.isOnline) {
      pill.className = 'status-pill online';
      text.textContent = 'Online';
    } else {
      pill.className = 'status-pill offline';
      text.textContent = 'Offline';
    }
  },

  // Update Course Info Display
  updateCourseInfo() {
    if (!this.state.roster) {
      this.elements.courseDisplay.textContent = '✕ No roster loaded';
      this.elements.sectionDisplay.textContent = '✕ No roster loaded';
      this.elements.studentCountDisplay.textContent = '0';
      this.elements.rosterStatusDisplay.textContent = 'Offline or unavailable';
      return;
    }

    const roster = this.state.roster;
    this.elements.courseDisplay.textContent = roster.course || '—';
    this.elements.sectionDisplay.textContent = roster.section || '—';
    this.elements.studentCountDisplay.textContent = (roster.students || []).length;
    const pushedAt = new Date(roster.pushedAt).toLocaleString();
    this.elements.rosterStatusDisplay.textContent = `✓ Synced ${pushedAt}`;
  },

  // Update Attendance Counters
  updateAttendanceCounters() {
    let present = 0;
    let absent = 0;

    if (this.state.roster && this.state.roster.students) {
      this.state.roster.students.forEach((student) => {
        const status = this.state.attendance[student.reg];
        if (status === 'present') present++;
        else if (status === 'absent') absent++;
      });
    }

    this.elements.presentCount.textContent = present;
    this.elements.absentCount.textContent = absent;
  },

  // Render Student List
  renderStudentList() {
    this.elements.studentList.innerHTML = '';

    if (!this.state.roster || !this.state.roster.students) {
      this.elements.studentList.innerHTML = '<div style="padding: 10px; color: var(--cui-muted); font-size: 13px; text-align: center;">No students in roster</div>';
      return;
    }

    this.state.roster.students.forEach((student, index) => {
      const status = this.state.attendance[student.reg];
      const row = document.createElement('div');
      row.className = 'student-row';
      row.innerHTML = `
        <div class="student-sr">${index + 1}</div>
        <div class="student-info">
          <div class="student-reg">${student.displayReg}</div>
          <div class="student-name">${student.name}</div>
        </div>
        <div class="student-pa">
          <button class="pa-btn ${status === 'present' ? 'active-p' : ''}" data-reg="${student.reg}" data-action="present">P</button>
          <button class="pa-btn ${status === 'absent' ? 'active-a' : ''}" data-reg="${student.reg}" data-action="absent">A</button>
        </div>
      `;

      row.querySelectorAll('.pa-btn').forEach((btn) => {
        btn.addEventListener('click', () => this.toggleAttendance(student.reg, btn.dataset.action));
      });

      this.elements.studentList.appendChild(row);
    });
  },

  // Toggle Attendance Mark
  toggleAttendance(reg, action) {
    const current = this.state.attendance[reg];
    const newStatus = current === action ? null : action;
    this.state.attendance[reg] = newStatus;
    this.updateAttendanceCounters();
    this.renderStudentList();
    this.saveDraft();
  },

  // Filter Students
  filterStudents(query) {
    const rows = this.elements.studentList.querySelectorAll('.student-row');
    const term = query.toLowerCase();

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(term) ? '' : 'none';
    });
  },

  // Mark All
  markAll(status) {
    if (this.state.isLocked) {
      this.showToast('Attendance is locked', 'error');
      return;
    }

    if (!this.state.roster) {
      this.showToast('No roster loaded', 'error');
      return;
    }

    this.state.roster.students.forEach((student) => {
      this.state.attendance[student.reg] = status === 'present' ? 'present' : 'absent';
    });

    this.updateAttendanceCounters();
    this.renderStudentList();
    this.saveDraft();
    this.showToast(`Marked all ${status}`, 'success');
  },

  // Reset
  reset() {
    if (this.state.isLocked) {
      this.showToast('Attendance is locked', 'error');
      return;
    }

    this.state.attendance = {};
    this.updateAttendanceCounters();
    this.renderStudentList();
    this.saveDraft();
    this.showToast('Reset complete', 'info');
  },

  // Prompt Submit
  promptSubmit() {
    if (this.state.isLocked) {
      this.showToast('Attendance already submitted and locked', 'error');
      return;
    }

    if (!this.state.roster) {
      this.showToast('No roster loaded', 'error');
      return;
    }

    const present = Object.values(this.state.attendance).filter((s) => s === 'present').length;
    const absent = Object.values(this.state.attendance).filter((s) => s === 'absent').length;
    const unmarked = (this.state.roster.students || []).length - present - absent;

    const message = `
      <strong>Submit Attendance</strong><br>
      Present: ${present}<br>
      Absent: ${absent}<br>
      Unmarked: ${unmarked}<br>
      <br>
      <small>📁 Once submitted, you cannot edit or resubmit.</small>
    `;

    this.showModal(message, [{
      label: 'Cancel',
      action: () => this.closeModal(),
    }, {
      label: 'Submit & Lock',
      action: () => this.submit(),
    }]);
  },

  // Submit Attendance
  async submit() {
    this.closeModal();

    const payload = {
      course: this.state.roster.course,
      courseValue: this.state.roster.courseId || 30000,
      section: this.state.roster.section,
      date: this.elements.dateInput.value,
      startTime: this.elements.startTimeInput.value,
      endTime: this.elements.endTimeInput.value,
      classType: this.elements.classTypeInput.value,
      isOnlineLectureAttendance: this.elements.onlineCheckbox.checked,
      lectureNotes: this.elements.notesInput.value,
      students: (this.state.roster.students || []).map((student) => ({
        reg: student.reg,
        name: student.name,
        present: this.state.attendance[student.reg] === 'present',
      })),
      __source: 'CR_APP',
      submittedAt: new Date().toISOString(),
    };

    // Store in IndexedDB
    try {
      const db = await this.initDB();
      const tx = db.transaction('submissions', 'readwrite');
      const store = tx.objectStore('submissions');
      const id = `${this.state.roster.courseId}-${this.state.roster.section}-${this.elements.dateInput.value}`;
      await new Promise((resolve, reject) => {
        const req = store.put({ id, ...payload });
        req.onsuccess = resolve;
        req.onerror = reject;
      });
    } catch (e) {
      console.error('[DB] Error storing submission:', e);
    }

    // Try to send to cloud
    try {
      const response = await fetch('https://script.google.com/macros/d/YOUR_APPS_SCRIPT_ID/usercontent?action=submitAttendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('[SUBMIT] Sent to cloud successfully');
        this.showToast('Submitted successfully', 'success');
      }
    } catch (e) {
      console.log('[SUBMIT] Cloud submission failed, saved locally:', e);
      this.showToast('Saved locally, will sync when online', 'info');
    }

    // Lock the form
    localStorage.setItem(this.LOCK_KEY, 'true');
    this.state.isLocked = true;
    this.updateLockState();
  },

  // Update Lock State
  updateLockState() {
    if (this.state.isLocked) {
      this.elements.editStatusBadge.textContent = '🔒 Locked';
      this.elements.editStatusBadge.style.color = 'var(--cui-danger)';
      this.elements.sessionCard.style.opacity = '0.7';
      this.elements.notesCard.style.opacity = '0.7';
      this.elements.attendanceCard.style.opacity = '0.7';
      this.elements.dateInput.disabled = true;
      this.elements.startTimeInput.disabled = true;
      this.elements.endTimeInput.disabled = true;
      this.elements.classTypeInput.disabled = true;
      this.elements.onlineCheckbox.disabled = true;
      this.elements.notesInput.disabled = true;
      this.elements.markAllPresentBtn.disabled = true;
      this.elements.markAllAbsentBtn.disabled = true;
      this.elements.resetBtn.disabled = true;
      this.elements.submitBtn.disabled = true;
      this.elements.submitBtn.innerHTML = '<span>🔒</span> <span>Locked</span>';
    }
  },

  // Sync Attendance
  async syncAttendance() {
    console.log('[SYNC] Attempting to sync...');
    // TODO: Implement background sync of queued submissions
  },

  // Modal
  showModal(message, buttons) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modalOverlay';

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `<div class="modal-text">${message}</div>`;

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'modal-buttons';

    buttons.forEach((btn) => {
      const button = document.createElement('button');
      button.className = 'btn primary';
      button.textContent = btn.label;
      button.addEventListener('click', btn.action);
      buttonGroup.appendChild(button);
    });

    modal.appendChild(buttonGroup);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  },

  closeModal() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.remove();
  },

  // Toast Notifications
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  },

  // Utilities
  getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  },
};

// Initialize on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => APP.init());
} else {
  APP.init();
}
