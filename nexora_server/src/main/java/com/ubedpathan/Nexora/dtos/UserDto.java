package com.ubedpathan.Nexora.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String id;
    private String username;
    private String postId;

    public UserDto(String id, String username) {
        this.id = id;
        this.username = username;
    }
}

