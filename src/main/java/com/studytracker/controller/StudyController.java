package com.studytracker.controller;

import com.studytracker.dto.StudyDto;
import com.studytracker.service.StudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/studies")
@RequiredArgsConstructor
@Validated
public class StudyController {
    
    private final StudyService studyService;
    
    @GetMapping
    public ResponseEntity<List<StudyDto>> getAllStudies() {
        List<StudyDto> studies = studyService.getAllStudies();
        return ResponseEntity.ok(studies);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<StudyDto> getStudyById(@PathVariable Long id) {
        StudyDto study = studyService.getStudyById(id);
        return ResponseEntity.ok(study);
    }
    
    @PostMapping
    public ResponseEntity<StudyDto> createStudy(@Valid @RequestBody StudyDto dto) {
        StudyDto created = studyService.createStudy(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<StudyDto> updateStudy(@PathVariable Long id, @Valid @RequestBody StudyDto dto) {
        StudyDto updated = studyService.updateStudy(id, dto);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudy(@PathVariable Long id) {
        studyService.deleteStudy(id);
        return ResponseEntity.noContent().build();
    }
}

