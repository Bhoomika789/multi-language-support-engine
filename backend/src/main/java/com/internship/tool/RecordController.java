package com.internship.tool;

import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
@CrossOrigin
public class RecordController {

    private List<Map<String, Object>> list = new ArrayList<>();
    private int idCounter = 1;

    // =========================
    // GET ALL
    // =========================
    @GetMapping
    public List<Map<String, Object>> getRecords() {

        if (list.isEmpty()) {
            Map<String, Object> data = new HashMap<>();
            data.put("id", idCounter++);
            data.put("title", "Hello World");
            data.put("language", "English");
            list.add(data);
        }

        return list;
    }

    // =========================
    // ADD
    // =========================
    @PostMapping
    public Map<String, Object> addRecord(@RequestBody Map<String, Object> newData) {

        newData.put("id", idCounter++);
        list.add(newData);

        return newData;
    }

    // =========================
    // DELETE
    // =========================
    @DeleteMapping("/{id}")
    public String deleteRecord(@PathVariable int id) {

        list.removeIf(item -> (int) item.get("id") == id);
        return "Deleted";
    }

    // =========================
    // UPDATE
    // =========================
    @PutMapping("/{id}")
    public Map<String, Object> updateRecord(
            @PathVariable int id,
            @RequestBody Map<String, Object> updatedData) {

        for (Map<String, Object> item : list) {
            if ((int) item.get("id") == id) {
                item.put("title", updatedData.get("title"));
                item.put("language", updatedData.get("language"));
                return item;
            }
        }
        return Collections.emptyMap();
    }

    // =========================
    // STATS
    // =========================
    @GetMapping("/stats")
    public Map<String, Integer> getStats() {

        int total = list.size();
        int english = 0;

        for (Map<String, Object> item : list) {
            String lang = (String) item.get("language");

            if (lang != null && lang.equalsIgnoreCase("english")) {
                english++;
            }
        }

        Map<String, Integer> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("english", english);

        return stats;
    }

    // =========================
    // SEARCH
    // =========================
    @GetMapping("/search")
    public List<Map<String, Object>> searchRecords(@RequestParam String q) {

        List<Map<String, Object>> result = new ArrayList<>();

        for (Map<String, Object> item : list) {
            String title = (String) item.get("title");

            if (title != null && title.toLowerCase().contains(q.toLowerCase())) {
                result.add(item);
            }
        }

        return result;
    }

    // =========================
    // FILTER
    // =========================
    @GetMapping("/filter")
    public List<Map<String, Object>> filterByLanguage(@RequestParam String lang) {

        List<Map<String, Object>> result = new ArrayList<>();

        for (Map<String, Object> item : list) {
            String language = (String) item.get("language");

            if (language != null && language.equalsIgnoreCase(lang)) {
                result.add(item);
            }
        }

        return result;
    }

    // =========================
    // 🤖 AI (Day 8)
    // =========================
    @PostMapping("/ai/describe")
    public Map<String, Object> generateAI(@RequestBody Map<String, String> input) {

        String title = input.get("title");
        String language = input.get("language");

        Map<String, Object> response = new HashMap<>();
       response.put("description",
    "This content titled '" + title + "' is written in " +
    language.substring(0,1).toUpperCase() + language.substring(1).toLowerCase() +
    ". It is processed using AI to enhance multilingual understanding.");
        response.put("generated_at", LocalDateTime.now());

        return response;
    }
    // =========================
@GetMapping("/export")
public void exportCSV(HttpServletResponse response) throws Exception {

    response.setContentType("text/csv");
    response.setHeader("Content-Disposition", "attachment; filename=records.csv");

    PrintWriter writer = response.getWriter();

    // Header
    writer.println("ID,Title,Language");

    // Data
    for (Map<String, Object> item : list) {
        writer.println(
            item.get("id") + "," +
            item.get("title") + "," +
            item.get("language")
        );
    }

    writer.flush();
    writer.close();
}
// =========================
// FILE UPLOAD
// =========================
@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public String uploadFile(@RequestParam("file") MultipartFile file) {

    if (file.isEmpty()) {
        return "File is empty ❌";
    }

    if (file.getOriginalFilename() == null || 
    !file.getOriginalFilename().endsWith(".csv")) {
    return "Only CSV files allowed ❌";
}

    if (file.getSize() > 1024 * 1024) {
        return "File too large ❌";
    }

    return "File uploaded successfully: " + file.getOriginalFilename();
}
}
