// src/main/java/com/memosphere/config/DatabaseConfig.java
package main.java.com.memosphere.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;

public class DatabaseConfig {
    private static final String DB_PATH = "memosphere.db";
    private static final HikariDataSource dataSource;

    static {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:sqlite:" + DB_PATH);
        config.setMaximumPoolSize(1); // SQLite supports only one connection
        
        dataSource = new HikariDataSource(config);
        initializeDatabase();
    }

    private static void initializeDatabase() {
        try (Connection conn = dataSource.getConnection()) {
            String schema = Files.readString(Path.of("src/main/resources/schema.sql"));
            conn.createStatement().execute(schema);
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize database", e);
        }
    }

    public static DataSource getDataSource() {
        return dataSource;
    }
}