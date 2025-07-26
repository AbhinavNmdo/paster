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

function ViewPageLoader() {
    return (
        <div className="flex flex-col min-h-screen">
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
      <main className="flex-1 w-full max-w-6xl mx-auto mt-8 px-4">
        <CodeView paste={paste} />
      </main>
    </div>
  );
}
