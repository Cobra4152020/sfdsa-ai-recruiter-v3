// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
      isFinal: boolean;
      length: number;
    };
    length: number;
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

export interface VoiceServiceConfig {
  enabled: boolean;
  autoSpeak: boolean;
  voiceRate: number;
  voicePitch: number;
  selectedVoice: string | null;
}

export class VoiceService {
  private synthesis: SpeechSynthesis | null = null;
  private recognition: any | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private config: VoiceServiceConfig = {
    enabled: true,
    autoSpeak: true,
    voiceRate: 1.15, // Increased speed for more dynamic delivery
    voicePitch: 0.9, // Higher pitch for less robotic sound
    selectedVoice: null,
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;
      this.loadVoices();
      
      // Initialize speech recognition if available
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.setupRecognition();
      }
    }
  }

  private loadVoices() {
    if (!this.synthesis) return;

    const updateVoices = () => {
      this.voices = this.synthesis!.getVoices();
      this.selectBestVoice();
    };

    // Load voices immediately if available
    updateVoices();

    // Also listen for voice loading event (some browsers load voices asynchronously)
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = updateVoices;
    }
  }

  private selectBestVoice() {
    if (this.voices.length === 0) return;

    // Look for highest quality natural voices first
    const preferredVoices = [
      // Premium/Enhanced voices (best quality)
      'Microsoft David - English (United States)',
      'Microsoft Zira - English (United States)', 
      'Microsoft Mark - English (United States)',
      'Google US English Male',
      'Google UK English Male',
      'Alex',
      'Daniel (Enhanced)',
      'Daniel',
      'Samantha',
      'Karen',
      'Moira',
      'Tessa',
      'Victoria',
    ];

    // First try to find premium voices by exact name match
    for (const preferredName of preferredVoices) {
      const voice = this.voices.find(v => v.name === preferredName);
      if (voice) {
        this.config.selectedVoice = voice.name;
        console.log(`🎙️ Selected premium voice for Sgt. Ken: ${voice.name}`);
        return;
      }
    }

    // Then try partial matches for enhanced voices
    const enhancedVoice = this.voices.find(v => 
      v.lang.includes('en') && (
        v.name.toLowerCase().includes('enhanced') ||
        v.name.toLowerCase().includes('premium') ||
        v.name.toLowerCase().includes('neural') ||
        v.name.toLowerCase().includes('david') ||
        v.name.toLowerCase().includes('mark') ||
        v.name.toLowerCase().includes('alex')
      )
    );

    if (enhancedVoice) {
      this.config.selectedVoice = enhancedVoice.name;
      console.log(`🎙️ Selected enhanced voice for Sgt. Ken: ${enhancedVoice.name}`);
      return;
    }

    // Fallback: Any high-quality English voice
    const qualityVoice = this.voices.find(v => 
      v.lang.includes('en-US') && 
      v.name.toLowerCase().includes('microsoft')
    );

    if (qualityVoice) {
      this.config.selectedVoice = qualityVoice.name;
      console.log(`🎙️ Selected quality voice for Sgt. Ken: ${qualityVoice.name}`);
      return;
    }

    // Final fallback: Any English voice
    const englishVoice = this.voices.find(v => v.lang.includes('en'));
    if (englishVoice) {
      this.config.selectedVoice = englishVoice.name;
      console.log(`🎙️ Selected English voice for Sgt. Ken: ${englishVoice.name}`);
    } else {
      // Last resort: use default voice
      this.config.selectedVoice = this.voices[0]?.name || null;
      console.log(`🎙️ Using default voice for Sgt. Ken: ${this.voices[0]?.name || 'none'}`);
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    // Configure speech recognition for better reliability
    this.recognition.continuous = true; // Keep listening until stopped
    this.recognition.interimResults = true; // Show results as user speaks
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1; // Reduce to 1 for better performance
    
    // Additional settings for better recognition
    try {
      // Some browsers support additional settings
      if ('grammars' in this.recognition) {
        this.recognition.grammars = null;
      }
      if ('serviceURI' in this.recognition) {
        // Use default service URI
        this.recognition.serviceURI = '';
      }
    } catch (e) {
      console.log('🎤 Some recognition settings not supported, using defaults');
    }
  }

  private preprocessTextForNaturalSpeech(text: string): string {
    let processedText = text;

    // Replace acronyms and abbreviations for better pronunciation
    processedText = processedText
      .replace(/\bSFDSA\b/g, "San Francisco Deputy Sheriffs' Association")
      .replace(/\bSF DSA\b/g, "San Francisco Deputy Sheriffs' Association")
      .replace(/\bSF-DSA\b/g, "San Francisco Deputy Sheriffs' Association");

    // Add natural pauses and emphasis
    processedText = processedText
      // Add pauses after greetings
      .replace(/(Hey there!|Hi!|Hello!)/g, '$1... ')
      .replace(/(Hey [^,!.]+[,!])/g, '$1... ')
      
      // Add emphasis on important words
      .replace(/\b(IMPORTANT|CRITICAL|REMEMBER|LISTEN)\b/g, '$1')
      .replace(/\b(San Francisco|SFSO|Deputy Sheriff)\b/g, '$1')
      
      // Make contractions more natural
      .replace(/\bdo not\b/g, "don't")
      .replace(/\bwill not\b/g, "won't") 
      .replace(/\bcannot\b/g, "can't")
      .replace(/\byou are\b/g, "you're")
      .replace(/\bit is\b/g, "it's")
      .replace(/\bthat is\b/g, "that's")
      .replace(/\bwe are\b/g, "we're")
      .replace(/\bthey are\b/g, "they're")
      
      // Add natural conversational elements
      .replace(/\. And /g, '. And, ')
      .replace(/\. But /g, '. But, ')
      .replace(/\. So /g, '. So, ')
      .replace(/\. Now /g, '. Now, ')
      
      // Add slight pauses for natural rhythm
      .replace(/: /g, ':... ')
      .replace(/; /g, ';... ')
      .replace(/\? /g, '?... ')
      .replace(/! /g, '!... ')
      
      // Make numbers more conversational
      .replace(/\$(\d+),(\d+)/g, '$$$1 thousand, $2')
      .replace(/\b15\+/g, 'fifteen plus')
      .replace(/\b(\d+)%/g, '$1 percent')
      
      // Clean up multiple periods
      .replace(/\.{4,}/g, '...')
      .replace(/\.\.\. \.\.\./g, '...');

    return processedText;
  }

  public speak(text: string, options?: Partial<VoiceServiceConfig>): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis || !this.config.enabled) {
        resolve();
        return;
      }

      // Stop any current speech
      this.synthesis.cancel();

      // Preprocess text for more natural speech
      const naturalText = this.preprocessTextForNaturalSpeech(text);
      
      // Split long text into smaller chunks for better synthesis
      const chunks = this.splitTextIntoChunks(naturalText, 200);
      
      const speakChunk = (chunkIndex: number) => {
        if (chunkIndex >= chunks.length) {
          resolve();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
        
        // Find the selected voice
        const selectedVoice = this.voices.find(v => v.name === this.config.selectedVoice);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        // Configure for natural voice
        utterance.rate = options?.voiceRate ?? this.config.voiceRate;
        utterance.pitch = options?.voicePitch ?? this.config.voicePitch;
        utterance.volume = 1.0; // Full volume for clarity

        // Add subtle variations for more natural speech
        const rateVariation = 0.02 * (Math.random() - 0.5); // ±1% variation
        const pitchVariation = 0.05 * (Math.random() - 0.5); // ±2.5% variation
        
        utterance.rate = Math.max(0.5, Math.min(2.0, utterance.rate + rateVariation));
        utterance.pitch = Math.max(0.1, Math.min(2.0, utterance.pitch + pitchVariation));

        utterance.onend = () => {
          // Add small pause between chunks
          setTimeout(() => speakChunk(chunkIndex + 1), 100);
        };
        
        utterance.onerror = (error) => {
          console.error('Speech synthesis error:', error);
          reject(error);
        };

        console.log(`🎙️ Speaking chunk ${chunkIndex + 1}/${chunks.length} with voice: ${selectedVoice?.name || 'default'} (Rate: ${utterance.rate.toFixed(2)}, Pitch: ${utterance.pitch.toFixed(2)})`);
        if (this.synthesis) {
          this.synthesis.speak(utterance);
        }
      };

      speakChunk(0);
    });
  }

  private splitTextIntoChunks(text: string, maxLength: number): string[] {
    if (text.length <= maxLength) return [text];

    const chunks: string[] = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    
    let currentChunk = '';
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (!trimmedSentence) continue;
      
      const sentenceWithPunctuation = trimmedSentence + (text.includes(trimmedSentence + '.') ? '.' : 
                                                         text.includes(trimmedSentence + '!') ? '!' : 
                                                         text.includes(trimmedSentence + '?') ? '?' : '.');
      
      if (currentChunk.length + sentenceWithPunctuation.length <= maxLength) {
        currentChunk += (currentChunk ? ' ' : '') + sentenceWithPunctuation;
      } else {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = sentenceWithPunctuation;
      }
    }
    
    if (currentChunk) chunks.push(currentChunk);
    return chunks.length > 0 ? chunks : [text];
  }

  public startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }
      const recognition = this.recognition;

      let finalTranscript = '';
      let interimTranscript = '';
      let listening = true;
      
      // Set up timeout for listening (30 seconds max)
      const timeout = setTimeout(() => {
        console.log('🎤 Timeout reached (30s)');
        if (listening) {
          listening = false;
          recognition.stop();
          const result = finalTranscript.trim() || interimTranscript.trim();
          console.log(`🎤 Timeout - returning: "${result}"`);
          resolve(result);
        }
      }, 30000); // 30 second timeout

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        console.log('🎤 Recognition result event fired, results count:', event.results.length, 'resultIndex:', event.resultIndex);
        
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          if (result && result[0]) {
            const transcript = result[0].transcript;
            if (result.isFinal) {
              finalTranscript += transcript + ' ';
              console.log(`🎤 Final transcript added: "${transcript}"`);
            } else {
              interim += transcript;
              console.log(`🎤 Interim transcript: "${transcript}"`);
            }
          }
        }
        interimTranscript = interim;
        console.log(`🎤 Final: "${finalTranscript.trim()}" | Interim: "${interimTranscript}"`);
      };

      recognition.onerror = (error: SpeechRecognitionErrorEvent) => {
        console.log(`🎤 Recognition error: ${error.error}`);
        clearTimeout(timeout);
        if (listening) {
          listening = false;
          
          // Handle different types of errors gracefully
          switch (error.error) {
            case 'network':
              console.log('🎤 Network error - speech recognition service temporarily unavailable');
              const currentResult = finalTranscript.trim() || interimTranscript.trim();
              console.log(`🎤 Network error - returning current result: "${currentResult}"`);
              resolve(currentResult); // Return what we have so far
              break;
            case 'no-speech':
              console.log('🎤 No speech detected');
              resolve(finalTranscript.trim() || interimTranscript.trim());
              break;
            case 'aborted':
              console.log('🎤 Speech recognition aborted');
              resolve(finalTranscript.trim() || interimTranscript.trim());
              break;
            case 'service-not-allowed':
              console.log('🎤 Speech service not allowed - returning current transcript');
              resolve(finalTranscript.trim() || interimTranscript.trim());
              break;
            case 'audio-capture':
              console.error('🎤 Microphone access error:', error.error);
              reject(new Error('Microphone access denied or not available. Please check your microphone permissions.'));
              break;
            case 'not-allowed':
              console.error('🎤 Permission error:', error.error);
              reject(new Error('Microphone permission denied. Please allow microphone access and try again.'));
              break;
            case 'bad-grammar':
            case 'language-not-supported':
              console.error('🎤 Configuration error:', error.error);
              reject(new Error('Speech recognition not supported for this language or configuration.'));
              break;
            default:
              // For unknown errors, log as warning but don't fail completely
              console.warn(`🎤 Speech recognition warning (${error.error}) - returning current transcript`);
              resolve(finalTranscript.trim() || interimTranscript.trim());
              break;
          }
        }
      };

      recognition.onend = () => {
        console.log('🎤 Speech recognition ended');
        clearTimeout(timeout);
        if (listening) {
          listening = false;
          const result = finalTranscript.trim() || interimTranscript.trim();
          console.log(`🎤 Recognition ended - final result: "${result}"`);
          resolve(result);
        }
      };

      recognition.onstart = () => {
        console.log('🎤 Speech recognition started - speak now!');
        finalTranscript = '';
        interimTranscript = '';
      };
      
      recognition.onaudiostart = () => {
        console.log('🎤 Audio capture started.');
      };

      recognition.onaudioend = () => {
        console.log('🎤 Audio capture ended.');
      };

      recognition.onspeechstart = () => {
        console.log('🎤 Speech detected - user is speaking');
      };

      recognition.onspeechend = () => {
        console.log('🎤 Speech ended - processing what was said');
        // Give a moment for results to be processed, then stop
        setTimeout(() => {
          if (listening && recognition) {
            console.log('🎤 Stopping recognition to process results...');
            recognition.stop();
          }
        }, 1000); // Wait 1 second after speech ends
      };

      // Request microphone permission and start immediately
      try {
        console.log('🎤 Starting speech recognition...');
        recognition.start();
      } catch (error) {
        clearTimeout(timeout);
        console.error('Failed to start speech recognition:', error);
        reject(new Error('Failed to start speech recognition. Please check microphone permissions.'));
      }
    });
  }

  public stopListening() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  public stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  public isListeningSupported(): boolean {
    return this.recognition !== null;
  }

  public isSpeakingSupported(): boolean {
    return this.synthesis !== null;
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  public setVoice(voiceName: string) {
    this.config.selectedVoice = voiceName;
  }

  public setConfig(newConfig: Partial<VoiceServiceConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): VoiceServiceConfig {
    return { ...this.config };
  }
}

// Global instance
export const voiceService = new VoiceService();