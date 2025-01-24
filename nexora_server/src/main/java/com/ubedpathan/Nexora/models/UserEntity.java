package com.ubedpathan.Nexora.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserEntity extends BaseEntity {

    @Column(
            nullable = false,
            length = 35,
            unique = true
    )
    private String username;

    @Column(
            nullable = false,
            length = 35,
            unique = true
    )
    private String email;

    @Column(
            nullable = false
    )
    private String password;

    @Column(
            nullable = false
    )
    private List<String> roles = new ArrayList<>();

    @PrePersist
    private  void setRole(){
        this.roles.add("USER");
    }

    private String profileImageURL;

    private String profileImageURLPublicId;

    private String secureImageUrl;

    private String format;

    private int followers = 0;

    private int following = 0;

    private int totalPosts = 0;

    @OneToMany(mappedBy = "userEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostEntity> postEntities = new ArrayList<>();

    public void addPost(PostEntity post) {
        post.setUserEntity(this);
        this.postEntities.add(post);
    }
}
