package com.ubedpathan.Nexora.filters;

import com.ubedpathan.Nexora.auth.CustomAuthenticationToken;
import com.ubedpathan.Nexora.services.JwtService;
import com.ubedpathan.Nexora.services.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.context.ApplicationContext;


import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    ApplicationContext context;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException{
        String token = null;
        Map<String, Object> userData = null;
        String requestURI = request.getRequestURI();


        if("/nexora/public/signin".equals(requestURI)){
            filterChain.doFilter(request, response);
        }

        if(request.getCookies() != null){
            for(jakarta.servlet.http.Cookie cookie : request.getCookies()){
                if("log".equals(cookie.getName())){
                    token = URLDecoder.decode(cookie.getValue(), StandardCharsets.UTF_8);
                    break;
                }
            }
        }

        if(token != null){
            userData = jwtService.extractAllData(token);
        }

//        here adding user data to request
        if (userData != null) {
            request.setAttribute("userData", userData);
        }

        if(userData != null && userData.get("username") != null && SecurityContextHolder.getContext().getAuthentication() == null){
            UserDetails userDetails = context.getBean(UserDetailsServiceImpl.class).loadUserByUsername(userData.get("username").toString());

            if(jwtService.validateToken(token, userDetails)) {
                CustomAuthenticationToken authToken = new CustomAuthenticationToken(userDetails, userData);
                authToken.setDetails(new WebAuthenticationDetailsSource()
                        .buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }


        filterChain.doFilter(request, response);

    }
}
