import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import translations from '../locales/translations';
import '../styles/VoiceAssistant.css';

const VoiceAssistant = () => {
  const { language } = useLanguage();
  const t = translations[language] || translations['en'];

  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);

  const speakResponse = useCallback((text) => {
    if (!window.speechSynthesis) return;

    // Stop current speech
    window.speechSynthesis.cancel();

    // Clean up text for speech (remove markdown asterisks and bullets)
    const cleanText = text.replace(/[*#]/g, '').replace(/•/g, ',');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'hi' ? 'hi-IN' : (language === 'gu' ? 'gu-IN' : 'en-IN'); 
    utterance.rate = 0.9;     // Slightly slower for clarity
    utterance.pitch = 1.0;

    // Attempt to find a Hindi voice specifically
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('HI'));
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, []);

  const processVoiceCommand = useCallback(async (text) => {
    const cleaned = String(text || '').trim();
    if (!cleaned) {
      setError(t.errorNoInput || 'Please say or type a question.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/voice-assistant', { transcript: cleaned });

      if (response.data && response.data.success) {
        const textResponse = response.data.response;
        setAiResponse(textResponse);
        speakResponse(textResponse);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error(err);
      setError((t.errorServerConnect || 'Could not get a response from the AI.') + ' ' + (err.response?.data?.error || err.message));
    } finally {
      setIsLoading(false);
    }
  }, [speakResponse]);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(t.errorNoSpeech || "Your browser does not support Speech Recognition. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'hi' ? 'hi-IN' : (language === 'gu' ? 'gu-IN' : 'en-IN'); 

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setTranscript('');
      setAiResponse('');
    };

    recognition.onresult = (event) => {
      // SpeechRecognition can sometimes return multiple results; take the last one.
      const lastResultIndex = event.results.length - 1;
      const currentTranscript = event.results[lastResultIndex]?.[0]?.transcript || '';
      const cleaned = String(currentTranscript).trim();
      setTranscript(cleaned);

      if (cleaned) {
        processVoiceCommand(cleaned);
      } else {
        setError(t.errorSpeechCapture || 'Could not capture your speech. Please try again.');
        setIsLoading(false);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        setError(t.errorMicPermission || 'Microphone permission denied. Please allow microphone access.');
      } else {
        setError((t.errorMicGeneric || 'Error listening to your voice: ') + event.error);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, [processVoiceCommand]);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      if (recognitionRef.current) {
        // Stop any currently playing audio
        window.speechSynthesis.cancel();
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.error(e);
          setError(t.errorMicStart || "Could not start microphone.");
        }
      }
    }
  };


  return (
    <div className="voice-assistant-container">
      <div className="voice-assistant-header">
        <h2>{t.voiceAssistantTitle}</h2>
        <p>{t.voiceAssistantDesc}</p>
      </div>

      <div className="voice-assistant-main">
        {error && <div className="error-message">{error}</div>}

        <div className={`mic-container ${isListening ? 'listening' : ''} ${isLoading ? 'loading' : ''}`}>
          <button 
            className={`mic-button ${isListening ? 'active' : ''}`}
            onClick={toggleListen}
            disabled={isLoading || !recognitionRef.current}
          >
            <div className="mic-icon">🎙️</div>
          </button>
          <div className="mic-status">
            {isListening ? t.listening : isLoading ? t.thinking : t.tapToSpeak}
          </div>
        </div>

        <div className="chat-display">
          {/* Add a manual text input fallback */}
          <div className="manual-input-container" style={{ display: 'flex', gap: '10px', marginTop: '10px', marginBottom: '20px' }}>
            <input 
               type="text" 
               id="manual-text-input"
               placeholder={t.typeQuestion} 
               style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }}
               onKeyDown={(e) => {
                 if (e.key === 'Enter' && e.target.value.trim()) {
                   const text = e.target.value.trim();
                   setTranscript(text);
                   processVoiceCommand(text);
                   e.target.value = '';
                 }
               }}
            />
            <button 
              onClick={() => {
                const input = document.getElementById('manual-text-input');
                if (input && input.value.trim()) {
                  const text = input.value.trim();
                  setTranscript(text);
                  processVoiceCommand(text);
                  input.value = '';
                }
              }}
              style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#2196f3', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {t.sendButton}
            </button>
          </div>

          {transcript && (
            <div className="message user-message">
              <div className="message-label">{t.youSaid}</div>
              <div className="message-content">{transcript}</div>
            </div>
          )}

          {aiResponse && (
            <div className="message ai-message">
              <div className="message-label">{t.assistantSays}</div>
              <div className="message-content" style={{ whiteSpace: "pre-wrap" }}>
                {aiResponse}
              </div>
              <button 
                 className="replay-button" 
                 onClick={() => speakResponse(aiResponse)}
                 title="Play audio again"
              >
                {t.replayAudio}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
