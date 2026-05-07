package com.internship.tool.controller;

import java.io.File;
import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:5173")
public class FileUploadController {

    private static final String UPLOAD_DIR =
            System.getProperty("user.dir") + "/uploads/";

    @PostMapping(
    value = "/upload",
    consumes = "multipart/form-data"
)
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file
    ) {

        try {

            // Validation
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("File is empty");
            }

            // Create uploads folder
            File directory = new File(UPLOAD_DIR);

            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Save file
            String filePath = UPLOAD_DIR + file.getOriginalFilename();

            file.transferTo(new File(filePath));

            return ResponseEntity.ok(
                    "File uploaded successfully: "
                    + file.getOriginalFilename()
            );

        } catch (IOException e) {

            return ResponseEntity.internalServerError()
                    .body("Upload failed");
        }
    }
}