// src/main/java/com/memosphere/dto/CreateEntryRequest.java
package main.java.com.memosphere.dto;

import com.memosphere.model.EntryType;
import java.util.List;

public class CreateEntryRequest {
    private EntryType type;
    private String content;
    private String title;
    private List<String> feelings;
    private List<String> activities;

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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getFeelings() {
        return feelings;
    }

    public void setFeelings(List<String> feelings) {
        this.feelings = feelings;
    }

    public List<String> getActivities() {
        return activities;
    }

    public void setActivities(List<String> activities) {
        this.activities = activities;
    }
}
