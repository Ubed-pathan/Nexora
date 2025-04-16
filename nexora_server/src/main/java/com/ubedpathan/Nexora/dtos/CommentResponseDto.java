package com.ubedpathan.Nexora.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CommentResponseDto {
    private String commentId;
    private String message;
    private String userId;
    private String username;
    private String secureImageUrl;
}
