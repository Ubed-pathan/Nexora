package com.ubedpathan.Nexora.services;

import com.ubedpathan.Nexora.models.UserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts;


import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.function.Function;

@Service
public class JwtService {

    private String secretkey= "";

    public JwtService(){
        try{
            KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
            SecretKey sk = keyGen.generateKey();
            secretkey = Base64.getEncoder().encodeToString(sk.getEncoded());
        }catch (NoSuchAlgorithmException e){
            throw  new RuntimeException(e);
        }
    }

    public String generateToken(Optional<UserEntity> userEntity){
        Map<String, Object> claims = new HashMap<>();
        UserEntity user = userEntity.orElseThrow(() -> new IllegalArgumentException("User not found"));

        claims.put("email", user.getEmail());
        claims.put("roles", user.getRoles());
        claims.put("profileImageUrl", user.getProfileImageURL());
        claims.put("id", user.getId());

        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(userEntity.get().getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+ 60 * 60 * 30 * 1000 * 10000))
                .and()
                .signWith(getKey())
                .compact();
    }

    private SecretKey getKey(){
        byte[] keyBytes = Decoders.BASE64.decode(secretkey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

//    public String extractUserName(String token) {
//        return extractClaim(token, Claims::getSubject);
//    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Map<String, Object> extractAllData(String token) {
        Claims claims = extractAllClaims(token);

        Map<String, Object> data = new HashMap<>();
        data.put("username", claims.getSubject());
        data.put("email", claims.get("email", String.class));
        data.put("roles", claims.get("roles", List.class));
        data.put("profileImageUrl", claims.get("profileImageUrl", String.class));
        data.put("id", claims.get("id", String.class));

        return data;
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final Map<String, Object> userData = extractAllData(token);
        return (userData.get("username").equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
