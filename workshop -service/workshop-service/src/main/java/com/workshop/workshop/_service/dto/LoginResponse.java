package com.workshop.workshop._service.dto;

import com.workshop.workshop._service.Enum.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {

    private String message;
    private String token;
    private String tokenType;
    private Long userId;
    private String email;
    private Role role;
}