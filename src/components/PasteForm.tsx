'use client';

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
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
import { Share2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      size="lg"
      className="w-full md:w-auto text-lg py-6 px-8 transition-all duration-300 ease-in-out hover:shadow-primary/20 hover:scale-105"
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
    <form action={formAction} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="content" className="text-lg font-medium">Your Text / Code</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Paste anything you want to share..."
          className="min-h-[350px] font-code text-base bg-secondary/50 shadow-inner focus:bg-background"
          required
        />
         {state.errors?.content && (
          <p className="text-sm font-medium text-destructive">{state.errors.content}</p>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="w-full md:w-auto space-y-2">
          <Label htmlFor="language" className="text-lg font-medium">Language</Label>
          <Select name="language" defaultValue="auto">
            <SelectTrigger id="language" className="w-full md:w-[240px] bg-secondary/50 shadow-inner text-base py-5">
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
        </div>
        <SubmitButton />
      </div>
       {state.errors?.server && (
        <p className="text-sm font-medium text-destructive text-center md:text-right">{state.errors.server}</p>
      )}
    </form>
  );
}
