package com.ubedpathan.Nexora.repositories;

import com.ubedpathan.Nexora.models.CommentEntity;
import com.ubedpathan.Nexora.models.PostEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, String> {
    List<CommentEntity> post(PostEntity post);

    List<CommentEntity> findByPost(PostEntity postEntity);
}
