package com.internship.tool;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(RecordController.class)
public class RecordControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // =========================
    // GET ALL
    // =========================
    @Test
    void testGetAllRecords() throws Exception {
        mockMvc.perform(get("/api/records"))
                .andExpect(status().isOk());
    }

    // =========================
    // ADD RECORD
    // =========================
    @Test
    void testAddRecord() throws Exception {

        Map<String, String> record = Map.of(
                "title", "Test Title",
                "language", "English"
        );

        mockMvc.perform(post("/api/records")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(record)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Title"));
    }

    // =========================
    // UPDATE RECORD
    // =========================
    @Test
    void testUpdateRecord() throws Exception {

        Map<String, String> record = Map.of(
                "title", "Updated",
                "language", "Spanish"
        );

        mockMvc.perform(put("/api/records/1")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(record)))
                .andExpect(status().isOk());
    }

    // =========================
    // DELETE RECORD
    // =========================
    @Test
    void testDeleteRecord() throws Exception {

        mockMvc.perform(delete("/api/records/1"))
                .andExpect(status().isOk());
    }

    // =========================
    // SEARCH
    // =========================
    @Test
    void testSearch() throws Exception {

        mockMvc.perform(get("/api/records/search?q=Hello"))
                .andExpect(status().isOk());
    }

    // =========================
    // FILTER
    // =========================
    @Test
    void testFilter() throws Exception {

        mockMvc.perform(get("/api/records/filter?lang=English"))
                .andExpect(status().isOk());
    }

    // =========================
    // STATS
    // =========================
    @Test
    void testStats() throws Exception {

        mockMvc.perform(get("/api/records/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").exists())
                .andExpect(jsonPath("$.english").exists());
    }

    // =========================
    // AI ENDPOINT
    // =========================
    @Test
    void testAI() throws Exception {

        Map<String, String> input = Map.of(
                "title", "AI Test",
                "language", "English"
        );

        mockMvc.perform(post("/api/records/ai/describe")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").exists())
                .andExpect(jsonPath("$.generated_at").exists());
    }
}