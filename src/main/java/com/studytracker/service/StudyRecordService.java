package com.studytracker.service;

import com.studytracker.dto.StudyRecordDto;
import com.studytracker.entity.Study;
import com.studytracker.entity.StudyRecord;
import com.studytracker.repository.StudyRecordRepository;
import com.studytracker.repository.StudyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudyRecordService {
    
    private final StudyRecordRepository studyRecordRepository;
    private final StudyRepository studyRepository;
    
    public List<StudyRecordDto> getAllRecords() {
        return studyRecordRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    
    public List<StudyRecordDto> getRecordsByDate(LocalDate date) {
        return studyRecordRepository.findByDate(date).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    
    public List<StudyRecordDto> getRecordsByDateRange(LocalDate startDate, LocalDate endDate) {
        return studyRecordRepository.findByDateBetween(startDate, endDate).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    
    public List<StudyRecordDto> getRecordsByYear(int year) {
        return studyRecordRepository.findByYear(year).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    
    public List<StudyRecordDto> getRecordsByYearAndMonth(int year, int month) {
        return studyRecordRepository.findByYearAndMonth(year, month).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    
    public StudyRecordDto getRecordById(Long id) {
        StudyRecord record = studyRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("기록을 찾을 수 없습니다: " + id));
        return toDto(record);
    }
    
    @Transactional
    public StudyRecordDto createRecord(StudyRecordDto dto) {
        Study study = studyRepository.findById(dto.getStudyId())
                .orElseThrow(() -> new RuntimeException("스터디를 찾을 수 없습니다: " + dto.getStudyId()));
        
        StudyRecord record = new StudyRecord();
        record.setStudy(study);
        record.setDate(dto.getDate());
        record.setTimeSlot(dto.getTimeSlot());
        record.setDuration(dto.getDuration());
        
        StudyRecord saved = studyRecordRepository.save(record);
        return toDto(saved);
    }
    
    @Transactional
    public StudyRecordDto updateRecord(Long id, StudyRecordDto dto) {
        StudyRecord record = studyRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("기록을 찾을 수 없습니다: " + id));
        
        if (dto.getStudyId() != null && !dto.getStudyId().equals(record.getStudy().getId())) {
            Study study = studyRepository.findById(dto.getStudyId())
                    .orElseThrow(() -> new RuntimeException("스터디를 찾을 수 없습니다: " + dto.getStudyId()));
            record.setStudy(study);
        }
        
        if (dto.getDate() != null) {
            record.setDate(dto.getDate());
        }
        if (dto.getTimeSlot() != null) {
            record.setTimeSlot(dto.getTimeSlot());
        }
        if (dto.getDuration() != null) {
            record.setDuration(dto.getDuration());
        }
        
        StudyRecord updated = studyRecordRepository.save(record);
        return toDto(updated);
    }
    
    @Transactional
    public void deleteRecord(Long id) {
        if (!studyRecordRepository.existsById(id)) {
            throw new RuntimeException("기록을 찾을 수 없습니다: " + id);
        }
        studyRecordRepository.deleteById(id);
    }
    
    private StudyRecordDto toDto(StudyRecord record) {
        StudyRecordDto dto = new StudyRecordDto();
        dto.setId(record.getId());
        dto.setStudyId(record.getStudy().getId());
        dto.setStudyName(record.getStudy().getName());
        dto.setStudyCategory(record.getStudy().getCategory());
        dto.setDate(record.getDate());
        dto.setTimeSlot(record.getTimeSlot());
        dto.setDuration(record.getDuration());
        return dto;
    }
}

