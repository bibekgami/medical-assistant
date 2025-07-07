// typingIndicator.tsx
import { Bot, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface TypingIndicatorProps {
  isGenerating: boolean;
}

export const TypingIndicator = ({ isGenerating }: TypingIndicatorProps) => {
  return (
    <div className="flex gap-3 justify-start">
      {/* Bot Avatar - Updated gradient for dark theme */}
      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
        <Bot className="w-4 h-4 text-white" />
      </div>
      {/* Card background and text for dark theme */}
      <Card className="max-w-[80%] p-4 bg-zinc-700 border border-zinc-600">
        <div className="flex items-center gap-2">
          {/* Loader icon color for dark theme */}
          <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
          {/* Text color for dark theme */}
          <span className="text-sm text-zinc-300">
            {isGenerating ? 'Analyzing symptoms with AI...' : 'Typing...'}
          </span>
        </div>
      </Card>
    </div>
  );
};
