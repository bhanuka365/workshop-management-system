package com.workshop.workshop._service.Service;

import com.workshop.workshop._service.dto.WorkshopRequest;
import com.workshop.workshop._service.dto.WorkshopResponse;

import java.util.List;

public interface WorkshopService {
    WorkshopResponse createWorkshop(WorkshopRequest request);

    WorkshopResponse updateWorkshop(Long id, WorkshopRequest request);

    List<WorkshopResponse> getAllWorkshops();

    WorkshopResponse getWorkshopById(Long id);
}
