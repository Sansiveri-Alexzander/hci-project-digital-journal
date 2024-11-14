// src/main/java/com/memosphere/service/EntryService.java
package com.memosphere.service;

import com.memosphere.model.Entry;
import com.memosphere.repository.EntryRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public class EntryService {
    private final EntryRepository entryRepository;

    public EntryService(EntryRepository entryRepository) {
        this.entryRepository = entryRepository;
    }

    public Entry createEntry(Entry entry) {
        // Generate UUID for new entry if not provided
        if (entry.getId() == null || entry.getId().isEmpty()) {
            entry = new Entry(
                UUID.randomUUID().toString(),
                entry.getType(),
                entry.getContent(),
                Instant.now(),
                entry.getTitle(),
                entry.getFeelings(),
                entry.getActivities()
            );
        }
        return entryRepository.save(entry);
    }

    public Optional<Entry> getEntry(String id) {
        return entryRepository.findById(id);
    }

    public List<Entry> searchEntries(String query) {
        if (query == null || query.trim().isEmpty()) {
            return entryRepository.findAll();
        }
        return entryRepository.search(query.toLowerCase());
    }

    public List<Entry> getAllEntries() {
        return entryRepository.findAll();
    }

    public void deleteEntry(String id) {
        entryRepository.deleteById(id);
    }

    public Entry updateEntry(String id, Entry updatedEntry) {
        Optional<Entry> existingEntry = entryRepository.findById(id);
        if (existingEntry.isEmpty()) {
            throw new IllegalArgumentException("Entry not found with id: " + id);
        }

        Entry entry = new Entry(
            id,
            updatedEntry.getType(),
            updatedEntry.getContent(),
            existingEntry.get().getDate(), // Preserve original date
            updatedEntry.getTitle(),
            updatedEntry.getFeelings(),
            updatedEntry.getActivities()
        );

        return entryRepository.save(entry);
    }
}