'use client';

import { useEffect, useState } from 'react';
import { getPaste, isPastePasswordProtected, Paste } from "@/lib/db";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { CodeView } from "@/components/CodeView";
import PasswordPrompt from "./PasswordPrompt";
import { Skeleton } from '@/components/ui/skeleton';

interface ViewPageProps {
  params: {
    id: string;
  };
}

function ViewPageLoader() {
    return (
        <div className="flex flex-col min-h-screen bg-secondary/40">
            <Header />
            <main className="flex-1 w-full max-w-6xl mx-auto mt-8 px-4">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </main>
        </div>
    );
}

export default function ViewPage({ params }: ViewPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isProtected, setIsProtected] = useState<boolean | null>(null);
  const [paste, setPaste] = useState<Paste | null | undefined>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const protectedStatus = await isPastePasswordProtected(params.id);
        setIsProtected(protectedStatus);

        if (!protectedStatus) {
          const fetchedPaste = await getPaste(params.id);
          setPaste(fetchedPaste);
          if (!fetchedPaste) {
             notFound();
          }
        }
      } catch (error) {
        console.error("Failed to fetch paste data", error);
        setPaste(undefined);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  if (isLoading) {
    return <ViewPageLoader />;
  }

  if (isProtected) {
    return <PasswordPrompt id={params.id} />;
  }

  if (!paste) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary/40">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto mt-8 px-4">
        <CodeView paste={paste} />
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        Powered by Firebase and Google AI
      </footer>
    </div>
  );
}
