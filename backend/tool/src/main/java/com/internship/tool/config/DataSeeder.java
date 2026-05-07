package com.internship.tool.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.internship.tool.entity.Record;
import com.internship.tool.repository.RecordRepository;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedDatabase(RecordRepository repository) {

        return args -> {

            // Prevent duplicate insert
            if (repository.count() == 0) {

                Record r1 = new Record();
                r1.setTitle("Task 1");
                r1.setDescription("Frontend Setup");
                r1.setStatus("NEW");

                Record r2 = new Record();
                r2.setTitle("Task 2");
                r2.setDescription("Backend API");
                r2.setStatus("IN_PROGRESS");

                Record r3 = new Record();
                r3.setTitle("Task 3");
                r3.setDescription("Swagger Integration");
                r3.setStatus("COMPLETED");

                Record r4 = new Record();
                r4.setTitle("Task 4");
                r4.setDescription("CSV Export");
                r4.setStatus("NEW");

                repository.save(r1);
                repository.save(r2);
                repository.save(r3);
                repository.save(r4);

                System.out.println("✅ Demo records inserted");
            }
        };
    }
}