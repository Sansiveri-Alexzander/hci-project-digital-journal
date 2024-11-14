// src/main/java/com/memosphere/repository/EntryRepository.java
package main.java.com.memosphere.repository;

import com.memosphere.model.Entry;
import com.memosphere.model.EntryType;

import javax.sql.DataSource;
import java.sql.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class EntryRepository {
    private final DataSource dataSource;

    public EntryRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public Entry save(Entry entry) {
        String sql = """
            INSERT INTO entries (id, type, content, date, title)
            VALUES (?, ?, ?, ?, ?)
            """;
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            conn.setAutoCommit(false);
            try {
                // Insert main entry
                stmt.setString(1, entry.getId());
                stmt.setString(2, entry.getType().name());
                stmt.setString(3, entry.getContent());
                stmt.setString(4, entry.getDate().toString());
                stmt.setString(5, entry.getTitle());
                stmt.executeUpdate();

                // Save feelings
                saveFeelings(conn, entry);

                // Save activities
                saveActivities(conn, entry);

                conn.commit();
                return entry;
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to save entry", e);
        }
    }

    private void saveFeelings(Connection conn, Entry entry) throws SQLException {
        String sql = "INSERT INTO entry_feelings (entry_id, feeling) VALUES (?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            for (String feeling : entry.getFeelings()) {
                stmt.setString(1, entry.getId());
                stmt.setString(2, feeling);
                stmt.addBatch();
            }
            stmt.executeBatch();
        }
    }

    private void saveActivities(Connection conn, Entry entry) throws SQLException {
        String sql = "INSERT INTO entry_activities (entry_id, activity) VALUES (?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            for (String activity : entry.getActivities()) {
                stmt.setString(1, entry.getId());
                stmt.setString(2, activity);
                stmt.addBatch();
            }
            stmt.executeBatch();
        }
    }

    public Optional<Entry> findById(String id) {
        String sql = """
            SELECT e.*, GROUP_CONCAT(DISTINCT f.feeling) as feelings,
            GROUP_CONCAT(DISTINCT a.activity) as activities
            FROM entries e
            LEFT JOIN entry_feelings f ON e.id = f.entry_id
            LEFT JOIN entry_activities a ON e.id = a.entry_id
            WHERE e.id = ?
            GROUP BY e.id
            """;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, id);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                return Optional.of(mapResultSetToEntry(rs));
            }
            return Optional.empty();
        } catch (SQLException e) {
            throw new RuntimeException("Failed to find entry", e);
        }
    }

    private Entry mapResultSetToEntry(ResultSet rs) throws SQLException {
        String feelings = rs.getString("feelings");
        String activities = rs.getString("activities");
        
        return new Entry(
            rs.getString("id"),
            EntryType.valueOf(rs.getString("type")),
            rs.getString("content"),
            Instant.parse(rs.getString("date")),
            rs.getString("title"),
            feelings != null ? List.of(feelings.split(",")) : new ArrayList<>(),
            activities != null ? List.of(activities.split(",")) : new ArrayList<>()
        );
    }

    public List<Entry> findAll() {
        String sql = """
            SELECT e.*, 
                   GROUP_CONCAT(DISTINCT f.feeling) as feelings,
                   GROUP_CONCAT(DISTINCT a.activity) as activities
            FROM entries e
            LEFT JOIN entry_feelings f ON e.id = f.entry_id
            LEFT JOIN entry_activities a ON e.id = a.entry_id
            GROUP BY e.id
            ORDER BY e.date DESC
            """;

        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            List<Entry> entries = new ArrayList<>();
            while (rs.next()) {
                entries.add(mapResultSetToEntry(rs));
            }
            return entries;
        } catch (SQLException e) {
            throw new RuntimeException("Failed to fetch entries", e);
        }
    }

    public void deleteById(String id) {
        String sql = "DELETE FROM entries WHERE id = ?";
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            conn.setAutoCommit(false);
            try {
                stmt.setString(1, id);
                int rowsAffected = stmt.executeUpdate();
                
                if (rowsAffected == 0) {
                    throw new IllegalArgumentException("Entry not found with id: " + id);
                }
                
                conn.commit();
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to delete entry", e);
        }
    }

    public List<Entry> search(String query) {
        String sql = """
            SELECT e.*, 
                   GROUP_CONCAT(DISTINCT f.feeling) as feelings,
                   GROUP_CONCAT(DISTINCT a.activity) as activities
            FROM entries e
            LEFT JOIN entry_feelings f ON e.id = f.entry_id
            LEFT JOIN entry_activities a ON e.id = a.entry_id
            WHERE LOWER(e.title) LIKE ? 
               OR LOWER(e.content) LIKE ?
               OR EXISTS (
                   SELECT 1 FROM entry_feelings 
                   WHERE entry_id = e.id 
                   AND LOWER(feeling) LIKE ?
               )
               OR EXISTS (
                   SELECT 1 FROM entry_activities 
                   WHERE entry_id = e.id 
                   AND LOWER(activity) LIKE ?
               )
            GROUP BY e.id
            ORDER BY e.date DESC
            """;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            String searchPattern = "%" + query + "%";
            stmt.setString(1, searchPattern);
            stmt.setString(2, searchPattern);
            stmt.setString(3, searchPattern);
            stmt.setString(4, searchPattern);

            try (ResultSet rs = stmt.executeQuery()) {
                List<Entry> entries = new ArrayList<>();
                while (rs.next()) {
                    entries.add(mapResultSetToEntry(rs));
                }
                return entries;
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to search entries", e);
        }
    }

    // Helper method for pagination if needed
    public List<Entry> findAll(int page, int pageSize) {
        String sql = """
            SELECT e.*, 
                   GROUP_CONCAT(DISTINCT f.feeling) as feelings,
                   GROUP_CONCAT(DISTINCT a.activity) as activities
            FROM entries e
            LEFT JOIN entry_feelings f ON e.id = f.entry_id
            LEFT JOIN entry_activities a ON e.id = a.entry_id
            GROUP BY e.id
            ORDER BY e.date DESC
            LIMIT ? OFFSET ?
            """;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, pageSize);
            stmt.setInt(2, (page - 1) * pageSize);
            
            try (ResultSet rs = stmt.executeQuery()) {
                List<Entry> entries = new ArrayList<>();
                while (rs.next()) {
                    entries.add(mapResultSetToEntry(rs));
                }
                return entries;
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to fetch paginated entries", e);
        }
    }
}