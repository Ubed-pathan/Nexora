package com.ubedpathan.Nexora.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class FollowersEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "follower_id", nullable = false)
//    it mean who follows me and here other users id stored
    private UserEntity follower;  // The user who follows

    @ManyToOne
    @JoinColumn(name = "followee_id", nullable = false)
//    whom to follow mean here my id
    private UserEntity followee;  // The user being followed

//    simple example
//    if A follows B then follower id A and followee id is B

    public FollowersEntity(UserEntity follower, UserEntity followee) {
        this.follower = follower;
        this.followee = followee;
    }
}
