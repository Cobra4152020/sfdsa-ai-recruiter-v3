"use client";

import { useState, useRef, useEffect } from "react";
import { useMessageHistory } from "@/hooks/use-message-history";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { AuthRequiredWrapper } from "@/components/auth-required-wrapper";
import { 
  MessageSquare, 
  Bot, 
  Send, 
  Gamepad2, 
  Trophy, 
  Award, 
  Users, 
  Clock,
  Star,
  Sparkles,
  HelpCircle,
  Shield,
  UserPlus,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from "lucide-react";
import { useUser } from "@/context/user-context";
import { useAuthModal } from "@/context/auth-modal-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { PageWrapper } from "@/components/page-wrapper";
import { voiceService } from "@/lib/voice-service";
import { useRouter } from "next/navigation";

interface Message {
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  pointsAwarded?: number;
  searchUsed?: boolean;
  id?: string;
  isTyping?: boolean;
  displayedContent?: string;
  quickReplies?: string[];
}

export default function ChatWithSgtKenPage() {
  const { currentUser, incrementParticipation, isLoggedIn } = useUser();
  const { openModal } = useAuthModal();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPointsEarned, setTotalPointsEarned] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  
  // Voice-related state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { addMessage } = useMessageHistory();
  useScrollToBottom(scrollAreaRef, messages);

  const router = useRouter();

  // Typing effect function - slowed down for better readability
  const startTypingEffect = (messageId: string, content: string, delay: number = 140) => {
    setTypingMessageId(messageId);
    let currentIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (currentIndex <= content.length) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId
              ? { ...msg, displayedContent: content.substring(0, currentIndex) }
              : msg
          )
        );
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setTypingMessageId(null);
        // Mark typing as complete
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId
              ? { ...msg, isTyping: false, displayedContent: content }
              : msg
          )
        );
      }
    }, delay);
  };

  // Suggested questions for quick start
  const suggestedQuestions = [
    "What are the requirements to become a deputy sheriff?",
    "What is the salary and benefits package?",
    "Tell me about the training academy",
    "What does a typical day look like?",
    "How do I apply for the position?",
    "What career advancement opportunities exist?"
  ];

  const handleVoiceInput = async () => {
    if (!voiceService.isListeningSupported()) {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support voice input. Try Chrome, Edge, or Safari.",
        variant: "destructive",
      });
      return;
    }

    setIsListening(true);
    try {
      const transcript = await voiceService.startListening();
      if (transcript.trim()) {
        setInput(transcript);
        toast({
          title: "Voice Captured! 🎤",
          description: `"${transcript}"`,
          duration: 3000,
        });
      } else {
        toast({
          title: "No Speech Detected",
          description: "Please try speaking again or check your microphone.",
          variant: "default",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Voice input error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (errorMessage.includes('permission') || errorMessage.includes('denied')) {
        toast({
          title: "Microphone Permission Required",
          description: "Please allow microphone access in your browser settings and try again.",
          variant: "destructive",
          duration: 5000,
        });
      } else if (errorMessage.includes('not available')) {
        toast({
          title: "Microphone Not Available",
          description: "Please check that your microphone is connected and working.",
          variant: "destructive",
          duration: 4000,
        });
      } else {
        toast({
          title: "Voice Input Issue",
          description: "Speech recognition temporarily unavailable. Please type your message instead.",
          variant: "default",
          duration: 4000,
        });
      }
    } finally {
      setIsListening(false);
    }
  };

  const speakMessage = async (text: string) => {
    if (!voiceService.isSpeakingSupported() || !voiceEnabled) return;

    setIsSpeaking(true);
    try {
      await voiceService.speak(text);
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    voiceService.stopSpeaking();
    setIsSpeaking(false);
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (isSpeaking) {
      stopSpeaking();
    }
  };

  const handleSendMessage = async () => {
    console.log('[CHAT] handleSendMessage triggered.');
    if (!input.trim()) {
        console.log('[CHAT] Input is empty, aborting.');
        return;
    }
    console.log('[CHAT] Input is valid.');

    if (!currentUser) {
        console.log('[CHAT] User not signed in. Opening auth modal.');
        openModal("signup", "recruit");
        return;
    }
    console.log(`[CHAT] User signed in: ${currentUser.id}`);

    const messageText = input.trim();

    const userMessage: Message = {
      content: messageText,
      role: "user",
      timestamp: new Date().toISOString(),
      id: `user-${Date.now()}`,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    console.log('[CHAT] User message added to state.');

    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      // Prepare chat history for context
      const chatHistory = messages.slice(-5).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      console.log('[CHAT] Prepared chat history:', chatHistory);

      const payload = {
          message: messageText,
          userId: currentUser?.id,
          chatHistory,
          sessionId: "chat-page-session",
      };
      console.log('[CHAT] Preparing to call /api/chat with payload:', payload);

      // Call the enhanced chat API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      console.log(`[CHAT] Received response from /api/chat. Status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[CHAT] API error response: ${errorText}`);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('[CHAT] API response data:', data);
      
      if (!data.success) {
        throw new Error(data.error || "Unknown error");
      }

      const assistantMessageId = `assistant-${Date.now()}`;
      const botMessage: Message = {
        content: data.message,
        role: "assistant",
        timestamp: new Date().toISOString(),
        pointsAwarded: data.pointsAwarded,
        searchUsed: data.searchUsed,
        id: assistantMessageId,
        isTyping: true,
        displayedContent: "",
      };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      // Start typing effect for the response with a small delay
      setTimeout(() => {
        startTypingEffect(assistantMessageId, data.message);
      }, 300);
      setMessageCount(prev => prev + 1);

      // Auto-speak Sgt. Ken's response if voice is enabled
      if (autoSpeak && voiceEnabled) {
        setTimeout(() => {
          speakMessage(data.message);
        }, 1000); // Small delay to let typing effect start
      }

      // Update points earned
      if (data.pointsAwarded) {
        setTotalPointsEarned(prev => prev + data.pointsAwarded);
        
        // Show points notification
        toast({
          title: "Points Earned! 🎉",
          description: `+${data.pointsAwarded} points for chatting with Sgt. Ken${data.searchUsed ? ' (bonus for current info!)' : ''}`,
          duration: 3000,
        });
      }

      // Show indicator if web search was used
      if (data.searchUsed) {
        console.log("✅ Sgt. Ken used current information for this response");
      }

    } catch (err) {
      console.error("Chat error:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");
      
      // Add fallback message
      const fallbackMessage: Message = {
        content: "Hey there! I'm having a bit of trouble connecting right now, but I'm still here to help with your questions about the San Francisco Sheriff's Office. The department offers competitive salaries, excellent benefits, and rewarding career opportunities. What would you like to know?",
        role: "assistant",
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prevMessages) => [...prevMessages, fallbackMessage]);
      
      // Auto-speak fallback message if voice is enabled
      if (autoSpeak && voiceEnabled) {
        setTimeout(() => {
          speakMessage(fallbackMessage.content);
        }, 500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <PageWrapper>
      <AuthRequiredWrapper
        requiredFeature="sgt_ken_chat"
        title="Chat with Sgt. Ken"
        description="Get instant answers about recruitment and earn points for every interaction"
      >
        <div className="container mx-auto px-4 py-6 sm:py-8 flex flex-col h-full">
          {/* Page Header */}
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              <span className="bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent">💬 Chat with Sgt. Ken</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
              Get instant answers to your questions about the recruitment process, department policies, 
              and career opportunities. Earn points for every interaction!
            </p>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 min-h-0 h-full">
            {/* Main Chat Panel */}
            <div className="lg:col-span-3 flex flex-col">
              <Card className="flex-1 flex flex-col shadow-lg overflow-hidden bg-card">
                <CardHeader className="bg-card-foreground/5 dark:bg-card flex-shrink-0 border-b border-border">
                  <CardTitle className="flex items-center justify-between text-lg sm:text-xl text-foreground">
                    <div className="flex items-center">
                      <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full mr-3">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      Sgt. Ken - AI Assistant
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-primary/30 text-primary">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI-Powered
                      </Badge>
                      {currentUser && (
                        <Badge variant="secondary" className="bg-green-500/80 text-white border-green-300">
                          <Star className="h-3 w-3 mr-1" />
                          {totalPointsEarned} pts
                        </Badge>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-0">
                  <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                    {/* Initial welcome message */}
                    {messages.length === 0 && (
                      <div className="flex items-start space-x-3 sm:space-x-4 w-full justify-start">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 shadow-md">
                          <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        </div>
                        <div className="rounded-lg p-3 sm:p-4 shadow-sm bg-muted/60 dark:bg-muted/80 text-foreground max-w-[90%] sm:max-w-[80%]">
                          <p className="font-bold mb-2">Welcome! I'm Sgt. Ken.</p>
                          <p className="text-sm sm:text-base leading-relaxed m-0 whitespace-pre-wrap">
                            I'm your AI guide to becoming a San Francisco Deputy Sheriff. 
                            Ask me anything about the job, or try one of the suggestions below.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Chat Messages */}
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex items-start space-x-3 sm:space-x-4 w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {msg.role === "assistant" && (
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 shadow-md">
                            <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          </div>
                        )}
                        <div
                          className={`rounded-lg p-3 sm:p-4 shadow-sm break-words ${
                            msg.role === "user" 
                              ? "bg-primary text-primary-foreground text-right max-w-[85%] sm:max-w-[75%]" 
                              : "bg-muted/60 dark:bg-muted/80 text-foreground max-w-[90%] sm:max-w-[80%]"
                          }`}
                        >
                          <p className="text-sm sm:text-base leading-relaxed m-0 whitespace-pre-wrap">
                              {msg.displayedContent || msg.content}
                              {msg.isTyping && typingMessageId === msg.id && (
                                <span className="inline-block w-0.5 h-5 bg-current ml-1 animate-pulse">|</span>
                              )}
                          </p>
                        </div>
                        {msg.role === "user" && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 shadow-md text-foreground">
                            {currentUser?.email?.[0].toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Loading indicator */}
                    {isLoading && messages[messages.length - 1]?.role === 'user' && (
                       <div className="flex items-start space-x-3 sm:space-x-4 w-full justify-start">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 shadow-md">
                          <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        </div>
                        <div className="rounded-lg p-3 sm:p-4 shadow-sm bg-muted/60 dark:bg-muted/80 text-foreground">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} ></div>
                              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} ></div>
                              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} ></div>
                            </div>
                        </div>
                      </div>
                    )}

                    {/* Suggested Questions */}
                    {messages.length === 0 && !isLoading && (
                      <div className="pt-4 border-t border-border/50">
                        <h3 className="text-sm font-semibold text-muted-foreground mb-3 text-center">Or try a suggested question:</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {suggestedQuestions.map((q, i) => (
                            <Button
                              key={i}
                              variant="outline"
                              size="sm"
                              className="text-left justify-start h-auto whitespace-normal"
                              onClick={() => handleSuggestedQuestion(q)}
                            >
                              <HelpCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                              {q}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Error message display */}
                    {error && (
                      <div className="text-center text-red-500 text-sm sm:text-base bg-red-50 border border-red-200 rounded-lg p-3">
                        Error: {error}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 pt-4 border-t border-border flex-shrink-0 p-4">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && !isLoading && handleSendMessage()
                      }
                      placeholder="Ask Sgt. Ken anything about becoming a deputy sheriff..."
                      className="flex-1 text-sm sm:text-base"
                      disabled={isLoading}
                    />
                    
                    {/* Voice Controls */}
                    {voiceService.isListeningSupported() && (
                      <Button
                        type="button"
                        onClick={handleVoiceInput}
                        disabled={isLoading || isListening || isSpeaking}
                        className={`flex-shrink-0 px-3 shadow-md hover:shadow-lg transition-all ${
                          isListening 
                            ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" 
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                        aria-label={isListening ? "Listening..." : "Voice input"}
                      >
                        {isListening ? <MicOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Mic className="h-4 w-4 sm:h-5 sm:w-5" />}
                      </Button>
                    )}
                    
                    {voiceService.isSpeakingSupported() && (
                      <Button
                        type="button"
                        onClick={isSpeaking ? stopSpeaking : toggleVoice}
                        className={`flex-shrink-0 px-3 shadow-md hover:shadow-lg transition-all ${
                          isSpeaking 
                            ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" 
                            : voiceEnabled 
                              ? "bg-green-500 hover:bg-green-600 text-white" 
                              : "bg-gray-400 hover:bg-accent/100 text-white"
                        }`}
                        aria-label={
                          isSpeaking 
                            ? "Stop speaking" 
                            : voiceEnabled 
                              ? "Voice enabled" 
                              : "Voice disabled"
                        }
                      >
                        {isSpeaking ? (
                          <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : voiceEnabled ? (
                          <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                          <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                      </Button>
                    )}
                    
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !input.trim()}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0 px-4 sm:px-6 shadow-md hover:shadow-lg transition-all"
                    >
                      <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1 space-y-6">
               <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center"><Trophy className="h-5 w-5 mr-2 text-yellow-500"/> Your Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-muted-foreground">Questions Asked</span>
                    <span className="font-bold text-lg">{messageCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-muted-foreground">Points from Chat</span>
                    <span className="font-bold text-lg text-green-500">+{totalPointsEarned}</span>
                  </div>
                   <Button asChild variant="outline" className="w-full">
                     <Link href="/dashboard">
                        <Award className="h-4 w-4 mr-2" />
                        View Full Dashboard
                     </Link>
                  </Button>
                </CardContent>
              </Card>

               <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center"><Gamepad2 className="h-5 w-5 mr-2 text-blue-500"/> SF Trivia Challenge</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Test your knowledge about the SFSO and earn bonus points!</p>
                  <Button asChild className="w-full">
                    <Link href="/trivia">Play Now</Link>
                  </Button>
                </CardContent>
              </Card>
              
               <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center"><Users className="h-5 w-5 mr-2 text-purple-500"/> Connect with a Recruiter</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Have specific questions? Get in touch with a human recruiter.</p>
                  <Button asChild variant="secondary" className="w-full">
                     <Link href="/contact">Contact Us</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AuthRequiredWrapper>
    </PageWrapper>
  );
}
