package com.studytracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

/**
 * 일별 집계 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailySummaryDto {
    
    private LocalDate date;
    private String dayOfWeek;
    private Map<String, Integer> timeSlotTotals; // 시간대별 합계
    private int totalDuration; // 일별 총합계
    private java.util.List<String> studyNames; // 해당 일자에 수행한 스터디 목록
    private String memo; // 메모
}

