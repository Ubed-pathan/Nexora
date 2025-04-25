package com.ubedpathan.Nexora.controller;

import com.ubedpathan.Nexora.dtos.FollowersDto;
import com.ubedpathan.Nexora.models.UserEntity;
import com.ubedpathan.Nexora.repositories.FollowersRepository;
import com.ubedpathan.Nexora.repositories.UserRepository;
import com.ubedpathan.Nexora.services.FollowersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/follow")
public class FollowersController {
    @Autowired
    private FollowersService followersService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FollowersRepository followersRepository;


    @PostMapping("/{followerId}/{followeeId}/follow")
    public ResponseEntity<String> followUser(@PathVariable String followerId, @PathVariable String followeeId) {
        boolean isFollow = followersService.followUser(followerId, followeeId);

        if(isFollow) {
            return ResponseEntity.ok("Followed successfully!");
        }
        else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{followerId}/{followeeId}/unfollow")
    public ResponseEntity<String> unfollowUser(@PathVariable String followerId, @PathVariable String followeeId) {
        boolean isUnfollow = followersService.unfollowUser(followerId, followeeId);
        if(isUnfollow) return ResponseEntity.ok("Unfollowed successfully!");
        else return ResponseEntity.badRequest().build();
    }

    @GetMapping("/{userId}/followers")
    public List<UserEntity> getFollowers(@PathVariable String userId) {
        return followersService.getFollowers(userId);
    }


    @GetMapping("/{userId}/following")
    public List<FollowersDto> getFollowing(@PathVariable String userId) {
        return followersService.getFollowing(userId);
    }

    @GetMapping("/{followerId}/{followeeId}/checkFollowing")
    public ResponseEntity<?> isFollowing(@PathVariable String followerId, @PathVariable String followeeId) {
        if(followerId.equals(followeeId)) {
            return ResponseEntity.ok(false);
        }

        boolean isFollowing = followersService.isFollowing(followerId, followeeId);
        if(isFollowing) {
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.ok(false);
    }

    @GetMapping("/{userId}/countFollowerAndFollowing")
    public ResponseEntity<?> countFollowerAndFollowing(@PathVariable String userId) {
        if(userId.isEmpty() || userId.equals("")) {
            return ResponseEntity.badRequest().build();
        }
        UserEntity userEntity = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        long followersCount = followersRepository.countByFollowee(userEntity);
        long followingCount = followersRepository.countByFollower(userEntity);

        Map<String, Long> data = new HashMap<>();
        data.put("followers", followersCount);
        data.put("following", followingCount);
        return ResponseEntity.ok(data);
    }
}
