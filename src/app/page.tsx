'use client';

import Header from "@/components/Header";
import { PasteForm } from "@/components/PasteForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        <Card className="relative border-primary/20 bg-card/80 backdrop-blur-sm transition-all hover:shadow-primary/20 hover:shadow-2xl hover:border-primary/40">
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
