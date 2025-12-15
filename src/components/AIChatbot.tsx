import React, { useState, useEffect, useRef } from 'react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

const AIChatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init',
            text: 'SYSTEM INITIALIZED. COGNITIVE CORE ONLINE. AWAITING INPUT.',
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsThinking(true);

        // Simulate AI processing
        setTimeout(() => {
            const responses = [
                "ANALYZING DATA PATTERNS...",
                "OPTIMIZING NEURAL PATHWAYS...",
                "CALCULATING SCALABILITY VECTORS...",
                "INTEGRATING USER VISION...",
                "SYSTEM ARCHITECTURE: CONFIRMED."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            const newAiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: randomResponse,
                sender: 'ai',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, newAiMessage]);
            setIsThinking(false);
        }, 1500);
    };

    return (
        <div className="w-full max-w-2xl mx-auto h-[500px] md:h-[600px] flex flex-col bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-sm shadow-[0_0_30px_rgba(0,255,255,0.1)] overflow-hidden relative font-mono">

            {/* HUD Corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500 z-20" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500 z-20" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500 z-20" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500 z-20" />

            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,255,0.02)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />

            {/* Header */}
            <div className="p-3 border-b border-cyan-500/30 flex items-center justify-between bg-cyan-900/10">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 animate-pulse" />
                    <span className="text-cyan-500 text-xs tracking-[0.2em]">AGENCIA_CORE_V1.0</span>
                </div>
                <div className="text-cyan-500/50 text-[10px]">SYS.STATUS: NORMAL</div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent z-20">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] p-3 text-xs md:text-sm border-l-2 ${msg.sender === 'user'
                                    ? 'border-purple-500 bg-purple-900/10 text-purple-100'
                                    : 'border-cyan-500 bg-cyan-900/10 text-cyan-100'
                                }`}
                        >
                            <div className="opacity-50 text-[10px] mb-1">
                                {msg.sender === 'user' ? '>> USER_INPUT' : '>> CORE_RESPONSE'}
                            </div>
                            {msg.text}
                        </div>
                    </div>
                ))}

                {/* Thinking Indicator */}
                {isThinking && (
                    <div className="flex justify-start">
                        <div className="border-l-2 border-cyan-500 bg-cyan-900/10 p-3 flex items-center gap-1">
                            <span className="w-1 h-1 bg-cyan-500 animate-ping" />
                            <span className="text-cyan-500 text-xs animate-pulse">PROCESSING...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 bg-black/50 border-t border-cyan-500/30 z-20">
                <div className="relative flex items-center group">
                    <span className="absolute left-3 text-cyan-500 text-xs">{'>'}</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="ENTER_COMMAND..."
                        className="w-full bg-transparent text-cyan-100 placeholder-cyan-800 text-sm py-2 pl-6 pr-10 border border-cyan-500/20 focus:border-cyan-500/80 focus:outline-none focus:bg-cyan-900/5 transition-all font-mono"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isThinking}
                        className="absolute right-2 text-cyan-500 hover:text-cyan-300 disabled:opacity-30 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AIChatbot;
