import { useState, useRef, useEffect } from "react";

export default function ChatInterface() {
    const [messages, setMessages] = useState([
        { type: "bot", text: "Hi there! How can I assist you today?", timestamp: new Date() },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessage = { type: "user", text: input, timestamp: new Date() };
        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        setInput("");
        setIsTyping(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/ask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question: input }),
            });

            const data = await response.json();
            const botMessage = {
                type: "bot",
                text: data.answer || "Sorry, I couldn't fetch a proper response.",
                timestamp: new Date(),
            };

            setMessages([...newMessages, botMessage]);
        } catch (error) {
            const errorMessage = {
                type: "bot",
                text: "Sorry, something went wrong while contacting the server.",
                timestamp: new Date(),
            };
            setMessages([...newMessages, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    // Function to extract image URLs from text (kept for reference if needed)
    // const extractImageUrl = (text) => {
    //     const urlRegex = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|bmp|svg))/gi;
    //     const match = text.match(urlRegex);
    //     return match ? match[0] : null;
    // };

    // Function to format text with basic markdown-like styling and inline images
    const formatText = (text) => {
        // Regex to match image URLs
        const urlRegex = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|bmp|svg))/gi;
        const parts = text.split(urlRegex);
    
        return parts.map((part, index) => {
            // If it's an image URL
            if (urlRegex.test(part)) {
                return (
                    <div key={`img-${index}`} className="my-3">
                        <div className="rounded-lg overflow-hidden border border-gray-200 inline-block">
                            <img
                                src={part}
                                alt="Movie poster"
                                className="max-w-48 h-auto object-cover hover:scale-105 transition-transform duration-200 cursor-pointer block"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                            <div className="hidden bg-gray-100 p-4 text-center text-gray-500 text-xs">
                                Image failed to load
                            </div>
                        </div>
                        {/* New line or spacing after image */}
                        <div className="h-2" />
                    </div>
                );
            }
    
            // Handle *bold* markdown-style text
            const textParts = part.split(/(\*[^*]+\*)/g);
            return textParts.map((textPart, textIndex) => {
                if (textPart.startsWith('*') && textPart.endsWith('*') && textPart.length > 2) {
                    return (
                        <strong key={`txt-${index}-${textIndex}`} className="font-semibold">
                            {textPart.slice(1, -1)}
                        </strong>
                    );
                }
                return <span key={`txt-${index}-${textIndex}`}>{textPart}</span>;
            });
        });
    };
    

    const formatTime = (timestamp) =>
        timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-xl h-[85vh] flex flex-col overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-green-50 flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white text-xl">🤖</div>
                <div>
                    <h1 className="text-lg font-semibold text-gray-800">Movie Monk</h1>
                    <p className="text-xs text-green-600">Online • Ready to help</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-white space-y-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex items-start ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                        {msg.type === "bot" && (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-white bg-gray-400 mr-3">
                                🤖
                            </div>
                        )}

                        <div className="max-w-xs md:max-w-md">
                            <div
                                className={`px-4 py-3 rounded-xl text-sm ${msg.type === "user"
                                    ? "bg-green-100 text-green-900 rounded-br-sm border border-green-200"
                                    : "bg-gray-100 text-gray-800 rounded-bl-sm border border-gray-200"
                                    }`}
                            >
                                {/* Text content with inline images */}
                                <div className="leading-relaxed">
                                    {formatText(msg.text)}
                                </div>
                            </div>
                            <div
                                className={`text-xs text-gray-500 mt-1 px-2 ${msg.type === "user" ? "text-right" : "text-left"
                                    }`}
                            >
                                {formatTime(msg.timestamp)}
                            </div>
                        </div>

                        {msg.type === "user" && (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-white bg-green-600 ml-3">
                                👤
                            </div>
                        )}
                    </div>
                ))}

                {isTyping && (
                    <div className="flex items-start justify-start">
                        <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm mr-3">🤖</div>
                        <div className="px-4 py-3 rounded-xl bg-gray-100 text-gray-700 text-sm border border-gray-200">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        className="flex-1 bg-white border border-gray-300 text-gray-900 rounded-full px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Type your message..."
                        disabled={isTyping}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-full transition-all disabled:opacity-50"
                    >
                        {isTyping ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            "Send"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}