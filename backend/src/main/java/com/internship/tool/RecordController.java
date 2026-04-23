package com.internship.tool;

import java.util.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/records")
@CrossOrigin
public class RecordController {

    private List<Map<String, String>> list = new ArrayList<>();

    @GetMapping
    public List<Map<String, String>> getRecords() {
        if (list.isEmpty()) {
            Map<String, String> data = new HashMap<>();
            data.put("title", "Hello World");
            data.put("language", "English");
            list.add(data);
        }
        return list;
    }

    @PostMapping
    public Map<String, String> addRecord(@RequestBody Map<String, String> newData) {
        list.add(newData);
        return newData;
    }
}