package com.studytracker.service;

import com.studytracker.dto.DailySummaryDto;
import com.studytracker.dto.MonthlySummaryDto;
import com.studytracker.dto.StudyRecordDto;
import com.studytracker.entity.StudyRecord;
import com.studytracker.repository.DailyMemoRepository;
import com.studytracker.repository.StudyRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChallengeService {
    
    private final StudyRecordRepository studyRecordRepository;
    private final DailyMemoRepository dailyMemoRepository;
    
    private static final String[] TIME_SLOTS = {"출근길", "아침", "점심", "퇴근길", "퇴근후", "기타"};
    
    public List<MonthlySummaryDto> getMonthlySummary(int year) {
        List<StudyRecord> records = studyRecordRepository.findByYear(year);
        List<MonthlySummaryDto> monthlySummaries = new ArrayList<>();
        
        for (int month = 1; month <= 12; month++) {
            MonthlySummaryDto summary = calculateMonthlySummary(records, year, month);
            monthlySummaries.add(summary);
        }
        
        return monthlySummaries;
    }
    
    public List<DailySummaryDto> getDailySummary(int year, int month) {
        List<StudyRecord> records = studyRecordRepository.findByYearAndMonth(year, month);
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        
        List<DailySummaryDto> dailySummaries = new ArrayList<>();
        
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            DailySummaryDto summary = calculateDailySummary(records, currentDate);
            dailySummaries.add(summary);
            currentDate = currentDate.plusDays(1);
        }
        
        return dailySummaries;
    }
    
    private MonthlySummaryDto calculateMonthlySummary(List<StudyRecord> allRecords, int year, int month) {
        List<StudyRecord> monthRecords = allRecords.stream()
                .filter(r -> r.getDate().getYear() == year && r.getDate().getMonthValue() == month)
                .collect(Collectors.toList());
        
        Map<String, Integer> timeSlotTotals = new HashMap<>();
        for (String slot : TIME_SLOTS) {
            timeSlotTotals.put(slot, 0);
        }
        
        int totalDuration = 0;
        Set<String> studyNames = new HashSet<>();
        
        for (StudyRecord record : monthRecords) {
            String timeSlot = record.getTimeSlot().name();
            timeSlotTotals.put(timeSlot, timeSlotTotals.getOrDefault(timeSlot, 0) + record.getDuration());
            totalDuration += record.getDuration();
            studyNames.add(record.getStudy().getName());
        }
        
        return new MonthlySummaryDto(
                month,
                timeSlotTotals,
                totalDuration,
                new ArrayList<>(studyNames)
        );
    }
    
    private DailySummaryDto calculateDailySummary(List<StudyRecord> allRecords, LocalDate date) {
        List<StudyRecord> dayRecords = allRecords.stream()
                .filter(r -> r.getDate().equals(date))
                .collect(Collectors.toList());
        
        Map<String, Integer> timeSlotTotals = new HashMap<>();
        for (String slot : TIME_SLOTS) {
            timeSlotTotals.put(slot, 0);
        }
        
        int totalDuration = 0;
        Set<String> studyNames = new HashSet<>();
        
        for (StudyRecord record : dayRecords) {
            String timeSlot = record.getTimeSlot().name();
            timeSlotTotals.put(timeSlot, timeSlotTotals.getOrDefault(timeSlot, 0) + record.getDuration());
            totalDuration += record.getDuration();
            studyNames.add(record.getStudy().getName());
        }
        
        String dayOfWeek = date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.KOREAN);
        String memo = dailyMemoRepository.findByDate(date)
                .map(m -> m.getMemo())
                .orElse(null);
        
        return new DailySummaryDto(
                date,
                dayOfWeek,
                timeSlotTotals,
                totalDuration,
                new ArrayList<>(studyNames),
                memo
        );
    }
}

