package com.ashutosh.backend.controller;
import java.util.Arrays;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ashutosh.backend.dto.AnalysisResponse;
import com.ashutosh.backend.entity.ResumeAnalysis;
import com.ashutosh.backend.entity.User;
import com.ashutosh.backend.repository.ResumeAnalysisRepository;
import com.ashutosh.backend.service.GeminiService;
import com.ashutosh.backend.service.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")

public class ResumeController {

    @Autowired
    private GeminiService geminiService;
    @Autowired
private UserService userService;

@Autowired
private ResumeAnalysisRepository resumeAnalysisRepository;

    @PostMapping("/upload")
public AnalysisResponse uploadResume(
        @RequestParam("file") MultipartFile file
) throws Exception {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    String email = authentication.getName();

    User user = userService.getUserByEmail(email);

    PDDocument document =
            PDDocument.load(file.getInputStream());

    PDFTextStripper stripper =
            new PDFTextStripper();

    String resumeText =
            stripper.getText(document);

    document.close();

    AnalysisResponse analysis =
            geminiService.analyzeResume(resumeText);

    ResumeAnalysis resumeAnalysis =
            new ResumeAnalysis();

    resumeAnalysis.setUser(user);

    resumeAnalysis.setAtsScore(
            analysis.getAtsScore()
    );

    resumeAnalysis.setStrengths(
            String.join(
                    "||",
                    analysis.getStrengths()
            )
    );

    resumeAnalysis.setWeaknesses(
            String.join(
                    "||",
                    analysis.getWeaknesses()
            )
    );

    resumeAnalysis.setMissingSkills(
            String.join(
                    "||",
                    analysis.getMissingSkills()
            )
    );

    resumeAnalysis.setRecommendations(
            String.join(
                    "||",
                    analysis.getRecommendations()
            )
    );

    resumeAnalysisRepository.save(
            resumeAnalysis
    );

    return analysis;
}
@GetMapping("/analysis/latest")
public AnalysisResponse getLatestAnalysis() {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    String email = authentication.getName();

    User user = userService.getUserByEmail(email);

    ResumeAnalysis analysis =
            resumeAnalysisRepository.findTopByUserOrderByIdDesc(user);

    if (analysis == null) {
        return new AnalysisResponse();
    }

    AnalysisResponse response =
            new AnalysisResponse();

    response.setAtsScore(
            analysis.getAtsScore()
    );

    response.setStrengths(
            Arrays.asList(
                    analysis.getStrengths().split("\\|\\|")
            )
    );

    response.setWeaknesses(
            Arrays.asList(
                    analysis.getWeaknesses().split("\\|\\|")
            )
    );

    response.setMissingSkills(
            Arrays.asList(
                    analysis.getMissingSkills().split("\\|\\|")
            )
    );

    response.setRecommendations(
            Arrays.asList(
                    analysis.getRecommendations().split("\\|\\|")
            )
    );

    return response;
}
}