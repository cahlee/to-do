# Study Tracker API 문서

## 기본 정보

- Base URL: `http://localhost:8080/api`
- Content-Type: `application/json`
- 모든 날짜는 ISO 8601 형식 (`YYYY-MM-DD`)을 사용합니다.

## API 목록

### 1. Study (스터디) API

#### 1.1 전체 스터디 목록 조회
```
GET /api/studies
```

**Response:**
```json
[
  {
    "id": 1,
    "category": "프로그래밍",
    "name": "Java 스터디"
  },
  {
    "id": 2,
    "category": "언어",
    "name": "영어 회화"
  }
]
```

#### 1.2 스터디 상세 조회
```
GET /api/studies/{id}
```

**Response:**
```json
{
  "id": 1,
  "category": "프로그래밍",
  "name": "Java 스터디"
}
```

#### 1.3 스터디 등록
```
POST /api/studies
```

**Request Body:**
```json
{
  "category": "프로그래밍",
  "name": "Java 스터디"
}
```

**Response:**
```json
{
  "id": 1,
  "category": "프로그래밍",
  "name": "Java 스터디"
}
```

#### 1.4 스터디 수정
```
PUT /api/studies/{id}
```

**Request Body:**
```json
{
  "category": "프로그래밍",
  "name": "Spring Boot 스터디"
}
```

**Response:**
```json
{
  "id": 1,
  "category": "프로그래밍",
  "name": "Spring Boot 스터디"
}
```

#### 1.5 스터디 삭제
```
DELETE /api/studies/{id}
```

**Response:** 204 No Content

---

### 2. StudyRecord (스터디 기록) API

#### 2.1 기록 목록 조회
```
GET /api/records
GET /api/records?date=2024-01-01
GET /api/records?startDate=2024-01-01&endDate=2024-01-31
GET /api/records?year=2024
```

**Query Parameters:**
- `date` (optional): 특정 날짜의 기록 조회
- `startDate` (optional): 시작 날짜 (endDate와 함께 사용)
- `endDate` (optional): 종료 날짜 (startDate와 함께 사용)
- `year` (optional): 특정 연도의 기록 조회

**Response:**
```json
[
  {
    "id": 1,
    "studyId": 1,
    "studyName": "Java 스터디",
    "studyCategory": "프로그래밍",
    "date": "2024-01-01",
    "timeSlot": "아침",
    "duration": 60
  }
]
```

#### 2.2 기록 상세 조회
```
GET /api/records/{id}
```

**Response:**
```json
{
  "id": 1,
  "studyId": 1,
  "studyName": "Java 스터디",
  "studyCategory": "프로그래밍",
  "date": "2024-01-01",
  "timeSlot": "아침",
  "duration": 60
}
```

#### 2.3 기록 등록
```
POST /api/records
```

**Request Body:**
```json
{
  "studyId": 1,
  "date": "2024-01-01",
  "timeSlot": "아침",
  "duration": 60
}
```

**timeSlot 값:**
- `출근길`
- `아침`
- `점심`
- `퇴근길`
- `퇴근후`
- `기타`

**Response:**
```json
{
  "id": 1,
  "studyId": 1,
  "studyName": "Java 스터디",
  "studyCategory": "프로그래밍",
  "date": "2024-01-01",
  "timeSlot": "아침",
  "duration": 60
}
```

#### 2.4 기록 수정
```
PUT /api/records/{id}
```

**Request Body:**
```json
{
  "studyId": 1,
  "date": "2024-01-01",
  "timeSlot": "점심",
  "duration": 90
}
```

**Response:**
```json
{
  "id": 1,
  "studyId": 1,
  "studyName": "Java 스터디",
  "studyCategory": "프로그래밍",
  "date": "2024-01-01",
  "timeSlot": "점심",
  "duration": 90
}
```

#### 2.5 기록 삭제
```
DELETE /api/records/{id}
```

**Response:** 204 No Content

---

### 3. DailyMemo (일자별 메모) API

#### 3.1 메모 조회
```
GET /api/memos/{date}
```

**Path Parameters:**
- `date`: 날짜 (YYYY-MM-DD 형식)

**Response:**
```json
{
  "id": 1,
  "date": "2024-01-01",
  "memo": "오늘은 Java 기초를 공부했다."
}
```

**메모가 없는 경우:** 404 Not Found

#### 3.2 메모 저장/수정
```
PUT /api/memos/{date}
```

**Path Parameters:**
- `date`: 날짜 (YYYY-MM-DD 형식)

**Request Body:**
```json
{
  "memo": "오늘은 Java 기초를 공부했다."
}
```

**Response:**
```json
{
  "id": 1,
  "date": "2024-01-01",
  "memo": "오늘은 Java 기초를 공부했다."
}
```

---

### 4. Challenge (챌린지) API

#### 4.1 월별 집계 조회
```
GET /api/challenge/monthly/{year}
```

**Path Parameters:**
- `year`: 연도 (예: 2024)

**Response:**
```json
[
  {
    "month": 1,
    "timeSlotTotals": {
      "출근길": 120,
      "아침": 300,
      "점심": 180,
      "퇴근길": 90,
      "퇴근후": 240,
      "기타": 60
    },
    "totalDuration": 990,
    "studyNames": ["Java 스터디", "영어 회화"]
  },
  {
    "month": 2,
    "timeSlotTotals": {
      "출근길": 0,
      "아침": 0,
      "점심": 0,
      "퇴근길": 0,
      "퇴근후": 0,
      "기타": 0
    },
    "totalDuration": 0,
    "studyNames": []
  }
]
```

#### 4.2 일별 집계 조회
```
GET /api/challenge/daily/{year}/{month}
```

**Path Parameters:**
- `year`: 연도 (예: 2024)
- `month`: 월 (1-12)

**Response:**
```json
[
  {
    "date": "2024-01-01",
    "dayOfWeek": "월",
    "timeSlotTotals": {
      "출근길": 30,
      "아침": 60,
      "점심": 0,
      "퇴근길": 0,
      "퇴근후": 0,
      "기타": 0
    },
    "totalDuration": 90,
    "studyNames": ["Java 스터디"],
    "memo": "새해 첫 공부"
  },
  {
    "date": "2024-01-02",
    "dayOfWeek": "화",
    "timeSlotTotals": {
      "출근길": 0,
      "아침": 0,
      "점심": 0,
      "퇴근길": 0,
      "퇴근후": 0,
      "기타": 0
    },
    "totalDuration": 0,
    "studyNames": [],
    "memo": null
  }
]
```

---

## 에러 응답

### 400 Bad Request
```json
{
  "message": "입력값 검증 실패",
  "errors": {
    "category": "카테고리는 필수입니다",
    "name": "스터디명은 필수입니다"
  },
  "status": "error"
}
```

### 404 Not Found
```json
{
  "message": "스터디를 찾을 수 없습니다: 999",
  "status": "error"
}
```

---

## 사용 예시

### cURL 예시

#### 스터디 등록
```bash
curl -X POST http://localhost:8080/api/studies \
  -H "Content-Type: application/json" \
  -d '{
    "category": "프로그래밍",
    "name": "Java 스터디"
  }'
```

#### 기록 등록
```bash
curl -X POST http://localhost:8080/api/records \
  -H "Content-Type: application/json" \
  -d '{
    "studyId": 1,
    "date": "2024-01-01",
    "timeSlot": "아침",
    "duration": 60
  }'
```

#### 월별 집계 조회
```bash
curl http://localhost:8080/api/challenge/monthly/2024
```

---

## 프론트엔드 연동 가이드

프론트엔드의 `app.js`에서 localStorage 대신 API를 호출하도록 변경해야 합니다.

### 예시: 스터디 목록 조회
```javascript
// 기존 (localStorage)
const studies = getStudies();

// 변경 (API)
const response = await fetch('http://localhost:8080/api/studies');
const studies = await response.json();
```

### 예시: 스터디 등록
```javascript
// 기존 (localStorage)
addStudy(category, name);

// 변경 (API)
const response = await fetch('http://localhost:8080/api/studies', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ category, name })
});
const newStudy = await response.json();
```

