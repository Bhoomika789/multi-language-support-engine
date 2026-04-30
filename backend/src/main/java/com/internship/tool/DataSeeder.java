package com.internship.tool;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedData(RecordRepository repo) {
        return args -> {

            // Insert demo data only if table is empty
            if (repo.count() == 0) {

                List<Record> records = List.of(
                        new Record("Hello World", "English"),
                        new Record("Hola Mundo", "Spanish"),
                        new Record("Bonjour", "French"),
                        new Record("Hallo Welt", "German"),
                        new Record("Ciao Mondo", "Italian"),
                        new Record("Olá Mundo", "Portuguese"),
                        new Record("Привет мир", "Russian"),
                        new Record("नमस्ते दुनिया", "Hindi"),
                        new Record("こんにちは", "Japanese"),
                        new Record("안녕하세요", "Korean"),
                        new Record("مرحبا", "Arabic"),
                        new Record("Hej världen", "Swedish"),
                        new Record("Merhaba", "Turkish"),
                        new Record("Salve mundi", "Latin"),
                        new Record("Selam dünya", "Azerbaijani")
                );

                repo.saveAll(records);
            }
        };
    }
}