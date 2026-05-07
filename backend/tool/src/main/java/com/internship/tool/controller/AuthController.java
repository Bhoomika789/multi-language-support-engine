package com.internship.tool.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.internship.tool.entity.User;
import com.internship.tool.repository.UserRepository;
import com.internship.tool.security.JwtUtil;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173") // 🔥 restrict to frontend
public class AuthController {

    private final UserRepository userRepo;
    private final JwtUtil jwtUtil;

    // ✅ Constructor Injection
    public AuthController(UserRepository userRepo, JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.jwtUtil = jwtUtil;
    }

    // ===========================
    // ✅ REGISTER
    // ===========================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        // 🔒 Validation
        if (user.getUsername() == null || user.getUsername().isBlank()
                || user.getPassword() == null || user.getPassword().isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Username and password are required"));
        }

        // ❗ Check duplicate
        if (userRepo.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Username already exists"));
        }

        userRepo.save(user);

        return ResponseEntity.ok(
                Map.of("message", "User registered successfully")
        );
    }

    // ===========================
    // ✅ LOGIN
    // ===========================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        // 🔒 Validation
        if (user.getUsername() == null || user.getUsername().isBlank()
                || user.getPassword() == null || user.getPassword().isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Username and password are required"));
        }

        // 🔍 Find user
        User existing = userRepo.findByUsername(user.getUsername())
                .orElse(null);

        if (existing == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        // 🔑 Check password
        if (!existing.getPassword().equals(user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid password"));
        }

        // 🔥 Generate JWT
        String token = jwtUtil.generateToken(existing.getUsername());

        // ✅ Return JSON
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("username", existing.getUsername());

        return ResponseEntity.ok(response);
    }
}