package com.ubedpathan.Nexora.controller;

import com.ubedpathan.Nexora.dtos.CommentResponseDto;
import com.ubedpathan.Nexora.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/comment")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/{userId}/{postId}/addComment")
    public ResponseEntity<?> handleAddComment(@PathVariable String userId, @PathVariable String postId, @RequestBody Map<String, String> body) {
        System.out.println("REquest Recived " + body);
        if(body.get("message") == null || userId == null || postId == null || body.get("message").length() == 0) {
            return ResponseEntity.badRequest().body("Invalid post id or user id or message is missing");
        }

        boolean response = commentService.handleAddComment(userId, postId, body.get("message"));

        if(response) {
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/{postId}/getCommentsForPost")
    public ResponseEntity<?> getCommentsForPost(@PathVariable String postId) {
        if(postId == null || postId.length() == 0) {
            return ResponseEntity.badRequest().body("Invalid post id or message is missing");
        }

        List<CommentResponseDto> comments = commentService.handleGetComment(postId);
        if(!comments.isEmpty()) {
            return ResponseEntity.ok(comments);
        }
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/{commentId}/delete")
    public ResponseEntity<?> deleteComment(@PathVariable String commentId) {
        if(commentId == null || commentId.length() == 0) {
            return ResponseEntity.badRequest().body("Invalid comment id or message is missing");
        }
        System.out.println(commentId);
        boolean response = commentService.handleDeleteComment(commentId);
        if(response) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();

    }

}
