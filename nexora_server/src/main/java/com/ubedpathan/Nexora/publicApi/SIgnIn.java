package com.ubedpathan.Nexora.publicApi;

import com.ubedpathan.Nexora.dtos.SignInDto;
import com.ubedpathan.Nexora.models.UserEntity;
import com.ubedpathan.Nexora.repositories.FollowersRepository;
import com.ubedpathan.Nexora.repositories.UserRepository;
import com.ubedpathan.Nexora.services.UserServices;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/public")
public class SIgnIn {

    @Autowired
    private UserServices userServices;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FollowersRepository followersRepository;

    @PostMapping("/signin")
    public ResponseEntity<?> handleUserSignIn(@Valid @RequestBody SignInDto request, HttpServletResponse response){
        String token = userServices.handleUserSignIn(request);
        if(token == "fail" || token == null || token.isEmpty()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Cookie cookie = new Cookie("log", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(7*24*60*60);

        response.addCookie(cookie);
        response.setHeader("Set-Cookie", "log=" + token + "; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=" + (7 * 24 * 60 * 60));

        Map<String, String> requiredUserData = new HashMap<>();
        Optional<UserEntity> userEntity= userRepository.findByUsername(request.username());

        UserEntity user = userEntity.get();

        long followersCount = followersRepository.countByFollowee(user);
        long followingCount = followersRepository.countByFollower(user);

        requiredUserData.put("id", userEntity.get().getId());
        requiredUserData.put("username", request.username());
        requiredUserData.put("email", userEntity.get().getEmail());
        requiredUserData.put("profileImageUrl", userEntity.get().getProfileImageURL());
        requiredUserData.put("posts", String.valueOf(userEntity.get().getTotalPosts()));
        requiredUserData.put("following", String.valueOf(followingCount));
        requiredUserData.put("followers", String.valueOf(followersCount));
        return ResponseEntity.ok(requiredUserData);
    }
}
