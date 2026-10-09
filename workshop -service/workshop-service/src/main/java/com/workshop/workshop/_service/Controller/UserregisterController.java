package com.workshop.workshop._service.Controller;

import com.workshop.workshop._service.Service.UseService;
import com.workshop.workshop._service.dto.UserRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class UserregisterController {
    @Autowired
    private UseService useService;

    @PostMapping("/register")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> registerUser(
            @Valid @RequestBody UserRequest request
    ) {
        String response = useService.registerUser(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

}
