package com.ubedpathan.Nexora.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SuggestionsUserDto {
    private String id;
    private String username;
    private String SecureImageUrl;
}
