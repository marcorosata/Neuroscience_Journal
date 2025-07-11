export default function TestSmoke() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Very simple test smoke - just white circles */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-white rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute top-40 left-40 w-16 h-16 bg-gray-300 rounded-full opacity-70 animate-bounce"></div>
      <div className="absolute top-60 left-60 w-12 h-12 bg-white rounded-full opacity-60 animate-ping"></div>
      <div className="absolute top-80 left-80 w-24 h-24 bg-gray-200 rounded-full opacity-40 animate-pulse"></div>
      <div className="absolute top-96 left-96 w-18 h-18 bg-white rounded-full opacity-80"></div>
      
      {/* Moving smoke test */}
      <div className="absolute top-32 right-32 w-16 h-16 bg-white rounded-full opacity-60 animate-bounce"></div>
      <div className="absolute bottom-32 left-32 w-20 h-20 bg-gray-300 rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute bottom-48 right-48 w-14 h-14 bg-white rounded-full opacity-70 animate-ping"></div>
    </div>
  );
}