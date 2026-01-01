# 데이터베이스 스키마 설계

## 테이블 구조

### 1. studies (스터디)

스터디 정보를 저장하는 테이블입니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 스터디 ID |
| category | VARCHAR(100) | NOT NULL | 카테고리 |
| name | VARCHAR(100) | NOT NULL | 스터디명 |
| created_at | DATETIME | NOT NULL | 생성일시 |
| updated_at | DATETIME | | 수정일시 |

**인덱스:**
- `idx_category` (category)
- `idx_name` (name)

### 2. study_records (스터디 기록)

스터디 수행 기록을 저장하는 테이블입니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 기록 ID |
| study_id | BIGINT | NOT NULL, FOREIGN KEY | 스터디 ID (studies.id 참조) |
| date | DATE | NOT NULL | 수행 날짜 |
| time_slot | VARCHAR(20) | NOT NULL | 시간대 (출근길, 아침, 점심, 퇴근길, 퇴근후, 기타) |
| duration | INT | NOT NULL | 수행 시간 (분) |
| memo | VARCHAR(500) | | 메모 |
| created_at | DATETIME | NOT NULL | 생성일시 |
| updated_at | DATETIME | | 수정일시 |

**인덱스:**
- `idx_study_id` (study_id)
- `idx_date` (date)
- `idx_study_date` (study_id, date) - 복합 인덱스
- `idx_time_slot` (time_slot)

**외래키:**
- `fk_study_record_study` (study_id) REFERENCES studies(id) ON DELETE CASCADE

### 3. daily_memos (일자별 메모)

일자별 메모를 저장하는 테이블입니다. 같은 날짜의 여러 기록이 같은 메모를 공유합니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 메모 ID |
| date | DATE | NOT NULL, UNIQUE | 날짜 |
| memo | VARCHAR(500) | | 메모 내용 |
| created_at | DATETIME | NOT NULL | 생성일시 |
| updated_at | DATETIME | | 수정일시 |

**인덱스:**
- `idx_date` (date) - UNIQUE

## 관계

- **Study 1 : N StudyRecord**
  - 하나의 스터디는 여러 개의 기록을 가질 수 있습니다
  - 스터디가 삭제되면 관련된 모든 기록도 함께 삭제됩니다 (CASCADE)

- **DailyMemo 1 : 1 Date**
  - 각 날짜당 하나의 메모만 저장됩니다
  - 여러 기록이 같은 날짜의 메모를 공유합니다

## 추가 고려사항

현재 설계로 충분하지만, 향후 확장을 고려하면:

1. **사용자 관리가 필요하다면:**
   - `users` 테이블 추가
   - `studies`와 `study_records`에 `user_id` 컬럼 추가

2. **통계 기능 강화가 필요하다면:**
   - 집계 테이블 또는 뷰 생성 고려
   - 현재는 애플리케이션 레벨에서 집계 가능

3. **태그/라벨 기능이 필요하다면:**
   - `tags` 테이블 추가
   - `study_tags` 중간 테이블 추가

## SQL 생성 스크립트

JPA/Hibernate가 자동으로 테이블을 생성하지만, 수동으로 생성하려면:

```sql
CREATE TABLE studies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    INDEX idx_category (category),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE study_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    study_id BIGINT NOT NULL,
    date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL,
    duration INT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    INDEX idx_study_id (study_id),
    INDEX idx_date (date),
    INDEX idx_study_date (study_id, date),
    INDEX idx_time_slot (time_slot),
    FOREIGN KEY (study_id) REFERENCES studies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE daily_memos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    memo VARCHAR(500),
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

