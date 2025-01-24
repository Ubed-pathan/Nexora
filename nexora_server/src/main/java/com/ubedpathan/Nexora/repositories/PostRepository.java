package com.ubedpathan.Nexora.repositories;

import com.ubedpathan.Nexora.models.PostEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<PostEntity, String> {
    List<PostEntity> findByUserEntityId(String userId);
}
