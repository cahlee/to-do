package com.studytracker.repository;

import com.studytracker.entity.DailyMemo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface DailyMemoRepository extends JpaRepository<DailyMemo, Long> {
    
    Optional<DailyMemo> findByDate(LocalDate date);
}

