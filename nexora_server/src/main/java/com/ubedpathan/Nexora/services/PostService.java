    package com.ubedpathan.Nexora.services;

    import com.cloudinary.Cloudinary;
    import com.cloudinary.utils.ObjectUtils;
    import com.ubedpathan.Nexora.auth.CustomAuthenticationToken;
    import com.ubedpathan.Nexora.dtos.PostResponseDto;
    import com.ubedpathan.Nexora.dtos.UserDto;
    import com.ubedpathan.Nexora.models.DisLikeEntity;
    import com.ubedpathan.Nexora.models.LikeEntity;
    import com.ubedpathan.Nexora.models.PostEntity;
    import com.ubedpathan.Nexora.models.UserEntity;
    import com.ubedpathan.Nexora.repositories.DisLikeRepository;
    import com.ubedpathan.Nexora.repositories.LikeRepository;
    import com.ubedpathan.Nexora.repositories.PostRepository;
    import com.ubedpathan.Nexora.repositories.UserRepository;
    import lombok.extern.slf4j.Slf4j;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.security.core.Authentication;
    import org.springframework.security.core.context.SecurityContextHolder;
    import org.springframework.stereotype.Service;
    import org.springframework.web.multipart.MultipartFile;

    import java.time.LocalDateTime;
    import java.util.ArrayList;
    import java.util.Collections;
    import java.util.List;
    import java.util.Map;
    import java.util.stream.Collectors;

    @Slf4j
    @Service
    public class PostService {
        @Autowired
        private PostRepository postRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private Cloudinary cloudinary;

        @Autowired
        private LikeRepository likeRepository;
        @Autowired
        private DisLikeRepository disLikeRepository;

        public boolean handleAddPost(MultipartFile file, String description) {
            Map<String, Object> userData = null;
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication instanceof CustomAuthenticationToken customAuthenticationToken) {
                userData = customAuthenticationToken.getUserData();
            }

            if (userData == null) {
                return false;
            }

            try {

                UserEntity userEntity = userRepository.findById(userData.get("id").toString()).orElseThrow(() -> new RuntimeException("User not found"));
                Map<String, Object> uploadResult = this.cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", "nexora_post_images"));
                PostEntity postEntity = new PostEntity();
                postEntity.setUserEntity(userEntity);
                postEntity.setImageUrl((String) uploadResult.get("url"));
                postEntity.setImagePublicId((String) uploadResult.get("public_id"));
                postEntity.setSecureImageUrl((String) uploadResult.get("secure_url"));
                postEntity.setFormat((String) uploadResult.get("format"));
                postEntity.setDescription(description);
                postEntity.setLikes(new ArrayList<>());
                postEntity.setDisLikes(new ArrayList<>());
                userEntity.addPost(postEntity);
                userRepository.save(userEntity);
                return true;
            } catch (Exception e) {
                log.error(String.valueOf(e));
                return false;
            }

        }

        public List<PostResponseDto> handleGetUserPosts() {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication instanceof CustomAuthenticationToken customAuthenticationToken) {
                String userId = (String) customAuthenticationToken.getUserData().get("id");

                // Fetch UserEntity first
                UserEntity user = userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                // Fetch posts using the correct method
                List<PostEntity> posts = postRepository.findByUserEntity(user);
                List<String> postIds = posts.stream().map(PostEntity::getId).toList();

                Map<String, Long> likeCounts = getLikeCounts(postIds);
                Map<String, Long> dislikeCounts = getDislikeCounts(postIds);

                Map<String, List<UserDto>> likedUsers = getLikedUsers(postIds).stream()
                        .filter(user1 -> user1.getId() != null && user1.getPostId() != null && user1.getUsername() != null )
                        .collect(Collectors.groupingBy(UserDto::getPostId));

                Map<String, List<UserDto>> dislikedUsers = getDislikedUsers(postIds).stream()
                        .filter(user1 -> user1.getId() != null && user1.getPostId() != null && user1.getUsername() != null)
                        .collect(Collectors.groupingBy(UserDto::getPostId));

                return posts.stream()
                        .map(post -> new PostResponseDto(
                                post.getId(),
                                post.getDescription(),
                                post.getFormat(),         // ✅ Fix: Add missing 'format'
                                post.getImageUrl(),
                                post.getSecureImageUrl(), // ✅ Fix: Add missing 'secureImageUrl'
                                post.getCreatedAt(),
                                post.getUpdatedAt(),
                                likeCounts.getOrDefault(post.getId(), 0L),
                                dislikeCounts.getOrDefault(post.getId(), 0L),
                                likedUsers.getOrDefault(post.getId(), Collections.emptyList()),
                                dislikedUsers.getOrDefault(post.getId(), Collections.emptyList())
                        ))
                        .toList();
            }
            return null;
        }

        public List<UserDto> getLikedUsers(List<String> postIds) {
            List<Object[]> results = postRepository.findLikedUsers(postIds);
            return results.stream()
                    .map(result -> new UserDto(
                            (String) result[0], // User ID
                            (String) result[1],
                            (String) result[2]// Username
                    ))
                    .toList();
        }


        public List<UserDto> getDislikedUsers(List<String> postIds) {
            List<Object[]> results = postRepository.findDislikedUsers(postIds);
            return results.stream()
                    .map(result -> new UserDto(
                            (String) result[0], // User ID
                            (String) result[1],
                            (String) result[2]
                    ))
                    .toList();
        }

        public List<PostResponseDto> handleGetUserPosts(String userId) {
                // Fetch UserEntity first
                UserEntity user = userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                // Fetch posts using the correct method
                List<PostEntity> posts = postRepository.findByUserEntity(user);
                List<String> postIds = posts.stream().map(PostEntity::getId).toList();

                Map<String, Long> likeCounts = getLikeCounts(postIds);
                Map<String, Long> dislikeCounts = getDislikeCounts(postIds);

                Map<String, List<UserDto>> likedUsers = getLikedUsers(postIds).stream()
                        .filter(user1 -> user1.getId() != null && user1.getPostId() != null && user1.getUsername() != null )
                        .collect(Collectors.groupingBy(UserDto::getPostId));

                Map<String, List<UserDto>> dislikedUsers = getDislikedUsers(postIds).stream()
                        .filter(user1 -> user1.getId() != null && user1.getPostId() != null && user1.getUsername() != null)
                        .collect(Collectors.groupingBy(UserDto::getPostId));

                return posts.stream()
                        .map(post -> new PostResponseDto(
                                post.getId(),
                                post.getDescription(),
                                post.getFormat(),         // ✅ Fix: Add missing 'format'
                                post.getImageUrl(),
                                post.getSecureImageUrl(), // ✅ Fix: Add missing 'secureImageUrl'
                                post.getCreatedAt(),
                                post.getUpdatedAt(),
                                likeCounts.getOrDefault(post.getId(), 0L),
                                dislikeCounts.getOrDefault(post.getId(), 0L),
                                likedUsers.getOrDefault(post.getId(), Collections.emptyList()),
                                dislikedUsers.getOrDefault(post.getId(), Collections.emptyList())
                        ))
                        .toList();
        }


        // Move these methods to the service class
        public Map<String, Long> getLikeCounts(List<String> postIds) {
            List<Object[]> results = postRepository.findLikeCounts(postIds);
            return results.stream()
                    .collect(Collectors.toMap(
                            result -> (String) result[0],  // Post ID
                            result -> (Long) result[1]     // Like count
                    ));
        }

        public Map<String, Long> getDislikeCounts(List<String> postIds) {
            List<Object[]> results = postRepository.findDislikeCounts(postIds);
            return results.stream()
                    .collect(Collectors.toMap(
                            result -> (String) result[0],  // Post ID
                            result -> (Long) result[1]     // Dislike count
                    ));
        }

        public int[] handleLikes(String postId, String userId) {
            PostEntity post = postRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("Post not found"));

            UserEntity user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            LikeEntity existingLike = likeRepository.findByLikedPostAndUserid(post, user);
            DisLikeEntity existingDisLike = disLikeRepository.findByDisLikedPostAndUserid(post, user);

            if (existingDisLike != null) {
                disLikeRepository.delete(existingDisLike);
            }

            if (existingLike != null) {
                likeRepository.delete(existingLike); // Unlike the post
            } else {
                LikeEntity newLike = new LikeEntity();
                newLike.setLikedPost(post);
                newLike.setUserid(user);
                likeRepository.save(newLike); // Add like
            }

            return new int[]{likeRepository.countByLikedPost(post),disLikeRepository.countByDisLikedPost(post)};
        }

        public int[] handleDisLikes(String postId, String userId) {
            PostEntity post = postRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("Post not found"));

            UserEntity user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            DisLikeEntity existingDisLike = disLikeRepository.findByDisLikedPostAndUserid(post, user);
            LikeEntity existingLike = likeRepository.findByLikedPostAndUserid(post, user);

            if (existingLike != null) {
                likeRepository.delete(existingLike);
            }

            if (existingDisLike != null) {
                disLikeRepository.delete(existingDisLike);
            } else {
                DisLikeEntity newDisLike = new DisLikeEntity();
                newDisLike.setDisLikedPost(post);
                newDisLike.setUserid(user);
                disLikeRepository.save(newDisLike);
            }

            return new int[] {disLikeRepository.countByDisLikedPost(post), likeRepository.countByLikedPost(post)};

        }


        public boolean handleDeletePost(String postId){
            try{
                postRepository.deleteById(postId);
                return true;
            }
            catch(Exception e){
                return false;
            }
        }


    }
