package com.studytracker.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Table;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DailyMemo Entity
 * 일자별 메모를 저장하는 엔티티
 * 같은 날짜의 여러 기록이 같은 메모를 공유할 수 있도록 별도 테이블로 분리
 */
@Entity
@javax.persistence.Table(name = "daily_memos", 
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "date")
    }
)
@Table(appliesTo = "daily_memos", comment = "일자별 메모 테이블")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyMemo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private LocalDate date;

    @Column(length = 500)
    private String memo;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

