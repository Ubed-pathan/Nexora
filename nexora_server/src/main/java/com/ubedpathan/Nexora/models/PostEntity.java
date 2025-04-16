    package com.ubedpathan.Nexora.models;

    import com.fasterxml.jackson.annotation.JsonIgnore;
    import jakarta.persistence.*;
    import lombok.*;
    import org.hibernate.annotations.BatchSize;

    import java.util.ArrayList;
    import java.util.List;

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
        @ToString.Exclude
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


        @OneToMany(mappedBy = "likedPost", cascade = CascadeType.ALL, orphanRemoval = true)
        @BatchSize(size = 50)
        @JsonIgnore
        private List<LikeEntity> likes = new ArrayList<>();

        @OneToMany(mappedBy = "disLikedPost", cascade = CascadeType.ALL, orphanRemoval = true)
        @BatchSize(size = 50)
        @JsonIgnore
        private List<DisLikeEntity> disLikes = new ArrayList<>();
    }
