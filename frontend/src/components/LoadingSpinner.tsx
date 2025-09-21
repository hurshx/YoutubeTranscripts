export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-dark-bg/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-white text-lg">Processing your request...</p>
      </div>
    </div>
  );
}

