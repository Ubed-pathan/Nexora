package com.ubedpathan.Nexora.controller;

import com.ubedpathan.Nexora.dtos.FollowersDto;
import com.ubedpathan.Nexora.models.UserEntity;
import com.ubedpathan.Nexora.services.FollowersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/follow")
public class FollowersController {
    @Autowired
    private FollowersService followersService;

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
}
