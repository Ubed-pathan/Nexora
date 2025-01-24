package com.ubedpathan.Nexora.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PostEntity extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private UserEntity userEntity;

    @Column(
            nullable = false
    )
    private String imageUrl;

    @Column(
            nullable = false
    )
    private String imagePublicId;

    @Column(
            nullable = false
    )
    private String secureImageUrl;

    @Column(
            nullable = false
    )
    private String format;

    @Column(
            nullable = false
    )
    private String description;

    private int likes;

    private int disLikes;
}
