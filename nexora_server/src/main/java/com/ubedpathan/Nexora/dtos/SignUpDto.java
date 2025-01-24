package com.ubedpathan.Nexora.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record SignUpDto(
        @NotBlank(message = "Username is mandatory")
        String username,
        @NotBlank(message = "Email is mandatory") @Email(message = "Email should be valid")
       String email,
        @NotBlank(message = "Password is mandatory")
       String password,
        String profileImageURL
) {}