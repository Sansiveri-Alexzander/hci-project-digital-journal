// src/main/java/com/memosphere/model/Entry.java
package main.java.com.memosphere.model;

import java.time.Instant;
import java.util.List;

public class Entry {
    private String id;
    private EntryType type;
    private String content;
    private Instant date;
    private String title;
    private List<Feeling> feelings;
    private List<Activity> activities;

    // Constructor
    public Entry(String id, EntryType type, String content, Instant date, 
                String title, List<Feeling> feelings, List<Activity> activities) {
        this.id = id;
        this.type = type;
        this.content = content;
        this.date = date;
        this.title = title;
        this.feelings = feelings;
        this.activities = activities;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public EntryType getType() {
        return type;
    }

    public void setType(EntryType type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getDate() {
        return date;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<Feeling> getFeelings() {
        return new ArrayList<>(feelings);
    }

    public void setFeelings(List<Feeling> feelings) {
        this.feelings = new ArrayList<>(feelings);
    }

    public List<Activity> getActivities() {
        return new ArrayList<>(activities);
    }

    public void setActivities(List<Activity> activities) {
        this.activities = new ArrayList<>(activities);
    }
}

public enum EntryType {
    TEXT, AUDIO, IMAGE
}