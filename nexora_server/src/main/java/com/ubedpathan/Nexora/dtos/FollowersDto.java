package com.ubedpathan.Nexora.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FollowersDto {
    private String id;
    private String username;
    private String secureImageUrl;

    public FollowersDto(String id, String username, String secureImageUrl) {
        this.id = id;
        this.username = username;
        this.secureImageUrl = secureImageUrl;
    }
}
