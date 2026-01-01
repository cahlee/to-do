package com.studytracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Size;
import java.time.LocalDate;

/**
 * DailyMemo DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyMemoDto {
    
    private Long id;
    
    private LocalDate date;
    
    @Size(max = 500, message = "메모는 500자 이하여야 합니다")
    private String memo;
}

