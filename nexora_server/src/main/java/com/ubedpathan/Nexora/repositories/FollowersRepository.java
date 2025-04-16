package com.ubedpathan.Nexora.repositories;

import com.ubedpathan.Nexora.models.FollowersEntity;
import com.ubedpathan.Nexora.models.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface FollowersRepository extends JpaRepository<FollowersEntity, String> {

    boolean existsByFollowerIdAndFolloweeId(String followerId, String followeeId);

    List<FollowersEntity> findByFollowee(UserEntity followee);

    List<FollowersEntity> findByFollower(UserEntity follower);

    long countByFollowee(UserEntity followee);

    long countByFollower(UserEntity follower);

    Optional<FollowersEntity> findByFollowerAndFollowee(UserEntity follower, UserEntity followee);

    Arrays findByFollowerId(String currentUserId);

    @Query("SELECT f.followee.id FROM FollowersEntity f WHERE f.follower.id = :userId")
    Set<String> findFollowedUserIdsByUserId(@Param("userId") String userId);

}
