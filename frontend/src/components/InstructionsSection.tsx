export default function InstructionsSection() {
  const steps = [
    {
      number: 1,
      title: "Paste the link",
      description: "Copy any YouTube video URL and paste it into the input field above."
    },
    {
      number: 2,
      title: "Click 'Get video transcript'",
      description: "Our system will automatically extract the available captions from the video."
    },
    {
      number: 3,
      title: "Copy or download the transcript",
      description: "Use the copy button or download as a text file for your convenience."
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
          How to get the transcript of a YouTube video
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="card text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                {step.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

