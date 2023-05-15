package ru.itis.semwork.lmssystem2.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.io.ByteArrayOutputStream;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@EqualsAndHashCode
public class FileDto {

    private Long id;

    private String name;

    private ByteArrayOutputStream file;

    private String format;

    private String state;
}
