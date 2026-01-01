package com.studytracker.repository;

import com.studytracker.entity.StudyRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StudyRecordRepository extends JpaRepository<StudyRecord, Long> {
    
    List<StudyRecord> findByDate(LocalDate date);
    
    List<StudyRecord> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<StudyRecord> findByStudyId(Long studyId);
    
    @Query("SELECT sr FROM StudyRecord sr WHERE YEAR(sr.date) = :year")
    List<StudyRecord> findByYear(@Param("year") int year);
    
    @Query("SELECT sr FROM StudyRecord sr WHERE YEAR(sr.date) = :year AND MONTH(sr.date) = :month")
    List<StudyRecord> findByYearAndMonth(@Param("year") int year, @Param("month") int month);
}

