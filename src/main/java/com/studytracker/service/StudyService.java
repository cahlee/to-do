package com.studytracker.service;

import com.studytracker.dto.StudyDto;
import com.studytracker.entity.Study;
import com.studytracker.repository.StudyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudyService {
    
    private final StudyRepository studyRepository;
    
    public List<StudyDto> getAllStudies() {
        return studyRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    
    public StudyDto getStudyById(Long id) {
        Study study = studyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("스터디를 찾을 수 없습니다: " + id));
        return toDto(study);
    }
    
    @Transactional
    public StudyDto createStudy(StudyDto dto) {
        Study study = new Study();
        study.setCategory(dto.getCategory());
        study.setName(dto.getName());
        Study saved = studyRepository.save(study);
        return toDto(saved);
    }
    
    @Transactional
    public StudyDto updateStudy(Long id, StudyDto dto) {
        Study study = studyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("스터디를 찾을 수 없습니다: " + id));
        study.setCategory(dto.getCategory());
        study.setName(dto.getName());
        Study updated = studyRepository.save(study);
        return toDto(updated);
    }
    
    @Transactional
    public void deleteStudy(Long id) {
        if (!studyRepository.existsById(id)) {
            throw new RuntimeException("스터디를 찾을 수 없습니다: " + id);
        }
        studyRepository.deleteById(id);
    }
    
    private StudyDto toDto(Study study) {
        return new StudyDto(study.getId(), study.getCategory(), study.getName());
    }
}

