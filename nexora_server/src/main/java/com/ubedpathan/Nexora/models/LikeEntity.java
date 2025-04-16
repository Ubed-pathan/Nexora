package com.ubedpathan.Nexora.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Setter
@Getter
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LikeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // Generate unique ID for each like
    private String id;

    @ManyToOne
    @JoinColumn(name = "post_id")
    @JsonIgnore
    @ToString.Exclude
    private PostEntity likedPost;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private UserEntity userid;

}
