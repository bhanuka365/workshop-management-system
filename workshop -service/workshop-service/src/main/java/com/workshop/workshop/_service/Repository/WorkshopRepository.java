package com.workshop.workshop._service.Repository;


import com.workshop.workshop._service.Entity.Workshop;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkshopRepository
        extends JpaRepository<Workshop, Long> {
}
