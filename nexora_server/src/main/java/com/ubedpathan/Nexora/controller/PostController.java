package com.ubedpathan.Nexora.controller;

import com.ubedpathan.Nexora.models.PostEntity;
import com.ubedpathan.Nexora.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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
        List<PostEntity> postEntities = postService.handleGetUserPosts();

        if(postEntities != null){
            return ResponseEntity.ok(postEntities);
        }
        else{
            return ResponseEntity.status(404).body("posts not found");
        }
    }
}
