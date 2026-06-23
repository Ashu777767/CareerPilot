package com.ashutosh.backend.dto;

public class ProfileResponseDTO {

    private String name;
    private String email;
    private String targetRole;

    public ProfileResponseDTO() {
    }

    public ProfileResponseDTO(String name, String email, String targetRole) {
        this.name = name;
        this.email = email;
        this.targetRole = targetRole;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }
}