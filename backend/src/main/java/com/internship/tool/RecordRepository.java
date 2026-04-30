package com.internship.tool;

import org.springframework.data.jpa.repository.JpaRepository;

// Repository for CRUD operations on Record entity
public interface RecordRepository extends JpaRepository<Record, Long> {
}