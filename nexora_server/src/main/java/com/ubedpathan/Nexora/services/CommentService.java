package com.ubedpathan.Nexora.services;

import com.ubedpathan.Nexora.dtos.CommentResponseDto;
import com.ubedpathan.Nexora.models.CommentEntity;
import com.ubedpathan.Nexora.models.PostEntity;
import com.ubedpathan.Nexora.models.UserEntity;
import com.ubedpathan.Nexora.repositories.CommentRepository;
import com.ubedpathan.Nexora.repositories.PostRepository;
import com.ubedpathan.Nexora.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PostRepository postRepository;

    public boolean handleAddComment(String userId, String postId, String message) {
        try{
            UserEntity userEntity = userRepository.findById(userId).orElse(null);
            PostEntity postEntity = postRepository.findById(postId).orElse(null);
            CommentEntity commentEntity = new CommentEntity();
            commentEntity.setUser(userEntity);
            commentEntity.setPost(postEntity);
            commentEntity.setMessage(message);
            commentRepository.saveAndFlush(commentEntity);
            return true;
        }
        catch(Exception e){
            return false;
        }
    }

    public List<CommentResponseDto> handleGetComment(String postId) {
        PostEntity postEntity = postRepository.findById(postId).orElse(null);
        if (postEntity == null) return Collections.emptyList();

        List<CommentEntity> commentEntities = commentRepository.findByPost(postEntity);

        return commentEntities.stream().map(comment -> {
            UserEntity user = comment.getUser();
            return new CommentResponseDto(
                    comment.getId(),
                    comment.getMessage(),
                    user.getId(),
                    user.getUsername(),
                    user.getSecureImageUrl()
            );
        }).toList();
    }

    public boolean handleDeleteComment(String commentId) {
        try{
            CommentEntity commentEntity = commentRepository.findById(commentId).orElse(null);
            if (commentEntity == null) return false;
            commentRepository.delete(commentEntity);
            return true;
        }
        catch(Exception e){
            return false;
        }
    }
}
