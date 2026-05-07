package com.internship.tool.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
public class RecordControllerTest {

    @Autowired
    private MockMvc mockMvc;

    // =========================
    // GET ALL
    // =========================
    @Test
    void testGetAllRecords() throws Exception {

        mockMvc.perform(get("/api/records"))
                .andExpect(status().isOk());
    }

    // =========================
    // GET BY ID
    // =========================
    @Test
    void testGetRecordById() throws Exception {

        mockMvc.perform(get("/api/records/11"))
                .andExpect(status().isOk());
    }

    // =========================
    // CREATE
    // =========================
    @Test
    void testCreateRecord() throws Exception {

        String json = """
        {
            "title":"MockMvc Test",
            "description":"Testing create API",
            "status":"NEW"
        }
        """;

        mockMvc.perform(
                post("/api/records")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json)
        ).andExpect(status().isOk());
    }

    // =========================
    // UPDATE
    // =========================
    @Test
    void testUpdateRecord() throws Exception {

        String json = """
        {
            "title":"Updated",
            "description":"Updated Desc",
            "status":"COMPLETED"
        }
        """;

        mockMvc.perform(
                put("/api/records/11")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json)
        ).andExpect(status().isOk());
    }

    // =========================
    // DELETE
    // =========================
    @Test
    void testDeleteRecord() throws Exception {

        mockMvc.perform(delete("/api/records/11"))
                .andExpect(status().isOk());
    }

    // =========================
    // SEARCH
    // =========================
    @Test
    void testSearchRecord() throws Exception {

        mockMvc.perform(get("/api/records/search?q=Task"))
                .andExpect(status().isOk());
    }
}