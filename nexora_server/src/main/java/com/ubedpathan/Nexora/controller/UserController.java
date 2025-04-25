package com.ubedpathan.Nexora.controller;

import com.ubedpathan.Nexora.auth.CustomAuthenticationToken;
import com.ubedpathan.Nexora.dtos.AllUserResponseDto;
import com.ubedpathan.Nexora.dtos.SuggestionsUserDto;
import com.ubedpathan.Nexora.dtos.UserDto;
import com.ubedpathan.Nexora.models.UserEntity;
import com.ubedpathan.Nexora.services.UserServices;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserServices userServices;

    @PostMapping("/addProfile")
    public ResponseEntity<?> hendleUserProfileAdd(@RequestParam("file") MultipartFile file){
        if(!file.isEmpty()){
            boolean isProfileAdded = userServices.hendleUserProfileAdd(file);
            if(isProfileAdded){
                return ResponseEntity.ok().body("Profile Image Added");
            }

        }
        return ResponseEntity.badRequest().body("Fail to add image");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("log", null);
        if(cookie == null){
            return ResponseEntity.badRequest().body("Fail to log out");
        }
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setMaxAge(0);

        response.addCookie(cookie);

        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<?> handleGetSearchUsers(@RequestParam String query){
        if(!query.isEmpty() || query != null){
            List<UserEntity> users = userServices.handleGetSearchUsers(query);
            return ResponseEntity.ok(users.stream().map(u -> new SuggestionsUserDto(
                    u.getId(),
                    u.getUsername(),
                    u.getSecureImageUrl()
            )));
        }
        return ResponseEntity.badRequest().body("Fail to search users");


    }

    @GetMapping("/allusers")
    public ResponseEntity<?> handleGetAllUsers(){
        List<AllUserResponseDto> allusers = userServices.handleGetAllUsers();
        if(allusers.isEmpty() || allusers == null){
            return ResponseEntity.badRequest().body("Fail to search users");
        }
        return ResponseEntity.ok(allusers);
    }

    @GetMapping("/getSuggestions")
    public ResponseEntity<?> handleGetSuggestions(){
        Map<String, Object> userData = null;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication instanceof CustomAuthenticationToken customAuthenticationToken){
            userData = customAuthenticationToken.getUserData();
        }

        if (userData == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        List<UserEntity> suggestedUsers = userServices.getSuggestedUsers(userData.get("id").toString());
        if(suggestedUsers.isEmpty() || suggestedUsers == null){
            return ResponseEntity.badRequest().body("Fail to search users");
        }
        return ResponseEntity.ok(suggestedUsers.stream().map(u -> new SuggestionsUserDto(
                u.getId(),
                u.getUsername(),
                u.getSecureImageUrl()
        )));
    }

}
