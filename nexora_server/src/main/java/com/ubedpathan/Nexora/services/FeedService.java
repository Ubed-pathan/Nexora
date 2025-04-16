package com.ubedpathan.Nexora.services;

import com.ubedpathan.Nexora.dtos.HomeFeedUserDataDto;
import com.ubedpathan.Nexora.dtos.HomePostResponseDto;
import com.ubedpathan.Nexora.dtos.UserDto;
import com.ubedpathan.Nexora.models.FollowersEntity;
import com.ubedpathan.Nexora.models.PostEntity;
import com.ubedpathan.Nexora.models.UserEntity;
import com.ubedpathan.Nexora.repositories.FollowersRepository;
import com.ubedpathan.Nexora.repositories.PostRepository;
import com.ubedpathan.Nexora.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class FeedService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final FollowersRepository followersRepository;

    public List<HomePostResponseDto> getHomeFeed(String userId, LocalDateTime before) {
        UserEntity currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> followingUserIds = currentUser.getFollowing().stream()
                .map(f -> f.getFollowee().getId())
                .collect(toList());

        List<String> followerUserIds = currentUser.getFollowers().stream()
                .map(f -> f.getFollower().getId())
                .collect(toList());

        LocalDateTime fetchBefore = before != null ? before : LocalDateTime.now();

        List<PostEntity> followingPosts = postRepository
                .findRecentPostsFromFollowingBefore(followingUserIds, fetchBefore, Pageable.ofSize(10));

        Set<String> followingPostIds = followingPosts.stream()
                .map(PostEntity::getId)
                .collect(Collectors.toSet());

        List<PostEntity> followerPosts = postRepository
                .findRecentPostsFromFollowingBeforeExcludingPostIds(followerUserIds, fetchBefore, followingPostIds, Pageable.ofSize(10));


        // Combine all loaded posts
        List<PostEntity> combinedPosts = new ArrayList<>();
        combinedPosts.addAll(followingPosts);
        combinedPosts.addAll(followerPosts);

        // Random posts from users NOT in followers or followings or self
        Set<String> excludedUserIds = new HashSet<>();
        excludedUserIds.addAll(followingUserIds);
        excludedUserIds.addAll(followerUserIds);
        excludedUserIds.add(currentUser.getId());


        List<PostEntity> randomPosts = postRepository.findRandomPostsExcludingUsers(excludedUserIds)
                .stream()
                .limit(10)
                .toList();

        combinedPosts.addAll(randomPosts);
        System.out.println("random posts "+randomPosts);
        System.out.println("all combine posts"+combinedPosts);
        System.out.println("all combine posts"+combinedPosts.size());

        // Get all post IDs
        List<String> postIds = combinedPosts.stream().map(PostEntity::getId).toList();

        Map<String, Long> likeCountMap = postRepository.findLikeCounts(postIds).stream()
                .collect(Collectors.toMap(o -> (String) o[0], o -> (Long) o[1]));

        Map<String, Long> dislikeCountMap = postRepository.findDislikeCounts(postIds).stream()
                .collect(Collectors.toMap(o -> (String) o[0], o -> (Long) o[1]));

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

        return combinedPosts.stream()
                .sorted(Comparator.comparing(PostEntity::getCreatedAt).reversed())
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
                .toList();
    }

}
