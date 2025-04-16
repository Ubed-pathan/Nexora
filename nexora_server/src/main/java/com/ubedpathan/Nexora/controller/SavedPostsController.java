package com.ubedpathan.Nexora.controller;

import com.ubedpathan.Nexora.auth.CustomAuthenticationToken;
import com.ubedpathan.Nexora.dtos.HomePostResponseDto;
import com.ubedpathan.Nexora.services.PostService;
import com.ubedpathan.Nexora.services.SavedPostsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Conditional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping("/save")
@RestController
public class SavedPostsController {

    @Autowired
    private SavedPostsService savedPostsService;

    @PostMapping("/{userId}/{postId}/post")
    public ResponseEntity<?> hanldeSavePost(@PathVariable String userId, @PathVariable String postId) {
        if(postId == null || postId.isEmpty() || userId == null || userId.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid post id or user id");
        }

        boolean result = savedPostsService.handleSavePost(userId, postId);

        if(result) {
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/getSavedPosts")
    public ResponseEntity<?> getSavedPosts(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> userData = null;

        if (authentication instanceof CustomAuthenticationToken customAuthenticationToken) {
            userData = customAuthenticationToken.getUserData();
        }

        if (userData == null) {
            return null;
        }

        String currentUsername = userData.get("id").toString();

        List<HomePostResponseDto> response = savedPostsService.getSavedPostsByUser(currentUsername);

        if(response.isEmpty() || response.size() == 0) {
            return ResponseEntity.badRequest().build();
        }

        System.out.println(response);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}/{postId}/deletePost")
    public ResponseEntity<?> deleteSavedPost(@PathVariable String userId, @PathVariable String postId) {
        System.out.println(postId+"this is post id which is received at backend");
        if(postId == null || postId.isEmpty() || userId == null || userId.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid post id or user id");
        }

        boolean result = savedPostsService.handleDeleteSavedPost(userId, postId);
        if(result) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
}
