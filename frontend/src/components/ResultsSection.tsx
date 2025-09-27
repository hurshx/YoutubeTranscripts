import { useState } from 'react';
import type { TranscriptResponse } from '../types/api';

interface ResultsSectionProps {
  transcript: TranscriptResponse;
}

export default function ResultsSection({ transcript }: ResultsSectionProps) {
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript.fullTranscript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Video metadata */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
              {transcript.video.title}
            </h2>
            <div className="flex flex-wrap gap-6 text-sm text-gray-300 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Channel:</span>
                <span className="text-white">{transcript.video.channel}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Duration:</span>
                <span className="text-white">{transcript.video.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Language:</span>
                <span className="text-white">{transcript.transcript.language}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => setShowTimestamps(!showTimestamps)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                showTimestamps 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-slate-700 hover:bg-slate-600 text-gray-300 border border-slate-600'
              }`}
            >
              {showTimestamps ? 'Hide' : 'Show'} Timestamps
            </button>
            <button 
              onClick={handleCopy} 
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-gray-300 font-medium rounded-full border border-slate-600 transition-all duration-200"
            >
              {copied ? 'Copied!' : 'Copy Transcript'}
            </button>
            <button 
              onClick={handleDownload} 
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-gray-300 font-medium rounded-full border border-slate-600 transition-all duration-200"
            >
              Download .txt
            </button>
          </div>

          {/* Transcript content */}
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Transcript
            </h3>
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {showTimestamps ? (
                <div className="space-y-3">
                  {transcript.segments.map((segment, index) => (
                    <div key={index} className="text-gray-300 leading-relaxed">
                      <span className="text-purple-400 text-sm font-mono bg-slate-800/50 px-2 py-1 rounded mr-3">
                        {segment.start.toFixed(2)}s
                      </span>
                      <span>{segment.text}</span>
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