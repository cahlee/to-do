/**
 * Study Tracker Test Suite
 * 간단한 단위 테스트 및 통합 테스트
 */

// Mock localStorage for testing
function createMockLocalStorage() {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; }
    };
}

// Test utilities
const TestUtils = {
    assert: (condition, message) => {
        if (!condition) {
            throw new Error(`Assertion failed: ${message}`);
        }
    },
    
    assertEquals: (actual, expected, message) => {
        if (actual !== expected) {
            throw new Error(`Expected ${expected}, but got ${actual}. ${message || ''}`);
        }
    },
    
    assertArrayEquals: (actual, expected, message) => {
        if (actual.length !== expected.length) {
            throw new Error(`Array length mismatch. Expected ${expected.length}, got ${actual.length}. ${message || ''}`);
        }
        actual.forEach((item, index) => {
            if (JSON.stringify(item) !== JSON.stringify(expected[index])) {
                throw new Error(`Array item mismatch at index ${index}. ${message || ''}`);
            }
        });
    },
    
    runTest: (name, testFn) => {
        try {
            testFn();
            console.log(`✓ ${name}`);
            return true;
        } catch (error) {
            console.error(`✗ ${name}: ${error.message}`);
            return false;
        }
    }
};

// Test data management functions
function testDataManagement() {
    console.log('\n=== Data Management Tests ===');
    
    // Setup mock localStorage
    const mockStorage = createMockLocalStorage();
    const originalStorage = window.localStorage;
    window.localStorage = mockStorage;
    
    // Reset storage
    mockStorage.clear();
    
    // Test addStudy
    TestUtils.runTest('addStudy - should add a new study', () => {
        const study = addStudy('프로그래밍', 'JavaScript');
        TestUtils.assert(study.id !== undefined, 'Study should have an id');
        TestUtils.assertEquals(study.category, '프로그래밍');
        TestUtils.assertEquals(study.name, 'JavaScript');
        
        const studies = getStudies();
        TestUtils.assertEquals(studies.length, 1);
        TestUtils.assertEquals(studies[0].name, 'JavaScript');
    });
    
    // Test getStudyById
    TestUtils.runTest('getStudyById - should return study by id', () => {
        const studies = getStudies();
        if (studies.length > 0) {
            const study = getStudyById(studies[0].id);
            TestUtils.assert(study !== null, 'Study should be found');
            TestUtils.assertEquals(study.name, 'JavaScript');
        }
    });
    
    // Test updateStudy
    TestUtils.runTest('updateStudy - should update study', () => {
        const studies = getStudies();
        if (studies.length > 0) {
            const studyId = studies[0].id;
            updateStudy(studyId, '프로그래밍', 'TypeScript');
            
            const updated = getStudyById(studyId);
            TestUtils.assertEquals(updated.name, 'TypeScript');
        }
    });
    
    // Test addStudyRecord
    TestUtils.runTest('addStudyRecord - should add a new record', () => {
        const studies = getStudies();
        if (studies.length > 0) {
            const studyId = studies[0].id;
            const today = new Date().toISOString().split('T')[0];
            const record = addStudyRecord(studyId, today, '아침', 30);
            
            TestUtils.assert(record.id !== undefined, 'Record should have an id');
            TestUtils.assertEquals(record.duration, 30);
            TestUtils.assertEquals(record.timeSlot, '아침');
            
            const records = getStudyRecords();
            TestUtils.assertEquals(records.length, 1);
        }
    });
    
    // Test updateStudyRecordDuration
    TestUtils.runTest('updateStudyRecordDuration - should update duration', () => {
        const records = getStudyRecords();
        if (records.length > 0) {
            const recordId = records[0].id;
            updateStudyRecordDuration(recordId, 60);
            
            const updated = getStudyRecords().find(r => r.id === recordId);
            TestUtils.assertEquals(updated.duration, 60);
        }
    });
    
    // Test deleteStudyRecord
    TestUtils.runTest('deleteStudyRecord - should delete record', () => {
        const records = getStudyRecords();
        const initialCount = records.length;
        if (initialCount > 0) {
            const recordId = records[0].id;
            deleteStudyRecord(recordId);
            
            const remaining = getStudyRecords();
            TestUtils.assertEquals(remaining.length, initialCount - 1);
        }
    });
    
    // Restore original localStorage
    window.localStorage = originalStorage;
}

// Test utility functions
function testUtilityFunctions() {
    console.log('\n=== Utility Functions Tests ===');
    
    // Test formatDateForInput
    TestUtils.runTest('formatDateForInput - should format date correctly', () => {
        const date = new Date(2024, 0, 15); // January 15, 2024
        const formatted = formatDateForInput(date);
        TestUtils.assertEquals(formatted, '2024-01-15');
    });
    
    // Test formatDateString
    TestUtils.runTest('formatDateString - should format date string correctly', () => {
        const date = new Date(2024, 0, 15); // January 15, 2024 (Monday)
        const formatted = formatDateString(date);
        TestUtils.assert(formatted.includes('1/15'), 'Should include month and day');
        TestUtils.assert(formatted.includes('('), 'Should include day of week');
    });
    
    // Test escapeHtml
    TestUtils.runTest('escapeHtml - should escape HTML characters', () => {
        const html = '<script>alert("xss")</script>';
        const escaped = escapeHtml(html);
        TestUtils.assert(!escaped.includes('<script>'), 'Should escape script tags');
        TestUtils.assert(escaped.includes('&lt;'), 'Should escape < character');
    });
    
    // Test getAllDaysOfMonth
    TestUtils.runTest('getAllDaysOfMonth - should return all days of month', () => {
        const days = getAllDaysOfMonth(2024, 0); // January 2024
        TestUtils.assertEquals(days.length, 31, 'January should have 31 days');
        
        const febDays = getAllDaysOfMonth(2024, 1); // February 2024
        TestUtils.assertEquals(febDays.length, 29, 'February 2024 should have 29 days (leap year)');
    });
}

// Test data processing functions
function testDataProcessing() {
    console.log('\n=== Data Processing Tests ===');
    
    const mockStorage = createMockLocalStorage();
    const originalStorage = window.localStorage;
    window.localStorage = mockStorage;
    mockStorage.clear();
    
    // Setup test data
    const study1 = addStudy('프로그래밍', 'JavaScript');
    const study2 = addStudy('언어', '영어');
    
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    addStudyRecord(study1.id, today, '아침', 30);
    addStudyRecord(study1.id, today, '점심', 20);
    addStudyRecord(study2.id, yesterday, '아침', 40);
    
    // Test filterRecordsByYear
    TestUtils.runTest('filterRecordsByYear - should filter by year', () => {
        const records = getStudyRecords();
        const currentYear = new Date().getFullYear();
        const filtered = filterRecordsByYear(records, currentYear);
        TestUtils.assert(filtered.length > 0, 'Should have records for current year');
    });
    
    // Test calculateTotals
    TestUtils.runTest('calculateTotals - should calculate totals correctly', () => {
        const records = getStudyRecords();
        const { totals, studyNames } = calculateTotals(records);
        
        TestUtils.assert(totals['아침'] > 0, 'Should have morning records');
        TestUtils.assert(studyNames.size > 0, 'Should have study names');
    });
    
    // Test groupRecordsByDate
    TestUtils.runTest('groupRecordsByDate - should group by date', () => {
        const records = getStudyRecords();
        const grouped = groupRecordsByDate(records);
        
        TestUtils.assert(Object.keys(grouped).length > 0, 'Should have grouped records');
        const todayRecords = grouped[today];
        if (todayRecords) {
            TestUtils.assert(todayRecords.length > 0, 'Should have records for today');
        }
    });
    
    window.localStorage = originalStorage;
}

// Test error handling
function testErrorHandling() {
    console.log('\n=== Error Handling Tests ===');
    
    const mockStorage = createMockLocalStorage();
    const originalStorage = window.localStorage;
    window.localStorage = mockStorage;
    mockStorage.clear();
    
    // Test addStudy with invalid input
    TestUtils.runTest('addStudy - should throw error for invalid input', () => {
        let errorThrown = false;
        try {
            addStudy('', 'Test');
        } catch (error) {
            errorThrown = true;
        }
        TestUtils.assert(errorThrown, 'Should throw error for empty category');
    });
    
    // Test addStudyRecord with invalid time slot
    TestUtils.runTest('addStudyRecord - should throw error for invalid time slot', () => {
        const study = addStudy('Test', 'Test');
        let errorThrown = false;
        try {
            addStudyRecord(study.id, '2024-01-01', 'InvalidSlot', 30);
        } catch (error) {
            errorThrown = true;
        }
        TestUtils.assert(errorThrown, 'Should throw error for invalid time slot');
    });
    
    // Test updateStudyRecordDuration with invalid duration
    TestUtils.runTest('updateStudyRecordDuration - should throw error for invalid duration', () => {
        const study = addStudy('Test', 'Test');
        const record = addStudyRecord(study.id, '2024-01-01', '아침', 30);
        let errorThrown = false;
        try {
            updateStudyRecordDuration(record.id, -10);
        } catch (error) {
            errorThrown = true;
        }
        TestUtils.assert(errorThrown, 'Should throw error for negative duration');
    });
    
    window.localStorage = originalStorage;
}

// Run all tests
function runAllTests() {
    console.log('Starting Study Tracker Tests...\n');
    
    let passed = 0;
    let failed = 0;
    
    const testSuites = [
        testDataManagement,
        testUtilityFunctions,
        testDataProcessing,
        testErrorHandling
    ];
    
    testSuites.forEach(suite => {
        try {
            suite();
        } catch (error) {
            console.error('Test suite failed:', error);
            failed++;
        }
    });
    
    console.log('\n=== Test Summary ===');
    console.log(`Total test suites: ${testSuites.length}`);
    console.log('Run tests in browser console to see detailed results.');
}

// Auto-run tests if in browser
if (typeof window !== 'undefined') {
    // Wait for app.js to load
    if (typeof addStudy !== 'undefined') {
        runAllTests();
    } else {
        window.addEventListener('load', () => {
            setTimeout(runAllTests, 100);
        });
    }
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runAllTests,
        testDataManagement,
        testUtilityFunctions,
        testDataProcessing,
        testErrorHandling,
        TestUtils,
        createMockLocalStorage
    };
}

