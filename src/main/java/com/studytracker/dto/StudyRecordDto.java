package com.studytracker.dto;

import com.studytracker.entity.StudyRecord;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

/**
 * StudyRecord DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudyRecordDto {
    
    private Long id;
    
    @NotNull(message = "스터디 ID는 필수입니다")
    private Long studyId;
    
    private String studyName;
    
    private String studyCategory;
    
    @NotNull(message = "날짜는 필수입니다")
    private LocalDate date;
    
    @NotNull(message = "시간대는 필수입니다")
    private StudyRecord.TimeSlot timeSlot;
    
    @NotNull(message = "수행 시간은 필수입니다")
    @Min(value = 1, message = "수행 시간은 1분 이상이어야 합니다")
    private Integer duration;
}

