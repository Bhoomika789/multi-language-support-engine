package com.internship.tool;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/records")
@CrossOrigin("*")
public class RecordController {

    private final RecordRepository repo;

    public RecordController(RecordRepository repo) {
        this.repo = repo;
    }

    // AUTH
    private void validateRequest(String header) {
        if (header == null || !header.startsWith("Bearer ")) {
            throw new RuntimeException("Missing token");
        }
        String token = header.substring(7);
        JwtUtil.validateToken(token);
    }

    // GET ALL
    @GetMapping
    public List<Record> getRecords(@RequestHeader("Authorization") String authHeader) {
        validateRequest(authHeader);
        return repo.findAll();
    }

    // ADD
    @PostMapping
    public Record addRecord(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Record record) {

        validateRequest(authHeader);
        return repo.save(record);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteRecord(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {

        validateRequest(authHeader);
        repo.deleteById(id);
        return "Deleted";
    }

    // UPDATE
    @PutMapping("/{id}")
    public Record updateRecord(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody Record updated) {

        validateRequest(authHeader);

        return repo.findById(id).map(r -> {
            r.setTitle(updated.getTitle());
            r.setLanguage(updated.getLanguage());
            return repo.save(r);
        }).orElseThrow(() -> new RuntimeException("Record not found"));
    }

    // 📊 STATS
    @GetMapping("/stats")
    public List<Map<String, Object>> getStats() {
        List<Record> records = repo.findAll();

        Map<String, Long> counts = records.stream()
            .collect(Collectors.groupingBy(
                r -> r.getLanguage().toLowerCase(),
                Collectors.counting()
            ));

        return counts.entrySet().stream()
            .map(e -> {
                Map<String, Object> m = new HashMap<>();
                m.put("language", e.getKey());
                m.put("count", e.getValue());
                return m;
            })
            .toList();
    }

    // EXPORT CSV
    @GetMapping("/export")
    public void exportCSV(
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) throws IOException {

        validateRequest(authHeader);

        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=records.csv");

        PrintWriter writer = response.getWriter();
        writer.println("ID,Title,Language");

        for (Record r : repo.findAll()) {
            writer.println(r.getId() + "," + r.getTitle() + "," + r.getLanguage());
        }

        writer.close();
    }
}