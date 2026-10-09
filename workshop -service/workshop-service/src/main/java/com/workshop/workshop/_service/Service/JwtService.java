package com.workshop.workshop._service.Service;

import com.workshop.workshop._service.Entity.User;

public interface JwtService {
    String generateToken(User user);
    boolean isTokenValid(String token);

    String extractEmail(String token);

    String extractRole(String token);
}
