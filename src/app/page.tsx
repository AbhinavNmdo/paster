'use client';

import Header from "@/components/Header";
import { PasteForm } from "@/components/PasteForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        <Card className="relative transition-all border-primary/20 bg-card/80 backdrop-blur-sm hover:shadow-primary/20 hover:shadow-2xl hover:border-primary/40">
           <CardHeader className="text-center pb-4 pt-6">
            <CardTitle className="text-2xl font-headline">Create a New Paste</CardTitle>
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
