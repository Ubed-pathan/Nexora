package com.ubedpathan.Nexora.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.ubedpathan.Nexora.auth.CustomAuthenticationToken;
import com.ubedpathan.Nexora.models.PostEntity;
import com.ubedpathan.Nexora.models.UserEntity;
import com.ubedpathan.Nexora.repositories.PostRepository;
import com.ubedpathan.Nexora.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Cloudinary cloudinary;

    public boolean handleAddPost(MultipartFile file, String description){
        Map<String, Object> userData = null;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication instanceof CustomAuthenticationToken customAuthenticationToken){
            userData = customAuthenticationToken.getUserData();
        }

        if(userData == null){
            return  false;
        }

        try {

            UserEntity userEntity = userRepository.findById(userData.get("id").toString()).orElseThrow(() -> new RuntimeException("User not found"));
            System.out.println(userEntity);
            Map<String, Object> uploadResult = this.cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", "post_images"));
            System.out.println(uploadResult);
            PostEntity postEntity = new PostEntity();
            postEntity.setUserEntity(userEntity);
            postEntity.setImageUrl((String) uploadResult.get("url"));
            postEntity.setImagePublicId((String) uploadResult.get("public_id"));
            postEntity.setSecureImageUrl((String) uploadResult.get("secure_url"));
            postEntity.setFormat((String) uploadResult.get("format"));
            postEntity.setDescription(description);
            postEntity.setLikes(0);
            postEntity.setDisLikes(0);
            userEntity.addPost(postEntity);
            userRepository.save(userEntity);
            return true;
        } catch (Exception e) {
            log.error(String.valueOf(e));
            return false;
        }

    }

    public List<PostEntity> handleGetUserPosts(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof CustomAuthenticationToken customAuthenticationToken) {
            String userId = (String) customAuthenticationToken.getUserData().get("id");
            return postRepository.findByUserEntityId(userId);
        }
        return null;
    }
}
