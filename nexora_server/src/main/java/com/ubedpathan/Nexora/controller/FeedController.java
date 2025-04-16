package com.ubedpathan.Nexora.controller;

import com.ubedpathan.Nexora.auth.CustomAuthenticationToken;
import com.ubedpathan.Nexora.dtos.HomePostResponseDto;
import com.ubedpathan.Nexora.dtos.PostResponseDto;
import com.ubedpathan.Nexora.services.FeedService;
import com.ubedpathan.Nexora.services.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/feed")
@RequiredArgsConstructor
public class FeedController {

    private final FeedService feedService;

    @GetMapping("/home")
    public ResponseEntity<List<HomePostResponseDto>> getHomeFeed(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime before) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> userData = null;
        System.out.println(before);
        if (authentication instanceof CustomAuthenticationToken customAuthenticationToken) {
            userData = customAuthenticationToken.getUserData();
        }

        if (userData == null) {
            return null;
        }

        String loggedInUserId = userData.get("id").toString();
        List<HomePostResponseDto> feed =feedService.getHomeFeed(loggedInUserId, before);
        return ResponseEntity.ok(feed);
    }
}

