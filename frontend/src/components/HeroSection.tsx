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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6 md:p-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-white font-medium">Tactiq</span>
        </div>
        <div className="text-gray-300 text-sm">
          YouTube Transcript Generator
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">Free </span>
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              YouTube Transcript
            </span>
            <br />
            <span className="text-white">Generator</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
            Instantly, without uploading video files.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter YouTube URL... https://www.youtube.com/watch?v=Mcm3CD..."
                  className="w-full px-6 py-4 bg-transparent border-2 border-purple-500/50 rounded-full text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors duration-200 text-center md:text-left"
                  disabled={loading}
                  aria-label="YouTube URL"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !url.trim() || !isValidUrl(url)}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? 'Processing...' : 'Get Video Transcript'}
              </button>
            </div>

            {/* Timestamp toggle */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <input
                type="checkbox"
                id="timestamps"
                checked={includeTimestamps}
                onChange={(e) => setIncludeTimestamps(e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-transparent border-gray-400 rounded focus:ring-purple-500 focus:ring-2"
                disabled={loading}
              />
              <label htmlFor="timestamps" className="text-gray-300 text-sm">
                Include timestamps
              </label>
            </div>

            {/* Helper text */}
            <p className="text-gray-400 text-sm">
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
      </div>
    </div>
  );
}