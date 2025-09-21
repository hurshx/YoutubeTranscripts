package com.youtube.transcript.controller;

import com.youtube.transcript.dto.ErrorResponse;
import com.youtube.transcript.dto.TranscriptRequest;
import com.youtube.transcript.dto.TranscriptResponse;
import com.youtube.transcript.service.YouTubeService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TranscriptController {
    
    private static final Logger logger = LoggerFactory.getLogger(TranscriptController.class);
    
    @Autowired
    private YouTubeService youTubeService;
    
    @PostMapping("/transcribe")
    public ResponseEntity<?> transcribe(@Valid @RequestBody TranscriptRequest request) {
        try {
            logger.info("Received transcript request for URL: {}", request.getUrl());
            
            TranscriptResponse response = youTubeService.getTranscript(
                request.getUrl(), 
                request.isIncludeTimestamps()
            );
            
            logger.info("Successfully processed transcript request");
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid URL provided: {}", e.getMessage());
            ErrorResponse error = new ErrorResponse("INVALID_URL", "Please provide a valid YouTube URL");
            return ResponseEntity.badRequest().body(error);
            
        } catch (RuntimeException e) {
            if (e.getMessage().contains("No captions available")) {
                logger.warn("No captions found for video");
                ErrorResponse error = new ErrorResponse("CAPTIONS_NOT_FOUND", 
                    "No captions are available for this video. The video may not have captions enabled.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            } else if (e.getMessage().contains("video unavailable") || e.getMessage().contains("private")) {
                logger.warn("Video unavailable or private");
                ErrorResponse error = new ErrorResponse("VIDEO_UNAVAILABLE", 
                    "This video is unavailable or private. Please try a different video.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            } else {
                logger.error("Internal error processing transcript request: {}", e.getMessage());
                ErrorResponse error = new ErrorResponse("INTERNAL_ERROR", 
                    "An error occurred while processing your request. Please try again.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
            }
        } catch (Exception e) {
            logger.error("Unexpected error: {}", e.getMessage(), e);
            ErrorResponse error = new ErrorResponse("INTERNAL_ERROR", 
                "An unexpected error occurred. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }
}

