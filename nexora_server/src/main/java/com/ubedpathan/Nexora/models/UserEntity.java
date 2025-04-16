package com.ubedpathan.Nexora.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @OneToMany(mappedBy = "followee", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
//    if i want to retrieve my followers mean other follows me then i look for followee mean in database where followee id is my id then
//    other user is my follower
    private List<FollowersEntity> followers = new ArrayList<>();

    @OneToMany(mappedBy = "follower", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
//    if want to retrieve my following mean i followed other, then i look for in database where follower id is my id then followee is other user
    private List<FollowersEntity> following = new ArrayList<>();

    private int totalPosts = 0;

    @OneToMany(mappedBy = "userEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
    private List<PostEntity> postEntities = new ArrayList<>();

    public void addPost(PostEntity post) {
        post.setUserEntity(this);
        if (!this.postEntities.contains(post)) {
            this.postEntities.add(post);
        }
    }
}
