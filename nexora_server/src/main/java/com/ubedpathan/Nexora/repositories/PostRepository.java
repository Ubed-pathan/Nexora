package com.ubedpathan.Nexora.repositories;

import com.ubedpathan.Nexora.models.PostEntity;
import com.ubedpathan.Nexora.models.UserEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public interface PostRepository extends JpaRepository<PostEntity, String> {

    List<PostEntity> findByUserEntityId(String userId);

    List<PostEntity> findByUserEntity(UserEntity user);

    @Query("SELECT p.id, COUNT(l.id) FROM PostEntity p LEFT JOIN p.likes l WHERE p.id IN :postIds GROUP BY p.id")
    List<Object[]> findLikeCounts(@Param("postIds") List<String> postIds);

    @Query("SELECT p.id, COUNT(d.id) FROM PostEntity p LEFT JOIN p.disLikes d WHERE p.id IN :postIds GROUP BY p.id")
    List<Object[]> findDislikeCounts(@Param("postIds") List<String> postIds);

    @Query("SELECT l.userid.id, l.userid.username, l.likedPost.id FROM LikeEntity l WHERE l.likedPost.id IN :postIds")
    List<Object[]> findLikedUsers(@Param("postIds") List<String> postIds);

    @Query("SELECT d.userid.id, d.userid.username, d.disLikedPost.id FROM DisLikeEntity d WHERE d.disLikedPost.id IN :postIds")
    List<Object[]> findDislikedUsers(@Param("postIds") List<String> postIds);

    @Query("SELECT p FROM PostEntity p WHERE p.userEntity.id IN :userIds ORDER BY p.createdAt DESC")
    List<PostEntity> findRecentPostsFromFollowing(@Param("userIds") List<String> userIds);

    @Query("SELECT p FROM PostEntity p WHERE p.userEntity.id NOT IN :excludedUserIds ORDER BY FUNCTION('RANDOM')")
    List<PostEntity> findRandomPostsExcludingUsers(@Param("excludedUserIds") Set<String> excludedUserIds);

    // ✅ NEW: Infinite scroll support — recent posts from following before timestamp
    @Query("SELECT p FROM PostEntity p WHERE p.userEntity.id IN :userIds AND p.createdAt < :before ORDER BY p.createdAt DESC")
    List<PostEntity> findRecentPostsFromFollowingBefore(@Param("userIds") List<String> userIds,
                                                        @Param("before") LocalDateTime before,
                                                        Pageable pageable);

    @Query("SELECT p FROM PostEntity p " +
            "WHERE p.userEntity.id IN :userIds " +
            "AND p.createdAt < :before " +
            "AND p.id NOT IN :excludedPostIds " +
            "ORDER BY p.createdAt DESC")
    List<PostEntity> findRecentPostsFromFollowingBeforeExcludingPostIds(
            @Param("userIds") List<String> userIds,
            @Param("before") LocalDateTime before,
            @Param("excludedPostIds") Set<String> excludedPostIds,
            Pageable pageable);
}
