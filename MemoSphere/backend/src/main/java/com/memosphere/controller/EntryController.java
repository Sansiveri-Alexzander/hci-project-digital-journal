// src/main/java/com/memosphere/controller/EntryController.java
package main.java.com.memosphere.controller;

import com.memosphere.model.Entry;
import com.memosphere.service.EntryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entries")
@CrossOrigin(origins = "http://localhost:5173") // Frontend dev server
public class EntryController {
    private final EntryService entryService;

    public EntryController(EntryService entryService) {
        this.entryService = entryService;
    }

    @PostMapping
    public ResponseEntity<Entry> createEntry(@RequestBody Entry entry) {
        return ResponseEntity.ok(entryService.createEntry(entry));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Entry> getEntry(@PathVariable String id) {
        return entryService.getEntry(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Entry>> searchEntries(@RequestParam String query) {
        return ResponseEntity.ok(entryService.searchEntries(query));
    }

    @GetMapping
    public ResponseEntity<List<Entry>> getAllEntries() {
        return ResponseEntity.ok(entryService.getAllEntries());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable String id) {
        entryService.deleteEntry(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Entry> updateEntry(
            @PathVariable String id,
            @RequestBody Entry entry) {
        return ResponseEntity.ok(entryService.updateEntry(id, entry));
    }
}