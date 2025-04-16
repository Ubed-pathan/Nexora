package com.ubedpathan.Nexora.controller;

import com.ubedpathan.Nexora.auth.CustomAuthenticationToken;
import com.ubedpathan.Nexora.models.UserEntity;
import com.ubedpathan.Nexora.repositories.FollowersRepository;
import com.ubedpathan.Nexora.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/check-userstate")
public class UserStateCheck {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FollowersRepository followersRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> checkUserState(){
        Map<String, Object> userData = null;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication instanceof CustomAuthenticationToken customAuthenticationToken){
            userData = customAuthenticationToken.getUserData();
        }

        if (userData == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        try{
            UserEntity userEntity = userRepository.findById(userData.get("id").toString()).orElseThrow(() -> new RuntimeException("No user found"));
            long followersCount = followersRepository.countByFollowee(userEntity);
            long followingCount = followersRepository.countByFollower(userEntity);
            Map<String,Object> requiredUserData = new HashMap<>();
            requiredUserData.put("id", userEntity.getId());
            requiredUserData.put("username", userEntity.getUsername());
            requiredUserData.put("email", userEntity.getEmail());
            requiredUserData.put("profileImageUrl", userEntity.getProfileImageURL());
            requiredUserData.put("posts", userEntity.getTotalPosts());
            requiredUserData.put("following", String.valueOf(followingCount));
            requiredUserData.put("followers", String.valueOf(followersCount));
            return ResponseEntity.ok(requiredUserData);
        } catch (Exception e) {
            log.error("Error", e);
            return ResponseEntity.notFound().build();
        }

    }
}
