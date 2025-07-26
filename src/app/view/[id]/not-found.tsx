'use client';

import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMousePosition } from '@/hooks/useMousePosition';
import { FileQuestion } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

export default function NotFound() {
  const cardRef = useRef<HTMLDivElement>(null);
  const { x, y } = useMousePosition(cardRef);

  return (
    <div className="flex flex-col items-center min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center w-full max-w-md p-4">
        <Card 
          ref={cardRef}
          className="glow-card relative text-center w-full transition-all"
          style={{ '--x': `${x}px`, '--y': `${y}px` } as React.CSSProperties}
        >
          <CardHeader>
            <div className="mx-auto bg-destructive/10 rounded-full p-4 w-fit">
              <FileQuestion className="w-12 h-12 text-destructive" />
            </div>
            <CardTitle className="text-3xl font-headline mt-4">Paste Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">The paste you are looking for does not exist or may have expired.</p>
            <Button asChild size="lg">
              <Link href="/">Create a new paste</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
