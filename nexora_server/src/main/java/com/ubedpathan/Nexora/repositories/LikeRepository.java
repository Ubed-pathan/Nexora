package com.ubedpathan.Nexora.repositories;

import com.ubedpathan.Nexora.models.LikeEntity;
import com.ubedpathan.Nexora.models.PostEntity;
import com.ubedpathan.Nexora.models.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<LikeEntity, String> {
    LikeEntity findByLikedPostAndUserid(PostEntity likedPost, UserEntity userid);
    int countByLikedPost(PostEntity likedPost);
}
