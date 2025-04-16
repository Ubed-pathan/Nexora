package com.ubedpathan.Nexora.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Setter
@Getter
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DisLikeEntity extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "post_id")
    @JsonIgnore
    @ToString.Exclude
    private PostEntity disLikedPost;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    @ToString.Exclude
    private UserEntity userid;
}
