package com.ubedpathan.Nexora.repositories;

import com.ubedpathan.Nexora.models.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {
    Optional<UserEntity> findByEmail(String s);
    Optional<UserEntity> findByUsername(String s);

}
