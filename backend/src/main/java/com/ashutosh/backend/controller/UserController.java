package com.ashutosh.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.ashutosh.backend.dto.LoginRequest;
import com.ashutosh.backend.dto.ProfileResponseDTO;
import com.ashutosh.backend.dto.UpdateProfileRequestDTO;
import com.ashutosh.backend.entity.User;
import com.ashutosh.backend.security.JwtUtil;
import com.ashutosh.backend.service.UserService;
@RestController

public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }
    @PostMapping("/login")
    public String loginUser(@RequestBody LoginRequest loginRequest) {

    return userService.loginUser(
            loginRequest.getEmail(),
            loginRequest.getPassword()
    );
}
    @GetMapping("/profile")
public ProfileResponseDTO profile(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {

    String token = authHeader.substring(7);

    String email = JwtUtil.extractEmail(token);

    User user = userService.getUserByEmail(email);

    return new ProfileResponseDTO(
            user.getName(),
            user.getEmail(),
            user.getTargetRole()
    );
}
@PutMapping("/profile")
public ProfileResponseDTO updateProfile(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader,
        @RequestBody UpdateProfileRequestDTO request) {

    String token = authHeader.substring(7);

    String email = JwtUtil.extractEmail(token);

    User updatedUser = userService.updateProfile(
            email,
            request.getName(),
            request.getTargetRole()
    );

    return new ProfileResponseDTO(
            updatedUser.getName(),
            updatedUser.getEmail(),
            updatedUser.getTargetRole()
    );
}
}