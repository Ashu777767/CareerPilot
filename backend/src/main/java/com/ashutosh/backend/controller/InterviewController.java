package com.ashutosh.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ashutosh.backend.dto.EvaluateRequest;
import com.ashutosh.backend.dto.EvaluateResponse;
import com.ashutosh.backend.dto.InterviewRequest;
import com.ashutosh.backend.dto.InterviewResponse;
import com.ashutosh.backend.service.GroqService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/interview")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class InterviewController {

    private final GroqService groqService;

    @PostMapping("/start")
    public InterviewResponse startInterview(
            @RequestBody InterviewRequest request
    ) {

        String question = groqService.generateQuestion(
                request.getRole(),
                request.getDifficulty()
        );

        return new InterviewResponse(question);
    }
    @PostMapping("/evaluate")
public ResponseEntity<EvaluateResponse> evaluateAnswer(
        @RequestBody EvaluateRequest request
) {

    try {

        EvaluateResponse response =
                groqService.evaluateAnswer(request);

        return ResponseEntity.ok(response);

    } catch (Exception e) {

        e.printStackTrace();

        return ResponseEntity
                .internalServerError()
                .build();
    }
}
}