package com.youtube.transcript.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class TranscriptRequest {
    
    @NotBlank(message = "YouTube URL is required")
    @Pattern(regexp = "^(https?://)?(www\\.)?(youtube\\.com/watch\\?v=|youtu\\.be/)[\\w-]+", 
             message = "Please provide a valid YouTube URL")
    private String url;
    
    private boolean includeTimestamps = true;
    
    public TranscriptRequest() {}
    
    public TranscriptRequest(String url, boolean includeTimestamps) {
        this.url = url;
        this.includeTimestamps = includeTimestamps;
    }
    
    public String getUrl() {
        return url;
    }
    
    public void setUrl(String url) {
        this.url = url;
    }
    
    public boolean isIncludeTimestamps() {
        return includeTimestamps;
    }
    
    public void setIncludeTimestamps(boolean includeTimestamps) {
        this.includeTimestamps = includeTimestamps;
    }
}

