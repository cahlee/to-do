package com.studytracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * Study DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudyDto {
    
    private Long id;
    
    @NotBlank(message = "카테고리는 필수입니다")
    @Size(max = 100, message = "카테고리는 100자 이하여야 합니다")
    private String category;
    
    @NotBlank(message = "스터디명은 필수입니다")
    @Size(max = 100, message = "스터디명은 100자 이하여야 합니다")
    private String name;
}

