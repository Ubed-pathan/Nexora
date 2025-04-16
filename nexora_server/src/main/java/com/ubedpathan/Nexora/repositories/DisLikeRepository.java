package com.ubedpathan.Nexora.repositories;

import com.ubedpathan.Nexora.models.DisLikeEntity;
import com.ubedpathan.Nexora.models.LikeEntity;
import com.ubedpathan.Nexora.models.PostEntity;
import com.ubedpathan.Nexora.models.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisLikeRepository extends JpaRepository<DisLikeEntity, String> {
    DisLikeEntity findByDisLikedPostAndUserid(PostEntity likedPost, UserEntity userid);
    int countByDisLikedPost(PostEntity likedPost);

}
