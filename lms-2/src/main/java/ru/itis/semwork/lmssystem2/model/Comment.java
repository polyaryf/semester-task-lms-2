package ru.itis.semwork.lmssystem2.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;

    private String userName;

    @ManyToOne()
    @JoinColumn(name = "comment_id", referencedColumnName = "id")
    private Lesson lesson;
}
