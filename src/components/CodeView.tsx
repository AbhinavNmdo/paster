'use client';

import type { Paste } from '@/lib/db';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Share, Check, Languages } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface CodeViewProps {
  paste: Paste;
}

export function CodeView({ paste }: CodeViewProps) {
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [isCodeCopied, setIsCodeCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleCopy = (text: string, type: 'link' | 'code') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'link') {
        setIsLinkCopied(true);
        setTimeout(() => setIsLinkCopied(false), 2000);
      } else {
        setIsCodeCopied(true);
        setTimeout(() => setIsCodeCopied(false), 2000);
      }
      toast({
        title: 'Copied to clipboard!',
        description: `The ${type} has been copied successfully.`,
      });
    }).catch(err => {
      console.error('Failed to copy text: ', err);
       toast({
        variant: "destructive",
        title: 'Copy Failed',
        description: 'Could not copy to clipboard.',
      });
    });
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(new Date(paste.createdAt));

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-headline">Shared Paste</CardTitle>
            <CardDescription>Created on {formattedDate}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => handleCopy(currentUrl, 'link')}>
                {isLinkCopied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Share className="mr-2 h-4 w-4" />}
                {isLinkCopied ? 'Link Copied!' : 'Share Link'}
              </Button>
              <Button variant="outline" onClick={() => handleCopy(paste.content, 'code')}>
                {isCodeCopied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                {isCodeCopied ? 'Code Copied!' : 'Copy Code'}
              </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
            <Badge variant="secondary" className="text-lg px-4 py-2 rounded-md">
                <Languages className="mr-2 h-5 w-5"/>
                {paste.language.charAt(0).toUpperCase() + paste.language.slice(1)}
            </Badge>
        </div>
        <div className="rounded-lg overflow-hidden border bg-black/90">
            <SyntaxHighlighter
              language={paste.language}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: '1.5rem',
                borderRadius: '0.5rem',
                backgroundColor: 'transparent'
              }}
              codeTagProps={{
                className: 'font-code text-base',
              }}
              showLineNumbers
            >
              {paste.content}
            </SyntaxHighlighter>
        </div>
      </CardContent>
    </Card>
  );
}
