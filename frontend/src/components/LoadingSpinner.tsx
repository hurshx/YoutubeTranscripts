export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-700 rounded-full animate-spin border-t-purple-500 mb-4"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-purple-400 opacity-20"></div>
        </div>
        <p className="text-white text-lg font-medium">Processing your request...</p>
        <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
      </div>
    </div>
  );
}