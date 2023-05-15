package ru.itis.semwork.lmssystem2.service.impl;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.itis.semwork.lmssystem2.dto.TokenDto;
import ru.itis.semwork.lmssystem2.dto.UserDto;
import ru.itis.semwork.lmssystem2.form.UserForm;
import ru.itis.semwork.lmssystem2.model.Lesson;
import ru.itis.semwork.lmssystem2.model.User;
import ru.itis.semwork.lmssystem2.model.enums.UserState;
import ru.itis.semwork.lmssystem2.redis.services.RedisUsersService;
import ru.itis.semwork.lmssystem2.repository.LessonRepository;
import ru.itis.semwork.lmssystem2.repository.UserRepository;
import ru.itis.semwork.lmssystem2.service.UserService;
import ru.itis.semwork.lmssystem2.service.mapper.UserMapper;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final Algorithm algorithm;

    private final UserMapper mapper;

    private final RedisUsersService redisUsersService;
    private final PasswordEncoder passwordEncoder;
    private final LessonRepository lessonRepository;

    @Override
    @Transactional
    public UserDto register(UserForm userForm) {
        LocalDateTime now = LocalDateTime.now();

        User user = mapper.mapToUser(userForm);

        user.setState(UserState.ACTIVE);
        user.setCreatedDate(now);
        user.setUpdateDate(now);

        user = userRepository.save(user);

        return mapper.mapToUserDto(user);
    }

    @Override
    public TokenDto login(UserForm userForm) {
        User user = userRepository.findByEmail(userForm.getEmail())
                                  .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        if (passwordEncoder.matches(userForm.getPassword(), user.getPassword())) {
            String token = JWT.create()
                              .withSubject(user.getId().toString())
                              .withClaim("role", user.getRole().toString())
                              .withClaim("state", user.getState().toString())
                              .withClaim("email", user.getEmail())
                              .withClaim("createdAt", LocalDateTime.now().toString())
                              .sign(algorithm);
            redisUsersService.addTokenToUser(user, token);
            return TokenDto.builder()
                           .id(user.getRedisId())
                           .userId(user.getId())
                           .token(token)
                           .login(user.getEmail())
                           .telegramAlias(user.getTgAlias())
                           .name(user.getFirstName())
                           .role(user.getRole().toString())
                           .build();
        } else {
            throw new UsernameNotFoundException("Invalid username or password");
        }
    }

    @Override
    @Transactional
    public UserDto edit(Long id, UserForm userForm) {
        User user = userRepository.findById(id)
                                  .orElseThrow(() -> new IllegalStateException("Cannot find the user"));

        user.setEmail(userForm.getEmail());
        user.setPassword(userForm.getPassword() != null ? passwordEncoder.encode(userForm.getPassword()) : null);
        user.setFirstName(userForm.getFirstName());
        user.setLastName(userForm.getLastName());
        user.setProfilePhoto(userForm.getProfilePhoto());
        user.setTgAlias(userForm.getTgAlias());
        user.setSince(userForm.getSince());
        user.setUpdateDate(LocalDateTime.now());

        user = userRepository.save(user);

        return mapper.mapToUserDto(user);
    }

    @Override
    @Transactional
    public UserDto delete(Long id) {
        User user = userRepository.findById(id)
                                  .orElseThrow(() -> new IllegalStateException("Cannot find by id"));

        user.setState(UserState.ARCHIVED);

        user = userRepository.save(user);

        return mapper.mapToUserDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getAll() {
        List<User> users = userRepository.findAllByState(UserState.ACTIVE)
                                         .orElse(new ArrayList<>());

        return mapper.mapToUserDto(users);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getById(Long id) {
        User user = userRepository.findById(id)
                                  .orElseThrow(() -> new IllegalStateException("Cannot find by id"));
        return mapper.mapToUserDto(user);
    }

    @Override
    @Transactional
    public UserDto addUserLesson(Long userId, Long lessonId) {

        User user = userRepository.findById(userId)
                                  .orElseThrow(() -> new IllegalStateException("Cannot find user by id"));

        Lesson lesson = lessonRepository.findById(lessonId)
                                        .orElseThrow(() -> new IllegalStateException("Cannot find user by id"));

        List<Lesson> lessons = user.getLessons();

        if (!Objects.equals(lesson.getCreatorId(), userId)) {
            if (lessons == null) {
                lessons = new ArrayList<>();
            }

            lessons.add(lesson);

            userRepository.save(user);
        }

        return mapper.mapToUserDto(user);
    }

    @Override
    @Transactional
    public UserDto removeFromLesson(Long userId, Long lessonId) {
        User user = userRepository.findById(userId)
                                  .orElseThrow(() -> new IllegalStateException("Cannot find user by id"));

        Lesson lesson = lessonRepository.findById(lessonId)
                                        .orElseThrow(() -> new IllegalStateException("Cannot find user by id"));

        List<Lesson> lessons = user.getLessons();

        if (lessons != null) {
            lessons.remove(lesson);
            userRepository.save(user);
        }

        return mapper.mapToUserDto(user);

    }

    @Override
    @Transactional
    public List<UserDto> findUsersByLessonId(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                                         .orElseThrow(() -> new IllegalStateException("Cannot find lesson by id"));
        List<User> users = lesson.getUsers();

        return mapper.mapToUserDto(users);
    }
}
