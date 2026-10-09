
package com.workshop.workshop._service.dto;

import com.workshop.workshop._service.Enum.WorkshopStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class WorkshopRequest {

    @NotBlank
    @Size(max = 150)
    private String title;

    @Size(max = 2000)
    private String description;

    @NotBlank
    @Size(max = 200)
    private String location;

    @NotNull
    @Future
    private LocalDateTime startDateTime;

    @NotNull
    private LocalDateTime endDateTime;

    @NotNull
    @Min(1)
    private Integer capacity;

    @NotNull
    private WorkshopStatus status;
}