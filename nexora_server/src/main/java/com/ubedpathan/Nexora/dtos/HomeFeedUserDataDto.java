package com.ubedpathan.Nexora.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Builder
public class HomeFeedUserDataDto {
    private String id;
    private String username;
    private String secureImageUrl;

    public HomeFeedUserDataDto(String id, String username, String secureImageUrl) {
        this.id = id;
        this.username = username;
        this.secureImageUrl = secureImageUrl;
    }
}
