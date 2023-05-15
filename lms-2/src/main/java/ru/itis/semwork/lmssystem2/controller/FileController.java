package ru.itis.semwork.lmssystem2.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ru.itis.semwork.lmssystem2.dto.FileDto;
import ru.itis.semwork.lmssystem2.service.FileService;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/v1/file")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @GetMapping("/lesson/{id}")
    @Operation(summary = "Getting the files related to lesson")
    public ResponseEntity<List<FileDto>> getByLessonId(@PathVariable(name = "id") Long id) {

        return ResponseEntity.ok(fileService.retrieveByLessonId(id));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Getting the file by id")
    public ResponseEntity<?> getFileById(@PathVariable(name = "id") Long id) throws UnsupportedEncodingException {

        FileDto file = fileService.retrieveByFileId(id);
        String fileName = String.format("%s.%s", file.getName(), file.getFormat());

        return ResponseEntity.ok()
                             .contentType(MediaType.APPLICATION_OCTET_STREAM)
                             .header(
                                     HttpHeaders.CONTENT_DISPOSITION,
                                     "attachment; filename=\"" + URLEncoder.encode(
                                             fileName,
                                             StandardCharsets.UTF_8.toString()
                                     ) + "\""
                             )
                             .body(file.getFile().toByteArray());
    }

    @PostMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    @Operation(summary = "Adding the file at lesson")
    public ResponseEntity<FileDto> addToLesson(@PathVariable(name = "id") Long lessonId,
                                               @RequestParam(name = "file") MultipartFile file) {
        return ResponseEntity.ok(fileService.addToLesson(lessonId, file.getOriginalFilename(), file.getContentType(), file));
    }

    @CrossOrigin(origins = "*", methods = {RequestMethod.DELETE})
    @DeleteMapping("/{id}")
    @Operation(summary = "Deleting the file")
    public ResponseEntity<FileDto> delete(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(fileService.delete(id));
    }
}
