package com.internship.tool.controller;

import java.io.PrintWriter;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.internship.tool.entity.Record;
import com.internship.tool.repository.RecordRepository;
import com.internship.tool.service.EmailService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/records")
@CrossOrigin(origins = "http://localhost:5173")
public class RecordController {

    private final RecordRepository repository;
    private final EmailService emailService;

    public RecordController(
            RecordRepository repository,
            EmailService emailService
    ) {
        this.repository = repository;
        this.emailService = emailService;
    }

    // ===========================
    // ✅ GET ALL
    // ===========================
    @GetMapping
    public List<Record> getAll() {
        return repository.findAll();
    }

    // ===========================
    // ✅ GET BY ID
    // ===========================
    @GetMapping("/{id}")
    public Record getById(@PathVariable Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Record not found"));
    }

    // ===========================
    // ✅ CREATE
    // ===========================
    @PostMapping
    public Record create(@RequestBody Record record) {

        if (record.getStatus() == null ||
            record.getStatus().isBlank()) {

            record.setStatus("NEW");
        }

        Record savedRecord = repository.save(record);

        // ✅ SEND EMAIL
        emailService.sendEmail(
                "tool85demo@gmail.com",
                "New Record Created",
                "Record added: " + savedRecord.getTitle()
        );

        return savedRecord;
    }

    // ===========================
    // ✅ UPDATE
    // ===========================
    @PutMapping("/{id}")
    public Record update(
            @PathVariable Long id,
            @RequestBody Record updated
    ) {

        Record existing = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Record not found"));

        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setStatus(updated.getStatus());

        return repository.save(existing);
    }

    // ===========================
    // ✅ DELETE
    // ===========================
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {

        if (!repository.existsById(id)) {
            throw new RuntimeException("Record not found");
        }

        repository.deleteById(id);

        return "Deleted";
    }

    // ===========================
    // ✅ SEARCH
    // ===========================
    @GetMapping("/search")
    public List<Record> search(
            @RequestParam(required = false) String q
    ) {

        if (q == null || q.isBlank()) {
            return repository.findAll();
        }

        return repository.findByTitleContainingIgnoreCase(q);
    }

    // ===========================
    // ✅ PAGINATION
    // ===========================
    @GetMapping("/paged")
    public Page<Record> paged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        return repository.findAll(
                PageRequest.of(page, size, sort)
        );
    }

    // ===========================
    // ✅ EXPORT CSV
    // ===========================
    @GetMapping("/export")
    public void exportCsv(
            HttpServletResponse response
    ) throws Exception {

        response.setContentType("text/csv");

        response.setHeader(
                "Content-Disposition",
                "attachment; filename=records.csv"
        );

        List<Record> records = repository.findAll();

        PrintWriter writer = response.getWriter();

        // CSV Header
        writer.println("ID,Title,Description,Status");

        // CSV Data
        for (Record r : records) {

            writer.println(
                    r.getId() + "," +
                    r.getTitle() + "," +
                    r.getDescription() + "," +
                    r.getStatus()
            );
        }

        writer.flush();
        writer.close();
    }
}