package com.ubedpathan.Nexora.auth;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;

public class CustomAuthenticationToken extends UsernamePasswordAuthenticationToken {
    private Map<String, Object> userData;

    public CustomAuthenticationToken(UserDetails principal, Map<String, Object> userData) {
        super(principal, null, principal.getAuthorities());
        this.userData = userData;
    }

    public Map<String, Object> getUserData() {
        return userData;
    }
}

