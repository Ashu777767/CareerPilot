package com.ashutosh.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ashutosh.backend.entity.ResumeAnalysis;
import com.ashutosh.backend.entity.User;

public interface ResumeAnalysisRepository
        extends JpaRepository<ResumeAnalysis, Long> {

    ResumeAnalysis findTopByUserOrderByIdDesc(User user);
}