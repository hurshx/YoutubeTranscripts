package com.youtube.transcript.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.youtube.transcript.dto.TranscriptResponse;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class YouTubeService {
    
    private static final Logger logger = LoggerFactory.getLogger(YouTubeService.class);
    private static final String YOUTUBE_WATCH_URL_PATTERN = "(?:https?://)?(?:www\\.)?youtube\\.com/watch\\?v=([\\w-]+)";
    private static final String YOUTUBE_SHORT_URL_PATTERN = "(?:https?://)?(?:www\\.)?youtu\\.be/([\\w-]+)";
    private static final String YOUTUBE_CAPTIONS_URL = "https://www.youtube.com/api/timedtext";
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    public TranscriptResponse getTranscript(String url, boolean includeTimestamps) {
        try {
            String videoId = extractVideoId(url);
            if (videoId == null) {
                throw new IllegalArgumentException("Invalid YouTube URL");
            }
            
            logger.info("Processing video ID: {}", videoId);
            
            // Get video metadata
            TranscriptResponse.VideoMetadata videoMetadata = getVideoMetadata(videoId);
            
            // Get captions
            List<TranscriptResponse.TranscriptSegment> segments = getCaptions(videoId);
            
            if (segments.isEmpty()) {
                throw new RuntimeException("No captions available for this video");
            }
            
            // Build full transcript
            String fullTranscript = buildFullTranscript(segments, includeTimestamps);
            
            // Create response
            TranscriptResponse.TranscriptMetadata transcriptMetadata = 
                new TranscriptResponse.TranscriptMetadata("en"); // Default to English
            
            return new TranscriptResponse(videoMetadata, transcriptMetadata, segments, fullTranscript,"captions");
            
        } catch (Exception e) {
            logger.error("Error processing YouTube video: {}", e.getMessage());
            throw new RuntimeException("Failed to process video: " + e.getMessage(), e);
        }
    }
    
    private String extractVideoId(String url) {
        // Try youtube.com/watch?v= format
        Pattern pattern = Pattern.compile(YOUTUBE_WATCH_URL_PATTERN);
        Matcher matcher = pattern.matcher(url);
        if (matcher.find()) {
            return matcher.group(1);
        }
        
        // Try youtu.be/ format
        pattern = Pattern.compile(YOUTUBE_SHORT_URL_PATTERN);
        matcher = pattern.matcher(url);
        if (matcher.find()) {
            return matcher.group(1);
        }
        
        return null;
    }
    
    private TranscriptResponse.VideoMetadata getVideoMetadata(String videoId) {
        try {
            String videoUrl = "https://www.youtube.com/watch?v=" + videoId;
            Document doc = Jsoup.connect(videoUrl)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                .timeout(10000)
                .get();
            
            // Extract title
            String title = doc.select("meta[property=og:title]").attr("content");
            if (title.isEmpty()) {
                title = doc.title();
            }
            
            // Extract channel name
            String channel = doc.select("meta[property=og:video:author]").attr("content");
            if (channel.isEmpty()) {
                channel = doc.select("link[itemprop=name]").attr("content");
            }
            
            // Extract duration (this is more complex and might not always work)
            String duration = "Unknown Duration";
            try {
                String scriptContent = doc.select("script")
                    .stream()
                    .map(element -> element.html())
                    .filter(html -> html.contains("ytInitialPlayerResponse"))
                    .findFirst()
                    .orElse(null);
                    
                if (scriptContent != null) {
                    Pattern pattern = Pattern.compile("ytInitialPlayerResponse\\s*=\\s*(\\{.*?\\});");
                    Matcher matcher = pattern.matcher(scriptContent);
                    if (matcher.find()) {
                        JsonNode playerResponse = objectMapper.readTree(matcher.group(1));
                        JsonNode videoDetails = playerResponse.path("videoDetails");
                        String durationSeconds = videoDetails.path("lengthSeconds").asText();
                        if (!durationSeconds.isEmpty()) {
                            duration = formatDuration(Integer.parseInt(durationSeconds));
                        }
                    }
                }
            } catch (Exception e) {
                logger.warn("Could not extract duration: {}", e.getMessage());
            }
            
            return new TranscriptResponse.VideoMetadata(videoId, title, channel, duration);
            
        } catch (Exception e) {
            logger.warn("Could not fetch video metadata: {}", e.getMessage());
            return new TranscriptResponse.VideoMetadata(videoId, title, channel, duration);
        }
    }
    
    private String formatDuration(int seconds) {
        int hours = seconds / 3600;
        int minutes = (seconds % 3600) / 60;
        int secs = seconds % 60;
        
        if (hours > 0) {
            return String.format("%d:%02d:%02d", hours, minutes, secs);
        } else {
            return String.format("%d:%02d", minutes, secs);
        }
    }
    
    private List<TranscriptResponse.TranscriptSegment> getCaptions(String videoId) {
        List<TranscriptResponse.TranscriptSegment> segments = new ArrayList<>();
        
        try {
            // First, get the video page to extract caption track info
            String videoUrl = "https://www.youtube.com/watch?v=" + videoId;
            Document doc = Jsoup.connect(videoUrl)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                .timeout(10000)
                .get();
            
            // Extract caption tracks from the page
            String captionTracksJson = extractCaptionTracks(doc);
            if (captionTracksJson != null) {
                segments = parseCaptionTracks(captionTracksJson);
            }
            
        } catch (Exception e) {
            logger.warn("Error fetching captions from video page: {}", e.getMessage());
        }
        
        return segments;
    }
    
    private String extractCaptionTracks(Document doc) {
        // Look for the ytInitialPlayerResponse script tag
        String scriptContent = doc.select("script")
            .stream()
            .map(element -> element.html())
            .filter(html -> html.contains("ytInitialPlayerResponse"))
            .findFirst()
            .orElse(null);
            
        if (scriptContent != null) {
            // Extract the JSON from the script tag
            Pattern pattern = Pattern.compile("ytInitialPlayerResponse\\s*=\\s*(\\{.*?\\});");
            Matcher matcher = pattern.matcher(scriptContent);
            if (matcher.find()) {
                try {
                    JsonNode playerResponse = objectMapper.readTree(matcher.group(1));
                    JsonNode captions = playerResponse.path("captions");
                    JsonNode playerCaptionsTracklistRenderer = captions.path("playerCaptionsTracklistRenderer");
                    JsonNode captionTracks = playerCaptionsTracklistRenderer.path("captionTracks");
                    
                    if (captionTracks.isArray() && captionTracks.size() > 0) {
                        // Find English captions first, then default
                        for (JsonNode track : captionTracks) {
                            String languageCode = track.path("languageCode").asText();
                            if ("en".equals(languageCode) || "en-US".equals(languageCode)) {
                                return track.path("baseUrl").asText();
                            }
                        }
                        // If no English, use the first available
                        return captionTracks.get(0).path("baseUrl").asText();
                    }
                } catch (Exception e) {
                    logger.warn("Error parsing player response: {}", e.getMessage());
                }
            }
        }
        return null;
    }
    
    private List<TranscriptResponse.TranscriptSegment> parseCaptionTracks(String captionUrl) {
        List<TranscriptResponse.TranscriptSegment> segments = new ArrayList<>();
        
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(captionUrl, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                // Parse XML captions
                Document captionDoc = Jsoup.parse(response.getBody());
                captionDoc.select("text").forEach(element -> {
                    String startStr = element.attr("start");
                    String durStr = element.attr("dur");
                    String text = element.text();
                    
                    if (!startStr.isEmpty() && !durStr.isEmpty() && !text.isEmpty()) {
                        try {
                            double start = Double.parseDouble(startStr);
                            double duration = Double.parseDouble(durStr);
                            double end = start + duration;
                            
                            segments.add(new TranscriptResponse.TranscriptSegment(start, end, text));
                        } catch (NumberFormatException e) {
                            logger.warn("Error parsing timestamp: {}", e.getMessage());
                        }
                    }
                });
            }
            
        } catch (Exception e) {
            logger.warn("Error fetching caption content: {}", e.getMessage());
        }
        
        return segments;
    }
    
    
    private String buildFullTranscript(List<TranscriptResponse.TranscriptSegment> segments, boolean includeTimestamps) {
        StringBuilder transcript = new StringBuilder();
        
        for (TranscriptResponse.TranscriptSegment segment : segments) {
            if (includeTimestamps) {
                transcript.append(String.format("[%.2f] %s\n", segment.getStart(), segment.getText()));
            } else {
                transcript.append(segment.getText()).append(" ");
            }
        }
        
        return transcript.toString().trim();
    }
    
    private static class VideoMetadata {
        private final String id;
        private final String title;
        private final String channel;
        private final String duration;
        
        public VideoMetadata(String id, String title, String channel, String duration) {
            this.id = id;
            this.title = title;
            this.channel = channel;
            this.duration = duration;
        }
        
        public String getId() { return id; }
        public String getTitle() { return title; }
        public String getChannel() { return channel; }
        public String getDuration() { return duration; }
    }
}
