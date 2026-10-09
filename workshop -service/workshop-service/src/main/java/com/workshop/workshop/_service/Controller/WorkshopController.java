package com.workshop.workshop._service.Controller;

import com.workshop.workshop._service.Service.WorkshopService;
import com.workshop.workshop._service.dto.WorkshopRequest;
import com.workshop.workshop._service.dto.WorkshopResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/workshops")
public class WorkshopController {

    @Autowired
    private WorkshopService workshopService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('MANAGER')")
    public WorkshopResponse createWorkshop(
            @Valid @RequestBody WorkshopRequest request) {
        return workshopService.createWorkshop(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public WorkshopResponse updateWorkshop(
            @PathVariable Long id,
            @Valid @RequestBody WorkshopRequest request) {
        return workshopService.updateWorkshop(id, request);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER','STAFF')")
    public List<WorkshopResponse> getAllWorkshops() {
        return workshopService.getAllWorkshops();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER','STAFF')")
    public WorkshopResponse getWorkshopById(@PathVariable Long id) {
        return workshopService.getWorkshopById(id);
    }
}