'use client';

import { useFormState, useFormStatus } from 'react-dom';
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
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full md:w-auto text-lg py-6 px-8 transition-all duration-300 ease-in-out hover:shadow-lg"
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
  const [state, formAction] = useFormState(createPaste, initialState);
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
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="content" className="text-lg">Your Text / Code</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Paste anything you want to share..."
          className="min-h-[300px] font-code text-base bg-white shadow-inner"
          required
        />
         {state.errors?.content && (
          <p className="text-sm font-medium text-destructive">{state.errors.content}</p>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-auto space-y-2">
          <Label htmlFor="language" className="text-lg">Language</Label>
          <Select name="language" defaultValue="auto">
            <SelectTrigger id="language" className="w-full md:w-[220px] bg-white shadow-inner">
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
