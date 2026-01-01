# Study Tracker Backend

Spring Boot 기반의 Study Tracker 백엔드 API 서버입니다.

## 기술 스택

- **Java**: 17
- **Spring Boot**: 3.2.0
- **Maven**: 빌드 도구
- **MySQL**: 데이터베이스
- **JPA/Hibernate**: ORM
- **Lombok**: 코드 간소화

## 프로젝트 구조

```
src/
├── main/
│   ├── java/
│   │   └── com/studytracker/
│   │       ├── StudyTrackerApplication.java    # 메인 애플리케이션 클래스
│   │       ├── config/                         # 설정 클래스
│   │       │   └── WebConfig.java              # 웹 설정 (CORS 등)
│   │       ├── controller/                     # REST 컨트롤러
│   │       │   └── HealthCheckController.java  # 헬스 체크 엔드포인트
│   │       ├── service/                        # 비즈니스 로직
│   │       ├── repository/                     # 데이터 접근 계층
│   │       ├── entity/                         # 엔티티 클래스
│   │       ├── dto/                            # 데이터 전송 객체
│   │       └── exception/                      # 예외 처리
│   └── resources/
│       └── application.properties              # 애플리케이션 설정
└── test/
    └── java/
        └── com/studytracker/
            └── StudyTrackerApplicationTests.java
```

## 사전 요구사항

- **JDK 17 이상**
- **Maven 3.6 이상**
- **MySQL 8.0 이상**

## 설정

### 1. 데이터베이스 설정

`src/main/resources/application.properties` 파일에서 데이터베이스 연결 정보를 수정하세요:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/study_tracker?useSSL=false&serverTimezone=UTC&characterEncoding=UTF-8
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 2. MySQL 데이터베이스 생성

MySQL에 접속하여 데이터베이스를 생성하세요:

```sql
CREATE DATABASE study_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 빌드 및 실행

### Maven을 사용한 빌드

```bash
# 프로젝트 빌드
mvn clean install

# 애플리케이션 실행
mvn spring-boot:run
```

### IDE에서 실행

1. IntelliJ IDEA나 Eclipse에서 프로젝트를 엽니다
2. `StudyTrackerApplication.java` 파일을 실행합니다

## 정적 리소스

프론트엔드 파일들은 `src/main/resources/static` 폴더에 위치하며, Spring Boot 서버 실행 시 루트 경로에서 접근 가능합니다.

- **프론트엔드**: `http://localhost:8080/` (index.html)
- **정적 파일**: `http://localhost:8080/app.js`, `http://localhost:8080/styles.css` 등

## API 엔드포인트

모든 API는 `/api` 경로를 사용합니다.

### Health Check

```
GET /api/health
```

서버 상태를 확인하는 엔드포인트입니다.

**응답 예시:**
```json
{
  "status": "UP",
  "service": "study-tracker-backend",
  "timestamp": 1234567890
}
```

## 개발 환경 설정

### IDE 플러그인 권장 사항

- **Lombok**: Lombok 플러그인 설치 필수
- **Spring Boot DevTools**: 자동 재시작 기능

### 로깅

애플리케이션 로그는 콘솔에 출력됩니다. 개발 환경에서는 SQL 쿼리도 함께 출력됩니다.

## 향후 개발 계획

- [ ] Study 도메인 API 구현
- [ ] Study Record 도메인 API 구현
- [ ] 인증 및 인가 기능
- [ ] API 문서화 (Swagger/OpenAPI)
- [ ] 테스트 코드 작성
- [ ] 예외 처리 개선
- [ ] 로깅 전략 수립

## 라이선스

이 프로젝트는 개인 사용 목적으로 제작되었습니다.

