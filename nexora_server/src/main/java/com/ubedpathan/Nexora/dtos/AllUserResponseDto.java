package com.ubedpathan.Nexora.dtos;

import com.ubedpathan.Nexora.models.UserEntity;
import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AllUserResponseDto {
    private String id;
    private String username;
    private String secureImageUrl;
    private boolean isFollowing;

    public AllUserResponseDto(UserEntity userEntity, boolean isFollowing) {
        this.id = userEntity.getId();
        this.username = userEntity.getUsername();
        this.secureImageUrl = userEntity.getSecureImageUrl();
        this.isFollowing = isFollowing;
    }
}
