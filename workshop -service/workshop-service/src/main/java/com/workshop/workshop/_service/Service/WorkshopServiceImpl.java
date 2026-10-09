
package com.workshop.workshop._service.Service;

import com.workshop.workshop._service.Entity.Workshop;
import com.workshop.workshop._service.Repository.WorkshopRepository;
import com.workshop.workshop._service.dto.WorkshopRequest;
import com.workshop.workshop._service.dto.WorkshopResponse;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WorkshopServiceImpl implements WorkshopService {

        private final WorkshopRepository workshopRepository;

        public WorkshopServiceImpl(WorkshopRepository workshopRepository) {
                this.workshopRepository = workshopRepository;
        }

        // CREATE WORKSHOP
        @Override
        @Transactional
        public WorkshopResponse createWorkshop(WorkshopRequest request) {

                validateWorkshop(request);

                Workshop workshop = Workshop.builder()
                        .title(request.getTitle())
                        .description(request.getDescription())
                        .location(request.getLocation())
                        .startDateTime(request.getStartDateTime())
                        .endDateTime(request.getEndDateTime())
                        .capacity(request.getCapacity())
                        .status(request.getStatus())
                        .build();

                Workshop savedWorkshop = workshopRepository.save(workshop);

                return toResponse(
                        savedWorkshop,
                        "Workshop created successfully"
                );
        }

        // UPDATE WORKSHOP
        @Override
        @Transactional
        public WorkshopResponse updateWorkshop(
                Long id,
                WorkshopRequest request
        ) {
                Workshop workshop = workshopRepository.findById(id)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Workshop not found with ID: " + id
                        ));

                validateWorkshop(request);

                workshop.setTitle(request.getTitle());
                workshop.setDescription(request.getDescription());
                workshop.setLocation(request.getLocation());
                workshop.setStartDateTime(request.getStartDateTime());
                workshop.setEndDateTime(request.getEndDateTime());
                workshop.setCapacity(request.getCapacity());
                workshop.setStatus(request.getStatus());

                Workshop updatedWorkshop =
                        workshopRepository.save(workshop);

                return toResponse(
                        updatedWorkshop,
                        "Workshop updated successfully"
                );
        }

        // GET ALL WORKSHOPS
        @Override
        @Transactional(readOnly = true)
        public List<WorkshopResponse> getAllWorkshops() {

                return workshopRepository.findAll()
                        .stream()
                        .map(workshop -> toResponse(
                                workshop,
                                "Success"
                        ))
                        .toList();
        }

        // GET WORKSHOP BY ID
        @Override
        @Transactional(readOnly = true)
        public WorkshopResponse getWorkshopById(Long id) {

                Workshop workshop = workshopRepository.findById(id)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Workshop not found with ID: " + id
                        ));

                return toResponse(workshop, "Success");
        }

        // VALIDATE WORKSHOP DETAILS
        private void validateWorkshop(WorkshopRequest request) {

                LocalDateTime start = request.getStartDateTime();
                LocalDateTime end = request.getEndDateTime();

                if (start == null || end == null) {
                        throw new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "Workshop start and end times are required"
                        );
                }

                if (!end.isAfter(start)) {
                        throw new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "End time must be after start time"
                        );
                }

                if (start.isBefore(LocalDateTime.now())) {
                        throw new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "Workshop must start in the future"
                        );
                }

                if (request.getCapacity() == null
                        || request.getCapacity() < 1) {
                        throw new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "Workshop capacity must be at least 1"
                        );
                }

                if (request.getStatus() == null) {
                        throw new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "Workshop status is required"
                        );
                }
        }

        // CONVERT ENTITY TO RESPONSE DTO
        private WorkshopResponse toResponse(
                Workshop workshop,
                String message
        ) {
                return WorkshopResponse.builder()
                        .message(message)
                        .id(workshop.getId())
                        .title(workshop.getTitle())
                        .description(workshop.getDescription())
                        .location(workshop.getLocation())
                        .startDateTime(workshop.getStartDateTime())
                        .endDateTime(workshop.getEndDateTime())
                        .capacity(workshop.getCapacity())
                        .status(workshop.getStatus())
                        .build();
        }
}