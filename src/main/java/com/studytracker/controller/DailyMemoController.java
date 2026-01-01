package com.studytracker.controller;

import com.studytracker.dto.DailyMemoDto;
import com.studytracker.service.DailyMemoService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/api/memos")
@RequiredArgsConstructor
@Validated
public class DailyMemoController {
    
    private final DailyMemoService dailyMemoService;
    
    @GetMapping("/{date}")
    public ResponseEntity<DailyMemoDto> getMemoByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Optional<DailyMemoDto> memo = dailyMemoService.getMemoByDate(date);
        return memo.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{date}")
    public ResponseEntity<DailyMemoDto> saveMemo(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @Valid @RequestBody DailyMemoDto dto) {
        DailyMemoDto saved = dailyMemoService.saveMemo(date, dto.getMemo());
        return ResponseEntity.ok(saved);
    }
}

