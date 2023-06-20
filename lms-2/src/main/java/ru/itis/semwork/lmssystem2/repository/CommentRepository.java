package ru.itis.semwork.lmssystem2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.itis.semwork.lmssystem2.model.Comment;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findCommentsByLesson();
}
