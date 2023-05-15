package ru.itis.semwork.lmssystem2.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.itis.semwork.lmssystem2.dto.UserDto;
import ru.itis.semwork.lmssystem2.form.UserForm;
import ru.itis.semwork.lmssystem2.service.UserService;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/v1/reg")
@RequiredArgsConstructor
public class RegisterController {


    private final UserService userService;

    @PostMapping
    @Operation(summary = "Adding the user")
    public ResponseEntity<UserDto> add(@Valid @RequestBody UserForm userForm) {
        return ResponseEntity.ok(userService.register(userForm));
    }

}
