package com.workshop.workshop._service.Service;

import com.workshop.workshop._service.dto.LoginRequest;
import com.workshop.workshop._service.dto.LoginResponse;
import com.workshop.workshop._service.dto.UserRequest;

public interface UseService {
    String registerUser(UserRequest request);

    LoginResponse loginUser(LoginRequest request);
}
