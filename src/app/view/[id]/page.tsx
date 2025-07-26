'use client';

import { useEffect, useState } from 'react';
import type { Paste } from "@/lib/db";
import Header from "@/components/Header";
import { CodeView } from "@/components/CodeView";
import PasswordPrompt from "./PasswordPrompt";
import { Skeleton } from '@/components/ui/skeleton';
import { getPasteData, isPasteProtected } from './actions';
import NotFound from './not-found';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

function ViewPageLoader() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        <Card className="relative transition-all border-primary/20 bg-card/80 backdrop-blur-sm hover:shadow-primary/20 hover:shadow-2xl hover:border-primary/40">
           <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <Skeleton className="h-7 w-48 mb-2" />
                <Skeleton className="h-5 w-64" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-28 mb-4" />
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


export default function ViewPage() {
  const params = useParams();
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isProtected, setIsProtected] = useState<boolean | null>(null);
  const [paste, setPaste] = useState<Paste | null | undefined>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        const protectedStatus = await isPasteProtected(id);

        if (protectedStatus === null) {
          setNotFound(true);
          setIsLoading(false);
          return;
        }

        setIsProtected(protectedStatus);

        if (!protectedStatus) {
          const fetchedPaste = await getPasteData(id);
          if (!fetchedPaste) {
             setNotFound(true);
          } else {
            setPaste(fetchedPaste);
          }
        }
      } catch (error) {
        console.error("Failed to fetch paste data", error);
        setPaste(undefined);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (isLoading) {
    return <ViewPageLoader />;
  }
  
  if (notFound) {
    return <NotFound />;
  }

  if (isProtected) {
    return <PasswordPrompt id={id} />;
  }

  if (!paste) {
    // This case handles when paste is null/undefined after loading and it's not protected
    return <NotFound />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        <CodeView paste={paste} />
      </main>
    </div>
  );
}
