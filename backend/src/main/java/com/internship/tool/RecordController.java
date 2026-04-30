package com.internship.tool;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.MediaType;
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
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/records")
@CrossOrigin("*")
public class RecordController {

    private final RecordRepository repo;

    public RecordController(RecordRepository repo) {
        this.repo = repo;
    }

    // =========================
    // GET ALL
    // =========================
    @GetMapping
    public List<Record> getRecords() {
        return repo.findAll();
    }

    // =========================
    // ADD
    // =========================
    @PostMapping
    public Record addRecord(@RequestBody Record record) {
        return repo.save(record);
    }

    // =========================
    // DELETE
    // =========================
    @DeleteMapping("/{id}")
    public String deleteRecord(@PathVariable Long id) {
        repo.deleteById(id);
        return "Deleted";
    }

    // =========================
    // UPDATE
    // =========================
    @PutMapping("/{id}")
    public Record updateRecord(@PathVariable Long id, @RequestBody Record updated) {
        return repo.findById(id)
                .map(r -> {
                    r.setTitle(updated.getTitle());
                    r.setLanguage(updated.getLanguage());
                    return repo.save(r);
                })
                .orElseThrow(() -> new RuntimeException("Record not found"));
    }

    // =========================
    // STATS
    // =========================
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
                    Map<String, Object> map = new HashMap<>();
                    map.put("language", e.getKey());
                    map.put("count", e.getValue());
                    return map;
                })
                .toList();
    }

    // =========================
    // SEARCH
    // =========================
    @GetMapping("/search")
    public List<Record> search(@RequestParam String q) {
        return repo.findAll().stream()
                .filter(r -> r.getTitle() != null &&
                        r.getTitle().toLowerCase().contains(q.toLowerCase()))
                .toList();
    }

    // =========================
    // FILTER
    // =========================
    @GetMapping("/filter")
    public List<Record> filter(@RequestParam String lang) {
        return repo.findAll().stream()
                .filter(r -> r.getLanguage() != null &&
                        r.getLanguage().equalsIgnoreCase(lang))
                .toList();
    }

    // =========================
    // EXPORT CSV
    // =========================
    @GetMapping("/export")
    public void exportCSV(HttpServletResponse response) throws IOException {

        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=records.csv");

        PrintWriter writer = response.getWriter();
        writer.println("ID,Title,Language");

        for (Record r : repo.findAll()) {
            writer.println(r.getId() + "," + r.getTitle() + "," + r.getLanguage());
        }

        writer.flush();
        writer.close();
    }

    // =========================
    // FILE UPLOAD
    // =========================
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String upload(@RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) return "File empty ❌";
        if (!file.getOriginalFilename().endsWith(".csv")) return "Only CSV ❌";

        return "Uploaded ✅";
    }
}