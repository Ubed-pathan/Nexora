package com.ubedpathan.Nexora.services;

import com.ubedpathan.Nexora.dtos.HomeFeedUserDataDto;
import com.ubedpathan.Nexora.dtos.HomePostResponseDto;
import com.ubedpathan.Nexora.dtos.UserDto;
import com.ubedpathan.Nexora.models.PostEntity;
import com.ubedpathan.Nexora.models.SavedEntity;
import com.ubedpathan.Nexora.models.UserEntity;
import com.ubedpathan.Nexora.repositories.PostRepository;
import com.ubedpathan.Nexora.repositories.SavedPostsRepository;
import com.ubedpathan.Nexora.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
public class SavedPostsService {

    @Autowired
    private SavedPostsRepository savedPostsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    public boolean handleSavePost(String userId, String postId) {
        try{
            PostEntity postEntity = postRepository.findById(postId).orElseThrow();
            UserEntity userEntity = userRepository.findById(userId).orElseThrow();
            SavedEntity savedEntity = new SavedEntity();
            savedEntity.setPost(postEntity);
            savedEntity.setUser(userEntity);
            savedPostsRepository.save(savedEntity);
            savedPostsRepository.flush();
            return true;
        }
        catch(Exception e){
            return false;
        }
    }

    public List<HomePostResponseDto> getSavedPostsByUser(String userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<SavedEntity> savedEntities = savedPostsRepository.findByUser(user);

        List<PostEntity> posts = savedEntities.stream()
                .map(SavedEntity::getPost)
                .toList();

        List<String> postIds = posts.stream().map(PostEntity::getId).toList();

        // Fetch like/dislike count
        Map<String, Long> likeCountMap = postRepository.findLikeCounts(postIds).stream()
                .collect(Collectors.toMap(o -> (String) o[0], o -> (Long) o[1]));

        Map<String, Long> dislikeCountMap = postRepository.findDislikeCounts(postIds).stream()
                .collect(Collectors.toMap(o -> (String) o[0], o -> (Long) o[1]));

        // Fetch liked/disliked users
        Map<String, List<UserDto>> likedUsersMap = postRepository.findLikedUsers(postIds).stream()
                .collect(Collectors.groupingBy(
                        o -> (String) o[2],
                        Collectors.mapping(o -> new UserDto((String) o[0], (String) o[1]), toList())
                ));

        Map<String, List<UserDto>> dislikedUsersMap = postRepository.findDislikedUsers(postIds).stream()
                .collect(Collectors.groupingBy(
                        o -> (String) o[2],
                        Collectors.mapping(o -> new UserDto((String) o[0], (String) o[1]), toList())
                ));

        // Map to DTO
        return posts.stream()
                .map(post -> HomePostResponseDto.builder()
                        .id(post.getId())
                        .description(post.getDescription())
                        .format(post.getFormat())
                        .imageUrl(post.getImageUrl())
                        .secureImageUrl(post.getSecureImageUrl())
                        .createdAt(post.getCreatedAt())
                        .updatedAt(post.getUpdatedAt())
                        .likeCount(likeCountMap.getOrDefault(post.getId(), 0L))
                        .dislikeCount(dislikeCountMap.getOrDefault(post.getId(), 0L))
                        .likedUsers(likedUsersMap.getOrDefault(post.getId(), List.of()))
                        .dislikedUsers(dislikedUsersMap.getOrDefault(post.getId(), List.of()))
                        .user(new HomeFeedUserDataDto(
                                post.getUserEntity().getId(),
                                post.getUserEntity().getUsername(),
                                post.getUserEntity().getSecureImageUrl()
                        ))
                        .build())
                .collect(toList());
    }


    public boolean handleDeleteSavedPost(String userId, String postId) {
        try{
            SavedEntity savedEntity = savedPostsRepository.findByUserIdAndPostId(userId, postId);
            savedPostsRepository.delete(savedEntity);
            savedPostsRepository.flush();
            return true;
        } catch (Exception e) {
          return false;
        }
    }
}

