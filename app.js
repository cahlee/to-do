/**
 * Study Tracker Application
 * 스터디 시간 추적 및 관리 애플리케이션
 */

// ==================== Constants ====================
const STORAGE_STUDIES = 'study_tracker_studies';
const STORAGE_RECORDS = 'study_tracker_records';
const LONG_PRESS_DURATION = 500; // milliseconds
const TIME_SLOTS = ['출근길', '아침', '점심', '퇴근길', '퇴근후', '기타'];
const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];
const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

// ==================== State Management ====================
const state = {
    currentPage: 'study',
    currentYear: new Date().getFullYear(),
    editingDate: null,
    challengeViewMode: 'monthly', // 'monthly' or 'daily'
    selectedMonth: null
};

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    try {
        setupNavigation();
        setupStudyPage();
        setupChallengePage();
        setupModals();
        showPage('study');
    } catch (error) {
        console.error('Failed to initialize app:', error);
    }
}

// ==================== Navigation ====================
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            if (page) {
                showPage(page);
            }
        });
    });
}

function showPage(page) {
    if (!page) return;
    
    state.currentPage = page;
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-page') === page);
    });
    
    // Show/hide pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.toggle('active', p.id === `${page}-page`);
    });
    
    // Render appropriate page
    if (page === 'challenge') {
        state.challengeViewMode = 'monthly';
        state.selectedMonth = null;
        renderChallengePage();
    } else if (page === 'study') {
        renderStudyPage();
    }
}

// ==================== Study Page ====================
function setupStudyPage() {
    const addStudyBtn = document.getElementById('add-study-btn');
    if (addStudyBtn) {
        addStudyBtn.addEventListener('click', () => {
            openStudyModal();
        });
    }
}

function renderStudyPage() {
    const grid = document.getElementById('study-grid');
    if (!grid) return;
    
    const studies = getStudies();
    
    if (studies.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">등록된 스터디가 없습니다.</p>';
        return;
    }
    
    grid.innerHTML = studies.map(study => createStudyCardHTML(study)).join('');
    attachStudyCardListeners();
}

function createStudyCardHTML(study) {
    return `
        <div class="study-card" data-study-id="${study.id}">
            <div class="study-category">${escapeHtml(study.category)}</div>
            <div class="study-name">${escapeHtml(study.name)}</div>
        </div>
    `;
}

function attachStudyCardListeners() {
    document.querySelectorAll('.study-card').forEach(card => {
        setupLongPressHandler(card, () => {
            const studyId = card.getAttribute('data-study-id');
            if (studyId) {
                openEditStudyModal(studyId);
            }
        }, () => {
            const studyId = card.getAttribute('data-study-id');
            if (studyId) {
                openTimeModal(studyId);
            }
        });
    });
}

function setupLongPressHandler(element, onLongPress, onClick) {
    let pressTimer = null;
    let isLongPress = false;
    
    const startPress = () => {
        isLongPress = false;
        pressTimer = setTimeout(() => {
            isLongPress = true;
            onLongPress();
        }, LONG_PRESS_DURATION);
    };
    
    const endPress = () => {
        clearTimeout(pressTimer);
    };
    
    const handleClick = () => {
        if (!isLongPress) {
            onClick();
        }
        isLongPress = false;
    };
    
    // Mouse events
    element.addEventListener('mousedown', startPress);
    element.addEventListener('mouseup', endPress);
    element.addEventListener('mouseleave', endPress);
    element.addEventListener('click', handleClick);
    
    // Touch events
    element.addEventListener('touchstart', startPress);
    element.addEventListener('touchend', (e) => {
        endPress();
        if (!isLongPress) {
            onClick();
        }
        isLongPress = false;
    });
    element.addEventListener('touchcancel', endPress);
}

function openStudyModal(studyId = null) {
    const modal = document.getElementById('study-modal');
    const form = document.getElementById('study-form');
    const modalTitle = modal?.querySelector('h2');
    
    if (!modal || !form || !modalTitle) return;
    
    const isEditMode = studyId !== null;
    modalTitle.textContent = isEditMode ? '스터디 수정' : '스터디 등록';
    form.reset();
    form.setAttribute('data-study-id', studyId || '');
    
    if (isEditMode) {
        const study = getStudyById(studyId);
        if (study) {
            const categoryInput = document.getElementById('study-category');
            const nameInput = document.getElementById('study-name');
            if (categoryInput) categoryInput.value = study.category;
            if (nameInput) nameInput.value = study.name;
        }
    }
    
    modal.classList.add('active');
    
    form.onsubmit = (e) => {
        e.preventDefault();
        handleStudyFormSubmit(studyId);
    };
}

function handleStudyFormSubmit(studyId) {
    const categoryInput = document.getElementById('study-category');
    const nameInput = document.getElementById('study-name');
    const form = document.getElementById('study-form');
    const modal = document.getElementById('study-modal');
    
    if (!categoryInput || !nameInput || !form || !modal) return;
    
    const category = categoryInput.value.trim();
    const name = nameInput.value.trim();
    
    if (!category || !name) {
        alert('카테고리와 스터디명을 모두 입력해주세요.');
        return;
    }
    
    try {
        if (studyId) {
            updateStudy(studyId, category, name);
        } else {
            addStudy(category, name);
        }
        form.setAttribute('data-study-id', '');
        modal.classList.remove('active');
        renderStudyPage();
    } catch (error) {
        console.error('Failed to save study:', error);
        alert('스터디 저장 중 오류가 발생했습니다.');
    }
}

function openEditStudyModal(studyId) {
    const study = getStudyById(studyId);
    if (!study) {
        console.warn('Study not found:', studyId);
        return;
    }
    openStudyModal(studyId);
}

function openTimeModal(studyId) {
    const modal = document.getElementById('time-modal');
    const form = document.getElementById('time-form');
    const dateInput = document.getElementById('time-date');
    const studyIdInput = document.getElementById('time-study-id');
    
    if (!modal || !form || !dateInput || !studyIdInput) return;
    
    const today = new Date();
    dateInput.value = formatDateForInput(today);
    studyIdInput.value = studyId;
    form.reset();
    dateInput.value = formatDateForInput(today);
    
    modal.classList.add('active');
    
    form.onsubmit = (e) => {
        e.preventDefault();
        handleTimeFormSubmit(studyId);
    };
}

function handleTimeFormSubmit(studyId) {
    const dateInput = document.getElementById('time-date');
    const timeSlotInput = document.getElementById('time-slot');
    const durationInput = document.getElementById('time-duration');
    const modal = document.getElementById('time-modal');
    
    if (!dateInput || !timeSlotInput || !durationInput || !modal) return;
    
    const date = dateInput.value;
    const timeSlot = timeSlotInput.value;
    const duration = parseInt(durationInput.value);
    
    if (!date || !timeSlot || !duration || duration <= 0) {
        alert('모든 필드를 올바르게 입력해주세요.');
        return;
    }
    
    try {
        addStudyRecord(studyId, date, timeSlot, duration);
        modal.classList.remove('active');
        if (state.currentPage === 'challenge') {
            renderChallengePage();
        }
    } catch (error) {
        console.error('Failed to save study record:', error);
        alert('기록 저장 중 오류가 발생했습니다.');
    }
}

// ==================== Challenge Page ====================
function setupChallengePage() {
    const prevYearBtn = document.getElementById('prev-year-btn');
    const nextYearBtn = document.getElementById('next-year-btn');
    
    if (prevYearBtn) {
        prevYearBtn.addEventListener('click', () => {
            state.currentYear--;
            updateYearDisplay();
            renderChallengePage();
        });
    }
    
    if (nextYearBtn) {
        nextYearBtn.addEventListener('click', () => {
            state.currentYear++;
            updateYearDisplay();
            renderChallengePage();
        });
    }
    
    updateYearDisplay();
}

function updateYearDisplay() {
    const yearDisplay = document.getElementById('current-year');
    if (yearDisplay) {
        yearDisplay.textContent = state.currentYear;
    }
}

function renderChallengePage() {
    if (state.challengeViewMode === 'monthly') {
        renderMonthlyView();
    } else {
        renderDailyView();
    }
}

function renderMonthlyView() {
    const tbody = document.getElementById('challenge-tbody');
    if (!tbody) return;
    
    const records = getStudyRecords();
    const yearRecords = filterRecordsByYear(records, state.currentYear);
    const recordsByMonth = groupRecordsByMonth(yearRecords);
    
    tbody.innerHTML = Array.from({ length: 12 }, (_, month) => {
        const monthRecords = recordsByMonth[month] || [];
        const { totals, studyNames } = calculateTotals(monthRecords);
        const total = Object.values(totals).reduce((sum, val) => sum + val, 0);
        const studyList = Array.from(studyNames).join(', ');
        
        return createMonthlyRowHTML(month, totals, total, studyList);
    }).join('');
    
    attachMonthlyRowListeners();
}

function renderDailyView() {
    const tbody = document.getElementById('challenge-tbody');
    if (!tbody) return;
    
    if (state.selectedMonth === null) {
        state.challengeViewMode = 'monthly';
        renderChallengePage();
        return;
    }
    
    const records = getStudyRecords();
    const monthRecords = filterRecordsByYearAndMonth(records, state.currentYear, state.selectedMonth);
    const recordsByDate = groupRecordsByDate(monthRecords);
    const days = getAllDaysOfMonth(state.currentYear, state.selectedMonth);
    
    const backButton = '<tr><td colspan="10" style="text-align: center; padding: 1rem;"><button id="back-to-monthly-btn" class="btn btn-primary">월별 보기로 돌아가기</button></td></tr>';
    
    const daysHtml = days.map(day => {
        const dateKey = formatDateForStorage(day);
        const dayRecords = recordsByDate[dateKey] || [];
        const { totals, studyNames } = calculateTotals(dayRecords);
        const total = Object.values(totals).reduce((sum, val) => sum + val, 0);
        const studyList = Array.from(studyNames).join(', ');
        const memo = dayRecords.length > 0 ? (dayRecords[0].memo || '') : '';
        const dateStr = formatDateString(day);
        
        return createDailyRowHTML(dateKey, dateStr, totals, total, studyList, memo);
    }).join('');
    
    tbody.innerHTML = backButton + daysHtml;
    
    attachDailyViewListeners();
}

function createMonthlyRowHTML(month, totals, total, studyList) {
    return `
        <tr class="month-row clickable" data-month="${month}">
            <td class="date-cell">${MONTH_NAMES[month]}</td>
            ${TIME_SLOTS.map(slot => `<td class="time-cell">${totals[slot] > 0 ? totals[slot] + '분' : ''}</td>`).join('')}
            <td class="total-cell">${total > 0 ? total + '분' : ''}</td>
            <td class="study-list-cell">${escapeHtml(studyList)}</td>
            <td class="memo-cell">-</td>
        </tr>
    `;
}

function createDailyRowHTML(dateKey, dateStr, totals, total, studyList, memo) {
    return `
        <tr data-date="${dateKey}">
            <td class="date-cell">${dateStr}</td>
            ${TIME_SLOTS.map(slot => `<td class="time-cell" data-slot="${slot}">${totals[slot] > 0 ? totals[slot] + '분' : ''}</td>`).join('')}
            <td class="total-cell clickable" data-date="${dateKey}">${total > 0 ? total + '분' : ''}</td>
            <td class="study-list-cell clickable" data-date="${dateKey}">${escapeHtml(studyList)}</td>
            <td class="memo-cell">
                <div class="memo-display" data-date="${dateKey}">
                    ${memo ? escapeHtml(memo) : '<span class="memo-placeholder">메모 입력</span>'}
                </div>
            </td>
        </tr>
    `;
}

function attachMonthlyRowListeners() {
    document.querySelectorAll('.month-row').forEach(row => {
        row.addEventListener('click', () => {
            const month = parseInt(row.getAttribute('data-month'));
            if (!isNaN(month)) {
                state.selectedMonth = month;
                state.challengeViewMode = 'daily';
                renderChallengePage();
            }
        });
    });
}

function attachDailyViewListeners() {
    const backBtn = document.getElementById('back-to-monthly-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            state.challengeViewMode = 'monthly';
            state.selectedMonth = null;
            renderChallengePage();
        });
    }
    
    // Time cell listeners
    document.querySelectorAll('.time-cell[data-slot]').forEach(cell => {
        cell.addEventListener('click', () => {
            const row = cell.closest('tr');
            const date = row?.getAttribute('data-date');
            const slot = cell.getAttribute('data-slot');
            if (date && slot) {
                openEditModal(date, slot);
            }
        });
    });
    
    // Clickable cell listeners (total, study list)
    document.querySelectorAll('.clickable[data-date]').forEach(cell => {
        cell.addEventListener('click', () => {
            const date = cell.getAttribute('data-date');
            if (date) {
                openEditModal(date, null);
            }
        });
    });
    
    // Memo display listeners
    document.querySelectorAll('.memo-display').forEach(display => {
        display.addEventListener('click', () => {
            setupMemoInput(display);
        });
    });
}

function setupMemoInput(display) {
    const date = display.getAttribute('data-date');
    if (!date) return;
    
    const currentMemo = display.textContent.trim();
    const isPlaceholder = display.querySelector('.memo-placeholder');
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'memo-input';
    input.value = isPlaceholder ? '' : currentMemo;
    input.setAttribute('data-date', date);
    
    display.style.display = 'none';
    display.parentElement.appendChild(input);
    input.focus();
    input.select();
    
    const saveMemo = () => {
        const memo = input.value.trim();
        try {
            updateMemo(date, memo);
            input.remove();
            display.style.display = '';
            display.innerHTML = memo ? escapeHtml(memo) : '<span class="memo-placeholder">메모 입력</span>';
        } catch (error) {
            console.error('Failed to save memo:', error);
            input.remove();
            display.style.display = '';
        }
    };
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveMemo();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            input.remove();
            display.style.display = '';
        }
    });
    
    input.addEventListener('blur', saveMemo);
}

// ==================== Data Processing ====================
function filterRecordsByYear(records, year) {
    return records.filter(record => {
        try {
            const recordDate = new Date(record.date);
            return recordDate.getFullYear() === year;
        } catch (error) {
            console.warn('Invalid date in record:', record);
            return false;
        }
    });
}

function filterRecordsByYearAndMonth(records, year, month) {
    return records.filter(record => {
        try {
            const recordDate = new Date(record.date);
            return recordDate.getFullYear() === year && recordDate.getMonth() === month;
        } catch (error) {
            console.warn('Invalid date in record:', record);
            return false;
        }
    });
}

function groupRecordsByMonth(records) {
    const grouped = {};
    records.forEach(record => {
        try {
            const recordDate = new Date(record.date);
            const month = recordDate.getMonth();
            if (!grouped[month]) {
                grouped[month] = [];
            }
            grouped[month].push(record);
        } catch (error) {
            console.warn('Invalid date in record:', record);
        }
    });
    return grouped;
}

function groupRecordsByDate(records) {
    const grouped = {};
    records.forEach(record => {
        const dateKey = record.date;
        if (!grouped[dateKey]) {
            grouped[dateKey] = [];
        }
        grouped[dateKey].push(record);
    });
    return grouped;
}

function calculateTotals(records) {
    const totals = TIME_SLOTS.reduce((acc, slot) => {
        acc[slot] = 0;
        return acc;
    }, {});
    
    const studyNames = new Set();
    
    records.forEach(record => {
        if (TIME_SLOTS.includes(record.timeSlot)) {
            totals[record.timeSlot] += record.duration || 0;
        }
        const study = getStudyById(record.studyId);
        if (study) {
            studyNames.add(study.name);
        }
    });
    
    return { totals, studyNames };
}

// ==================== Edit Modal ====================
function openEditModal(date, slot) {
    if (!date) return;
    
    state.editingDate = date;
    const modal = document.getElementById('edit-modal');
    const records = getStudyRecords();
    
    if (!modal) return;
    
    const dateRecords = records.filter(r => r.date === date);
    const filteredRecords = slot ? dateRecords.filter(r => r.timeSlot === slot) : dateRecords;
    const editList = document.getElementById('edit-records-list');
    
    if (!editList) return;
    
    let recordsHtml = '';
    if (filteredRecords.length === 0) {
        recordsHtml = '<p style="color: #999; margin-bottom: 1rem;">기록이 없습니다.</p>';
    } else {
        recordsHtml = filteredRecords.map(record => createEditRecordItemHTML(record)).join('');
    }
    
    recordsHtml += createAddRecordSectionHTML();
    editList.innerHTML = recordsHtml;
    
    attachEditModalListeners(date, slot);
    
    const memo = dateRecords.length > 0 ? (dateRecords[0].memo || '') : '';
    const memoInput = document.getElementById('edit-memo');
    if (memoInput) {
        memoInput.value = memo;
    }
    
    modal.classList.add('active');
}

function createEditRecordItemHTML(record) {
    const study = getStudyById(record.studyId);
    const studyName = study ? study.name : '알 수 없음';
    
    return `
        <div class="edit-record-item" data-record-id="${record.id}">
            <div class="edit-record-item-header">
                <div class="edit-record-item-title">${escapeHtml(studyName)}</div>
                <button type="button" class="delete-record-btn" data-record-id="${record.id}">삭제</button>
            </div>
            <div class="edit-record-item-details">
                ${record.timeSlot} | ${record.duration}분
            </div>
            <div class="form-group">
                <label>수행 시간 (분)</label>
                <input type="number" class="edit-duration-input" value="${record.duration}" 
                       data-record-id="${record.id}" min="1">
            </div>
        </div>
    `;
}

function createAddRecordSectionHTML() {
    const studies = getStudies();
    const studiesOptions = studies.map(s => 
        `<option value="${s.id}">${escapeHtml(s.category)} - ${escapeHtml(s.name)}</option>`
    ).join('');
    
    const timeSlotOptions = TIME_SLOTS.map(slot => 
        `<option value="${slot}">${slot}</option>`
    ).join('');
    
    return `
        <div class="edit-record-item" style="border-left-color: #28a745;">
            <div class="edit-record-item-header">
                <div class="edit-record-item-title">새 기록 추가</div>
            </div>
            <div class="form-group">
                <label>스터디</label>
                <select id="add-record-study" class="edit-select">
                    <option value="">선택하세요</option>
                    ${studiesOptions}
                </select>
            </div>
            <div class="form-group">
                <label>언제</label>
                <select id="add-record-slot" class="edit-select">
                    <option value="">선택하세요</option>
                    ${timeSlotOptions}
                </select>
            </div>
            <div class="form-group">
                <label>수행 시간 (분)</label>
                <input type="number" id="add-record-duration" class="edit-select" min="1">
            </div>
            <button type="button" id="add-record-btn" class="btn btn-primary" style="width: 100%;">추가</button>
        </div>
    `;
}

function attachEditModalListeners(date, slot) {
    // Delete buttons
    document.querySelectorAll('.delete-record-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const recordId = btn.getAttribute('data-record-id');
            if (recordId) {
                try {
                    deleteStudyRecord(recordId);
                    openEditModal(date, slot);
                } catch (error) {
                    console.error('Failed to delete record:', error);
                    alert('기록 삭제 중 오류가 발생했습니다.');
                }
            }
        });
    });
    
    // Add record button
    const addRecordBtn = document.getElementById('add-record-btn');
    if (addRecordBtn) {
        addRecordBtn.addEventListener('click', () => {
            handleAddRecord(date, slot);
        });
    }
    
    // Save button
    const saveBtn = document.getElementById('save-edit-btn');
    if (saveBtn) {
        saveBtn.onclick = () => {
            handleSaveEdit(date);
        };
    }
}

function handleAddRecord(date, slot) {
    const studySelect = document.getElementById('add-record-study');
    const slotSelect = document.getElementById('add-record-slot');
    const durationInput = document.getElementById('add-record-duration');
    
    if (!studySelect || !slotSelect || !durationInput) return;
    
    const studyId = studySelect.value;
    const timeSlot = slotSelect.value;
    const duration = parseInt(durationInput.value);
    
    if (!studyId || !timeSlot || !duration || duration <= 0) {
        alert('모든 필드를 올바르게 입력해주세요.');
        return;
    }
    
    try {
        addStudyRecord(studyId, date, timeSlot, duration);
        openEditModal(date, slot);
    } catch (error) {
        console.error('Failed to add record:', error);
        alert('기록 추가 중 오류가 발생했습니다.');
    }
}

function handleSaveEdit(date) {
    const modal = document.getElementById('edit-modal');
    
    // Update durations
    document.querySelectorAll('.edit-duration-input').forEach(input => {
        const recordId = input.getAttribute('data-record-id');
        const duration = parseInt(input.value);
        if (recordId && duration > 0) {
            try {
                updateStudyRecordDuration(recordId, duration);
            } catch (error) {
                console.error('Failed to update record duration:', error);
            }
        }
    });
    
    // Update memo
    const memoInput = document.getElementById('edit-memo');
    if (memoInput) {
        const memo = memoInput.value.trim();
        try {
            updateMemo(date, memo);
        } catch (error) {
            console.error('Failed to update memo:', error);
        }
    }
    
    if (modal) {
        modal.classList.remove('active');
    }
    renderChallengePage();
}

// ==================== Modals ====================
function setupModals() {
    // Close modals on X click
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Close modals on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// ==================== Data Management ====================
function getStudies() {
    try {
        const data = localStorage.getItem(STORAGE_STUDIES);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Failed to get studies:', error);
        return [];
    }
}

function saveStudies(studies) {
    try {
        localStorage.setItem(STORAGE_STUDIES, JSON.stringify(studies));
    } catch (error) {
        console.error('Failed to save studies:', error);
        throw error;
    }
}

function addStudy(category, name) {
    if (!category || !name) {
        throw new Error('Category and name are required');
    }
    
    const studies = getStudies();
    const newStudy = {
        id: Date.now().toString(),
        category: category.trim(),
        name: name.trim()
    };
    studies.push(newStudy);
    saveStudies(studies);
    return newStudy;
}

function updateStudy(studyId, category, name) {
    if (!studyId || !category || !name) {
        throw new Error('Study ID, category and name are required');
    }
    
    const studies = getStudies();
    const study = studies.find(s => s.id === studyId);
    if (!study) {
        throw new Error('Study not found');
    }
    
    study.category = category.trim();
    study.name = name.trim();
    saveStudies(studies);
    return study;
}

function getStudyById(id) {
    if (!id) return null;
    const studies = getStudies();
    return studies.find(s => s.id === id) || null;
}

function getStudyRecords() {
    try {
        const data = localStorage.getItem(STORAGE_RECORDS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Failed to get study records:', error);
        return [];
    }
}

function saveStudyRecords(records) {
    try {
        localStorage.setItem(STORAGE_RECORDS, JSON.stringify(records));
    } catch (error) {
        console.error('Failed to save study records:', error);
        throw error;
    }
}

function addStudyRecord(studyId, date, timeSlot, duration) {
    if (!studyId || !date || !timeSlot || !duration || duration <= 0) {
        throw new Error('Invalid record data');
    }
    
    if (!TIME_SLOTS.includes(timeSlot)) {
        throw new Error('Invalid time slot');
    }
    
    const records = getStudyRecords();
    const newRecord = {
        id: Date.now().toString(),
        studyId: studyId,
        date: date,
        timeSlot: timeSlot,
        duration: duration
    };
    records.push(newRecord);
    saveStudyRecords(records);
    return newRecord;
}

function updateStudyRecordDuration(recordId, duration) {
    if (!recordId || !duration || duration <= 0) {
        throw new Error('Invalid record ID or duration');
    }
    
    const records = getStudyRecords();
    const record = records.find(r => r.id === recordId);
    if (!record) {
        throw new Error('Record not found');
    }
    
    record.duration = duration;
    saveStudyRecords(records);
    return record;
}

function deleteStudyRecord(recordId) {
    if (!recordId) {
        throw new Error('Record ID is required');
    }
    
    const records = getStudyRecords();
    const filtered = records.filter(r => r.id !== recordId);
    if (filtered.length === records.length) {
        throw new Error('Record not found');
    }
    saveStudyRecords(filtered);
}

function updateMemo(date, memo) {
    if (!date) return;
    
    const records = getStudyRecords();
    const dateRecords = records.filter(r => r.date === date);
    
    if (dateRecords.length > 0) {
        dateRecords.forEach(record => {
            record.memo = memo || '';
        });
        saveStudyRecords(records);
    }
}

// ==================== Utility Functions ====================
function formatDateForInput(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateForStorage(date) {
    if (typeof date === 'string') {
        return date;
    }
    return formatDateForInput(date);
}

function formatDateString(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const dayOfWeek = DAYS_OF_WEEK[d.getDay()];
    return `${d.getMonth() + 1}/${d.getDate()}(${dayOfWeek})`;
}

function getAllDaysOfMonth(year, month) {
    if (month < 0 || month > 11) return [];
    
    const days = [];
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        days.push(new Date(d));
    }
    
    return days;
}

function escapeHtml(text) {
    if (text == null) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== Export for Testing ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getStudies,
        addStudy,
        updateStudy,
        getStudyById,
        getStudyRecords,
        addStudyRecord,
        updateStudyRecordDuration,
        deleteStudyRecord,
        updateMemo,
        formatDateForInput,
        formatDateString,
        escapeHtml,
        calculateTotals,
        filterRecordsByYear,
        filterRecordsByYearAndMonth
    };
}
