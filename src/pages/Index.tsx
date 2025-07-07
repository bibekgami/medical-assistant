// index.tsx
import { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { ChatHeader } from '@/components/ChatHeader';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { TypingIndicator } from '@/components/TypingIndicator';
import { aiService } from '@/services/aiService';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  image?: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your medical consultation assistant powered by AI. I can help you understand your symptoms and recommend which medical department you should consult. Describe your symptoms or upload an image if relevant. Remember, I'm here to guide you, but always consult with a healthcare professional for proper diagnosis.",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true); // Hardcoded to true as API key is in AIService

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string, imageData?: string) => {
    setIsGenerating(true);
    setIsTyping(true);

    try {
      const response = await aiService.generateMedicalResponse(userMessage, imageData);
      
      let botResponseContent: string;

      if (typeof response === 'string') {
        botResponseContent = response;
      } else {
        // Tailwind classes for urgency colors - ensure these are visible on a dark background
        const urgencyColors = {
          low: 'text-green-400',    // Lighter green for dark background
          medium: 'text-yellow-400',  // Lighter yellow for dark background
          high: 'text-orange-400',  // Lighter orange for dark background
          emergency: 'text-red-400'   // Lighter red for dark background
        };

        botResponseContent = `**🏥 Recommended Department: ${response.department}**

**📋 Analysis:**
${response.reasoning}

**⚠️ Urgency Level:** <span class="${urgencyColors[response.urgency]}">${response.urgency.toUpperCase()}</span>

**📝 Next Steps:**
${response.nextSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

**⚖️ Important Disclaimer:**
${response.disclaimer}

${response.urgency === 'emergency' ? '🚨 **EMERGENCY**: If this is a medical emergency, please call emergency services immediately!' : ''}

Would you like me to help you with any other symptoms or questions?`;
      }

      const botMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: botResponseContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('AI Response Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setIsTyping(false);
    }
  };

  const handleRegenerate = async (messageId: string) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    let userMessage = '';
    let imageData: string | undefined;
    
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (messages[i].type === 'user') {
        userMessage = messages[i].content;
        imageData = messages[i].image;
        break;
      }
    }

    if (!userMessage) return;

    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    
    await generateResponse(userMessage, imageData);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToProcess = inputValue;
    setInputValue('');

    await generateResponse(messageToProcess);
  };

  const handleImageUpload = async (imageData: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: "I've uploaded an image for analysis.",
      timestamp: new Date(),
      image: imageData,
    };

    setMessages(prev => [...prev, userMessage]);
    await generateResponse("Image uploaded for symptom analysis", imageData);
  };

  return (
    // Main container for the dark theme
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-inter"> {/* Deep dark background */}
      <div className="container mx-auto max-w-4xl h-screen flex flex-col p-4 sm:p-6 lg:p-8"> {/* Responsive padding */}
        
        {/* Chat Header - will need styling updates in ChatHeader.tsx */}
        <ChatHeader 
          isConfigured={isConfigured}
          // No onSettingsClick prop needed now
        />

        {/* Main chat area - Darker, slightly translucent background */}
        <div className="flex-1 bg-zinc-800/60 backdrop-blur-md rounded-b-lg shadow-xl overflow-hidden mt-4"> {/* Rounded bottom, shadow */}
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                  onRegenerate={message.type === 'bot' ? handleRegenerate : undefined}
                />
              ))}

              {isTyping && <TypingIndicator isGenerating={isGenerating} />}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Chat Input - will need styling updates in ChatInput.tsx */}
        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSendMessage={handleSendMessage}
          onImageUpload={handleImageUpload}
          isGenerating={isGenerating}
          isConfigured={isConfigured}
        />
      </div>
    </div>
  );
};

export default Index;
