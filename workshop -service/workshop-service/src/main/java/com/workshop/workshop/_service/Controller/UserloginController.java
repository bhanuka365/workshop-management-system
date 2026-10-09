package com.workshop.workshop._service.Controller;

import com.workshop.workshop._service.Service.UseService;
import com.workshop.workshop._service.dto.LoginRequest;
import com.workshop.workshop._service.dto.LoginResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class UserloginController {
    @Autowired
    private UseService useService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(
            @Valid @RequestBody LoginRequest request
    ) {
        LoginResponse response = useService.loginUser(request);

        return ResponseEntity.ok(response);
    }
}
