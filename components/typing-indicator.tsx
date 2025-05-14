export default function TypingIndicator() {
  return (
    <div className="flex mb-4">
      <div className="flex items-center space-x-1 max-w-[80%] rounded-lg p-4 bg-gray-100 text-gray-800 rounded-bl-none">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
      </div>
    </div>
  )
}
