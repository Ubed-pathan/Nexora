package com.ubedpathan.Nexora.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity extends BaseEntity {

    @Column(
            nullable = false,
            length = 35
    )
    private String username;

    @Column(
            nullable = false,
            length = 35
    )
    private String email;

    @Column(
            nullable = false
    )
    private String password;

    private String profileImageURL;
}
