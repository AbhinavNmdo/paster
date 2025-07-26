'use client';

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createPaste, type FormState } from '@/app/actions';
import { supportedLanguages } from '@/lib/languages';
import { Share2, Loader2, Languages, KeyRound, Timer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { detectLanguage } from '@/ai/flows/detect-language';
import { useDebounce } from '@/hooks/use-debounce';
import { Editor } from './Editor';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      size="lg"
      className="w-full text-base py-5 px-6 transition-all duration-300 ease-in-out hover:shadow-primary/20 hover:scale-105 bg-primary/90 hover:bg-primary"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Sharing...
        </>
      ) : (
        <>
          <Share2 className="mr-2 h-5 w-5" />
          Create & Share
        </>
      )}
    </Button>
  );
}

export function PasteForm() {
  const initialState: FormState = { message: '' };
  const [state, formAction] = useActionState(createPaste, initialState);
  const { toast } = useToast();

  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('auto');
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [isDetecting, startDetecting] = useTransition();

  const debouncedContent = useDebounce(content, 500);

  useEffect(() => {
    if (debouncedContent && language === 'auto') {
      startDetecting(async () => {
        try {
          const contentForDetection = debouncedContent.substring(0, 2000);
          const result = await detectLanguage({ code: contentForDetection });
          setDetectedLanguage(result.language);
        } catch (error) {
          console.error("Language detection failed:", error);
          setDetectedLanguage(null);
        }
      });
    } else {
      setDetectedLanguage(null);
    }
  }, [debouncedContent, language]);

  useEffect(() => {
    if (state.errors?.server) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.errors.server.join(', '),
      });
    } else if (state.errors?.content) {
       toast({
        variant: 'destructive',
        title: 'Error',
        description: state.errors.content.join(', '),
      });
    }
  }, [state, toast]);


  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="content" value={content} />
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-2 gap-2">
          <Select name="language" value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language" className="bg-secondary/50 shadow-inner text-xs h-8 w-[180px]">
                <Languages className="mr-2 h-4 w-4" /> 
                <SelectValue placeholder="Detect automatically" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Detect automatically</SelectItem>
              {supportedLanguages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 flex-shrink-0">
            {(isDetecting || detectedLanguage) && (
                <Badge variant="outline" className="whitespace-nowrap h-8 text-xs">
                {isDetecting ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : null}
                {detectedLanguage ? `Detected: ${detectedLanguage}` : 'Detecting...'}
              </Badge>
            )}
          </div>
        </div>
        <Editor 
          value={content}
          onChange={(value) => setContent(value || '')}
          language={language !== 'auto' ? language : (detectedLanguage?.toLowerCase() ?? 'plaintext')}
        />
         {state.errors?.content && (
          <p className="text-sm font-medium text-destructive">{state.errors.content}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-base font-medium flex items-center">
            <KeyRound className="mr-2 h-5 w-5" /> Password <span className='text-xs text-muted-foreground ml-2'>(Optional)</span>
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Secure your paste"
            className="bg-secondary/50 shadow-inner text-sm py-5 focus:bg-background transition-colors duration-300"
          />
        </div>
      
        <div className="space-y-2">
          <Label htmlFor="expires" className="text-base font-medium flex items-center">
            <Timer className="mr-2 h-5 w-5" /> Expiration
          </Label>
          <Select name="expires" defaultValue="never">
            <SelectTrigger id="expires" className="w-full bg-secondary/50 shadow-inner text-sm py-5">
              <SelectValue placeholder="Set expiration time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never</SelectItem>
              <SelectItem value="10m">10 Minutes</SelectItem>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="1d">1 Day</SelectItem>
              <SelectItem value="1w">1 Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <SubmitButton />
      </div>
       {state.errors?.server && (
        <p className="text-sm font-medium text-destructive text-center md:text-right">{state.errors.server}</p>
      )}
    </form>
  );
}
