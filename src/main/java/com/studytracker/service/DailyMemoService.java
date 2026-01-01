package com.studytracker.service;

import com.studytracker.dto.DailyMemoDto;
import com.studytracker.entity.DailyMemo;
import com.studytracker.repository.DailyMemoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DailyMemoService {
    
    private final DailyMemoRepository dailyMemoRepository;
    
    public Optional<DailyMemoDto> getMemoByDate(LocalDate date) {
        return dailyMemoRepository.findByDate(date)
                .map(this::toDto);
    }
    
    @Transactional
    public DailyMemoDto saveMemo(LocalDate date, String memo) {
        Optional<DailyMemo> existing = dailyMemoRepository.findByDate(date);
        
        DailyMemo dailyMemo;
        if (existing.isPresent()) {
            dailyMemo = existing.get();
            dailyMemo.setMemo(memo);
        } else {
            dailyMemo = new DailyMemo();
            dailyMemo.setDate(date);
            dailyMemo.setMemo(memo);
        }
        
        DailyMemo saved = dailyMemoRepository.save(dailyMemo);
        return toDto(saved);
    }
    
    private DailyMemoDto toDto(DailyMemo dailyMemo) {
        return new DailyMemoDto(dailyMemo.getId(), dailyMemo.getDate(), dailyMemo.getMemo());
    }
}

