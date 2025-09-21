import { useState } from 'react';

interface HeroSectionProps {
  onSubmit: (url: string, includeTimestamps: boolean) => void;
  loading: boolean;
  error: string | null;
}

export default function HeroSection({ onSubmit, loading, error }: HeroSectionProps) {
  const [url, setUrl] = useState('');
  const [includeTimestamps, setIncludeTimestamps] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim(), includeTimestamps);
    }
  };

  const isValidUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Product label */}
        <div className="mb-8">
          <span className="text-sm text-gray-400 uppercase tracking-wider">
            YouTube Transcript Generator
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Free YouTube Transcript Generator
        </h1>

        {/* Subtext */}
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Instantly extract transcripts from YouTube videos without uploading files
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="input-field flex-1"
              disabled={loading}
              aria-label="YouTube URL"
            />
            <button
              type="submit"
              disabled={loading || !url.trim() || !isValidUrl(url)}
              className="btn-primary whitespace-nowrap"
            >
              {loading ? 'Processing...' : 'Get video transcript'}
            </button>
          </div>

          {/* Timestamp toggle */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <input
              type="checkbox"
              id="timestamps"
              checked={includeTimestamps}
              onChange={(e) => setIncludeTimestamps(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-dark-surface border-dark-border rounded focus:ring-blue-500"
              disabled={loading}
            />
            <label htmlFor="timestamps" className="text-sm text-gray-300">
              Include timestamps
            </label>
          </div>

          {/* Helper text */}
          <p className="text-sm text-gray-400">
            Quick and simple. No catch.
          </p>
        </form>

        {/* Error message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>
    </section>
  );
}

