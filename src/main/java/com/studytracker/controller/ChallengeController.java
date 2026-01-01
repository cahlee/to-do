package com.studytracker.controller;

import com.studytracker.dto.DailySummaryDto;
import com.studytracker.dto.MonthlySummaryDto;
import com.studytracker.service.ChallengeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/challenge")
@RequiredArgsConstructor
public class ChallengeController {
    
    private final ChallengeService challengeService;
    
    @GetMapping("/monthly/{year}")
    public ResponseEntity<List<MonthlySummaryDto>> getMonthlySummary(@PathVariable int year) {
        List<MonthlySummaryDto> summaries = challengeService.getMonthlySummary(year);
        return ResponseEntity.ok(summaries);
    }
    
    @GetMapping("/daily/{year}/{month}")
    public ResponseEntity<List<DailySummaryDto>> getDailySummary(
            @PathVariable int year,
            @PathVariable int month) {
        List<DailySummaryDto> summaries = challengeService.getDailySummary(year, month);
        return ResponseEntity.ok(summaries);
    }
}

