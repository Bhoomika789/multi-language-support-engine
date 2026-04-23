package com.internship.tool;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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