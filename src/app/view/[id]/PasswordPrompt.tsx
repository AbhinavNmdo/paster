'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { verifyPassword, PasswordFormState } from '@/app/actions';
import { CodeView } from '@/components/CodeView';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Loader2, LogIn } from 'lucide-react';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import type { Paste } from '@/lib/db';

interface PasswordPromptProps {
  id: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
      Unlock Paste
    </Button>
  );
}

export default function PasswordPrompt({ id }: PasswordPromptProps) {
  const initialState: PasswordFormState = {};
  const [state, formAction] = useActionState(verifyPassword, initialState);
  const [showPaste, setShowPaste] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (state.decryptedContent) {
      setShowPaste(true);
    }
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state, toast]);

  if (showPaste && state.decryptedContent && state.language) {
    const paste: Paste = {
      id,
      content: state.decryptedContent,
      language: state.language,
      createdAt: new Date(), // This is not ideal, but we don't have the original date here.
    };
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
          <CodeView paste={paste} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
       <Header />
      <main className="flex-1 flex items-center justify-center w-full p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl shadow-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                <KeyRound className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Password Protected</CardTitle>
              <CardDescription>
                Please enter the password to view this paste.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-6">
                <input type="hidden" name="id" value={id} />
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="bg-secondary/50"
                    placeholder="Enter password"
                  />
                </div>
                <SubmitButton />
                {state.error && <p className="text-sm text-destructive text-center pt-2">{state.error}</p>}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
