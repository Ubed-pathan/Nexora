package com.ubedpathan.Nexora.services;

import com.ubedpathan.Nexora.dtos.FollowersDto;
import com.ubedpathan.Nexora.models.FollowersEntity;
import com.ubedpathan.Nexora.models.UserEntity;
import com.ubedpathan.Nexora.repositories.FollowersRepository;
import com.ubedpathan.Nexora.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FollowersService {

    @Autowired
    private FollowersRepository followersRepository;

    @Autowired
    private UserRepository userRepository;

    public boolean followUser(String followerId, String followeeId) {
//        if (!followerId.equals(followeeId) && !isFollowing(followerId, followeeId)) {
//            Optional<UserEntity> followerOpt = userRepository.findById(followerId);
//            Optional<UserEntity> followeeOpt = userRepository.findById(followeeId);
//
//            if (followerOpt.isPresent() && followeeOpt.isPresent()) {
//                FollowersEntity follow = new FollowersEntity();
//                follow.setFollower(followerOpt.get());
//                follow.setFollowee(followeeOpt.get());
//                followersRepository.save(follow);
//            }
//        }

        try{
            if (followerId.equals(followeeId) || isFollowing(followerId, followeeId)) {
                return false;
            }

            UserEntity follower = userRepository.findById(followerId)
                    .orElseThrow(() -> new IllegalArgumentException("Follower not found"));
            UserEntity followee = userRepository.findById(followeeId)
                    .orElseThrow(() -> new IllegalArgumentException("Followee not found"));

            followersRepository.save(new FollowersEntity(follower, followee));
            return true;
        }
        catch(Exception e) {
            return false;
        }
    }

    public boolean isFollowing(String followerId, String followeeId) {
        return followersRepository.existsByFollowerIdAndFolloweeId(followerId, followeeId);
    }

    public List<UserEntity> getFollowers(String userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return followersRepository.findByFollowee(user)
                .stream()
                .map(FollowersEntity::getFollower)
                .collect(Collectors.toList()); // Returning list of follower users
    }

    public List<FollowersDto> getFollowing(String userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return followersRepository.findByFollower(user)
                .stream()
                .map(f -> new FollowersDto(
                        f.getFollowee().getId(),
                        f.getFollowee().getUsername(),
                        f.getFollowee().getSecureImageUrl()
                ))
                .collect(Collectors.toList());
    }

    public boolean unfollowUser(String followerId, String followeeId) {
        try{
            if (followerId.equals(followeeId)) {
                return false;
            }

            UserEntity follower = userRepository.findById(followerId)
                    .orElseThrow(() -> new IllegalArgumentException("Follower not found"));
            UserEntity followee = userRepository.findById(followeeId)
                    .orElseThrow(() -> new IllegalArgumentException("Followee not found"));

            // Find the follow relationship
            Optional<FollowersEntity> followEntityOptional = followersRepository.findByFollowerAndFollowee(follower, followee);

            followEntityOptional.ifPresent(followersRepository::delete);

            return true;
        }
        catch (Exception e){
            return false;
        }
    }

}
