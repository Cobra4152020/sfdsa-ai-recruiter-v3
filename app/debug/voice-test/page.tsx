"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Mic, MicOff, Volume2, VolumeX, TestTube } from "lucide-react";
import { voiceService } from "@/lib/voice-service";

export default function VoiceTestPage() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lastResult, setLastResult] = useState("");
  const [error, setError] = useState("");
  const [testResults, setTestResults] = useState<string[]>([]);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const { toast } = useToast();

  useEffect(() => {
    // Check browser support
    setVoiceSupported(voiceService.isListeningSupported());
    setSpeechSupported(voiceService.isSpeakingSupported());
    setAvailableVoices(voiceService.getAvailableVoices());
    
    addTestResult(`Voice Recognition Supported: ${voiceService.isListeningSupported()}`);
    addTestResult(`Text-to-Speech Supported: ${voiceService.isSpeakingSupported()}`);
    addTestResult(`Available Voices: ${voiceService.getAvailableVoices().length}`);
    
    // Log browser info
    addTestResult(`User Agent: ${navigator.userAgent}`);
    addTestResult(`Language: ${navigator.language}`);
  }, []);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testMicrophone = async () => {
    if (!voiceService.isListeningSupported()) {
      setError("Speech recognition not supported in this browser");
      addTestResult("❌ Speech recognition not supported");
      return;
    }

    setIsListening(true);
    setError("");
    setTranscript("");
    
    addTestResult("🎤 Starting microphone test...");
    
    try {
      console.log("🎤 Test: Starting voice input...");
      const result = await voiceService.startListening();
      console.log("🎤 Test: Voice input completed:", result);
      
      setTranscript(result);
      setLastResult(result);
      addTestResult(`✅ Success: "${result}"`);
      
      if (result.trim()) {
        toast({
          title: "Voice Test Successful! 🎤",
          description: `Captured: "${result}"`,
          duration: 4000,
        });
      } else {
        toast({
          title: "No Speech Detected",
          description: "The microphone worked but no speech was captured.",
          variant: "default",
          duration: 3000,
        });
        addTestResult("⚠️ Microphone works but no speech detected");
      }
    } catch (error) {
      console.error("🎤 Test: Voice input failed:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      addTestResult(`❌ Error: ${errorMessage}`);
      
      toast({
        title: "Voice Test Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsListening(false);
    }
  };

  const testSpeech = async () => {
    if (!voiceService.isSpeakingSupported()) {
      setError("Text-to-speech not supported in this browser");
      addTestResult("❌ Text-to-speech not supported");
      return;
    }

    setIsSpeaking(true);
    setError("");
    
    const testText = "Hello! This is a voice test. Can you hear me clearly?";
    addTestResult(`🔊 Testing speech: "${testText}"`);
    
    try {
      await voiceService.speak(testText);
      addTestResult("✅ Speech test completed successfully");
      toast({
        title: "Speech Test Completed",
        description: "Text-to-speech is working correctly",
        duration: 3000,
      });
    } catch (error) {
      console.error("🔊 Speech test failed:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      addTestResult(`❌ Speech error: ${errorMessage}`);
      
      toast({
        title: "Speech Test Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setIsSpeaking(false);
    }
  };

  const checkPermissions = async () => {
    addTestResult("🔍 Checking microphone permissions...");
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      addTestResult("✅ Microphone permission granted");
      stream.getTracks().forEach(track => track.stop()); // Clean up
      
      toast({
        title: "Microphone Permission OK",
        description: "Your browser has microphone access",
        duration: 3000,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addTestResult(`❌ Microphone permission error: ${errorMessage}`);
      
      toast({
        title: "Microphone Permission Issue",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-white/90 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <TestTube className="h-6 w-6" />
              Voice Service Debug Console
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Browser Support Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold mb-2">Browser Support</h3>
                <div className="space-y-2">
                  <Badge variant={voiceSupported ? "default" : "destructive"}>
                    Voice Recognition: {voiceSupported ? "✅ Supported" : "❌ Not Supported"}
                  </Badge>
                  <Badge variant={speechSupported ? "default" : "destructive"}>
                    Text-to-Speech: {speechSupported ? "✅ Supported" : "❌ Not Supported"}
                  </Badge>
                  <Badge variant="outline">
                    Available Voices: {availableVoices.length}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold mb-2">Current Status</h3>
                <div className="space-y-2">
                  <Badge variant={isListening ? "default" : "outline"}>
                    {isListening ? "🎤 Listening..." : "🎤 Ready"}
                  </Badge>
                  <Badge variant={isSpeaking ? "default" : "outline"}>
                    {isSpeaking ? "🔊 Speaking..." : "🔊 Silent"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Test Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={checkPermissions}
                variant="outline"
                className="w-full"
              >
                Check Permissions
              </Button>
              
              <Button 
                onClick={testMicrophone}
                disabled={isListening || !voiceSupported}
                variant={isListening ? "destructive" : "default"}
                className="w-full"
              >
                {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                Test Microphone
              </Button>
              
              <Button 
                onClick={testSpeech}
                disabled={isSpeaking || !speechSupported}
                variant={isSpeaking ? "destructive" : "default"}
                className="w-full"
              >
                {isSpeaking ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
                Test Speech
              </Button>
            </div>

            {/* Current Results */}
            {transcript && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Latest Transcript:</h3>
                <p className="text-green-700">"{transcript}"</p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">Error:</h3>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Test Results Log */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Test Results Log:</h3>
                <Button 
                  onClick={() => {
                    setTestResults([]);
                    setTranscript("");
                    setLastResult("");
                    setError("");
                  }} 
                  variant="outline" 
                  size="sm"
                >
                  Clear Log
                </Button>
              </div>
              
              <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
                {testResults.length === 0 ? (
                  <p className="text-slate-400">No test results yet. Click a test button to begin.</p>
                ) : (
                  testResults.map((result, index) => (
                    <div key={index} className="mb-1">
                      {result}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
              <ol className="list-decimal list-inside text-blue-700 space-y-1">
                <li>First click "Check Permissions" to ensure microphone access</li>
                <li>Click "Test Microphone" and speak clearly when prompted</li>
                <li>Click "Test Speech" to verify audio output works</li>
                <li>Check the log for detailed debugging information</li>
                <li>Make sure you're using Chrome, Edge, or Safari for best compatibility</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 