# MySQL Plugin 오류 해결 가이드

`ERROR 1524 (HY000): Plugin 'mysql_native_password' is not loaded` 오류 해결 방법

## 문제 원인

MySQL 8.0.4 이후 버전에서 `mysql_native_password` 플러그인이 기본적으로 비활성화되어 있거나 설치되지 않았을 수 있습니다.

## 해결 방법

### 방법 1: 플러그인 확인 및 활성화 (권장)

#### 1. 플러그인 상태 확인
```sql
SHOW PLUGINS;
```

또는
```sql
SELECT * FROM INFORMATION_SCHEMA.PLUGINS WHERE PLUGIN_NAME = 'mysql_native_password';
```

#### 2. 플러그인이 비활성화되어 있다면 활성화
```sql
INSTALL PLUGIN mysql_native_password SONAME 'auth_native_password.so';
```

**주의**: Windows에서는 `.dll` 확장자를 사용합니다:
```sql
INSTALL PLUGIN mysql_native_password SONAME 'auth_native_password.dll';
```

#### 3. 플러그인 확인
```sql
SHOW PLUGINS;
```

#### 4. 이제 사용자 생성 가능
```sql
CREATE USER 'studytracker'@'%' IDENTIFIED WITH mysql_native_password BY 'asdf';
GRANT SELECT, INSERT, UPDATE, DELETE ON study_tracker.* TO 'studytracker'@'%';
FLUSH PRIVILEGES;
```

### 방법 2: MySQL 설정 파일에서 플러그인 활성화

#### Windows (`my.ini`)
1. `C:\ProgramData\MySQL\MySQL Server 8.0\my.ini` 파일 열기
2. `[mysqld]` 섹션에 추가:
```ini
[mysqld]
default-authentication-plugin=mysql_native_password
```
3. MySQL 서비스 재시작

#### Linux/Mac (`my.cnf`)
1. `/etc/mysql/my.cnf` 또는 `/etc/my.cnf` 파일 열기
2. `[mysqld]` 섹션에 추가:
```ini
[mysqld]
default-authentication-plugin=mysql_native_password
```
3. MySQL 재시작:
```bash
sudo systemctl restart mysql
```

### 방법 3: caching_sha2_password 사용 (플러그인 설치 불가 시)

플러그인을 설치할 수 없다면, 기본 `caching_sha2_password`를 사용하고 JDBC URL에 파라미터를 추가합니다.

#### 1. 사용자 생성 (기본 인증 방식 사용)
```sql
CREATE USER 'studytracker'@'%' IDENTIFIED BY 'asdf';
GRANT SELECT, INSERT, UPDATE, DELETE ON study_tracker.* TO 'studytracker'@'%';
FLUSH PRIVILEGES;
```

#### 2. application.properties 수정
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/study_tracker?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8
```

## 단계별 해결 (가장 확실한 방법)

### 1단계: 플러그인 확인
```sql
SHOW PLUGINS LIKE '%password%';
```

### 2단계: 플러그인 설치 시도
```sql
-- Windows
INSTALL PLUGIN mysql_native_password SONAME 'auth_native_password.dll';

-- Linux/Mac
INSTALL PLUGIN mysql_native_password SONAME 'auth_native_password.so';
```

### 3단계: 설치 실패 시 (플러그인 파일이 없는 경우)

MySQL 설정 파일을 수정하여 기본 인증 방식을 변경하거나, `caching_sha2_password`를 사용하되 JDBC URL에 `allowPublicKeyRetrieval=true`를 추가합니다.

## 빠른 해결책

가장 빠른 해결책은 **방법 3**입니다:

1. MySQL에서:
```sql
CREATE USER 'studytracker'@'%' IDENTIFIED BY 'asdf';
GRANT SELECT, INSERT, UPDATE, DELETE ON study_tracker.* TO 'studytracker'@'%';
FLUSH PRIVILEGES;
```

2. `application.properties`에서 JDBC URL에 `allowPublicKeyRetrieval=true` 추가:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/study_tracker?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8
```

이 방법은 플러그인 설치 없이도 작동합니다.

