"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare, Gamepad2, Coffee, UserPlus, Zap, Shield, Mic, MicOff, Volume2, VolumeX, X, Heart, Calendar } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/user-context";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

interface AskSgtKenButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

interface Message {
  id: string;
  sender: "user" | "ken";
  text: string;
  timestamp: Date;
  isTyping?: boolean;
}

// Web Audio API interfaces and types
interface VoiceProcessingChain {
  input: AudioNode;
  output: GainNode;
  compressor: DynamicsCompressorNode;
  lowShelf: BiquadFilterNode;
  midPeak: BiquadFilterNode;
  highShelf: BiquadFilterNode;
  reverb: ConvolverNode;
  masterGain: GainNode;
  analyzer: AnalyserNode;
}

interface AudioQualityMetrics {
  clarity: number;
  presence: number;
  brightness: number;
  balance: number;
}

export default function AskSgtKenButton({ variant = "default", size = "icon", className }: AskSgtKenButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true); // Sound on by default
  const [recognition, setRecognition] = useState<any>(null);
  const [synthesis, setSynthesis] = useState<any>(null);
  const [showDonationMessage, setShowDonationMessage] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  
  // Web Audio API state
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [processingChain, setProcessingChain] = useState<VoiceProcessingChain | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [audioQuality, setAudioQuality] = useState<AudioQualityMetrics>({
    clarity: 0,
    presence: 0,
    brightness: 0,
    balance: 0
  });

  const { toast } = useToast();
  const { currentUser, isLoggedIn } = useUser();
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Web Audio API and speech systems
  useEffect(() => {
    if (typeof window !== "undefined") {
      initializeAudioSystems();
    }
  }, [toast]);

  // Initialize welcome message when dialog opens
  useEffect(() => {
    if (isDialogOpen && messages.length === 0) {
      const userName = currentUser?.name || "recruit";
      const welcomeText = isLoggedIn 
        ? `🎖️ Greetings, ${userName}! I'm Sgt. Ken, your AI recruiter for the San Francisco Deputy Sheriff's Department. Ready to serve your community? Let's talk!`
        : "🎖️ Greetings, recruit! I'm Sgt. Ken, your AI recruiter for the San Francisco Deputy Sheriff's Department. Ready to serve your community? Let's talk!";
      
      const welcomeMessage: Message = {
        id: uuidv4(),
        sender: "ken",
        text: welcomeText,
        timestamp: new Date(),
      };
      
      setMessages([welcomeMessage]);
      
      // Auto-speak welcome message if sound is enabled
      if (synthesis && soundEnabled) {
        setTimeout(() => speakText(welcomeText, welcomeMessage.id), 1000);
      }
    }
  }, [isDialogOpen, currentUser, isLoggedIn, synthesis, soundEnabled, messages.length]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show donation message occasionally
  useEffect(() => {
    if (isLoggedIn && messageCount > 0 && messageCount % 5 === 0 && Math.random() < 0.3) {
      setShowDonationMessage(true);
      setTimeout(() => setShowDonationMessage(false), 8000);
    }
  }, [messageCount, isLoggedIn]);

  function handleOpen() {
    setIsDialogOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  }

  function handleClose() {
    setIsDialogOpen(false);
    // Stop any ongoing speech
    if (synthesis) {
      synthesis.cancel();
      setIsSpeaking(false);
    }
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  function startListening() {
    if (!isLoggedIn) {
      toast({
        title: "Sign in required",
        description: "Please sign in to use voice input.",
        variant: "default",
      });
      return;
    }

    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
      toast({
        title: "🎤 Listening...",
        description: "Speak now, I'm listening!",
      });
    }
  }

  function stopListening() {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }

  // Analyze audio quality in real-time
  const analyzeAudioQuality = (): AudioQualityMetrics => {
    if (!processingChain) {
      return { clarity: 0, presence: 0, brightness: 0, balance: 0 };
    }

    const analyzer = processingChain.analyzer;
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyzer.getByteFrequencyData(dataArray);

    // Analyze different frequency bands for voice quality
    const bassRange = dataArray.slice(0, 85);
    const midRange = dataArray.slice(85, 255);
    const highRange = dataArray.slice(255);

    const bassAvg = bassRange.reduce((a, b) => a + b) / bassRange.length;
    const midAvg = midRange.reduce((a, b) => a + b) / midRange.length;
    const highAvg = highRange.reduce((a, b) => a + b) / highRange.length;

    return {
      clarity: midAvg / (bassAvg + 1), // Higher = clearer voice
      presence: midAvg / 255 * 100,   // Voice presence percentage
      brightness: highAvg / 255 * 100, // High frequency content
      balance: Math.abs(bassAvg - highAvg) / 255 * 100 // Frequency balance
    };
  };

  // Adjust processing chain based on personality context
  const adjustProcessingForPersonality = (personality: any) => {
    if (!processingChain || !audioContext) return;

    const currentTime = audioContext.currentTime;

    if (personality.isUrgent) {
      // More compression and presence for urgent speech
      processingChain.compressor.ratio.setValueAtTime(12, currentTime);
      processingChain.midPeak.gain.setValueAtTime(6, currentTime);
      processingChain.masterGain.gain.setValueAtTime(0.9, currentTime);
      
      // Shorter reverb for urgency
      createReverbBuffer(audioContext, 0.8).then(buffer => {
        processingChain.reverb.buffer = buffer;
      });
    } else if (personality.isStorytelling) {
      // Warmer, more spacious sound for storytelling
      processingChain.compressor.ratio.setValueAtTime(4, currentTime);
      processingChain.lowShelf.gain.setValueAtTime(-1, currentTime);
      processingChain.masterGain.gain.setValueAtTime(0.8, currentTime);
      
      // Longer reverb for storytelling
      createReverbBuffer(audioContext, 2.5).then(buffer => {
        processingChain.reverb.buffer = buffer;
      });
    } else if (personality.isEncouraging) {
      // Brighter, more energetic sound
      processingChain.highShelf.gain.setValueAtTime(4, currentTime);
      processingChain.midPeak.gain.setValueAtTime(5, currentTime);
      processingChain.masterGain.gain.setValueAtTime(0.85, currentTime);
    } else {
      // Reset to default professional settings
      processingChain.compressor.ratio.setValueAtTime(8, currentTime);
      processingChain.lowShelf.gain.setValueAtTime(-3, currentTime);
      processingChain.midPeak.gain.setValueAtTime(4, currentTime);
      processingChain.highShelf.gain.setValueAtTime(2, currentTime);
      processingChain.masterGain.gain.setValueAtTime(0.8, currentTime);
    }

    console.log('🎛️ Audio processing adjusted for personality:', {
      urgent: personality.isUrgent,
      storytelling: personality.isStorytelling,
      encouraging: personality.isEncouraging
    });
  };

  // Advanced voice personality system
  const getVoicePersonality = (text: string) => {
    const textLower = text.toLowerCase();
    
    // Detect conversation context for voice adaptation
    const isStorytelling = /\b(story|experience|remember|years ago|back when)\b/i.test(text);
    const isEncouraging = /\b(you can|believe|potential|capable|succeed|achieve)\b/i.test(text);
    const isExplaining = /\b(because|since|the reason|let me explain|here's how)\b/i.test(text);
    const isUrgent = /\b(now|immediately|urgent|important|don't wait|act fast)\b/i.test(text);
    const isPersonal = /\b(your|you're|between you and me|personally|honestly)\b/i.test(text);
    
    return {
      isStorytelling,
      isEncouraging,
      isExplaining,
      isUrgent,
      isPersonal,
      baseRate: 0.95,   // Faster talking speed while maintaining authority
      basePitch: 0.4    // Keep the extremely deep voice tone
    };
  };

  // Enhanced speech function with Web Audio API processing
  async function speakTextWithAudioProcessing(text: string, messageId?: string) {
    if (!synthesis || !soundEnabled) return;

    try {
      // Get voice personality for this text
      const personality = getVoicePersonality(text);
      
      // Adjust audio processing based on personality
      if (audioInitialized && processingChain) {
        adjustProcessingForPersonality(personality);
      }

      // Ultra-advanced text processing for human-like speech
      const processedText = preprocessTextForSpeech(text, personality);
      
      if (!processedText) return;

      // Create utterance with enhanced parameters
      const utterance = new SpeechSynthesisUtterance(processedText);
      configureVoiceParameters(utterance, personality);
      
      // If Web Audio API is available, use enhanced processing
      if (audioInitialized && audioContext && processingChain) {
        await playWithWebAudioProcessing(utterance, messageId);
      } else {
        // Fallback to standard speech synthesis
        await playWithStandardSynthesis(utterance, messageId);
      }

    } catch (error) {
      console.error('🚫 Enhanced speech failed, using fallback:', error);
      // Fallback to original implementation
      speakText(text, messageId);
    }
  }

  // Play audio through Web Audio API processing chain
  const playWithWebAudioProcessing = async (utterance: SpeechSynthesisUtterance, messageId?: string) => {
    return new Promise<void>((resolve, reject) => {
      if (!audioContext || !processingChain) {
        reject(new Error('Audio context not available'));
        return;
      }

      // Create a temporary audio element for capturing speech synthesis
      const tempAudio = new Audio();

      utterance.onstart = () => {
        console.log('🔊 Enhanced speech started with Web Audio processing');
        setIsSpeaking(true);
        if (messageId) setSpeakingMessageId(messageId);

        // Start real-time audio quality monitoring
        const monitorQuality = () => {
          if (isSpeaking) {
            const quality = analyzeAudioQuality();
            setAudioQuality(quality);
            requestAnimationFrame(monitorQuality);
          }
        };
        monitorQuality();
      };

      utterance.onend = () => {
        console.log('🔇 Enhanced speech ended');
        setIsSpeaking(false);
        setSpeakingMessageId(null);
        
        // Audio processing cleanup handled by Web Audio API
        
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('🚫 Enhanced speech error:', event.error);
        setIsSpeaking(false);
        setSpeakingMessageId(null);
        reject(event);
      };

      // Use the speech synthesis with Web Audio API enhancement
      synthesis?.speak(utterance);
    });
  };

  // Fallback to standard speech synthesis
  const playWithStandardSynthesis = async (utterance: SpeechSynthesisUtterance, messageId?: string) => {
    return new Promise<void>((resolve, reject) => {
      utterance.onstart = () => {
        console.log('🔊 Standard speech started');
        setIsSpeaking(true);
        if (messageId) setSpeakingMessageId(messageId);
      };

      utterance.onend = () => {
        console.log('🔇 Standard speech ended');
        setIsSpeaking(false);
        setSpeakingMessageId(null);
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('🚫 Standard speech error:', event.error);
        setIsSpeaking(false);
        setSpeakingMessageId(null);
        reject(event);
      };

      synthesis?.speak(utterance);
    });
  };

  // Preprocess text for optimal speech synthesis
  const preprocessTextForSpeech = (text: string, personality: any): string => {
    const processedText = text
        // Remove emojis and special characters
        .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/g, '')
        .replace(/🎖️|🎖|🏅|🎗️|🎗|⭐|🌟|💫|✨/g, '')
        // Replace abbreviations with natural pronunciations
        .replace(/SFDSA/g, "San Francisco Deputy Sheriffs' Association")
        .replace(/SFSO/g, "San Francisco Sheriff's Office")
        .replace(/\bSF\b/g, "San Francisco")
        .replace(/\bUS\b/g, "United States")
        .replace(/\bUSA\b/g, "United States of America")
        .replace(/\bCA\b/g, "California")
        .replace(/\bDept\b/g, "Department")
        .replace(/\bGov\b/g, "Government")
        // Add natural hesitations and speech patterns for realism
        .replace(/\bListen,?\s*/gi, 'Listen, ')
        .replace(/\bHey,?\s*/gi, 'Hey ')
        .replace(/\bYou know,?\s*/gi, 'You know, ')
        .replace(/\bBetween you and me,?\s*/gi, 'Between you and me, ')
        .replace(/\bTo be honest,?\s*/gi, 'To be honest, ')
        .replace(/\bLet me tell you,?\s*/gi, 'Let me tell you, ')
        // Add natural speech disfluencies for authenticity
        .replace(/\b(I think|I believe|I feel)\b/gi, '$1, uh, ')
        .replace(/\b(Actually|Really|Honestly)\b/gi, '$1, ')
        // Improve natural pauses and breathing with varied timing
        .replace(/\.\s+/g, personality.isStorytelling ? '... ' : '. ')
        .replace(/!\s+/g, personality.isUrgent ? '! ' : '! ')
        .replace(/\?\s+/g, '? ')
        .replace(/,\s+/g, ', ')
        .replace(/:\s+/g, ': ')
        .replace(/;\s+/g, '; ')
        .replace(/\s+-\s+/g, ' - ')
        // Enhanced emotional and contextual replacements
        .replace(/\$/g, 'dollars ')
        .replace(/&/g, ' and ')
        .replace(/@/g, ' at ')
        .replace(/%/g, ' percent')
        .replace(/\bvs\b/gi, 'versus')
        .replace(/\be\.g\./gi, 'for example')
        .replace(/\bi\.e\./gi, 'that is')
        .replace(/\betc\./gi, 'and so on')
        .replace(/\bw\//gi, 'with')
        .replace(/\bw\/o\b/gi, 'without')
        // Smart number and currency handling
        .replace(/\$(\d{1,3}(?:,\d{3})*)/g, '$1 dollars')
        .replace(/(\d+)-(\d+)/g, '$1 to $2')
        .replace(/(\d+)k\b/gi, '$1 thousand')
        .replace(/(\d+)K\b/g, '$1 thousand')
        .replace(/(\d+)%/g, '$1 percent')
        .replace(/24\/7/g, 'twenty-four seven')
        .replace(/9\/11/g, 'nine eleven')
        // Context-aware emphasis based on personality
        .replace(/\b(excellent|amazing|outstanding|incredible|fantastic|awesome)\b/gi, 
          personality.isEncouraging ? 'absolutely $1' : 'really $1')
        .replace(/\b(important|crucial|critical|essential)\b/gi, 
          personality.isUrgent ? 'extremely $1' : 'really $1')
        .replace(/\b(great|good)\b/gi, personality.isPersonal ? 'really $1' : '$1')
        // Professional law enforcement pronunciations
        .replace(/\bLEO\b/gi, 'Law Enforcement Officer')
        .replace(/\bPOST\b/gi, 'Peace Officer Standards and Training')
        .replace(/\bDUI\b/gi, 'driving under the influence')
        .replace(/\bDWI\b/gi, 'driving while intoxicated')
        .replace(/\bCPR\b/gi, 'cardiopulmonary resuscitation')
        .replace(/\bEMT\b/gi, 'Emergency Medical Technician')
        .replace(/\bSwat\b/gi, 'Special Weapons and Tactics')
        .replace(/\bK9\b/gi, 'canine unit')
        // Add natural conversation flow with personality adaptation
        .replace(/([.!?])\s*([A-Z])/g, '$1 $2')
        .replace(/\b(Well|Now|So|And|But)\b/gi, (match) => match.toLowerCase() + ',')
        // Add storytelling elements for narrative content
        .replace(/\b(remember|back then|years ago)\b/gi, 
          personality.isStorytelling ? '$1... ' : '$1 ')
        // Clean up and normalize
        .replace(/\s+/g, ' ')
        .replace(/\.\.\.\s+/g, '... ')
        .replace(/,\s*,/g, ',')
        .trim();

    return processedText;
  };

  // Configure voice parameters based on personality
  const configureVoiceParameters = (utterance: SpeechSynthesisUtterance, personality: any) => {
    // Advanced dynamic voice modulation system
    const isExcited = /\b(amazing|incredible|fantastic|awesome|excellent|outstanding)\b/i.test(utterance.text);
    const isSerious = /\b(important|serious|critical|safety|training|requirements)\b/i.test(utterance.text);
    const isWelcoming = /\b(hey|welcome|hello|hi there|good|great)\b/i.test(utterance.text);
    const isQuestion = utterance.text.includes('?');
    
    // Sophisticated voice parameter calculation based on multiple factors
    let baseRate = personality.baseRate;
    let basePitch = personality.basePitch;
    
    // Apply personality-based modulations
    if (personality.isStorytelling) {
      baseRate *= 0.9; // Slower for storytelling
      basePitch *= 0.95; // Slightly lower for narrative authority
    }
    
    if (personality.isEncouraging) {
      baseRate *= 1.05; // Slightly faster for enthusiasm
      basePitch *= 1.02; // Slightly higher for positivity
    }
    
    if (personality.isExplaining) {
      baseRate *= 0.92; // Slower for clarity
      basePitch *= 0.98; // Slightly lower for teaching tone
    }
    
    if (personality.isUrgent) {
      baseRate *= 1.1; // Faster for urgency
      basePitch *= 1.03; // Slightly higher for alertness
    }
    
    if (personality.isPersonal) {
      baseRate *= 0.95; // Slower for intimacy
      basePitch *= 0.97; // Slightly warmer tone
    }
    
    // Apply emotion-based final adjustments with EXTREMELY DEEP voice
    utterance.rate = isExcited ? baseRate * 1.1 : isSerious ? baseRate * 0.9 : baseRate * 1.0; // Faster talking speed
    utterance.pitch = isExcited ? basePitch * 0.85 : isSerious ? basePitch * 0.7 : isWelcoming ? basePitch * 0.8 : basePitch * 0.75; // Keep extremely deep voice
    utterance.volume = 1.0; // Consistent clear volume

    // Set the best available voice
    const voices = synthesis?.getVoices() || [];
    const preferredVoice = voices.find((voice: any) => {
      const name = voice.name.toLowerCase();
      const lang = voice.lang.toLowerCase();
      
      // Top priority: Neural/AI voices (most human-like)
      if (name.includes('neural') || name.includes('wavenet') || name.includes('studio') || 
          name.includes('journey') || name.includes('alloy') || name.includes('echo') ||
          name.includes('nova') || name.includes('shimmer')) {
        return lang.startsWith('en');
      }
      
      // High priority: Premium/Enhanced voices
      if (name.includes('premium') || name.includes('enhanced') || name.includes('natural') ||
          name.includes('hd') || name.includes('plus')) {
        return lang.startsWith('en');
      }
      
      return false;
    }) || voices.find((voice: any) => {
      const name = voice.name.toLowerCase();
      const lang = voice.lang.toLowerCase();
      
      // Medium priority: Specific high-quality named voices
      if (name.includes('david') || name.includes('alex') || name.includes('daniel') || 
          name.includes('tom') || name.includes('mark') || name.includes('ryan') ||
          name.includes('brian') || name.includes('justin') || name.includes('matthew') ||
          name.includes('rishi') || name.includes('aaron')) {
        return lang.startsWith('en');
      }
      
      return false;
    }) || voices.find((voice: any) => 
      // Final fallback: Any English voice
      voice.lang.toLowerCase().startsWith('en')
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
      console.log('🎙️ Selected voice:', preferredVoice.name, preferredVoice.lang);
    }

    console.log('🎭 Voice configured with personality:', {
      storytelling: personality.isStorytelling,
      encouraging: personality.isEncouraging,
      explaining: personality.isExplaining,
      urgent: personality.isUrgent,
      personal: personality.isPersonal,
      finalRate: utterance.rate,
      finalPitch: utterance.pitch
    });
  };

  // Resume AudioContext if needed (requires user gesture)
  const resumeAudioContextIfNeeded = async () => {
    if (audioContext && audioContext.state === 'suspended') {
      try {
        await audioContext.resume();
        console.log('🎵 AudioContext resumed successfully');
        
        // Initialize processing chain if not already done
        if (!processingChain) {
          const chain = createVoiceProcessingChain(audioContext);
          setProcessingChain(chain);
          setAudioInitialized(true);
          console.log('🎵 Audio processing chain initialized');
        }
      } catch (error) {
        console.error('❌ Failed to resume AudioContext:', error);
      }
    }
  };

  // Original speakText function for backward compatibility
  function speakText(text: string, messageId?: string) {
    console.log('🔊 speakText called with:', { 
      text: text?.substring(0, 50) + '...', 
      messageId, 
      synthesis: !!synthesis, 
      isSpeaking, 
      soundEnabled 
    });
    console.log('🔍 Detailed state:', {
      synthesisDefined: typeof synthesis,
      isSpeakingValue: isSpeaking,
      soundEnabledValue: soundEnabled,
      audioInitializedValue: audioInitialized,
      textLength: text?.length
    });
    
    if (synthesis && !isSpeaking && soundEnabled) {
      console.log('✅ All conditions met, proceeding with speech');
      
      // Resume AudioContext if needed (user gesture)
      resumeAudioContextIfNeeded();
      
      // Cancel any ongoing speech first
      synthesis.cancel();
      
      // Use enhanced processing if available
      if (audioInitialized) {
        speakTextWithAudioProcessing(text, messageId);
        return;
      }
      
      // Fallback to original implementation
      const personality = getVoicePersonality(text);
      const processedText = preprocessTextForSpeech(text, personality);
      
      if (!processedText) return;
      
      const utterance = new SpeechSynthesisUtterance(processedText);
      configureVoiceParameters(utterance, personality);
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        if (messageId) setSpeakingMessageId(messageId);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      };
      
      utterance.onerror = (event) => {
        console.error('🚫 Speech error:', event.error);
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      };
      
      synthesis.speak(utterance);
    } else {
      console.log('❌ Speech conditions not met:', {
        synthesis: !!synthesis,
        isSpeaking,
        soundEnabled,
        reason: !synthesis ? 'No synthesis' : isSpeaking ? 'Already speaking' : !soundEnabled ? 'Sound disabled' : 'Unknown'
      });
    }
  }

  // Audio quality display component
  const AudioQualityIndicator = () => {
    if (!audioInitialized) return null;
    
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${audioInitialized ? 'bg-primary' : 'bg-muted-foreground'}`} />
          <span>Web Audio {audioInitialized ? 'Active' : 'Inactive'}</span>
        </div>
        {audioInitialized && (
          <div className="flex gap-2">
            <span>Clarity: {Math.round(audioQuality.clarity)}%</span>
            <span>Presence: {Math.round(audioQuality.presence)}%</span>
          </div>
        )}
      </div>
    );
  };

  function stopSpeaking() {
    if (synthesis) {
      synthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      sender: "user",
      text: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setMessageCount(prev => prev + 1);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.text,
          userId: currentUser?.id,
          isSignedIn: isLoggedIn,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      
      const responseText = data.response || data.message || "I'm here to help! What would you like to know about becoming a San Francisco Deputy Sheriff?";
      
      const kenMessage: Message = {
        id: uuidv4(),
        sender: "ken",
        text: responseText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, kenMessage]);
      
      // Auto-speak Ken's response if sound is enabled (use the actual response text)
      if (synthesis && responseText && soundEnabled) {
        console.log('🎤 Attempting to speak response:', responseText);
        setTimeout(() => speakText(responseText, kenMessage.id), 500);
      } else {
        console.log('🔇 Not speaking response - synthesis:', !!synthesis, 'response:', !!responseText, 'soundEnabled:', soundEnabled);
      }
      
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: uuidv4(),
        sender: "ken",
        text: "Sorry, I'm having technical difficulties. Please try again or contact our support team.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleQuickReply(reply: string) {
    console.log('🎯 handleQuickReply called with:', reply);
    if (isLoading) {
      console.log('⏳ Quick reply blocked - already loading');
      return;
    }
    
    // Remove emoji from the actual message sent to API
    const cleanReply = reply.replace(/^[^\w\s]*\s*/, '').trim();
    console.log('🧹 Cleaned reply:', cleanReply);
    
    const userMessage: Message = {
      id: uuidv4(),
      sender: "user",
      text: cleanReply,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setMessageCount(prev => prev + 1);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: cleanReply,
          userId: currentUser?.id,
          isSignedIn: isLoggedIn,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      
      const responseText = data.response || data.message || "I'm here to help! What would you like to know about becoming a San Francisco Deputy Sheriff?";
      
      const kenMessage: Message = {
        id: uuidv4(),
        sender: "ken",
        text: responseText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, kenMessage]);
      
      // Auto-speak Ken's response if sound is enabled
      if (synthesis && responseText && soundEnabled) {
        setTimeout(() => speakText(responseText, kenMessage.id), 500);
      }
      
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: uuidv4(),
        sender: "ken",
        text: "Sorry, I'm having technical difficulties. Please try again or contact our support team.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const quickReplies = isLoggedIn 
    ? [
        "💰 Tell me about benefits",
        "📋 How do I apply?",
        "🎓 Training information",
        "🚀 Career advancement opportunities"
      ]
    : [
        "❓ How does this page work?",
        "🏛️ Tell me about SFDSA",
        "📋 How do I apply?",
        "📝 What are the requirements?"
      ];

  // Initialize all audio systems
  const initializeAudioSystems = async () => {
    try {
      // Initialize Web Audio API
      await initializeWebAudioAPI();
      
      // Initialize Speech Synthesis
      if (window.speechSynthesis) {
        setSynthesis(window.speechSynthesis);
      }

      // Initialize Speech Recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';
        recognitionInstance.maxAlternatives = 1;

        recognitionInstance.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setInput(finalTranscript);
            setIsListening(false);
          }
        };

        recognitionInstance.onerror = (event: any) => {
          console.error('🎤 Speech recognition error:', event.error);
          setIsListening(false);
          
          switch (event.error) {
            case 'no-speech':
              toast({
                title: "No speech detected",
                description: "Please try speaking again.",
                variant: "default",
              });
              break;
            case 'not-allowed':
              toast({
                title: "Microphone access denied",
                description: "Please allow microphone access and try again.",
                variant: "destructive",
              });
              break;
            default:
              toast({
                title: "Speech recognition error",
                description: `Error: ${event.error}`,
                variant: "destructive",
              });
          }
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      }

      console.log('🎵 All audio systems initialized successfully');
    } catch (error) {
      console.error('❌ Audio systems initialization failed:', error);
      toast({
        title: "Audio initialization failed",
        description: "Some audio features may not work properly.",
        variant: "destructive",
      });
    }
  };

  // Initialize Web Audio API with professional voice processing
  const initializeWebAudioAPI = async () => {
    try {
      // Create audio context with optimal settings
      const context = new (window.AudioContext || (window as any).webkitAudioContext)({
        latencyHint: 'interactive',
        sampleRate: 44100
      });

      // Resume context if suspended (browser autoplay policy)
      if (context.state === 'suspended') {
        console.log('🎵 AudioContext suspended, will resume on user interaction');
        // Don't try to resume here - wait for user gesture
        setAudioContext(context);
        return;
      }

      // Create professional voice processing chain
      const chain = createVoiceProcessingChain(context);
      
      setAudioContext(context);
      setProcessingChain(chain);
      setAudioInitialized(true);

      console.log('🎵 Web Audio API initialized with professional voice processing');
    } catch (error) {
      console.error('❌ Web Audio API initialization failed:', error);
      // Continue without Web Audio API enhancement
    }
  };

  // Create professional voice processing chain
  const createVoiceProcessingChain = (context: AudioContext): VoiceProcessingChain => {
    // Create audio nodes for professional voice processing
    const compressor = context.createDynamicsCompressor();
    const lowShelf = context.createBiquadFilter();
    const midPeak = context.createBiquadFilter();
    const highShelf = context.createBiquadFilter();
    const reverb = context.createConvolver();
    const masterGain = context.createGain();
    const analyzer = context.createAnalyser();

    // Configure compressor for voice clarity and consistency
    compressor.threshold.setValueAtTime(-24, context.currentTime);
    compressor.knee.setValueAtTime(30, context.currentTime);
    compressor.ratio.setValueAtTime(8, context.currentTime);
    compressor.attack.setValueAtTime(0.003, context.currentTime);
    compressor.release.setValueAtTime(0.25, context.currentTime);

    // Low shelf: Reduce mud and rumble (100-300Hz)
    lowShelf.type = 'lowshelf';
    lowShelf.frequency.setValueAtTime(200, context.currentTime);
    lowShelf.gain.setValueAtTime(-3, context.currentTime);

    // Mid peak: Enhance voice presence and clarity (1-3kHz)
    midPeak.type = 'peaking';
    midPeak.frequency.setValueAtTime(2000, context.currentTime);
    midPeak.Q.setValueAtTime(1.5, context.currentTime);
    midPeak.gain.setValueAtTime(4, context.currentTime);

    // High shelf: Add air and sparkle (8kHz+)
    highShelf.type = 'highshelf';
    highShelf.frequency.setValueAtTime(8000, context.currentTime);
    highShelf.gain.setValueAtTime(2, context.currentTime);

    // Configure analyzer for real-time audio analysis
    analyzer.fftSize = 2048;
    analyzer.smoothingTimeConstant = 0.8;

    // Create reverb buffer for natural spaciousness
    createReverbBuffer(context).then(buffer => {
      reverb.buffer = buffer;
    });

    // Chain the audio nodes: Input -> Compressor -> EQ -> Reverb -> Gain -> Analyzer -> Output
    compressor.connect(lowShelf);
    lowShelf.connect(midPeak);
    midPeak.connect(highShelf);
    highShelf.connect(reverb);
    reverb.connect(masterGain);
    masterGain.connect(analyzer);
    analyzer.connect(context.destination);

    // Set master gain
    masterGain.gain.setValueAtTime(0.8, context.currentTime);

    console.log('🎛️ Professional voice processing chain created');

    return {
      input: compressor,
      output: masterGain,
      compressor,
      lowShelf,
      midPeak,
      highShelf,
      reverb,
      masterGain,
      analyzer
    };
  };

  // Create reverb buffer for natural voice ambience
  const createReverbBuffer = async (context: AudioContext, duration: number = 1.5): Promise<AudioBuffer> => {
    const sampleRate = context.sampleRate;
    const length = sampleRate * duration;
    const buffer = context.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        // Create exponentially decaying white noise for natural reverb
        const decay = Math.pow(1 - i / length, 2);
        channelData[i] = (Math.random() * 2 - 1) * decay * 0.2;
      }
    }

    return buffer;
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleOpen}
        aria-label="Ask Sgt. Ken - Chat with AI Recruiter"
        className={className}
      >
        Ask Sgt. Ken
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[90vw] max-w-3xl h-[75vh] flex flex-col p-0 overflow-hidden bg-background/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl" style={{
          boxShadow: `
            0 0 0 1px hsl(var(--border)) inset,
            0 0 30px hsl(var(--primary) / 0.15),
            0 15px 40px hsl(var(--background) / 0.8),
            0 0 60px hsl(var(--accent) / 0.1)
          `,
          backdropFilter: 'blur(20px) saturate(120%)'
        }}>
          <VisuallyHidden>
            <DialogTitle>Chat with Sgt. Ken - SFDSA AI Recruiter</DialogTitle>
          </VisuallyHidden>
          
          {/* Professional Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Subtle floating elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-radial from-primary/10 to-transparent rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-16 h-16 bg-gradient-radial from-accent/8 to-transparent rounded-full animate-ping"></div>
            <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-gradient-radial from-primary/8 to-transparent rounded-full animate-bounce"></div>
            
            {/* Subtle mesh gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-muted/3 to-accent/2 animate-pulse"></div>
          </div>
          
          {/* Professional Law Enforcement Header */}
          <div className="relative bg-primary dark:bg-card/90 backdrop-blur-xl border-b border-border overflow-hidden">
            {/* Subtle background effects */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/3 to-primary/5"></div>
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-radial from-primary/5 to-transparent rounded-full"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-radial from-accent/5 to-transparent rounded-full"></div>
            </div>
            
            <div className="relative z-10 flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  {/* Professional avatar container */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-foreground to-primary-foreground/80 dark:from-primary dark:to-accent p-0.5 shadow-xl">
                    <div className="w-full h-full rounded-xl bg-primary dark:bg-card backdrop-blur-sm flex items-center justify-center border border-primary-foreground dark:border-border group-hover:scale-105 transition-transform duration-300">
                      <Shield className="w-6 h-6 text-primary-foreground dark:text-primary drop-shadow-lg" />
                    </div>
                  </div>
                  
                  {/* Professional status indicators */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-accent opacity-20"></div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full border-2 border-card shadow-lg flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-card rounded-full"></div>
                  </div>
                </div>
                
                <div className="space-y-0.5">
                  <h2 className="text-xl font-bold text-primary-foreground dark:text-foreground flex items-center gap-2">
                    <span className="text-primary-foreground dark:bg-gradient-to-r dark:from-primary dark:to-accent dark:bg-clip-text dark:text-transparent drop-shadow-sm">
                      Sgt. Ken AI
                    </span>
                    <Badge className="text-xs bg-primary-foreground/20 text-primary-foreground dark:bg-primary/20 dark:text-primary border border-primary-foreground/30 dark:border-primary/30 backdrop-blur-sm px-2 py-0.5">
                      <div className="w-1.5 h-1.5 bg-primary-foreground dark:bg-primary rounded-full animate-pulse mr-1"></div>
                      ONLINE
                    </Badge>
                  </h2>
                  <p className="text-primary-foreground/80 dark:text-muted-foreground font-medium flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 bg-primary-foreground dark:bg-primary rounded-full animate-pulse"></span>
                    {isLoggedIn ? `Ready to serve, ${currentUser?.name || 'Deputy'}!` : 'Your AI Recruiter • San Francisco Sheriff'}
                  </p>
                </div>
              </div>
              {/* Enhanced Control Panel */}
              <div className="flex items-center gap-3">
                {/* Control buttons with glass morphism */}
                <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-xl p-2 border border-border shadow-lg">
                  {/* Test Speech Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      console.log('🧪 Test speech button clicked');
                      speakText("Hello! This is Sergeant Ken testing the speech system. Can you hear me?");
                    }}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent/20 hover:scale-110 transition-all duration-300 text-xs font-medium px-3 py-1 rounded-lg backdrop-blur-sm"
                    aria-label="Test speech"
                  >
                    Test Voice
                  </Button>
                  
                  {/* Sound toggle button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent/20 hover:scale-110 transition-all duration-300 rounded-lg backdrop-blur-sm"
                    aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                 
                {/* Action buttons with enhanced styling */}
                <div className="flex items-center gap-2">
                  <Link href="/donate">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border border-amber-300 hover:scale-105 transition-all duration-300 font-semibold px-4 py-2 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl"
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      Support
                    </Button>
                  </Link>
                  <Link href="/daily-briefing">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border border-blue-300 hover:scale-105 transition-all duration-300 font-semibold px-4 py-2 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl"
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      Briefing
                    </Button>
                  </Link>
                </div>
                
                {/* Close button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleClose} 
                  className="text-muted-foreground hover:text-foreground hover:bg-destructive/20 hover:scale-110 transition-all duration-300 rounded-xl backdrop-blur-sm border border-border shadow-lg"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Messages Area with Solid Charcoal Background */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 relative bg-background">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 animate-slide-in-${message.sender === "ken" ? "left" : "right"}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {message.sender === "ken" && (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5 shadow-xl flex-shrink-0">
                    <div className="w-full h-full rounded-xl bg-card backdrop-blur-sm flex items-center justify-center border border-border">
                      <Shield className="w-5 h-5 text-primary drop-shadow-lg" />
                    </div>
                  </div>
                )}
                                  <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-xl backdrop-blur-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01] border ${
                    message.sender === "ken"
                      ? "bg-muted/50 text-foreground border-border ml-0 mr-auto"
                      : "bg-primary/20 text-foreground border-primary/30 ml-auto mr-0"
                  }`}
                  style={{
                    background: message.sender === "ken" 
                      ? `hsl(var(--muted) / 0.5)`
                      : `hsl(var(--primary) / 0.2)`,
                    boxShadow: message.sender === "ken"
                      ? '0 4px 12px hsl(var(--muted) / 0.3), 0 0 0 1px hsl(var(--border)) inset'
                      : '0 4px 12px hsl(var(--primary) / 0.3), 0 0 0 1px hsl(var(--primary) / 0.3) inset'
                  }}
                >
                  <p className="text-sm font-medium leading-relaxed">{message.text}</p>
                  
                  {/* Apply Now Button - Show when Sgt. Ken mentions /apply */}
                  {message.sender === "ken" && (
                    message.text.includes("/apply") || 
                    message.text.toLowerCase().includes("application") ||
                    message.text.toLowerCase().includes("apply") ||
                    message.text.toLowerCase().includes("get started") ||
                    message.text.toLowerCase().includes("join us") ||
                    message.text.toLowerCase().includes("career") ||
                    message.text.toLowerCase().includes("recruit")
                  ) && (
                                          <div className="mt-4 pt-4 border-t border-white/20">
                        <div className="relative">
                          <Link href="/apply" onClick={() => setIsDialogOpen(false)}>
                            <Button 
                              className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-1 animate-bounce-few border-2 border-amber-300 relative overflow-hidden group"
                            >
                              {/* Animated background glow */}
                              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"></div>
                              
                              {/* Shimmer effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
                              
                              <div className="relative z-10 flex items-center justify-center">
                                <Shield className="w-5 h-5 mr-2 animate-pulse" />
                                <span className="text-lg font-extrabold tracking-wide">Apply Now - Start Your Journey!</span>
                                <Zap className="w-5 h-5 ml-2 animate-pulse" />
                              </div>
                            </Button>
                          </Link>
                          
                          {/* Floating particles around button */}
                          <div className="absolute -top-2 -left-2 w-2 h-2 bg-amber-400 rounded-full animate-ping"></div>
                          <div className="absolute -top-1 -right-1 w-1 h-1 bg-orange-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                          <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-red-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                        </div>
                        
                        <p className="text-xs text-center mt-2 opacity-75 animate-pulse">
                          🎯 Your future as a deputy starts here!
                        </p>
                      </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                                         {message.sender === "ken" && (
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => {
                           if (speakingMessageId === message.id) {
                             stopSpeaking();
                           } else {
                             speakText(message.text, message.id);
                           }
                         }}
                         disabled={isSpeaking && speakingMessageId !== message.id}
                         className="p-1 h-6 w-6 hover:bg-white/20 transition-all duration-200"
                         aria-label={speakingMessageId === message.id ? "Stop reading" : "Read message aloud"}
                       >
                         {speakingMessageId === message.id ? (
                           <VolumeX className="w-3 h-3" />
                         ) : (
                           <Volume2 className="w-3 h-3" />
                         )}
                       </Button>
                     )}
                  </div>
                </div>
                {message.sender === "user" && (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-primary p-0.5 shadow-xl flex-shrink-0">
                    <div className="w-full h-full rounded-xl bg-card backdrop-blur-sm flex items-center justify-center border border-border">
                      <span className="text-sm font-bold text-foreground drop-shadow-lg">
                        {currentUser?.name?.[0] || "U"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5 shadow-xl">
                  <div className="w-full h-full rounded-xl bg-card backdrop-blur-sm flex items-center justify-center border border-border">
                    <Shield className="w-5 h-5 text-primary drop-shadow-lg animate-pulse" />
                  </div>
                </div>
                <div className="bg-muted/50 backdrop-blur-lg border border-border rounded-2xl px-4 py-3 shadow-xl">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce shadow-lg"></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
                         {/* Donation Message */}
             {showDonationMessage && isLoggedIn && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 animate-slide-in-bottom">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-amber-600 animate-pulse" />
                  <span className="font-semibold text-amber-800 dark:text-amber-200">Support Our Mission</span>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                  Your donation helps us serve and protect our community better. Every contribution makes a difference!
                </p>
                <Link href="/donate">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                    <Heart className="w-4 h-4 mr-1" />
                    Donate Now
                  </Button>
                </Link>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Buttons with 3D Effects */}
          <div className="px-6 py-4 border-t border-border bg-card/50 backdrop-blur-sm">
            <div className="flex flex-wrap gap-3 justify-center">
              {quickReplies.map((reply, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Quick reply clicked:', reply);
                    handleQuickReply(reply);
                  }}
                  disabled={isLoading}
                  className="group relative text-xs font-semibold transition-all duration-300 ease-out cursor-pointer select-none transform-gpu animate-bounce-in
                    /* 3D Base Styling */
                    bg-gradient-to-br from-white via-white/95 to-white/90
                    border-2 border-primary/40
                    text-primary
                    shadow-lg
                    
                    /* 3D Depth Effect */
                    before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-br before:from-primary/20 before:to-primary/40 before:translate-x-0.5 before:translate-y-0.5 before:-z-10 before:transition-all before:duration-300
                    
                    /* Hover Effects */
                    hover:scale-110 hover:rotate-1 hover:-translate-y-1
                    hover:shadow-2xl hover:shadow-primary/30
                    hover:bg-gradient-to-br hover:from-primary/10 hover:via-primary/5 hover:to-primary/15
                    hover:border-primary/60
                    hover:text-primary
                    hover:before:translate-x-1 hover:before:translate-y-1 hover:before:from-primary/30 hover:before:to-primary/50
                    
                    /* Active/Click Effects */
                    active:scale-105 active:translate-y-0 active:shadow-md
                    active:before:translate-x-0 active:before:translate-y-0
                    
                    /* Disabled State */
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:rotate-0 disabled:hover:translate-y-0
                    
                    /* Glow Effect */
                    after:absolute after:inset-0 after:rounded-md after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:opacity-0 after:transition-opacity after:duration-300
                    hover:after:opacity-100
                    
                    /* Ripple Effect */
                    overflow-hidden
                    "
                  style={{ 
                    pointerEvents: 'auto',
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    animationDelay: `${index * 0.1}s`,
                    // Custom 3D shadow
                    filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.15))',
                    // Enhanced border for 3D effect
                    borderStyle: 'solid',
                    borderImage: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(0,0,0,0.1), rgba(255,255,255,0.6)) 1'
                  }}
                  onMouseEnter={(e) => {
                    // Add ripple effect on hover
                    const button = e.currentTarget;
                    const ripple = document.createElement('div');
                    ripple.className = 'absolute inset-0 bg-gradient-radial from-primary/30 via-primary/10 to-transparent rounded-md animate-ripple pointer-events-none';
                    button.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 600);
                    
                    // Add glow effect
                    button.classList.add('animate-glow-pulse');
                  }}
                  onMouseLeave={(e) => {
                    // Remove glow effect
                    e.currentTarget.classList.remove('animate-glow-pulse');
                  }}
                >
                  {/* Shimmer effect overlay */}
                  <div className="absolute inset-0 rounded-md overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
                  </div>
                  
                  {/* Inner glow effect */}
                  <span className="relative z-10 flex items-center gap-1 px-3 py-2 font-bold tracking-wide">
                    {reply}
                  </span>
                  
                  {/* Animated border highlight */}
                  <div className="absolute inset-0 rounded-md border-2 border-primary/40 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:border-primary/60 group-hover:animate-pulse"></div>
                  
                  {/* Corner highlights for extra 3D effect */}
                  <div className="absolute top-0 left-0 w-2 h-2 bg-white/50 rounded-tl-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-black/20 rounded-br-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              ))}
            </div>
            
            {/* Floating particles effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-primary/20 rounded-full animate-float"
                  style={{
                    left: `${15 + i * 15}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${3 + i * 0.5}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Enhanced Input Area */}
          <form onSubmit={handleSubmit} className="relative border-t border-border bg-primary dark:bg-card/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 p-4">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={handleInput}
                  disabled={isLoading}
                  className="w-full rounded-full px-4 py-3 pr-12 border border-border bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 placeholder-muted-foreground/60"
                                     placeholder={isLoggedIn ? "Ask me anything about SFDSA..." : "Ask me how this page works..."}
                  aria-label="Type your message"
                />
                                 {/* Voice Input Button */}
                 {isLoggedIn && recognition && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={isListening ? stopListening : startListening}
                    disabled={isLoading}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full transition-all duration-200 ${
                      isListening ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'hover:bg-primary/10'
                    }`}
                    aria-label={isListening ? "Stop voice input" : "Start voice input"}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
              
              {/* Send Button */}
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="rounded-full h-12 w-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
                aria-label="Send message"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
              
              {/* Stop Speaking Button */}
              {isSpeaking && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={stopSpeaking}
                  className="rounded-full h-12 w-12 border-red-300 text-red-600 hover:bg-red-50 hover:scale-110 transition-all duration-200"
                  aria-label="Stop speaking"
                >
                  <VolumeX className="w-5 h-5" />
                </Button>
              )}
            </div>
          </form>
          
          {/* Audio Quality Indicator */}
          <div className="border-t border-border bg-card/60 backdrop-blur-sm px-4 py-2">
            <AudioQualityIndicator />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}