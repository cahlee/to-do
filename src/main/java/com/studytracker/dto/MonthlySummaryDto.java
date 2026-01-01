package com.studytracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * 월별 집계 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySummaryDto {
    
    private int month;
    private Map<String, Integer> timeSlotTotals; // 시간대별 합계
    private int totalDuration; // 월별 총합계
    private java.util.List<String> studyNames; // 해당 월에 수행한 스터디 목록
}

