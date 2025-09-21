import { useState } from 'react';
import type { TranscriptResponse } from './types/api';
import { ApiService } from './services/api';
import HeroSection from './components/HeroSection';
import InstructionsSection from './components/InstructionsSection';
import ResultsSection from './components/ResultsSection';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [transcript, setTranscript] = useState<TranscriptResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (url: string, includeTimestamps: boolean) => {
    setLoading(true);
    setError(null);
    setTranscript(null);

    try {
      const result = await ApiService.getTranscript({ url, includeTimestamps });
      setTranscript(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <HeroSection onSubmit={handleSubmit} loading={loading} error={error} />
      <InstructionsSection />
      {transcript && <ResultsSection transcript={transcript} />}
      {loading && <LoadingSpinner />}
    </div>
  );
}

export default App;
