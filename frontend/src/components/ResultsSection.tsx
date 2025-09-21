import { useState } from 'react';
import type { TranscriptResponse } from '../types/api';

interface ResultsSectionProps {
  transcript: TranscriptResponse;
}

export default function ResultsSection({ transcript }: ResultsSectionProps) {
  const [showTimestamps, setShowTimestamps] = useState(true);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript.fullTranscript);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    const sanitizedTitle = transcript.video.title
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);
    
    const filename = `${sanitizedTitle}_transcript.txt`;
    const blob = new Blob([transcript.fullTranscript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDuration = (duration: string) => {
    // Simple duration formatting - you might want to improve this
    return duration;
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="card">
          {/* Video metadata */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">{transcript.video.title}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-6">
              <span className="flex items-center gap-2">
                <span className="text-gray-400">Channel:</span>
                {transcript.video.channel}
              </span>
              <span className="flex items-center gap-2">
                <span className="text-gray-400">Duration:</span>
                {formatDuration(transcript.video.duration)}
              </span>
              <span className="flex items-center gap-2">
                <span className="text-gray-400">Language:</span>
                {transcript.transcript.language}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => setShowTimestamps(!showTimestamps)}
              className={`btn-secondary ${showTimestamps ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
            >
              {showTimestamps ? 'Hide' : 'Show'} Timestamps
            </button>
            <button onClick={handleCopy} className="btn-secondary">
              Copy Transcript
            </button>
            <button onClick={handleDownload} className="btn-secondary">
              Download .txt
            </button>
          </div>

          {/* Transcript content */}
          <div className="bg-dark-bg border border-dark-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Transcript</h3>
            <div className="prose prose-invert max-w-none">
              {showTimestamps ? (
                <div className="space-y-2">
                  {transcript.segments.map((segment, index) => (
                    <div key={index} className="text-gray-300 leading-relaxed">
                      <span className="text-blue-400 text-sm font-mono">
                        [{segment.start.toFixed(2)}s]
                      </span>{' '}
                      {segment.text}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {transcript.segments.map(segment => segment.text).join(' ')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
