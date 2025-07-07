// chatInput.tsx
import { useRef } from 'react';
import { Send, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: () => void;
  onImageUpload: (imageData: string) => void;
  isGenerating: boolean;
  isConfigured: boolean;
}

export const ChatInput = ({ 
  inputValue, 
  setInputValue, 
  onSendMessage, 
  onImageUpload, 
  isGenerating, 
  isConfigured 
}: ChatInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      onImageUpload(imageData);
    };

    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    // Updated background and border for dark theme
    <div className="bg-zinc-800/80 backdrop-blur-sm border-t border-zinc-700 p-4 rounded-b-lg shadow-xl mt-4"> {/* Darker, translucent background, shadow */}
      <div className="flex gap-3 items-end">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        
        {/* Image Upload Button - Updated colors for dark theme */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 h-10 w-10 bg-zinc-700 text-zinc-300 border-zinc-600 hover:bg-zinc-600 hover:text-zinc-100" // Dark button style
          disabled={isGenerating || !isConfigured}
        >
          <ImageIcon className="w-4 h-4" />
        </Button>

        <div className="flex-1 relative">
          {/* Input field - Updated colors for dark theme */}
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isConfigured ? "Describe your symptoms or upload an image..." : "Configure API key in settings first..."}
            className="pr-12 min-h-[40px] resize-none bg-zinc-700 text-zinc-100 border-zinc-600 placeholder:text-zinc-400 focus:border-blue-500" // Dark input style
            disabled={isGenerating || !isConfigured}
          />
        </div>

        {/* Send Button - Updated gradient for dark theme */}
        <Button 
          onClick={onSendMessage}
          disabled={!inputValue.trim() || isGenerating || !isConfigured}
          size="icon"
          className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-md" // Darker gradient, shadow
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Disclaimer text - Updated color for dark theme */}
      <p className="text-xs text-zinc-400 mt-2 text-center">
        This AI assistant provides general guidance only. Always consult healthcare professionals for medical advice.
      </p>
    </div>
  );
};
