package com.youtube.transcript.dto;

import java.util.List;

public class TranscriptResponse {
    
    private VideoMetadata video;
    private TranscriptMetadata transcript;
    private List<TranscriptSegment> segments;
    private String fullTranscript;
    private String source;
    
    public TranscriptResponse() {}
    
    public TranscriptResponse(VideoMetadata video, TranscriptMetadata transcript, 
                            List<TranscriptSegment> segments, String fullTranscript, String source) {
        this.video = video;
        this.transcript = transcript;
        this.segments = segments;
        this.fullTranscript = fullTranscript;
        this.source = source;
    }
    
    public VideoMetadata getVideo() {
        return video;
    }
    
    public void setVideo(VideoMetadata video) {
        this.video = video;
    }
    
    public TranscriptMetadata getTranscript() {
        return transcript;
    }
    
    public void setTranscript(TranscriptMetadata transcript) {
        this.transcript = transcript;
    }
    
    public List<TranscriptSegment> getSegments() {
        return segments;
    }
    
    public void setSegments(List<TranscriptSegment> segments) {
        this.segments = segments;
    }
    
    public String getFullTranscript() {
        return fullTranscript;
    }
    
    public void setFullTranscript(String fullTranscript) {
        this.fullTranscript = fullTranscript;
    }
    
    public String getSource() {
        return source;
    }
    
    public void setSource(String source) {
        this.source = source;
    }
    
    public static class VideoMetadata {
        private String id;
        private String title;
        private String channel;
        private String duration;
        
        public VideoMetadata() {}
        
        public VideoMetadata(String id, String title, String channel, String duration) {
            this.id = id;
            this.title = title;
            this.channel = channel;
            this.duration = duration;
        }
        
        public String getId() {
            return id;
        }
        
        public void setId(String id) {
            this.id = id;
        }
        
        public String getTitle() {
            return title;
        }
        
        public void setTitle(String title) {
            this.title = title;
        }
        
        public String getChannel() {
            return channel;
        }
        
        public void setChannel(String channel) {
            this.channel = channel;
        }
        
        public String getDuration() {
            return duration;
        }
        
        public void setDuration(String duration) {
            this.duration = duration;
        }
    }
    
    public static class TranscriptMetadata {
        private String language;
        
        public TranscriptMetadata() {}
        
        public TranscriptMetadata(String language) {
            this.language = language;
        }
        
        public String getLanguage() {
            return language;
        }
        
        public void setLanguage(String language) {
            this.language = language;
        }
    }
    
    public static class TranscriptSegment {
        private double start;
        private double end;
        private String text;
        
        public TranscriptSegment() {}
        
        public TranscriptSegment(double start, double end, String text) {
            this.start = start;
            this.end = end;
            this.text = text;
        }
        
        public double getStart() {
            return start;
        }
        
        public void setStart(double start) {
            this.start = start;
        }
        
        public double getEnd() {
            return end;
        }
        
        public void setEnd(double end) {
            this.end = end;
        }
        
        public String getText() {
            return text;
        }
        
        public void setText(String text) {
            this.text = text;
        }
    }
}

