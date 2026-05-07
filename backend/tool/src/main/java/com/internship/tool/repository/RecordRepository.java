package com.internship.tool.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.internship.tool.entity.Record;

@Repository
public interface RecordRepository extends JpaRepository<Record, Long> {

    // 🔍 SEARCH (used in /records/search?q=...)
    
    List<Record> findByTitleContainingIgnoreCase(String title);
    

}