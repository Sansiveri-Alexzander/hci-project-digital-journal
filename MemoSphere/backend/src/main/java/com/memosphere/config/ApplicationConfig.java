// src/main/java/com/memosphere/config/ApplicationConfig.java
package main.java.com.memosphere.config;

import com.memosphere.repository.EntryRepository;
import com.memosphere.service.EntryService;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;

import javax.sql.DataSource;

@Configuration
public class ApplicationConfig {

    @Bean
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:sqlite:memosphere.db");
        config.setMaximumPoolSize(1); // SQLite supports only one connection

        HikariDataSource dataSource = new HikariDataSource(config);
        
        // Initialize schema
        ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
        populator.addScript(new ClassPathResource("schema.sql"));
        populator.execute(dataSource);
        
        return dataSource;
    }

    @Bean
    public EntryRepository entryRepository(DataSource dataSource) {
        return new EntryRepository(dataSource);
    }

    @Bean
    public EntryService entryService(EntryRepository entryRepository) {
        return new EntryService(entryRepository);
    }
}