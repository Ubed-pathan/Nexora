package com.ubedpathan.Nexora.repositories;

import com.ubedpathan.Nexora.models.UserEntity;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {
    Optional<UserEntity> findByEmail(String s);
    Optional<UserEntity> findByUsername(String s);

    List<UserEntity> findByUsernameContainingIgnoreCase(String query);

    List<UserEntity> findAllByUsernameNot(String s);

    @Query("SELECT u FROM UserEntity u WHERE u.id NOT IN :excludedIds ORDER BY FUNCTION('RANDOM')")
    List<UserEntity> findRandomUsersExcludingIds(
            @Param("excludedIds") Set<String> excludedIds,
            Pageable pageable
    );

    Optional<UserEntity> findByUsernameOrEmail(@NotBlank(message = "Username is mandatory") String username, @NotBlank(message = "Email is mandatory") @Email(message = "Email should be valid") String email);
}
