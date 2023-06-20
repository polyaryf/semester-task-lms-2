package ru.itis.semwork.lmssystem2.advice;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import ru.itis.semwork.lmssystem2.dto.ExceptionDto;

@ControllerAdvice
@Slf4j
public class RestExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionDto> handleError(Exception e) {
        log.error(e.getMessage());
        return ResponseEntity.badRequest()
                             .body(ExceptionDto.builder()
                                               .message(e.getLocalizedMessage())
                                               .build());
    }
}