'use client';

import Header from "@/components/Header";
import { PasteForm } from "@/components/PasteForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useRef } from "react";

export default function Home() {
  const cardRef = useRef<HTMLDivElement>(null);
  const { x, y } = useMousePosition(cardRef);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        <Card 
          ref={cardRef}
          className="glow-card relative border-primary/20 bg-card/80 backdrop-blur-sm transition-all"
          style={{ '--x': `${x}px`, '--y': `${y}px` } as React.CSSProperties}
        >
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Create a New Paste</CardTitle>
            <CardDescription>Share encrypted, auto-expiring text pastes securely.</CardDescription>
          </CardHeader>
          <CardContent>
            <PasteForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
