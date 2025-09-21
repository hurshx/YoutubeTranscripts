export interface TranscriptRequest {
  url: string;
  includeTimestamps: boolean;
}

export interface TranscriptResponse {
  video: VideoMetadata;
  transcript: TranscriptMetadata;
  segments: TranscriptSegment[];
  fullTranscript: string;
  source: string;
}

export interface VideoMetadata {
  id: string;
  title: string;
  channel: string;
  duration: string;
}

export interface TranscriptMetadata {
  language: string;
}

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
}

export type ApiResponse = TranscriptResponse | ErrorResponse;

