package com.workshop.workshop._service.Service;

import com.workshop.workshop._service.Entity.User;
import com.workshop.workshop._service.Repository.UserRepository;
import com.workshop.workshop._service.dto.LoginRequest;
import com.workshop.workshop._service.dto.LoginResponse;
import com.workshop.workshop._service.dto.UserRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class UserServiceImpl implements UseService{
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
   private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;
    @Override
    public String registerUser(UserRequest request) {
        String email = request.getEmail()
                .trim()
                .toLowerCase();

        // Check whether the email already exists
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "Email already registered"
            );
        }

        // Create a new user
        User user = User.builder()
                .email(email)
                .password(
                        passwordEncoder.encode(request.getPassword())
                )
                .role(request.getRole())
                .enabled(true)
                .build();

        // Save user to database
        userRepository.save(user);

        return "User registered successfully";
    }

    @Override
    public LoginResponse loginUser(LoginRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        Optional<User> optionalUser = userRepository.findByEmail(email);

        User user = optionalUser.orElseThrow(() ->
                new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid email or password"
                )
        );

        if (!user.isEnabled()
                || !passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        String token = jwtService.generateToken(user);

        return new LoginResponse(
                "Login successful",
                token,
                "Bearer",
                user.getId(),
                user.getEmail(),
                user.getRole()
        );
    }
}

