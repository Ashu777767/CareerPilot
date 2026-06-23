package com.ashutosh.backend.dto;

public class UpdateProfileRequestDTO {

    private String name;
    private String targetRole;

    public UpdateProfileRequestDTO() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }
}