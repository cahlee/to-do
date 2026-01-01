package com.studytracker.controller;

import com.studytracker.dto.StudyRecordDto;
import com.studytracker.service.StudyRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
@Validated
public class StudyRecordController {
    
    private final StudyRecordService studyRecordService;
    
    @GetMapping
    public ResponseEntity<List<StudyRecordDto>> getAllRecords(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Integer year) {
        
        List<StudyRecordDto> records;
        
        if (date != null) {
            records = studyRecordService.getRecordsByDate(date);
        } else if (startDate != null && endDate != null) {
            records = studyRecordService.getRecordsByDateRange(startDate, endDate);
        } else if (year != null) {
            records = studyRecordService.getRecordsByYear(year);
        } else {
            records = studyRecordService.getAllRecords();
        }
        
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<StudyRecordDto> getRecordById(@PathVariable Long id) {
        StudyRecordDto record = studyRecordService.getRecordById(id);
        return ResponseEntity.ok(record);
    }
    
    @PostMapping
    public ResponseEntity<StudyRecordDto> createRecord(@Valid @RequestBody StudyRecordDto dto) {
        StudyRecordDto created = studyRecordService.createRecord(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<StudyRecordDto> updateRecord(@PathVariable Long id, @Valid @RequestBody StudyRecordDto dto) {
        StudyRecordDto updated = studyRecordService.updateRecord(id, dto);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        studyRecordService.deleteRecord(id);
        return ResponseEntity.noContent().build();
    }
}

