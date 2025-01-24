package com.ubedpathan.Nexora.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.ubedpathan.Nexora.auth.CustomAuthenticationToken;
import com.ubedpathan.Nexora.dtos.SignInDto;
import com.ubedpathan.Nexora.dtos.SignUpDto;
import com.ubedpathan.Nexora.models.UserEntity;
import com.ubedpathan.Nexora.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;


@Service
@Slf4j
public class UserServices {

    @Autowired
    private UserRepository userRepository;

    // it is come from security config
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private Cloudinary cloudinary;

    public boolean handleUserSignUp(SignUpDto signUpDto){
        UserEntity userEntity = new UserEntity();
        try {
            userEntity.setUsername(signUpDto.username());
            userEntity.setEmail(signUpDto.email());
            userEntity.setPassword(passwordEncoder.encode(signUpDto.password()));
            userRepository.save(userEntity);
            return true;
        } catch (Exception e) {
            log.info("Error During UserSingUp", e);
            return false;
        }
    }

    public String handleUserSignIn(SignInDto signInDto){
        try{
            Map<String, Object> requiredUserData = null;
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signInDto.username(), signInDto.password()));
            if(authentication.isAuthenticated()){
                Optional<UserEntity> userData = userRepository.findByUsername(signInDto.username());
                if(userData.isPresent()){

                    return jwtService.generateToken(userData);
                }
                return null;
            }
            else{
                return "fail";
            }
        }
        catch (Exception e){
            return "fail";
        }
    }

    public boolean hendleUserProfileAdd(MultipartFile file){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> userData = null;
        if(authentication instanceof CustomAuthenticationToken customAuthenticationToken) {
            userData = customAuthenticationToken.getUserData();
        }

        if(userData == null){
            return false;
        }

        try {
            UserEntity userEntity = userRepository.findById(userData.get("id").toString()).orElseThrow(() -> new RuntimeException("User not found"));
            String existingPublicId = userEntity.getProfileImageURLPublicId();
            if(existingPublicId != null && !existingPublicId.isEmpty()){
                this.cloudinary.uploader().destroy(existingPublicId, Map.of());
                userEntity.setProfileImageURL(null);
                userEntity.setSecureImageUrl(null);
                userEntity.setFormat(null);
            }
            Map<String, Object> uploadResult = this.cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", "user_profiles", "public_id", userEntity.getId()));
            userEntity.setProfileImageURLPublicId((String) uploadResult.get("public_id"));
            userEntity.setProfileImageURL((String) uploadResult.get("url"));
            userEntity.setSecureImageUrl((String) uploadResult.get("secure_url"));
            userEntity.setFormat((String) uploadResult.get("format"));
            userRepository.save(userEntity);
            return true;
        } catch (RuntimeException e) {
            log.error(String.valueOf(e));
            return false;
        } catch (IOException e) {
            log.error("Error", e);
            return false;
        }
    }
}
