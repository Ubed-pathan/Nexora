package com.ubedpathan.Nexora.repositories;

import com.ubedpathan.Nexora.models.PostEntity;
import com.ubedpathan.Nexora.models.SavedEntity;
import com.ubedpathan.Nexora.models.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedPostsRepository extends JpaRepository<SavedEntity, String> {

    List<SavedEntity> findByUser(UserEntity user);

    @Query("SELECT s FROM SavedEntity s WHERE s.user.id = :userId AND s.post.id = :postId")
    SavedEntity findByUserIdAndPostId(@Param("userId") String userId, @Param("postId") String postId);


}
