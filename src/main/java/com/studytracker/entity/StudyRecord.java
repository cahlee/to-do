package com.studytracker.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Table;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * StudyRecord Entity
 * 스터디 수행 기록을 저장하는 엔티티
 */
@Entity
@javax.persistence.Table(name = "study_records")
@Table(appliesTo = "study_records", comment = "스터디 기록 테이블")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudyRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_id", nullable = false)
    private Study study;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "time_slot", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private TimeSlot timeSlot;

    @Column(nullable = false)
    private Integer duration; // 분 단위

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

    /**
     * 시간대 Enum
     */
    public enum TimeSlot {
        출근길, 아침, 점심, 퇴근길, 퇴근후, 기타
    }
}

