package com.workshop.workshop._service.Config;

import com.workshop.workshop._service.Enum.Role;
import com.workshop.workshop._service.Entity.User;
import com.workshop.workshop._service.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminSeeder {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner createAdminUser() {
        return args -> {
            String email = "admin@example.com";

            if (userRepository.existsByEmail(email)) {
                System.out.println("Admin user already exists.");
                return;
            }

            User admin = new User();
            admin.setEmail(email);
            admin.setPassword(
                    passwordEncoder.encode("Admin@12345")
            );
            admin.setRole(Role.ADMIN);

            userRepository.save(admin);

            System.out.println("Default admin user created successfully.");
            System.out.println("Email: " + email);
            System.out.println("Password: Admin@12345");
        };
    }
}