package com.ubedpathan.Nexora.controller;

import com.ubedpathan.Nexora.auth.CustomAuthenticationToken;
import com.ubedpathan.Nexora.dtos.PostResponseDto;
import com.ubedpathan.Nexora.models.LikeEntity;
import com.ubedpathan.Nexora.models.PostEntity;
import com.ubedpathan.Nexora.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/post")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping
    public ResponseEntity<?> handleAddPost(
            @RequestParam("file")
            MultipartFile file,
            @RequestParam("description")
            String description
    ){
        if(file.isEmpty() || file == null || description.isEmpty() || description == null){
            return ResponseEntity.badRequest().body("Please fill all the field");
        }

        boolean isPostAdded = postService.handleAddPost(file, description);

        if(isPostAdded){
            return ResponseEntity.ok("post added successfully");
        }
        else{
            return ResponseEntity.status(500).body("fail to add post");
        }
    }

    @GetMapping
    public ResponseEntity<?> handleGetPosts(){
        List<PostResponseDto> postEntities = postService.handleGetUserPosts();

        if(postEntities != null){
            return ResponseEntity.ok(postEntities);
        }
        else{
            return ResponseEntity.status(404).body("posts not found");
        }
    }

    @PostMapping("/like")
    public ResponseEntity<?> handleLikePost(@RequestBody Map<String, String> body) {
        if (body == null || body.isEmpty()) {
            return ResponseEntity.badRequest().body("Please provide a post ID.");
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = null;

        if (auth instanceof CustomAuthenticationToken authenticationToken) {
            userId = (String) authenticationToken.getUserData().get("id");
        }

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated.");
        }

        String postId = body.get("postId");
        int[] total = postService.handleLikes(postId, userId);
        return ResponseEntity.ok(Map.of("totalLikes", total[0], "totalDislikes", total[1] ));
    }

    @PostMapping("/{postId}/dislike")
    public ResponseEntity<?> handleDislikePost(@PathVariable String postId) {
        if (postId == null || postId.isEmpty()) {
            return ResponseEntity.badRequest().body("Please provide a post ID.");
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = null;
        if (auth instanceof CustomAuthenticationToken authenticationToken) {
            userId = (String) authenticationToken.getUserData().get("id");
        }
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated.");
        }

        int[] total = postService.handleDisLikes(postId, userId);
        return ResponseEntity.ok(Map.of("totalDisLikes",total[0],  "totalLikes",total[1] ));

    }



    @GetMapping("/{userId}/getAllPosts")
    public ResponseEntity<?> handleGetAllPosts(@PathVariable String userId){
        if(userId == null || userId.isEmpty()){
            return ResponseEntity.badRequest().body("Please provide a post ID.");
        }
        List<PostResponseDto> postEntities = postService.handleGetUserPosts(userId);

        if(postEntities != null){
            return ResponseEntity.ok(postEntities);
        }
        else{
            return ResponseEntity.status(404).body("posts not found");
        }

    }


}
