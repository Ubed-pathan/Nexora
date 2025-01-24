package com.ubedpathan.Nexora.dtos;

import jakarta.validation.constraints.NotBlank;

public record SignInDto (
        @NotBlank(message = "Username is mandatory")
        String username,
        @NotBlank(message = "Password is mandatory")
        String password
){}
